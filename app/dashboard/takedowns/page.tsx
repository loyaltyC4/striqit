import { createClient } from "@/lib/supabase/server"
import TakedownsClient from "./client"

export default async function TakedownsPage() {
  const supabase = await createClient()

  const [{ data: takedowns }, { data: brands }] = await Promise.all([
    supabase.from("takedowns").select("*").order("submitted_at", { ascending: false }),
    supabase.from("brands").select("id, brand_name"),
  ])

  return <TakedownsClient takedowns={takedowns ?? []} brands={brands ?? []} />
}
