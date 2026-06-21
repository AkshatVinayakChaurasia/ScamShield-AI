import { GoogleGenerativeAI } from "@google/generative-ai";
import { runRuleBasedCheck } from "./ruleEngine";

export interface ScamAnalysisResult {
  isScam: boolean;
  score: number;
  category: string;
  risk: string;
  reasons: string[];
  explanation: string;
  recommendation: string;
  confidence: number;
}

const EXPLANATIONS: Record<string, string> = {
  Phishing:
    "This content exhibits classic phishing patterns. Scammers use urgent language and impersonation tactics to create panic and pressure victims into acting without thinking critically.",
  "OTP Fraud":
    "A request for your one-time password or PIN is a critical red flag. Legitimate organizations never ask for OTPs via message. Sharing it gives attackers full access to your accounts.",
  "Lottery Scam":
    "Unsolicited prize notifications are a hallmark of advance-fee fraud. There is no legitimate prize — the goal is to extract processing fees or personal data.",
  "Job Scam":
    "This job offer contains hallmarks of employment scams: unrealistic pay, no experience requirements, and requests for upfront registration fees or bank details.",
  "Delivery Scam":
    "Fake delivery notifications pressure victims into paying fraudulent customs or redelivery fees. Real couriers do not request payment via SMS links.",
  Other:
    "This content contains patterns commonly associated with scam communications. Exercise caution and verify through official channels before taking any action.",
};

const RECOMMENDATIONS: Record<string, string> = {
  High: "Do not respond, click any links, or share any personal information. Block and report the sender.",
  Medium: "Proceed with caution. Verify the sender's identity through official channels before responding.",
  Low: "No immediate action needed, but stay alert to follow-up messages from this sender.",
};

export function runMockAnalysis(text: string): ScamAnalysisResult {
  const rule = runRuleBasedCheck(text);
  const score = rule.score;
  const category = rule.category || "Other";
  const risk = score >= 70 ? "High" : score >= 35 ? "Medium" : "Low";

  const explanation = EXPLANATIONS[category] || EXPLANATIONS["Other"];
  const recommendation = RECOMMENDATIONS[risk];
  const confidence = Math.min(0.95, 0.45 + (score / 100) * 0.5);

  return {
    isScam: score >= 40,
    score,
    category,
    risk,
    reasons: rule.reasons.length > 0 ? rule.reasons : ["No strong scam indicators detected"],
    explanation,
    recommendation,
    confidence: Number(confidence.toFixed(2)),
  };
}

const GEMINI_SYSTEM_PROMPT = `You are a scam detection AI. Analyze the provided text and return ONLY a valid JSON object with these exact keys:
{
  "isScam": boolean,
  "score": integer between 0 and 100,
  "category": one of ["Phishing", "OTP Fraud", "Lottery Scam", "Job Scam", "Delivery Scam", "Investment Scam", "Other"],
  "risk": one of ["Low", "Medium", "High"],
  "reasons": array of 2-5 short strings explaining the scam indicators found,
  "explanation": a 1-2 sentence explanation for the user,
  "recommendation": a 1-sentence action recommendation for the user,
  "confidence": float between 0.0 and 1.0
}
Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

export async function analyzeTextWithGemini(text: string): Promise<ScamAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Falling back to mock.");
    return runMockAnalysis(text);
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: GEMINI_SYSTEM_PROMPT,
  });

  try {
    const result = await model.generateContent(`Analyze this content for scam indicators:\n\n${text.substring(0, 4000)}`);
    let raw = result.response.text().trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }
    
    const parsed = JSON.parse(raw);
    
    // Ensure defaults
    parsed.explanation = parsed.explanation || "";
    parsed.recommendation = parsed.recommendation || "";
    parsed.confidence = parsed.confidence ?? 0.5;
    
    return parsed as ScamAnalysisResult;
  } catch (err) {
    console.error("Gemini provider failed:", err);
    console.warn("Falling back to rule-based mock analysis.");
    return runMockAnalysis(text);
  }
}

export async function analyzeImageWithGemini(mimeType: string, base64Image: string): Promise<{ text: string, analysis: ScamAnalysisResult }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for image analysis/OCR.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-1.5-flash for vision capabilities
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `First, extract all the text you can read from this image exactly as written. 
Then, analyze the content for scam indicators. 

Return ONLY a JSON object with this exact structure (no markdown fences, no other text):
{
  "extractedText": "the exact text you extracted",
  "scan_result": {
    "isScam": boolean,
    "score": integer between 0 and 100,
    "category": one of ["Phishing", "OTP Fraud", "Lottery Scam", "Job Scam", "Delivery Scam", "Investment Scam", "Other"],
    "risk": one of ["Low", "Medium", "High"],
    "reasons": array of 2-5 short strings explaining the scam indicators found,
    "explanation": a 1-2 sentence explanation for the user,
    "recommendation": a 1-sentence action recommendation for the user,
    "confidence": float between 0.0 and 1.0
  }
}`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
    ]);

    let raw = result.response.text().trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }
    
    return JSON.parse(raw);
  } catch (err: any) {
    console.error("Gemini Vision failed:", err);
    throw new Error("Could not process image. " + err.message);
  }
}

export async function analyzeContent(text: string): Promise<ScamAnalysisResult> {
  const provider = process.env.AI_PROVIDER?.toLowerCase() === "gemini" ? "gemini" : "mock";
  if (provider === "gemini") {
    return analyzeTextWithGemini(text);
  }
  return runMockAnalysis(text);
}
