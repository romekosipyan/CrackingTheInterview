import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSelect, { PROGRAMMING_LANGUAGES } from '../components/LanguageSelect'
import ResumeUpload, { type ResumeInfo } from '../components/ResumeUpload'
import i18n from '../i18n'
import type { AppSettings } from '../env.d'
import type { AppUpdateCheckResult } from '../../../../shared/appVersion'
import { compareSemver } from '../../../../shared/appVersion'
import { LEGAL_VERSION } from '../../../../shared/types'
import type { DeviceActivationResult } from '../../../../shared/deviceRegistration'
import {
  getEntitlements,
  getProgrammingLanguageOptions,
  defaultProgrammingLanguage
} from '../../../../shared/subscriptionEntitlements'
import { useShellMode } from '../hooks/useShellMode'

export default function Settings(): JSX.Element {
  const { t } = useTranslation()
  useShellMode()
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [resume, setResume] = useState<ResumeInfo | null>(null)
  const [message, setMessage] = useState('')
  const [deviceStatus, setDeviceStatus] = useState<DeviceActivationResult | null>(null)
  const [deviceError, setDeviceError] = useState('')
  const [verifyingDevice, setVerifyingDevice] = useState(false)
  const [planStatus, setPlanStatus] = useState<DeviceActivationResult | null>(null)
  const [appVersion, setAppVersion] = useState('')
  const [updateStatus, setUpdateStatus] = useState<
    'idle' | 'checking' | 'up-to-date' | 'available' | 'downloading' | 'ready' | 'error'
  >('idle')
  const [latestVersion, setLatestVersion] = useState('')
  const [publishedVersion, setPublishedVersion] = useState('')
  const [updateDownloadUrl, setUpdateDownloadUrl] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState('')

  useEffect(() => {
    void window.api.settings.get().then(setSettings)
    void window.api.resume.get().then(setResume)
    void window.api.subscription.getStatus().then(setPlanStatus).catch(() => setPlanStatus(null))
    void window.api.app.getVersion().then(setAppVersion)
  }, [])

  if (!settings) {
    return (
      <div className="page shell-page">
        <div className="card shell-card">{t('loading')}</div>
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
    if (saved.profile.email.trim()) {
      void verifyDevice(saved.profile.email)
    } else {
      setDeviceStatus(null)
      setDeviceError('')
    }
  }

  const verifyDevice = async (email = settings?.profile.email ?? ''): Promise<void> => {
    if (!email.trim()) {
      setDeviceStatus(null)
      setDeviceError('')
      return
    }
    setVerifyingDevice(true)
    setDeviceError('')
    try {
      const status = await window.api.subscription.activate()
      setDeviceStatus(status)
    } catch (error) {
      setDeviceStatus(null)
      setDeviceError(error instanceof Error ? error.message : 'Device verification failed.')
    } finally {
      setVerifyingDevice(false)
    }
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

  const applyUpdateCheckResult = (result: AppUpdateCheckResult): void => {
    setPublishedVersion(result.latestVersion)
    setLatestVersion(result.latestVersion)
    if (result.status === 'up-to-date') {
      setUpdateStatus('up-to-date')
      setUpdateDownloadUrl(null)
      setUpdateError('')
      return
    }
    if (result.status === 'update-available') {
      setUpdateStatus('available')
      setUpdateDownloadUrl(result.downloadUrl)
      setUpdateError('')
      return
    }
    setUpdateStatus('error')
    setUpdateDownloadUrl(null)
    setUpdateError(result.message)
  }

  const checkForUpdates = async (): Promise<void> => {
    setUpdateStatus('checking')
    setUpdateError('')
    try {
      const result = await window.api.app.checkForUpdates()
      applyUpdateCheckResult(result)
    } catch (error) {
      setUpdateStatus('error')
      setUpdateError(error instanceof Error ? error.message : t('appUpdateError'))
    }
  }

  const downloadUpdate = async (): Promise<void> => {
    if (!updateDownloadUrl) return
    setUpdateStatus('downloading')
    setUpdateError('')
    try {
      const result = await window.api.app.downloadUpdate(updateDownloadUrl)
      if (!result.ok) {
        setUpdateStatus('error')
        setUpdateError(result.error)
        return
      }
      setLatestVersion(result.latestVersion)
      setUpdateStatus('ready')
    } catch (error) {
      setUpdateStatus('error')
      setUpdateError(error instanceof Error ? error.message : t('appUpdateError'))
    }
  }

  const installUpdate = async (): Promise<void> => {
    setUpdateError('')
    try {
      const result = await window.api.app.installUpdate()
      if (!result.ok) {
        setUpdateStatus('error')
        setUpdateError(result.error)
      }
    } catch (error) {
      setUpdateStatus('error')
      setUpdateError(error instanceof Error ? error.message : t('appUpdateError'))
    }
  }

  const legalAccepted = settings.legalAcceptedVersion === LEGAL_VERSION
  const planId = planStatus?.planId ?? 'free'
  const entitlements = getEntitlements(planId)
  const programmingOptions = getProgrammingLanguageOptions(planId)
  const defaultLanguage = programmingOptions.includes(settings.defaultProgrammingLanguage)
    ? settings.defaultProgrammingLanguage
    : defaultProgrammingLanguage(planId)

  const isAheadOfPublished =
    updateStatus === 'up-to-date' &&
    appVersion &&
    publishedVersion &&
    compareSemver(appVersion, publishedVersion) > 0

  return (
    <div className="page shell-page">
      <div className="card shell-card shell-card--scroll">
        <div className="settings-shell-header window-drag">
          <Link to="/" className="settings-back-btn no-drag">
            ← {t('back')}
          </Link>
          <h1 className="no-drag">{t('settings')}</h1>
          <span className="no-drag" style={{ width: 48 }} aria-hidden="true" />
        </div>

        <div className="no-drag">
        <h3 style={{ marginTop: 0 }}>{t('basicDetails')}</h3>
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

        <h3>{entitlements.jdResumeContext ? t('resumeSection') : t('resumeSectionLocked')}</h3>
        {entitlements.jdResumeContext ? (
          <ResumeUpload resume={resume} onResumeChange={setResume} />
        ) : (
          <p className="hint">{t('homeFeatureJdResumeLocked')}</p>
        )}

        <h3>{t('defaults')}</h3>
        <LanguageSelect
          label={t('defaultProgrammingLanguage')}
          value={defaultLanguage}
          options={programmingOptions}
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
        {deviceStatus?.access === 'paid' && deviceStatus.allowed && (
          <p className="hint">
            {t('subscriptionDeviceStatusPaid', {
              count: deviceStatus.devices.length,
              max: deviceStatus.maxDevices
            })}
          </p>
        )}
        {deviceStatus?.access === 'paid' && !deviceStatus.allowed && (
          <p className="field-error">
            {t('subscriptionDeviceStatusBlocked', { max: deviceStatus.maxDevices })}
          </p>
        )}
        {deviceStatus?.access === 'free' && settings.profile.email.trim() && (
          <p className="hint">{t('subscriptionDeviceStatusFree')}</p>
        )}
        {!deviceStatus && settings.profile.email.trim() && (
          <p className="hint">{t('subscriptionDeviceStatusUnknown')}</p>
        )}
        {deviceError && <p className="field-error">{deviceError}</p>}
        <div className="privacy-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={verifyingDevice || !settings.profile.email.trim()}
            onClick={() => void verifyDevice()}
          >
            {verifyingDevice ? t('loading') : t('subscriptionVerifyDevice')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => void window.api.subscription.open()}>
            {t('manageSubscription')}
          </button>
        </div>

        <h3 style={{ marginTop: '1.5rem' }}>{t('appVersionSection')}</h3>
        {appVersion && <p className="hint">{t('appVersionLabel', { version: appVersion })}</p>}
        {updateStatus === 'up-to-date' && !isAheadOfPublished && publishedVersion && (
          <p className="hint">{t('appUpdateUpToDate', { version: publishedVersion })}</p>
        )}
        {isAheadOfPublished && (
          <p className="hint">
            {t('appUpdateAheadOfPublished', { current: appVersion, published: publishedVersion })}
          </p>
        )}
        {updateStatus === 'available' && latestVersion && (
          <p className="hint">{t('appUpdateAvailable', { version: latestVersion })}</p>
        )}
        {updateStatus === 'downloading' && <p className="hint">{t('appUpdateDownloading')}</p>}
        {updateStatus === 'ready' && latestVersion && (
          <p className="hint">{t('appUpdateReady', { version: latestVersion })}</p>
        )}
        {updateError && <p className="field-error">{updateError}</p>}
        <div className="privacy-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={updateStatus === 'checking' || updateStatus === 'downloading'}
            onClick={() => void checkForUpdates()}
          >
            {updateStatus === 'checking' ? t('appUpdateChecking') : t('appCheckForUpdates')}
          </button>
          {updateStatus === 'available' && (
            <button type="button" className="btn btn-secondary" onClick={() => void downloadUpdate()}>
              {t('appDownloadUpdate')}
            </button>
          )}
          {updateStatus === 'ready' && (
            <button type="button" className="btn btn-primary" onClick={() => void installUpdate()}>
              {t('appInstallUpdate')}
            </button>
          )}
        </div>

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
        </div>
      </div>
    </div>
  )
}
