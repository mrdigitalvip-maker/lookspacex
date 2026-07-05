export type MissionCategory =
  | 'Exploração'
  | 'Pesquisa'
  | 'Resgate'
  | 'Carga'
  | 'Anomalia'
  | 'Combate'
  | 'Emergência'
  | 'Fenômeno'
  | 'Exploração Livre'
  | 'História'

export type MissionDifficulty = 'Fácil' | 'Média' | 'Difícil' | 'Épica'
export type MissionStatus = 'Disponível' | 'Aceita' | 'Concluída' | 'Bloqueada'

export interface MissionObjective {
  title: string
  description: string
}

export interface MissionReward {
  xp: number
  credits: number
}

export interface Mission {
  id: string
  name: string
  category: MissionCategory
  difficulty: MissionDifficulty
  status: MissionStatus
  description: string
  objectives: MissionObjective[]
  reward: MissionReward
}
