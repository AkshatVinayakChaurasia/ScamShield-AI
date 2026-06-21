"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Shield, ScanSearch, Link2, ImageUp, FileText, MessageSquare,
  Mail, ArrowRight, ShieldCheck, Zap, Lock, BarChart3,
  FileUp, GitBranch, ExternalLink, ChevronDown,
  Eye, Brain, AlertTriangle, CheckCircle2, Sparkles,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

/* -- Animation Variants ------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

/* -- Animated Counter ------------------------------------------------------- */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(value * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* -- Navbar ------------------------------------------------------------------ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-[var(--bg)]/80 backdrop-blur-2xl border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-[var(--accent-dim)]" />
            <div className="absolute inset-0 rounded-xl opacity-35 bg-gradient-to-br from-[#3B82F6] to-[#6366F1] blur-[6px]" />
            <Shield className="relative h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">
            ScamShield AI
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Sign In
          </Link>
          <ThemeToggle />
          <Link
            href="/scanner"
            className="btn-scan rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* -- Hero Section ------------------------------------------------------------ */
function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden flex items-center justify-center pt-16">
      {/* Ambient glow layers */}
      <div className="hero-gradient absolute inset-0 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-9 inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)]/80 px-5 py-2 backdrop-blur-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="text-[13px] font-medium text-[var(--text-muted)]">AI-Powered Threat Detection · Now Live</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-bold leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-[68px] xl:text-[72px]"
          >
            Detect scams before<br />
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] bg-clip-text text-transparent">
              they detect you.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg"
          >
            AI-powered fraud detection in seconds. Protect yourself from phishing,
            scams, and digital threats across messages, links, and documents.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/scanner"
              className="btn-scan flex items-center gap-2.5 rounded-2xl px-8 py-4 text-[15px] font-medium text-white shadow-xl glow-blue"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="glass flex items-center gap-2.5 rounded-2xl px-8 py-4 text-[15px] font-medium text-[var(--text-secondary)] transition-all hover:-translate-y-px hover:text-[var(--text-primary)]"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
              No credit card
            </span>
            <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[var(--accent)]" />
              100% private
            </span>
            <span className="h-1 w-1 rounded-full bg-[var(--border)]" />
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--indigo)]" />
              {"< 2s analysis"}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <ChevronDown className="h-5 w-5 text-[var(--text-muted)]" />
      </motion.div>
    </section>
  );
}

/* -- Stats Strip ------------------------------------------------------------- */
const STATS = [
  { value: 2,    suffix: "s",  label: "Average analysis time",    icon: Zap },
  { value: 98,   suffix: "%",  label: "Detection accuracy",        icon: ShieldCheck },
  { value: 6,    suffix: "+",  label: "Scan types supported",      icon: ScanSearch },
  { value: 100,  suffix: "%",  label: "Private & secure",          icon: Lock },
];

