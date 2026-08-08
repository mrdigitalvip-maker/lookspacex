export type SceneName = 'SPLASH' | 'LOGIN' | 'LOADING' | 'STARBASE' | 'SPACE'

export class SceneManager {
  private currentScene: SceneName = 'SPLASH'
  private readonly scenes = new Map<SceneName, () => void>()

  register(name: SceneName, onEnter: () => void) {
    this.scenes.set(name, onEnter)
  }

  setScene(name: SceneName) {
    this.currentScene = name
    this.scenes.get(name)?.()
  }

  getScene() {
    return this.currentScene
  }
}
