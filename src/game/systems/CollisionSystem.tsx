import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ASTEROIDS } from '@/game/world/asteroidField.data'
import { useShipStore } from '@/stores/shipStore'
import { useUIStore } from '@/stores/uiStore'

const CHECK_INTERVAL = 0.06
const IMPACT_COOLDOWN = 0.9
const SHIP_RADIUS = 2.1

export function CollisionSystem() {
  const accumulatorRef = useRef(0)
  const lastImpactRef = useRef(-Infinity)
  const shipPosition = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    accumulatorRef.current += delta
    if (accumulatorRef.current < CHECK_INTERVAL) return
    accumulatorRef.current = 0

    const ship = useShipStore.getState()
    shipPosition.set(...ship.position)

    for (const asteroid of ASTEROIDS) {
      const threshold = SHIP_RADIUS + asteroid.collisionRadius
      if (shipPosition.distanceToSquared(asteroid.position) > threshold * threshold) continue

      const now = state.clock.elapsedTime
      if (now - lastImpactRef.current < IMPACT_COOLDOWN) return
      lastImpactRef.current = now

      const damage = THREE.MathUtils.clamp(8 + ship.velocity * 0.12, 8, 28)
      ship.damageShield(damage)
      useUIStore.getState().addNotification(`IMPACT // Shield -${damage.toFixed(0)}%`, 'warning')
      return
    }
  })

  return null
}
