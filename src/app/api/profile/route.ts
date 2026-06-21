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
      profile: {
        id: "local-dev-user",
        full_name: "Local Dev User",
        email: "dev@localhost",
        created_at: new Date().toISOString(),
      },
    });
  }

  try {
    const { data, error: dbError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (dbError) {
      if (dbError.code === "PGRST116") {
        return NextResponse.json({ error: "Profile not found." }, { status: 404 });
      }
      throw dbError;
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error("Profile GET error:", err);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { user, error } = await requireAuth(req);
  if (error || !user) {
    return NextResponse.json({ error: error || "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin || user.id === "local-dev-user") {
    return NextResponse.json({ success: true, message: "Profile updated (mock)." });
  }

  try {
    const body = await req.json();
    const { full_name, avatar_url } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (full_name !== undefined) updates.full_name = full_name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const { data, error: dbError } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error("Profile PUT error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
