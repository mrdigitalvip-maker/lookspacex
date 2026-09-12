import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { GAME_CONFIG } from '@/config/game.config'
import { PilotShip } from '@/game/ship/PilotShip'
import { CollisionSystem } from '@/game/systems/CollisionSystem'
import { AsteroidField } from '@/game/world/AsteroidField'
import { MissionBeacon } from '@/game/world/MissionBeacon'
import { SolarSystem } from '@/game/world/SolarSystem'
import { StarBaseHangar } from '@/game/world/StarBaseHangar'
import { StarField } from '@/game/world/StarField'
import { WarpTunnel } from '@/game/world/WarpTunnel'

export function SpaceScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{
        position: [0, GAME_CONFIG.camera.thirdPersonHeight, GAME_CONFIG.camera.thirdPersonDistance + 25],
        fov: GAME_CONFIG.camera.fov,
        near: GAME_CONFIG.camera.near,
        far: GAME_CONFIG.camera.far,
      }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.15
      }}
    >
      <color attach="background" args={['#01030a']} />
      <fog attach="fog" args={['#02050d', 220, 2200]} />
      <ambientLight intensity={0.08} />
      <StarField />
      <SolarSystem />
      <StarBaseHangar />
      <AsteroidField />
      <MissionBeacon />
      <CollisionSystem />
      <WarpTunnel />
      <PilotShip />
    </Canvas>
  )
}
