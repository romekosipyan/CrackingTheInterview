import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SystemDesignSection from '../components/landing/SystemDesignSection'
import SyncedDemoGrid from '../components/landing/SyncedDemoGrid'
import DownloadSection from '../components/landing/DownloadSection'
import FaqSection from '../components/landing/FaqSection'
import FeatureBento from '../components/landing/FeatureBento'
import HeroSection from '../components/landing/HeroSection'
import PlatformMarquee from '../components/landing/PlatformMarquee'
import RevealOnScroll from '../components/landing/RevealOnScroll'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import { CODING_PLATFORMS, MEETING_PLATFORMS } from '../content/landing'
import { fetchDownloads, type DownloadInfo } from '../lib/api'

export default function LandingPage(): JSX.Element {
  const [downloads, setDownloads] = useState<DownloadInfo[]>([])
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    void fetchDownloads()
      .then(setDownloads)
      .catch((error) => {
        setDownloadError(error instanceof Error ? error.message : 'Downloads unavailable.')
      })
  }, [])

  const winDownload = downloads.find((item) => item.platform === 'win')
  const macDownload = downloads.find((item) => item.platform === 'mac')

  return (
    <div className="landing-page">
      <HeroSection winDownload={winDownload} macDownload={macDownload} />

      <section id="demo" className="landing-section demo-section">
        <RevealOnScroll>
          <div className="landing-section-inner">
            <p className="section-eyebrow">See it in action</p>
            <h2>Invisible to them. Powerful for you.</h2>
            <p className="section-lead">
              You keep the copilot on your screen. The interviewer only sees what you choose to share.
            </p>
            <SyncedDemoGrid />
          </div>
        </RevealOnScroll>
      </section>

      <SystemDesignSection />

      <section id="platforms" className="landing-section platforms-section">
        <RevealOnScroll delay={80}>
          <div className="landing-section-inner">
            <p className="section-eyebrow">Works everywhere</p>
            <h2>Kraken Interview works across all platforms</h2>
            <p className="section-lead">
              Invisible to screen-recording and sharing in every major video call — plus every coding
              interview site you will actually use.
            </p>
            <PlatformMarquee
              title="Coding & technical interview sites"
              platforms={CODING_PLATFORMS}
              variant="code"
              ariaLabel="Supported coding interview platforms"
            />
            <PlatformMarquee
              title="Video meetings & screen share"
              platforms={MEETING_PLATFORMS}
              variant="meet"
              reverse
              ariaLabel="Supported meeting platforms"
            />
            <p className="platform-footnote">
              Capture exclusion keeps the overlay off the shared pipeline on Windows 10 2004+ and Windows 11.
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <section id="features" className="landing-section features-section">
        <RevealOnScroll delay={120}>
          <div className="landing-section-inner">
            <p className="section-eyebrow">Features</p>
            <h2>More than a coding cheat sheet</h2>
            <p className="section-lead">
              Everything you need for coding, design, and behavioral — in one kraken-sized toolkit.
            </p>
            <FeatureBento />
          </div>
        </RevealOnScroll>
      </section>

      <TestimonialsSection />

      <DownloadSection downloads={downloads} downloadError={downloadError} />

      <FaqSection />

      <section className="landing-section landing-final-cta">
        <RevealOnScroll delay={60}>
          <div className="landing-section-inner landing-final-cta-inner">
            <div className="landing-final-cta-glow" aria-hidden="true" />
            <div className="landing-final-cta-ring" aria-hidden="true" />
            <h2>Release the kraken on your next round</h2>
            <p>Download free, upgrade when you&apos;re ready. Manage your plan anytime by email.</p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-glow btn-lg btn-pulse" href="#download">
                Get Kraken Interview
              </a>
              <Link className="btn btn-glass btn-lg" to="/pricing">
                Compare plans
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  )
}
