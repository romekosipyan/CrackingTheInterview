import { useTranslation } from 'react-i18next'
import MermaidDiagram from './MermaidDiagram'
import type { SolutionRound } from '../env.d'

type Props = {
  round: SolutionRound | null
  rounds: SolutionRound[]
  activeRound: number | null
  isStreaming: boolean
  onSelectRound: (round: number) => void
}

type ParsedBlock = {
  lang: string
  code: string
  complete: boolean
}

const MERMAID_START_PATTERN =
  /^(flowchart|graph|sequenceDiagram|classDiagram|erDiagram|stateDiagram|stateDiagram-v2|C4Context|mindmap|timeline)/i

function looksLikeMermaid(code: string): boolean {
  return MERMAID_START_PATTERN.test(code.trimStart())
}

function isArchitectureSection(title: string): boolean {
  return /architecture|system design|diagram/i.test(title)
}

function parseFencedBlock(body: string, sectionTitle: string): {
  textBeforeCode: string
  block: ParsedBlock | null
} {
  const fenceIndex = body.indexOf('```')
  if (fenceIndex === -1) {
    const trimmed = body.trim()
    if (trimmed && (isArchitectureSection(sectionTitle) || looksLikeMermaid(trimmed))) {
      return {
        textBeforeCode: '',
        block: { lang: 'mermaid', code: trimmed, complete: true }
      }
    }
    return { textBeforeCode: trimmed, block: null }
  }

  const beforeFence = body.slice(0, fenceIndex).trim()
  const afterFenceStart = body.slice(fenceIndex + 3)
  const langMatch = afterFenceStart.match(/^(\w*)[\s\r\n]*/)
  const lang = (langMatch?.[1] ?? '').toLowerCase()
  const contentStart = langMatch ? langMatch[0].length : 0
  const afterOpen = afterFenceStart.slice(contentStart)
  const closeIndex = afterOpen.indexOf('```')

  if (closeIndex === -1) {
    const code = afterOpen.trimEnd()
    const resolvedLang = lang || (looksLikeMermaid(code) ? 'mermaid' : '')
    return {
      textBeforeCode: beforeFence,
      block: { lang: resolvedLang, code, complete: false }
    }
  }

  const code = afterOpen.slice(0, closeIndex).trim()
  const resolvedLang = lang || (looksLikeMermaid(code) ? 'mermaid' : '')

  return {
    textBeforeCode: beforeFence,
    block: { lang: resolvedLang, code, complete: true }
  }
}

function shouldRenderAsMermaid(block: ParsedBlock, sectionTitle: string): boolean {
  return block.lang === 'mermaid' || (isArchitectureSection(sectionTitle) && looksLikeMermaid(block.code))
}

function renderBlock(block: ParsedBlock, sectionTitle: string): JSX.Element {
  if (shouldRenderAsMermaid(block, sectionTitle)) {
    return <MermaidDiagram chart={block.code} complete={block.complete} />
  }

  return (
    <div className="code-block">
      <pre>{block.code}</pre>
    </div>
  )
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
    const { textBeforeCode, block } = parseFencedBlock(body, title)

    return (
      <div key={index} className="section">
        <h3>{title}</h3>
        {textBeforeCode && <pre className="md-body">{textBeforeCode}</pre>}
        {block && renderBlock(block, title)}
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
          {round.processType === 'deep' ? `🧠 ${t('deepSolve')}` : `⚡ ${t('fastSolve')}`}
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
                {item.processType === 'deep' ? '🧠' : '⚡'} #{item.round}
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
