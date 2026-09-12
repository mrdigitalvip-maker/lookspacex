import { create } from 'zustand'

export type DockingState = 'away' | 'approach' | 'docking' | 'docked'

interface StarBaseState {
  dockingState: DockingState
  servicesOpen: boolean
  setDockingState: (dockingState: DockingState) => void
  setServicesOpen: (servicesOpen: boolean) => void
  toggleServices: () => void
  resetDeparture: () => void
}

export const useStarBaseStore = create<StarBaseState>((set, get) => ({
  dockingState: 'away',
  servicesOpen: false,
  setDockingState: (dockingState) => set({ dockingState }),
  setServicesOpen: (servicesOpen) => set({ servicesOpen }),
  toggleServices: () => set({ servicesOpen: !get().servicesOpen }),
  resetDeparture: () => set({ dockingState: 'away', servicesOpen: false }),
}))
