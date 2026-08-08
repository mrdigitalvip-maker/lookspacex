export type SceneName = 'SPLASH' | 'LOGIN' | 'LOADING' | 'STARBASE' | 'SPACE'

export interface Notification {
  id: string
  message: string
  kind?: 'info' | 'success' | 'warning'
}
