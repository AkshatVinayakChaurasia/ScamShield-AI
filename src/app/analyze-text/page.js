"use client";

import { useState } from "react";
import { Loader2, ScanSearch } from "lucide-react";
import { analyzeText, ApiError } from "@/services/api";
import { validateScamText } from "@/utils/validators";
import ResultCard from "@/components/ResultCard";

const PLACEHOLDER_TEXT = `Paste the message here — SMS, email, WhatsApp message, or job offer.

Example: "Congratulations! You have won a lottery prize. Click here and pay a small processing fee to claim your prize now!"`;

export default function AnalyzeTextPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    const { valid, error: validationError } = validateScamText(text);
    if (!valid) {
      setError(validationError);
      setResult(null);
      return;
    }

    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const data = await analyzeText(text.trim());
      setResult(data);
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

  function handleKeyDown(e) {
    // Cmd/Ctrl + Enter submits, mirroring common chat/editor conventions.
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleAnalyze();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        Text scam detection
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
        Analyze a message
      </h1>
      <p className="mt-3 max-w-xl text-text-muted">
        Paste any SMS, email, WhatsApp message, or job offer below. We&apos;ll
        check it for urgency tactics, OTP requests, fake rewards, and other
        scam patterns.
      </p>

      <div className="mt-8">
        <label htmlFor="scam-text-input" className="sr-only">
          Message to analyze
        </label>
        <textarea
          id="scam-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER_TEXT}
          rows={10}
          maxLength={8000}
          disabled={isLoading}
          className="w-full resize-y rounded-lg border border-wire bg-ink-raised p-4 text-sm leading-relaxed text-paper placeholder:text-text-muted/70 focus:outline-2 focus:outline-offset-2 focus:outline-signal disabled:opacity-60"
        />

        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-xs text-text-muted">
            {text.length} / 8000
          </span>
          {error && <span className="text-sm text-alarm">{error}</span>}
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ScanSearch className="h-4 w-4" />
              Analyze text
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-10">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}
