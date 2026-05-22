import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { platform, content, method, brandId } = await req.json() as {
    platform: string
    content: string
    method?: string
    brandId?: string
  }

  if (!platform?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "platform and content are required" }, { status: 400 })
  }

  const { data: takedown, error } = await supabase
    .from("takedowns")
    .insert({
      user_id: user.id,
      brand_id: brandId ?? null,
      platform: platform.trim(),
      content: content.trim(),
      method: method ?? "DMCA",
      status: "queued",
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ takedown })
}
