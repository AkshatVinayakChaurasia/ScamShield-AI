"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      type="button"
      id="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-raised)]/70 text-[var(--text-secondary)] shadow-sm transition-all duration-150 hover:-translate-y-px hover:border-[var(--accent-mid)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
