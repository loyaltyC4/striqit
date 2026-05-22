import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Activity } from "lucide-react"

export default async function ActivityPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-5 w-5 text-green-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Log</h1>
          <p className="text-sm text-white/40">All system events and enforcement actions</p>
        </div>
      </div>

      <Card className="bg-[#111] border-white/10">
        <CardContent className="p-0">
          {!logs?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Activity className="h-10 w-10 text-white/10 mb-3" />
              <p className="text-white/40 font-medium">No activity yet</p>
              <p className="text-sm text-white/20 mt-1">Events will be logged here as TakedownDesk takes action</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {logs.map(log => (
                <div key={log.id} className="px-6 py-4 flex items-start gap-4">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-white/80 font-mono text-xs uppercase tracking-wide text-orange-400/80">
                        {log.event_type}
                      </p>
                      <time className="text-xs text-white/30 shrink-0">
                        {new Date(log.created_at).toLocaleString()}
                      </time>
                    </div>
                    <p className="text-sm text-white/60 mt-0.5">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
