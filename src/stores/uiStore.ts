import { create } from 'zustand'
import type { Notification } from '@/types/game'

interface UIStore {
  showHUD: boolean
  showPause: boolean
  showMissions: boolean
  showHangar: boolean
  activePanel: string | null
  notifications: Notification[]
  addNotification: (message: string, kind?: Notification['kind']) => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  showHUD: true,
  showPause: false,
  showMissions: false,
  showHangar: false,
  activePanel: null,
  notifications: [],
  addNotification: (message, kind = 'info') => {
    const notification: Notification = { id: `${Date.now()}-${Math.random()}`, message, kind }
    set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 4) }))
  },
  removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),
}))
