"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Flame, Loader2, ArrowRight, ArrowLeft, CheckCircle2, Clock, Shield, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type AccountType = "creator" | "brand"

type Profession =
  | "youtuber" | "musician" | "photographer" | "author"
  | "podcaster" | "streamer" | "adult_creator" | "artist"
  | "saas" | "ecommerce" | "media" | "education" | "agency"

interface ProfessionOption {
  id: Profession
  label: string
  emoji: string
  desc: string
  forType: AccountType[]
}

interface PlatformOption {
  id: string
  label: string
  color: string
  emoji: string
  forProfessions: Profession[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROFESSIONS: ProfessionOption[] = [
  { id: "youtuber",      label: "YouTube Creator",       emoji: "🎬", desc: "Long/short form video", forType: ["creator"] },
  { id: "musician",      label: "Musician / Artist",     emoji: "🎵", desc: "Music & audio releases",  forType: ["creator"] },
  { id: "photographer",  label: "Photographer / Visual", emoji: "📸", desc: "Photos, reels & visuals", forType: ["creator"] },
  { id: "author",        label: "Author / Writer",        emoji: "📚", desc: "Books, courses & writing", forType: ["creator"] },
  { id: "podcaster",     label: "Podcaster",              emoji: "🎙️", desc: "Audio shows & episodes",  forType: ["creator"] },
  { id: "streamer",      label: "Live Streamer",          emoji: "🎮", desc: "Live streaming platforms", forType: ["creator"] },
  { id: "adult_creator", label: "Adult Creator",          emoji: "🔞", desc: "Subscription platforms",  forType: ["creator"] },
  { id: "artist",        label: "Illustrator / Designer", emoji: "🎨", desc: "Digital art & design",    forType: ["creator"] },
  { id: "saas",          label: "SaaS / Software",        emoji: "💻", desc: "Apps & software products", forType: ["brand"] },
  { id: "ecommerce",     label: "E-commerce / Retail",    emoji: "🛍️", desc: "Physical & digital goods", forType: ["brand"] },
  { id: "media",         label: "Media & Publishing",     emoji: "📰", desc: "News, podcasts & content", forType: ["brand"] },
  { id: "education",     label: "Education / Courses",    emoji: "🎓", desc: "Online learning content",  forType: ["brand"] },
  { id: "agency",        label: "Agency / Studio",        emoji: "🏢", desc: "Multi-client management",  forType: ["brand"] },
]

const PLATFORMS: PlatformOption[] = [
  { id: "youtube",      label: "YouTube",        color: "#ff4444", emoji: "▶️",  forProfessions: ["youtuber","streamer","musician","podcaster","artist","photographer","media","education"] },
  { id: "tiktok",       label: "TikTok",         color: "#69c9d0", emoji: "🎵",  forProfessions: ["youtuber","musician","photographer","artist","adult_creator"] },
  { id: "instagram",    label: "Instagram",      color: "#e1306c", emoji: "📷",  forProfessions: ["photographer","artist","adult_creator","youtuber","musician","ecommerce"] },
  { id: "spotify",      label: "Spotify",        color: "#1db954", emoji: "🎧",  forProfessions: ["musician","podcaster"] },
  { id: "soundcloud",   label: "SoundCloud",     color: "#ff5500", emoji: "🔊",  forProfessions: ["musician","podcaster"] },
  { id: "apple_music",  label: "Apple Music",    color: "#fc3c44", emoji: "🍎",  forProfessions: ["musician"] },
  { id: "twitch",       label: "Twitch",         color: "#9146ff", emoji: "🎮",  forProfessions: ["streamer","youtuber"] },
  { id: "kick",         label: "Kick",           color: "#53fc18", emoji: "🥊",  forProfessions: ["streamer"] },
  { id: "onlyfans",     label: "OnlyFans",       color: "#00aeef", emoji: "💙",  forProfessions: ["adult_creator","photographer"] },
  { id: "fansly",       label: "Fansly",         color: "#0fa9e6", emoji: "⭐",  forProfessions: ["adult_creator"] },
  { id: "patreon",      label: "Patreon",        color: "#ff424d", emoji: "🎁",  forProfessions: ["musician","artist","author","podcaster","streamer","adult_creator"] },
  { id: "amazon_kdp",   label: "Amazon / KDP",   color: "#ff9900", emoji: "📖",  forProfessions: ["author","education"] },
  { id: "gumroad",      label: "Gumroad",        color: "#ff90e8", emoji: "💾",  forProfessions: ["author","artist","education"] },
  { id: "substack",     label: "Substack",       color: "#ff6719", emoji: "✉️",  forProfessions: ["author","podcaster","media"] },
  { id: "apple_podcast",label: "Apple Podcasts", color: "#9c27b0", emoji: "🎙️",  forProfessions: ["podcaster"] },
  { id: "500px",        label: "500px",          color: "#0099e5", emoji: "📷",  forProfessions: ["photographer"] },
  { id: "behance",      label: "Behance",        color: "#1769ff", emoji: "🎨",  forProfessions: ["artist","photographer"] },
  { id: "dribbble",     label: "Dribbble",       color: "#ea4c89", emoji: "🏀",  forProfessions: ["artist"] },
  { id: "x_twitter",    label: "X / Twitter",    color: "#ffffff", emoji: "𝕏",   forProfessions: ["youtuber","musician","author","podcaster","media","saas"] },
  { id: "telegram",     label: "Telegram",       color: "#2ca5e0", emoji: "✈️",  forProfessions: ["youtuber","adult_creator","musician","media"] },
  { id: "reddit",       label: "Reddit",         color: "#ff4500", emoji: "👽",  forProfessions: ["youtuber","author","saas","education"] },
  { id: "facebook",     label: "Facebook",       color: "#1877f2", emoji: "👥",  forProfessions: ["youtuber","media","ecommerce","education"] },
  { id: "github",       label: "GitHub",         color: "#ffffff", emoji: "🐙",  forProfessions: ["saas"] },
  { id: "etsy",         label: "Etsy",           color: "#f1641e", emoji: "🛍️",  forProfessions: ["artist","ecommerce"] },
  { id: "teachable",    label: "Teachable",      color: "#8b5cf6", emoji: "🎓",  forProfessions: ["education"] },
  { id: "udemy",        label: "Udemy",          color: "#a435f0", emoji: "📖",  forProfessions: ["education"] },
]

// ─── Illustrations ─────────────────────────────────────────────────────────────

function IllustrationCreator() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="110" rx="50" ry="7" fill="#ea580c" fillOpacity="0.1" />
      {/* Person */}
      <circle cx="80" cy="28" r="18" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
      <path d="M55 65 Q80 50 105 65 L110 105 H50 Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="#ea580c" fillOpacity="0.07" />
      {/* Sparkle left */}
      <path d="M30 30 L34 30 M32 28 L32 32 M30.6 28.6 L33.4 31.4 M30.6 31.4 L33.4 28.6" stroke="#ea580c" strokeWidth="1.2" strokeOpacity="0.7" strokeLinecap="round" />
      {/* Sparkle right */}
      <path d="M126 45 L130 45 M128 43 L128 47 M126.6 43.6 L129.4 46.4 M126.6 46.4 L129.4 43.6" stroke="#ea580c" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Camera in hands */}
      <path d="M55 78 L40 86" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
      <rect x="28" y="80" width="20" height="14" rx="2" stroke="#ea580c" strokeWidth="1.2" fill="#ea580c" fillOpacity="0.1" />
      <circle cx="38" cy="87" r="4" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none" />
      {/* Microphone other side */}
      <path d="M105 78 L118 86" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
      <rect x="115" y="78" width="10" height="18" rx="5" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      <path d="M112 96 Q120 102 128 96" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="none" />
    </svg>
  )
}

