import mermaid from 'mermaid'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

let mermaidInitialized = false

function ensureMermaidInitialized(): void {
  if (mermaidInitialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    fontFamily: 'Segoe UI, system-ui, sans-serif'
  })
  mermaidInitialized = true
}

type Props = {
  chart: string
  complete: boolean
}

export default function MermaidDiagram({ chart, complete }: Props): JSX.Element {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const renderId = useId().replace(/:/g, '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!complete || !chart.trim()) {
      setError('')
      if (containerRef.current) containerRef.current.innerHTML = ''
      return
    }

    ensureMermaidInitialized()
    let cancelled = false

    void mermaid
      .render(`mermaid-${renderId}`, chart.trim())
      .then(({ svg }) => {
        if (cancelled || !containerRef.current) return
        containerRef.current.innerHTML = svg
        setError('')
      })
      .catch(() => {
        if (cancelled) return
        setError(t('diagramRenderFailed'))
        if (containerRef.current) containerRef.current.innerHTML = ''
      })

    return () => {
      cancelled = true
    }
  }, [chart, complete, renderId, t])

  if (!complete) {
    return <p className="diagram-placeholder">{t('diagramLoading')}</p>
  }

  if (error) {
    return <p className="diagram-error">{error}</p>
  }

  return <div ref={containerRef} className="diagram-block" aria-label={t('architectureDiagram')} />
}
