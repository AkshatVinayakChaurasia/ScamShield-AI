"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/analyze-text", label: "Analyze Text" },
  { href: "/analyze-url", label: "Analyze URL" },
  { href: "/upload-screenshot", label: "Upload Screenshot" },
  { href: "/reports", label: "Reports" },
  { href: "/learn", label: "Learn" },
];

/**
 * Persistent top navigation. Flat, console-style — no shadow, no gradient.
 * Mobile: collapses into a slide-down menu.
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-wire bg-ink/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-medium tracking-tight text-paper"
          onClick={() => setMobileOpen(false)}
        >
          <ShieldCheck className="h-5 w-5 text-signal" strokeWidth={2} />
          ScamShield<span className="text-signal">AI</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:bg-ink-raised hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="rounded-md p-2 text-paper md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <ul className="flex flex-col border-t border-wire bg-ink px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-md px-3 py-3 text-sm text-text-muted transition-colors hover:bg-ink-raised hover:text-paper"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
