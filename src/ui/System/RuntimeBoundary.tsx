import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
  recovering: boolean
}

async function clearRuntimeCaches() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))
  }

  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key.startsWith('lookspace-')).map((key) => caches.delete(key)))
  }
}

export class RuntimeBoundary extends Component<Props, State> {
  state: State = { error: null, recovering: false }

  static getDerivedStateFromError(error: Error): State {
    return { error, recovering: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[LookSpace runtime]', error, info)

    if (sessionStorage.getItem('lookspace-auto-recovered') === '1') return
    sessionStorage.setItem('lookspace-auto-recovered', '1')
    this.recover(true)
  }

  recover = async (automatic = false) => {
    this.setState({ recovering: true })
    try {
      await clearRuntimeCaches()
    } catch (error) {
      console.warn('[LookSpace recovery]', error)
    }

    const url = new URL(window.location.href)
    url.searchParams.set('fresh', Date.now().toString())
    if (!automatic) sessionStorage.removeItem('lookspace-auto-recovered')
    window.location.replace(url.toString())
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          color: '#f7fbff',
          background: 'radial-gradient(circle at 50% 40%, #083247 0%, #01030a 58%)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <section style={{ width: 'min(620px, 100%)', textAlign: 'center' }}>
          <p style={{ color: '#6ee7ff', letterSpacing: '.24em', fontSize: 11 }}>LOOKSPACE // RECOVERY CORE</p>
          <h1 style={{ fontWeight: 420, letterSpacing: '.04em' }}>Flight systems interrupted.</h1>
          <p style={{ color: '#91a2b8', lineHeight: 1.7 }}>
            LookSpace detected a runtime fault and protected the session. Recovery clears stale web-game files and reloads the current build.
          </p>
          <button
            type="button"
            onClick={() => this.recover(false)}
            disabled={this.state.recovering}
            style={{
              marginTop: 18,
              minHeight: 52,
              padding: '0 24px',
              border: 0,
              borderRadius: 14,
              color: '#031018',
              background: 'linear-gradient(105deg, #a6f3ff, #43d7ef)',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {this.state.recovering ? 'Recovering…' : 'Recover LookSpace'}
          </button>
          <pre style={{ marginTop: 20, color: '#6f8298', whiteSpace: 'pre-wrap', fontSize: 10 }}>
            {this.state.error.message}
          </pre>
        </section>
      </main>
    )
  }
}
