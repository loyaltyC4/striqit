"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Flame, Loader2, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function AuthForm() {
  const searchParams = useSearchParams()
  const detectedUsername = searchParams.get("username") ?? ""
  const initialMode = (searchParams.get("mode") as "signin" | "signup") ?? "signin"
  const accountType = searchParams.get("type") ?? ""

  const [mode, setMode] = useState<"signin" | "signup">(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        // Check if already onboarded
        const { data: profile } = await supabase.from("profiles").select("onboarded").single()
        if (profile?.onboarded) {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
        router.refresh()
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else if (data.session) {
        // Auto-confirmed — go straight to onboarding
        const onboardingUrl = `/onboarding?username=${encodeURIComponent(detectedUsername)}&type=${encodeURIComponent(accountType)}`
        router.push(onboardingUrl)
      } else {
        setMessage("Check your inbox and confirm your email, then sign in to continue.")
        setMode("signin")
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold text-white tracking-tight">TakedownDesk</span>
        </div>

        {/* Detected username context */}
        {detectedUsername && mode === "signup" && (
          <div className="rounded-xl bg-orange-500/8 border border-orange-500/20 px-4 py-3 flex items-center gap-3">
            <Search className="h-4 w-4 text-orange-400 shrink-0" />
            <div>
              <p className="text-xs text-orange-400/70">Protecting username</p>
              <p className="text-sm text-orange-300 font-medium">@{detectedUsername}</p>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#111] p-6 space-y-5">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {mode === "signin"
                ? "Sign in to your enforcement command centre"
                : accountType === "brand"
                  ? "Start protecting your brand's IP"
                  : "Start protecting your creative work"}
            </p>
          </div>

          {message && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-orange-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-orange-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account →"}
            </Button>
          </form>

          <p className="text-center text-sm text-white/35">
            {mode === "signin" ? "No account? " : "Already have one? "}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError("") }}
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              {mode === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-white/20">
          © 2026 TakedownDesk Inc. · They steal it. We burn it down.
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}
