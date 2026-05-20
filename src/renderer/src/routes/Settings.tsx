import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelect, { PROGRAMMING_LANGUAGES } from '../components/LanguageSelect'
import i18n from '../i18n'
import type { AppSettings } from '../env.d'

export default function Settings(): JSX.Element {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.body.classList.remove('interview-mode')
    void window.api.settings.get().then(setSettings)
  }, [])

  if (!settings) {
    return (
      <div className="page">
        <div className="card">{t('loading')}</div>
      </div>
    )
  }

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]): void => {
    setSettings({ ...settings, [key]: value })
  }

  const updateProfile = (key: 'name' | 'email', value: string): void => {
    setSettings({ ...settings, profile: { ...settings.profile, [key]: value } })
  }

  const save = async (): Promise<void> => {
    const saved = await window.api.settings.save(settings)
    await i18n.changeLanguage(saved.appLanguage)
    setMessage(t('saved'))
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="page">
      <div className="card" style={{ width: 'min(560px, 100%)' }}>
        <h1>{t('settings')}</h1>

        <h3 style={{ marginTop: '1.5rem' }}>{t('basicDetails')}</h3>
        <div className="field">
          <label>{t('name')}</label>
          <input value={settings.profile.name} onChange={(e) => updateProfile('name', e.target.value)} />
        </div>
        <div className="field">
          <label>{t('email')}</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => updateProfile('email', e.target.value)}
          />
        </div>

        <h3>{t('defaults')}</h3>
        <LanguageSelect
          label={t('defaultProgrammingLanguage')}
          value={settings.defaultProgrammingLanguage}
          options={PROGRAMMING_LANGUAGES}
          onChange={(value) => update('defaultProgrammingLanguage', value)}
        />
        <div className="field">
          <label>{t('appLanguage')}</label>
          <select value={settings.appLanguage} onChange={(e) => update('appLanguage', e.target.value)}>
            <option value="en">English</option>
          </select>
        </div>

        <h3>{t('subscription')}</h3>
        <button type="button" className="btn btn-secondary" onClick={() => void window.api.subscription.open()}>
          {t('manageSubscription')}
        </button>

        <h3 style={{ marginTop: '1.5rem' }}>{t('apiSettings')}</h3>
        <div className="field">
          <label>{t('apiKey')}</label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => update('apiKey', e.target.value)}
            placeholder="sk-..."
          />
        </div>
        <div className="field">
          <label>{t('fastModel')}</label>
          <input
            value={settings.fastModel}
            onChange={(e) => update('fastModel', e.target.value)}
            placeholder="gpt-4.1-mini (fastest) or gpt-4o-mini"
          />
        </div>
        <div className="field">
          <label>{t('deepModel')}</label>
          <input
            value={settings.deepModel}
            onChange={(e) => update('deepModel', e.target.value)}
            placeholder="gpt-4.1 or gpt-4o"
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={() => void save()}>
          {t('save')}
        </button>
        {message && <p style={{ color: '#86efac', marginTop: '0.75rem' }}>{message}</p>}

        <div className="footer-links">
          <Link to="/">{t('back')}</Link>
        </div>
      </div>
    </div>
  )
}
