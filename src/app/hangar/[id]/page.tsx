'use client'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import StarfieldCanvas from '@/components/ui/StarfieldCanvas'
import { ships } from '@/config/ships.data'
import type { ShipRarity } from '@/types/ship'

type HangarDetailPageProps = {
  params: {
    id: string
  }
}

const rarityStyles: Record<ShipRarity, string> = {
  common: 'border-slate-400/40 bg-slate-500/20 text-slate-200',
  uncommon: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200',
  rare: 'border-sky-400/40 bg-sky-500/20 text-sky-200',
  epic: 'border-fuchsia-400/40 bg-fuchsia-500/20 text-fuchsia-200',
  legendary: 'border-amber-300/40 bg-amber-500/20 text-amber-200',
}

const statLabels = [
  ['Speed', 'speed'],
  ['Hyperdrive', 'hyperdrive'],
  ['Storage', 'storage'],
  ['Fuel', 'fuel'],
  ['Energy', 'energy'],
  ['Shield', 'shield'],
] as const

export default function HangarDetailPage({ params }: HangarDetailPageProps) {
  const ship = ships.find((item) => item.id === params.id)

  if (!ship) {
    notFound()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">LOOKSPACE</p>
            <h1 className="font-orbitron text-xl font-semibold text-white">DETALHES DA NAVE</h1>
          </div>
          <Link href="/hangar" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
            Voltar ao Hangar
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_70px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
            <div className="relative mb-6 h-72 overflow-hidden rounded-[1.5rem] border border-cyan-400/15 bg-slate-900/80">
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, ${ship.placeholder_color}55, transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.08), transparent)` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 220 120" className="h-32 w-32 animate-[spin_16s_linear_infinite]">
                  <path d="M110 20l22 26h-15v18h-14V46h-15l22-26Zm-7 56h14v18H103V76Zm-15 20h44v10H88v-10Z" fill="rgba(255,255,255,0.94)" />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${rarityStyles[ship.rarity]}`}>
                {ship.rarity}
              </span>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] text-cyan-200">
                Nível {ship.level}
              </span>
            </div>
            <h2 className="mt-5 font-orbitron text-3xl font-semibold text-white">{ship.name}</h2>
            <p className="mt-2 text-sm text-slate-400">{ship.manufacturer}</p>
            <p className="mt-4 leading-7 text-slate-300">{ship.description}</p>
            <p className="mt-4 rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4 text-sm leading-7 text-slate-400">{ship.lore}</p>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_70px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">Status</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{ship.unlocked ? 'Desbloqueada' : 'Bloqueada'}</h3>
                </div>
                {ship.unlocked ? (
                  <button className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
                    Selecionar Nave
                  </button>
                ) : (
                  <button className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-200 transition hover:border-amber-300 hover:bg-amber-400/20">
                    Adquirir • {ship.price} cr
                  </button>
                )}
              </div>
              <div className="mt-6 space-y-3">
                {statLabels.map(([label, key]) => (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                      <span>{label}</span>
                      <span>{ship.stats[key]}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${Math.min(100, ship.stats[key])}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_70px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
              <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">Classe</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{ship.class}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{ship.description}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
