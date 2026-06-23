import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { setHotkeyDisplayPlatform } from '@shared/types'
import App from './App'
import i18n from './i18n'
import './styles/global.css'

async function bootstrap(): Promise<void> {
  if (window.api) {
    setHotkeyDisplayPlatform(window.api.app.platform)
    const settings = await window.api.settings.get()
    await i18n.changeLanguage(settings.appLanguage)
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  )
}

void bootstrap()
