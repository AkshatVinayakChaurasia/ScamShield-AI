import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error || !user) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin || user.id === "local-dev-user") {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const { id } = params;
    const { data, error: dbError } = await supabaseAdmin
      .from("scans")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (dbError) {
      if (dbError.code === "PGRST116") {
        return NextResponse.json({ error: "Scan not found or access denied." }, { status: 404 });
      }
      throw dbError;
    }

    return NextResponse.json({ success: true, scan: data });
  } catch (err) {
    console.error("Scan GET error:", err);
    return NextResponse.json({ error: "Failed to fetch scan." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { user, error } = await requireAuth(req);
  if (error || !user) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin || user.id === "local-dev-user") {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const { id } = params;
    const { error: dbError } = await supabaseAdmin
      .from("scans")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, message: "Scan deleted successfully." });
  } catch (err) {
    console.error("Scan DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete scan." }, { status: 500 });
  }
}
