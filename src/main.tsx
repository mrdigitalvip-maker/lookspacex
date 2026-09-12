import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerLookSpaceServiceWorker } from './pwa/register'
import { RuntimeBoundary } from './ui/System/RuntimeBoundary'
import './styles/index.css'
import './styles/mission.css'
import './styles/cinematic.css'
import './styles/pwa.css'
import './styles/starbase.css'

registerLookSpaceServiceWorker()

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('LookSpace root element was not found')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RuntimeBoundary>
      <App />
    </RuntimeBoundary>
  </React.StrictMode>,
)

requestAnimationFrame(() => {
  ;(window as Window & { __LOOKSPACE_BOOTED__?: boolean }).__LOOKSPACE_BOOTED__ = true
  document.documentElement.dataset.lookspaceBooted = 'true'
})
