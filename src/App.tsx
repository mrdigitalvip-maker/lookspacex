import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { GAME_CONFIG } from '@/config/game.config'
import { SpaceScene } from '@/game/world/SpaceScene'
import { useGameStore } from '@/stores/gameStore'
import { SpaceHUD } from '@/ui/HUD/SpaceHUD'

function App() {
  const scene = useGameStore((state) => state.currentScene)
  const isLoading = useGameStore((state) => state.isLoading)
  const setScene = useGameStore((state) => state.setScene)
  const setLoading = useGameStore((state) => state.setLoading)
  const launchTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setScene('LOGIN')
      setLoading(false)
    }, 1900)

    return () => window.clearTimeout(splashTimer)
  }, [setLoading, setScene])

  useEffect(() => {
    return () => {
      if (launchTimerRef.current !== null) {
        window.clearTimeout(launchTimerRef.current)
      }
    }
  }, [])

  const beginGuestSession = () => {
    if (launchTimerRef.current !== null) {
      window.clearTimeout(launchTimerRef.current)
    }

    setScene('LOADING')
    setLoading(true)
    launchTimerRef.current = window.setTimeout(() => {
      setLoading(false)
      setScene('SPACE')
      launchTimerRef.current = null
    }, 1350)
  }

  return (
    <main className="lookspace-shell">
      <div className="space-canvas" aria-hidden="true">
        <SpaceScene />
      </div>

      {scene === 'SPACE' ? <SpaceHUD /> : null}

      <div className="build-chip">FLIGHT FOUNDATION // {GAME_CONFIG.version}</div>

      {scene === 'SPLASH' ? (
        <motion.section
          className="splash-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="splash-content"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <p className="eyebrow">DEEP SPACE EXPLORATION SYSTEM</p>
            <h1 className="brand-title">LOOKSPACE</h1>
            <div className="splash-loader" aria-hidden="true">
              <motion.div
                className="splash-loader-bar"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.55, ease: 'easeInOut' }}
              />
            </div>
            <p className="splash-status">Initializing stellar navigation</p>
          </motion.div>
        </motion.section>
      ) : null}

      {scene === 'LOGIN' ? (
        <section className="entry-screen">
          <motion.div
            className="entry-panel"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="entry-signal" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="eyebrow">PILOT ACCESS // HELIOS NETWORK</p>
            <h2>Enter the living universe.</h2>
            <p className="entry-copy">
              Your first flight is ready. Launch as a guest and take control of the Aurora Scout while the online profile layer is finalized.
            </p>
            <button className="primary-action" type="button" onClick={beginGuestSession}>
              <span>Launch guest flight</span>
              <strong>→</strong>
            </button>
            <button className="secondary-action" type="button" disabled>
              Online pilot profile // next build
            </button>
            <div className="entry-meta">
              <span>W/S thrust</span>
              <span>A/D yaw</span>
              <span>Arrows pitch</span>
              <span>Q/E roll</span>
              <span>Shift boost</span>
            </div>
          </motion.div>
        </section>
      ) : null}

      {scene === 'LOADING' || isLoading ? (
        <section className="flight-loader" aria-live="polite">
          <div className="flight-loader-core">
            <div className="orbital-loader" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <p className="eyebrow">AURORA SCOUT // LINK ESTABLISHED</p>
            <h2>Transferring flight control</h2>
            <p>Calibrating navigation, telemetry and local stellar coordinates.</p>
          </div>
        </section>
      ) : null}
    </main>
  )
}

export default App
