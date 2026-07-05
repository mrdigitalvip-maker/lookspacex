export interface Player {
  id: string
  username: string
  avatar_url: string
  level: number
  xp: number
  credits: number
  current_ship: string
  unlocked_ships: string[]
  play_time: number
  missions_completed: number
  achievements: string[]
  created_at: string
}
