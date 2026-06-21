import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error || !user) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin || user.id === "local-dev-user") {
    return NextResponse.json({
      success: true,
      stats: {
        totalScans: 0,
        highRiskScans: 0,
        scamsDetected: 0,
      },
    });
  }

  try {
    const { count: totalScans } = await supabaseAdmin
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { count: highRiskScans } = await supabaseAdmin
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("risk_level", "High");

    const { count: scamsDetected } = await supabaseAdmin
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_scam", true);

    return NextResponse.json({
      success: true,
      stats: {
        totalScans: totalScans || 0,
        highRiskScans: highRiskScans || 0,
        scamsDetected: scamsDetected || 0,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard stats." }, { status: 500 });
  }
}
