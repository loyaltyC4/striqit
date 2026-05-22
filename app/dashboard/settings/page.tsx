import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, User, Shield } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from("profiles").select("*").single()
  const { data: brand } = await supabase.from("brands").select("*").single()

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-5 w-5 text-white/50" />
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-white/40">Account, plan, and brand configuration</p>
        </div>
      </div>

      {/* Account */}
      <Card className="bg-[#111] border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-white/40" />
            <CardTitle className="text-sm text-white">Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Email</span>
            <span className="text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Full name</span>
            <span className="text-white">{profile?.full_name ?? "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Plan</span>
            <span className="text-orange-400 capitalize font-medium">{profile?.plan ?? "free"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Member since</span>
            <span className="text-white/60">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Brand */}
      {brand && (
        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-400" />
              <CardTitle className="text-sm text-white">Brand</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Brand name</span>
              <span className="text-white">{brand.brand_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Username</span>
              <span className="text-white/60">{brand.username ?? "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Platforms monitored</span>
              <span className="text-white/60">
                {Array.isArray(brand.platforms) ? brand.platforms.length : 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Onboarded</span>
              <span className={brand.onboarded ? "text-emerald-400" : "text-white/30"}>
                {brand.onboarded ? "Yes" : "Pending"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supabase project info */}
      <Card className="bg-[#111] border-white/10">
        <CardHeader>
          <CardTitle className="text-sm text-white">Backend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Supabase project</span>
            <span className="text-white/60 font-mono text-xs">hccgwhhmpmucislxufyp</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Region</span>
            <span className="text-white/60">eu-west-1</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Status</span>
            <span className="text-emerald-400 font-medium">Active & Healthy</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
