import { create } from 'zustand'
import type { Ship } from '@/types/ship'

interface ShipStore {
  currentShip: Ship | null
  position: [number, number, number]
  velocity: number
  fuel: number
  shield: number
  energy: number
  isWarping: boolean
  setPosition: (position: [number, number, number]) => void
  setVelocity: (velocity: number) => void
  consumeFuel: (amount: number) => void
  regenShield: () => void
  setCurrentShip: (ship: Ship) => void
}

const initialShip = {
  id: 'aurora-scout',
  name: 'Aurora Scout',
  manufacturer: 'Helios Outpost',
  class: 'explorer',
  rarity: 'common',
  level: 3,
  description: 'Nave inicial da frota.',
  lore: 'A nave inicial.',
  price: 0,
  stats: { speed: 72, hyperdrive: 84, storage: 38, fuel: 70, energy: 65, shield: 46 },
  unlocked: true,
  owned: true,
  placeholder_color: '#00FFFF',
} as Ship

export const useShipStore = create<ShipStore>((set) => ({
  currentShip: initialShip,
  position: [0, 0, 25],
  velocity: 0,
  fuel: 100,
  shield: 100,
  energy: 100,
  isWarping: false,
  setPosition: (position) => set({ position }),
  setVelocity: (velocity) => set({ velocity }),
  consumeFuel: (amount) => set((state) => ({ fuel: Math.max(0, state.fuel - amount) })),
  regenShield: () => set((state) => ({ shield: Math.min(100, state.shield + 1) })),
  setCurrentShip: (currentShip) => set({ currentShip }),
}))
