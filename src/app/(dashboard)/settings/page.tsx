"use client";

import { motion } from "framer-motion";
import { Settings, Cpu, Zap, Shield, User, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function SettingsSection({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-dim)]">
          <Icon className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.75} />
        </div>
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, value, mono, badge }: { label: string; value: string; mono?: boolean; badge?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-[var(--text-muted)]">{label}</span>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="rounded-full border border-[var(--border)] bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)]">
            {badge}
          </span>
        )}
        <span className={`text-[13px] ${mono ? "font-mono text-[var(--text-muted)]" : "font-medium text-[var(--text-primary)]"}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

const ROADMAP = [
  "DistilBERT text classification model",
  "EfficientNet screenshot classifier",
  "XGBoost phishing URL detection",
  "Browser extension for real-time protection",
  "QR code scan support",
  "Community threat intelligence feed",
];

export default function SettingsPage() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl space-y-5">

      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Manage your preferences and application configuration</p>
      </motion.div>

      {/* Account */}
      <motion.div variants={fadeUp}>
        <SettingsSection title="Account" icon={User}>
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
            >
              {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{displayName}</p>
              <p className="text-[13px] text-[var(--text-muted)]">{user?.email}</p>
            </div>
            <span className="ml-auto rounded-full border border-[var(--green)] bg-[var(--green-dim)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--green)]">
              Active
            </span>
          </div>
        </SettingsSection>
      </motion.div>

      {/* AI Engine */}
      <motion.div variants={fadeUp}>
        <SettingsSection title="AI Engine" icon={Cpu}>
          <Row label="Provider"       value="Google Gemini + Rule Engine" badge="Active" />
          <div className="h-px bg-[var(--border)]" />
          <Row label="Analysis Mode"  value="Hybrid (Rules + AI)" />
          <Row label="OCR Engine"     value="Gemini Vision" />
          <Row label="Model"          value="gemini-1.5-flash" mono />
          <div className="mt-2 flex items-start gap-3 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-dim)] px-4 py-3.5">
            <Zap className="h-4 w-4 shrink-0 mt-0.5 text-[var(--accent)]" strokeWidth={1.75} />
            <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
              Set{" "}
              <code className="rounded bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[var(--accent)]">
                GEMINI_API_KEY
              </code>{" "}
              in your environment to enable AI-powered analysis. Without it, the rule-based engine runs automatically.
            </p>
          </div>
        </SettingsSection>
      </motion.div>

      {/* Application Info */}
      <motion.div variants={fadeUp}>
        <SettingsSection title="Application" icon={Info}>
          <Row label="Version"    value="3.0.0" mono />
          <div className="h-px bg-[var(--border)]" />
          <Row label="Stack"      value="Next.js 16 + TypeScript" />
          <Row label="Database"   value="Supabase PostgreSQL" />
          <Row label="Auth"       value="Supabase Auth (Google + Email)" />
          <Row label="Deployment" value="Vercel" />
        </SettingsSection>
      </motion.div>

      {/* Roadmap */}
      <motion.div variants={fadeUp}>
        <SettingsSection title="Roadmap" icon={Shield}>
          <div className="space-y-2">
            {ROADMAP.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)]/50 px-4 py-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-muted)]" />
                <span className="flex-1 text-[13px] text-[var(--text-muted)]">{item}</span>
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                  Soon
                </span>
              </div>
            ))}
          </div>
        </SettingsSection>
      </motion.div>
    </motion.div>
  );
}
