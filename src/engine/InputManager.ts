export type InputKey = 'W' | 'A' | 'S' | 'D' | 'Q' | 'E' | 'F' | 'Shift' | 'Space' | 'Escape' | 'Tab' | 'Control'

export class InputManager {
  private pressed = new Set<InputKey>()
  private justPressed = new Set<InputKey>()
  private justReleased = new Set<InputKey>()

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const key = this.normalizeKey(event.key)
    if (!key) {
      return
    }

    if (!this.pressed.has(key)) {
      this.justPressed.add(key)
    }

    this.pressed.add(key)
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    const key = this.normalizeKey(event.key)
    if (!key) {
      return
    }

    this.pressed.delete(key)
    this.justReleased.add(key)
  }

  update() {
    this.justPressed.clear()
    this.justReleased.clear()
  }

  isPressed(key: InputKey) {
    return this.pressed.has(key)
  }

  isJustPressed(key: InputKey) {
    return this.justPressed.has(key)
  }

  isJustReleased(key: InputKey) {
    return this.justReleased.has(key)
  }

  private normalizeKey(key: string): InputKey | null {
    const lower = key.toLowerCase()

    if (['w', 'arrowup'].includes(lower)) {
      return 'W'
    }
    if (['a', 'arrowleft'].includes(lower)) {
      return 'A'
    }
    if (['s', 'arrowdown'].includes(lower)) {
      return 'S'
    }
    if (['d', 'arrowright'].includes(lower)) {
      return 'D'
    }
    if (lower === 'q') {
      return 'Q'
    }
    if (lower === 'e') {
      return 'E'
    }
    if (lower === 'f') {
      return 'F'
    }
    if (lower === 'shift') {
      return 'Shift'
    }
    if (lower === ' ') {
      return 'Space'
    }
    if (lower === 'escape') {
      return 'Escape'
    }
    if (lower === 'tab') {
      return 'Tab'
    }
    if (lower === 'control') {
      return 'Control'
    }

    return null
  }
}
