import { useCallback, useEffect, useMemo, useState } from 'react'

import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import DisplayPicker from '../components/DisplayPicker'

import BrandLogo from '../components/BrandLogo'

import LanguageSelect from '../components/LanguageSelect'

import LegalAcceptanceModal from '../components/LegalAcceptanceModal'

import ShareSessionCard from '../components/ShareSessionCard'

import {

  GENERAL_INTERVIEW_CATEGORIES,

  INTERVIEW_LANGUAGES,

  LEGAL_VERSION,

  isNonCodingLanguage,

  resolveInterviewCategory

} from '../../../../shared/types'

import type { DeviceActivationResult } from '../../../../shared/deviceRegistration'

import { getPlan } from '../../../../shared/subscriptionPlans'

import {
  FREE_SESSION_LIMIT_MS,
  defaultProgrammingLanguage,
  getEntitlements,
  getProgrammingLanguageOptions
} from '../../../../shared/subscriptionEntitlements'



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

  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('')

  const [starting, setStarting] = useState(false)

  const [error, setError] = useState('')

  const [legalAccepted, setLegalAccepted] = useState(true)

  const [planStatus, setPlanStatus] = useState<DeviceActivationResult | null>(null)

  const [planLoading, setPlanLoading] = useState(true)

  const [profileEmail, setProfileEmail] = useState('')

  const [lastRoundCount, setLastRoundCount] = useState(0)



  const refreshPlanStatus = useCallback(async (): Promise<void> => {

    setPlanLoading(true)

    try {

      const [settings, status] = await Promise.all([

        window.api.settings.get(),

        window.api.subscription.getStatus()

      ])

      setProfileEmail(settings.profile.email.trim())

      setPlanStatus(status)

    } catch {

      setPlanStatus(null)

    } finally {

      setPlanLoading(false)

    }

  }, [])



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

      setProfileEmail(settings.profile.email.trim())

    })

    void refreshDisplays()

    void refreshPlanStatus()

    void window.api.session.lastRoundCount().then((count) => {
      if (count > 0) setLastRoundCount(count)
    })

    const handleFocus = (): void => {

      void refreshDisplays()

      void refreshPlanStatus()

    }

    window.addEventListener('focus', handleFocus)

    return () => window.removeEventListener('focus', handleFocus)

  }, [refreshDisplays, refreshPlanStatus])



  const activePlanName = planLoading

    ? t('homePlanLoading')

    : getPlan(planStatus?.planId ?? 'free')?.name ?? planStatus?.planNames[0] ?? t('homePlanFreeName')

  const isPaidPlan = planStatus?.access === 'paid'

  const freeSessionMinutes = Math.round(FREE_SESSION_LIMIT_MS / 60_000)
  const freeTrialRemainingMinutes =
    planStatus?.freeTrial?.remainingMs != null
      ? Math.max(0, Math.ceil(planStatus.freeTrial.remainingMs / 60_000))
      : freeSessionMinutes

  const planId = planStatus?.planId ?? 'free'

  const entitlements = getEntitlements(planId)

  const programmingOptions = useMemo(() => getProgrammingLanguageOptions(planId), [planId])



  useEffect(() => {

    if (!entitlements.generalNoCodeInterviews && isNonCodingLanguage(programmingLanguage)) {

      setProgrammingLanguage(defaultProgrammingLanguage(planId))

    }

  }, [entitlements.generalNoCodeInterviews, planId, programmingLanguage])



  useEffect(() => {

    if (!entitlements.jdResumeContext && jobDescriptionUrl) {

      setJobDescriptionUrl('')

    }

  }, [entitlements.jdResumeContext, jobDescriptionUrl])



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



      const trimmedJobUrl = jobDescriptionUrl.trim()



      await window.api.session.start({

        programmingLanguage: languageLabel,

        interviewLanguage,

        interviewCategory: resolveInterviewCategory(programmingLanguage, generalCategory),

        generalCategory: isNonCodingLanguage(programmingLanguage) ? generalCategory : undefined,

        captureSource: 'entire-screen',

        displayId,

        interviewMode: 'manual',

        jobDescriptionUrl: trimmedJobUrl || undefined

      })

    } catch (startError) {

      const message =

        startError instanceof Error ? startError.message : t('jobDescriptionFetchFailed')

      setError(message)

    } finally {

      setStarting(false)

    }

  }



  const hasMultipleDisplays = displays.length > 1



  return (

    <div className="page home-page">

      <div className="home-bg" aria-hidden="true" />

      {lastRoundCount > 0 && (
        <ShareSessionCard
          roundCount={lastRoundCount}
          onDismiss={() => setLastRoundCount(0)}
        />
      )}

      <LegalAcceptanceModal open={!legalAccepted} onAccept={acceptLegal} />



      <div className="card card-wide home-card">

        <div className="home-hero">

          <div className="home-brand">

            <BrandLogo size={52} />

            <div>

              <p className="home-brand-name">{t('appName')}</p>

              <p className="home-brand-tagline">{t('appTagline')}</p>

            </div>

          </div>

          <h1>{t(getGreetingKey())}</h1>

          <p className="subtitle">{t('homeSubtitle')}</p>



          <div className={`home-plan-badge${isPaidPlan ? ' home-plan-badge-paid' : ''}`}>

            <span className="home-plan-label">{t('homeActivePlan', { plan: activePlanName })}</span>

            {!planLoading && !isPaidPlan && (
              <span className="home-plan-hint">
                {planStatus?.freeTrial?.exhausted || planStatus?.freeTrial?.remainingMs === 0
                  ? t('homePlanFreeTrialUsed')
                  : t('homePlanFreeTrialRemaining', { minutes: freeTrialRemainingMinutes })}
              </span>
            )}

            {!planLoading && !isPaidPlan && profileEmail && (
              <span className="home-plan-hint home-plan-hint-secondary">
                {t('homePlanFreeEmailLinked')}
              </span>
            )}

            {!planLoading && isPaidPlan && !planStatus?.allowed && (

              <span className="home-plan-hint home-plan-hint-warn">

                {t('subscriptionDeviceStatusBlocked', { max: planStatus.maxDevices })}

              </span>

            )}

            {!planLoading && !isPaidPlan && (

              <button

                type="button"

                className="home-plan-upgrade"

                onClick={() => void window.api.subscription.open()}

              >

                {t('homePlanUpgrade')}

              </button>

            )}

          </div>

        </div>



        <div className="home-steps">

          <div className="home-step">

            <span className="home-step-num">1</span>

            <span>{t('homeStepConfigure')}</span>

          </div>

          <div className="home-step">

            <span className="home-step-num">2</span>

            <span>{t('homeStepCapture')}</span>

          </div>

          <div className="home-step">

            <span className="home-step-num">3</span>

            <span>{t('homeStepAnswer')}</span>

          </div>

        </div>



        {hasMultipleDisplays && (

          <DisplayPicker displays={displays} value={displayId} onChange={handleDisplayChange} />

        )}



        <LanguageSelect

          label={t('programmingLanguage')}

          value={programmingLanguage}

          options={programmingOptions}

          onChange={setProgrammingLanguage}

        />



        {entitlements.generalNoCodeInterviews && isNonCodingLanguage(programmingLanguage) && (

          <LanguageSelect

            label={t('interviewCategory')}

            value={generalCategory}

            options={GENERAL_INTERVIEW_CATEGORIES}

            onChange={setGeneralCategory}

          />

        )}



        {entitlements.jdResumeContext ? (
          <div className="field">

            <label htmlFor="job-description-url">{t('jobDescriptionUrl')}</label>

            <input

              id="job-description-url"

              type="url"

              value={jobDescriptionUrl}

              placeholder="https://company.com/careers/role"

              onChange={(event) => setJobDescriptionUrl(event.target.value)}

            />

            <p className="hint">{t('jobDescriptionUrlHint')}</p>

          </div>
        ) : (
          !planLoading && (
            <p className="hint home-feature-locked">{t('homeFeatureJdResumeLocked')}</p>
          )
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

          className="btn btn-primary btn-glow"

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


