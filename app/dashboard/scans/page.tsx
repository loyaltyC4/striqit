import { createClient } from "@/lib/supabase/server"
import ScansClient from "./client"

export default async function ScansPage() {
  const supabase = await createClient()

  const [{ data: scans }, { data: brands }] = await Promise.all([
    supabase.from("scans").select("*").order("created_at", { ascending: false }),
    supabase.from("brands").select("id, brand_name"),
  ])

  return <ScansClient scans={scans ?? []} brands={brands ?? []} />
}
