import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

type PlanetDefinition = {
  name: string
  radius: number
  orbitRadius: number
  orbitSpeed: number
  rotationSpeed: number
  color: string
  atmosphereColor: string
  inclination: number
  phase: number
}

const PLANETS: PlanetDefinition[] = [
  { name: 'Mercury', radius: 1.3, orbitRadius: 22, orbitSpeed: 0.34, rotationSpeed: 0.16, color: '#8b8178', atmosphereColor: '#c4b8ad', inclination: 0.03, phase: 0.4 },
  { name: 'Venus', radius: 2.4, orbitRadius: 33, orbitSpeed: 0.25, rotationSpeed: -0.08, color: '#d39b55', atmosphereColor: '#ffd29b', inclination: 0.06, phase: 2.3 },
  { name: 'Earth', radius: 2.6, orbitRadius: 46, orbitSpeed: 0.2, rotationSpeed: 0.4, color: '#2676c8', atmosphereColor: '#75c9ff', inclination: 0.02, phase: 4.8 },
  { name: 'Mars', radius: 1.9, orbitRadius: 59, orbitSpeed: 0.16, rotationSpeed: 0.36, color: '#b84d2f', atmosphereColor: '#ff9a72', inclination: 0.04, phase: 1.5 },
  { name: 'Jupiter', radius: 7.2, orbitRadius: 84, orbitSpeed: 0.085, rotationSpeed: 0.58, color: '#b48a67', atmosphereColor: '#f6d1aa', inclination: 0.025, phase: 3.4 },
  { name: 'Saturn', radius: 6.2, orbitRadius: 112, orbitSpeed: 0.064, rotationSpeed: 0.5, color: '#d7bd7d', atmosphereColor: '#ffe7ad', inclination: 0.045, phase: 5.3 },
  { name: 'Uranus', radius: 4.1, orbitRadius: 140, orbitSpeed: 0.044, rotationSpeed: 0.28, color: '#6bc5d2', atmosphereColor: '#aff6ff', inclination: 0.08, phase: 0.9 },
  { name: 'Neptune', radius: 4, orbitRadius: 168, orbitSpeed: 0.034, rotationSpeed: 0.3, color: '#355fc7', atmosphereColor: '#79a7ff', inclination: 0.055, phase: 2.9 },
]

function OrbitRing({ radius, inclination }: { radius: number; inclination: number }) {
  return (
    <mesh rotation={[Math.PI / 2 + inclination, 0, 0]}>
      <ringGeometry args={[radius - 0.035, radius + 0.035, 192]} />
      <meshBasicMaterial color="#2d7b9f" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function Planet({ definition }: { definition: PlanetDefinition }) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    const planet = planetRef.current
    if (!group || !planet) {
      return
    }

    const angle = definition.phase + clock.elapsedTime * definition.orbitSpeed
    group.position.set(
      Math.cos(angle) * definition.orbitRadius,
      Math.sin(angle * 0.63) * definition.orbitRadius * definition.inclination,
      Math.sin(angle) * definition.orbitRadius,
    )
    planet.rotation.y += definition.rotationSpeed * delta
  })

  return (
    <group ref={groupRef} userData={{ name: definition.name }}>
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[definition.radius, 48, 32]} />
        <meshStandardMaterial color={definition.color} roughness={0.82} metalness={0.03} />
      </mesh>
      <mesh scale={1.045}>
        <sphereGeometry args={[definition.radius, 40, 28]} />
        <meshBasicMaterial color={definition.atmosphereColor} transparent opacity={0.11} side={THREE.BackSide} />
      </mesh>
      {definition.name === 'Saturn' ? (
        <mesh rotation={[Math.PI / 2.25, 0, 0]}>
          <ringGeometry args={[definition.radius * 1.35, definition.radius * 2.1, 96]} />
          <meshBasicMaterial color="#d9c69b" transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  )
}

export function SolarSystem() {
  return (
    <group position={[0, 0, -260]}>
      <mesh>
        <sphereGeometry args={[11, 64, 48]} />
        <meshBasicMaterial color="#fff2b0" toneMapped={false} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[11, 48, 32]} />
        <meshBasicMaterial color="#ffb347" transparent opacity={0.18} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <pointLight color="#fff0c2" intensity={1200} distance={650} decay={2} />

      {PLANETS.map((planet) => (
        <OrbitRing key={`orbit-${planet.name}`} radius={planet.orbitRadius} inclination={planet.inclination} />
      ))}
      {PLANETS.map((planet) => (
        <Planet key={planet.name} definition={planet} />
      ))}
    </group>
  )
}
