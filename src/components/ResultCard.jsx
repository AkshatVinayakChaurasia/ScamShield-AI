import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import ScamMeter from "./ScamMeter";

/**
 * Displays a scam analysis result. Shared across analyze-text, analyze-url,
 * and upload-screenshot pages — all three send the same response shape:
 * { isScam, score, category, risk, reasons }
 */
export default function ResultCard({ result }) {
  if (!result) return null;

  const { isScam, score, category, risk, reasons = [] } = result;

  const verdict = isScam
    ? {
        icon: ShieldAlert,
        label: "Likely a scam",
        className: "text-alarm",
      }
    : risk === "Medium"
      ? {
          icon: ShieldQuestion,
          label: "Proceed with caution",
          className: "text-amber",
        }
      : {
          icon: ShieldCheck,
          label: "Looks safe",
          className: "text-signal",
        };

  const VerdictIcon = verdict.icon;

  return (
    <div className="rounded-lg border border-wire bg-ink-raised p-6 sm:p-8">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <ScamMeter score={score} risk={risk} />

        <div className="flex-1 text-center sm:text-left">
          <div
            className={`inline-flex items-center gap-2 font-display text-xl font-medium ${verdict.className}`}
          >
            <VerdictIcon className="h-5 w-5" strokeWidth={2} />
            {verdict.label}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-wire px-3 py-1 font-mono text-xs text-text-muted">
              Category: <span className="text-paper">{category || "Unclassified"}</span>
            </span>
          </div>

          {reasons.length > 0 && (
            <div className="mt-5">
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                Why we flagged this
              </p>
              <ul className="mt-2 space-y-1.5 text-left">
                {reasons.map((reason, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-paper"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
