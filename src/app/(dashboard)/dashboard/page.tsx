"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ScanSearch, ShieldAlert, ShieldCheck, Activity,
  TrendingUp, ArrowUpRight, Clock, Shield,
  Sparkles, AlertTriangle, CheckCircle2, Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";
import { api } from "@/lib/api";

/* -- Animation Variants ----------------------------------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

/* -- Animated Counter ------------------------------------------------------- */
function AnimCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const dur = 900;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(value * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{count}</span>;
}

/* -- Security Score Gauge --------------------------------------------------- */
function SecurityGauge({ score }: { score: number }) {
  const safe = Math.max(0, Math.min(100, score ?? 100));
  const color = safe >= 70 ? "#3B82F6" : safe >= 40 ? "#F59E0B" : "#EF4444";
  const glow  = safe >= 70 ? "rgba(59,130,246,0.3)" : safe >= 40 ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)";
  const label = safe >= 70 ? "Protected" : safe >= 40 ? "Moderate" : "At Risk";
  const R = 52;
  const circ = 2 * Math.PI * R;
  const filled = (safe / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <svg width={140} height={140} viewBox="0 0 140 140" className="-rotate-90">
          {/* Track */}
          <circle cx={70} cy={70} r={R} fill="none" stroke="var(--border)" strokeWidth={10} />
          {/* Fill */}
          <motion.circle
            cx={70} cy={70} r={R}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${filled} ${circ}` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
          />
        </svg>
        {/* Center */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold tabular-nums" style={{ color }}>
            <AnimCounter value={safe} />
          </span>
          <span className="text-xs text-[var(--text-muted)] mt-1">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color }}>{label}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Security Score</p>
      </div>
    </div>
  );
}

/* -- Stat Card -------------------------------------------------------------- */
function StatCard({ icon: Icon, label, value, accentColor, bgColor, sub }: {
  icon: React.ElementType; label: string; value: number | string;
  accentColor: string; bgColor: string; sub?: string;
}) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: bgColor }}>
          <Icon className="h-5 w-5" style={{ color: accentColor }} strokeWidth={1.75} />
        </div>
        {sub && (
          <span className="text-[11px] font-medium text-[var(--text-muted)] rounded-full border border-[var(--border)] px-2 py-0.5">
            {sub}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)] leading-none">
          {typeof value === "number" ? <AnimCounter value={value} /> : value}
        </p>
        <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  );
}

/* -- AI Insights Card ------------------------------------------------------- */
function AIInsightsCard({ score, threats }: { score: number; threats: number }) {
  const safe = Math.max(0, Math.min(100, score ?? 100));

  const insights =
    safe >= 80
      ? [
          { icon: CheckCircle2, color: "#10B981", text: "Your security posture looks excellent. Keep it up!" },
          { icon: ShieldCheck,  color: "#3B82F6", text: "No critical threats detected in recent scans." },
          { icon: Zap,          color: "#06B6D4", text: "Consider scanning unknown links before clicking." },
        ]
      : threats > 0
      ? [
          { icon: AlertTriangle, color: "#F59E0B", text: `${threats} high-risk threat${threats > 1 ? "s" : ""} detected. Review your history.` },
          { icon: Shield,        color: "#3B82F6", text: "Avoid clicking any links from those sources." },
          { icon: ShieldCheck,   color: "#10B981", text: "Run a fresh scan on any new suspicious content." },
        ]
      : [
          { icon: Sparkles, color: "#3B82F6", text: "Run your first scan to get AI-powered insights here." },
          { icon: Shield,   color: "#06B6D4", text: "ScamShield monitors 6 threat vectors simultaneously." },
        ];

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-dim)]">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={1.75} />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map(({ icon: Icon, color, text }, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}18` }}>
              <Icon className="h-3.5 w-3.5" style={{ color }} strokeWidth={2} />
            </div>
            <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -- Custom Tooltip --------------------------------------------------------- */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] px-3 py-2 shadow-xl">
      <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{payload[0].value} scans</p>
    </div>
  );
};

