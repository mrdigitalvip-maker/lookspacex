# LookSpace

LookSpace is a browser-native cinematic space exploration game built with React, TypeScript, Three.js and React Three Fiber.

The current milestone is **v0.6 — Flight Foundation**: the repository is being consolidated around a real-time Vite game runtime, without Unreal Engine.

## Current stack

- React 18
- TypeScript
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- Zustand
- Framer Motion
- Supabase client layer
- Howler audio layer
- GitHub Actions CI

## Playable flight slice

The current branch introduces the first real playable space loop:

- cinematic splash and pilot entry flow
- procedural Aurora Scout player ship
- third-person chase camera
- forward/reverse thrust
- yaw, pitch and roll controls
- boost mode
- live ship telemetry in the HUD
- animated eight-planet solar system
- Saturn rings and orbital guides
- 50,000-star field
- ACES filmic tone mapping
- production build validation

### Controls

| Input | Action |
| --- | --- |
| `W` or `Space` | Thrust |
| `S` | Reverse / brake |
| `A` / `D` | Yaw |
| `Arrow Up` / `Arrow Down` | Pitch |
| `Q` / `E` | Roll |
| `Shift` | Boost |

## Development

```bash
npm ci
npm run dev
```

Production validation:

```bash
npm run type-check
npm run build
```

## Active architecture

```text
src/
├── App.tsx
├── main.tsx
├── config/
├── game/
│   ├── ship/
│   │   └── PilotShip.tsx
│   └── world/
│       ├── SolarSystem.tsx
│       ├── SpaceScene.tsx
│       └── StarField.tsx
├── stores/
├── ui/
│   └── HUD/
└── styles/
```

Some older Next.js-era files are still present in the repository as legacy material, but they are not part of the active Vite application graph. They will be migrated or removed deliberately as the game systems replace them.

## Direction

The goal is a high-end space experience built directly on the web-native Three.js ecosystem: responsive flight, convincing scale, strong visual identity, cockpit and ship interiors, exploration, missions, progression, audio, save systems and increasingly realistic celestial environments.

The priority is always a stable playable foundation before expanding the universe.
