import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const ASTEROID_COUNT = 180

function seeded(seed: number) {
  const value = Math.sin(seed * 91.731) * 43758.5453
  return value - Math.floor(value)
}

export function AsteroidField() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const asteroids = useMemo(
    () =>
      Array.from({ length: ASTEROID_COUNT }, (_, index) => {
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
        }
      }),
    [],
  )

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    asteroids.forEach((asteroid, index) => {
      dummy.position.copy(asteroid.position)
      dummy.rotation.copy(asteroid.rotation)
      dummy.scale.setScalar(asteroid.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [asteroids, dummy])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.y += delta * 0.004
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ASTEROID_COUNT]} frustumCulled>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#313846" roughness={0.92} metalness={0.08} />
    </instancedMesh>
  )
}
