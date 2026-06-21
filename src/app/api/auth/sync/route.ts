import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error || !user) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin || user.id === "local-dev-user") {
    return NextResponse.json({ success: true, message: "Mock user synced." });
  }

  try {
    const email = user.email || "";
    const fullName = user.user_metadata?.full_name || email.split("@")[0] || "User";

    const { error: dbError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        { 
          id: user.id, 
          email, 
          full_name: fullName, 
          updated_at: new Date().toISOString() 
        },
        { onConflict: "id" }
      );

    if (dbError) {
      console.error("Supabase upsert error:", dbError);
      return NextResponse.json({ error: "Failed to sync user profile." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User synced successfully." });
  } catch (err) {
    console.error("Sync error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
