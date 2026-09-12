import { create } from 'zustand'

export type MissionStatus = 'active' | 'completed'

interface MissionState {
  id: string
  title: string
  objective: string
  targetName: string
  target: [number, number, number]
  arrivalRadius: number
  distance: number
  status: MissionStatus
  setDistance: (distance: number) => void
  completeMission: () => void
}

export const useMissionStore = create<MissionState>((set) => ({
  id: 'M001',
  title: 'First Signal',
  objective: 'Reach navigation beacon NAV-01',
  targetName: 'NAV-01',
  target: [0, 4, -155],
  arrivalRadius: 16,
  distance: 180,
  status: 'active',
  setDistance: (distance) => set({ distance }),
  completeMission: () => set({ status: 'completed', distance: 0 }),
}))
