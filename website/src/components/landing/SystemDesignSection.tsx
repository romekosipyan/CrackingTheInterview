import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { SYSTEM_DESIGN_HIGHLIGHTS, SYSTEM_DESIGN_VIDEO } from '../../content/landing'
import { useInView } from '../../hooks/useInView'

export default function SystemDesignSection(): JSX.Element {
  const [missing, setMissing] = useState(false)
  const [stageRef, inView] = useInView({ threshold: 0, rootMargin: '600px 0px', once: true })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (inView) videoRef.current?.play().catch(() => undefined)
  }, [inView])

  return (
    <section id="system-design" className="landing-section system-design-section">
      <div className="system-design-aurora" aria-hidden="true">
        <span className="system-design-orb system-design-orb--left" />
        <span className="system-design-orb system-design-orb--right" />
      </div>

      <div className="landing-section-inner system-design-inner">
        <div className="system-design-header">
          <p className="section-eyebrow system-design-eyebrow">System design rounds</p>
          <h2>
            Architect like a senior.
            <span className="system-design-headline-accent">Diagrams included.</span>
          </h2>
          <p className="system-design-lead">
            Kraken Interview doesn&apos;t stop at LeetCode. Deep answers break down requirements,
            scale paths, bottlenecks, and trade-offs — with Mermaid architecture diagrams you can
            talk through live.
          </p>
        </div>

        <div className="system-design-visual">
          <div className="system-design-video-shell">
            <div className="system-design-video-glow" aria-hidden="true" />
            <div className="system-design-video-frame">
              <div className="system-design-video-chrome">
                <span />
                <span />
                <span />
                <p>System design · Deep answer + Mermaid</p>
              </div>
              <div className="system-design-video-stage" ref={stageRef as RefObject<HTMLDivElement>}>
                {!missing ? (
                  <video
                    ref={videoRef}
                    className="system-design-video"
                    src={inView ? SYSTEM_DESIGN_VIDEO : undefined}
                    autoPlay
                    playsInline
                    muted
                    loop
                    preload={inView ? 'auto' : 'none'}
                    disablePictureInPicture
                    onContextMenu={(event) => event.preventDefault()}
                    onError={() => inView && setMissing(true)}
                  />
                ) : (
                  <div className="system-design-video-placeholder">
                    <p>Add your clip to <code>public/videos/system-design.mp4</code></p>
                  </div>
                )}
              </div>
            </div>

            <div className="system-design-float system-design-float--top">
              <span className="system-design-float-label">Output</span>
              <strong>Mermaid diagram</strong>
              <p>Load balancers · caches · queues</p>
            </div>
            <div className="system-design-float system-design-float--bottom">
              <span className="system-design-float-label">Deep solve</span>
              <strong>Trade-off matrix</strong>
              <p>CAP · latency · cost · ops</p>
            </div>
          </div>
        </div>

        <ul className="system-design-highlights">
          {SYSTEM_DESIGN_HIGHLIGHTS.map((item) => (
            <li key={item.title}>
              <span className="system-design-highlight-icon" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="system-design-cta">
          <Link className="btn btn-primary btn-glow btn-lg" to="/pricing">
            Unlock system design mode
          </Link>
          <a className="btn btn-glass btn-lg" href="#download">
            Try it free
          </a>
        </div>
      </div>
    </section>
  )
}
