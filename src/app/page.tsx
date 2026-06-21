"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, ScanSearch, Link2, ImageUp, FileText, MessageSquare,
  Mail, ArrowRight, ShieldCheck, Zap, Lock, BarChart3,
  ChevronRight, GraduationCap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const FEATURES = [
  { icon: FileText, title: "Analyze Text", desc: "Paste SMS, email, WhatsApp, or any suspicious text." },
  { icon: Link2, title: "Check URLs", desc: "Verify links before clicking for phishing or spoofing." },
  { icon: ImageUp, title: "Screenshot Scan", desc: "Upload a screenshot — our OCR extracts and analyzes it." },
  { icon: MessageSquare, title: "Chat Analysis", desc: "Paste entire DM or WhatsApp conversations." },
  { icon: Mail, title: "Email Scanner", desc: "Full email body analysis for scam patterns." },
  { icon: ScanSearch, title: "Document Scan", desc: "Upload PDFs or documents for threat detection." },
];

const TRUST_ITEMS = [
  { icon: Zap, title: "Instant Analysis", desc: "Results in under 2 seconds with hybrid AI engine." },
  { icon: Lock, title: "Privacy First", desc: "Your data stays private. No content is stored unless you choose." },
  { icon: ShieldCheck, title: "Rule + AI Hybrid", desc: "Combines deterministic rules with AI for maximum accuracy." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track threats, view trends, and monitor your digital safety." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-wire/50 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-dim">
              <Shield className="h-4 w-4 text-signal" strokeWidth={2} />
            </div>
            <span className="font-display text-base font-bold text-paper">ScamShield AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-paper">
              Sign In
            </Link>
            <Link href="/signup" className="rounded-xl bg-signal px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:brightness-110">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="hero-glow left-1/2 top-0 -translate-x-1/2" />
        <div className="hero-glow right-0 top-40 opacity-30" style={{ background: "radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)" }} />

        <div className="mx-auto max-w-4xl px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 sm:pb-28">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-wire bg-ink-raised px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              <span className="font-mono text-xs text-text-muted">AI-Powered Scam Detection</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-display text-4xl font-bold leading-tight text-paper sm:text-6xl lg:text-7xl">
              Know Before{" "}
              <span className="relative">
                <span className="text-signal">You Trust</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 6c40-4 80-4 120-2s50 2 78-1" stroke="#3ddc97" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              Verify suspicious messages, links, screenshots, and documents before they cause harm. 
              Powered by hybrid AI that combines rule-based detection with intelligent analysis.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="flex items-center gap-2.5 rounded-xl bg-signal px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-signal/20 transition-all hover:brightness-110"
              >
                Start Scanning Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-wire px-6 py-3.5 text-sm font-medium text-text-muted transition-colors hover:bg-ink-raised hover:text-paper"
              >
                Sign In
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-signal">Scan Anything</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
              Six ways to stay safe
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-text-muted">
              From text messages to PDFs — analyze any suspicious digital content instantly.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group rounded-2xl border border-wire bg-ink-raised p-6 transition-all hover:border-signal/30 hover:shadow-lg hover:shadow-signal/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-dim transition-colors group-hover:bg-signal/20">
                  <Icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-paper">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-wire bg-ink-raised/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-signal">Why ScamShield AI</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-paper">Built for trust and speed</h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={fadeUp} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-dim">
                    <Icon className="h-6 w-6 text-signal" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-display text-base font-medium text-paper">{title}</h3>
                  <p className="mt-1.5 text-sm text-text-muted">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="scan-lines rounded-3xl border border-wire bg-ink-raised p-10 text-center sm:p-16"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-signal-dim">
            <Shield className="h-8 w-8 text-signal" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold text-paper">Ready to protect yourself?</h2>
          <p className="mx-auto mt-3 max-w-md text-text-muted">
            Join thousands of users who verify before they trust. Start scanning for free today.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-signal px-8 py-4 text-sm font-semibold text-ink shadow-lg shadow-signal/20 transition-all hover:brightness-110"
          >
            Get Started — It&apos;s Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-wire">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-signal" />
            <span className="font-display text-sm font-medium text-text-dim">ScamShield AI</span>
          </div>
          <p className="font-mono text-xs text-text-dim">&copy; 2025 ScamShield AI. Know Before You Trust.</p>
        </div>
      </footer>
    </div>
  );
}
