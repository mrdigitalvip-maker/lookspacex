import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ASTEROID_COUNT, ASTEROIDS } from '@/game/world/asteroidField.data'

export function AsteroidField() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    ASTEROIDS.forEach((asteroid, index) => {
      dummy.position.copy(asteroid.position)
      dummy.rotation.copy(asteroid.rotation)
      dummy.scale.setScalar(asteroid.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [dummy])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ASTEROID_COUNT]} frustumCulled>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#313846" roughness={0.92} metalness={0.08} />
    </instancedMesh>
  )
}
