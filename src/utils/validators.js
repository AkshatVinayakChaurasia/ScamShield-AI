/**
 * Shared validators used across ScamShield AI pages.
 * Pure functions, no external dependencies — keep this file dependency-free
 * so it can be safely imported anywhere (client or server components).
 */

/**
 * Validates pasted text for scam analysis.
 * @param {string} text
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateScamText(text) {
  if (!text || typeof text !== "string") {
    return { valid: false, error: "Please enter some text to analyze." };
  }

  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Please enter some text to analyze." };
  }

  if (trimmed.length < 10) {
    return {
      valid: false,
      error: "Text is too short to analyze. Paste the full message.",
    };
  }

  if (trimmed.length > 8000) {
    return {
      valid: false,
      error: "Text is too long. Please limit to 8000 characters.",
    };
  }

  return { valid: true };
}

/**
 * Validates a URL string for scam/phishing analysis.
 * Checks basic structure only — deeper heuristic checks happen server-side.
 * @param {string} url
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateScamUrl(url) {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "Please enter a URL to analyze." };
  }

  const trimmed = url.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Please enter a URL to analyze." };
  }

  // Allow URLs without a protocol (e.g. "example.com") by prepending https://
  // when checking validity, but preserve the user's original input for display.
  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    new URL(candidate);
  } catch {
    return { valid: false, error: "That doesn't look like a valid URL." };
  }

  return { valid: true };
}

/**
 * Normalizes a URL by ensuring it has a protocol prefix.
 * Use this before sending to the backend so analysis is consistent.
 * @param {string} url
 * @returns {string}
 */
export function normalizeUrl(url) {
  const trimmed = url.trim();
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
}

/**
 * Validates an uploaded screenshot file before sending for OCR analysis.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateScreenshotFile(file) {
  if (!file) {
    return { valid: false, error: "Please select an image to upload." };
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only PNG, JPG, or WEBP images are supported.",
    };
  }

  const maxSizeBytes = 8 * 1024 * 1024; // 8MB
  if (file.size > maxSizeBytes) {
    return { valid: false, error: "Image must be smaller than 8MB." };
  }

  return { valid: true };
}
