export type ShipRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type ShipClass = 'explorer' | 'fighter' | 'cargo' | 'stealth' | 'capital'

export interface ShipStats {
  speed: number
  hyperdrive: number
  storage: number
  fuel: number
  energy: number
  shield: number
}

export interface Ship {
  id: string
  name: string
  manufacturer: string
  class: ShipClass
  rarity: ShipRarity
  level: number
  description: string
  lore: string
  price: number
  stats: ShipStats
  unlocked: boolean
  owned: boolean
  placeholder_color: string
}
