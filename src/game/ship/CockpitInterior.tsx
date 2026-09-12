import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'
import { useShipStore } from '@/stores/shipStore'

export function CockpitInterior() {
  const scene = useGameStore((state) => state.currentScene)
  const viewMode = useShipStore((state) => state.viewMode)
  const velocity = useShipStore((state) => state.velocity)
  const energy = useShipStore((state) => state.energy)
  const shield = useShipStore((state) => state.shield)
  const isWarping = useShipStore((state) => state.isWarping)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const pulseRef = useRef<THREE.PointLight>(null)
  const cabinPulseRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const speedPulse = Math.min(1, velocity / 190)
    if (glowRef.current) {
      glowRef.current.emissiveIntensity = 1.1 + speedPulse * 2.6 + (isWarping ? 2.4 : 0) + Math.sin(state.clock.elapsedTime * 2.8) * 0.12
    }
    if (pulseRef.current) pulseRef.current.intensity = 0.9 + speedPulse * 2.2 + (isWarping ? 2.2 : 0)
    if (cabinPulseRef.current) cabinPulseRef.current.intensity = 0.65 + Math.sin(state.clock.elapsedTime * 1.7) * 0.12
  })

  if (viewMode === 'chase' && scene !== 'LOADING') return null

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

      <mesh position={[0, -0.9, 0.8]}>
        <boxGeometry args={[2.7, 0.14, 5.2]} />
        <meshStandardMaterial color="#060c16" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.75, 0.8]}>
        <boxGeometry args={[2.7, 0.14, 5.2]} />
        <meshStandardMaterial color="#070d18" metalness={0.88} roughness={0.24} />
      </mesh>
      <mesh position={[-1.36, 0.42, 0.8]}>
        <boxGeometry args={[0.16, 2.55, 5.2]} />
        <meshStandardMaterial color="#0a1220" metalness={0.87} roughness={0.24} />
      </mesh>
      <mesh position={[1.36, 0.42, 0.8]}>
        <boxGeometry args={[0.16, 2.55, 5.2]} />
        <meshStandardMaterial color="#0a1220" metalness={0.87} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.45, 3.35]}>
        <boxGeometry args={[2.7, 2.6, 0.16]} />
        <meshStandardMaterial color="#080f1b" metalness={0.88} roughness={0.26} />
      </mesh>

      <mesh position={[-1.23, 0.65, 0.4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 0.46]} />
        <meshBasicMaterial color="#14334a" transparent opacity={0.62} toneMapped={false} />
      </mesh>
      <mesh position={[1.23, 0.65, 0.4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 0.46]} />
        <meshBasicMaterial color="#14334a" transparent opacity={0.62} toneMapped={false} />
      </mesh>
      <mesh position={[-1.23, 0.1, 1.75]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.34]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.52} toneMapped={false} />
      </mesh>
      <mesh position={[1.23, 0.1, 1.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.3, 0.34]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.52} toneMapped={false} />
      </mesh>

      <group position={[0, -0.25, 1.15]}>
        <mesh position={[0, 0.2, 0.2]}>
          <boxGeometry args={[0.8, 1.15, 0.72]} />
          <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.84, 0.42]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.92, 0.95, 0.3]} />
          <meshStandardMaterial color="#0d1624" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>

      <mesh position={[0, 1.63, 0.85]}>
        <boxGeometry args={[1.5, 0.05, 2.6]} />
        <meshBasicMaterial color="#1ee6ff" transparent opacity={0.24} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.81, 1.1]}>
        <boxGeometry args={[0.08, 0.02, 3.8]} />
        <meshBasicMaterial color="#6ee7ff" transparent opacity={0.8} toneMapped={false} />
      </mesh>

      <pointLight ref={pulseRef} position={[0, 0.25, -1.35]} color="#22d3ee" intensity={1.1} distance={4} />
      <pointLight ref={cabinPulseRef} position={[0, 1.25, 1.1]} color="#8b5cf6" intensity={0.75} distance={5.5} />
    </group>
  )
}
