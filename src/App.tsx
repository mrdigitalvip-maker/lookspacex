import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { StarField } from '@/game/world/StarField'
import { SolarSystem } from '@/game/world/SolarSystem'
import { SpaceHUD } from '@/ui/HUD/SpaceHUD'
import { useGameStore } from '@/stores/gameStore'
import { useShipStore } from '@/stores/shipStore'
import type { SceneName } from '@/types/game'

function App() {
  const [scene, setScene] = useState<SceneName>('SPLASH')
  const isLoading = useGameStore((state) => state.isLoading)
  const setSceneStore = useGameStore((state) => state.setScene)
  const setPosition = useShipStore((state) => state.setPosition)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScene('LOGIN')
      setSceneStore('LOGIN')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [setSceneStore])

  useEffect(() => {
    setPosition([0, 0, 25])
  }, [setPosition])

  const sceneLabel = useMemo(() => {
    switch (scene) {
      case 'SPLASH':
        return 'LOOKSPACE'
      case 'LOGIN':
        return 'Acesso ao sistema'
      case 'LOADING':
        return 'Carregando universo'
      case 'STARBASE':
        return 'Base Estelar'
      case 'SPACE':
        return 'Exploração Espacial'
      default:
        return 'LOOKSPACE'
    }
  }, [scene])

  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      <SpaceHUD />
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 35], fov: 70 }}>
          <fog attach="fog" args={['#050816', 10, 120]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 20]} intensity={1.2} />
          <StarField />
          <SolarSystem />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {scene === 'SPLASH' ? (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="text-center">
            <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9 }} className="font-mono text-5xl font-semibold uppercase tracking-[0.6em] text-cyan-300">
              {sceneLabel}
            </motion.h1>
            <div className="mt-6 h-2 w-64 overflow-hidden rounded-full border border-cyan-400/30">
              <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
            </div>
          </div>
        </motion.div>
      ) : null}

      {scene === 'LOGIN' ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[radial-gradient(circle,_rgba(0,245,255,0.18),_transparent_50%)] px-6">
          <div className="w-full max-w-md rounded-[2rem] border border-cyan-400/30 bg-slate-950/70 p-8 shadow-[0_0_80px_rgba(0,245,255,0.2)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Acesso ao sistema</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Seja bem-vindo à LookSpace</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">Entre como visitante ou autentique-se para salvar sua progressão.</p>
            <div className="mt-6 space-y-3">
              <button className="w-full rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200 transition hover:bg-cyan-400/20">
                Entrar como Visitante
              </button>
              <button className="w-full rounded-full border border-cyan-400/30 bg-white/10 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/20">
                Continuar com Supabase
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center px-6 pb-6">
          <div className="w-full max-w-xl rounded-full border border-cyan-400/20 bg-slate-950/80 px-4 py-3 text-center text-sm text-cyan-200 backdrop-blur-xl">
            Carregando universo estelar...
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
