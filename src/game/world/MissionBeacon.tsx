import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMissionStore } from '@/stores/missionStore'
import { useShipStore } from '@/stores/shipStore'

export function MissionBeacon() {
  const groupRef = useRef<THREE.Group>(null)
  const gateCoreRef = useRef<THREE.Mesh>(null)
  const missionId = useMissionStore((state) => state.id)
  const target = useMissionStore((state) => state.target)
  const arrivalRadius = useMissionStore((state) => state.arrivalRadius)
  const completionMode = useMissionStore((state) => state.completionMode)
  const status = useMissionStore((state) => state.status)
  const setDistance = useMissionStore((state) => state.setDistance)
  const completeMission = useMissionStore((state) => state.completeMission)
  const position = useShipStore((state) => state.position)
  const targetVector = useMemo(() => new THREE.Vector3(...target), [target])

  useEffect(() => {
    const distance = targetVector.distanceTo(new THREE.Vector3(...position))
    setDistance(distance)
    if (completionMode === 'arrival' && status === 'active' && distance <= arrivalRadius) completeMission()
  }, [arrivalRadius, completeMission, completionMode, position, setDistance, status, targetVector])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += delta * (missionId === 'M002' ? 0.08 : 0.28)
    const pulse = 1 + Math.sin(state.clock.elapsedTime * (missionId === 'M002' ? 1.7 : 2.8)) * (missionId === 'M002' ? 0.035 : 0.08)
    groupRef.current.scale.setScalar(pulse)
    if (gateCoreRef.current) gateCoreRef.current.rotation.z -= delta * 0.24
  })

  const color = status === 'completed' ? '#8cffc1' : missionId === 'M003' ? '#8cffc1' : '#6ee7ff'

  if (missionId === 'M002') {
    return (
      <group ref={groupRef} position={target} rotation={[0, 0, Math.PI / 8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[27, 1.25, 22, 128]} />
          <meshStandardMaterial color="#101a2d" emissive="#22d3ee" emissiveIntensity={2.8} metalness={0.88} roughness={0.18} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[22.2, 0.32, 12, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0.82} toneMapped={false} />
        </mesh>
        <mesh ref={gateCoreRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[12.5, 20.5, 96]} />
          <meshBasicMaterial color="#2dd4ff" transparent opacity={0.12} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index / 8) * Math.PI * 2
          return (
            <mesh key={index} position={[Math.cos(angle) * 27, Math.sin(angle) * 27, 0]}>
              <boxGeometry args={[1.3, 3.8, 1.3]} />
              <meshStandardMaterial color="#17243b" emissive="#6ee7ff" emissiveIntensity={1.4} metalness={0.92} roughness={0.16} />
            </mesh>
          )
        })}
        <pointLight color="#22d3ee" intensity={9} distance={120} />
      </group>
    )
  }

  return (
    <group ref={groupRef} position={target}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[missionId === 'M003' ? 11 : 8, 0.22, 10, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[missionId === 'M003' ? 7.4 : 5.6, 0.12, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.1, 24, 18]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={missionId === 'M003' ? 7.2 : 4.8} distance={missionId === 'M003' ? 72 : 46} />
    </group>
  )
}
