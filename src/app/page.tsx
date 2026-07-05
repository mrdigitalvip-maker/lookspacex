'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { StarfieldCanvas } from '@/components/ui/StarfieldCanvas'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

const menuItems = [
  { label: 'INICIAR', href: '/hangar' },
  { label: 'CONTINUAR', href: '/exploration' },
  { label: 'HANGAR', href: '/hangar' },
  { label: 'EXPLORAÇÃO', href: '/exploration' },
  { label: 'CONFIGURAÇÕES', href: '/settings' },
  { label: 'PERFIL', href: '/profile' },
  { label: 'SOBRE', href: '/about' },
]

export default function HomePage() {
  const [phase, setPhase] = useState<'intro' | 'menu'>('intro')
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('menu'), 2500)
    return () => window.clearTimeout(timer)
  }, [])

  const statusLabel = useMemo(() => {
    if (!isSupabaseConfigured()) {
      return 'Modo visitante ativo'
    }

    const client = getSupabaseClient()
    return client ? 'Supabase pronto' : 'Conectando ao Supabase'
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />

      {phase === 'intro' ? (
        <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.6))]" />
          <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />
            <h1 className="font-orbitron text-5xl font-black uppercase tracking-[0.4em] text-cyan-100 drop-shadow-[0_0_20px_rgba(0,245,255,0.7)] sm:text-7xl">
              LOOKSPACE
            </h1>
            <p className="max-w-xl text-sm uppercase tracking-[0.3em] text-slate-400 sm:text-base">
              Abertura cinematográfica · universo vivo · primeira experiência jogável
            </p>
            <button
              type="button"
              onClick={() => setPhase('menu')}
              className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-6 py-3 text-sm uppercase tracking-[0.3em] text-cyan-200 transition hover:bg-cyan-400/20"
            >
              Pressione para continuar
            </button>
          </div>
        </section>
      ) : null}

      {phase === 'menu' ? (
        <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-6 sm:px-10 lg:px-14">
          <div className="flex items-center justify-between">
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
            <section className="flex flex-col justify-between rounded-[2rem] border border-cyan-400/20 bg-slate-950/60 p-8 shadow-[0_0_80px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
              <div>
                <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Launcher AAA</p>
                <h2 className="mt-4 font-orbitron text-4xl font-black uppercase tracking-[0.3em] text-white sm:text-6xl">
                  LOOKSPACE
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Explore sistemas estelares, gerencie sua frota e adentre uma experiência espacial cinematográfica com um universo vivo e responsivo.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group rounded-full border border-cyan-400/20 bg-slate-900/70 px-4 py-2 text-sm uppercase tracking-[0.25em] text-slate-300 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-400/15 hover:text-cyan-100"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="transition group-hover:pl-1">{item.label}</span>
                  </Link>
                ))}
              </div>
            </section>

            <aside className="flex flex-col justify-between rounded-[2rem] border border-cyan-400/20 bg-slate-950/60 p-8 backdrop-blur-2xl">
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
        </div>
      ) : null}

      {showLogin ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 px-4 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 p-8 shadow-[0_0_80px_rgba(0,245,255,0.12)] backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Acesso</p>
                <h3 className="text-2xl font-semibold text-white">{isRegister ? 'Cadastro' : 'Login'}</h3>
              </div>
              <button type="button" onClick={() => setShowLogin(false)} className="text-sm text-slate-400 transition hover:text-cyan-200">
                Fechar
              </button>
            </div>

            <form className="mt-6 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-0"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Senha"
                className="w-full rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none ring-0"
              />
              <label className="flex items-center gap-2 text-sm text-slate-400">
                <input type="checkbox" checked={isRegister} onChange={() => setIsRegister((current) => !current)} />
                Toggle para Cadastro
              </label>
              <button type="button" className="w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-cyan-200 transition hover:bg-cyan-400/20">
                {isRegister ? 'Criar conta' : 'Entrar'}
              </button>
            </form>

            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <p className="cursor-pointer transition hover:text-cyan-200">Esqueci minha senha</p>
              <p className="cursor-pointer transition hover:text-cyan-200">Continuar como Visitante</p>
            </div>

            <div className="mt-6 grid gap-2">
              {['Google', 'Discord', 'GitHub'].map((provider) => (
                <button key={provider} type="button" className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-left text-sm text-slate-300">
                  {provider} <span className="ml-2 text-cyan-300">Em breve</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

