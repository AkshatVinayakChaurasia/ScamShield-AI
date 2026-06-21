"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getProfile().then((p: any) => {
      setFullName(p.full_name || "");
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await api.updateProfile({ full_name: fullName });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-paper">Profile</h1>
        <p className="mt-1 text-text-muted">Manage your account information</p>
      </div>

      <div className="rounded-2xl border border-wire bg-ink-raised p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-signal-dim text-2xl font-bold text-signal">
            {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-display text-lg font-medium text-paper">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
        </div>

        <div className="h-px bg-wire" />

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-text-muted">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
              <input
                type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-wire bg-ink py-3 pl-10 pr-4 text-sm text-paper outline-none focus:border-signal"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-text-muted">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
              <input
                type="email" value={user?.email || ""} disabled
                className="w-full rounded-xl border border-wire bg-ink py-3 pl-10 pr-4 text-sm text-text-dim outline-none cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-text-muted">Member Since</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
              <input
                type="text"
                value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""}
                disabled
                suppressHydrationWarning
                className="w-full rounded-xl border border-wire bg-ink-raised py-2.5 pl-10 pr-4 text-sm text-text-muted opacity-70"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave} disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}
