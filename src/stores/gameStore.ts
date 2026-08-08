import { create } from 'zustand'
import type { SceneName } from '@/types/game'

interface GameStore {
  currentScene: SceneName
  isLoading: boolean
  isPaused: boolean
  setScene: (scene: SceneName) => void
  pause: () => void
  resume: () => void
  setLoading: (loading: boolean) => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentScene: 'SPLASH',
  isLoading: true,
  isPaused: false,
  setScene: (scene) => set({ currentScene: scene }),
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
