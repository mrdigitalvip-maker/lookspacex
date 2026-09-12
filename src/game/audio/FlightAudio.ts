type BrowserWindow = Window & { webkitAudioContext?: typeof AudioContext }

class FlightAudioController {
  private context: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gain: GainNode | null = null
  private filter: BiquadFilterNode | null = null

  start() {
    if (typeof window === 'undefined') return
    const AudioContextCtor = window.AudioContext ?? (window as BrowserWindow).webkitAudioContext
    if (!AudioContextCtor) return

    if (!this.context) this.context = new AudioContextCtor()
    void this.context.resume().catch(() => undefined)
    if (this.oscillator && this.gain && this.filter) return

    this.oscillator = this.context.createOscillator()
    this.filter = this.context.createBiquadFilter()
    this.gain = this.context.createGain()

    this.oscillator.type = 'sawtooth'
    this.oscillator.frequency.value = 42
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 320
    this.filter.Q.value = 0.8
    this.gain.gain.value = 0.014

    this.oscillator.connect(this.filter)
    this.filter.connect(this.gain)
    this.gain.connect(this.context.destination)
    this.oscillator.start()
  }

  update(speedRatio: number, warping: boolean) {
    if (!this.context || !this.oscillator || !this.filter || !this.gain) return
    const ratio = Math.max(0, Math.min(1, speedRatio))
    const now = this.context.currentTime
    this.oscillator.frequency.setTargetAtTime(42 + ratio * 95 + (warping ? 165 : 0), now, 0.06)
    this.filter.frequency.setTargetAtTime(320 + ratio * 760 + (warping ? 900 : 0), now, 0.08)
    this.gain.gain.setTargetAtTime(0.014 + ratio * 0.02 + (warping ? 0.026 : 0), now, 0.08)
  }

  warpPulse() {
    if (!this.context) return
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    const now = this.context.currentTime
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(110, now)
    oscillator.frequency.exponentialRampToValueAtTime(720, now + 0.8)
    oscillator.frequency.exponentialRampToValueAtTime(170, now + 2.5)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.7)
    oscillator.connect(gain)
    gain.connect(this.context.destination)
    oscillator.start(now)
    oscillator.stop(now + 2.8)
  }
}

export const flightAudio = new FlightAudioController()
