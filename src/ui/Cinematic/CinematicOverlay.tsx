import { AnimatePresence, motion } from 'framer-motion'

export type CinematicMode = 'launch' | 'mission-complete' | null

interface CinematicOverlayProps {
  mode: CinematicMode
  missionId?: string
  missionTitle?: string
}

export function CinematicOverlay({ mode, missionId, missionTitle }: CinematicOverlayProps) {
  return (
    <AnimatePresence>
      {mode ? (
        <motion.div
          className={`cinematic-overlay cinematic-${mode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          aria-live="polite"
        >
          <motion.div
            className="cinematic-letterbox cinematic-letterbox-top"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
          <motion.div
            className="cinematic-letterbox cinematic-letterbox-bottom"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />

          {mode === 'launch' ? (
            <motion.div
              className="cinematic-copy cinematic-launch-copy"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, -8] }}
              transition={{ duration: 4.6, times: [0, 0.16, 0.78, 1] }}
            >
              <span>HELIOS OUTPOST // DEPARTURE VECTOR 07</span>
              <strong>AURORA SCOUT</strong>
              <p>Pilot link established. Releasing flight authority.</p>
            </motion.div>
          ) : (
            <motion.div
              className="cinematic-copy cinematic-mission-copy"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 1.02] }}
              transition={{ duration: 3.1, times: [0, 0.18, 0.78, 1] }}
            >
              <span>{missionId ?? 'MISSION'} // DATA VERIFIED</span>
              <strong>{missionTitle ?? 'Objective Complete'}</strong>
              <p>Navigation archive synchronized. New deep-space vector available.</p>
            </motion.div>
          )}

          <div className="cinematic-scanline" aria-hidden="true" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
