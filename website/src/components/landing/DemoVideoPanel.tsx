import { useState } from 'react'

type Props = {
  title: string
  subtitle: string
  src: string
  accent?: 'cyan' | 'violet'
}

export default function DemoVideoPanel({
  title,
  subtitle,
  src,
  accent = 'cyan'
}: Props): JSX.Element {
  const [missing, setMissing] = useState(false)

  return (
    <article className={`demo-panel demo-panel--${accent}`}>
      <header className="demo-panel-header">
        <span className="demo-panel-tag">{title}</span>
        <p>{subtitle}</p>
      </header>
      <div className="demo-panel-frame">
        {!missing ? (
          <video
            className="demo-panel-video"
            src={src}
            controls
            playsInline
            muted
            loop
            preload="metadata"
            onError={() => setMissing(true)}
          >
            <track kind="captions" />
          </video>
        ) : (
          <div className="demo-panel-placeholder">
            <div className="demo-panel-placeholder-icon" aria-hidden="true">
              ▶
            </div>
            <p className="demo-panel-placeholder-title">Video coming soon</p>
            <p className="demo-panel-placeholder-hint">
              Add your clip to <code>{src.replace(/^\//, 'public/')}</code>
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
