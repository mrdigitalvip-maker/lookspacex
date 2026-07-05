'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import StarfieldCanvas from '@/components/ui/StarfieldCanvas'
import { missions } from '@/config/missions.data'
import type { MissionCategory, MissionDifficulty, MissionStatus } from '@/types/mission'

const categoryStyles: Record<MissionCategory, string> = {
  Exploração: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
  Pesquisa: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  Resgate: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  Carga: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  Anomalia: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  Combate: 'border-red-400/30 bg-red-400/10 text-red-200',
  Emergência: 'border-orange-400/30 bg-orange-400/10 text-orange-200',
  Fenômeno: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  'Exploração Livre': 'border-teal-400/30 bg-teal-400/10 text-teal-200',
  História: 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200',
}

const difficultyStars: Record<MissionDifficulty, string> = {
  Fácil: '★☆☆☆',
  Média: '★★☆☆',
  Difícil: '★★★☆',
  Épica: '★★★★',
}

const statusStyles: Record<MissionStatus, string> = {
  Disponível: 'text-cyan-200',
  Aceita: 'text-emerald-200',
  Concluída: 'text-slate-400',
  Bloqueada: 'text-amber-200',
}

export default function MissionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | MissionCategory>('all')

  const filteredMissions = useMemo(() => {
    if (selectedCategory === 'all') {
      return missions
    }

    return missions.filter((mission) => mission.category === selectedCategory)
  }, [selectedCategory])

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">LOOKSPACE</p>
            <h1 className="font-orbitron text-xl font-semibold text-white">MISSÕES</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value as 'all' | MissionCategory)}
              className="rounded-full border border-cyan-400/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 outline-none"
            >
              <option value="all">Todas as categorias</option>
              {Object.keys(categoryStyles).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
              Voltar ao Menu
            </Link>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-2">
          {filteredMissions.map((mission) => (
            <article key={mission.id} className="rounded-[1.75rem] border border-cyan-400/20 bg-slate-950/70 p-5 shadow-[0_0_60px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${categoryStyles[mission.category]}`}>
                  {mission.category}
                </span>
                <span className={`text-sm font-semibold ${statusStyles[mission.status]}`}>{mission.status}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{mission.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{mission.description}</p>
              <div className="mt-4 flex items-center gap-3 text-sm text-cyan-200">
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1">{difficultyStars[mission.difficulty]}</span>
                <span>{mission.difficulty}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-cyan-400/10 bg-slate-900/70 px-3 py-2">XP {mission.reward.xp}</span>
                <span className="rounded-full border border-cyan-400/10 bg-slate-900/70 px-3 py-2">Créditos {mission.reward.credits}</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-400">{mission.objectives[0]?.title}</div>
                <button type="button" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
                  Aceitar Missão
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
