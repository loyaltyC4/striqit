import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, ExternalLink } from "lucide-react"

export default async function DetectionsPage() {
  const supabase = await createClient()
  const { data: detections } = await supabase
    .from("detections")
    .select("*")
    .order("first_seen", { ascending: false })

  const statusColor: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
    removed: "success", confirmed: "success",
    queued: "warning", pending: "warning",
    failed: "destructive",
    new: "secondary",
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Detections</h1>
          <p className="text-sm text-white/40">All stolen content detected across platforms</p>
        </div>
        <div className="ml-auto">
          <span className="text-sm text-white/30">{detections?.length ?? 0} total</span>
        </div>
      </div>

      <Card className="bg-[#111] border-white/10">
        <CardContent className="p-0">
          {!detections?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShieldAlert className="h-10 w-10 text-white/10 mb-3" />
              <p className="text-white/40 font-medium">No detections yet</p>
              <p className="text-sm text-white/20 mt-1">Run a scan to start finding stolen content</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-white/40">
                  <th className="text-left px-6 py-3 font-medium">Content</th>
                  <th className="text-left px-6 py-3 font-medium">Platform</th>
                  <th className="text-left px-6 py-3 font-medium">Confidence</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">First Seen</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {detections.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i === detections.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-6 py-3 text-white font-medium max-w-xs truncate">{d.content_title}</td>
                    <td className="px-6 py-3 text-white/60">{d.platform}</td>
                    <td className="px-6 py-3">
                      <span className={`font-mono text-xs ${d.confidence >= 80 ? "text-red-400" : d.confidence >= 60 ? "text-amber-400" : "text-white/40"}`}>
                        {d.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={statusColor[d.status] ?? "secondary"}>{d.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-white/40 text-xs">
                      {new Date(d.first_seen).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      {d.content_url && (
                        <a href={d.content_url} target="_blank" rel="noopener noreferrer"
                          className="text-white/30 hover:text-orange-400 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
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
