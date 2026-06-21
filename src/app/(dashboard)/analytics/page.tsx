"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, BarChart3, PieChart as PieIcon } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { api } from "@/lib/api";

const PIE_COLORS = ["#3ddc97", "#6366f1", "#f5a623", "#ff5c5c", "#8b5cf6", "#ec4899", "#14b8a6"];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    api.getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-wire border-t-signal" />
      </div>
    );
  }

  const d = data || {
    security_score: 100, total_scans: 0,
    weekly_trends: [], category_distribution: [],
    risk_distribution: { high: 0, medium: 0, low: 0 },
  };

  const rd = d.risk_distribution || { high: 0, medium: 0, low: 0 };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="font-display text-3xl font-bold text-paper">Analytics</h1>
        <p className="mt-1 text-text-muted">Insights into your scanning activity and threat trends</p>
      </motion.div>

      {/* Top Stats */}
      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-3">
        {/* Security Score */}
        <div className="rounded-2xl border border-wire bg-ink-raised p-6 flex flex-col items-center">
          <div className="relative">
            <svg viewBox="0 0 120 120" className="h-28 w-28">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#27344a" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={d.security_score >= 70 ? "#3ddc97" : d.security_score >= 40 ? "#f5a623" : "#ff5c5c"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(d.security_score / 100) * 314.16} 314.16`}
                transform="rotate(-90 60 60)"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-bold text-paper">{d.security_score}</span>
              <span className="text-[10px] text-text-dim">/ 100</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-paper flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-signal" /> Security Score
          </p>
        </div>

        {/* Risk Breakdown */}
        <div className="rounded-2xl border border-wire bg-ink-raised p-6">
          <h3 className="font-display text-sm font-medium text-paper mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-text-muted" /> Risk Breakdown
          </h3>
          <div className="space-y-3">
            <RiskBar label="Low Risk" count={rd.low} total={d.total_scans} color="bg-signal" />
            <RiskBar label="Medium Risk" count={rd.medium} total={d.total_scans} color="bg-amber" />
            <RiskBar label="High Risk" count={rd.high} total={d.total_scans} color="bg-alarm" />
          </div>
        </div>

        {/* Category Distribution Pie */}
        <div className="rounded-2xl border border-wire bg-ink-raised p-6">
          <h3 className="font-display text-sm font-medium text-paper mb-4 flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-text-muted" /> Categories
          </h3>
          {mounted && d.category_distribution?.length > 0 ? (
            <>
              <div className="h-36 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={d.category_distribution} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="count" strokeWidth={0}>
                      {d.category_distribution.map((_: any, i: number) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#111a2e", border: "1px solid #27344a", borderRadius: "12px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {d.category_distribution.slice(0, 4).map((c: any, i: number) => (
                  <span key={c.category} className="flex items-center gap-1 text-[11px] text-text-dim">
                    <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {c.category}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-text-dim text-center py-8">No data yet</p>
          )}
        </div>
      </motion.div>

      {/* Weekly Trends Chart */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-wire bg-ink-raised p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-signal" />
          <h3 className="font-display text-sm font-medium text-paper">Weekly Trends</h3>
        </div>
        <div className="h-64">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.weekly_trends || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3ddc97" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3ddc97" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date" tick={{ fontSize: 11, fill: "#5a6a82" }}
                  tickFormatter={(v: string) => new Date(v + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                  axisLine={false} tickLine={false}
                />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#111a2e", border: "1px solid #27344a", borderRadius: "12px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="count" stroke="#3ddc97" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} name="Scans" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RiskBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-muted">{label}</span>
        <span className="font-mono text-paper">{count} ({pct}%)</span>
      </div>
      <div className="h-2 rounded-full bg-wire overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
