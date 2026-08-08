import { usePlayerStore } from '@/stores/playerStore'
import { useShipStore } from '@/stores/shipStore'
import { useUIStore } from '@/stores/uiStore'

export function SpaceHUD() {
  const stats = usePlayerStore((state) => state.stats)
  const ship = useShipStore((state) => state.currentShip)
  const velocity = useShipStore((state) => state.velocity)
  const fuel = useShipStore((state) => state.fuel)
  const shield = useShipStore((state) => state.shield)
  const energy = useShipStore((state) => state.energy)
  const notifications = useUIStore((state) => state.notifications)

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute left-4 top-4 rounded-[1.5rem] border border-cyan-400/20 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Piloto</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-200">L</div>
          <div>
            <p className="text-sm font-semibold text-white">{stats?.level ?? 1}</p>
            <p className="text-xs text-slate-400">Nível {stats?.level ?? 1}</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${Math.min(100, ((stats?.xp ?? 0) % 1000) / 10)}%` }} />
        </div>
      </div>

      <div className="absolute right-4 top-4 rounded-[1.5rem] border border-cyan-400/20 bg-slate-950/70 px-4 py-3 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Créditos</p>
        <p className="mt-2 text-lg font-semibold text-white">{stats?.credits ?? 1000}</p>
        <div className="mt-2 space-y-1 text-xs text-slate-300">
          {notifications.slice(0, 2).map((item) => (
            <div key={item.id} className="rounded-full border border-cyan-400/10 bg-slate-900/70 px-2 py-1">
              {item.message}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-[1.5rem] border border-cyan-400/20 bg-slate-950/70 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-cyan-300" />
          <span className="text-xs uppercase tracking-[0.35em] text-cyan-300">Radar</span>
        </div>
        <div className="mt-3 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-900/80">
          <div className="h-16 w-16 rounded-full border border-cyan-400/10" />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 rounded-[1.5rem] border border-cyan-400/20 bg-slate-950/70 p-4 backdrop-blur-xl">
        <div className="space-y-2 text-xs uppercase tracking-[0.2em] text-slate-400">
          <div>Velocidade {velocity.toFixed(0)} u/s</div>
          <div>Combustível {fuel.toFixed(0)}%</div>
          <div>Escudo {shield.toFixed(0)}%</div>
          <div>Energia {energy.toFixed(0)}%</div>
        </div>
        <div className="mt-3 text-sm text-cyan-200">Nave: {ship?.name ?? 'Aurora Scout'}</div>
      </div>
    </div>
  )
}
