import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { analyzeContent, analyzeImageWithGemini } from "@/lib/ai/llmProvider";
import { analyzeUrlHeuristics } from "@/lib/ai/urlAnalyzer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { extractTextFromPdf } from "@/lib/pdfService";

export const maxDuration = 30; // Vercel timeout max

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error) {
    return NextResponse.json({ error }, { status: 401 });
  }

  try {
    let scan_type = "TEXT";
    let input_text = "";
    let extractedText = "";
    let analysisResult: any = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      scan_type = formData.get("scan_type") as string || "DOCUMENT";

      if (!file) {
        return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10MB)." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (scan_type === "SCREENSHOT" || file.type.startsWith("image/")) {
        // Use Gemini Vision API directly for OCR + Analysis
        const base64Data = buffer.toString("base64");
        const res = await analyzeImageWithGemini(file.type || "image/png", base64Data);
        extractedText = res.extractedText || "(No text found)";
        analysisResult = res.scan_result;
        input_text = extractedText;
      } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        extractedText = await extractTextFromPdf(buffer);
        input_text = extractedText;
        analysisResult = await analyzeContent(input_text);
      } else {
        // Assume text file
        extractedText = buffer.toString("utf-8");
        input_text = extractedText;
        analysisResult = await analyzeContent(input_text);
      }
    } else {
      const body = await req.json();
      scan_type = body.scan_type || "TEXT";
      input_text = body.text || body.url || "";

      if (!input_text || typeof input_text !== "string") {
        return NextResponse.json({ error: "Input text or URL is required." }, { status: 400 });
      }

      if (scan_type === "URL") {
        analysisResult = analyzeUrlHeuristics(input_text);
      } else {
        analysisResult = await analyzeContent(input_text);
      }
    }

    if (!analysisResult) {
      throw new Error("Analysis failed to produce a valid result.");
    }

    let historyId = null;
    if (supabaseAdmin && user?.id !== "local-dev-user") {
      const { data, error: dbError } = await supabaseAdmin
        .from("scans")
        .insert({
          user_id: user.id,
          scan_type,
          input_text: scan_type === "URL" ? input_text : input_text.substring(0, 1000), // don't store full long text
          is_scam: analysisResult.isScam,
          risk_score: analysisResult.score,
          risk_level: analysisResult.risk,
          category: analysisResult.category,
          confidence: analysisResult.confidence,
          reasons: analysisResult.reasons,
          explanation: analysisResult.explanation,
          recommendation: analysisResult.recommendation,
        })
        .select("id")
        .single();

      if (dbError) {
        console.error("Failed to save scan to history:", dbError);
      } else {
        historyId = data.id;
      }
    }

    return NextResponse.json({
      success: true,
      history_id: historyId,
      scan_type,
      scan_result: analysisResult,
      extractedText: extractedText || undefined,
    });
  } catch (err: any) {
    console.error("Universal scan error:", err);
    return NextResponse.json(
      { error: err.message || "Scan failed unexpectedly. Please try again." },
      { status: 500 }
    );
  }
}
