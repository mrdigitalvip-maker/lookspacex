import { motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { GAME_CONFIG } from '@/config/game.config'
import { flightAudio } from '@/game/audio/FlightAudio'
import { useGameStore } from '@/stores/gameStore'
import { useMissionStore } from '@/stores/missionStore'
import { CinematicOverlay, type CinematicMode } from '@/ui/Cinematic/CinematicOverlay'
import { SpaceHUD } from '@/ui/HUD/SpaceHUD'

const SpaceScene = lazy(() =>
  import('@/game/world/SpaceScene').then((module) => ({ default: module.SpaceScene })),
)

function App() {
  const scene = useGameStore((state) => state.currentScene)
  const isLoading = useGameStore((state) => state.isLoading)
  const setScene = useGameStore((state) => state.setScene)
  const setLoading = useGameStore((state) => state.setLoading)
  const pause = useGameStore((state) => state.pause)
  const resume = useGameStore((state) => state.resume)
  const missionId = useMissionStore((state) => state.id)
  const missionTitle = useMissionStore((state) => state.title)
  const missionStatus = useMissionStore((state) => state.status)
  const advanceMission = useMissionStore((state) => state.advanceMission)
  const [cinematicMode, setCinematicMode] = useState<CinematicMode>(null)
  const launchTimerRef = useRef<number | null>(null)
  const missionTimerRef = useRef<number | null>(null)
  const lastCompletedMissionRef = useRef<string | null>(null)
  const shouldMountFlight = scene === 'LOADING' || scene === 'SPACE'

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setScene('LOGIN')
      setLoading(false)
    }, 2200)

    return () => window.clearTimeout(splashTimer)
  }, [setLoading, setScene])

  useEffect(() => {
    if (scene !== 'SPACE' || missionStatus !== 'completed') return
    if (lastCompletedMissionRef.current === missionId) return

    lastCompletedMissionRef.current = missionId
    pause()
    setCinematicMode('mission-complete')

    missionTimerRef.current = window.setTimeout(() => {
      advanceMission()
      resume()
      setCinematicMode(null)
      missionTimerRef.current = null
    }, 3300)
  }, [advanceMission, missionId, missionStatus, pause, resume, scene])

  useEffect(() => {
    return () => {
      if (launchTimerRef.current !== null) window.clearTimeout(launchTimerRef.current)
      if (missionTimerRef.current !== null) window.clearTimeout(missionTimerRef.current)
    }
  }, [])

  const beginGuestSession = () => {
    if (launchTimerRef.current !== null) window.clearTimeout(launchTimerRef.current)

    flightAudio.start()
    setCinematicMode('launch')
    setScene('LOADING')
    setLoading(true)

    launchTimerRef.current = window.setTimeout(() => {
      setLoading(false)
      setScene('SPACE')
      setCinematicMode(null)
      launchTimerRef.current = null
    }, 4800)
  }

  return (
    <main className="lookspace-shell">
      {shouldMountFlight ? (
        <div className="space-canvas" aria-hidden="true">
          <Suspense fallback={<div className="space-preload" /> }>
            <SpaceScene />
          </Suspense>
        </div>
      ) : null}

      {scene === 'SPACE' && cinematicMode !== 'mission-complete' ? <SpaceHUD /> : null}

      <div className="build-chip">CINEMATIC FLIGHT // {GAME_CONFIG.version}</div>

      {scene === 'SPLASH' ? (
        <motion.section
          className="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
        >
          <motion.div
            className="splash-content"
            initial={{ scale: 0.9, opacity: 0, filter: 'blur(8px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.15, ease: 'easeOut' }}
          >
            <p className="eyebrow">DEEP SPACE EXPLORATION SYSTEM</p>
            <h1 className="brand-title">LOOKSPACE</h1>
            <div className="splash-loader" aria-hidden="true">
              <motion.div
                className="splash-loader-bar"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
            </div>
            <p className="splash-status">Waking stellar navigation core</p>
          </motion.div>
        </motion.section>
      ) : null}

      {scene === 'LOGIN' ? (
        <section className="entry-screen">
          <motion.div
            className="entry-panel"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.72, ease: 'easeOut' }}
          >
            <div className="entry-signal" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="eyebrow">PILOT ACCESS // HELIOS NETWORK</p>
            <h2>Enter the living universe.</h2>
            <p className="entry-copy">
              Launch the Aurora Scout into a cinematic deep-space campaign. Every flight, mission and discovery expands the universe ahead.
            </p>
            <button className="primary-action" type="button" onClick={beginGuestSession}>
              <span>Begin cinematic launch</span>
              <strong>→</strong>
            </button>
            <button className="secondary-action" type="button" disabled>
              Online pilot profile // under construction
            </button>
            <div className="entry-meta">
              <span>W/S thrust</span>
              <span>A/D yaw</span>
              <span>Arrows pitch</span>
              <span>Q/E roll</span>
              <span>T target</span>
              <span>R warp</span>
              <span>Shift boost</span>
            </div>
          </motion.div>
        </section>
      ) : null}

      {scene === 'LOADING' && isLoading ? (
        <div className="launch-status" aria-hidden="true">
          <span>FLIGHT AUTHORITY TRANSFER</span>
          <i />
        </div>
      ) : null}

      <CinematicOverlay mode={cinematicMode} missionId={missionId} missionTitle={missionTitle} />
    </main>
  )
}

export default App
