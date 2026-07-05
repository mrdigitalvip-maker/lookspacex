export interface SolarSystemPlanet {
  id: string
  name: string
  color: string
  radius_visual: number
  velocity_orbita: number
  distance_sol: number
  description: string
  nivel_recomendado: number
  status: 'Disponível' | 'Bloqueado' | 'Em Exploração'
}

export const solarSystemPlanets: SolarSystemPlanet[] = [
  {
    id: 'mercury',
    name: 'Mercúrio',
    color: '#8c8c8c',
    radius_visual: 10,
    velocity_orbita: 0.8,
    distance_sol: 0.39,
    description: 'Planeta rochoso com temperaturas extremas e órbita rápida.',
    nivel_recomendado: 1,
    status: 'Disponível',
  },
  {
    id: 'venus',
    name: 'Vênus',
    color: '#f59e0b',
    radius_visual: 14,
    velocity_orbita: 0.66,
    distance_sol: 0.72,
    description: 'Um mundo coberto por nuvens espessas e atmosfera tóxica.',
    nivel_recomendado: 2,
    status: 'Disponível',
  },
  {
    id: 'earth',
    name: 'Terra',
    color: '#2563eb',
    radius_visual: 16,
    velocity_orbita: 0.55,
    distance_sol: 1,
    description: 'Lar da humanidade, com clima estável e grandes oportunidades.',
    nivel_recomendado: 3,
    status: 'Em Exploração',
  },
  {
    id: 'mars',
    name: 'Marte',
    color: '#dc2626',
    radius_visual: 12,
    velocity_orbita: 0.46,
    distance_sol: 1.52,
    description: 'Planeta vermelho com vastas regiões de interesse científico.',
    nivel_recomendado: 4,
    status: 'Disponível',
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    color: '#f97316',
    radius_visual: 24,
    velocity_orbita: 0.3,
    distance_sol: 5.2,
    description: 'Gigante gasoso repleto de tempestades e luas promissoras.',
    nivel_recomendado: 6,
    status: 'Bloqueado',
  },
  {
    id: 'saturn',
    name: 'Saturno',
    color: '#d4af37',
    radius_visual: 20,
    velocity_orbita: 0.24,
    distance_sol: 9.58,
    description: 'Planeta com anéis espetaculares e recursos abundantes.',
    nivel_recomendado: 7,
    status: 'Disponível',
  },
  {
    id: 'uranus',
    name: 'Urano',
    color: '#38bdf8',
    radius_visual: 17,
    velocity_orbita: 0.18,
    distance_sol: 19.2,
    description: 'Mundo gelado com rotação inclinada e grande potencial científico.',
    nivel_recomendado: 8,
    status: 'Bloqueado',
  },
  {
    id: 'neptune',
    name: 'Netuno',
    color: '#0f766e',
    radius_visual: 17,
    velocity_orbita: 0.14,
    distance_sol: 30.1,
    description: 'Planeta azul profundo com ventos extremos e segredos profundos.',
    nivel_recomendado: 9,
    status: 'Bloqueado',
  },
  {
    id: 'pluto',
    name: 'Plutão',
    color: '#94a3b8',
    radius_visual: 8,
    velocity_orbita: 0.11,
    distance_sol: 39.5,
    description: 'Corpo celeste remoto e misterioso na borda do sistema.',
    nivel_recomendado: 10,
    status: 'Bloqueado',
  },
]
