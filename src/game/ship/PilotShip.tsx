import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '@/config/game.config'
import { flightAudio } from '@/game/audio/FlightAudio'
import { CockpitInterior } from '@/game/ship/CockpitInterior'
import { useGameStore } from '@/stores/gameStore'
import { useMissionStore } from '@/stores/missionStore'
import { useShipStore } from '@/stores/shipStore'
import { useUIStore } from '@/stores/uiStore'

type KeyState = Record<string, boolean>

const CAMERA_DAMPING = 5.5
const TELEMETRY_INTERVAL = 0.08
const TARGET_LOCK_RANGE = 900
const TARGET_LOCK_DOT = 0.62
const WARP_DURATION = 3.25
const WARP_SPEED = 340

export function PilotShip() {
  const shipRef = useRef<THREE.Group>(null)
  const leftThrusterRef = useRef<THREE.MeshStandardMaterial>(null)
  const rightThrusterRef = useRef<THREE.MeshStandardMaterial>(null)
  const leftPlumeRef = useRef<THREE.Mesh>(null)
  const rightPlumeRef = useRef<THREE.Mesh>(null)
  const keysRef = useRef<KeyState>({})
  const velocityRef = useRef(new THREE.Vector3())
  const telemetryRef = useRef(0)
  const launchStartRef = useRef<number | null>(null)
  const warpStartedRef = useRef<number | null>(null)
  const { camera } = useThree()
  const setPosition = useShipStore((state) => state.setPosition)
  const setVelocity = useShipStore((state) => state.setVelocity)
  const consumeFuel = useShipStore((state) => state.consumeFuel)
  const fuel = useShipStore((state) => state.fuel)
  const viewMode = useShipStore((state) => state.viewMode)

  const forward = useMemo(() => new THREE.Vector3(), [])
  const brakeDirection = useMemo(() => new THREE.Vector3(), [])
  const desiredCameraPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredLookAt = useMemo(() => new THREE.Vector3(), [])
  const targetDirection = useMemo(() => new THREE.Vector3(), [])
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const warpDirection = useMemo(() => new THREE.Vector3(0, 0, -1), [])
  const warpVelocity = useMemo(() => new THREE.Vector3(), [])
  const cockpitWorld = useMemo(() => new THREE.Vector3(), [])
  const cockpitLook = useMemo(() => new THREE.Vector3(), [])
  const cameraOffset = useMemo(
    () => new THREE.Vector3(0, GAME_CONFIG.camera.thirdPersonHeight, GAME_CONFIG.camera.thirdPersonDistance),
    [],
  )
  const cockpitOffset = useMemo(() => new THREE.Vector3(0, 0.72, -0.16), [])

  useEffect(() => {
    const setKey = (event: KeyboardEvent, pressed: boolean) => {
      keysRef.current[event.code] = pressed
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
        event.preventDefault()
      }
    }

    const attemptTargetLock = () => {
      const ship = shipRef.current
      if (!ship || useGameStore.getState().isPaused) return

      const mission = useMissionStore.getState()
      if (mission.status !== 'active') return

      if (mission.targetLocked) {
        mission.setTargetLocked(false)
        useUIStore.getState().addNotification(`TARGET RELEASED // ${mission.targetName}`, 'info')
        return
      }

      forward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize()
      targetPosition.set(...mission.target)
      targetDirection.copy(targetPosition).sub(ship.position)
      const distance = targetDirection.length()
      targetDirection.normalize()
      const alignment = forward.dot(targetDirection)

      if (distance <= TARGET_LOCK_RANGE && alignment >= TARGET_LOCK_DOT) {
        mission.setTargetLocked(true)
        useUIStore.getState().addNotification(`TARGET LOCKED // ${mission.targetName}`, 'success')
      } else {
        useUIStore.getState().addNotification(`LOCK FAILED // Align nose with ${mission.targetName}`, 'warning')
      }
    }

    const attemptWarp = () => {
      const ship = shipRef.current
      if (!ship || useGameStore.getState().isPaused) return

      const mission = useMissionStore.getState()
      const shipState = useShipStore.getState()
      if (mission.id !== 'M002' || mission.status !== 'active') {
        useUIStore.getState().addNotification('WARP OFFLINE // No authorized vector', 'warning')
        return
      }
      if (!mission.targetLocked) {
        useUIStore.getState().addNotification(`WARP BLOCKED // Lock ${mission.targetName} first`, 'warning')
        return
      }
      if (shipState.energy < 20 || shipState.isWarping) {
        useUIStore.getState().addNotification('WARP BLOCKED // Insufficient energy', 'warning')
        return
      }

      targetPosition.set(...mission.target)
      warpDirection.copy(targetPosition).sub(ship.position).normalize()
      shipState.consumeEnergy(20)
      shipState.setWarping(true)
      warpStartedRef.current = performance.now() / 1000
      flightAudio.warpPulse()
      useUIStore.getState().addNotification('WARP DRIVE // ENGAGED', 'success')
    }

    const toggleCamera = () => {
      if (useGameStore.getState().isPaused) return
      const shipState = useShipStore.getState()
      shipState.toggleViewMode()
      const next = shipState.viewMode === 'cockpit' ? 'CHASE CAMERA' : 'COCKPIT'
      useUIStore.getState().addNotification(`VIEW MODE // ${next}`, 'info')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      setKey(event, true)
      if (event.repeat) return
      if (event.code === 'KeyT') attemptTargetLock()
      if (event.code === 'KeyR') attemptWarp()
      if (event.code === 'KeyC') toggleCamera()
    }
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
  }, [forward, targetDirection, targetPosition, warpDirection])

  useFrame((state, delta) => {
    const ship = shipRef.current
    if (!ship) return

    const gameState = useGameStore.getState()
    const shipState = useShipStore.getState()
    const mission = useMissionStore.getState()
    const warping = shipState.isWarping

    forward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize()
    cockpitWorld.copy(cockpitOffset).applyQuaternion(ship.quaternion).add(ship.position)
    cockpitLook.copy(ship.position).addScaledVector(forward, 28).add(new THREE.Vector3(0, 0.65, 0))

    if (gameState.currentScene === 'LOADING') {
      if (launchStartRef.current === null) launchStartRef.current = state.clock.elapsedTime
      const elapsed = state.clock.elapsedTime - launchStartRef.current
      const t = THREE.MathUtils.clamp(elapsed / 4.5, 0, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const angle = THREE.MathUtils.lerp(-1.18, 0.08, eased)
      const radius = THREE.MathUtils.lerp(25, GAME_CONFIG.camera.thirdPersonDistance + 1.5, eased)
      const height = THREE.MathUtils.lerp(9, GAME_CONFIG.camera.thirdPersonHeight, eased)

      desiredCameraPosition.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius).add(ship.position)
      if (t > 0.68) {
        const cockpitBlend = THREE.MathUtils.smoothstep(t, 0.68, 1)
        desiredCameraPosition.lerp(cockpitWorld, cockpitBlend)
      }
      camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-4.2 * delta))
      desiredLookAt.copy(ship.position).addScaledVector(forward, t > 0.68 ? 28 : 0.5).add(new THREE.Vector3(0, 0.25, 0))
      camera.lookAt(desiredLookAt)
      ship.rotation.y = Math.sin(elapsed * 0.38) * 0.06 * (1 - t)

      if (camera instanceof THREE.PerspectiveCamera) {
        const launchFov = t > 0.68 ? THREE.MathUtils.lerp(64, 70, (t - 0.68) / 0.32) : THREE.MathUtils.lerp(58, 68, eased)
        camera.fov = THREE.MathUtils.lerp(camera.fov, launchFov, 1 - Math.exp(-4 * delta))
        camera.updateProjectionMatrix()
      }

      const launchPulse = 2.2 + Math.sin(elapsed * 7) * 0.35
      if (leftThrusterRef.current) leftThrusterRef.current.emissiveIntensity = launchPulse
      if (rightThrusterRef.current) rightThrusterRef.current.emissiveIntensity = launchPulse
      return
    }

    launchStartRef.current = null

    if (gameState.isPaused) {
      const angle = state.clock.elapsedTime * 0.22
      desiredCameraPosition
        .set(Math.sin(angle) * 12.5, 5.4 + Math.sin(angle * 0.7) * 1.2, Math.cos(angle) * 12.5)
        .add(ship.position)
      camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-4 * delta))
      camera.lookAt(ship.position)
      return
    }

    const keys = keysRef.current
    const accelerating = Boolean(keys.KeyW || keys.Space)
    const braking = Boolean(keys.KeyS)
    const boosting = Boolean((keys.ShiftLeft || keys.ShiftRight) && accelerating && fuel > 0 && !warping)
    const maxSpeed = boosting ? GAME_CONFIG.physics.turboSpeed : GAME_CONFIG.physics.maxSpeed
    const acceleration = boosting ? GAME_CONFIG.physics.acceleration * 3.4 : GAME_CONFIG.physics.acceleration
    const velocity = velocityRef.current

    const yawInput = warping ? 0 : Number(Boolean(keys.KeyA || keys.ArrowLeft)) - Number(Boolean(keys.KeyD || keys.ArrowRight))
    const pitchInput = warping ? 0 : Number(Boolean(keys.ArrowDown)) - Number(Boolean(keys.ArrowUp))
    const rollInput = warping ? 0 : Number(Boolean(keys.KeyQ)) - Number(Boolean(keys.KeyE))
    const rotationSpeed = GAME_CONFIG.physics.rotationSpeed

    ship.rotateY(yawInput * rotationSpeed * delta)
    ship.rotateX(pitchInput * rotationSpeed * 0.78 * delta)
    ship.rotateZ(rollInput * rotationSpeed * 1.1 * delta)

    forward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize()

    if (warping) {
      const elapsed = warpStartedRef.current === null ? 0 : performance.now() / 1000 - warpStartedRef.current
      warpVelocity.copy(warpDirection).multiplyScalar(WARP_SPEED)
      velocity.lerp(warpVelocity, 1 - Math.exp(-3.6 * delta))
      targetPosition.set(...mission.target)
      const targetDistance = ship.position.distanceTo(targetPosition)

      if (targetDistance <= mission.arrivalRadius * 0.9 || elapsed >= WARP_DURATION) {
        shipState.setWarping(false)
        warpStartedRef.current = null
        if (velocity.length() > 82) velocity.setLength(82)
        useUIStore.getState().addNotification('WARP EXIT // Navigation lock restored', 'info')
      }
    } else {
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
    }

    ship.position.addScaledVector(velocity, delta)

    const cockpit = shipState.viewMode === 'cockpit'
    if (cockpit) {
      desiredCameraPosition.copy(cockpitOffset).applyQuaternion(ship.quaternion).add(ship.position)
      desiredLookAt.copy(ship.position).addScaledVector(forward, warping ? 90 : 34).add(new THREE.Vector3(0, 0.55, 0))
    } else {
      desiredCameraPosition.copy(cameraOffset).applyQuaternion(ship.quaternion).add(ship.position)
      desiredLookAt.copy(ship.position).addScaledVector(forward, warping ? 70 : 22)
    }

    const cameraBlend = 1 - Math.exp(-(cockpit ? 9.5 : warping ? 3.2 : CAMERA_DAMPING) * delta)
    camera.position.lerp(desiredCameraPosition, cameraBlend)
    camera.lookAt(desiredLookAt)

    if (camera instanceof THREE.PerspectiveCamera) {
      const speedRatio = Math.min(1, velocity.length() / WARP_SPEED)
      const baseFov = cockpit ? 70 : GAME_CONFIG.camera.fov
      const targetFov = warping ? (cockpit ? 96 : 108) : baseFov + speedRatio * 6 + (boosting ? 4 : 0)
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-(warping ? 7 : 5.5) * delta))
      camera.updateProjectionMatrix()
    }

    const speedRatio = Math.min(1, velocity.length() / WARP_SPEED)
    const enginePower = Math.min(1, velocity.length() / Math.max(1, GAME_CONFIG.physics.turboSpeed))
    const throttleGlow = accelerating || warping ? 2.8 : 0.9
    const pulse = throttleGlow + enginePower * 8 + (warping ? 8 : 0) + Math.sin(state.clock.elapsedTime * 18) * 0.35
    if (leftThrusterRef.current) leftThrusterRef.current.emissiveIntensity = pulse
    if (rightThrusterRef.current) rightThrusterRef.current.emissiveIntensity = pulse

    const plumeLength = 0.6 + enginePower * 1.8 + (warping ? 4.8 : boosting ? 1.2 : 0)
    for (const plume of [leftPlumeRef.current, rightPlumeRef.current]) {
      if (!plume) continue
      plume.visible = accelerating || velocity.length() > 6 || warping
      plume.scale.set(1 + speedRatio * 0.35, plumeLength, 1 + speedRatio * 0.35)
    }

    telemetryRef.current += delta
    if (telemetryRef.current >= TELEMETRY_INTERVAL) {
      telemetryRef.current = 0
      setPosition([ship.position.x, ship.position.y, ship.position.z])
      setVelocity(velocity.length())
      flightAudio.update(speedRatio, warping)

      if (accelerating && fuel > 0 && !warping) {
        consumeFuel((boosting ? 0.095 : 0.02) * TELEMETRY_INTERVAL)
      }
    }
  })

  return (
    <group ref={shipRef} position={[0, 0, 25]} rotation={[0, 0, 0]}>
      <CockpitInterior />

      <group visible={viewMode === 'chase'}>
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

        <mesh ref={leftPlumeRef} position={[-1.15, -0.18, 3.75]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <coneGeometry args={[0.24, 2.8, 18, 1, true]} />
          <meshBasicMaterial color="#7cf4ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh ref={rightPlumeRef} position={[1.15, -0.18, 3.75]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <coneGeometry args={[0.24, 2.8, 18, 1, true]} />
          <meshBasicMaterial color="#7cf4ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>

        <mesh position={[-1.15, -0.18, 3.05]}>
          <sphereGeometry args={[0.28, 16, 12]} />
          <meshBasicMaterial color="#8ff7ff" toneMapped={false} />
        </mesh>
        <mesh position={[1.15, -0.18, 3.05]}>
          <sphereGeometry args={[0.28, 16, 12]} />
          <meshBasicMaterial color="#8ff7ff" toneMapped={false} />
        </mesh>
      </group>

      <pointLight position={[0, 0, 2.7]} color="#22d3ee" intensity={3.2} distance={14} />
    </group>
  )
}
