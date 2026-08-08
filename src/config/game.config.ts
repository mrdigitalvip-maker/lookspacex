export const GAME_CONFIG = {
  version: '0.5.0',
  name: 'LookSpace',
  debug: false,
  physics: {
    maxSpeed: 50,
    turboSpeed: 200,
    acceleration: 15,
    deceleration: 8,
    rotationSpeed: 1.5,
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 100000,
    thirdPersonDistance: 15,
    thirdPersonHeight: 5,
  },
  universe: {
    starCount: 50000,
    universeRadius: 50000,
    planetCount: 9,
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
