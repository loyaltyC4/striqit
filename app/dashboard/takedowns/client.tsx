"use client"

import { useState } from "react"
import { Gavel, Plus, Loader2, X, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PLATFORMS = [
  "YouTube", "TikTok", "Instagram", "Twitter/X", "Facebook",
  "Telegram", "Reddit", "OnlyFans", "Patreon", "Twitch",
  "Dailymotion", "Vimeo", "Pinterest", "Discord", "Other",
]
const METHODS = ["DMCA", "Platform Report", "Counter-Notice", "Legal Notice"]

interface Takedown {
  id: string
  platform: string
  content: string
  method: string
  status: string
  submitted_at: string
  brand_id: string | null
}
interface Brand { id: string; brand_name: string }
interface Props { takedowns: Takedown[]; brands: Brand[] }

export default function TakedownsClient({ takedowns: initial, brands }: Props) {
  const [takedowns, setTakedowns] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [platform, setPlatform] = useState("")
  const [content, setContent] = useState("")
  const [method, setMethod] = useState("DMCA")
  const [brandId, setBrandId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const grouped = {
    removed: takedowns.filter(t => ["removed", "confirmed"].includes(t.status)).length,
    queued:  takedowns.filter(t => ["queued", "pending"].includes(t.status)).length,
    failed:  takedowns.filter(t => t.status === "failed").length,
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!platform || !content.trim()) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/takedowns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, content: content.trim(), method, brandId: brandId || undefined }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? "Failed to file takedown"); return }
      setTakedowns(prev => [json.takedown, ...prev])
      setPlatform(""); setContent(""); setMethod("DMCA"); setBrandId("")
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
    removed: "success", confirmed: "success",
    queued: "warning", pending: "warning",
    failed: "destructive",
  }
  const statusIcon: Record<string, React.ReactNode> = {
    removed:   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    confirmed: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    queued:    <Clock className="h-3.5 w-3.5 text-amber-400" />,
    pending:   <Clock className="h-3.5 w-3.5 text-amber-400" />,
    failed:    <XCircle className="h-3.5 w-3.5 text-red-400" />,
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Gavel className="h-5 w-5 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Takedowns</h1>
          <p className="text-sm text-white/40">DMCA notices and platform reports filed</p>
        </div>
        <div className="ml-auto">
          <Button
            size="sm"
            onClick={() => setShowForm(v => !v)}
            className="bg-orange-600 hover:bg-orange-500 text-white gap-1.5"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "File takedown"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Removed",  value: grouped.removed, color: "text-emerald-400" },
          { label: "Queued",   value: grouped.queued,  color: "text-amber-400"   },
          { label: "Failed",   value: grouped.failed,  color: "text-red-400"     },
        ].map(({ label, value, color }) => (
          <Card key={label} className="bg-[#111] border-white/10">
            <CardContent className="py-4 flex items-center gap-3">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-sm text-white/40">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* File takedown form */}
      {showForm && (
        <Card className="bg-[#111] border-orange-500/25">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Platform *</label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white px-3 py-2 outline-none focus:border-orange-500/40"
                    required
                  >
                    <option value="">— Select platform —</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Method</label>
                  <select
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white px-3 py-2 outline-none focus:border-orange-500/40"
                  >
                    {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Infringing content URL or description *</label>
                <Input
                  placeholder="https://… or describe the content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25"
                  required
                />
              </div>
              {brands.length > 0 && (
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Brand (optional)</label>
                  <select
                    value={brandId}
                    onChange={e => setBrandId(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 text-sm text-white px-3 py-2 outline-none focus:border-orange-500/40"
                  >
                    <option value="">— No brand —</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.brand_name}</option>)}
                  </select>
                </div>
              )}
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button
                type="submit"
                disabled={submitting || !platform || !content.trim()}
                className="bg-orange-600 hover:bg-orange-500 text-white gap-1.5"
              >
                {submitting
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Filing…</>
                  : <><Gavel className="h-3.5 w-3.5" />File takedown</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="bg-[#111] border-white/10">
        <CardContent className="p-0">
          {takedowns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Gavel className="h-10 w-10 text-white/10 mb-3" />
              <p className="text-white/40 font-medium">No takedowns yet</p>
              <p className="text-sm text-white/20 mt-1">Click &quot;File takedown&quot; to submit your first notice</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-xs text-white/35">
                  <th className="text-left px-6 py-3 font-medium">Content</th>
                  <th className="text-left px-6 py-3 font-medium">Platform</th>
                  <th className="text-left px-6 py-3 font-medium">Method</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {takedowns.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`hover:bg-white/3 transition-colors ${i < takedowns.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <td className="px-6 py-3 text-white max-w-xs truncate text-xs">{t.content}</td>
                    <td className="px-6 py-3 text-white/60">{t.platform}</td>
                    <td className="px-6 py-3 text-white/40 text-xs">{t.method}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        {statusIcon[t.status] ?? <Clock className="h-3.5 w-3.5 text-white/30" />}
                        <Badge variant={statusVariant[t.status] ?? "secondary"}>{t.status}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-white/40 text-xs">
                      {new Date(t.submitted_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
