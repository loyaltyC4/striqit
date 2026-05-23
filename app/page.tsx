"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

/* ─── tiny fade-in hook ─────────────────────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── navigation ────────────────────────────────────────────────── */
function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.5s",
        padding: scrolled ? "1rem 0" : "1.5rem 0",
        background: scrolled ? "hsl(40 20% 97% / 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid hsl(0 0% 85% / 0.5)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="font-serif text-xl tracking-tight text-foreground font-medium">
          Takedown Desk
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-muted-foreground">
          <a href="#manifesto" className="hover:text-foreground transition-colors">Manifesto</a>
          <a href="#capabilities" className="hover:text-foreground transition-colors">Capabilities</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/auth"
            className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </a>
          <a
            href="/auth?mode=signup"
            className="text-sm font-medium tracking-wide border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Initiate Access
          </a>
        </div>
      </div>
    </nav>
  )
}

/* ─── page ──────────────────────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 md:px-12">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/photographer.png"
            alt="Photographer in studio"
            fill
            priority
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight mb-6">
              The invisible shield behind serious work.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Where photographers, musicians, filmmakers, writers, and brands go when
              they&apos;re done tolerating theft. Precision protection for creative professionals.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <button
              onClick={() => router.push("/auth?mode=signup")}
              className="bg-foreground text-background px-8 py-4 text-sm font-medium tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Establish Protection
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="py-32 px-6 md:px-12 bg-card">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">
              01 — The Standard
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-8">
              Not a legal service.<br />
              Not a hacker tool.<br />
              A precision instrument.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-light max-w-3xl">
              We treat your work as your livelihood because it is. We built Takedown Desk
              to be a quiet, uncompromising force that operates in the background while
              you focus on what actually matters — creating.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Monitoring */}
      <section id="capabilities" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="order-2 md:order-1 relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
            <FadeIn className="h-full w-full absolute inset-0">
              <Image src="/filmmaker.png" alt="Filmmaker on set" fill className="object-cover" />
            </FadeIn>
          </div>
          <div className="order-1 md:order-2">
            <FadeIn>
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">
                02 — Always Watching
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                Omnipresent Monitoring
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
                24/7 automated sweeps across the web, social platforms, and streaming networks.
                Advanced AI fingerprinting for images, video, audio, and written content finds
                unauthorised use before it spreads.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <ul className="space-y-4 border-t border-border pt-8">
                {["Visual Fingerprinting", "Audio Recognition", "Text Analysis"].map((item) => (
                  <li key={item} className="flex justify-between items-center text-sm font-medium tracking-wide">
                    <span>{item}</span>
                    <span className="text-muted-foreground">Active</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Takedowns */}
      <section className="py-32 px-6 md:px-12 bg-card">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <FadeIn>
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">
                03 — Execution
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                Instant Takedown Filing
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
                No legal jargon. No forms to parse. When a match is found, you receive a
                real-time detection alert. With a single action, our agent-driven protection
                system files and enforces the DMCA claim.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <button
                onClick={() => router.push("/auth?mode=signup")}
                className="border-b border-foreground pb-1 text-sm font-medium tracking-wide hover:text-primary hover:border-primary transition-colors duration-300"
              >
                Review the Process
              </button>
            </FadeIn>
          </div>
          <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
            <FadeIn className="h-full w-full absolute inset-0">
              <Image src="/printed-photo.png" alt="Printed photograph" fill className="object-cover" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Creator Grid */}
      <section id="architecture" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">
                04 — The Network
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                Built for the obsessive.
              </h2>
            </FadeIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Photographers", desc: "Protecting high-res assets, editorials, and fine-art prints from unauthorised commercial use." },
              { title: "Musicians", desc: "Securing stems, unreleased tracks, and masters from early leaks and uncredited sampling." },
              { title: "Filmmakers", desc: "Shielding storyboards, cuts, and cinematic assets across global streaming platforms." },
              { title: "Writers", desc: "Defending manuscripts, articles, and proprietary text against scraping and republication." },
              { title: "Brands", desc: "Maintaining absolute control over brand identity, assets, and proprietary media." },
              { title: "Artists", desc: "Ensuring visual creations remain credited, compensated, and correctly attributed." },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08} className="border border-border p-8 hover:bg-card transition-colors duration-500 cursor-default">
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width image break */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "21/9" }}>
              <Image
                src="/musician.png"
                alt="Musician in studio"
                fill
                className="object-cover"
                style={{ objectPosition: "center 30%" }}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 md:px-12 bg-card text-center">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">
              Stop tolerating theft.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground text-xl font-light mb-12">
              Deploy the agent-driven protection system that runs while you create.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <button
              onClick={() => router.push("/auth?mode=signup")}
              className="bg-foreground text-background px-10 py-5 text-sm font-medium tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Initiate Coverage
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-light">
        <div>&copy; {new Date().getFullYear()} Takedown Desk. All rights reserved.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="/auth" className="hover:text-foreground transition-colors">Sign In</a>
        </div>
      </footer>
    </div>
  )
}
