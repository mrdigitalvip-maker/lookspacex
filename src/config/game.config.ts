export const GAME_CONFIG = {
  version: '1.0.0',
  name: 'LookSpace',
  debug: false,
  physics: {
    maxSpeed: 56,
    turboSpeed: 190,
    acceleration: 18,
    deceleration: 12,
    rotationSpeed: 1.35,
  },
  camera: {
    fov: 72,
    near: 0.1,
    far: 100000,
    thirdPersonDistance: 13,
    thirdPersonHeight: 4.5,
  },
  universe: {
    starCount: 50000,
    universeRadius: 50000,
    planetCount: 8,
  },
  player: {
    startCredits: 1000,
    startShip: 'aurora-scout',
    xpPerLevel: 1000,
  },
  audio: {
    masterVolume: 0.8,
    musicVolume: 0.5,
    sfxVolume: 0.8,
  },
} as const
