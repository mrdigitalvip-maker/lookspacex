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

export default function ShipsPage() {
  const [selectedRarity, setSelectedRarity] = useState<'all' | ShipRarity>('all')

  const filteredShips = useMemo(() => {
    if (selectedRarity === 'all') {
      return ships
    }

    return ships.filter((ship) => ship.rarity === selectedRarity)
  }, [selectedRarity])

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">LOOKSPACE</p>
            <h1 className="font-orbitron text-xl font-semibold text-white">FROTA</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedRarity}
              onChange={(event) => setSelectedRarity(event.target.value as 'all' | ShipRarity)}
              className="rounded-full border border-cyan-400/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 outline-none"
            >
              <option value="all">Todas as raridades</option>
              <option value="common">Comum</option>
              <option value="uncommon">Incomum</option>
              <option value="rare">Rara</option>
              <option value="epic">Épica</option>
              <option value="legendary">Lendária</option>
            </select>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
              Voltar ao Menu
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_70px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
          <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">Catálogo</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-white">Naves da frota atual</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">Cada nave é um bloco de gameplay, desde exploradores leves até capitais de guerra.</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 px-4 py-3 text-sm text-cyan-200">
              {filteredShips.length} embarcações disponíveis
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {filteredShips.map((ship) => (
            <article key={ship.id} className="rounded-[1.75rem] border border-cyan-400/20 bg-slate-950/70 p-5 shadow-[0_0_60px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${rarityStyles[ship.rarity]}`}>
                  {ship.rarity}
                </span>
                <span className="text-sm text-slate-400">Nível {ship.level}</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">{ship.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{ship.manufacturer}</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">{ship.description}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-cyan-400/10 bg-slate-900/70 px-3 py-2">Velocidade {ship.stats.speed}</span>
                <span className="rounded-full border border-cyan-400/10 bg-slate-900/70 px-3 py-2">Escudo {ship.stats.shield}</span>
                <span className="rounded-full border border-cyan-400/10 bg-slate-900/70 px-3 py-2">Energia {ship.stats.energy}</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-400">{ship.price} cr</span>
                <Link href={`/hangar/${ship.id}`} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
                  Ver em Detalhes
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
