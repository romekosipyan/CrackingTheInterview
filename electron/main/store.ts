import Store from 'electron-store'
import { DEFAULT_SETTINGS, type AppSettings } from '../../shared/types'

const store = new Store<{ settings: AppSettings }>({
  defaults: {
    settings: DEFAULT_SETTINGS
  }
})

export function getSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...store.get('settings') }
}

export function saveSettings(partial: Partial<AppSettings>): AppSettings {
  const next = { ...getSettings(), ...partial }
  store.set('settings', next)
  return next
}
