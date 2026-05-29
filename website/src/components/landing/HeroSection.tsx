import { Link } from 'react-router-dom'
import type { DownloadInfo } from '../../lib/api'
import { HERO_STATS } from '../../content/landing'
import AnimatedStat from './AnimatedStat'
import HeroParticles from './HeroParticles'
import RotatingText from './RotatingText'

type Props = {
  winDownload?: DownloadInfo
  macDownload?: DownloadInfo
}

export default function HeroSection({ winDownload, macDownload }: Props): JSX.Element {
  return (
    <section className="landing-hero">
      <div className="hero-aurora" aria-hidden="true">
        <span className="hero-orb hero-orb--cyan" />
        <span className="hero-orb hero-orb--violet" />
        <span className="hero-orb hero-orb--emerald" />
        <span className="hero-grid" />
        <HeroParticles />
      </div>

      <div className="landing-section-inner hero-grid-layout">
        <div className="hero-copy">
          <p className="hero-badge hero-reveal" style={{ animationDelay: '0.05s' }}>
            <span className="hero-badge-dot" aria-hidden="true" />
            100% invisible on screen share
          </p>
          <h1>
            <span className="hero-gradient-text hero-reveal hero-shimmer" style={{ animationDelay: '0.12s' }}>
              Kraken Interview
            </span>
            <span className="hero-title-line hero-reveal" style={{ animationDelay: '0.2s' }}>
              the AI interview copilot
            </span>
          </h1>
          <p className="hero-subtitle hero-reveal" style={{ animationDelay: '0.28s' }}>
            Why grind alone when you can Kraken?
            <span className="hero-subtitle-accent-line">
              Ace your <RotatingText />
            </span>
            <span className="hero-subtitle-tail">
              Invisible on Zoom, Teams, Meet, and every major interview platform.
            </span>
          </p>
          <div className="hero-actions hero-reveal" style={{ animationDelay: '0.36s' }}>
            {macDownload ? (
              <a className="btn btn-primary btn-glow btn-lg" href={macDownload.url} download={macDownload.filename}>
                Download on Mac
              </a>
            ) : (
              <a className="btn btn-primary btn-glow btn-lg" href="#download">
                Download on Mac
              </a>
            )}
            {winDownload ? (
              <a className="btn btn-glass btn-lg" href={winDownload.url} download={winDownload.filename}>
                Download on Windows
              </a>
            ) : (
              <a className="btn btn-glass btn-lg" href="#download">
                Download on Windows
              </a>
            )}
            <Link className="btn btn-ghost btn-lg" to="/pricing">
              View pricing
            </Link>
          </div>
          <div className="hero-stats hero-reveal" style={{ animationDelay: '0.44s' }}>
            {HERO_STATS.map((stat) => (
              <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>

        <div className="hero-visual hero-reveal" style={{ animationDelay: '0.32s' }} aria-hidden="true">
          <div className="hero-mock">
            <div className="hero-mock-glow" />
            <div className="hero-mock-window">
              <div className="hero-mock-titlebar">
                <span />
                <span />
                <span />
                <p>Zoom — Screen Share</p>
              </div>
              <div className="hero-mock-body">
                <div className="hero-mock-shared">
                  <p className="hero-mock-label">Interviewer sees</p>
                  <div className="hero-mock-code">
                    <span>def mergeKLists(lists):</span>
                    <span>    heap = []</span>
                    <span>    for i, head in enumerate(lists):</span>
                    <span>        if head:</span>
                    <span>            heappush(heap, (head.val, i, head))</span>
                    <span className="dim"># interviewer sees your editor only</span>
                  </div>
                </div>
                <div className="hero-mock-overlay hero-mock-overlay--pulse">
                  <p className="hero-mock-overlay-tag">
                    <span className="hero-mock-live-dot" />
                    Your Kraken overlay
                  </p>
                  <div className="hero-mock-answer">
                    <strong>Quick answer</strong>
                    <p className="hero-mock-typing">
                      Min-heap of k heads — pop smallest, link it, push its .next. O(N log k) time…
                    </p>
                  </div>
                  <div className="hero-mock-keys">
                    <kbd>Alt+S</kbd>
                    <kbd>Alt+Enter</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
