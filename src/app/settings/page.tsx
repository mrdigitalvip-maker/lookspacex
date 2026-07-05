"use client"

import { useState } from 'react'
import { SpacePage } from '@/components/layout/SpacePage'

export default function SettingsPage() {
  const [volume, setVolume] = useState(70)

  return (
    <SpacePage title="Configurações" subtitle="Controle de áudio" backHref="/">
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="w-full max-w-md rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6">
          <p className="font-orbitron text-sm uppercase tracking-[0.4em] text-cyan-300">Volume</p>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700"
          />
          <p className="mt-4 text-sm text-slate-400">Volume atual: {volume}%</p>
        </div>
      </div>
    </SpacePage>
  )
}
