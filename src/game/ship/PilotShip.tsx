import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '@/config/game.config'
import { flightAudio } from '@/game/audio/FlightAudio'
import { CockpitInterior } from '@/game/ship/CockpitInterior'
import { useGameStore } from '@/stores/gameStore'
import { useMissionStore } from '@/stores/missionStore'
import { useShipStore } from '@/stores/shipStore'
import { useStarBaseStore } from '@/stores/starbaseStore'
import { useUIStore } from '@/stores/uiStore'

type KeyState = Record<string, boolean>

const CAMERA_DAMPING = 5.5
const TELEMETRY_INTERVAL = 0.08
const TARGET_LOCK_RANGE = 1200
const TARGET_LOCK_DOT = 0.62
const WARP_DURATION = 3.25
const WARP_SPEED = 340
const STARBASE_LAUNCH_DURATION = 6.2
const DOCKING_DURATION = 4.2
const DOCKING_RANGE = 150
const DOCK_POSITION = new THREE.Vector3(0, -0.18, 39)

export function PilotShip() {
  const shipRef = useRef<THREE.Group>(null)
  const exteriorRef = useRef<THREE.Group>(null)
  const leftThrusterRef = useRef<THREE.MeshStandardMaterial>(null)
  const rightThrusterRef = useRef<THREE.MeshStandardMaterial>(null)
  const leftPlumeRef = useRef<THREE.Mesh>(null)
  const rightPlumeRef = useRef<THREE.Mesh>(null)
  const keysRef = useRef<KeyState>({})
  const velocityRef = useRef(new THREE.Vector3())
  const telemetryRef = useRef(0)
  const launchStartRef = useRef<number | null>(null)
  const warpStartedRef = useRef<number | null>(null)
  const dockingStartRef = useRef<number | null>(null)
  const dockingOriginRef = useRef(new THREE.Vector3())
  const { camera } = useThree()
  const setPosition = useShipStore((state) => state.setPosition)
  const setVelocity = useShipStore((state) => state.setVelocity)
  const consumeFuel = useShipStore((state) => state.consumeFuel)
  const fuel = useShipStore((state) => state.fuel)
  const viewMode = useShipStore((state) => state.viewMode)
  const currentShip = useShipStore((state) => state.currentShip)

  const forward = useMemo(() => new THREE.Vector3(), [])
  const brakeDirection = useMemo(() => new THREE.Vector3(), [])
  const desiredCameraPosition = useMemo(() => new THREE.Vector3(), [])
  const desiredLookAt = useMemo(() => new THREE.Vector3(), [])
  const targetDirection = useMemo(() => new THREE.Vector3(), [])
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const warpDirection = useMemo(() => new THREE.Vector3(0, 0, -1), [])
  const warpVelocity = useMemo(() => new THREE.Vector3(), [])
  const cockpitWorld = useMemo(() => new THREE.Vector3(), [])
  const cabinWorld = useMemo(() => new THREE.Vector3(), [])
  const cameraOffset = useMemo(
    () => new THREE.Vector3(0, GAME_CONFIG.camera.thirdPersonHeight, GAME_CONFIG.camera.thirdPersonDistance),
    [],
  )
  const cockpitOffset = useMemo(() => new THREE.Vector3(0, 0.72, -0.16), [])
  const cabinOffset = useMemo(() => new THREE.Vector3(0, 0.48, 2.2), [])

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
      const warpMission = mission.id === 'M002' || mission.id === 'M003'
      if (!warpMission || mission.status !== 'active') {
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
      useUIStore.getState().addNotification(`WARP DRIVE // ${mission.targetName}`, 'success')
    }

    const attemptDocking = () => {
      const ship = shipRef.current
      if (!ship || useGameStore.getState().isPaused) return

      const mission = useMissionStore.getState()
      const base = useStarBaseStore.getState()
      if (mission.id !== 'M003' || mission.status !== 'active') {
        useUIStore.getState().addNotification('DOCKING OFFLINE // No active return vector', 'warning')
        return
      }

      targetPosition.set(...mission.target)
      const distance = ship.position.distanceTo(targetPosition)
      if (distance > DOCKING_RANGE) {
        useUIStore.getState().addNotification(`DOCKING DENIED // Approach HELIOS OUTPOST (${distance.toFixed(0)} u)`, 'warning')
        return
      }

      base.setDockingState('docking')
      base.setServicesOpen(false)
      dockingOriginRef.current.copy(ship.position)
      dockingStartRef.current = performance.now() / 1000
      velocityRef.current.set(0, 0, 0)
      useShipStore.getState().setWarping(false)
      mission.setTargetLocked(false)
      useUIStore.getState().addNotification('HELIOS CONTROL // AUTODOCK ENGAGED', 'success')
    }

    const toggleServices = () => {
      const base = useStarBaseStore.getState()
      if (base.dockingState !== 'docked') {
        useUIStore.getState().addNotification('STARBASE SERVICES // Dock first', 'warning')
        return
      }
      base.toggleServices()
    }

    const toggleCamera = () => {
      if (useGameStore.getState().isPaused) return
      const shipState = useShipStore.getState()
      const current = shipState.viewMode
      shipState.toggleViewMode()
      const next = current === 'cockpit' ? 'CABIN INTERIOR' : current === 'cabin' ? 'CHASE CAMERA' : 'COCKPIT'
      useUIStore.getState().addNotification(`VIEW MODE // ${next}`, 'info')
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      setKey(event, true)
      if (event.repeat) return
      if (event.code === 'KeyT') attemptTargetLock()
      if (event.code === 'KeyR') attemptWarp()
      if (event.code === 'KeyG') attemptDocking()
      if (event.code === 'KeyH') toggleServices()
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
    const baseState = useStarBaseStore.getState()
    const warping = shipState.isWarping

    forward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize()
    cockpitWorld.copy(cockpitOffset).applyQuaternion(ship.quaternion).add(ship.position)
    cabinWorld.copy(cabinOffset).applyQuaternion(ship.quaternion).add(ship.position)

    if (gameState.currentScene === 'LOADING') {
      if (launchStartRef.current === null) launchStartRef.current = state.clock.elapsedTime
      const elapsed = state.clock.elapsedTime - launchStartRef.current
      const t = THREE.MathUtils.clamp(elapsed / STARBASE_LAUNCH_DURATION, 0, 1)
      const departure = THREE.MathUtils.smoothstep(t, 0.18, 0.84)
      const lift = THREE.MathUtils.smoothstep(t, 0.2, 0.52)

      ship.position.set(0, THREE.MathUtils.lerp(-0.2, 0.75, lift), THREE.MathUtils.lerp(42, -31, departure))
      ship.rotation.x = 0
      ship.rotation.z = 0
      ship.rotation.y = Math.sin(elapsed * 0.42) * 0.025 * (1 - departure)

      forward.set(0, 0, -1).applyQuaternion(ship.quaternion).normalize()
      cockpitWorld.copy(cockpitOffset).applyQuaternion(ship.quaternion).add(ship.position)

      const externalPhase = THREE.MathUtils.clamp(t / 0.68, 0, 1)
      const angle = THREE.MathUtils.lerp(-1.15, -0.02, externalPhase)
      const radius = THREE.MathUtils.lerp(20, 12.8, externalPhase)
      const height = THREE.MathUtils.lerp(7.8, 4.6, externalPhase)
      desiredCameraPosition.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius).add(ship.position)

      if (t > 0.68) {
        const cockpitBlend = THREE.MathUtils.smoothstep(t, 0.68, 0.98)
        desiredCameraPosition.lerp(cockpitWorld, cockpitBlend)
      }

      camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-4.8 * delta))
      desiredLookAt.copy(ship.position).addScaledVector(forward, t > 0.68 ? 34 : 1.5).add(new THREE.Vector3(0, 0.35, 0))
      camera.lookAt(desiredLookAt)

      if (exteriorRef.current) exteriorRef.current.visible = t < 0.79

      if (camera instanceof THREE.PerspectiveCamera) {
        const launchFov = t > 0.68 ? THREE.MathUtils.lerp(64, 70, (t - 0.68) / 0.32) : THREE.MathUtils.lerp(56, 68, externalPhase)
        camera.fov = THREE.MathUtils.lerp(camera.fov, launchFov, 1 - Math.exp(-4.4 * delta))
        camera.updateProjectionMatrix()
      }

      const engineRise = THREE.MathUtils.smoothstep(t, 0.18, 0.5)
      const launchPulse = 1.5 + engineRise * 7 + Math.sin(elapsed * 9) * 0.35
      if (leftThrusterRef.current) leftThrusterRef.current.emissiveIntensity = launchPulse
      if (rightThrusterRef.current) rightThrusterRef.current.emissiveIntensity = launchPulse

      for (const plume of [leftPlumeRef.current, rightPlumeRef.current]) {
        if (!plume) continue
        plume.visible = t > 0.22 && t < 0.79
        plume.scale.set(1 + engineRise * 0.35, 0.8 + engineRise * 2.5, 1 + engineRise * 0.35)
      }

      telemetryRef.current += delta
      if (telemetryRef.current >= TELEMETRY_INTERVAL) {
        telemetryRef.current = 0
        const simulatedSpeed = departure * 48
        setPosition([ship.position.x, ship.position.y, ship.position.z])
        setVelocity(simulatedSpeed)
        flightAudio.update(Math.min(1, simulatedSpeed / GAME_CONFIG.physics.turboSpeed), false)
      }
      return
    }

    launchStartRef.current = null
    if (exteriorRef.current) exteriorRef.current.visible = shipState.viewMode === 'chase'

    if (mission.id === 'M003' && mission.status === 'active' && mission.distance <= 220 && baseState.dockingState === 'away') {
      baseState.setDockingState('approach')
      useUIStore.getState().addNotification('HELIOS CONTROL // Docking corridor available [G]', 'info')
    }

    if (baseState.dockingState === 'docking') {
      if (dockingStartRef.current === null) dockingStartRef.current = performance.now() / 1000
      const elapsed = performance.now() / 1000 - dockingStartRef.current
      const t = THREE.MathUtils.clamp(elapsed / DOCKING_DURATION, 0, 1)
      const eased = THREE.MathUtils.smoothstep(t, 0, 1)
      velocityRef.current.set(0, 0, 0)
      ship.position.copy(dockingOriginRef.current).lerp(DOCK_POSITION, eased)
      ship.quaternion.slerp(new THREE.Quaternion(), 1 - Math.exp(-5 * delta))

      desiredCameraPosition.set(8.8, 4.3, 10.5).add(ship.position)
      camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-4.5 * delta))
      camera.lookAt(ship.position)
      if (exteriorRef.current) exteriorRef.current.visible = true

      setPosition([ship.position.x, ship.position.y, ship.position.z])
      setVelocity(0)

      if (t >= 1) {
        baseState.setDockingState('docked')
        shipState.setViewMode('cabin')
        dockingStartRef.current = null
        mission.completeMission()
        useUIStore.getState().addNotification('DOCKING COMPLETE // Helios services available [H]', 'success')
      }
      return
    }

    if (baseState.dockingState === 'docked') {
      velocityRef.current.set(0, 0, 0)
      ship.position.copy(DOCK_POSITION)
      setPosition([ship.position.x, ship.position.y, ship.position.z])
      setVelocity(0)
    }

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
    const flightLocked = baseState.dockingState === 'docked'
    const accelerating = !flightLocked && Boolean(keys.KeyW || keys.Space)
    const braking = !flightLocked && Boolean(keys.KeyS)
    const boosting = Boolean((keys.ShiftLeft || keys.ShiftRight) && accelerating && fuel > 0 && !warping)
    const maxSpeed = boosting ? GAME_CONFIG.physics.turboSpeed : GAME_CONFIG.physics.maxSpeed
    const acceleration = boosting ? GAME_CONFIG.physics.acceleration * 3.4 : GAME_CONFIG.physics.acceleration
    const velocity = velocityRef.current

    const yawInput = warping || flightLocked ? 0 : Number(Boolean(keys.KeyA || keys.ArrowLeft)) - Number(Boolean(keys.KeyD || keys.ArrowRight))
    const pitchInput = warping || flightLocked ? 0 : Number(Boolean(keys.ArrowDown)) - Number(Boolean(keys.ArrowUp))
    const rollInput = warping || flightLocked ? 0 : Number(Boolean(keys.KeyQ)) - Number(Boolean(keys.KeyE))
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
    } else if (!flightLocked) {
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

    if (!flightLocked) ship.position.addScaledVector(velocity, delta)

    const cockpit = shipState.viewMode === 'cockpit'
    const cabin = shipState.viewMode === 'cabin'
    if (cockpit) {
      desiredCameraPosition.copy(cockpitOffset).applyQuaternion(ship.quaternion).add(ship.position)
      desiredLookAt.copy(ship.position).addScaledVector(forward, warping ? 90 : 34).add(new THREE.Vector3(0, 0.55, 0))
    } else if (cabin) {
      desiredCameraPosition.copy(cabinOffset).applyQuaternion(ship.quaternion).add(ship.position)
      desiredLookAt.copy(ship.position).addScaledVector(forward, warping ? 52 : 10).add(new THREE.Vector3(0, 0.38, 0))
    } else {
      desiredCameraPosition.copy(cameraOffset).applyQuaternion(ship.quaternion).add(ship.position)
      desiredLookAt.copy(ship.position).addScaledVector(forward, warping ? 70 : 22)
    }

    const interiorView = cockpit || cabin
    const cameraBlend = 1 - Math.exp(-(interiorView ? 9.5 : warping ? 3.2 : CAMERA_DAMPING) * delta)
    camera.position.lerp(desiredCameraPosition, cameraBlend)
    camera.lookAt(desiredLookAt)

    if (camera instanceof THREE.PerspectiveCamera) {
      const speedRatio = Math.min(1, velocity.length() / WARP_SPEED)
      const baseFov = cockpit ? 70 : cabin ? 66 : GAME_CONFIG.camera.fov
      const targetFov = warping ? (interiorView ? 96 : 108) : baseFov + speedRatio * 6 + (boosting ? 4 : 0)
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
      plume.visible = shipState.viewMode === 'chase' && (accelerating || velocity.length() > 6 || warping)
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

  const hullColor = currentShip?.id === 'vesper-interceptor' ? '#22173f' : currentShip?.id === 'atlas-hauler' ? '#3a2a12' : '#182238'
  const accentColor = currentShip?.placeholder_color ?? '#6ee7ff'

  return (
    <group ref={shipRef} position={[0, -0.2, 42]} rotation={[0, 0, 0]}>
      <CockpitInterior />

      <group ref={exteriorRef} visible={viewMode === 'chase'}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[1.25, 5.2, 6]} />
          <meshStandardMaterial color={hullColor} metalness={0.88} roughness={0.22} />
        </mesh>

        <mesh position={[0, 0.55, -0.65]} scale={[0.72, 0.35, 1.15]}>
          <sphereGeometry args={[1, 32, 20]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} metalness={0.3} roughness={0.08} transparent opacity={0.82} />
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

      <pointLight position={[0, 0, 2.7]} color={accentColor} intensity={3.2} distance={14} />
    </group>
  )
}
