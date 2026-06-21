/**
 * API client — wraps fetch calls to the Next.js App Router API.
 * Automatically attaches the Supabase JWT from the current session.
 */
import { createClient } from "@/lib/supabase/client";

const API_URL = "";

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return headers;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  return res.json();
}

async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {};
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Typed API Functions ────────────────────────────────────────────────────

export const api = {
  // Auth
  syncUser: () => apiRequest("/auth/sync", { method: "POST" }),

  // Profile
  getProfile: () => apiRequest("/profile"),
  updateProfile: (data: { full_name?: string; avatar_url?: string }) =>
    apiRequest("/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Scan
  scanText: (scan_type: string, text: string) =>
    apiRequest("/scan", {
      method: "POST",
      body: JSON.stringify({ scan_type, text }),
    }),
  scanUrl: (url: string) =>
    apiRequest("/scan", {
      method: "POST",
      body: JSON.stringify({ scan_type: "URL", url }),
    }),
  scanFile: (scan_type: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("scan_type", scan_type);
    return apiUpload("/scan", formData);
  },

  // History
  getHistory: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiRequest(`/scans${qs}`);
  },
  getScan: (id: string) => apiRequest(`/scans/${id}`),
  deleteScan: (id: string) =>
    apiRequest(`/scans/${id}`, { method: "DELETE" }),

  // Dashboard
  getDashboardStats: () => apiRequest("/dashboard/stats"),

  // Analytics
  getAnalytics: () => apiRequest("/analytics"),
};
