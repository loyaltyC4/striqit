import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { query, brandId } = await req.json() as { query: string; brandId?: string }
  if (!query?.trim()) return NextResponse.json({ error: "query required" }, { status: 400 })

  const { data: scan, error } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      brand_id: brandId ?? null,
      query: query.trim(),
      status: "running",
      results_count: 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Simulate async completion after a short delay (replace with real worker later)
  // In production this would trigger a background job
  setTimeout(async () => {
    const { createClient: mkClient } = await import("@/lib/supabase/server")
    const bg = await mkClient()
    await bg.from("scans").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", scan.id)
  }, 5000)

  return NextResponse.json({ scan })
}
