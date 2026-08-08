import { Float, OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

function Planet({ name, color, position, radius, atmosphereColor }: { name: string; color: string; position: [number, number, number]; radius: number; atmosphereColor: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 1.03, 32, 32]} />
        <meshBasicMaterial color={atmosphereColor} transparent opacity={0.16} />
      </mesh>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[radius * 0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </Float>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[radius * 1.25, 0.025, 8, 64]} />
        <meshBasicMaterial color="#90cdf4" opacity={0.5} transparent />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={0.8} color={color} distance={40} />
    </group>
  )
}

export function SolarSystem() {
  const planets = useMemo(() => [
    { name: 'Mercúrio', color: '#8f8f8f', position: [0, 0, -300] as [number, number, number], radius: 4, atmosphereColor: '#d4d4d8' },
    { name: 'Vênus', color: '#fbbf24', position: [60, 10, -220] as [number, number, number], radius: 7, atmosphereColor: '#fde68a' },
    { name: 'Terra', color: '#38bdf8', position: [-120, -8, -180] as [number, number, number], radius: 8, atmosphereColor: '#93c5fd' },
    { name: 'Marte', color: '#fb923c', position: [180, -10, -260] as [number, number, number], radius: 5.5, atmosphereColor: '#fdba74' },
  ], [])

  return (
    <group>
      <ambientLight intensity={0.35} />
      {planets.map((planet) => (
        <Planet key={planet.name} {...planet} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} />
    </group>
  )
}
