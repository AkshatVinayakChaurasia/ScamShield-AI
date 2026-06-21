export const KEYWORD_CATEGORIES: Record<string, { keywords: string[]; points: number; reason: string }> = {
  urgency: {
    keywords: [
      "urgent",
      "immediately",
      "act now",
      "limited offer",
      "expires today",
      "final notice",
      "last chance",
    ],
    points: 15,
    reason: "Urgency tactics detected",
  },
  threats_or_account_action: {
    keywords: [
      "account suspended",
      "account blocked",
      "bank blocked",
      "account locked",
      "will be deactivated",
      "account suspension",
      "legal action",
    ],
    points: 20,
    reason: "Threatening or account-suspension language detected",
  },
  credential_request: {
    keywords: [
      "otp",
      "one time password",
      "verify now",
      "verify your account",
      "confirm your password",
      "enter your pin",
      "share your otp",
    ],
    points: 25,
    reason: "Suspicious request for OTP, password, or PIN",
  },
  reward_or_prize: {
    keywords: [
      "claim prize",
      "claim your prize",
      "you have won",
      "you've won",
      "lottery",
      "congratulations",
      "free gift",
      "cash reward",
    ],
    points: 30,
    reason: "Suspicious reward or prize claim detected",
  },
  payment_request: {
    keywords: [
      "click here",
      "pay now",
      "processing fee",
      "send payment",
      "wire transfer",
      "gift card",
      "advance fee",
      "pay a",
      "small fee",
    ],
    points: 25,
    reason: "Suspicious payment or action request detected",
  },
  authority_impersonation: {
    keywords: [
      "income tax department",
      "this is the police",
      "courier department",
      "customs department",
      "from the bank",
      "official notice",
    ],
    points: 15,
    reason: "Possible impersonation of an authority or institution",
  },
  delivery_scam: {
    keywords: [
      "redelivery fee",
      "delivery failed",
      "package delivery failed",
      "package will be returned",
      "shipment on hold",
      "customs fee",
      "update your delivery address",
      "missed delivery",
    ],
    points: 25,
    reason: "Suspicious delivery or shipping fee request detected",
  },
  job_scam: {
    keywords: [
      "work from home job",
      "no experience needed",
      "no experience required",
      "registration fee",
      "send your bank details",
      "earn per week",
      "per week",
      "easy money",
      "part time job offer",
    ],
    points: 25,
    reason: "Suspicious job offer pattern detected (unrealistic pay, upfront fee, or unsolicited offer)",
  },
};

const CATEGORY_HINTS: Record<string, string> = {
  credential_request: "OTP Fraud",
  reward_or_prize: "Lottery Scam",
  payment_request: "Delivery Scam",
  threats_or_account_action: "Phishing",
  authority_impersonation: "Phishing",
  urgency: "Phishing",
  delivery_scam: "Delivery Scam",
  job_scam: "Job Scam",
};

export function runRuleBasedCheck(text: string) {
  if (!text || typeof text !== "string") {
    return { score: 0, category: "Other", reasons: [], matched_categories: [] };
  }

  const normalized = text.toLowerCase();
  let score = 0;
  const reasons: string[] = [];
  const matched_categories: string[] = [];

  for (const [categoryName, config] of Object.entries(KEYWORD_CATEGORIES)) {
    for (const keyword of config.keywords) {
      if (normalized.includes(keyword)) {
        score += config.points;
        reasons.push(config.reason);
        matched_categories.push(categoryName);
        break;
      }
    }
  }

  const exclamationMatches = text.match(/!/g);
  if (exclamationMatches && exclamationMatches.length >= 3) {
    score += 5;
    reasons.push("Excessive use of exclamation marks");
  }

  const capsWords = text.match(/\b[A-Z]{4,}\b/g);
  if (capsWords && capsWords.length >= 2) {
    score += 5;
    reasons.push("Excessive use of capital letters");
  }

  if (matched_categories.includes("reward_or_prize") && matched_categories.includes("payment_request")) {
    score += 15;
    reasons.push("Classic advance-fee scam pattern: prize claim combined with a payment request");
  }

  if (
    matched_categories.includes("job_scam") &&
    (matched_categories.includes("payment_request") || matched_categories.includes("credential_request"))
  ) {
    score += 15;
    reasons.push("Job offer combined with a request for money or personal/bank details");
  }

  score = Math.min(score, 100);

  let category = "Other";
  if (matched_categories.length > 0) {
    const best = matched_categories.reduce((a, b) =>
      KEYWORD_CATEGORIES[a].points > KEYWORD_CATEGORIES[b].points ? a : b
    );
    category = CATEGORY_HINTS[best] || "Other";
  }

  return {
    score,
    category,
    reasons,
    matched_categories,
  };
}
