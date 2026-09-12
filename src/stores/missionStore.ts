import { create } from 'zustand'

export type MissionStatus = 'active' | 'completed'
export type MissionCompletionMode = 'arrival' | 'dock'

interface MissionDefinition {
  id: string
  title: string
  objective: string
  targetName: string
  target: [number, number, number]
  arrivalRadius: number
  completionMode: MissionCompletionMode
}

const MISSIONS: MissionDefinition[] = [
  {
    id: 'M001',
    title: 'First Signal',
    objective: 'Reach navigation beacon NAV-01',
    targetName: 'NAV-01',
    target: [0, 4, -155],
    arrivalRadius: 16,
    completionMode: 'arrival',
  },
  {
    id: 'M002',
    title: 'Beyond the Veil',
    objective: 'Align with HELIOS GATE, lock target [T], then engage warp [R]',
    targetName: 'HELIOS GATE',
    target: [0, 20, -980],
    arrivalRadius: 64,
    completionMode: 'arrival',
  },
  {
    id: 'M003',
    title: 'Home Vector',
    objective: 'Lock HELIOS OUTPOST [T], warp home [R], then request docking [G]',
    targetName: 'HELIOS OUTPOST',
    target: [0, 2, -55],
    arrivalRadius: 115,
    completionMode: 'dock',
  },
]

interface MissionState extends MissionDefinition {
  missionIndex: number
  distance: number
  status: MissionStatus
  targetLocked: boolean
  setDistance: (distance: number) => void
  setTargetLocked: (targetLocked: boolean) => void
  completeMission: () => void
  advanceMission: () => void
}

function missionState(index: number) {
  const mission = MISSIONS[index] ?? MISSIONS[MISSIONS.length - 1]
  return {
    ...mission,
    missionIndex: index,
    distance: 0,
    status: 'active' as MissionStatus,
    targetLocked: false,
  }
}

export const useMissionStore = create<MissionState>((set, get) => ({
  ...missionState(0),
  distance: 180,
  setDistance: (distance) => set({ distance }),
  setTargetLocked: (targetLocked) => set({ targetLocked }),
  completeMission: () => set({ status: 'completed', distance: 0, targetLocked: false }),
  advanceMission: () => {
    const nextIndex = get().missionIndex + 1
    if (nextIndex >= MISSIONS.length) return
    set(missionState(nextIndex))
  },
}))