function StatsSection() {
  return (
    <section className="border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] lg:grid-cols-4 lg:divide-y-0">
          {STATS.map(({ value, suffix, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center gap-2 py-8 text-center px-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-dim)]">
                <Icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
              </div>
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">
                <AnimatedCounter value={value} suffix={suffix} />
              </p>
              <p className="text-xs text-[var(--text-muted)]">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -- Bento Features ---------------------------------------------------------- */
const FEATURES = [
  {
    icon: FileText, title: "Text & SMS Analysis",
    desc: "Detect phishing patterns in any message — SMS, WhatsApp, Telegram. Instant AI classification with confidence scoring.",
    span: "lg:col-span-2", large: true,
    tag: "Most Used",
  },
  {
    icon: Link2, title: "URL Checker",
    desc: "Identify malicious links before you click. Checks domain reputation, redirects, and SSL.",
    span: "", large: false, tag: "Fast",
  },
  {
    icon: ImageUp, title: "Screenshot OCR",
    desc: "Upload a screenshot — Gemini Vision reads and analyzes it for hidden threats.",
    span: "", large: false, tag: "Vision AI",
  },
  {
    icon: MessageSquare, title: "Chat Analysis",
    desc: "Paste full WhatsApp or DM conversations for deep scam pattern detection.",
    span: "", large: false, tag: "Multi-turn",
  },
  {
    icon: Mail, title: "Email Scanner",
    desc: "Full email threat detection with header analysis and confidence scoring.",
    span: "", large: false, tag: "Deep Scan",
  },
  {
    icon: FileUp, title: "Document Scan",
    desc: "Upload PDFs and documents for comprehensive AI threat analysis.",
    span: "lg:col-span-2", large: false, tag: "PDF Support",
  },
];

function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent-dim)] bg-[var(--accent-dim)] px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              What You Can Scan
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Six ways to stay safe
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--text-muted)]">
            From suspicious texts to full documents — protect yourself from every angle.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, span, large, tag }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={`glass-card group relative overflow-hidden p-7 ${span}`}
            >
              {/* Tag */}
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-dim)] transition-colors group-hover:bg-[var(--accent-mid)]">
                  <Icon className="h-6 w-6 text-[var(--accent)]" strokeWidth={1.75} />
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)]">
                  {tag}
                </span>
              </div>

              <h3 className={`font-semibold text-[var(--text-primary)] ${large ? "text-xl" : "text-base"}`}>{title}</h3>
              <p className={`mt-2 leading-relaxed text-[var(--text-muted)] ${large ? "text-base" : "text-sm"}`}>{desc}</p>

              {/* Subtle corner glow on hover */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--accent)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-[0.06]" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* -- How It Works ------------------------------------------------------------ */
const STEPS = [
  { n: "01", icon: Eye,           title: "Paste or upload",  desc: "Input text, URL, chat, email, screenshot, or document into the scanner." },
  { n: "02", icon: Brain,         title: "AI analysis",      desc: "Gemini AI + rule engine runs deep threat analysis in under 2 seconds." },
  { n: "03", icon: ShieldCheck,   title: "Get your verdict", desc: "Receive a risk score, detailed explanation, and a recommended action." },
];