function IllustrationBrand() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="110" rx="50" ry="7" fill="#ea580c" fillOpacity="0.1" />
      {/* Building */}
      <rect x="40" y="40" width="80" height="70" rx="3" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" fill="#ea580c" fillOpacity="0.06" />
      {/* Windows */}
      {[50,70,90,110].map(x => [50,65,80].map(y => (
        <rect key={`${x}-${y}`} x={x} y={y} width="12" height="9" rx="1" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="white" fillOpacity="0.04" />
      )))}
      {/* Roof flag */}
      <line x1="80" y1="10" x2="80" y2="40" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
      <polygon points="80,10 100,20 80,30" stroke="#ea580c" strokeWidth="1" fill="#ea580c" fillOpacity="0.3" />
      {/* Door */}
      <rect x="68" y="90" width="24" height="20" rx="2" stroke="#ea580c" strokeWidth="1.2" fill="#ea580c" fillOpacity="0.1" />
      <circle cx="80" cy="101" r="2" fill="#ea580c" fillOpacity="0.6" />
    </svg>
  )
}

function IllustrationPlatforms() {
  return (
    <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="92" rx="50" ry="5" fill="#ea580c" fillOpacity="0.1" />
      {/* Central shield */}
      <path d="M80 8 L108 20 L108 52 Q108 74 80 86 Q52 74 52 52 L52 20 Z"
        stroke="#ea580c" strokeWidth="1.5" fill="#ea580c" fillOpacity="0.1" />
      <path d="M66 46 L76 56 L96 36" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Platform bubbles orbiting */}
      <circle cx="20" cy="30" r="12" stroke="#ff4444" strokeWidth="1" fill="#ff4444" fillOpacity="0.08" />
      <text x="14" y="34" fontSize="10" fill="#ff4444" fillOpacity="0.8">▶</text>
      <line x1="32" y1="37" x2="52" y2="44" stroke="#ff4444" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />

      <circle cx="140" cy="30" r="12" stroke="#1db954" strokeWidth="1" fill="#1db954" fillOpacity="0.08" />
      <text x="134" y="35" fontSize="11" fill="#1db954" fillOpacity="0.8">♪</text>
      <line x1="128" y1="37" x2="108" y2="44" stroke="#1db954" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />

      <circle cx="20" cy="75" r="12" stroke="#e1306c" strokeWidth="1" fill="#e1306c" fillOpacity="0.08" />
      <circle cx="20" cy="75" r="6" stroke="#e1306c" strokeWidth="1" fill="none" />
      <circle cx="24" cy="71" r="1.5" fill="#e1306c" fillOpacity="0.7" />
      <line x1="32" y1="70" x2="52" y2="62" stroke="#e1306c" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />

      <circle cx="140" cy="75" r="12" stroke="#9146ff" strokeWidth="1" fill="#9146ff" fillOpacity="0.08" />
      <text x="133" y="80" fontSize="10" fill="#9146ff" fillOpacity="0.8">🎮</text>
      <line x1="128" y1="70" x2="108" y2="62" stroke="#9146ff" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="2 2" />
    </svg>
  )
}

