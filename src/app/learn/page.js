import { ShieldAlert, KeyRound, CheckCircle2 } from "lucide-react";
import {
  SCAM_TYPES,
  OTP_SAFETY_TIPS,
  GENERAL_PREVENTION_TIPS,
} from "@/utils/seedLearnContent";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-signal">
        Scam education hub
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
        Learn how scams actually work
      </h1>
      <p className="mt-3 max-w-xl text-text-muted">
        The best defense against fraud is knowing the patterns before you see
        them. Here&apos;s what to watch for.
      </p>

      {/* Common scam types */}
      <section className="mt-12">
        <div className="mb-5 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-alarm" />
          <h2 className="font-display text-xl font-medium text-paper">
            Common scam types
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {SCAM_TYPES.map((scam) => (
            <div
              key={scam.title}
              className="rounded-lg border border-wire bg-ink-raised p-5"
            >
              <h3 className="font-display text-base font-medium text-paper">
                {scam.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {scam.summary}
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-amber">
                Red flags
              </p>
              <ul className="mt-2 space-y-1.5">
                {scam.redFlags.map((flag, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-paper"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* OTP safety */}
      <section className="mt-14">
        <div className="mb-5 flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-signal" />
          <h2 className="font-display text-xl font-medium text-paper">
            OTP safety
          </h2>
        </div>

        <div className="rounded-lg border border-wire bg-ink-raised p-5">
          <ul className="space-y-3">
            {OTP_SAFETY_TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-paper">
                <span className="mt-0.5 shrink-0 font-mono text-xs text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* General prevention */}
      <section className="mt-14 mb-12">
        <div className="mb-5 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-signal" />
          <h2 className="font-display text-xl font-medium text-paper">
            Online fraud prevention
          </h2>
        </div>

        <div className="space-y-3">
          {GENERAL_PREVENTION_TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-lg border border-wire bg-ink-raised p-5"
            >
              <h3 className="font-display text-base font-medium text-paper">
                {tip.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                {tip.detail}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
