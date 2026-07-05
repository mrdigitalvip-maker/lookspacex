export const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

export const fadeOut = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 0, y: 16 },
}

export const slideInLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
}

export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
}

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export const glowPulse = {
  initial: { filter: 'drop-shadow(0 0 0px #00f5ff)' },
  animate: {
    filter: ['drop-shadow(0 0 0px #00f5ff)', 'drop-shadow(0 0 20px #00f5ff)', 'drop-shadow(0 0 0px #00f5ff)'],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
}
