import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { PilotShip } from '@/game/ship/PilotShip'
import { SolarSystem } from '@/game/world/SolarSystem'
import { StarField } from '@/game/world/StarField'
import { GAME_CONFIG } from '@/config/game.config'

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
    >
      <color attach="background" args={['#01030a']} />
      <fog attach="fog" args={['#02050d', 220, 2200]} />
      <ambientLight intensity={0.08} />
      <StarField />
      <SolarSystem />
      <PilotShip />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.15} luminanceThreshold={0.72} luminanceSmoothing={0.25} mipmapBlur />
        <Vignette eskil={false} offset={0.14} darkness={0.82} />
      </EffectComposer>
    </Canvas>
  )
}
