'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type SVGProps } from 'react'
import LoginModal from '@/components/ui/LoginModal'
import StarfieldCanvas from '@/components/ui/StarfieldCanvas'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

type MenuItem = {
  label: string
  href: string
  Icon: React.ComponentType<SVGProps<SVGSVGElement>>
}

const menuItems: MenuItem[] = [
  { label: 'EXPLORAR', href: '/exploration', Icon: RocketIcon },
  { label: 'MISSÕES', href: '/missions', Icon: TargetIcon },
  { label: 'NAVES', href: '/ships', Icon: ShipIcon },
  { label: 'HANGAR', href: '/hangar', Icon: HangarIcon },
  { label: 'MAPA GALÁCTICO', href: '/galaxy-map', Icon: MapIcon },
  { label: 'PERFIL', href: '/profile', Icon: UserIcon },
  { label: 'CONFIGURAÇÕES', href: '/settings', Icon: SettingsIcon },
  { label: 'CRÉDITOS', href: '/credits', Icon: InfoIcon },
]

export default function HomePage() {
  const [phase, setPhase] = useState<'intro' | 'menu'>('intro')
  const [showLogin, setShowLogin] = useState(false)
  const [displayTitle, setDisplayTitle] = useState('')
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (phase !== 'intro') {
      return
    }

    let index = 0
    const titleTimer = window.setInterval(() => {
      setDisplayTitle('LOOKSPACE'.slice(0, index + 1))
      index += 1
      if (index >= 'LOOKSPACE'.length) {
        window.clearInterval(titleTimer)
      }
    }, 90)

    const subtitleTimer = window.setTimeout(() => setShowSubtitle(true), 2800)
    const promptTimer = window.setTimeout(() => setShowPrompt(true), 4000)

    return () => {
      window.clearInterval(titleTimer)
      window.clearTimeout(subtitleTimer)
      window.clearTimeout(promptTimer)
    }
  }, [phase])

  const statusLabel = useMemo(() => {
    if (!isSupabaseConfigured()) {
      return 'Modo visitante ativo'
    }

    const client = getSupabaseClient()
    return client ? 'Supabase pronto' : 'Conectando ao Supabase'
  }, [])

  const handleContinue = () => {
    if (isTransitioning) {
      return
    }

    setIsTransitioning(true)
    window.setTimeout(() => setPhase('menu'), 600)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />

      {phase === 'intro' ? (
        <section className={`relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.6))]" />
          <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />
            <h1 className="min-h-[1.2em] font-orbitron text-[clamp(3rem,8vw,8rem)] font-black uppercase tracking-[0.4em] text-white drop-shadow-[0_0_20px_#00FFFF] sm:text-[clamp(3.5rem,8vw,8rem)]">
              {displayTitle.split('').map((char, index) => (
                <span key={`${char}-${index}`} className="inline-block transition-all duration-75" style={{ textShadow: index % 2 === 0 ? '0 0 16px #00FFFF' : '0 0 28px #00FFFF' }}>
                  {char}
                </span>
              ))}
            </h1>
            <p className={`max-w-xl text-sm uppercase tracking-[0.35em] text-slate-400 transition-all duration-700 sm:text-base ${showSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              THE UNIVERSE AWAITS
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className={`rounded-full border border-cyan-400/40 bg-cyan-400/10 px-6 py-3 text-sm uppercase tracking-[0.3em] text-cyan-200 transition-all duration-300 hover:bg-cyan-400/20 ${showPrompt ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${isTransitioning ? 'pointer-events-none' : ''}`}
            >
              PRESSIONE PARA CONTINUAR
            </button>
          </div>
        </section>
      ) : null}

      {phase === 'menu' ? (
        <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-6 sm:px-10 lg:px-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300 backdrop-blur-xl">
              v0.1.0 · ALPHA
            </div>
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20"
            >
              LOGIN / PERFIL
            </button>
          </div>

          <div className="mt-8 grid flex-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="flex flex-col justify-between rounded-[2rem] border border-cyan-400/20 bg-slate-950/60 p-6 shadow-[0_0_80px_rgba(0,245,255,0.08)] backdrop-blur-2xl sm:p-8">
              <div>
                <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Launcher AAA</p>
                <h2 className="mt-4 font-orbitron text-4xl font-black uppercase tracking-[0.3em] text-white sm:text-6xl">
                  LOOKSPACE
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Explore sistemas estelares, gerencie sua frota e adentre uma experiência espacial cinematográfica com um universo vivo e responsivo.
                </p>
              </div>
              <nav className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {menuItems.map((item, index) => {
                  const Icon = item.Icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group flex items-center justify-between rounded-2xl border border-cyan-400/15 bg-slate-900/70 px-4 py-3 text-sm uppercase tracking-[0.25em] text-slate-300 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-cyan-100"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-950/70 text-cyan-200 transition group-hover:border-cyan-300 group-hover:text-cyan-100">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="transition group-hover:translate-x-1">{item.label}</span>
                      </span>
                      <span className="text-cyan-400/70 transition group-hover:text-cyan-300">↗</span>
                    </Link>
                  )
                })}
              </nav>
            </section>

            <aside className="flex flex-col justify-between rounded-[2rem] border border-cyan-400/20 bg-slate-950/60 p-6 backdrop-blur-2xl sm:p-8">
              <div>
                <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Piloto</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Conecte-se, ou continue como visitante.</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{statusLabel}</p>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-400">
                <div className="rounded-2xl border border-cyan-400/15 bg-slate-900/70 p-4">
                  <p className="font-semibold text-cyan-200">Status do universo</p>
                  <p className="mt-2">Estrelas, nebulosas e o fundo espacial estão ativos.</p>
                </div>
                <div className="rounded-2xl border border-cyan-400/15 bg-slate-900/70 p-4">
                  <p className="font-semibold text-cyan-200">Próximas atualizações</p>
                  <p className="mt-2">Missões, combate, trade, economia e integração com Supabase.</p>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500">
            <span>v0.1.0 ALPHA</span>
            <span>LOOKSPACE UNIVERSE</span>
          </footer>
        </div>
      ) : null}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </main>
  )
}

function RocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 4c3.5 1.5 6 4.5 7 8-2.5 1-4.5 1.8-7 2.4-1.2-1.1-2.4-2.2-4-3.2 1.2-3.1 2.5-5 4-7.2Z" />
      <path d="M10 11c-.8 1.4-1.9 2.8-3.4 4.1L5 15c1.7-.8 3.2-1.7 4.5-2.7" />
      <path d="M5 15c1 2.1 2.4 4 5 5" />
    </svg>
  )
}

function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  )
}

function ShipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M5 15h14L12 5 5 15Z" />
      <path d="M12 5v10" />
      <path d="M8 15l-2 4h12l-2-4" />
    </svg>
  )
}

function HangarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 10h8" />
      <path d="M8 14h4" />
    </svg>
  )
}

function MapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 6.5 10 4l4 2.5 6-2.5v13l-6 2.5-4-2.5-6 2.5V6.5Z" />
      <path d="M10 4v13" />
      <path d="M14 6.5v13" />
    </svg>
  )
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.5-3.2 3.8-4.8 7-4.8s5.5 1.6 7 4.8" />
    </svg>
  )
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.1l2-1.5-2-3.5-2.4 1a7.2 7.2 0 0 0-1.9-1.1L14 2h-4l-.6 2.9a7.2 7.2 0 0 0-1.9 1.1l-2.4-1-2 3.5 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.1l-2 1.5 2 3.5 2.4-1a7.2 7.2 0 0 0 1.9 1.1L10 22h4l.6-2.9a7.2 7.2 0 0 0 1.9-1.1l2.4 1 2-3.5-2-1.5c.1-.4.1-.7.1-1.1Z" />
    </svg>
  )
}

function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01" />
      <path d="M10.5 11h1.5v5h1.5" />
    </svg>
  )
}

