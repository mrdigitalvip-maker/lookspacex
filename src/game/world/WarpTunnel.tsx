import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useShipStore } from '@/stores/shipStore'

const STREAK_COUNT = 96

export function WarpTunnel() {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.LineBasicMaterial>(null)
  const { camera } = useThree()
  const isWarping = useShipStore((state) => state.isWarping)

  const geometry = useMemo(() => {
    const positions = new Float32Array(STREAK_COUNT * 2 * 3)
    for (let i = 0; i < STREAK_COUNT; i += 1) {
      const angle = (i / STREAK_COUNT) * Math.PI * 2 + Math.sin(i * 1.7) * 0.22
      const radius = 3.5 + ((i * 17) % 23) * 0.42
      const depth = -18 - ((i * 29) % 170)
      const length = 18 + ((i * 13) % 46)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const offset = i * 6
      positions[offset] = x
      positions[offset + 1] = y
      positions[offset + 2] = depth
      positions[offset + 3] = x
      positions[offset + 4] = y
      positions[offset + 5] = depth - length
    }

    const nextGeometry = new THREE.BufferGeometry()
    nextGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return nextGeometry
  }, [])

  useFrame((state, delta) => {
    const group = groupRef.current
    const material = materialRef.current
    if (!group || !material) return

    group.position.copy(camera.position)
    group.quaternion.copy(camera.quaternion)
    group.rotation.z += delta * 0.05
    material.opacity = THREE.MathUtils.lerp(material.opacity, isWarping ? 0.9 : 0, 1 - Math.exp(-8 * delta))
    if (isWarping) {
      group.position.addScaledVector(new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion), Math.sin(state.clock.elapsedTime * 12) * 0.15)
    }
  })

  return (
    <group ref={groupRef} renderOrder={30}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial ref={materialRef} color="#a8f5ff" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </lineSegments>
    </group>
  )
}
