import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import AdminVerificationClient from "./client"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth")

  // Check admin flag
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) redirect("/dashboard")

  // Fetch all non-admin profiles using service role (bypasses RLS)
  const admin = createAdminClient()
  const { data: allProfiles } = await admin
    .from("profiles")
    .select("id, email, full_name, account_type, profession, claimed_username, verification_status, verification_submitted_at, verified_at, verification_rejected_at, verification_notes, created_at, selected_platforms, is_admin")
    .eq("is_admin", false)
    .order("verification_submitted_at", { ascending: false, nullsFirst: false })

  const pending   = (allProfiles ?? []).filter(p => p.verification_status === "submitted")
  const verified  = (allProfiles ?? []).filter(p => p.verification_status === "verified")
  const rejected  = (allProfiles ?? []).filter(p => p.verification_status === "rejected")
  const unverified = (allProfiles ?? []).filter(p => p.verification_status === "unverified")

  return (
    <AdminVerificationClient
      adminName={profile.full_name ?? user.email ?? "Admin"}
      pending={pending}
      verified={verified}
      rejected={rejected}
      unverified={unverified}
    />
  )
}
