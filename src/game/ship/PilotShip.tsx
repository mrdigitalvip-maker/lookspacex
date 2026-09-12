import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '@/config/game.config'
import { useShipStore } from '@/stores/shipStore'

type KeyState = Record<string, boolean>

const CAMERA_DAMPING = 5.5
const TELEMETRY_INTERVAL = 0.08

export function PilotShip() {
  const shipRef = useRef<THREE.Group>(null)
  const leftThrusterRef = useRef<THREE.MeshStandardMaterial>(null)
  const rightThrusterRef = useRef<THREE.MeshStandardMaterial>(null)
  const keysRef = useRef<KeyState>({})
  const velocityRef = useRef(new THREE.Vector3())
  const telemetryRef = useRef(0)
  const { camera } = useThree()
  const setPosition = useShipStore((state) => state.setPosition)
  const setVelocity = useShipStore((state) => state.setVelocity)
  const consumeFuel = useShipStore((state) => state.consumeFuel)
  const fuel = useShipStore((state) => state.fuel)

  const forward = useMemo(() => new THREE.Vector3(), [])
  const brakeDirection = useMemo(() => new THREE.Vector3(), [])
  const desiredCameraPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredLookAt = useMemo(() => new THREE.Vector3(), [])
  const cameraOffset = useMemo(
    () => new THREE.Vector3(0, GAME_CONFIG.camera.thirdPersonHeight, GAME_CONFIG.camera.thirdPersonDistance),
    [],
  )

  useEffect(() => {
    const setKey = (event: KeyboardEvent, pressed: boolean) => {
      keysRef.current[event.code] = pressed
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
        event.preventDefault()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => setKey(event, true)
    const handleKeyUp = (event: KeyboardEvent) => setKey(event, false)
    const handleBlur = () => {
      keysRef.current = {}
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  useFrame((state, delta) => {
    const ship = shipRef.current
    if (!ship) return

    const keys = keysRef.current
    const accelerating = Boolean(keys.KeyW || keys.Space)
    const braking = Boolean(keys.KeyS)
    const boosting = Boolean((keys.ShiftLeft || keys.ShiftRight) && accelerating && fuel > 0)
    const maxSpeed = boosting ? GAME_CONFIG.physics.turboSpeed : GAME_CONFIG.physics.maxSpeed
    const acceleration = boosting ? GAME_CONFIG.physics.acceleration * 3.4 : GAME_CONFIG.physics.acceleration
    const velocity = velocityRef.current

    const yawInput = Number(Boolean(keys.KeyA || keys.ArrowLeft)) - Number(Boolean(keys.KeyD || keys.ArrowRight))
    const pitchInput = Number(Boolean(keys.ArrowDown)) - Number(Boolean(keys.ArrowUp))
    const rollInput = Number(Boolean(keys.KeyQ)) - Number(Boolean(keys.KeyE))
    const rotationSpeed = GAME_CONFIG.physics.rotationSpeed

    ship.rotateY(yawInput * rotationSpeed * delta)
    ship.rotateX(pitchInput * rotationSpeed * 0.78 * delta)
    ship.rotateZ(rollInput * rotationSpeed * 1.1 * delta)

    forward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize()

    if (accelerating && fuel > 0 && velocity.length() < maxSpeed) {
      velocity.addScaledVector(forward, acceleration * delta)
      if (velocity.length() > maxSpeed) velocity.setLength(maxSpeed)
    }

    if (braking) {
      const speed = velocity.length()
      if (speed > 0.8) {
        brakeDirection.copy(velocity).normalize()
        const nextSpeed = Math.max(0, speed - GAME_CONFIG.physics.deceleration * 2.2 * delta)
        velocity.copy(brakeDirection).multiplyScalar(nextSpeed)
      } else {
        velocity.addScaledVector(forward, -GAME_CONFIG.physics.acceleration * 0.5 * delta)
        const reverseLimit = GAME_CONFIG.physics.maxSpeed * 0.32
        if (velocity.length() > reverseLimit) velocity.setLength(reverseLimit)
      }
    }

    ship.position.addScaledVector(velocity, delta)

    desiredCameraPosition.copy(cameraOffset).applyQuaternion(ship.quaternion).add(ship.position)
    const cameraBlend = 1 - Math.exp(-CAMERA_DAMPING * delta)
    camera.position.lerp(desiredCameraPosition, cameraBlend)
    desiredLookAt.copy(ship.position).addScaledVector(forward, 22)
    camera.lookAt(desiredLookAt)

    if (camera instanceof THREE.PerspectiveCamera) {
      const speedRatio = Math.min(1, velocity.length() / GAME_CONFIG.physics.turboSpeed)
      const targetFov = GAME_CONFIG.camera.fov + speedRatio * 7 + (boosting ? 5 : 0)
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-4.5 * delta))
      camera.updateProjectionMatrix()
    }

    const enginePower = Math.min(1, velocity.length() / Math.max(1, GAME_CONFIG.physics.turboSpeed))
    const throttleGlow = accelerating ? 2.8 : 0.9
    const pulse = throttleGlow + enginePower * 8 + Math.sin(state.clock.elapsedTime * 18) * 0.35
    if (leftThrusterRef.current) leftThrusterRef.current.emissiveIntensity = pulse
    if (rightThrusterRef.current) rightThrusterRef.current.emissiveIntensity = pulse

    telemetryRef.current += delta
    if (telemetryRef.current >= TELEMETRY_INTERVAL) {
      telemetryRef.current = 0
      setPosition([ship.position.x, ship.position.y, ship.position.z])
      setVelocity(velocity.length())

      if (accelerating && fuel > 0) {
        consumeFuel((boosting ? 0.095 : 0.02) * TELEMETRY_INTERVAL)
      }
    }
  })

  return (
    <group ref={shipRef} position={[0, 0, 25]} rotation={[0, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[1.25, 5.2, 6]} />
        <meshStandardMaterial color="#182238" metalness={0.88} roughness={0.22} />
      </mesh>

      <mesh position={[0, 0.55, -0.65]} scale={[0.72, 0.35, 1.15]}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color="#6ee7ff" emissive="#0ea5e9" emissiveIntensity={1.4} metalness={0.3} roughness={0.08} transparent opacity={0.88} />
      </mesh>

      <mesh position={[-1.7, -0.12, 0.2]} rotation={[0, 0.08, 0.08]}>
        <boxGeometry args={[2.7, 0.18, 2.2]} />
        <meshStandardMaterial color="#0d1527" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[1.7, -0.12, 0.2]} rotation={[0, -0.08, -0.08]}>
        <boxGeometry args={[2.7, 0.18, 2.2]} />
        <meshStandardMaterial color="#0d1527" metalness={0.92} roughness={0.2} />
      </mesh>

      <mesh position={[-1.15, -0.18, 2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.48, 1.1, 20]} />
        <meshStandardMaterial ref={leftThrusterRef} color="#111827" emissive="#22d3ee" emissiveIntensity={3} metalness={0.8} roughness={0.28} />
      </mesh>
      <mesh position={[1.15, -0.18, 2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.48, 1.1, 20]} />
        <meshStandardMaterial ref={rightThrusterRef} color="#111827" emissive="#22d3ee" emissiveIntensity={3} metalness={0.8} roughness={0.28} />
      </mesh>

      <mesh position={[-1.15, -0.18, 3.05]}>
        <sphereGeometry args={[0.28, 16, 12]} />
        <meshBasicMaterial color="#8ff7ff" toneMapped={false} />
      </mesh>
      <mesh position={[1.15, -0.18, 3.05]}>
        <sphereGeometry args={[0.28, 16, 12]} />
        <meshBasicMaterial color="#8ff7ff" toneMapped={false} />
      </mesh>

      <pointLight position={[0, 0, 2.7]} color="#22d3ee" intensity={3.2} distance={14} />
    </group>
  )
}
