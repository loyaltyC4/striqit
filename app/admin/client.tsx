"use client"

import { useState } from "react"
import { Flame, CheckCircle2, XCircle, Clock, Users, Shield, ChevronDown, ChevronUp, Loader2, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  account_type: string | null
  profession: string | null
  claimed_username: string | null
  verification_status: string
  verification_submitted_at: string | null
  verified_at: string | null
  verification_rejected_at: string | null
  verification_notes: string | null
  created_at: string | null
  selected_platforms: string[] | null
}

interface Props {
  adminName: string
  pending: Profile[]
  verified: Profile[]
  rejected: Profile[]
  unverified: Profile[]
}

type Tab = "pending" | "verified" | "rejected" | "unverified"

export default function AdminVerificationClient({ adminName, pending, verified, rejected, unverified }: Props) {
  const [tab, setTab] = useState<Tab>("pending")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [localPending, setLocalPending] = useState(pending)
  const [localVerified, setLocalVerified] = useState(verified)
  const [localRejected, setLocalRejected] = useState(rejected)

  const tabs: { id: Tab; label: string; count: number; color: string }[] = [
    { id: "pending",   label: "Pending Review", count: localPending.length,   color: "text-orange-400" },
    { id: "verified",  label: "Verified",        count: localVerified.length,  color: "text-emerald-400" },
    { id: "rejected",  label: "Rejected",        count: localRejected.length,  color: "text-red-400" },
    { id: "unverified",label: "Not submitted",   count: unverified.length,     color: "text-white/40" },
  ]

  async function handleAction(userId: string, action: "approve" | "reject") {
    setLoading(`${userId}-${action}`)
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, notes: notes[userId] }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error ?? "Something went wrong")
        return
      }
      // Move profile between buckets locally (no page reload needed)
      const profile = localPending.find(p => p.id === userId)
      if (profile) {
        setLocalPending(prev => prev.filter(p => p.id !== userId))
        if (action === "approve") {
          setLocalVerified(prev => [{ ...profile, verification_status: "verified" }, ...prev])
        } else {
          setLocalRejected(prev => [{ ...profile, verification_status: "rejected" }, ...prev])
        }
      }
      setExpanded(null)
    } finally {
      setLoading(null)
    }
  }

  const currentList =
    tab === "pending"    ? localPending :
    tab === "verified"   ? localVerified :
    tab === "rejected"   ? localRejected : unverified

  function timeAgo(ts: string | null) {
    if (!ts) return "—"
    const diff = Date.now() - new Date(ts).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Top bar */}
      <header className="border-b border-white/8 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-bold tracking-tight">TakedownDesk</span>
          <span className="text-white/20 text-sm">·</span>
          <span className="text-sm text-white/40">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40">{adminName}</span>
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Back to dashboard
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Verification Queue</h1>
          <p className="text-sm text-white/40 mt-1">Review and approve creator/brand identity verifications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {tabs.map(t => (
            <Card
              key={t.id}
              className={`bg-[#111] border-white/8 cursor-pointer transition-all ${tab === t.id ? "border-orange-500/40 bg-orange-500/5" : "hover:border-white/15"}`}
              onClick={() => setTab(t.id)}
            >
              <CardContent className="py-4 px-4">
                <p className={`text-2xl font-bold ${t.color}`}>{t.count}</p>
                <p className="text-xs text-white/40 mt-0.5">{t.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* List */}
        <Card className="bg-[#111] border-white/8">
          <CardHeader className="border-b border-white/6 pb-4">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              {tab === "pending" && <><Clock className="h-4 w-4 text-orange-400" /> Pending Review ({localPending.length})</>}
              {tab === "verified" && <><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Verified ({localVerified.length})</>}
              {tab === "rejected" && <><XCircle className="h-4 w-4 text-red-400" /> Rejected ({localRejected.length})</>}
              {tab === "unverified" && <><Users className="h-4 w-4 text-white/40" /> Not Submitted ({unverified.length})</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {currentList.length === 0 ? (
              <div className="py-16 text-center">
                <Shield className="h-8 w-8 text-white/15 mx-auto mb-3" />
                <p className="text-sm text-white/30">Nothing here</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {currentList.map(profile => (
                  <li key={profile.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Avatar + info */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0 text-sm font-bold text-orange-400">
                          {(profile.full_name ?? profile.email ?? "?")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{profile.full_name ?? "—"}</p>
                          <p className="text-xs text-white/40 truncate">{profile.email}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {profile.account_type && (
                              <Badge variant="secondary" className="text-xs capitalize">{profile.account_type}</Badge>
                            )}
                            {profile.profession && (
                              <span className="text-xs text-white/30">{profile.profession}</span>
                            )}
                            {profile.claimed_username && (
                              <span className="text-xs text-orange-400/70">@{profile.claimed_username}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-white/25">
                          {tab === "pending" ? `Submitted ${timeAgo(profile.verification_submitted_at)}` :
                           tab === "verified" ? `Verified ${timeAgo(profile.verified_at)}` :
                           tab === "rejected" ? `Rejected ${timeAgo(profile.verification_rejected_at)}` :
                           `Joined ${timeAgo(profile.created_at)}`}
                        </span>
                        <button
                          onClick={() => setExpanded(expanded === profile.id ? null : profile.id)}
                          className="text-white/30 hover:text-white/60 transition-colors"
                        >
                          {expanded === profile.id
                            ? <ChevronUp className="h-4 w-4" />
                            : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail + actions */}
                    {expanded === profile.id && (
                      <div className="mt-4 ml-12 space-y-4">
                        {/* Platforms */}
                        {profile.selected_platforms?.length ? (
                          <div>
                            <p className="text-xs text-white/30 mb-1.5">Platforms claimed</p>
                            <div className="flex flex-wrap gap-1.5">
                              {profile.selected_platforms.map((p: string) => (
                                <span key={p} className="text-xs bg-white/6 border border-white/8 rounded-full px-2.5 py-0.5 text-white/60">{p}</span>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Existing notes */}
                        {profile.verification_notes && (
                          <div className="rounded-xl bg-white/4 border border-white/8 px-4 py-3">
                            <p className="text-xs text-white/40 mb-1">Notes</p>
                            <p className="text-sm text-white/70">{profile.verification_notes}</p>
                          </div>
                        )}

                        {/* Action area — only for pending */}
                        {tab === "pending" && (
                          <div className="space-y-3">
                            <textarea
                              placeholder="Internal notes (optional)…"
                              value={notes[profile.id] ?? ""}
                              onChange={e => setNotes(prev => ({ ...prev, [profile.id]: e.target.value }))}
                              rows={2}
                              className="w-full rounded-xl bg-white/4 border border-white/8 text-sm text-white/80 placeholder:text-white/25 px-3 py-2 resize-none outline-none focus:border-orange-500/40 transition-colors"
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                onClick={() => handleAction(profile.id, "approve")}
                                disabled={loading !== null}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
                              >
                                {loading === `${profile.id}-approve`
                                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  : <CheckCircle2 className="h-3.5 w-3.5" />}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(profile.id, "reject")}
                                disabled={loading !== null}
                                className="gap-1.5"
                              >
                                {loading === `${profile.id}-reject`
                                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  : <XCircle className="h-3.5 w-3.5" />}
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
