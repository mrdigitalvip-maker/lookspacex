import { create } from 'zustand'
import type { Ship } from '@/types/ship'

export type ShipViewMode = 'cockpit' | 'cabin' | 'chase'

export const SHIP_CATALOG: Ship[] = [
  {
    id: 'aurora-scout',
    name: 'Aurora Scout',
    manufacturer: 'Helios Outpost',
    class: 'explorer',
    rarity: 'common',
    level: 3,
    description: 'Balanced deep-space explorer with strong warp efficiency.',
    lore: 'The first Helios frame trusted to independent pilots.',
    price: 0,
    stats: { speed: 72, hyperdrive: 84, storage: 38, fuel: 70, energy: 65, shield: 46 },
    unlocked: true,
    owned: true,
    placeholder_color: '#00D8FF',
  },
  {
    id: 'vesper-interceptor',
    name: 'Vesper Interceptor',
    manufacturer: 'Helios Tactical',
    class: 'fighter',
    rarity: 'uncommon',
    level: 6,
    description: 'Fast-response frame tuned for acceleration and shield recovery.',
    lore: 'A stripped-down patrol interceptor converted for frontier pilots.',
    price: 0,
    stats: { speed: 91, hyperdrive: 72, storage: 20, fuel: 58, energy: 82, shield: 61 },
    unlocked: true,
    owned: true,
    placeholder_color: '#8B5CF6',
  },
  {
    id: 'atlas-hauler',
    name: 'Atlas Hauler',
    manufacturer: 'Orion Freightworks',
    class: 'cargo',
    rarity: 'rare',
    level: 12,
    description: 'Heavy long-range frame with extended cargo and shield capacity.',
    lore: 'Built for sectors where a resupply station may be weeks away.',
    price: 18000,
    stats: { speed: 48, hyperdrive: 77, storage: 96, fuel: 92, energy: 72, shield: 88 },
    unlocked: false,
    owned: false,
    placeholder_color: '#F59E0B',
  },
]

interface ShipStore {
  currentShip: Ship | null
  position: [number, number, number]
  velocity: number
  fuel: number
  shield: number
  energy: number
  isWarping: boolean
  viewMode: ShipViewMode
  setPosition: (position: [number, number, number]) => void
  setVelocity: (velocity: number) => void
  consumeFuel: (amount: number) => void
  consumeEnergy: (amount: number) => void
  damageShield: (amount: number) => void
  regenShield: () => void
  refuel: () => void
  repairShield: () => void
  rechargeEnergy: () => void
  serviceAll: () => void
  setWarping: (isWarping: boolean) => void
  setViewMode: (viewMode: ShipViewMode) => void
  toggleViewMode: () => void
  setCurrentShip: (ship: Ship) => void
}

export const useShipStore = create<ShipStore>((set) => ({
  currentShip: SHIP_CATALOG[0],
  position: [0, 0, 42],
  velocity: 0,
  fuel: 100,
  shield: 100,
  energy: 100,
  isWarping: false,
  viewMode: 'chase',
  setPosition: (position) => set({ position }),
  setVelocity: (velocity) => set({ velocity }),
  consumeFuel: (amount) => set((state) => ({ fuel: Math.max(0, state.fuel - amount) })),
  consumeEnergy: (amount) => set((state) => ({ energy: Math.max(0, state.energy - amount) })),
  damageShield: (amount) => set((state) => ({ shield: Math.max(0, state.shield - amount) })),
  regenShield: () => set((state) => ({ shield: Math.min(100, state.shield + 1) })),
  refuel: () => set({ fuel: 100 }),
  repairShield: () => set({ shield: 100 }),
  rechargeEnergy: () => set({ energy: 100 }),
  serviceAll: () => set({ fuel: 100, shield: 100, energy: 100 }),
  setWarping: (isWarping) => set({ isWarping }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === 'cockpit' ? 'cabin' : state.viewMode === 'cabin' ? 'chase' : 'cockpit',
    })),
  setCurrentShip: (currentShip) => set({ currentShip, fuel: 100, shield: 100, energy: 100 }),
}))
