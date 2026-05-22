import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShieldAlert, Gavel, ScanSearch, Eye,
  TrendingUp, Clock, CheckCircle2, AlertCircle, Shield, ArrowRight
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all stats in parallel
  const [
    { count: scanCount },
    { count: detectionCount },
    { count: takedownCount },
    { count: watchlistCount },
    { data: recentDetections },
    { data: recentTakedowns },
    { data: profile },
  ] = await Promise.all([
    supabase.from("scans").select("*", { count: "exact", head: true }),
    supabase.from("detections").select("*", { count: "exact", head: true }),
    supabase.from("takedowns").select("*", { count: "exact", head: true }),
    supabase.from("watchlist").select("*", { count: "exact", head: true }),
    supabase.from("detections").select("*").order("first_seen", { ascending: false }).limit(5),
    supabase.from("takedowns").select("*").order("submitted_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("full_name, plan, verification_status, account_type, profession, claimed_username").single(),
  ])

  // Show verification gate if not yet verified
  const verificationStatus = profile?.verification_status ?? "unverified"
  const isVerified = verificationStatus === "verified"
  const isPending  = verificationStatus === "submitted"

  const stats = [
    { label: "Total Scans",      value: scanCount ?? 0,      icon: ScanSearch,   color: "text-blue-400" },
    { label: "Detections",       value: detectionCount ?? 0, icon: ShieldAlert,  color: "text-amber-400" },
    { label: "Takedowns Filed",  value: takedownCount ?? 0,  icon: Gavel,        color: "text-orange-400" },
    { label: "Watchlist Items",  value: watchlistCount ?? 0, icon: Eye,          color: "text-purple-400" },
  ]

  function statusBadge(status: string) {
    const map: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
      removed: "success", confirmed: "success", completed: "success",
      queued: "warning", running: "warning", pending: "warning",
      failed: "destructive", new: "secondary",
    }
    return map[status] ?? "secondary"
  }

  return (
    <div className="p-8 space-y-8">
      {/* Verification banner */}
      {!isVerified && (
        <div className={`rounded-2xl border p-5 flex items-start gap-4 ${
          isPending
            ? "border-orange-500/25 bg-orange-500/6"
            : "border-amber-500/25 bg-amber-500/6"
        }`}>
          <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
            isPending ? "bg-orange-500/15" : "bg-amber-500/15"
          }`}>
            {isPending
              ? <Clock className="h-4 w-4 text-orange-400" />
              : <Shield className="h-4 w-4 text-amber-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">
              {isPending ? "Verification pending — reviewing your account" : "Complete your setup to unlock features"}
            </p>
            <p className="text-xs text-white/45 mt-0.5">
              {isPending
                ? "Our team is reviewing your account. Full dashboard access unlocks within 24–48 hrs."
                : "Finish onboarding so we can verify your identity and start filing takedowns."}
            </p>
          </div>
          {!isPending && (
            <Link
              href="/onboarding"
              className="shrink-0 flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Complete setup <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Overview"}
        </h1>
        <p className="text-sm text-white/40 mt-1">
          {isVerified
            ? "Your enforcement command centre — live data"
            : `${profile?.account_type ?? "Creator"} · ${profile?.profession ?? ""} · Verification ${verificationStatus}`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-[#111] border-white/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs text-white/50 font-medium">{label}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent detections */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-sm text-white">Recent Detections</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {!recentDetections?.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500/50 mb-2" />
                <p className="text-sm text-white/30">No detections yet</p>
                <p className="text-xs text-white/20 mt-1">Start a scan to detect stolen content</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDetections.map(d => (
                  <div key={d.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{d.content_title}</p>
                      <p className="text-xs text-white/40">{d.platform}</p>
                    </div>
                    <Badge variant={statusBadge(d.status)} className="shrink-0">{d.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent takedowns */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gavel className="h-4 w-4 text-orange-400" />
              <CardTitle className="text-sm text-white">Recent Takedowns</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {!recentTakedowns?.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-white/20 mb-2" />
                <p className="text-sm text-white/30">No takedowns filed yet</p>
                <p className="text-xs text-white/20 mt-1">Takedowns will appear here once filed</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTakedowns.map(t => (
                  <div key={t.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{t.content}</p>
                      <p className="text-xs text-white/40">{t.platform} · {t.method}</p>
                    </div>
                    <Badge variant={statusBadge(t.status)} className="shrink-0">{t.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan info */}
      {profile && (
        <Card className="bg-[#111] border-white/10">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <div>
                <p className="text-sm text-white font-medium capitalize">{profile.plan} Plan</p>
                <p className="text-xs text-white/40">Upgrade anytime to unlock more scans and platforms</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/30">
              <Clock className="h-3 w-3" />
              Live data
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
