/**
 * Centralized API client for ScamShield AI.
 * All frontend pages should call functions from this file instead of
 * using fetch() directly — keeps backend URL, headers, and error
 * handling consistent in one place.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

/**
 * Custom error class so calling code can distinguish API errors
 * (with a status code) from network/parsing failures.
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Internal helper: performs a fetch call, parses JSON, and throws
 * a normalized ApiError on failure so every caller handles errors the same way.
 */
async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (err) {
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      0
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Response had no JSON body — fine for some success responses,
    // but if the request failed we still need to throw below.
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data;
}

/**
 * Analyze pasted text (SMS, email, WhatsApp, job offer, etc.) for scam patterns.
 * @param {string} text
 * @returns {Promise<{isScam: boolean, score: number, category: string, risk: string, reasons: string[]}>}
 */
export async function analyzeText(text) {
  return request("/analyze-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

/**
 * Analyze a URL for phishing / scam indicators.
 * @param {string} url
 * @returns {Promise<{isScam: boolean, score: number, category: string, risk: string, reasons: string[]}>}
 */
export async function analyzeUrl(url) {
  return request("/analyze-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

/**
 * Upload a screenshot for OCR text extraction + scam analysis.
 * @param {File} file
 * @returns {Promise<{extractedText: string, analysis: object}>}
 */
export async function analyzeScreenshot(file) {
  const formData = new FormData();
  formData.append("image", file);

  return request("/analyze-screenshot", {
    method: "POST",
    body: formData,
    // NOTE: do not set Content-Type manually for multipart/form-data —
    // the browser sets the correct boundary header automatically.
  });
}

/**
 * Fetch community scam report stats (categories, counts, last seen).
 * @returns {Promise<{reports: Array<{category: string, count: number, lastSeen: string}>}>}
 */
export async function getReports() {
  return request("/reports", { method: "GET" });
}