function IllustrationVerify() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="80" cy="113" rx="50" ry="6" fill="#ea580c" fillOpacity="0.1" />
      {/* Document */}
      <rect x="44" y="20" width="72" height="88" rx="4" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="white" fillOpacity="0.03" />
      {/* Fold corner */}
      <path d="M100 20 L116 36 L100 36 Z" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="#ea580c" fillOpacity="0.1" />
      {/* Lines */}
      <line x1="56" y1="48" x2="104" y2="48" stroke="white" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="56" y1="58" x2="104" y2="58" stroke="white" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="56" y1="68" x2="88" y2="68" stroke="white" strokeWidth="1" strokeOpacity="0.25" />
      {/* Stamp / badge */}
      <circle cx="80" cy="90" r="18" stroke="#ea580c" strokeWidth="1.8" fill="#ea580c" fillOpacity="0.1" />
      <circle cx="80" cy="90" r="14" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 2" fill="none" strokeOpacity="0.5" />
      {/* Clock hands inside — pending state */}
      <circle cx="80" cy="90" r="1.5" fill="#ea580c" />
      <line x1="80" y1="90" x2="80" y2="82" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="90" x2="87" y2="90" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Step progress bar ─────────────────────────────────────────────────────────

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-all duration-500",
            i < current ? "bg-orange-500" : i === current ? "bg-orange-500/60" : "bg-white/10"
          )}
        />
      ))}
      <span className="text-xs text-white/30 ml-2 shrink-0">{current + 1}/{total}</span>
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

function OnboardingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = (searchParams.get("type") as AccountType) ?? null
  const detectedUsername = searchParams.get("username") ?? ""

  const [step, setStep] = useState(initialType ? 1 : 0)
  const [accountType, setAccountType] = useState<AccountType | null>(initialType)
  const [profession, setProfession] = useState<Profession | null>(null)
  const [platforms, setPlatforms] = useState<string[]>([])
  const [claimedUsername, setClaimedUsername] = useState(detectedUsername)
  const [fullName, setFullName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()
  const TOTAL_STEPS = 5

  const availableProfessions = PROFESSIONS.filter(p => p.forType.includes(accountType ?? "creator"))
  const availablePlatforms = PLATFORMS.filter(p =>
    profession ? p.forProfessions.includes(profession) : true
  )

  function togglePlatform(id: string) {
    setPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  async function handleComplete() {
    setSaving(true)
    setError("")
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth"); return }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name:             fullName || null,
          account_type:          accountType,
          profession:            profession,
          selected_platforms:    platforms,
          claimed_username:      claimedUsername || null,
          verification_status:   "submitted",
          verification_submitted_at: new Date().toISOString(),
          onboarded:             true,
          updated_at:            new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Also upsert into brands if it's a brand account
      if (accountType === "brand") {
        await supabase.from("brands").upsert({
          user_id:    user.id,
          brand_name: fullName,
          platforms:  platforms,
          onboarded:  true,
        }, { onConflict: "user_id" })
      }

      setStep(4) // verification pending step
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // ── Step 0: Account type ────────────────────────────────────────────────────
  if (step === 0) return (
    <Screen>
      <StepBar current={0} total={TOTAL_STEPS} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Who are you protecting?</h1>
        <p className="text-white/45 text-sm mt-2">This shapes your entire experience</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {([
          { type: "creator" as AccountType, emoji: "🎨", label: "Creator", desc: "I make content — videos, music, photos, writing, or streams", Illo: IllustrationCreator },
          { type: "brand"   as AccountType, emoji: "🏢", label: "Brand",   desc: "I represent a business, product, or creative agency",         Illo: IllustrationBrand },
        ] as const).map(({ type, emoji, label, desc, Illo }) => (
          <button
            key={type}
            onClick={() => { setAccountType(type); setStep(1) }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/3 hover:bg-white/6 hover:border-orange-500/40 transition-all p-6 text-center group"
          >
            <Illo />
            <div>
              <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">{label}</p>
              <p className="text-xs text-white/40 mt-1 leading-relaxed">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Screen>
  )

  // ── Step 1: Profession ──────────────────────────────────────────────────────
  if (step === 1) return (
    <Screen>
      <StepBar current={1} total={TOTAL_STEPS} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          {accountType === "creator" ? "What kind of creator are you?" : "What industry are you in?"}
        </h1>
        <p className="text-white/45 text-sm mt-1">Pick the one that best describes your work</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {availableProfessions.map(p => (
          <button
            key={p.id}
            onClick={() => { setProfession(p.id); setPlatforms([]); setStep(2) }}
            className={cn(
              "flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all",
              profession === p.id
                ? "border-orange-500/60 bg-orange-500/10"
                : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/20"
            )}
          >
            <span className="text-2xl">{p.emoji}</span>
            <p className="text-sm font-medium text-white">{p.label}</p>
            <p className="text-xs text-white/40">{p.desc}</p>
          </button>
        ))}
      </div>
      <NavRow onBack={() => setStep(0)} backLabel="Back" nextLabel={null} />
    </Screen>
  )

  // ── Step 2: Platforms ───────────────────────────────────────────────────────
  if (step === 2) return (
    <Screen>
      <StepBar current={2} total={TOTAL_STEPS} />
      <div className="flex items-center gap-4 mb-6">
        <IllustrationPlatforms />
        <div>
          <h1 className="text-2xl font-bold text-white">Which platforms are you on?</h1>
          <p className="text-white/45 text-sm mt-1">We&apos;ll monitor these for stolen content</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {availablePlatforms.map(p => {
          const selected = platforms.includes(p.id)
          return (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                selected
                  ? "border-orange-500/60 bg-orange-500/8"
                  : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/20"
              )}
            >
              <span className="text-xl">{p.emoji}</span>
              <span className="text-sm text-white/80">{p.label}</span>
              {selected && <CheckCircle2 className="h-4 w-4 text-orange-500 ml-auto shrink-0" />}
            </button>
          )
        })}
      </div>
      {platforms.length > 0 && (
        <p className="text-xs text-white/40 mb-4">{platforms.length} platform{platforms.length !== 1 ? "s" : ""} selected</p>
      )}
      <NavRow
        onBack={() => setStep(1)}
        onNext={() => setStep(3)}
        nextDisabled={platforms.length === 0}
        nextLabel="Continue →"
      />
    </Screen>
  )

  // ── Step 3: Identity & verification ────────────────────────────────────────
  if (step === 3) return (
    <Screen>
      <StepBar current={3} total={TOTAL_STEPS} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Confirm your identity</h1>
        <p className="text-white/45 text-sm mt-1">
          We verify ownership so we can file takedowns on your behalf
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs text-white/50 font-medium">
            {accountType === "brand" ? "Brand / Company name" : "Your full name"}
          </label>
          <input
            type="text"
            placeholder={accountType === "brand" ? "Acme Corp" : "Jane Smith"}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 px-4 py-2.5 text-sm outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-white/50 font-medium">
            Your main username or handle
          </label>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 focus-within:border-orange-500/50 transition-colors">
            <span className="text-white/30 text-sm">@</span>
            <input
              type="text"
              placeholder="yourhandle"
              value={claimedUsername}
              onChange={e => setClaimedUsername(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/25 outline-none"
            />
          </div>
        </div>

        {/* Verification notice */}
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/6 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Manual verification required</p>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                To prevent false takedowns, our team verifies every creator account before enabling full dashboard access.
                You&apos;ll keep your profile and settings — features unlock within 24–48 hours.
              </p>
            </div>
          </div>
          <ul className="space-y-1.5 pl-8">
            {[
              "Link a public social profile to your account",
              "Post a verification code we give you in your bio",
              "Our team reviews and approves within 24–48 hrs",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                <span className="h-4 w-4 rounded-full border border-orange-500/30 text-orange-500 text-[10px] flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      <NavRow
        onBack={() => setStep(2)}
        onNext={handleComplete}
        nextDisabled={!fullName.trim() || saving}
        nextLabel={saving ? undefined : "Submit for verification →"}
        nextLoading={saving}
      />
    </Screen>
  )

  // ── Step 4: Pending verification ────────────────────────────────────────────
  return (
    <Screen maxWidth="max-w-md">
      <div className="text-center space-y-6">
        <IllustrationVerify />

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-xs text-orange-400 mb-4">
            <Clock className="h-3.5 w-3.5" />
            Verification in progress
          </div>
          <h1 className="text-2xl font-bold text-white">You&apos;re in the queue</h1>
          <p className="text-white/45 text-sm mt-2 leading-relaxed">
            Our team will review your account within <strong className="text-white">24–48 hours</strong>.
            You&apos;ll get an email once you&apos;re approved and your dashboard features unlock.
          </p>
        </div>

        {/* What you can do while waiting */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5 text-left space-y-3">
          <p className="text-xs text-white/40 font-medium uppercase tracking-wider">While you wait</p>
          {[
            { icon: "📸", text: `Add your @${claimedUsername || "handle"} to your platform bio` },
            { icon: "🔔", text: "Check your email — we'll notify you instantly when approved" },
            { icon: "📊", text: "Explore your dashboard — some stats are already live" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-white/60">
              <span>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium py-3 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Go to my dashboard
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full text-sm text-white/35 hover:text-white/60 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    </Screen>
  )
}

// ─── Layout helpers ────────────────────────────────────────────────────────────

function Screen({ children, maxWidth = "max-w-2xl" }: { children: React.ReactNode; maxWidth?: string }) {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-bold text-white tracking-tight">TakedownDesk</span>
        </div>
        <span className="text-xs text-white/20">Setting up your protection</span>
      </div>

      <div className={cn("flex-1 mx-auto w-full px-6 py-10", maxWidth)}>
        {children}
      </div>
    </div>
  )
}

function NavRow({
  onBack,
  onNext,
  backLabel = "← Back",
  nextLabel = "Continue →",
  nextDisabled = false,
  nextLoading = false,
}: {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string | null
  nextDisabled?: boolean
  nextLoading?: boolean
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </button>
      ) : <div />}
      {nextLabel !== null && onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-35 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 transition-colors"
        >
          {nextLoading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
            : <>{nextLabel} <ArrowRight className="h-4 w-4" /></>
          }
        </button>
      )}
    </div>
  )
}

// ─── Export ────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    }>
      <OnboardingWizard />
    </Suspense>
  )
}
