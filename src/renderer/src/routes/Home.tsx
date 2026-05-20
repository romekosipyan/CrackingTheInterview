import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DisplayPicker from '../components/DisplayPicker'
import LanguageSelect from '../components/LanguageSelect'
import LegalAcceptanceModal from '../components/LegalAcceptanceModal'
import {
  GENERAL_INTERVIEW_CATEGORIES,
  INTERVIEW_LANGUAGES,
  LEGAL_VERSION,
  PROGRAMMING_LANGUAGES,
  isNonCodingLanguage,
  resolveInterviewCategory
} from '../../../../shared/types'

type DisplayOption = { id: string; label: string; primary: boolean }

function getGreetingKey(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'greetingMorning'
  if (hour >= 12 && hour < 17) return 'greetingAfternoon'
  if (hour >= 17 && hour < 22) return 'greetingEvening'
  return 'greetingNight'
}

function resolveDisplayId(
  list: DisplayOption[],
  preferredDisplayId: string
): string {
  if (list.length === 0) return ''
  if (preferredDisplayId && list.some((display) => display.id === preferredDisplayId)) {
    return preferredDisplayId
  }
  const primary = list.find((display) => display.primary) ?? list[0]
  return primary.id
}

export default function Home(): JSX.Element {
  const { t } = useTranslation()
  const [programmingLanguage, setProgrammingLanguage] = useState('Python')
  const [generalCategory, setGeneralCategory] = useState<string>(GENERAL_INTERVIEW_CATEGORIES[0])
  const [interviewLanguage, setInterviewLanguage] = useState('English')
  const [displayId, setDisplayId] = useState('')
  const [displays, setDisplays] = useState<DisplayOption[]>([])
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const [legalAccepted, setLegalAccepted] = useState(true)

  const refreshDisplays = useCallback(async (): Promise<void> => {
    const [list, settings] = await Promise.all([
      window.api.displays.list(),
      window.api.settings.get()
    ])
    setDisplays(list)
    setDisplayId(resolveDisplayId(list, settings.preferredDisplayId))
  }, [])

  useEffect(() => {
    document.body.classList.remove('interview-mode')
    void window.api.settings.get().then((settings) => {
      setProgrammingLanguage(settings.defaultProgrammingLanguage)
      setLegalAccepted(settings.legalAcceptedVersion === LEGAL_VERSION)
    })
    void refreshDisplays()

    const handleFocus = (): void => {
      void refreshDisplays()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshDisplays])

  const handleDisplayChange = (id: string): void => {
    setDisplayId(id)
    void window.api.settings.save({ preferredDisplayId: id })
  }

  const acceptLegal = async (): Promise<void> => {
    await window.api.settings.save({
      legalAcceptedVersion: LEGAL_VERSION,
      legalAcceptedAt: Date.now()
    })
    setLegalAccepted(true)
    void refreshDisplays()
  }

  const startInterview = async (): Promise<void> => {
    setError('')
    if (!legalAccepted) {
      setError(t('legalMustAccept'))
      return
    }
    if (!displayId) {
      setError(t('errorNoScreen'))
      return
    }

    setStarting(true)
    try {
      const languageLabel = isNonCodingLanguage(programmingLanguage)
        ? `General/No Code — ${generalCategory}`
        : programmingLanguage

      await window.api.session.start({
        programmingLanguage: languageLabel,
        interviewLanguage,
        interviewCategory: resolveInterviewCategory(programmingLanguage, generalCategory),
        generalCategory: isNonCodingLanguage(programmingLanguage) ? generalCategory : undefined,
        captureSource: 'entire-screen',
        displayId
      })
    } finally {
      setStarting(false)
    }
  }

  const hasMultipleDisplays = displays.length > 1

  return (
    <div className="page">
      <LegalAcceptanceModal open={!legalAccepted} onAccept={acceptLegal} />

      <div className="card card-wide">
        <h1>{t(getGreetingKey())}</h1>
        <p className="subtitle">{t('homeSubtitle')}</p>

        {hasMultipleDisplays && (
          <DisplayPicker displays={displays} value={displayId} onChange={handleDisplayChange} />
        )}

        <LanguageSelect
          label={t('programmingLanguage')}
          value={programmingLanguage}
          options={PROGRAMMING_LANGUAGES}
          onChange={setProgrammingLanguage}
        />

        {isNonCodingLanguage(programmingLanguage) && (
          <LanguageSelect
            label={t('interviewCategory')}
            value={generalCategory}
            options={GENERAL_INTERVIEW_CATEGORIES}
            onChange={setGeneralCategory}
          />
        )}

        <LanguageSelect
          label={t('interviewLanguage')}
          value={interviewLanguage}
          options={INTERVIEW_LANGUAGES}
          onChange={setInterviewLanguage}
        />

        {error && <p className="field-error">{error}</p>}

        <button
          type="button"
          className="btn btn-primary"
          disabled={!displayId || starting || !legalAccepted}
          onClick={() => void startInterview()}
        >
          {starting ? t('loading') : t('startInterview')}
        </button>

        <p className="hint credits-note">{t('creditsNote')}</p>

        <div className="footer-links legal-links">
          <Link to="/settings">{t('settings')}</Link>
          <Link to="/terms">{t('termsOfService')}</Link>
          <Link to="/privacy">{t('privacyPolicy')}</Link>
        </div>
      </div>
    </div>
  )
}
