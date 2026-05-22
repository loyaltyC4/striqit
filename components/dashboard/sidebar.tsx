"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, ScanSearch, ShieldAlert, Gavel,
  Eye, Activity, Settings, LogOut, Flame, ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/dashboard",              icon: LayoutDashboard, label: "Overview"   },
  { href: "/dashboard/scans",        icon: ScanSearch,      label: "Scans"       },
  { href: "/dashboard/detections",   icon: ShieldAlert,     label: "Detections"  },
  { href: "/dashboard/takedowns",    icon: Gavel,           label: "Takedowns"   },
  { href: "/dashboard/watchlist",    icon: Eye,             label: "Watchlist"   },
  { href: "/dashboard/activity",     icon: Activity,        label: "Activity"    },
  { href: "/dashboard/settings",     icon: Settings,        label: "Settings"    },
]

export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from("profiles").select("is_admin").eq("id", user.id).single()
        .then(({ data }) => { if (data?.is_admin) setIsAdmin(true) })
    })
  }, [supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/auth")
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/10 bg-black">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <Flame className="h-5 w-5 text-orange-500" />
        <span className="font-bold text-white tracking-tight">TakedownDesk</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mt-2",
              pathname.startsWith("/admin")
                ? "bg-orange-500/15 text-orange-400 font-medium"
                : "text-orange-400/50 hover:text-orange-400 hover:bg-orange-500/8"
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Admin Panel
          </Link>
        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
