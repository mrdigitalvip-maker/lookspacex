import { useMissionStore } from '@/stores/missionStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useShipStore } from '@/stores/shipStore'
import { useUIStore } from '@/stores/uiStore'

function MetricBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className="metric-row">
      <div className="metric-label">
        <span>{label}</span>
        <strong>{clamped.toFixed(0)}%</strong>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}

export function SpaceHUD() {
  const stats = usePlayerStore((state) => state.stats)
  const ship = useShipStore((state) => state.currentShip)
  const position = useShipStore((state) => state.position)
  const velocity = useShipStore((state) => state.velocity)
  const fuel = useShipStore((state) => state.fuel)
  const shield = useShipStore((state) => state.shield)
  const energy = useShipStore((state) => state.energy)
  const notifications = useUIStore((state) => state.notifications)
  const missionId = useMissionStore((state) => state.id)
  const missionTitle = useMissionStore((state) => state.title)
  const missionObjective = useMissionStore((state) => state.objective)
  const targetName = useMissionStore((state) => state.targetName)
  const distance = useMissionStore((state) => state.distance)
  const missionStatus = useMissionStore((state) => state.status)
  const targetLocked = useMissionStore((state) => state.targetLocked)

  const shieldStatus = shield <= 20 ? 'CRITICAL' : shield <= 50 ? 'DAMAGED' : 'NOMINAL'

  return (
    <div className={`space-hud ${shield <= 20 ? 'shield-critical' : ''}`}>
      <div className="hud-top-left hud-panel">
        <p className="hud-kicker">AURORA FLIGHT COMPUTER</p>
        <div className="pilot-line">
          <div className="pilot-avatar">L</div>
          <div>
            <strong>PILOT // GUEST</strong>
            <span>Level {stats?.level ?? 1} · {stats?.credits ?? 1000} CR</span>
          </div>
        </div>
      </div>

      <div className="hud-top-center">
        <span>LOCAL FRAME</span>
        <strong>
          X {position[0].toFixed(0)} · Y {position[1].toFixed(0)} · Z {position[2].toFixed(0)}
        </strong>
      </div>

      <div className="hud-top-right hud-panel">
        <p className="hud-kicker">SHIP STATUS</p>
        <strong className="ship-name">{ship?.name ?? 'Aurora Scout'}</strong>
        <span className="ship-class">SHIELD {shieldStatus} // EXPLORER CLASS</span>
      </div>

      <div className={`mission-panel ${missionStatus === 'completed' ? 'mission-complete' : ''}`}>
        <div className="mission-row">
          <span>{missionId}</span>
          <strong>{missionStatus === 'completed' ? 'COMPLETE' : 'ACTIVE'}</strong>
        </div>
        <h3>{missionTitle}</h3>
        <p>{missionStatus === 'completed' ? 'Navigation beacon reached. Mission data secured.' : missionObjective}</p>
        <div className="mission-target-line">
          <span>{targetName}</span>
          <strong>{missionStatus === 'completed' ? 'ARRIVED' : `${distance.toFixed(0)} u`}</strong>
        </div>
      </div>

      <div className={`flight-reticle ${targetLocked ? 'reticle-locked' : ''}`} aria-hidden="true">
        <span className="reticle-horizontal" />
        <span className="reticle-vertical" />
        <i />
      </div>

      {missionStatus === 'active' && (
        <div className={`target-lock ${targetLocked ? 'target-lock-active' : ''}`} aria-hidden="true">
          <span>{targetLocked ? `LOCK // ${targetName}` : `TRACK // ${targetName}`}</span>
          <strong>{targetLocked ? `${distance.toFixed(0)} u · LOCKED` : `${distance.toFixed(0)} u · PRESS T`}</strong>
        </div>
      )}

      <div className="hud-bottom-left hud-panel radar-panel">
        <div className="radar-header">
          <span>PROXIMITY RADAR</span>
          <i />
        </div>
        <div className="radar-scope" aria-hidden="true">
          <span className="radar-ring radar-ring-a" />
          <span className="radar-ring radar-ring-b" />
          <span className="radar-sweep" />
          <b className="radar-contact contact-a" />
          <b className="radar-contact contact-b" />
          <b className="radar-contact contact-c" />
        </div>
      </div>

      <div className="hud-bottom-center">
        <div className="velocity-readout">
          <span>VELOCITY</span>
          <strong>{velocity.toFixed(0)}</strong>
          <em>u/s</em>
        </div>
        <div className="control-strip">
          <span><kbd>W</kbd><kbd>S</kbd> THRUST / BRAKE</span>
          <span><kbd>A</kbd><kbd>D</kbd> YAW</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> PITCH</span>
          <span><kbd>Q</kbd><kbd>E</kbd> ROLL</span>
          <span><kbd>T</kbd> TARGET</span>
          <span><kbd>SHIFT</kbd> BOOST</span>
        </div>
      </div>

      <div className="hud-bottom-right hud-panel systems-panel">
        <MetricBar label="FUEL" value={fuel} />
        <MetricBar label="SHIELD" value={shield} />
        <MetricBar label="ENERGY" value={energy} />
        {notifications.length > 0 ? (
          <div className="hud-notification">{notifications[0]?.message}</div>
        ) : (
          <div className="hud-notification">Navigation systems nominal</div>
        )}
      </div>
    </div>
  )
}
