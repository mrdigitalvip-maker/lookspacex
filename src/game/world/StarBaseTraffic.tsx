import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const TRAFFIC_COUNT = 7

export function StarBaseTraffic() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    const t = state.clock.elapsedTime
    for (let index = 0; index < TRAFFIC_COUNT; index += 1) {
      const phase = t * (0.12 + index * 0.013) + (index / TRAFFIC_COUNT) * Math.PI * 2
      const lane = index % 3
      const radius = 42 + lane * 18
      const y = 8 + (index % 4) * 5 + Math.sin(phase * 1.4) * 2.2
      const x = Math.cos(phase) * radius
      const z = 18 + Math.sin(phase) * (radius * 1.45)

      dummy.position.set(x, y, z)
      dummy.rotation.set(0, -phase + Math.PI / 2, Math.sin(phase * 2) * 0.08)
      const scale = 0.7 + (index % 3) * 0.22
      dummy.scale.set(scale * 1.8, scale * 0.45, scale * 3.2)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TRAFFIC_COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#162338" emissive="#22d3ee" emissiveIntensity={0.8} metalness={0.86} roughness={0.2} />
    </instancedMesh>
  )
}
