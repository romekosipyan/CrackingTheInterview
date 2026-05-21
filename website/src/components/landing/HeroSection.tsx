import { Link } from 'react-router-dom'
import type { DownloadInfo } from '../../lib/api'
import { HERO_STATS } from '../../content/landing'

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
        <span className="hero-grid" />
      </div>

      <div className="landing-section-inner hero-grid-layout">
        <div className="hero-copy">
          <p className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            100% invisible on screen share
          </p>
          <h1>
            <span className="hero-gradient-text">Kraken Interview</span>
            <span className="hero-title-line">the AI interview copilot</span>
          </h1>
          <p className="hero-subtitle">
            Why grind alone when you can Kraken? Coding, system design, and behavioral rounds —
            invisible on Zoom, Teams, Meet, and every major interview platform.
          </p>
          <div className="hero-actions">
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
          <div className="hero-stats">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
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
                    <span>def twoSum(nums, target):</span>
                    <span>    seen = {}</span>
                    <span>    for i, n in enumerate(nums):</span>
                    <span className="dim"># clean shared screen only</span>
                  </div>
                </div>
                <div className="hero-mock-overlay">
                  <p className="hero-mock-overlay-tag">Your Kraken overlay</p>
                  <div className="hero-mock-answer">
                    <strong>Quick answer</strong>
                    <p>Use a hash map for O(n) time, O(n) space…</p>
                  </div>
                  <div className="hero-mock-keys">
                    <kbd>Ctrl+Shift+S</kbd>
                    <kbd>Ctrl+Enter</kbd>
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
