import Link from "next/link";
import { FileText, Link2, ImageUp, ArrowRight } from "lucide-react";

const CTA_BUTTONS = [
  { href: "/analyze-text", label: "Analyze text", icon: FileText },
  { href: "/analyze-url", label: "Analyze URL", icon: Link2 },
  { href: "/upload-screenshot", label: "Upload screenshot", icon: ImageUp },
];

/**
 * Home page hero. Left: headline + CTAs. Right: oscilloscope-style
 * risk readout, purely decorative, evokes a live security scan.
 * Wrapped in .scan-lines for the page's signature animated texture.
 */
export default function Hero() {
  return (
    <section className="scan-lines border-b border-wire">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
        {/* Left: headline + CTAs */}
        <div className="relative z-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-signal">
            Cybersecurity + AI · Elevate 2026
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-paper sm:text-5xl">
            Detect scams
            <br />
            before they detect you.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-muted">
            Paste a message, drop in a link, or upload a screenshot.
            ScamShield AI scans it for phishing, fraud, and impersonation
            patterns in seconds — and tells you exactly why it&apos;s risky.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {CTA_BUTTONS.map(({ href, label, icon: Icon }, i) => (
              <Link
                key={href}
                href={href}
                className={`group inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
                  i === 0
                    ? "bg-signal text-ink hover:bg-signal/90"
                    : "border border-wire text-paper hover:bg-ink-raised"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {label}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right: oscilloscope-style risk readout (decorative) */}
        <div className="relative z-10" aria-hidden="true">
          <div className="rounded-lg border border-wire bg-ink-raised p-5">
            <div className="mb-4 flex items-center justify-between font-mono text-xs text-text-muted">
              <span>LIVE_SCAN.LOG</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                ACTIVE
              </span>
            </div>

            <svg
              viewBox="0 0 400 120"
              className="h-28 w-full"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,60 30,60 40,30 50,90 60,20 70,100 80,60 110,60 120,55 130,65 140,60 170,60 180,40 190,80 200,60 230,60 240,15 250,105 260,60 290,60 300,50 310,70 320,60 350,60 360,35 370,85 380,60 400,60"
                fill="none"
                stroke="#3ddc97"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <line
                x1="0"
                y1="60"
                x2="400"
                y2="60"
                stroke="#27344a"
                strokeWidth="1"
              />
            </svg>

            <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="rounded border border-wire-soft px-2 py-2">
                <p className="text-text-muted">Scanned</p>
                <p className="mt-1 text-paper">14,302</p>
              </div>
              <div className="rounded border border-wire-soft px-2 py-2">
                <p className="text-text-muted">Flagged</p>
                <p className="mt-1 text-alarm">1,847</p>
              </div>
              <div className="rounded border border-wire-soft px-2 py-2">
                <p className="text-text-muted">Avg. risk</p>
                <p className="mt-1 text-amber">Medium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
