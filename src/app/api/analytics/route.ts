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
      analytics: {
        activityData: [],
        riskDistribution: [],
        categoryDistribution: [],
      },
    });
  }

  try {
    // 1. Activity Over Time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { data: recentScans, error: recentError } = await supabaseAdmin
      .from("scans")
      .select("created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString());
      
    if (recentError) throw recentError;

    const activityMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      activityMap[dateStr] = 0;
    }
    recentScans.forEach((scan: any) => {
      const dateStr = scan.created_at.split("T")[0];
      if (activityMap[dateStr] !== undefined) {
        activityMap[dateStr]++;
      }
    });
    const activityData = Object.entries(activityMap).map(([date, count]) => ({ date, count }));

    // 2. Risk Distribution
    const { data: riskCounts, error: riskError } = await supabaseAdmin.rpc("get_risk_distribution", {
      uid: user.id,
    });
    let riskDistribution = [];
    if (!riskError && riskCounts) {
      riskDistribution = riskCounts;
    } else {
      // Fallback manual count if RPC doesn't exist
      const { data: allScans } = await supabaseAdmin.from("scans").select("risk_level").eq("user_id", user.id);
      const counts = { High: 0, Medium: 0, Low: 0 };
      allScans?.forEach((s: any) => {
        if (s.risk_level in counts) counts[s.risk_level as keyof typeof counts]++;
      });
      riskDistribution = Object.entries(counts).map(([level, count]) => ({ risk_level: level, count }));
    }

    // 3. Category Distribution
    const { data: categoryCounts, error: catError } = await supabaseAdmin.rpc("get_category_distribution", {
      uid: user.id,
    });
    let categoryDistribution = [];
    if (!catError && categoryCounts) {
      categoryDistribution = categoryCounts;
    } else {
      const { data: allScans } = await supabaseAdmin.from("scans").select("category").eq("user_id", user.id).eq("is_scam", true);
      const counts: Record<string, number> = {};
      allScans?.forEach((s: any) => {
        counts[s.category] = (counts[s.category] || 0) + 1;
      });
      categoryDistribution = Object.entries(counts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
    }

    return NextResponse.json({
      success: true,
      analytics: {
        activityData,
        riskDistribution,
        categoryDistribution,
      },
    });
  } catch (err) {
    console.error("Analytics GET error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics data." }, { status: 500 });
  }
}
