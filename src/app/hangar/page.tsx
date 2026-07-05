'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import StarfieldCanvas from '@/components/ui/StarfieldCanvas'
import { ships } from '@/config/ships.data'
import type { ShipRarity } from '@/types/ship'

const rarityStyles: Record<ShipRarity, string> = {
  common: 'border-slate-400/40 bg-slate-500/20 text-slate-200',
  uncommon: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200',
  rare: 'border-sky-400/40 bg-sky-500/20 text-sky-200',
  epic: 'border-fuchsia-400/40 bg-fuchsia-500/20 text-fuchsia-200',
  legendary: 'border-amber-300/40 bg-amber-500/20 text-amber-200',
}

const classIcons: Record<string, string> = {
  explorer: '🛰️',
  fighter: '⚔️',
  cargo: '📦',
  stealth: '🕶️',
  capital: '🏰',
}

export default function HangarPage() {
  const [selectedClass, setSelectedClass] = useState<string>('all')

  const filteredShips = useMemo(() => {
    if (selectedClass === 'all') {
      return ships
    }

    return ships.filter((ship) => ship.class === selectedClass)
  }, [selectedClass])

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">LOOKSPACE</p>
            <h1 className="font-orbitron text-xl font-semibold text-white">HANGAR</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="rounded-full border border-cyan-400/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 outline-none"
            >
              <option value="all">Todas as classes</option>
              <option value="explorer">Exploradores</option>
              <option value="fighter">Caças</option>
              <option value="cargo">Cargueiros</option>
              <option value="stealth">Furtivas</option>
              <option value="capital">Capitais</option>
            </select>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
              Voltar ao Menu
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredShips.map((ship) => (
            <article key={ship.id} className="relative overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-slate-950/70 p-4 shadow-[0_0_60px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
              {!ship.unlocked ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 text-center text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  BLOQUEADA
                </div>
              ) : null}
              <div className="relative">
                <div className="relative mb-4 h-40 overflow-hidden rounded-[1.25rem] border border-cyan-400/10 bg-slate-900/80">
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 30%, ${ship.placeholder_color}55, transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.08), transparent)` }} />
                  <svg viewBox="0 0 220 120" className="absolute inset-0 m-auto h-24 w-24 rotate-6">
                    <path d="M110 20l22 26h-15v18h-14V46h-15l22-26Zm-7 56h14v18H103V76Zm-15 20h44v10H88v-10Z" fill="rgba(255,255,255,0.9)" />
                  </svg>
                </div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${rarityStyles[ship.rarity]}`}>
                    {ship.rarity}
                  </span>
                  <span className="text-sm text-slate-400">Nível {ship.level}</span>
                </div>
                <h2 className="text-xl font-semibold text-white">{ship.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{ship.manufacturer}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-cyan-200">
                  <span>{classIcons[ship.class] ?? '🚀'}</span>
                  <span className="uppercase tracking-[0.2em]">{ship.class}</span>
                </p>
                <div className="mt-4 space-y-2">
                  {[
                    ['Speed', ship.stats.speed],
                    ['Shield', ship.stats.shield],
                    ['Energy', ship.stats.energy],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${Math.min(100, Number(value))}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-slate-400">{ship.price} cr</span>
                  <Link href={`/hangar/${ship.id}`} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
