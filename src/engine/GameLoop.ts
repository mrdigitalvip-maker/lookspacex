export class GameLoop {
  private raf = 0
  private last = 0
  private running = false
  private readonly subscribers: Array<(delta: number) => void> = []

  register(update: (delta: number) => void) {
    this.subscribers.push(update)
  }

  start() {
    if (this.running) {
      return
    }

    this.running = true
    this.last = performance.now()
    const tick = (now: number) => {
      const delta = Math.min((now - this.last) / 1000, 0.033)
      this.last = now
      this.subscribers.forEach((subscriber) => subscriber(delta))
      this.raf = window.requestAnimationFrame(tick)
    }

    this.raf = window.requestAnimationFrame(tick)
  }

  stop() {
    if (!this.running) {
      return
    }

    this.running = false
    window.cancelAnimationFrame(this.raf)
  }
}