function HowItWorksSection() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-surface)]/40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="mb-16 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--text-muted)]">
              Three steps from suspicious to certain.
            </p>
          </motion.div>

          <div className="relative grid gap-8 lg:grid-cols-3">
            {/* Connecting line on desktop */}
            <div className="pointer-events-none absolute top-10 left-[16.67%] right-[16.67%] hidden h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent lg:block" />

            {STEPS.map(({ n, icon: Icon, title, desc }) => (
              <motion.div key={n} variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-[var(--accent-dim)]" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--border)]" />
                  <Icon className="relative h-9 w-9 text-[var(--accent)]" strokeWidth={1.5} />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white shadow-lg">
                    {n.slice(-1)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -- Why ScamShield ---------------------------------------------------------- */
const PILLARS = [
  { icon: Zap,          title: "Instant Analysis",      desc: "Results in under 2 seconds. No waiting, no queues.",           color: "#F59E0B" },
  { icon: Lock,         title: "Privacy First",         desc: "Nothing is stored. Your data never leaves your session.",      color: "#3B82F6" },
  { icon: Brain,        title: "Hybrid AI Engine",      desc: "Gemini AI + rule-based engine for maximum detection accuracy.", color: "#3B82F6" },
  { icon: BarChart3,    title: "Detailed Reports",      desc: "Risk score, confidence, reasons, and actionable recommendations.", color: "#0EA5E9" },
  { icon: AlertTriangle,title: "Multi-vector Coverage", desc: "Text, URL, image, email, chat, and documents all in one tool.", color: "#EF4444" },
  { icon: CheckCircle2, title: "No False Positives",    desc: "Tuned for accuracy — honest about what it doesn't know.",      color: "#6366F1" },
];

function WhySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp} className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Why ScamShield AI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-muted)]">
            Built for real users who deserve real protection — not just another AI gimmick.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, desc, color }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="glass-card group p-7"
            >
              <div
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${color}18` }}
              >
                <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* -- CTA Section ------------------------------------------------------------- */
function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative glass-card overflow-hidden p-12 text-center sm:p-20"
      >
        <div className="relative">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-dim)]">
            <Shield className="h-7 w-7 text-[var(--accent)]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Ready to protect yourself?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--text-muted)]">
            Start scanning in seconds. No credit card required.
          </p>
          <Link
            href="/scanner"
            className="btn-scan mt-10 inline-flex items-center gap-2.5 rounded-2xl px-10 py-4 text-[15px] font-medium text-white shadow-xl glow-blue"
          >
            Get Started — It&apos;s Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* -- Team Section ------------------------------------------------------------ */
const TEAM = [
  {
    name: "Akshat Chaurasia",
    role: "Co-Founder & Full-Stack Developer",
    initial: "A",
    bio: "Building AI-powered products that make digital security simple, accessible, and trustworthy for everyone.",
    color: "#3B82F6",
    links: {
      github: "https://github.com/AkshatVinayakChaurasia",
      linkedin: "https://www.linkedin.com/in/akshat-chaurasia-a10943402/",
      linktree: "https://linktr.ee/akshatchaurasia",
    },
  },
  {
    name: "Harshita Rana",
    role: "Co-Founder & Full-Stack Developer",
    initial: "H",
    bio: "Passionate about building intelligent systems and creating technology that solves real-world security challenges.",
    color: "#6366F1",
    links: {
      github: "https://github.com/ranaharshita",
      linkedin: "https://www.linkedin.com/in/ranaharshita/",
      linktree: "https://linktr.ee/ranaharshita",
    },
  },
];

const LinkedinIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const LinktreeIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.511 5.853l4.005-4.004 2.12 2.122-4.004 4.004h5.694v3.003h-5.694l4.004 4.004-2.12 2.122-4.005-4.005v5.694h-3.002V12.1l-4.004 4.004-2.12-2.12 4.004-4.006H2.682V6.975h5.707L4.385 2.97 6.505.848l4.004 4.005V-.001h3.002v5.854z"/>
  </svg>
);

function TeamSection() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--bg-surface)]/30">
      <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="mb-14 text-center">
            <p className="text-sm font-medium text-[var(--text-muted)]">Built with ❤️ by</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Team ScamShield AI
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {TEAM.map(({ name, role, initial, bio, color, links }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="glass-card group relative cursor-pointer overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1"
                style={{ "--card-glow": color } as React.CSSProperties}
                whileHover={{ y: -4, boxShadow: `0 20px 40px ${color}18, 0 0 0 1px ${color}20` }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                {/* Subtle corner glow on hover */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${color}22, transparent 70%)` }}
                />

                {/* Avatar */}
                <div className="mb-5 flex items-center gap-4">
                  <div
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, boxShadow: `0 8px 24px ${color}30` }}
                  >
                    {initial}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{name}</p>
                    <p className="text-sm text-[var(--text-muted)]">{role}</p>
                  </div>
                </div>

                <p className="relative mb-5 text-sm leading-relaxed text-[var(--text-muted)]">{bio}</p>

                {/* Links */}
                <div className="relative flex flex-wrap items-center gap-2">
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GitBranch className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkedinIcon />
                    LinkedIn
                  </a>
                  <a
                    href={links.linktree}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinktreeIcon />
                    Linktree
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -- Footer ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-sm font-medium text-[var(--text-muted)]">ScamShield AI</span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          © 2025 ScamShield AI — Know Before You Trust
        </p>
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <Link href="/login" className="hover:text-[var(--text-primary)] transition-colors">Sign In</Link>
          <Link href="/scanner" className="hover:text-[var(--text-primary)] transition-colors">Get Started</Link>
        </div>
      </div>
    </footer>
  );
}

/* -- Page -------------------------------------------------------------------- */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhySection />
      <CTASection />
      <TeamSection />
      <Footer />
    </div>
  );
}
