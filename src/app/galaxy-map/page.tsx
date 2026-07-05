'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import StarfieldCanvas from '@/components/ui/StarfieldCanvas'
import { solarSystemPlanets } from '@/config/solar-system.data'

export default function GalaxyMapPage() {
  const [selectedPlanet, setSelectedPlanet] = useState(solarSystemPlanets[2])
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      setZoom((current) => Math.min(3, Math.max(0.5, current - event.deltaY * 0.0008)))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: event.clientX - offset.x, y: event.clientY - offset.y }
    setIsDragging(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return
    }

    setOffset({ x: event.clientX - dragRef.current.x, y: event.clientY - dragRef.current.y })
  }

  const handlePointerUp = () => setIsDragging(false)

  const centerMap = () => {
    setOffset({ x: 0, y: 0 })
    setZoom(1)
  }

  const card = useMemo(() => selectedPlanet, [selectedPlanet])

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-slate-100">
      <StarfieldCanvas />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,245,255,0.08),_transparent_45%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
          <div>
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">LOOKSPACE</p>
            <h1 className="font-orbitron text-xl font-semibold text-white">MAPA GALÁCTICO</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={centerMap} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
              Centralizar
            </button>
            <Link href="/" className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-400/20">
              Voltar ao Menu
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-3 shadow-[0_0_80px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
            <div
              className="relative h-[70vh] min-h-[560px] overflow-hidden rounded-[1.5rem] border border-cyan-400/15 bg-black"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-400/40 bg-yellow-400/20 shadow-[0_0_80px_rgba(250,204,21,0.4)]" />
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/70 shadow-[0_0_100px_rgba(253,224,71,0.7)] animate-pulse" />

              <div className="absolute inset-0" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
                {solarSystemPlanets.map((planet, index) => {
                  const orbitSize = 110 + index * 58
                  const angle = (Date.now() / 1000) * planet.velocity_orbita + index * 0.8
                  const x = Math.cos(angle) * orbitSize
                  const y = Math.sin(angle) * orbitSize
                  return (
                    <div key={planet.id} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute" style={{ transform: `translate(${x}px, ${y}px)` }}>
                        <button
                          type="button"
                          onClick={() => setSelectedPlanet(planet)}
                          className="flex flex-col items-center gap-2 rounded-full transition hover:scale-110"
                        >
                          <div className="rounded-full border border-white/10" style={{ width: planet.radius_visual * 2, height: planet.radius_visual * 2, backgroundColor: planet.color, boxShadow: `0 0 30px ${planet.color}` }} />
                          {planet.name === 'Saturno' ? <div className="h-1 w-14 rounded-full border border-yellow-200/40" style={{ backgroundColor: '#d4af37' }} /> : null}
                          <span className="text-xs uppercase tracking-[0.2em] text-slate-300">{planet.name}</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/70 p-6 shadow-[0_0_70px_rgba(0,245,255,0.08)] backdrop-blur-2xl">
            <p className="font-orbitron text-xs uppercase tracking-[0.35em] text-cyan-300">Destino Atual</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{card.name}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">{card.description}</p>
            <div className="mt-6 space-y-3 rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Nível recomendado</span><span className="text-cyan-200">{card.nivel_recomendado}</span></div>
              <div className="flex items-center justify-between"><span>Status</span><span className="text-cyan-200">{card.status}</span></div>
              <div className="flex items-center justify-between"><span>Distância da Terra</span><span className="text-cyan-200">{card.distance_sol.toFixed(2)} UA</span></div>
            </div>
            <button type="button" className="mt-6 w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-cyan-200 transition hover:bg-cyan-400/20">
              Viajar
            </button>
          </aside>
        </section>
      </div>
    </main>
  )
}
