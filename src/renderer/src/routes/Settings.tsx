import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelect, { PROGRAMMING_LANGUAGES } from '../components/LanguageSelect'
import ResumeUpload, { type ResumeInfo } from '../components/ResumeUpload'
import i18n from '../i18n'
import type { AppSettings } from '../env.d'
import { LEGAL_VERSION } from '../../../../shared/types'

export default function Settings(): JSX.Element {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [resume, setResume] = useState<ResumeInfo | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.body.classList.remove('interview-mode')
    void window.api.settings.get().then(setSettings)
    void window.api.resume.get().then(setResume)
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

  const exportLocalData = async (): Promise<void> => {
    const data = await window.api.privacy.exportLocalData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
      anchor.download = 'kraken-interview-local-data.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setMessage(t('privacyExportDone'))
    setTimeout(() => setMessage(''), 2000)
  }

  const clearLocalData = async (): Promise<void> => {
    if (!window.confirm(t('privacyDeleteConfirm'))) return
    const cleared = await window.api.privacy.clearLocalData()
    setSettings(cleared)
    setResume(null)
    setMessage(t('privacyDeleteDone'))
    setTimeout(() => setMessage(''), 2000)
  }

  const legalAccepted = settings.legalAcceptedVersion === LEGAL_VERSION

  return (
    <div className="page">
      <div className="card" style={{ width: 'min(560px, 100%)' }}>
        <h1>{t('settings')}</h1>

        <h3 style={{ marginTop: '1.5rem' }}>{t('basicDetails')}</h3>
        <p className="hint">{t('emailStripeNote')}</p>
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

        <h3>{t('resumeSection')}</h3>
        <ResumeUpload resume={resume} onResumeChange={setResume} />

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
        <p className="hint">{t('subscriptionStripeNote')}</p>
        <button type="button" className="btn btn-secondary" onClick={() => void window.api.subscription.open()}>
          {t('manageSubscription')}
        </button>

        <h3 style={{ marginTop: '1.5rem' }}>{t('privacyAndLegal')}</h3>
        <p className="hint">{t('privacyLocalDataNote')}</p>
        <p className="hint">
          {legalAccepted
            ? t('legalAcceptedStatus', { version: settings.legalAcceptedVersion })
            : t('legalNotAcceptedStatus')}
        </p>
        <div className="legal-actions">
          <Link to="/terms">{t('termsOfService')}</Link>
          <Link to="/privacy">{t('privacyPolicy')}</Link>
        </div>
        <div className="privacy-actions">
          <button type="button" className="btn btn-secondary" onClick={() => void exportLocalData()}>
            {t('privacyExport')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => void clearLocalData()}>
            {t('privacyDeleteLocal')}
          </button>
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
