import { useTranslation } from 'react-i18next'
import type { InterviewSession, ScreenshotBuffer } from '../env.d'

type Props = {
  session: InterviewSession | null
  screenshot: ScreenshotBuffer | null
  recording: boolean
  transcript: string
  transcribing: boolean
  audioSource: 'system' | 'microphone' | null
}

export default function InterviewSidebar({
  session,
  screenshot,
  recording,
  transcript,
  transcribing,
  audioSource
}: Props): JSX.Element {
  const { t } = useTranslation()

  const sourceLabel =
    audioSource === 'system'
      ? t('systemAudio')
      : audioSource === 'microphone'
        ? t('microphoneAudio')
        : null

  return (
    <aside className="sidebar">
      <strong>{t('sidebar')}</strong>
      {session && (
        <div className="sidebar-meta">
          <div>ID: {session.sessionId.slice(0, 8)}</div>
          <div>{session.programmingLanguage}</div>
          <div>{session.interviewLanguage}</div>
          <div>{new Date(session.startedAt).toLocaleTimeString()}</div>
        </div>
      )}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        <span className={`badge${recording ? ' recording' : ''}`}>
          {recording ? t('recording') : transcribing ? t('transcribing') : 'Idle'}
        </span>
        {sourceLabel && <span className="badge">{sourceLabel}</span>}
      </div>
      <div className="sidebar-transcript">
        <div className="sidebar-section-title">{t('transcript')}</div>
        <p>{transcript || t('noTranscript')}</p>
      </div>
      {screenshot && (
        <div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.75rem' }}>{t('screenshot')}</div>
          <img src={screenshot.dataUrl} alt="Last capture" />
        </div>
      )}
    </aside>
  )
}
