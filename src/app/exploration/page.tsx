'use client'

import Link from 'next/link'
import StarfieldCanvas from '@/components/ui/StarfieldCanvas'
import { solarSystemPlanets } from '@/config/solar-system.data'

export default function ExplorationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">LOOKSPACE</p>
            <h1 className="font-orbitron text-xl font-semibold text-white">EXPLORAÇÃO</h1>
          </div>
          <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
            Voltar ao Menu
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_70px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">Rota ativa</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Sistema Solar em expansão</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">A navegação por rotas seguras e setores desconhecidos está sendo preparada com uma camada de exploração dinâmica e interativa.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {solarSystemPlanets.slice(0, 4).map((planet) => (
                <div key={planet.id} className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: planet.color }} />
                    <span className="text-sm font-semibold text-cyan-200">{planet.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{planet.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_70px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">Operações</p>
            <div className="mt-6 space-y-3">
              {[
                ['Mapeamento orbital', 'Escaneamento de rotas de salto'],
                ['Coleta de amostras', 'Análises em corpos celestes'],
                ['Sinal de emergência', 'Resposta imediata a riscos'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
