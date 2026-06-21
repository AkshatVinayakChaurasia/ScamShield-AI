"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ScanSearch, ShieldAlert, ShieldCheck, Activity, TrendingUp,
  ArrowUpRight, Clock,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";
import { api } from "@/lib/api";

const RISK_COLORS = { High: "#ff5c5c", Medium: "#f5a623", Low: "#3ddc97" };
const PIE_COLORS = ["#3ddc97", "#f5a623", "#ff5c5c", "#6366f1", "#8b5cf6", "#ec4899"];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    api.getDashboardStats()
      .then((d) => setStats(d))
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

  const s = stats || {
    total_scans: 0, high_risk_count: 0, medium_risk_count: 0, low_risk_count: 0,
    security_score: 100, recent_scans: [], weekly_activity: [], category_distribution: [],
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-paper">Dashboard</h1>
          <p className="mt-1 text-text-muted">Your digital safety at a glance</p>
        </div>
        <Link
          href="/scanner"
          className="flex items-center gap-2 rounded-xl bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:brightness-110"
        >
          <ScanSearch className="h-4 w-4" />
          New Scan
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ScanSearch} label="Total Scans" value={s.total_scans}
          color="text-signal" bg="bg-signal-dim"
        />
        <StatCard
          icon={ShieldAlert} label="High Risk" value={s.high_risk_count}
          color="text-alarm" bg="bg-alarm-dim"
        />
        <StatCard
          icon={ShieldCheck} label="Security Score" value={`${s.security_score}%`}
          color="text-signal" bg="bg-signal-dim"
        />
        <StatCard
          icon={Activity} label="This Week"
          value={s.weekly_activity?.reduce?.((a: number, d: any) => a + d.count, 0) ?? 0}
          color="text-amber" bg="bg-amber-dim"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Weekly Activity Chart */}
        <motion.div variants={fadeUp} className="lg:col-span-3 rounded-2xl border border-wire bg-ink-raised p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-signal" />
            <h3 className="font-display text-sm font-medium text-paper">Weekly Activity</h3>
          </div>
          <div className="h-56">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.weekly_activity || []} barSize={28}>
                  <XAxis
                    dataKey="date" tick={{ fontSize: 11, fill: "#5a6a82" }}
                    tickFormatter={(v: string) => new Date(v + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "#111a2e", border: "1px solid #27344a", borderRadius: "12px", fontSize: "12px" }}
                    labelStyle={{ color: "#93a1b8" }}
                    cursor={{ fill: "rgba(61,220,151,0.05)" }}
                  />
                  <Bar dataKey="low_risk" stackId="a" fill="#3ddc97" radius={[0, 0, 0, 0]} name="Low Risk" />
                  <Bar dataKey="medium_risk" stackId="a" fill="#f5a623" name="Medium Risk" />
                  <Bar dataKey="high_risk" stackId="a" fill="#ff5c5c" radius={[4, 4, 0, 0]} name="High Risk" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div variants={fadeUp} className="lg:col-span-2 rounded-2xl border border-wire bg-ink-raised p-6">
          <h3 className="mb-4 font-display text-sm font-medium text-paper">Risk Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            {mounted && (s.total_scans ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Low", value: s.low_risk_count },
                      { name: "Medium", value: s.medium_risk_count },
                      { name: "High", value: s.high_risk_count },
                    ].filter(d => d.value > 0)}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                    paddingAngle={4} dataKey="value" strokeWidth={0}
                  >
                    <Cell fill="#3ddc97" />
                    <Cell fill="#f5a623" />
                    <Cell fill="#ff5c5c" />
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#111a2e", border: "1px solid #27344a", borderRadius: "12px", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-text-dim">No scans yet</p>
            )}
          </div>
          {(s.total_scans ?? 0) > 0 && (
            <div className="mt-2 flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" /> Low</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" /> Medium</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-alarm" /> High</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Scans */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-wire bg-ink-raised p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-text-muted" />
            <h3 className="font-display text-sm font-medium text-paper">Recent Scans</h3>
          </div>
          <Link href="/history" className="flex items-center gap-1 text-xs font-medium text-signal hover:underline">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {(s.recent_scans?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <ScanSearch className="h-10 w-10 text-text-dim" />
            <p className="mt-3 text-sm text-text-muted">No scans yet. Start by scanning something!</p>
            <Link
              href="/scanner"
              className="mt-4 rounded-xl bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:brightness-110"
            >
              Scan Now
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {s.recent_scans.slice(0, 5).map((scan: any) => (
              <Link
                key={scan.id}
                href={`/history`}
                className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-ink-hover"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  scan.risk_level === "High" ? "bg-alarm-dim" : scan.risk_level === "Medium" ? "bg-amber-dim" : "bg-signal-dim"
                }`}>
                  {scan.risk_level === "High" ? (
                    <ShieldAlert className="h-4 w-4 text-alarm" />
                  ) : scan.risk_level === "Medium" ? (
                    <ShieldAlert className="h-4 w-4 text-amber" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-signal" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-paper">
                    {scan.input_text?.slice(0, 80) || scan.scan_type + " scan"}
                  </p>
                  <p className="text-xs text-text-dim">
                    {scan.category} · <span suppressHydrationWarning>{new Date(scan.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm font-semibold ${
                    scan.risk_level === "High" ? "text-alarm" : scan.risk_level === "Medium" ? "text-amber" : "text-signal"
                  }`}>
                    {scan.risk_score}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    scan.risk_level === "High" ? "bg-alarm-dim text-alarm" : scan.risk_level === "Medium" ? "bg-amber-dim text-amber" : "bg-signal-dim text-signal"
                  }`}>
                    {scan.risk_level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ElementType; label: string; value: string | number; color: string; bg: string;
}) {
  return (
    <div className="rounded-2xl border border-wire bg-ink-raised p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.75} />
      </div>
      <p className="mt-3 font-mono text-2xl font-bold text-paper">{value}</p>
      <p className="mt-0.5 text-xs text-text-muted">{label}</p>
    </div>
  );
}
