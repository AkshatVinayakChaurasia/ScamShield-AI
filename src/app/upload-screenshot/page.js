"use client";

import { useState } from "react";
import { Loader2, ScanSearch } from "lucide-react";
import { analyzeScreenshot, ApiError } from "@/services/api";
import UploadBox from "@/components/UploadBox";
import ResultCard from "@/components/ResultCard";

export default function UploadScreenshotPage() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!file) {
      setError("Please select a screenshot to analyze.");
      return;
    }

    setError("");
    setResult(null);
    setExtractedText("");
    setIsLoading(true);

    try {
      const data = await analyzeScreenshot(file);
      setExtractedText(data.extractedText || "");
      if (data.analysis) {
        setResult(data.analysis);
      } else if (data.error) {
        // Text was extracted but analysis failed — still show the text.
        setError(data.error);
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileSelected(selectedFile) {
    setFile(selectedFile);
    setResult(null);
    setExtractedText("");
    setError("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        Screenshot scam detection
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
        Upload a screenshot
      </h1>
      <p className="mt-3 max-w-xl text-text-muted">
        Got a suspicious message as a screenshot instead of plain text?
        Upload it here — we&apos;ll extract the text with OCR and run the
        same scam analysis.
      </p>

      <div className="mt-8">
        <UploadBox onFileSelected={handleFileSelected} />

        {error && <p className="mt-3 text-sm text-alarm">{error}</p>}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isLoading || !file}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Extracting text and analyzing...
            </>
          ) : (
            <>
              <ScanSearch className="h-4 w-4" />
              Analyze screenshot
            </>
          )}
        </button>
      </div>

      {extractedText && (
        <div className="mt-10 rounded-lg border border-wire bg-ink-raised p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Extracted text
          </p>
          <p className="mt-2 whitespace-pre-wrap font-mono text-sm text-paper">
            {extractedText}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}
