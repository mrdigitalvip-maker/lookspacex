import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useShipStore } from '@/stores/shipStore'

export function CockpitInterior() {
  const viewMode = useShipStore((state) => state.viewMode)
  const velocity = useShipStore((state) => state.velocity)
  const energy = useShipStore((state) => state.energy)
  const shield = useShipStore((state) => state.shield)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const pulseRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const speedPulse = Math.min(1, velocity / 190)
    if (glowRef.current) glowRef.current.emissiveIntensity = 1.1 + speedPulse * 2.6 + Math.sin(state.clock.elapsedTime * 2.8) * 0.12
    if (pulseRef.current) pulseRef.current.intensity = 0.9 + speedPulse * 2.2
  })

  if (viewMode !== 'cockpit') return null

  return (
    <group>
      <mesh position={[0, -0.16, -1.25]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[2.55, 0.36, 1.05]} />
        <meshStandardMaterial color="#07111f" metalness={0.82} roughness={0.24} />
      </mesh>

      <mesh position={[0, 0.02, -1.78]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[1.45, 0.42, 0.08]} />
        <meshStandardMaterial ref={glowRef} color="#07111f" emissive="#22d3ee" emissiveIntensity={1.4} metalness={0.45} roughness={0.18} />
      </mesh>

      <mesh position={[-1.25, 0.5, -1.52]} rotation={[0, 0, -0.38]}>
        <boxGeometry args={[0.13, 1.6, 0.16]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.25, 0.5, -1.52]} rotation={[0, 0, 0.38]}>
        <boxGeometry args={[0.13, 1.6, 0.16]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, 1.08, -1.66]}>
        <boxGeometry args={[1.55, 0.1, 0.12]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[-0.62, -0.02, -1.72]}>
        <planeGeometry args={[0.42, 0.18]} />
        <meshBasicMaterial color={shield <= 20 ? '#ff4f6d' : '#6ee7ff'} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.02, -1.72]}>
        <planeGeometry args={[0.42, 0.18]} />
        <meshBasicMaterial color={energy <= 25 ? '#ffb86b' : '#8cffc1'} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[0.62, -0.02, -1.72]}>
        <planeGeometry args={[0.42, 0.18]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.82} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0.43, -2.14]} rotation={[-0.06, 0, 0]}>
        <planeGeometry args={[2.52, 1.46]} />
        <meshPhysicalMaterial color="#071521" transparent opacity={0.08} transmission={0.86} roughness={0.05} metalness={0.02} depthWrite={false} />
      </mesh>

      <pointLight ref={pulseRef} position={[0, 0.25, -1.35]} color="#22d3ee" intensity={1.1} distance={4} />
    </group>
  )
}
