import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  // Verify the caller is an authenticated admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: caller } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!caller?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { userId, action, notes } = await req.json() as {
    userId: string
    action: "approve" | "reject"
    notes?: string
  }

  if (!userId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const admin = createAdminClient()

  const updates =
    action === "approve"
      ? {
          verification_status: "verified",
          verified_at: new Date().toISOString(),
          verification_rejected_at: null,
          verification_notes: notes ?? null,
        }
      : {
          verification_status: "rejected",
          verified_at: null,
          verification_rejected_at: new Date().toISOString(),
          verification_notes: notes ?? null,
        }

  const { error } = await admin
    .from("profiles")
    .update(updates)
    .eq("id", userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
