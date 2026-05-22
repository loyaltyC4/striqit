"use client"

import { useState } from "react"
import { ScanSearch, Plus, Loader2, CheckCircle2, XCircle, Clock, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Scan {
  id: string
  query: string
  status: string
  results_count: number
  created_at: string
  completed_at: string | null
  brand_id: string | null
}

interface Brand { id: string; brand_name: string }

interface Props {
  scans: Scan[]
  brands: Brand[]
}

export default function ScansClient({ scans: initial, brands }: Props) {
  const [scans, setScans] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState("")
  const [brandId, setBrandId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), brandId: brandId || undefined }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? "Failed to start scan"); return }
      setScans(prev => [json.scan, ...prev])
      setQuery("")
      setBrandId("")
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
    completed: "success", running: "warning", failed: "destructive",
  }
  const statusIcon: Record<string, React.ReactNode> = {
    completed: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    running:   <Loader2 className="h-3.5 w-3.5 text-amber-400 animate-spin" />,
    failed:    <XCircle className="h-3.5 w-3.5 text-red-400" />,
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ScanSearch className="h-5 w-5 text-blue-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Scans</h1>
          <p className="text-sm text-white/40">Run content scans across 200+ platforms</p>
        </div>
        <div className="ml-auto">
          <Button
            size="sm"
            onClick={() => setShowForm(v => !v)}
            className="bg-orange-600 hover:bg-orange-500 text-white gap-1.5"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "New scan"}
          </Button>
        </div>
      </div>

      {/* New scan form */}
      {showForm && (
        <Card className="bg-[#111] border-orange-500/25">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Content or username to scan</label>
                <Input
                  placeholder="e.g. @yourhandle or content title…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25"
                  autoFocus
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
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.brand_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={submitting || !query.trim()}
                  className="bg-orange-600 hover:bg-orange-500 text-white gap-1.5"
                >
                  {submitting
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Starting…</>
                    : <><ScanSearch className="h-3.5 w-3.5" />Start scan</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Scan table */}
      <Card className="bg-[#111] border-white/10">
        <CardContent className="p-0">
          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ScanSearch className="h-10 w-10 text-white/10 mb-3" />
              <p className="text-white/40 font-medium">No scans yet</p>
              <p className="text-sm text-white/20 mt-1">Click &quot;New scan&quot; to kick one off</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-xs text-white/35">
                  <th className="text-left px-6 py-3 font-medium">Query</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Results</th>
                  <th className="text-left px-6 py-3 font-medium">Started</th>
                  <th className="text-left px-6 py-3 font-medium">Finished</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`hover:bg-white/3 transition-colors ${i < scans.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <td className="px-6 py-3 text-white font-mono text-xs max-w-xs truncate">{s.query}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        {statusIcon[s.status] ?? <Clock className="h-3.5 w-3.5 text-white/30" />}
                        <Badge variant={statusVariant[s.status] ?? "secondary"}>{s.status}</Badge>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-white/60">{s.results_count}</td>
                    <td className="px-6 py-3 text-white/40 text-xs">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-white/40 text-xs">
                      {s.completed_at ? new Date(s.completed_at).toLocaleString() : "—"}
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
