"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, ShieldAlert, ShieldCheck, ShieldQuestion,
  Trash2, ChevronLeft, ChevronRight, ScanSearch, X,
} from "lucide-react";
import { api } from "@/lib/api";

const RISK_LEVELS = ["", "Low", "Medium", "High"];
const SCAN_TYPES = ["", "TEXT", "URL", "CHAT", "SCREENSHOT", "DOCUMENT", "EMAIL", "FILE"];

export default function HistoryPage() {
  const [scans, setScans] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [scanType, setScanType] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "15" };
      if (search) params.search = search;
      if (riskLevel) params.risk_level = riskLevel;
      if (scanType) params.scan_type = scanType;
      const res: any = await api.getHistory(params);
      setScans(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.total_pages || 1);
    } catch {
      setScans([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, riskLevel, scanType]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteScan(id);
      fetchHistory();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-paper">Scan History</h1>
        <p className="mt-1 text-text-muted">Browse, search, and manage your past scans</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search scans..."
            className="w-full rounded-xl border border-wire bg-ink-raised py-2.5 pl-10 pr-4 text-sm text-paper outline-none placeholder:text-text-dim focus:border-signal"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-paper">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={riskLevel}
          onChange={(e) => { setRiskLevel(e.target.value); setPage(1); }}
          className="rounded-xl border border-wire bg-ink-raised px-4 py-2.5 text-sm text-paper outline-none focus:border-signal"
        >
          <option value="">All Risk Levels</option>
          {RISK_LEVELS.filter(Boolean).map((r) => <option key={r} value={r}>{r} Risk</option>)}
        </select>
        <select
          value={scanType}
          onChange={(e) => { setScanType(e.target.value); setPage(1); }}
          className="rounded-xl border border-wire bg-ink-raised px-4 py-2.5 text-sm text-paper outline-none focus:border-signal"
        >
          <option value="">All Types</option>
          {SCAN_TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-wire border-t-signal" />
        </div>
      ) : scans.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <ScanSearch className="h-12 w-12 text-text-dim" />
          <p className="mt-3 text-sm text-text-muted">No scans found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scans.map((scan) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-wire bg-ink-raised overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === scan.id ? null : scan.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-ink-hover transition-colors"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  scan.risk_level === "High" ? "bg-alarm-dim" : scan.risk_level === "Medium" ? "bg-amber-dim" : "bg-signal-dim"
                }`}>
                  {scan.risk_level === "High" ? <ShieldAlert className="h-4 w-4 text-alarm" /> :
                   scan.risk_level === "Medium" ? <ShieldQuestion className="h-4 w-4 text-amber" /> :
                   <ShieldCheck className="h-4 w-4 text-signal" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-paper">{scan.input_text?.slice(0, 100) || `${scan.scan_type} scan`}</p>
                  <p className="text-xs text-text-dim">
                    {scan.scan_type} · {scan.category} · <span suppressHydrationWarning>{new Date(scan.created_at).toLocaleString()}</span>
                  </p>
                </div>
                <span className={`font-mono text-lg font-bold ${
                  scan.risk_level === "High" ? "text-alarm" : scan.risk_level === "Medium" ? "text-amber" : "text-signal"
                }`}>
                  {scan.risk_score}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  scan.risk_level === "High" ? "bg-alarm-dim text-alarm" : scan.risk_level === "Medium" ? "bg-amber-dim text-amber" : "bg-signal-dim text-signal"
                }`}>
                  {scan.risk_level}
                </span>
              </button>

              {/* Expanded detail */}
              {expanded === scan.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  className="border-t border-wire px-5 py-4 space-y-3"
                >
                  {scan.explanation && <p className="text-sm text-text-muted">{scan.explanation}</p>}
                  {scan.reasons?.length > 0 && (
                    <ul className="space-y-1">
                      {scan.reasons.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-paper">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-alarm hover:bg-alarm-dim transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-dim">{total} scans total</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-wire p-2 text-text-muted hover:bg-ink-hover disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs text-text-muted">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-wire p-2 text-text-muted hover:bg-ink-hover disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
