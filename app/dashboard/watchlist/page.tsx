import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

export default async function WatchlistPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("watchlist")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="h-5 w-5 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="text-sm text-white/40">Content being actively monitored for theft</p>
        </div>
        <div className="ml-auto">
          <span className="text-sm text-white/30">{items?.length ?? 0} items</span>
        </div>
      </div>

      <Card className="bg-[#111] border-white/10">
        <CardContent className="p-0">
          {!items?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Eye className="h-10 w-10 text-white/10 mb-3" />
              <p className="text-white/40 font-medium">Watchlist is empty</p>
              <p className="text-sm text-white/20 mt-1">Add content to monitor and protect it automatically</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-white/40">
                  <th className="text-left px-6 py-3 font-medium">Title</th>
                  <th className="text-left px-6 py-3 font-medium">Type</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i === items.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-6 py-3 text-white">{item.title}</td>
                    <td className="px-6 py-3 text-white/60 capitalize">{item.content_type}</td>
                    <td className="px-6 py-3">
                      <Badge variant={item.active ? "success" : "secondary"}>
                        {item.active ? "Active" : "Paused"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-white/40 text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
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