/* -- Dashboard Page --------------------------------------------------------- */
export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted] = useState(() => typeof window !== "undefined");

  useEffect(() => {
    api.getDashboardStats()
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Skeleton */
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton h-8 w-44 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="skeleton h-72 rounded-2xl lg:col-span-3" />
          <div className="skeleton h-72 rounded-2xl lg:col-span-2" />
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  const s = stats || {
    total_scans: 0, high_risk_count: 0, medium_risk_count: 0, low_risk_count: 0,
    security_score: 100, recent_scans: [], weekly_activity: [], category_distribution: [],
  };

  const score        = Math.max(0, Math.min(100, s.security_score ?? 100));
  const weeklyTotal  = s.weekly_activity?.reduce?.((a: number, d: any) => a + (d.count ?? d.total ?? 0), 0) ?? 0;
  const threats      = s.high_risk_count ?? 0;

  const pieData = [
    { name: "Safe",   value: s.low_risk_count    ?? 0, color: "#10B981" },
    { name: "Medium", value: s.medium_risk_count ?? 0, color: "#F59E0B" },
    { name: "High",   value: s.high_risk_count   ?? 0, color: "#EF4444" },
  ].filter((d) => d.value > 0);

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">

      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Overview</h1>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">Your security at a glance</p>
        </div>
        <Link
          id="new-scan-btn"
          href="/scanner"
          className="btn-scan flex min-h-11 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          <ScanSearch className="h-4 w-4" />
          New Scan
        </Link>
      </motion.div>

      {/* -- Empty State (no scans yet) ------------------------------------- */}
      {s.total_scans === 0 && (
        <motion.div variants={fadeUp}>
          <div className="glass-card flex flex-col items-center gap-6 px-8 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-dim)]">
              <ScanSearch className="h-8 w-8 text-[var(--accent)]" strokeWidth={1.5} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">No scans yet</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                Run your first scan to start building your security insights. Paste a message, link, or upload a file to get started.
              </p>
            </div>
            <Link
              href="/scanner"
              className="btn-scan flex min-h-11 items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white shadow-lg"
            >
              <ScanSearch className="h-4 w-4" />
              Go to Scanner
            </Link>
          </div>
        </motion.div>
      )}


      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-4">

        {/* Security Score — spans 1 col, tall */}
        <div className="glass-card p-6 flex flex-col items-center justify-center gap-2 lg:row-span-2">
          <SecurityGauge score={score} />
        </div>

        {/* 3 Stat Cards */}
        <StatCard
          icon={ScanSearch}
          label="Total Scans"
          value={s.total_scans}
          accentColor="#3B82F6"
          bgColor="rgba(59,130,246,0.12)"
        />
        <StatCard
          icon={ShieldAlert}
          label="Threats Detected"
          value={threats}
          accentColor="#EF4444"
          bgColor="rgba(239,68,68,0.12)"
          sub={threats > 0 ? "Action needed" : "All clear"}
        />
        <StatCard
          icon={Activity}
          label="Scans This Week"
          value={weeklyTotal}
          accentColor="#06B6D4"
          bgColor="rgba(6,182,212,0.12)"
        />
      </motion.div>

      {/* -- Bento Row 2: Charts ------------------------------------------- */}
      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-5">

        {/* Weekly Bar Chart */}
        <div className="glass-card p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Weekly Activity</h3>
            </div>
            {weeklyTotal > 0 && (
              <span className="text-[11px] text-[var(--text-muted)]">{weeklyTotal} this week</span>
            )}
          </div>
          <div className="h-52">
            {mounted && (s.weekly_activity?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.weekly_activity} barSize={22} barCategoryGap="28%">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#3B82F6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    tickFormatter={(v: string) =>
                      new Date(v + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })
                    }
                    axisLine={false} tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-hover)" }} />
                  <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-hover)]">
                  <Activity className="h-6 w-6 text-[var(--text-muted)]" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-[var(--text-secondary)]">No activity yet</p>
                <Link href="/scanner" className="text-xs font-medium text-[var(--accent)] hover:underline">
                  Run your first scan →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-5 text-sm font-semibold text-[var(--text-primary)]">Risk Distribution</h3>
          <div className="h-44 flex items-center justify-center">
            {mounted && pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="pieGlow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={46} outerRadius={64}
                    paddingAngle={3} dataKey="value" strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-raised)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "var(--text-primary)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-hover)]">
                  <Shield className="h-6 w-6 text-[var(--text-muted)]" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-[var(--text-muted)]">No scans yet</p>
              </div>
            )}
          </div>
          {pieData.length > 0 && (
            <div className="mt-3 flex justify-center gap-4 text-[11px] text-[var(--text-muted)]">
              {pieData.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* -- Bento Row 3: AI Insights + Recent Scans ------------------------ */}
      <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-5">

        {/* AI Insights */}
        <div className="lg:col-span-2">
          <AIInsightsCard score={score} threats={threats} />
        </div>

        {/* Recent Scans Timeline */}
        <div className="glass-card p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={1.75} />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
            </div>
            <Link href="/history" className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {(s.recent_scans?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-dim)]">
                <ScanSearch className="h-7 w-7 text-[var(--accent)]" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm font-medium text-[var(--text-primary)]">No scans yet</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Run your first scan to see results here</p>
              <Link
                href="/scanner"
                className="btn-scan mt-5 min-h-11 rounded-xl px-5 py-2.5 text-sm font-medium text-white"
              >
                Run your first scan
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {s.recent_scans.slice(0, 5).map((scan: any) => {
                const riskColor =
                  scan.risk_level === "High" ? "#EF4444"
                  : scan.risk_level === "Medium" ? "#F59E0B"
                  : "#10B981";
                const RiskIcon = scan.risk_level === "High" ? ShieldAlert : ShieldCheck;
                return (
                  <Link
                    key={scan.id}
                    href="/history"
                    className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 transition-all hover:bg-[var(--bg-hover)] group"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: `${riskColor}18` }}>
                      <RiskIcon className="h-4 w-4" style={{ color: riskColor }} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {scan.input_text?.slice(0, 65) || `${scan.scan_type} scan`}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {scan.category} ·{" "}
                        <span suppressHydrationWarning>
                          {new Date(scan.created_at).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{ background: `${riskColor}18`, color: riskColor }}
                    >
                      {scan.risk_level}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
