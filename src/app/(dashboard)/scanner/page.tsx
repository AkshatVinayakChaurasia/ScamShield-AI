"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Link2, MessageSquare, ImageUp, FileUp, Mail,
  Upload, Loader2, AlertTriangle, ShieldCheck, ShieldAlert,
  ShieldQuestion, Sparkles, X, ChevronDown, CheckCircle2,
  Shield, ScanSearch,
} from "lucide-react";
import { api } from "@/lib/api";

type TabType = "TEXT" | "URL" | "CHAT" | "SCREENSHOT" | "DOCUMENT" | "EMAIL";

const TABS: { type: TabType; label: string; icon: React.ElementType; placeholder: string }[] = [
  { type: "TEXT",       label: "Text",       icon: FileText,       placeholder: "Paste a suspicious message, SMS, or text here..." },
  { type: "URL",        label: "URL",         icon: Link2,          placeholder: "https://suspicious-link.com/claim-your-prize" },
  { type: "CHAT",       label: "Chat",        icon: MessageSquare,  placeholder: "Paste a WhatsApp or DM conversation here..." },
  { type: "EMAIL",      label: "Email",       icon: Mail,           placeholder: "Paste the full email content including sender details..." },
  { type: "SCREENSHOT", label: "Screenshot",  icon: ImageUp,        placeholder: "" },
  { type: "DOCUMENT",   label: "Document",    icon: FileUp,         placeholder: "" },
];

const FILE_TABS = new Set<TabType>(["SCREENSHOT", "DOCUMENT"]);

