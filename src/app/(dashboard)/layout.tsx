"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LayoutDashboard, ScanSearch, History,
  BarChart3, BookOpen, FileText, Settings,
  LogOut, Menu, X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

const NAV_MAIN = [
  { href: "/scanner",   label: "Scan",       icon: ScanSearch,     primary: true },
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard, primary: false },
  { href: "/history",   label: "History",    icon: History,         primary: false },
  { href: "/analytics", label: "Analytics",  icon: BarChart3,       primary: false },
];

const NAV_SECONDARY = [
  { href: "/learn",    label: "Learn",    icon: BookOpen },
  { href: "/reports",  label: "Reports",  icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavItem({ href, label, icon: Icon, onClick, primary }: {
  href: string; label: string; icon: React.ElementType; onClick?: () => void; primary?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      id={`nav-${label.toLowerCase()}`}
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-[var(--accent-dim)] text-[var(--accent)]"
          : primary
          ? "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] ring-1 ring-[var(--accent)]/20"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--accent)]"
          style={{ boxShadow: "0 0 8px rgba(59,130,246,0.5)" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon
        className={`h-4 w-4 shrink-0 transition-colors ${
          isActive ? "text-[var(--accent)]" : primary ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
        }`}
        strokeWidth={isActive ? 2.2 : 1.75}
      />
      <span className="leading-none flex-1">{label}</span>
      {primary && !isActive && (
        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--accent)] opacity-70">New</span>
      )}
      {isActive && (
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] opacity-70" />
      )}
    </Link>
  );
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, signOut } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const initials = (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-[var(--accent-dim)]" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#6366F1] opacity-35 blur-[6px]" />
            <Shield className="relative h-4.5 w-4.5 text-[var(--accent)]" strokeWidth={2.5} />
          </div>
          <div>
            <span className="block text-[14px] font-semibold leading-tight tracking-tight text-[var(--text-primary)]">
              ScamShield
            </span>
            <span className="block text-[10px] font-medium leading-tight text-[var(--text-muted)]">
              AI Platform
            </span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--border)]" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Main
          </p>
          {NAV_MAIN.map((item) => (
            <NavItem key={item.href} {...item} onClick={onClose} />
          ))}
        </div>

        <div className="my-4 mx-2 h-px bg-[var(--border)]" />

        <div className="space-y-0.5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Tools
          </p>
          {NAV_SECONDARY.map((item) => (
            <NavItem key={item.href} {...item} onClick={onClose} />
          ))}
        </div>
      </nav>

      {/* Bottom — Profile + Controls */}
      <div className="shrink-0 px-3 pb-4 pt-2">
        <div className="mx-1 mb-2 h-px bg-[var(--border)]" />

        {/* User card */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-tight text-[var(--text-primary)]">
              {displayName}
            </p>
            <p className="truncate text-[11px] leading-tight text-[var(--text-muted)] mt-0.5">
              {email}
            </p>
          </div>
        </div>

        {/* Controls row */}
        <div className="mt-1 flex items-center gap-1 px-1">
          <ThemeToggle className="lg:hidden" />
          <button
            id="sign-out-btn"
            onClick={signOut}
            className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[var(--text-muted)] transition-all hover:bg-[var(--red-dim)] hover:text-[var(--red)]"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar — floating glass panel */}
      <aside className="hidden lg:flex w-[220px] shrink-0 flex-col">
        <div className="m-3 flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-2xl">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile Sidebar — slide-over */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--border)] bg-[var(--bg-surface)] backdrop-blur-2xl lg:hidden"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="relative flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--glass-bg)] backdrop-blur-xl px-4 lg:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
            <span className="text-[14px] font-semibold tracking-tight text-[var(--text-primary)]">
              ScamShield AI
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="pointer-events-none sticky top-0 z-20 hidden h-0 justify-end px-6 pt-4 lg:flex">
            <div className="pointer-events-auto">
              <ThemeToggle />
            </div>
          </div>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
