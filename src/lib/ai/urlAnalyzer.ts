export const KNOWN_SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
  "buff.ly", "rebrand.ly", "cutt.ly", "shorturl.at", "tiny.cc",
]);

export const SUSPICIOUS_TLDS = new Set([
  ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".club",
  ".work", ".click", ".loan", ".win", ".bid",
]);

export const IMPERSONATED_BRANDS: Record<string, string[]> = {
  paypal: ["paypal.com"],
  amazon: ["amazon.com", "amazon.in", "amazon.co.uk"],
  google: ["google.com"],
  microsoft: ["microsoft.com", "live.com", "outlook.com", "microsoftonline.com", "office.com"],
  apple: ["apple.com", "icloud.com"],
  netflix: ["netflix.com"],
  facebook: ["facebook.com", "fb.com"],
  instagram: ["instagram.com"],
  whatsapp: ["whatsapp.com"],
  bank: [], 
  irs: ["irs.gov"],
  dhl: ["dhl.com"],
  fedex: ["fedex.com"],
  ups: ["ups.com"],
};

function normalizeUrl(url: string): string {
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url)) {
    return `https://${url}`;
  }
  return url;
}

function emptyResult() {
  return {
    isScam: false,
    score: 0,
    category: "Other",
    risk: "Low",
    reasons: ["Could not extract a valid domain from the input"],
    source: "url_heuristics",
  };
}

export function analyzeUrlHeuristics(url: string) {
  if (!url || typeof url !== "string") return emptyResult();

  const normalized = normalizeUrl(url.trim());
  let parsed: URL;

  try {
    parsed = new URL(normalized);
  } catch (err) {
    return {
      isScam: true,
      score: 60,
      category: "Other",
      risk: "Medium",
      reasons: ["URL could not be parsed — malformed or suspicious structure"],
      source: "url_heuristics",
    };
  }

  const host = parsed.hostname.toLowerCase();
  const fullUrlLower = normalized.toLowerCase();

  if (!host) return emptyResult();

  let score = 0;
  const reasons: string[] = [];
  let category = "Other";

  if (KNOWN_SHORTENERS.has(host)) {
    score += 20;
    reasons.push("Uses a URL-shortening service, which can hide the real destination");
    category = "Phishing";
  }

  for (const tld of SUSPICIOUS_TLDS) {
    if (host.endsWith(tld)) {
      score += 20;
      reasons.push(`Uses an uncommon top-level domain (${tld}) often associated with disposable or low-cost domains`);
      category = "Phishing";
      break;
    }
  }

  for (const [brand, realDomains] of Object.entries(IMPERSONATED_BRANDS)) {
    if (realDomains.length === 0) continue;
    if (fullUrlLower.includes(brand)) {
      const isReal = realDomains.some((d) => host === d || host.endsWith(`.${d}`));
      if (!isReal) {
        score += 30;
        reasons.push(`Mentions '${brand}' but the domain does not match ${brand}'s official site`);
        category = "Phishing";
        break;
      }
    }
  }

  const subdomainCount = (host.match(/\./g) || []).length;
  const hyphenCount = (host.match(/-/g) || []).length;
  const digitCount = (host.match(/\d/g) || []).length;

  if (hyphenCount >= 3) {
    score += 15;
    reasons.push("Domain contains an unusually high number of hyphens");
  }
  if (digitCount >= 4) {
    score += 10;
    reasons.push("Domain contains an unusually high number of digits");
  }
  if (subdomainCount >= 4) {
    score += 10;
    reasons.push("Domain has an unusually deep subdomain structure");
  }

  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
    score += 30;
    reasons.push("URL uses a raw IP address instead of a domain name");
    category = "Phishing";
  }

  if (normalized.includes("@")) {
    score += 25;
    reasons.push("URL contains an '@' symbol, a known technique to disguise the real destination");
    category = "Phishing";
  }

  const credentialKeywords = ["login", "verify", "secure", "update-account", "confirm-identity", "signin"];
  const matchedKeywords = credentialKeywords.filter((kw) => fullUrlLower.includes(kw));
  if (matchedKeywords.length >= 2) {
    score += 15;
    reasons.push("URL path contains multiple credential-harvesting keywords");
  }

  score = Math.min(score, 100);

  if (reasons.length === 0) {
    reasons.push("No strong phishing indicators detected in this URL's structure");
  }

  const risk = score >= 70 ? "High" : score >= 35 ? "Medium" : "Low";

  return {
    isScam: score >= 40,
    score,
    category: score > 0 ? category : "Other",
    risk,
    reasons,
    source: "url_heuristics",
  };
}
