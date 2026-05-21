import { useTranslation } from 'react-i18next'
import { MAX_SCREENSHOTS } from '../../../../shared/types'
import type { InterviewSession, ScreenshotBuffer } from '../env.d'

type Props = {
  session: InterviewSession | null
  screenshots: ScreenshotBuffer[]
  recording: boolean
  transcript: string
  transcribing: boolean
  audioSource: 'system' | 'microphone' | 'both' | null
}

export default function InterviewSidebar({
  session,
  screenshots,
  recording,
  transcript,
  transcribing,
  audioSource
}: Props): JSX.Element {
  const { t } = useTranslation()

  const sourceLabel =
    audioSource === 'both'
      ? t('bothAudio')
      : audioSource === 'system'
        ? t('systemAudio')
        : audioSource === 'microphone'
          ? t('microphoneAudio')
          : null

  return (
    <aside className="sidebar">
      <strong>{t('sidebar')}</strong>
      {session && (
        <div className="sidebar-meta">
          {session.roleCompany && <div>{session.roleCompany}</div>}
          {session.roleTitle && <div>{session.roleTitle}</div>}
          <div>{session.programmingLanguage}</div>
          <div>{session.interviewLanguage}</div>
          <div>{new Date(session.startedAt).toLocaleTimeString()}</div>
        </div>
      )}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
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
        <span className={`badge${recording ? ' recording' : ''}`}>
          {recording ? t('recording') : transcribing ? t('transcribing') : 'Idle'}
        </span>
        {sourceLabel && <span className="badge">{sourceLabel}</span>}
      </div>
      <div className="sidebar-transcript">
        <div className="sidebar-section-title">{t('transcript')}</div>
        {transcript ? (
          <>
            <p className="sidebar-transcript-preview" title={transcript}>
              {transcript.length > 120 ? `…${transcript.slice(-120)}` : transcript}
            </p>
            <p className="hint sidebar-transcript-meta">
              {t('transcriptCaptured', { count: transcript.length })}
            </p>
          </>
        ) : (
          <p className="hint sidebar-transcript-hint">{t('noTranscript')}</p>
        )}
      </div>
      <div className="sidebar-screenshots">
        <div className="sidebar-section-title">
          {t('screenshots')} ({screenshots.length}/{MAX_SCREENSHOTS})
        </div>
        {screenshots.length === 0 ? (
          <p className="hint">{t('noScreenshots')}</p>
        ) : (
          <div className="screenshot-strip">
            {screenshots.map((shot, index) => (
              <div key={shot.capturedAt} className="screenshot-thumb">
                <span className="screenshot-index">{index + 1}</span>
                <img src={shot.dataUrl} alt={`Screenshot ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
