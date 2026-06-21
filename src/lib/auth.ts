import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  if (!supabaseAdmin) {
    // Graceful degradation when DB is unavailable for local testing
    return { user: { id: "local-dev-user" }, error: null };
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Authorization header is required." };
  }

  const token = authHeader.substring(7);

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return { user: null, error: "Invalid or expired session token." };
    }
    return { user: data.user, error: null };
  } catch (err) {
    console.error("Auth helper error:", err);
    return { user: null, error: "Authentication check failed." };
  }
}
