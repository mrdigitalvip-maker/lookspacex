import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMissionStore } from '@/stores/missionStore'
import { useShipStore } from '@/stores/shipStore'

export function MissionBeacon() {
  const groupRef = useRef<THREE.Group>(null)
  const target = useMissionStore((state) => state.target)
  const arrivalRadius = useMissionStore((state) => state.arrivalRadius)
  const status = useMissionStore((state) => state.status)
  const setDistance = useMissionStore((state) => state.setDistance)
  const completeMission = useMissionStore((state) => state.completeMission)
  const position = useShipStore((state) => state.position)
  const targetVector = useMemo(() => new THREE.Vector3(...target), [target])

  useEffect(() => {
    const distance = targetVector.distanceTo(new THREE.Vector3(...position))
    setDistance(distance)
    if (status === 'active' && distance <= arrivalRadius) completeMission()
  }, [arrivalRadius, completeMission, position, setDistance, status, targetVector])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += delta * 0.28
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.8) * 0.08
    groupRef.current.scale.setScalar(pulse)
  })

  const color = status === 'completed' ? '#8cffc1' : '#6ee7ff'

  return (
    <group ref={groupRef} position={target}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[8, 0.22, 10, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[5.6, 0.12, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.1, 24, 18]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={4.8} distance={46} />
    </group>
  )
}
