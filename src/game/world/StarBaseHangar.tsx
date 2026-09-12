import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'
import { useShipStore } from '@/stores/shipStore'
import { useStarBaseStore } from '@/stores/starbaseStore'

const FLOOR_Z = 18
const EXIT_Z = -18

export function StarBaseHangar() {
  const leftDoorRef = useRef<THREE.Mesh>(null)
  const rightDoorRef = useRef<THREE.Mesh>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const beaconRef = useRef<THREE.PointLight>(null)
  const launchStartedRef = useRef<number | null>(null)

  useFrame((state, delta) => {
    const scene = useGameStore.getState().currentScene
    const shipPosition = useShipStore.getState().position
    const dockingState = useStarBaseStore.getState().dockingState

    if (scene === 'LOADING' && launchStartedRef.current === null) {
      launchStartedRef.current = state.clock.elapsedTime
    }

    const elapsed = launchStartedRef.current === null ? 0 : state.clock.elapsedTime - launchStartedRef.current
    const launchOpen = scene === 'LOADING' ? THREE.MathUtils.smoothstep(elapsed, 1.1, 3.4) : 0
    const distanceToBase = Math.hypot(shipPosition[0], shipPosition[1], shipPosition[2] - 20)
    const returnOpen = scene === 'SPACE' && (distanceToBase < 230 || dockingState !== 'away') ? 1 : 0
    const openAmount = Math.max(launchOpen, returnOpen)
    const doorX = THREE.MathUtils.lerp(3.6, 10.8, openAmount)

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.damp(leftDoorRef.current.position.x, -doorX, 7, delta)
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.damp(rightDoorRef.current.position.x, doorX, 7, delta)
    }

    const armsDocked = dockingState === 'docked' ? 0 : Math.max(launchOpen, dockingState === 'docking' ? 1 : 0)
    const armX = THREE.MathUtils.lerp(5.4, 9.2, armsDocked)
    const armTilt = THREE.MathUtils.lerp(0, 0.7, armsDocked)
    if (leftArmRef.current) {
      leftArmRef.current.position.x = THREE.MathUtils.damp(leftArmRef.current.position.x, -armX, 6, delta)
      leftArmRef.current.rotation.z = THREE.MathUtils.damp(leftArmRef.current.rotation.z, armTilt, 6, delta)
    }
    if (rightArmRef.current) {
      rightArmRef.current.position.x = THREE.MathUtils.damp(rightArmRef.current.position.x, armX, 6, delta)
      rightArmRef.current.rotation.z = THREE.MathUtils.damp(rightArmRef.current.rotation.z, -armTilt, 6, delta)
    }

    if (beaconRef.current) {
      const dockingBoost = dockingState === 'approach' || dockingState === 'docking' ? 5 : 0
      beaconRef.current.intensity = 6 + dockingBoost + Math.sin(state.clock.elapsedTime * 6) * 2.2
      beaconRef.current.color.set(dockingState === 'docked' ? '#8cffc1' : '#22d3ee')
    }
  })

  return (
    <group>
      <mesh position={[0, -2.65, FLOOR_Z]} receiveShadow>
        <boxGeometry args={[34, 1.1, 96]} />
        <meshStandardMaterial color="#050912" metalness={0.82} roughness={0.34} />
      </mesh>

      <mesh position={[-16.5, 5.8, FLOOR_Z]}>
        <boxGeometry args={[1.3, 17.8, 96]} />
        <meshStandardMaterial color="#090f1c" metalness={0.9} roughness={0.26} />
      </mesh>
      <mesh position={[16.5, 5.8, FLOOR_Z]}>
        <boxGeometry args={[1.3, 17.8, 96]} />
        <meshStandardMaterial color="#090f1c" metalness={0.9} roughness={0.26} />
      </mesh>

      <mesh position={[0, 14.1, FLOOR_Z]}>
        <boxGeometry args={[34, 1, 96]} />
        <meshStandardMaterial color="#050912" metalness={0.88} roughness={0.28} />
      </mesh>

      <mesh position={[0, 5.5, 66]}>
        <boxGeometry args={[34, 17, 1.3]} />
        <meshStandardMaterial color="#070d18" metalness={0.88} roughness={0.3} />
      </mesh>

      {Array.from({ length: 9 }, (_, index) => {
        const z = -14 + index * 10.5
        return (
          <group key={z} position={[0, 0, z]}>
            <mesh position={[-12.5, 9.6, 0]} rotation={[0, 0, -0.55]}>
              <boxGeometry args={[0.5, 12, 0.55]} />
              <meshStandardMaterial color="#121c2b" metalness={0.92} roughness={0.22} />
            </mesh>
            <mesh position={[12.5, 9.6, 0]} rotation={[0, 0, 0.55]}>
              <boxGeometry args={[0.5, 12, 0.55]} />
              <meshStandardMaterial color="#121c2b" metalness={0.92} roughness={0.22} />
            </mesh>
            <mesh position={[0, 13.35, 0]}>
              <boxGeometry args={[24, 0.45, 0.55]} />
              <meshStandardMaterial color="#111b2a" metalness={0.92} roughness={0.22} />
            </mesh>
            <mesh position={[-8.8, -1.95, 0]}>
              <boxGeometry args={[4.8, 0.08, 0.7]} />
              <meshBasicMaterial color="#1adcf6" transparent opacity={0.82} toneMapped={false} />
            </mesh>
            <mesh position={[8.8, -1.95, 0]}>
              <boxGeometry args={[4.8, 0.08, 0.7]} />
              <meshBasicMaterial color="#1adcf6" transparent opacity={0.82} toneMapped={false} />
            </mesh>
          </group>
        )
      })}

      <group ref={leftArmRef} position={[-5.4, 1.4, 35]}>
        <mesh rotation={[0, 0, -0.16]}>
          <boxGeometry args={[5.2, 0.45, 0.7]} />
          <meshStandardMaterial color="#172238" emissive="#0ea5e9" emissiveIntensity={0.35} metalness={0.88} roughness={0.22} />
        </mesh>
        <pointLight position={[-2.2, 0, 0]} color="#6ee7ff" intensity={2.5} distance={8} />
      </group>
      <group ref={rightArmRef} position={[5.4, 1.4, 35]}>
        <mesh rotation={[0, 0, 0.16]}>
          <boxGeometry args={[5.2, 0.45, 0.7]} />
          <meshStandardMaterial color="#172238" emissive="#0ea5e9" emissiveIntensity={0.35} metalness={0.88} roughness={0.22} />
        </mesh>
        <pointLight position={[2.2, 0, 0]} color="#6ee7ff" intensity={2.5} distance={8} />
      </group>

      <group position={[0, 5.4, EXIT_Z]}>
        <mesh ref={leftDoorRef} position={[-3.6, 0, 0]}>
          <boxGeometry args={[7.2, 15.5, 1]} />
          <meshStandardMaterial color="#0c1422" emissive="#08273a" emissiveIntensity={0.6} metalness={0.94} roughness={0.22} />
        </mesh>
        <mesh ref={rightDoorRef} position={[3.6, 0, 0]}>
          <boxGeometry args={[7.2, 15.5, 1]} />
          <meshStandardMaterial color="#0c1422" emissive="#08273a" emissiveIntensity={0.6} metalness={0.94} roughness={0.22} />
        </mesh>
        <mesh position={[0, 8.5, 0.15]}>
          <boxGeometry args={[32, 1.3, 1.4]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.25} />
        </mesh>
        <pointLight ref={beaconRef} position={[0, 7.6, -1.8]} color="#22d3ee" intensity={7} distance={32} />
      </group>

      <mesh position={[0, -1.9, 38]}>
        <boxGeometry args={[8.5, 0.16, 20]} />
        <meshStandardMaterial color="#0c1420" emissive="#042839" emissiveIntensity={0.85} metalness={0.7} roughness={0.34} />
      </mesh>
      <mesh position={[0, -1.79, 38]}>
        <boxGeometry args={[0.16, 0.04, 18]} />
        <meshBasicMaterial color="#7cf4ff" toneMapped={false} />
      </mesh>

      <pointLight position={[-11, 8, 42]} color="#6ee7ff" intensity={3.4} distance={28} />
      <pointLight position={[11, 8, 42]} color="#6ee7ff" intensity={3.4} distance={28} />
      <pointLight position={[0, 10, 8]} color="#8b5cf6" intensity={2.2} distance={30} />
    </group>
  )
}
