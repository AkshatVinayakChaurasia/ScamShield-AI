"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Link2, MessageSquare, ImageUp, FileUp, Mail,
  Upload, Loader2, AlertTriangle, ShieldCheck, ShieldAlert,
  ShieldQuestion, ArrowRight, X, Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";

type TabType = "TEXT" | "URL" | "CHAT" | "SCREENSHOT" | "DOCUMENT" | "EMAIL";

const TABS: { type: TabType; label: string; icon: React.ElementType; placeholder: string }[] = [
  { type: "TEXT", label: "Text", icon: FileText, placeholder: "Paste a suspicious message, SMS, or text here..." },
  { type: "URL", label: "URL", icon: Link2, placeholder: "https://example.com/suspicious-link" },
  { type: "CHAT", label: "Chat", icon: MessageSquare, placeholder: "Paste a WhatsApp / DM conversation here..." },
  { type: "EMAIL", label: "Email", icon: Mail, placeholder: "Paste the full email content here..." },
  { type: "SCREENSHOT", label: "Screenshot", icon: ImageUp, placeholder: "" },
  { type: "DOCUMENT", label: "Document", icon: FileUp, placeholder: "" },
];

const FILE_TABS = new Set<TabType>(["SCREENSHOT", "DOCUMENT"]);

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<TabType>("TEXT");
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFileTab = FILE_TABS.has(activeTab);

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setResult(null);
    setError("");
    setInputText("");
    setFile(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleScan = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      let response: any;
      if (activeTab === "URL") {
        response = await api.scanUrl(inputText.trim());
      } else if (isFileTab && file) {
        response = await api.scanFile(activeTab, file);
      } else {
        response = await api.scanText(activeTab, inputText.trim());
      }
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canScan = isFileTab ? !!file : inputText.trim().length > 0;
  const tab = TABS.find((t) => t.type === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-paper">Scan Anything</h1>
        <p className="mt-1 text-text-muted">
          Paste text, check a link, or upload a file. Our AI will analyze it for scam indicators.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => handleTabSwitch(type)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === type
                ? "bg-signal-dim text-signal shadow-sm"
                : "text-text-muted hover:bg-ink-hover hover:text-paper"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="rounded-2xl border border-wire bg-ink-raised p-1">
        <div className="scan-lines rounded-xl">
          {isFileTab ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-wire p-16 transition-colors hover:border-signal/40"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-signal-dim">
                <Upload className="h-8 w-8 text-signal" />
              </div>
              {file ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-paper">{file.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="rounded-full p-1 text-text-dim hover:bg-wire hover:text-paper"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-paper">
                    Drop a {activeTab === "SCREENSHOT" ? "screenshot" : "document"} here, or click to browse
                  </p>
                  <p className="text-xs text-text-dim">
                    {activeTab === "SCREENSHOT"
                      ? "Supports PNG, JPG, WEBP (max 10MB)"
                      : "Supports PDF, TXT, DOC files (max 10MB)"}
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={activeTab === "SCREENSHOT" ? "image/png,image/jpeg,image/webp" : ".pdf,.txt,.doc,.docx"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          ) : (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={tab.placeholder}
              rows={8}
              className="w-full resize-none rounded-xl bg-transparent px-5 py-4 text-sm text-paper outline-none placeholder:text-text-dim"
            />
          )}
        </div>
      </div>

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={!canScan || loading}
        className="flex items-center gap-2.5 rounded-xl bg-signal px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Scan for threats
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl bg-alarm-dim p-4 text-sm text-alarm"
        >
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result?.scan_result && <ScanResultCard result={result.scan_result} extractedText={result.extractedText} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Scan Result Card ─────────────────────────────────────────────────────────
function ScanResultCard({ result, extractedText }: { result: any; extractedText?: string }) {
  const score = result.risk_score ?? 0;
  const risk = result.risk_level ?? "Low";
  const category = result.category ?? "Other";
  const confidence = Math.round((result.confidence ?? 0) * 100);
  const reasons: string[] = result.reasons ?? [];
  const explanation = result.explanation ?? "";
  const recommendation = result.recommendation ?? "";

  const verdict = result.isScam
    ? { icon: ShieldAlert, label: "Likely a scam", color: "text-alarm", bg: "bg-alarm-dim" }
    : risk === "Medium"
      ? { icon: ShieldQuestion, label: "Proceed with caution", color: "text-amber", bg: "bg-amber-dim" }
      : { icon: ShieldCheck, label: "Looks safe", color: "text-signal", bg: "bg-signal-dim" };

  const VIcon = verdict.icon;
  const riskColor = risk === "High" ? "#ff5c5c" : risk === "Medium" ? "#f5a623" : "#3ddc97";

  // SVG gauge
  const radius = 80;
  const circumference = Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="rounded-2xl border border-wire bg-ink-raised p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 200 110" className="h-32 w-52">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#27344a" strokeWidth="14" strokeLinecap="round" />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={riskColor}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circumference}`}
              className="gauge-animate"
            />
            <text x="100" y="88" textAnchor="middle" className="font-mono" style={{ fontSize: "32px", fontWeight: 600, fill: "#f6f5f1" }}>
              {Math.round(score)}
            </text>
            <text x="100" y="104" textAnchor="middle" className="font-mono" style={{ fontSize: "11px", fill: "#93a1b8" }}>
              / 100
            </text>
          </svg>
          <p className={`mt-1 font-mono text-sm font-medium uppercase tracking-wide ${verdict.color}`}>
            {risk} risk
          </p>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <div className={`inline-flex items-center gap-2 font-display text-xl font-bold ${verdict.color}`}>
            <VIcon className="h-5 w-5" strokeWidth={2} />
            {verdict.label}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-wire px-3 py-1 font-mono text-xs text-text-muted">
              Category: <span className="text-paper">{category}</span>
            </span>
            <span className="rounded-full border border-wire px-3 py-1 font-mono text-xs text-text-muted">
              Confidence: <span className="text-paper">{confidence}%</span>
            </span>
          </div>

          {explanation && <p className="text-sm leading-relaxed text-text-muted">{explanation}</p>}

          {reasons.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">Why we flagged this</p>
              <ul className="mt-2 space-y-1.5">
                {reasons.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-paper">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendation && (
            <div className={`rounded-xl ${verdict.bg} p-4`}>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted mb-1">Recommendation</p>
              <p className={`text-sm font-medium ${verdict.color}`}>{recommendation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Extracted text (for screenshots / documents) */}
      {extractedText && (
        <details className="mt-6 group">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-dim hover:text-text-muted">
            Extracted Text
          </summary>
          <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl bg-ink p-4 font-mono text-xs text-text-muted">
            {extractedText}
          </pre>
        </details>
      )}
    </motion.div>
  );
}
