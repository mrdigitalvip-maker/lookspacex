import * as THREE from 'three'

export interface AsteroidInstance {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: number
  collisionRadius: number
}

export const ASTEROID_COUNT = 180

function seeded(seed: number) {
  const value = Math.sin(seed * 91.731) * 43758.5453
  return value - Math.floor(value)
}

export const ASTEROIDS: AsteroidInstance[] = Array.from({ length: ASTEROID_COUNT }, (_, index) => {
  const angle = seeded(index + 1) * Math.PI * 2
  const radius = 52 + seeded(index + 17) * 165
  const height = (seeded(index + 31) - 0.5) * 72
  const zBias = -45 - seeded(index + 73) * 260
  const scale = 0.45 + seeded(index + 101) * 3.6

  return {
    position: new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      zBias + Math.sin(angle) * radius * 0.35,
    ),
    rotation: new THREE.Euler(
      seeded(index + 131) * Math.PI,
      seeded(index + 151) * Math.PI,
      seeded(index + 171) * Math.PI,
    ),
    scale,
    collisionRadius: Math.max(0.9, scale * 0.9),
  }
})