/* -- Animated Risk Gauge ---------------------------------------------------- */
function RiskGauge({ score, risk }: { score: number; risk: string }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const end = Math.round(Math.max(0, Math.min(100, score)));
    const dur = 900;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplayScore(Math.round(end * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const color   = risk === "High" ? "#EF4444" : risk === "Medium" ? "#F59E0B" : "#10B981";
  const glow    = risk === "High" ? "rgba(239,68,68,0.4)" : risk === "Medium" ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.4)";
  const bgColor = risk === "High" ? "rgba(239,68,68,0.10)" : risk === "Medium" ? "rgba(245,158,11,0.10)" : "rgba(16,185,129,0.10)";

  const R = 46;
  const circ = Math.PI * R;
  const filled = (Math.max(0, Math.min(100, score)) / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 120, height: 72 }}>
        <svg width={120} height={72} viewBox="0 0 120 72">
          {/* Track */}
          <path
            d={`M 14 62 A ${R} ${R} 0 0 1 106 62`}
            fill="none" stroke="var(--border)" strokeWidth={10} strokeLinecap="round"
          />
          {/* Fill */}
          <motion.path
            d={`M 14 62 A ${R} ${R} 0 0 1 106 62`}
            fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${filled} ${circ}` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
          />
        </svg>
        {/* Score */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-3xl font-bold tabular-nums leading-none" style={{ color }}>
            {displayScore}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5">/ 100</span>
        </div>
      </div>
      {/* Badge */}
      <span
        className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
        style={{ background: bgColor, color }}
      >
        {risk} Risk
      </span>
    </div>
  );
}

/* -- Confidence Bar --------------------------------------------------------- */
function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? "#3B82F6" : pct >= 40 ? "#F59E0B" : "#94A3B8";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[var(--text-muted)] font-medium">Confidence</span>
        <span className="font-semibold tabular-nums" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--bg-hover)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />
      </div>
    </div>
  );
}

/* -- Scan Result Card -------------------------------------------------------- */
function ScanResultCard({ result, extractedText }: { result: any; extractedText?: string }) {
  const score       = Math.max(0, Math.min(100, result.score ?? result.risk_score ?? 0));
  const risk        = result.risk ?? result.risk_level ?? "Low";
  const category    = result.category ?? "Other";
  const confidence  = result.confidence ?? 0;
  const reasons: string[] = result.reasons ?? [];
  const explanation = result.explanation ?? "";
  const recommendation = result.recommendation ?? "";
  const isScam      = result.isScam ?? false;
  const [expanded, setExpanded] = useState(false);

  const verdict =
    isScam || risk === "High"
      ? { icon: ShieldAlert,    label: "Likely a Scam",        color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.20)" }
      : risk === "Medium"
      ? { icon: ShieldQuestion, label: "Proceed with Caution", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.20)" }
      : { icon: ShieldCheck,    label: "Looks Safe",           color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.20)" };

  const VIcon = verdict.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-card overflow-hidden"
    >
      {/* Header strip */}
      <div
        className="flex items-center justify-between px-7 py-4"
        style={{ background: verdict.bg, borderBottom: `1px solid ${verdict.border}` }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: verdict.border }}>
            <VIcon className="h-5 w-5" style={{ color: verdict.color }} strokeWidth={2} />
          </div>
          <span className="text-base font-semibold" style={{ color: verdict.color }}>{verdict.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: verdict.border, color: verdict.color }}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:gap-10">
          {/* Gauge */}
          <div className="shrink-0 flex justify-center sm:justify-start">
            <RiskGauge score={score} risk={risk} />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Confidence */}
            <ConfidenceBar value={confidence} />

            {/* AI Explanation */}
            {explanation && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/60 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                  AI Analysis
                </p>
                <p className="text-sm leading-7 text-[var(--text-secondary)]">{explanation}</p>
              </div>
            )}

            {/* Threat Indicators */}
            {reasons.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                  Why Flagged
                </p>
                <ul className="space-y-2">
                  {reasons.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[var(--text-secondary)]">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: verdict.color }}
                      />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation */}
            {recommendation && (
              <div
                className="rounded-xl px-4 py-3.5"
                style={{ background: verdict.bg, border: `1px solid ${verdict.border}` }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: `${verdict.color}99` }}>
                  Recommended Action
                </p>
                <p className="text-sm font-medium leading-relaxed" style={{ color: verdict.color }}>{recommendation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Extracted text */}
        {extractedText && (
          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
              {expanded ? "Hide" : "Show"} extracted text
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.pre
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 max-h-40 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 font-mono text-xs text-[var(--text-muted)] leading-relaxed"
                >
                  {extractedText}
                </motion.pre>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* -- Empty State ------------------------------------------------------------- */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-10 text-center"
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-dim)]">
        <Shield className="h-8 w-8 text-[var(--accent)]" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)]">Ready to analyze</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] max-w-xs mx-auto">
        Paste content or upload a file above, then hit <strong className="text-[var(--text-secondary)]">Scan for Threats</strong> to get your AI-powered result.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-[var(--text-muted)]">
        {["Text", "URL", "Chat", "Email", "Screenshot", "Document"].map((t) => (
          <span key={t} className="rounded-full border border-[var(--border)] px-3 py-1">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* -- Loading Steps ----------------------------------------------------------- */
const LOADING_STEPS_TEXT: Record<string, string[]> = {
  URL:        ["Parsing URL structure...", "Checking domain reputation...", "Running phishing indicators...", "Generating verdict..."],
  TEXT:       ["Reading content...", "Running AI analysis...", "Checking scam patterns...", "Generating recommendations..."],
  EMAIL:      ["Analyzing email headers...", "Checking sender domain...", "Scanning for phishing keywords...", "Generating recommendations..."],
  CHAT:       ["Parsing conversation...", "Running AI checks...", "Detecting manipulation tactics...", "Generating recommendations..."],
  SCREENSHOT: ["Extracting text from image...", "Running OCR analysis...", "Checking scam indicators...", "Generating verdict..."],
  DOCUMENT:   ["Reading document...", "Extracting content...", "Running threat analysis...", "Generating recommendations..."],
};

function LoadingCard({ step, total, message }: { step: number; total: number; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="glass-card p-8"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Spinner ring */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent)]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          />
          <Shield className="h-7 w-7 text-[var(--accent)]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Analyzing content</p>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{message || "AI is processing your input"}</p>
        </div>
        {/* Step progress */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
            <span>Step {step} of {total}</span>
            <span>{Math.round((step / total) * 100)}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-hover)]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1]"
              animate={{ width: `${(step / total) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -- Scanner Page ------------------------------------------------------------ */
export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<TabType>("TEXT");
  const [inputText, setInputText] = useState("");
  const [file, setFile]           = useState<File | null>(null);
  const [loading, setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMsg, setLoadingMsg]   = useState("");
  const [result, setResult]       = useState<any>(null);
  const [error, setError]         = useState("");
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const stepIntervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  const isFileTab = FILE_TABS.has(activeTab);
  const tab       = TABS.find((t) => t.type === activeTab)!;

  const handleTabSwitch = (type: TabType) => {
    setActiveTab(type);
    setResult(null);
    setError("");
    setInputText("");
    setFile(null);
    setLoadingStep(0);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleScan = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    setLoadingStep(1);

    const steps = LOADING_STEPS_TEXT[activeTab] || LOADING_STEPS_TEXT.TEXT;
    setLoadingMsg(steps[0]);

    let stepIdx = 0;
    stepIntervalRef.current = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, steps.length - 1);
      setLoadingStep(stepIdx + 1);
      setLoadingMsg(steps[stepIdx]);
    }, 700);

    try {
      let response: any;
      if (activeTab === "URL") {
        response = await api.scanUrl(inputText.trim());
      } else if (isFileTab && file) {
        response = await api.scanFile(activeTab, file);
      } else {
        response = await api.scanText(activeTab, inputText.trim());
      }
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      setLoadingStep(steps.length);
      setLoadingMsg(steps[steps.length - 1]);
      // brief pause so user sees 100%
      await new Promise((r) => setTimeout(r, 300));
      setResult(response);
    } catch (err: any) {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      setError(err.message || "Scan failed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const canScan = isFileTab ? !!file : inputText.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Detect scams before they detect you.
        </h1>
        <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
          AI-powered fraud analysis in seconds — messages, links, screenshots, emails, documents.
        </p>
      </div>

      {/* Scan Card */}
      <div className="glass-card overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-[var(--border)] bg-[var(--bg-hover)]/40 p-1.5">
          {TABS.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              id={`scan-tab-${type.toLowerCase()}`}
              onClick={() => handleTabSwitch(type)}
              className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-150 flex-1 justify-center sm:flex-none sm:justify-start ${
                activeTab === type
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {activeTab === type && (
                <motion.div
                  layoutId="scan-tab-bg"
                  className="absolute inset-0 rounded-lg bg-[var(--bg-raised)] shadow-sm border border-[var(--border)]"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon className="relative h-3.5 w-3.5 shrink-0" strokeWidth={activeTab === type ? 2 : 1.75} />
              <span className="relative hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {isFileTab ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-5 py-14 transition-all duration-200 ${
                    dragOver
                      ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                      : file
                      ? "border-[var(--green)] bg-[var(--green-dim)]"
                      : "border-[var(--border)] hover:border-[var(--accent-mid)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {file ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--green-dim)]">
                        <CheckCircle2 className="h-6 w-6 text-[var(--green)]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{file.name}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="rounded-full p-0.5 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{(file.size / 1024).toFixed(0)} KB · Ready to scan</span>
                    </div>
                  ) : (
                    <>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${dragOver ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-hover)] text-[var(--text-muted)]"}`}>
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          Drop {activeTab === "SCREENSHOT" ? "a screenshot" : "a document"} here
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          or <span className="text-[var(--accent)] font-medium">browse files</span> —{" "}
                          {activeTab === "SCREENSHOT" ? "PNG, JPG, WEBP (max 10MB)" : "PDF, TXT, DOC (max 10MB)"}
                        </p>
                      </div>
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
                  id="scan-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={tab.placeholder}
                  rows={8}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/55 px-4 py-4 text-sm leading-7 text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent-mid)] focus:bg-[var(--bg-raised)]"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Scan button */}
          <div className="mt-4 flex items-center gap-3">
            <button
              id="scan-submit-btn"
              onClick={handleScan}
              disabled={!canScan || loading}
              className="btn-scan flex min-h-12 items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-medium text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {loadingMsg || "Analyzing..."}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Scan for Threats
                </>
              )}
            </button>

            {(inputText || file) && !loading && (
              <button
                onClick={() => { setInputText(""); setFile(null); setResult(null); setError(""); }}
                className="min-h-12 rounded-xl border border-[var(--border)] px-4 py-3.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl bg-[var(--red-dim)] border border-[var(--red)]/20 px-4 py-3.5 text-sm text-[var(--red)]"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results, Loading, or Empty State */}
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingCard
            key="loading"
            step={loadingStep}
            total={(LOADING_STEPS_TEXT[activeTab] || LOADING_STEPS_TEXT.TEXT).length}
            message={loadingMsg}
          />
        ) : result?.scan_result ? (
          <ScanResultCard
            key={JSON.stringify(result.scan_result)}
            result={result.scan_result}
            extractedText={result.extractedText}
          />
        ) : !error && (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
}
