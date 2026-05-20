import { useTranslation } from 'react-i18next'
import type { SolutionRound } from '../env.d'

type Props = {
  round: SolutionRound | null
  rounds: SolutionRound[]
  activeRound: number | null
  isStreaming: boolean
  onSelectRound: (round: number) => void
}

function renderMarkdownSection(content: string): JSX.Element[] {
  const sections = content.split(/(?=^## )/m).filter(Boolean)

  return sections.map((section, index) => {
    const match = section.match(/^## ([^\n]+)\n?([\s\S]*)$/)
    if (!match) {
      return (
        <pre key={index} className="md-body">
          {section}
        </pre>
      )
    }

    const [, title, body] = match
    const codeMatch = body.match(/```[\w/-]*\n([\s\S]*?)```/)
    const textBeforeCode = codeMatch ? body.slice(0, body.indexOf('```')).trim() : body.trim()
    const code = codeMatch?.[1]?.trim()

    return (
      <div key={index} className="section">
        <h3>{title}</h3>
        {textBeforeCode && <pre className="md-body">{textBeforeCode}</pre>}
        {code && (
          <div className="code-block">
            <pre>{code}</pre>
          </div>
        )}
      </div>
    )
  })
}

export default function SolutionPanel({
  round,
  rounds,
  activeRound,
  isStreaming,
  onSelectRound
}: Props): JSX.Element {
  const { t } = useTranslation()

  if (!round && rounds.length === 0) {
    return (
      <div className="overlay-content">
        <p>{t('noResult')}</p>
      </div>
    )
  }

  if (!round) {
    return (
      <div className="overlay-content">
        <p>{t('noResult')}</p>
      </div>
    )
  }

  return (
    <div className="overlay-content">
      <div className="round-meta">
        <span className="badge">
          {round.processType === 'deep' ? `🔧 ${t('deepSolve')}` : `✨ ${t('fastSolve')}`}
        </span>
        <span className="round-time">
          #{round.round} · {round.timestamp}
        </span>
      </div>

      {round.status === 'waiting' && (
        <div className="section">
          <span className="badge input-required">{t('inputRequired')}</span>
        </div>
      )}

      {round.content ? (
        <>
          {renderMarkdownSection(round.content)}
          {isStreaming && <span className="stream-cursor">▍</span>}
        </>
      ) : isStreaming ? (
        <p className="stream-placeholder">{t('loading')}</p>
      ) : null}

      {rounds.length > 1 && (
        <div className="section history-section">
          <h3>{t('history')}</h3>
          {rounds.map((item) => (
            <button
              key={item.round}
              type="button"
              className={`history-item${activeRound === item.round ? ' active' : ''}`}
              onClick={() => onSelectRound(item.round)}
            >
              <span>
                {item.processType === 'deep' ? '🔧' : '✨'} #{item.round}
              </span>
              <span>{item.timestamp}</span>
              <span className="history-summary">
                {(item.content || t('loading')).slice(0, 60)}…
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
