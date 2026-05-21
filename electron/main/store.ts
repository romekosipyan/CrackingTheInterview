import Store from 'electron-store'
import { DEFAULT_SETTINGS, type AppSettings } from '../../shared/types'

const store = new Store<{ settings: Partial<AppSettings> }>({
  defaults: {
    settings: DEFAULT_SETTINGS
  }
})

const USER_SETTING_KEYS: Array<keyof AppSettings> = [
  'profile',
  'defaultProgrammingLanguage',
  'appLanguage',
  'subscriptionUrl',
  'legalAcceptedVersion',
  'legalAcceptedAt',
  'preferredDisplayId',
  'defaultInterviewMode'
]

function pickUserSettings(raw: Partial<AppSettings>): AppSettings {
  const next = { ...DEFAULT_SETTINGS }
  for (const key of USER_SETTING_KEYS) {
    if (raw[key] !== undefined) {
      next[key] = raw[key] as never
    }
  }
  return next
}

export function getSettings(): AppSettings {
  return pickUserSettings(store.get('settings', {}))
}

export function saveSettings(partial: Partial<AppSettings>): AppSettings {
  const next = pickUserSettings({ ...getSettings(), ...partial })
  store.set('settings', next)
  return next
}

export function clearLocalUserData(): AppSettings {
  store.clear()
  return getSettings()
}
