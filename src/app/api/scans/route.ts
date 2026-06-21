import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error || !user) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin || user.id === "local-dev-user") {
    return NextResponse.json({ success: true, scans: [] });
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const filter = searchParams.get("filter");

    let query = supabaseAdmin
      .from("scans")
      .select("id, scan_type, is_scam, risk_level, category, created_at, input_text")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (filter === "scams") {
      query = query.eq("is_scam", true);
    } else if (filter === "high_risk") {
      query = query.eq("risk_level", "High");
    } else if (filter === "safe") {
      query = query.eq("risk_level", "Low");
    }

    const { data, error: dbError } = await query;
    if (dbError) throw dbError;

    // Truncate long texts for history list
    const scans = data.map((scan: any) => ({
      ...scan,
      input_text: scan.input_text && scan.input_text.length > 100 
        ? scan.input_text.substring(0, 100) + "..." 
        : scan.input_text
    }));

    return NextResponse.json({ success: true, scans });
  } catch (err) {
    console.error("History GET error:", err);
    return NextResponse.json({ error: "Failed to fetch scan history." }, { status: 500 });
  }
}
