import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import HotkeyPanel from '../components/HotkeyPanel'

import InterviewSidebar from '../components/InterviewSidebar'

import SolutionPanel from '../components/SolutionPanel'

import { useMicRecording } from '../hooks/useMicRecording'

import type { InterviewSession, ScreenshotBuffer, SolveResponse } from '../env.d'



export default function Interview(): JSX.Element {

  const { t } = useTranslation()

  useMicRecording()



  const [session, setSession] = useState<InterviewSession | null>(null)

  const [result, setResult] = useState<SolveResponse | null>(null)

  const [screenshot, setScreenshot] = useState<ScreenshotBuffer | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [hotkeysOpen, setHotkeysOpen] = useState(true)

  const [recording, setRecording] = useState(false)

  const [transcript, setTranscript] = useState('')

  const [transcribing, setTranscribing] = useState(false)
  const [audioSource, setAudioSource] = useState<'system' | 'microphone' | null>(null)
  const [status, setStatus] = useState<{ state: 'idle' | 'loading' | 'error'; message?: string }>({

    state: 'idle'

  })



  useEffect(() => {

    document.documentElement.classList.add('interview-mode')

    document.body.classList.add('interview-mode')



    void window.api.session.get().then(setSession)



    const unsubscribers = [

      window.api.on('session:updated', (payload) => {

        setSession(payload as InterviewSession)

        setResult(null)

      }),

      window.api.on('ai:result', (payload) => setResult(payload as SolveResponse)),

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
        setAudioSource((payload as { source: 'system' | 'microphone' }).source)
      }),

      window.api.on('recording:transcript', (payload) => {

        const data = payload as { transcript: string; transcribing: boolean }

        setTranscript(data.transcript)

        setTranscribing(data.transcribing)

      }),

      window.api.on('screenshot:captured', (payload) => {

        setScreenshot(payload as ScreenshotBuffer)

      }),

      window.api.on('overlay:toggleSidebar', () => setSidebarOpen((v) => !v)),

      window.api.on('overlay:toggleHelp', () => setHotkeysOpen((v) => !v)),

      window.api.on('hotkeys:failed', (failed) => {

        const keys = (failed as string[]).join(', ')

        setStatus({ state: 'error', message: `Failed to register hotkeys: ${keys}` })

      })

    ]



    return () => {

      document.documentElement.classList.remove('interview-mode')

      document.body.classList.remove('interview-mode')

      unsubscribers.forEach((unsub) => unsub())

    }

  }, [])



  return (

    <div className="overlay-root">

      <div className="overlay-shell overlay-shell-wide">

        {sidebarOpen && (

          <InterviewSidebar

            session={session}

            screenshot={screenshot}

            recording={recording}

            transcript={transcript}
            transcribing={transcribing}
            audioSource={audioSource}
          />

        )}



        <div className="overlay-panel overlay-panel-main">

          <div className="overlay-header">

            <div>

              <strong>{t('appName')}</strong>

              {session && (

                <span className="badge" style={{ marginLeft: '0.5rem' }}>

                  {session.programmingLanguage}

                </span>

              )}

              {recording && (

                <span className="badge recording" style={{ marginLeft: '0.5rem' }}>

                  {t('recording')}

                </span>

              )}

              {transcribing && (

                <span className="badge" style={{ marginLeft: '0.5rem' }}>

                  {t('transcribing')}

                </span>

              )}

            </div>

            <span className="hotkey-hint">Alt+Esc {t('endInterview')}</span>

          </div>



          <div className="overlay-scroll" data-scroll-target="solution">

            {transcript && (

              <div className="transcript-panel">

                <h3>{t('transcript')}</h3>

                <p>{transcript}</p>

              </div>

            )}

            <SolutionPanel result={result} />

          </div>



          <div className={`status-bar${status.state === 'error' ? ' error' : ''}`}>

            {status.state === 'loading'

              ? t('loading')

              : status.message ?? 'Hotkeys only — mouse passes through'}

          </div>

        </div>



        <HotkeyPanel visible={hotkeysOpen} />

      </div>

    </div>

  )

}


