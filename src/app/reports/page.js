import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SEED_REPORTS, TOTAL_REPORTS } from "@/utils/seedReports";

const TREND_CONFIG = {
  up: { icon: TrendingUp, className: "text-alarm", label: "Rising" },
  down: { icon: TrendingDown, className: "text-signal", label: "Falling" },
  steady: { icon: Minus, className: "text-text-muted", label: "Steady" },
};

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReportsPage() {
  const sortedReports = [...SEED_REPORTS].sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        Community reports
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
        What&apos;s trending right now
      </h1>
      <p className="mt-3 max-w-xl text-text-muted">
        Aggregated counts of scam categories reported by the community,
        ranked by frequency. Use this to know what to watch out for this week.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-wire bg-ink-raised px-4 py-2 font-mono text-sm text-text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        {TOTAL_REPORTS.toLocaleString()} total reports analyzed
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sortedReports.map((report) => {
          const trend = TREND_CONFIG[report.trend] || TREND_CONFIG.steady;
          const TrendIcon = trend.icon;

          return (
            <div
              key={report.category}
              className="rounded-lg border border-wire bg-ink-raised p-5"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-display text-lg font-medium text-paper">
                  {report.category}
                </h2>
                <span
                  className={`flex items-center gap-1 font-mono text-xs ${trend.className}`}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  {trend.label}
                </span>
              </div>

              <p className="mt-3 font-mono text-3xl font-semibold text-paper">
                {report.count.toLocaleString()}
              </p>
              <p className="font-mono text-xs text-text-muted">
                reports
              </p>

              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {report.description}
              </p>

              <p className="mt-4 font-mono text-xs text-text-muted">
                Last seen: {formatDate(report.lastSeen)}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center font-mono text-xs text-text-muted">
        Sample data shown for demo purposes. Live community reporting coming soon.
      </p>
    </div>
  );
}
