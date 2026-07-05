type AudioTrack = string | null

export class AudioManager {
  private static instance: AudioManager | null = null
  private track: AudioTrack = null
  private audio: HTMLAudioElement | null = null
  private volume = 0.7
  private muted = false

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }

    return AudioManager.instance
  }

  loadTrack(track: string): HTMLAudioElement | null {
    this.track = track
    this.audio = typeof Audio !== 'undefined' ? new Audio(track) : null
    this.audio?.load()
    if (this.audio) {
      this.setVolume(this.volume)
    }
    return this.audio
  }

  play(): void {
    if (!this.audio || !this.track) {
      return
    }

    this.audio.volume = this.muted ? 0 : this.volume
    void this.audio.play().catch(() => undefined)
  }

  pause(): void {
    this.audio?.pause()
  }

  setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value))
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume
    }
  }

  mute(nextMuted = !this.muted): void {
    this.muted = nextMuted
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume
    }
  }
}
