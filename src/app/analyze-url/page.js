"use client";

import { useState } from "react";
import { Loader2, ScanSearch, Link2 } from "lucide-react";
import { analyzeUrl, ApiError } from "@/services/api";
import { validateScamUrl, normalizeUrl } from "@/utils/validators";
import ResultCard from "@/components/ResultCard";

export default function AnalyzeUrlPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    const { valid, error: validationError } = validateScamUrl(url);
    if (!valid) {
      setError(validationError);
      setResult(null);
      return;
    }

    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      const data = await analyzeUrl(normalizeUrl(url));
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
    if (e.key === "Enter") {
      e.preventDefault();
      handleAnalyze();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        URL scam detection
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
        Analyze a URL
      </h1>
      <p className="mt-3 max-w-xl text-text-muted">
        Paste a link before you click it. We&apos;ll check the domain for
        brand impersonation, suspicious top-level domains, URL shorteners,
        and other phishing patterns.
      </p>

      <div className="mt-8">
        <label htmlFor="scam-url-input" className="sr-only">
          URL to analyze
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-wire bg-ink-raised px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-signal">
          <Link2 className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            id="scam-url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="example.com/suspicious-link"
            maxLength={2048}
            disabled={isLoading}
            className="w-full bg-transparent py-3 font-mono text-sm text-paper placeholder:text-text-muted/70 focus:outline-none disabled:opacity-60"
          />
        </div>

        {error && <p className="mt-2 text-sm text-alarm">{error}</p>}

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
              Analyze URL
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
