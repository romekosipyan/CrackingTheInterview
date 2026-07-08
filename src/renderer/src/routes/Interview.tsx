import { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'

import BrandLogo from '../components/BrandLogo'

import HotkeyPanel from '../components/HotkeyPanel'

import InterviewSidebar from '../components/InterviewSidebar'

import QuickActionsBar from '../components/QuickActionsBar'

import SolutionPanel from '../components/SolutionPanel'

import { formatHotkey } from '../../../../shared/types'

import { useMicRecording } from '../hooks/useMicRecording'

import type { InterviewSession, ScreenshotBuffer, SolutionRound, SolveMode } from '../env.d'



export default function Interview(): JSX.Element {

  const { t } = useTranslation()

  useMicRecording()



  const scrollRef = useRef<HTMLDivElement>(null)

  const [session, setSession] = useState<InterviewSession | null>(null)

  const [rounds, setRounds] = useState<SolutionRound[]>([])

  const [activeRound, setActiveRound] = useState<number | null>(null)

  const [streamingRound, setStreamingRound] = useState<number | null>(null)

  const [screenshots, setScreenshots] = useState<ScreenshotBuffer[]>([])

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [hotkeysOpen, setHotkeysOpen] = useState(true)

  const [failedHotkeys, setFailedHotkeys] = useState<string[]>([])

  const [recording, setRecording] = useState(false)

  const [transcript, setTranscript] = useState('')

  const [transcribing, setTranscribing] = useState(false)

  const [audioSource, setAudioSource] = useState<'system' | 'microphone' | 'both' | null>(null)

  const [status, setStatus] = useState<{ state: 'idle' | 'loading' | 'error'; message?: string }>({

    state: 'idle'

  })



  useEffect(() => {

    document.documentElement.classList.add('interview-mode')

    document.body.classList.add('interview-mode')



    void window.api.session.get().then(setSession)

    void window.api.screenshot.queue().then(setScreenshots)



    const unsubscribers = [

      window.api.on('session:updated', (payload) => {

        setSession(payload as InterviewSession)

        setRounds([])

        setActiveRound(null)

        setStreamingRound(null)

      }),



      window.api.on('ai:stream-start', (payload) => {

        const data = payload as { mode: SolveMode; round: number }

        const entry: SolutionRound = {

          round: data.round,

          timestamp: new Date().toLocaleTimeString(),

          processType: data.mode,

          content: '',

          status: 'streaming'

        }

        setRounds((prev) => {

          const without = prev.filter((r) => r.round !== data.round)

          return [...without, entry]

        })

        setActiveRound(data.round)

        setStreamingRound(data.round)

        setStatus({ state: 'loading' })

        if (scrollRef.current) {

          scrollRef.current.scrollTop = 0

        }

      }),



      window.api.on('ai:stream-delta', (payload) => {

        const data = payload as { round: number; content: string }

        setRounds((prev) =>

          prev.map((round) =>

            round.round === data.round ? { ...round, content: data.content, status: 'streaming' } : round

          )

        )

        if (scrollRef.current) {

          scrollRef.current.scrollTop = scrollRef.current.scrollHeight

        }

      }),



      window.api.on('ai:stream-done', (payload) => {

        const data = payload as {

          round: number

          content: string

          status: 'waiting' | 'solved'

        }

        setRounds((prev) =>

          prev.map((round) =>

            round.round === data.round

              ? { ...round, content: data.content, status: data.status }

              : round

          )

        )

        setStreamingRound(null)

      }),



      window.api.on('ai:status', (payload) => {

        const data = payload as { state: 'idle' | 'loading' | 'error'; message?: string }

        setStatus(data)

      }),



      window.api.on('recording:status', (payload) => {

        const data = payload as { recording: boolean }

        setRecording(data.recording)

        if (!data.recording) setAudioSource(null)

      }),



      window.api.on('recording:source', (payload) => {

        setAudioSource((payload as { source: 'system' | 'microphone' | 'both' }).source)

      }),



      window.api.on('recording:transcript', (payload) => {

        const data = payload as { transcript: string; transcribing: boolean }

        setTranscript(data.transcript)

        setTranscribing(data.transcribing)

      }),



      window.api.on('screenshot:captured', () => {

        void window.api.screenshot.queue().then(setScreenshots)

      }),



      window.api.on('screenshot:queue-updated', (payload) => {

        setScreenshots(payload as ScreenshotBuffer[])

      }),



      window.api.on('screenshot:limit-reached', () => {

        setStatus({ state: 'error', message: t('screenshotLimit') })

      }),



      window.api.on('overlay:scroll', (payload) => {

        const { delta } = payload as { delta: number }

        scrollRef.current?.scrollBy({ top: delta, behavior: 'auto' })

      }),



      window.api.on('overlay:toggleSidebar', () => setSidebarOpen((v) => !v)),



      window.api.on('overlay:toggleHelp', () => setHotkeysOpen((v) => !v)),



      window.api.on('hotkeys:failed', (failed) => {

        setFailedHotkeys(failed as string[])

        const keys = (failed as string[]).map((key) => formatHotkey(key)).join(', ')

        setStatus({ state: 'error', message: t('hotkeyConflict', { keys }) })

      })

    ]



    return () => {

      document.documentElement.classList.remove('interview-mode')

      document.body.classList.remove('interview-mode')

      unsubscribers.forEach((unsub) => unsub())

    }

  }, [t])



  const activeContent =

    activeRound !== null

      ? (rounds.find((r) => r.round === activeRound) ?? null)

      : (rounds.at(-1) ?? null)



  const hasAnswer = rounds.length > 0



  return (

    <div className="overlay-root">

      <div className="overlay-shell overlay-shell-wide">

        {sidebarOpen && (

          <InterviewSidebar

            session={session}

            screenshots={screenshots}

            recording={recording}

            transcript={transcript}

            transcribing={transcribing}

            audioSource={audioSource}

          />

        )}



        <div className="overlay-panel overlay-panel-main">

          <div className="overlay-header">

            <div className="overlay-header-brand">

              <BrandLogo size={36} />

              <div>

                <strong>{t('appName')}</strong>

                <div className="overlay-header-badges">

                  {session && <span className="badge">{session.programmingLanguage}</span>}

                  {session?.interviewMode === 'auto' && (

                    <span className="badge auto-mode">{t('interviewModeAutoBadge')}</span>

                  )}

                  {session?.jobDescriptionText && (

                    <span

                      className="badge jd-context"

                      title={t('jobDescriptionContextTitle', {

                        count: session.jobDescriptionText.length

                      })}

                    >

                      {t('jobDescriptionContext')}

                    </span>

                  )}

                  {recording && <span className="badge recording">{t('recording')}</span>}

                  {transcribing && <span className="badge">{t('transcribing')}</span>}

                </div>

              </div>

            </div>

            <span className="hotkey-hint">{t('exitHint')}</span>

          </div>



          <div className="overlay-scroll" ref={scrollRef} data-scroll-target="solution">

            {!hasAnswer && !transcript && (

              <div className="overlay-welcome">

                <h2>{t('overlayWelcomeTitle')}</h2>

                <p>

                  {session?.interviewMode === 'auto'

                    ? t('overlayWelcomeAutoBody')

                    : t('overlayWelcomeBody')}

                </p>

              </div>

            )}



            {transcript && (

              <div className="transcript-panel">

                <h3>{t('transcript')}</h3>

                <p>{transcript}</p>

              </div>

            )}



            {rounds.length > 1 && (

              <div className="round-tabs">

                {rounds.map((round) => (

                  <button

                    key={round.round}

                    type="button"

                    className={`round-tab${activeRound === round.round ? ' active' : ''}`}

                    onClick={() => setActiveRound(round.round)}

                  >

                    #{round.round} {round.processType === 'deep' ? '🧠' : '⚡'}

                  </button>

                ))}

              </div>

            )}



            <SolutionPanel

              round={activeContent}

              rounds={rounds}

              activeRound={activeRound}

              isStreaming={streamingRound !== null && streamingRound === activeRound}

              onSelectRound={setActiveRound}

            />

          </div>



          <QuickActionsBar />



          <div className={`status-bar${status.state === 'error' ? ' error' : ''}`}>

            {status.state === 'loading'

              ? t('loading')

              : status.message ?? t('hotkeysOnlyHint')}

          </div>

        </div>



        <HotkeyPanel visible={hotkeysOpen} failedHotkeys={failedHotkeys} />

      </div>

    </div>

  )

}


