import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DisplayPicker from '../components/DisplayPicker'
import LanguageSelect from '../components/LanguageSelect'
import RolePicker from '../components/RolePicker'
import ScreenShareInstructions from '../components/ScreenShareInstructions'
import {
  GENERAL_INTERVIEW_CATEGORIES,
  INTERVIEW_LANGUAGES,
  PROGRAMMING_LANGUAGES,
  isNonCodingLanguage,
  resolveInterviewCategory
} from '../../../../shared/types'

function getGreetingKey(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'greetingMorning'
  if (hour >= 12 && hour < 17) return 'greetingAfternoon'
  if (hour >= 17 && hour < 22) return 'greetingEvening'
  return 'greetingNight'
}

export default function Home(): JSX.Element {
  const { t } = useTranslation()
  const [programmingLanguage, setProgrammingLanguage] = useState('Python')
  const [generalCategory, setGeneralCategory] = useState<string>(GENERAL_INTERVIEW_CATEGORIES[0])
  const [interviewLanguage, setInterviewLanguage] = useState('English')
  const [displayId, setDisplayId] = useState('')
  const [roleId, setRoleId] = useState('')
  const [displays, setDisplays] = useState<Array<{ id: string; label: string; primary: boolean }>>([])
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    document.body.classList.remove('interview-mode')
    void window.api.settings.get().then((settings) => {
      setProgrammingLanguage(settings.defaultProgrammingLanguage)
      if (settings.selectedRoleId) setRoleId(settings.selectedRoleId)
    })
    void window.api.displays.list().then((list) => {
      setDisplays(list)
      const primary = list.find((d) => d.primary) ?? list[0]
      if (primary) setDisplayId(primary.id)
    })
  }, [])

  const handleStartClick = (): void => {
    setError('')
    if (!roleId) {
      setError(t('errorNoRole'))
      return
    }
    if (!displayId) {
      setError(t('errorNoScreen'))
      return
    }
    setShowInstructions(true)
  }

  const startInterview = async (): Promise<void> => {
    if (!displayId || !roleId) return
    setStarting(true)
    setError('')
    try {
      const roles = await window.api.roles.list()
      const role = roles.find((r) => r.id === roleId)
      const languageLabel = isNonCodingLanguage(programmingLanguage)
        ? `General/No Code — ${generalCategory}`
        : programmingLanguage

      await window.api.settings.save({ selectedRoleId: roleId })
      await window.api.session.start({
        programmingLanguage: languageLabel,
        interviewLanguage,
        interviewCategory: resolveInterviewCategory(programmingLanguage, generalCategory),
        generalCategory: isNonCodingLanguage(programmingLanguage) ? generalCategory : undefined,
        captureSource: 'entire-screen',
        displayId,
        roleId,
        roleCompany: role?.companyName,
        roleTitle: role?.roleTitle
      })
    } finally {
      setStarting(false)
      setShowInstructions(false)
    }
  }

  return (
    <div className="page">
      <div className="card card-wide">
        <h1>{t(getGreetingKey())}</h1>
        <p className="subtitle">{t('homeSubtitle')}</p>

        <RolePicker selectedRoleId={roleId} onSelect={setRoleId} />

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

        <DisplayPicker displays={displays} value={displayId} onChange={setDisplayId} />

        <div className="field">
          <label>{t('screenToCapture')}</label>
          <input value={t('entireScreen')} readOnly />
        </div>

        {error && <p className="field-error">{error}</p>}

        <button
          type="button"
          className="btn btn-primary"
          disabled={!displayId || !roleId || starting}
          onClick={handleStartClick}
        >
          {starting ? t('loading') : t('startInterview')}
        </button>

        <p className="hint credits-note">{t('creditsNote')}</p>

        <div className="footer-links">
          <Link to="/settings">{t('settings')}</Link>
        </div>
      </div>

      <ScreenShareInstructions
        open={showInstructions}
        onConfirm={() => void startInterview()}
        onCancel={() => setShowInstructions(false)}
      />
    </div>
  )
}
