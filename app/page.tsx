"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Flame, Search, Shield, Zap, Eye, Loader2 } from "lucide-react"

export default function HomePage() {
  const [username, setUsername] = useState("")
  const [detecting, setDetecting] = useState(false)
  const router = useRouter()

  async function handleDetect(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) return
    setDetecting(true)
    // Simulate a brief scan animation, then go to auth with the username
    await new Promise(r => setTimeout(r, 1400))
    router.push(`/auth?username=${encodeURIComponent(username.trim())}&mode=signup`)
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-bold tracking-tight">TakedownDesk</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/50">
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="/auth" className="hover:text-white transition-colors">Sign in</a>
          <a
            href="/auth?mode=signup"
            className="rounded-full bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 transition-colors"
          >
            Get started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Illustration */}
        <div className="mb-10 relative">
          <CreatorIllustration />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-xs text-orange-400 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          14,892 takedowns filed this week
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          They steal it.{" "}
          <span className="text-orange-500">We burn it down.</span>
        </h1>
        <p className="mt-5 text-lg text-white/50 max-w-xl leading-relaxed">
          Enter your creator username. We&apos;ll scan 200+ platforms for stolen content
          and file DMCA takedowns automatically — first removal in under 24 hours.
        </p>

        {/* Detect form */}
        <form
          onSubmit={handleDetect}
          className="mt-10 flex items-center gap-2 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-orange-500/40 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="h-4 w-4 text-white/30 shrink-0" />
            <input
              type="text"
              placeholder="your username or brand name…"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!username.trim() || detecting}
            className="flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 transition-all"
          >
            {detecting ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Scanning…</>
            ) : (
              <><Zap className="h-4 w-4" />Detect</>
            )}
          </button>
        </form>

        <p className="mt-3 text-xs text-white/25">
          Works for creators, brands, photographers, musicians, authors & more
        </p>

        {/* Account type quick-start */}
        <div className="mt-14 flex items-center gap-4">
          <span className="text-sm text-white/30">I&apos;m a</span>
          <button
            onClick={() => router.push("/auth?mode=signup&type=creator")}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2 text-sm text-white/70 hover:text-white transition-all"
          >
            <span>🎨</span> Creator
          </button>
          <button
            onClick={() => router.push("/auth?mode=signup&type=brand")}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-2 text-sm text-white/70 hover:text-white transition-all"
          >
            <span>🏢</span> Brand
          </button>
        </div>
      </main>

      {/* How it works */}
      <section id="how" className="border-t border-white/5 px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-14">
            Three steps to <span className="text-orange-500">total protection</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Search className="h-5 w-5 text-orange-400" />, step: "01", title: "Detect", desc: "Enter your username. Our scanners sweep 200+ platforms for copies of your work within minutes." },
              { icon: <Shield className="h-5 w-5 text-orange-400" />, step: "02", title: "File", desc: "We auto-generate court-ready DMCA notices and submit them on your behalf — anonymously." },
              { icon: <Eye className="h-5 w-5 text-orange-400" />, step: "03", title: "Monitor", desc: "Get real-time alerts when new piracy is detected. We watch so you don't have to." },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="relative p-6 rounded-2xl bg-white/3 border border-white/8">
                <span className="text-xs text-white/20 font-mono">{step}</span>
                <div className="mt-3 mb-3">{icon}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-8 py-6 flex items-center justify-between text-xs text-white/20">
        <span>© 2026 TakedownDesk Inc.</span>
        <span>They steal it. We burn it down.</span>
      </footer>
    </div>
  )
}

function CreatorIllustration() {
  return (
    <svg width="280" height="180" viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow */}
      <ellipse cx="140" cy="160" rx="80" ry="12" fill="#ea580c" fillOpacity="0.12" />

      {/* Central figure — creator with device */}
      <g transform="translate(100, 20)">
        {/* Head */}
        <circle cx="40" cy="22" r="16" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
        {/* Body */}
        <path d="M20 55 Q40 45 60 55 L64 100 H16 Z" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" fill="#ea580c" fillOpacity="0.08" />
        {/* Left arm holding phone */}
        <path d="M20 65 L4 80" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Phone */}
        <rect x="-6" y="74" width="14" height="22" rx="2" stroke="#ea580c" strokeWidth="1.5" fill="#ea580c" fillOpacity="0.12" />
        <line x1="-2" y1="78" x2="4" y2="78" stroke="#ea580c" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="-2" y1="82" x2="4" y2="82" stroke="#ea580c" strokeWidth="1" strokeOpacity="0.4" />
        {/* Right arm — camera */}
        <path d="M60 65 L76 72" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Camera */}
        <rect x="74" y="66" width="22" height="16" rx="2" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
        <circle cx="85" cy="74" r="5" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
        <circle cx="85" cy="74" r="2" fill="#ea580c" fillOpacity="0.7" />
        {/* Legs */}
        <path d="M28 100 L24 130" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        <path d="M52 100 L56 130" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
      </g>

      {/* Floating platform icons */}
      {/* YouTube */}
      <g transform="translate(20, 50)" opacity="0.5">
        <rect width="28" height="20" rx="5" stroke="#ff4444" strokeWidth="1.2" fill="#ff4444" fillOpacity="0.1" />
        <polygon points="11,6 11,14 19,10" fill="#ff4444" fillOpacity="0.7" />
      </g>
      {/* Instagram */}
      <g transform="translate(230, 40)" opacity="0.5">
        <rect x="0" y="0" width="24" height="24" rx="6" stroke="#c026d3" strokeWidth="1.2" fill="#c026d3" fillOpacity="0.1" />
        <circle cx="12" cy="12" r="6" stroke="#c026d3" strokeWidth="1.2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="#c026d3" fillOpacity="0.7" />
      </g>
      {/* Spotify */}
      <g transform="translate(240, 110)" opacity="0.4">
        <circle cx="14" cy="14" r="13" stroke="#22c55e" strokeWidth="1.2" fill="#22c55e" fillOpacity="0.1" />
        <path d="M8 10 Q14 7 20 10" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M8 14 Q14 11 19 14" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M9 18 Q14 15 18 18" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" fill="none" />
      </g>
      {/* TikTok note */}
      <g transform="translate(10, 120)" opacity="0.4">
        <rect width="22" height="26" rx="4" stroke="#ffffff" strokeWidth="1.2" fill="#ffffff" fillOpacity="0.05" />
        <path d="M14 6 Q18 5 18 10 Q18 14 14 14 L14 20" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="21" r="2.5" stroke="#ffffff" strokeWidth="1.2" fill="none" />
      </g>

      {/* Scan lines radiating outward */}
      <line x1="100" y1="65" x2="44" y2="60" stroke="#ea580c" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
      <line x1="180" y1="65" x2="236" y2="52" stroke="#ea580c" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
      <line x1="180" y1="85" x2="240" y2="117" stroke="#ea580c" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
      <line x1="100" y1="90" x2="26" y2="130" stroke="#ea580c" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />

      {/* Shield badge */}
      <g transform="translate(122, 130)">
        <path d="M18 2 L32 8 L32 18 Q32 26 18 32 Q4 26 4 18 L4 8 Z"
          stroke="#ea580c" strokeWidth="1.5" fill="#ea580c" fillOpacity="0.1" />
        <path d="M11 17 L16 22 L25 13" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}
