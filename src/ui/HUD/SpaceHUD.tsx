import { useMemo } from 'react'
import { ASTEROIDS } from '@/game/world/asteroidField.data'
import { useMissionStore } from '@/stores/missionStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useShipStore } from '@/stores/shipStore'
import { useUIStore } from '@/stores/uiStore'

const RADAR_RANGE = 210

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
  const isWarping = useShipStore((state) => state.isWarping)
  const viewMode = useShipStore((state) => state.viewMode)
  const notifications = useUIStore((state) => state.notifications)
  const missionId = useMissionStore((state) => state.id)
  const missionTitle = useMissionStore((state) => state.title)
  const missionObjective = useMissionStore((state) => state.objective)
  const targetName = useMissionStore((state) => state.targetName)
  const target = useMissionStore((state) => state.target)
  const distance = useMissionStore((state) => state.distance)
  const missionStatus = useMissionStore((state) => state.status)
  const targetLocked = useMissionStore((state) => state.targetLocked)

  const shieldStatus = shield <= 20 ? 'CRITICAL' : shield <= 50 ? 'DAMAGED' : 'NOMINAL'
  const viewLabel = viewMode === 'cockpit' ? 'COCKPIT FEED' : viewMode === 'cabin' ? 'CABIN INTERIOR' : 'CHASE FEED'

  const radarContacts = useMemo(() => {
    return ASTEROIDS.map((asteroid, index) => {
      const dx = asteroid.position.x - position[0]
      const dz = asteroid.position.z - position[2]
      const distanceSquared = dx * dx + dz * dz
      return { index, dx, dz, distanceSquared, scale: asteroid.scale }
    })
      .filter((contact) => contact.distanceSquared <= RADAR_RANGE * RADAR_RANGE)
      .sort((a, b) => a.distanceSquared - b.distanceSquared)
      .slice(0, 12)
  }, [position])

  const missionRadar = useMemo(() => {
    const dx = target[0] - position[0]
    const dz = target[2] - position[2]
    const magnitude = Math.max(1, Math.hypot(dx, dz))
    const scale = Math.min(1, RADAR_RANGE / magnitude)
    return { x: dx * scale, z: dz * scale }
  }, [position, target])

  return (
    <div className={`space-hud ${shield <= 20 ? 'shield-critical' : ''} ${isWarping ? 'hud-warping' : ''}`}>
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
        <span>{isWarping ? 'WARP VECTOR' : viewLabel}</span>
        <strong>
          X {position[0].toFixed(0)} · Y {position[1].toFixed(0)} · Z {position[2].toFixed(0)}
        </strong>
      </div>

      <div className="hud-top-right hud-panel">
        <p className="hud-kicker">SHIP STATUS</p>
        <strong className="ship-name">{ship?.name ?? 'Aurora Scout'}</strong>
        <span className="ship-class">SHIELD {shieldStatus} // {isWarping ? 'WARP ACTIVE' : viewMode.toUpperCase()}</span>
      </div>

      <div className={`mission-panel ${missionStatus === 'completed' ? 'mission-complete' : ''}`}>
        <div className="mission-row">
          <span>{missionId}</span>
          <strong>{missionStatus === 'completed' ? 'COMPLETE' : 'ACTIVE'}</strong>
        </div>
        <h3>{missionTitle}</h3>
        <p>{missionStatus === 'completed' ? 'Objective secured. Flight computer is processing the next vector.' : missionObjective}</p>
        <div className="mission-target-line">
          <span>{targetName}</span>
          <strong>{missionStatus === 'completed' ? 'SECURED' : `${distance.toFixed(0)} u`}</strong>
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
          <strong>
            {targetLocked
              ? `${distance.toFixed(0)} u · ${missionId === 'M002' ? 'R TO WARP' : 'LOCKED'}`
              : `${distance.toFixed(0)} u · PRESS T`}
          </strong>
        </div>
      )}

      {isWarping ? (
        <div className="warp-status" aria-hidden="true">
          <span>WARP DRIVE</span>
          <strong>VECTOR COMMITTED</strong>
        </div>
      ) : null}

      <div className="hud-bottom-left hud-panel radar-panel">
        <div className="radar-header">
          <span>LIVE PROXIMITY RADAR</span>
          <i />
        </div>
        <div className="radar-scope" aria-hidden="true">
          <span className="radar-ring radar-ring-a" />
          <span className="radar-ring radar-ring-b" />
          <span className="radar-sweep" />
          {radarContacts.map((contact) => (
            <b
              key={contact.index}
              className={`radar-live-contact ${contact.scale > 2.4 ? 'radar-contact-large' : ''}`}
              style={{
                left: `${50 + Math.max(-1, Math.min(1, contact.dx / RADAR_RANGE)) * 43}%`,
                top: `${50 + Math.max(-1, Math.min(1, contact.dz / RADAR_RANGE)) * 43}%`,
              }}
            />
          ))}
          <b
            className={`radar-mission-contact ${targetLocked ? 'radar-mission-locked' : ''}`}
            style={{
              left: `${50 + (missionRadar.x / RADAR_RANGE) * 43}%`,
              top: `${50 + (missionRadar.z / RADAR_RANGE) * 43}%`,
            }}
          />
          <b className="radar-player-contact" />
        </div>
      </div>

      <div className="hud-bottom-center">
        <div className="velocity-readout">
          <span>{isWarping ? 'WARP VELOCITY' : 'VELOCITY'}</span>
          <strong>{velocity.toFixed(0)}</strong>
          <em>u/s</em>
        </div>
        <div className="control-strip">
          <span><kbd>W</kbd><kbd>S</kbd> THRUST / BRAKE</span>
          <span><kbd>A</kbd><kbd>D</kbd> YAW</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> PITCH</span>
          <span><kbd>Q</kbd><kbd>E</kbd> ROLL</span>
          <span><kbd>C</kbd> COCKPIT / CABIN / CHASE</span>
          <span><kbd>T</kbd> TARGET</span>
          <span><kbd>R</kbd> WARP</span>
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
