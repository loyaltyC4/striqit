"use client"

import React, { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
        scrolled ? 'bg-background/80 backdrop-blur-md border-border/50 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="font-serif text-xl tracking-tight text-foreground font-medium">Takedown Desk</div>
        <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide text-muted-foreground">
          <a href="#manifesto" className="hover:text-foreground transition-colors">Manifesto</a>
          <a href="#capabilities" className="hover:text-foreground transition-colors">Capabilities</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
        </div>
        <div>
          <button
            onClick={() => router.push('/auth?mode=signup')}
            className="text-sm font-medium tracking-wide border border-border px-5 py-2 hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Initiate Access
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300])
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 px-6 md:px-12">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: yHero }} className="w-full h-full opacity-30">
            <Image
              src="/photographer.png"
              alt="Photographer in studio"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight mb-6">
              The invisible shield behind serious work.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Where photographers, musicians, filmmakers, writers, and brands go when they&apos;re done tolerating theft. Precision protection for creative professionals.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <button
              onClick={() => router.push('/auth?mode=signup')}
              className="bg-foreground text-background px-8 py-4 text-sm font-medium tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Establish Protection
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Section 2: Manifesto */}
      <section id="manifesto" className="py-32 px-6 md:px-12 bg-card relative">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">01 — The Standard</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-8">
              Not a legal service.<br />Not a hacker tool.<br />A precision instrument.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-light max-w-3xl">
              We treat your work as your livelihood because it is. We built Takedown Desk to be a quiet, uncompromising force that operates in the background while you focus on what actually matters—creating.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Section 3: Monitoring */}
      <section id="capabilities" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="order-2 md:order-1 relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
            <FadeIn className="h-full w-full absolute inset-0">
              <Image src="/filmmaker.png" alt="Filmmaker on set" fill className="object-cover" />
            </FadeIn>
          </div>
          <div className="order-1 md:order-2">
            <FadeIn>
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">02 — Always Watching</span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">Omnipresent Monitoring</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
                24/7 automated sweeps across the web, social platforms, and streaming networks. We utilize advanced AI fingerprinting for images, video, audio, and written content to find unauthorized use before it spreads.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <ul className="space-y-4 border-t border-border pt-8">
                <li className="flex justify-between items-center text-sm font-medium tracking-wide">
                  <span>Visual Fingerprinting</span>
                  <span className="text-muted-foreground">Active</span>
                </li>
                <li className="flex justify-between items-center text-sm font-medium tracking-wide">
                  <span>Audio Recognition</span>
                  <span className="text-muted-foreground">Active</span>
                </li>
                <li className="flex justify-between items-center text-sm font-medium tracking-wide">
                  <span>Text Analysis</span>
                  <span className="text-muted-foreground">Active</span>
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 4: Takedowns */}
      <section className="py-32 px-6 md:px-12 bg-card">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <FadeIn>
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">03 — Execution</span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">Instant Takedown Filing</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-light">
                No legal jargon. No forms to parse. When a match is found, you receive a real-time detection alert directly. With a single action, our agent-driven protection system files and enforces the DMCA claim.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <button
                onClick={() => router.push('/auth?mode=signup')}
                className="border-b border-foreground pb-1 text-sm font-medium tracking-wide hover:text-primary hover:border-primary transition-colors duration-300"
              >
                Review the Process
              </button>
            </FadeIn>
          </div>
          <div className="relative aspect-square overflow-hidden">
            <FadeIn className="h-full w-full absolute inset-0">
              <Image src="/printed-photo.png" alt="Printed photograph" fill className="object-cover" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 5: The Creators */}
      <section id="architecture" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <span className="text-primary text-sm font-medium tracking-widest uppercase mb-6 block">04 — The Network</span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">Built for the obsessive.</h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Photographers", desc: "Protecting high-res assets, editorials, and fine-art prints from unauthorized commercial use." },
              { title: "Musicians", desc: "Securing stems, unreleased tracks, and masters from early leaks and uncredited sampling." },
              { title: "Filmmakers", desc: "Shielding storyboards, cuts, and cinematic assets across global streaming platforms." },
              { title: "Writers", desc: "Defending manuscripts, articles, and proprietary text against scraping and republication." },
              { title: "Brands", desc: "Maintaining absolute control over brand identity, assets, and proprietary media." },
              { title: "Artists", desc: "Ensuring visual creations remain credited, compensated, and correctly attributed." }
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1} className="border border-border p-8 hover:bg-card transition-colors duration-500">
                <h3 className="font-serif text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Image break */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto aspect-[21/9] overflow-hidden relative">
          <FadeIn className="h-full w-full absolute inset-0">
            <Image
              src="/musician.png"
              alt="Musician in studio"
              fill
              className="object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
          </FadeIn>
        </div>
      </section>

      {/* Footer / CTA */}
      <section className="py-32 px-6 md:px-12 bg-card text-center">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">Stop tolerating theft.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground text-xl font-light mb-12">
              Deploy the agent-driven protection system that runs while you create.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <button
              onClick={() => router.push('/auth?mode=signup')}
              className="bg-foreground text-background px-10 py-5 text-sm font-medium tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Initiate Coverage
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Actual Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-light">
        <div>&copy; {new Date().getFullYear()} Takedown Desk. All rights reserved.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact Intelligence</a>
        </div>
      </footer>
    </div>
  )
}
