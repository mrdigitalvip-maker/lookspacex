import { create } from 'zustand'
import type { Player } from '@/types/player'

interface PlayerStore {
  profile: Player | null
  stats: { level: number; xp: number; credits: number } | null
  setProfile: (profile: Player) => void
  addXP: (amount: number) => void
  addCredits: (amount: number) => void
  levelUp: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  profile: null,
  stats: null,
  setProfile: (profile) => set({ profile, stats: { level: profile.level, xp: profile.xp, credits: profile.credits } }),
  addXP: (amount) => {
    const stats = get().stats
    if (!stats) {
      return
    }
    set({ stats: { ...stats, xp: stats.xp + amount } })
  },
  addCredits: (amount) => {
    const stats = get().stats
    if (!stats) {
      return
    }
    set({ stats: { ...stats, credits: stats.credits + amount } })
  },
  levelUp: () => {
    const stats = get().stats
    if (!stats) {
      return
    }
    set({ stats: { ...stats, level: stats.level + 1 } })
  },
}))
