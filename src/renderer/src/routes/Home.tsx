import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DisplayPicker from '../components/DisplayPicker'
import LanguageSelect, {
  INTERVIEW_LANGUAGES,
  PROGRAMMING_LANGUAGES
} from '../components/LanguageSelect'

export default function Home(): JSX.Element {
  const { t } = useTranslation()
  const [programmingLanguage, setProgrammingLanguage] = useState('Python')
  const [interviewLanguage, setInterviewLanguage] = useState('English')
  const [displayId, setDisplayId] = useState('')
  const [displays, setDisplays] = useState<Array<{ id: string; label: string; primary: boolean }>>(
    []
  )
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    document.body.classList.remove('interview-mode')
    void window.api.settings.get().then((settings) => {
      setProgrammingLanguage(settings.defaultProgrammingLanguage)
    })
    void window.api.displays.list().then((list) => {
      setDisplays(list)
      const primary = list.find((d) => d.primary) ?? list[0]
      if (primary) setDisplayId(primary.id)
    })
  }, [])

  const startInterview = async (): Promise<void> => {
    if (!displayId) return
    setStarting(true)
    try {
      await window.api.session.start({
        programmingLanguage,
        interviewLanguage,
        captureSource: 'entire-screen',
        displayId
      })
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>{t('homeTitle')}</h1>
        <p className="subtitle">{t('appName')}</p>

        <LanguageSelect
          label={t('programmingLanguage')}
          value={programmingLanguage}
          options={PROGRAMMING_LANGUAGES}
          onChange={setProgrammingLanguage}
        />

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

        <button
          type="button"
          className="btn btn-primary"
          disabled={!displayId || starting}
          onClick={() => void startInterview()}
        >
          {starting ? t('loading') : t('startInterview')}
        </button>

        <div className="footer-links">
          <Link to="/settings">{t('settings')}</Link>
        </div>
      </div>
    </div>
  )
}
