import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerLookSpaceServiceWorker } from './pwa/register'
import './styles/index.css'
import './styles/mission.css'
import './styles/cinematic.css'

registerLookSpaceServiceWorker()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
