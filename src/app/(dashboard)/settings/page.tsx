"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, Cpu, Database, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-paper">Settings</h1>
        <p className="mt-1 text-text-muted">Application configuration and preferences</p>
      </div>

      {/* AI Provider Info */}
      <div className="rounded-2xl border border-wire bg-ink-raised p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-signal" />
          <h2 className="font-display text-lg font-medium text-paper">AI Engine</h2>
        </div>
        <div className="rounded-xl bg-ink p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Active Provider</span>
            <span className="rounded-full bg-signal-dim px-3 py-1 font-mono text-xs text-signal">Mock (Rule-Based)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Analysis Mode</span>
            <span className="text-sm text-paper">Hybrid (Rules + AI Scoring)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">OCR Engine</span>
            <span className="text-sm text-paper">Tesseract</span>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-xl bg-signal-dim p-3">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-signal" />
          <p className="text-xs text-signal">
            The AI provider can be switched to Google Gemini by configuring <code className="font-mono bg-ink px-1 py-0.5 rounded">AI_PROVIDER=gemini</code> and setting a <code className="font-mono bg-ink px-1 py-0.5 rounded">GEMINI_API_KEY</code> on the server.
          </p>
        </div>
      </div>

      {/* App Info */}
      <div className="rounded-2xl border border-wire bg-ink-raised p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-text-muted" />
          <h2 className="font-display text-lg font-medium text-paper">Application</h2>
        </div>
        <div className="rounded-xl bg-ink p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Version</span>
            <span className="font-mono text-sm text-paper">2.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Frontend</span>
            <span className="text-sm text-paper">Next.js 15 + TypeScript</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Backend</span>
            <span className="text-sm text-paper">Express.js + Supabase</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">AI Service</span>
            <span className="text-sm text-paper">FastAPI + Python</span>
          </div>
        </div>
      </div>

      {/* Future Features */}
      <div className="rounded-2xl border border-wire bg-ink-raised p-6 space-y-4">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-text-muted" />
          <h2 className="font-display text-lg font-medium text-paper">Coming Soon</h2>
        </div>
        <div className="space-y-2">
          {[
            "DistilBERT text classification model",
            "EfficientNet screenshot classifier",
            "XGBoost phishing URL detection",
            "Browser extension for real-time protection",
            "QR code scan support",
            "Community threat intelligence",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 rounded-xl bg-ink px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-wire" />
              <span className="text-sm text-text-dim">{feature}</span>
              <span className="ml-auto rounded-full border border-wire px-2 py-0.5 font-mono text-[10px] text-text-dim">ROADMAP</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
