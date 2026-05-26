import { useEffect, useRef } from 'react'
import { TESTIMONIALS } from '../content/landing'

const STATS = [
  { value: '18+', label: 'Platforms supported' },
  { value: '3', label: 'Interview types' },
  { value: '$15', label: 'Less than competitors' },
  { value: '100%', label: 'Invisible on share' }
] as const

const STEPS = [
  {
    num: 1,
    title: 'Download & set up',
    body: 'Upload your resume, paste the job description URL, and pick your language.'
  },
  {
    num: 2,
    title: 'Start your interview',
    body: 'Kraken stays invisible on screen share — interviewers see nothing.'
  },
  {
    num: 3,
    title: 'Get AI-powered answers',
    body: 'Structured coding, system design, and behavioral responses in real time.'
  }
] as const

const PH_URL = 'https://www.producthunt.com/'

function useCountUp(ref: React.RefObject<HTMLSpanElement | null>, target: string, delay: number) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const numericPart = parseInt(target.replace(/[^0-9]/g, ''), 10)
    if (isNaN(numericPart)) {
      el.textContent = target
      return
    }

    const prefix = target.match(/^[^0-9]*/)?.[0] ?? ''
    const suffix = target.match(/[^0-9]*$/)?.[0] ?? ''

    let frame: number
    const start = performance.now()
    const duration = 1200

    const tick = (now: number) => {
      const elapsed = now - start - delay
      if (elapsed < 0) {
        el.textContent = `${prefix}0${suffix}`
        frame = requestAnimationFrame(tick)
        return
      }
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * numericPart)
      el.textContent = `${prefix}${current}${suffix}`
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [ref, target, delay])
}

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useCountUp(ref, value, index * 200)
  return (
    <div className="launch-stat-card">
      <span ref={ref} className="launch-stat-value">
        0
      </span>
      <span className="launch-stat-label">{label}</span>
    </div>
  )
}

export default function LaunchPage(): JSX.Element {
  return (
    <div className="launch-page">
      {/* ——— Hero ——— */}
      <section className="launch-hero">
        <div className="launch-hero-aurora">
          <div className="launch-hero-orb launch-hero-orb--cyan" />
          <div className="launch-hero-orb launch-hero-orb--violet" />
          <div className="launch-hero-orb launch-hero-orb--emerald" />
        </div>
        <div className="launch-hero-border" />
        <div className="landing-section-inner launch-hero-inner">
          <div className="launch-badge hero-reveal">
            <span className="launch-badge-live" />
            LIVE NOW
          </div>
          <h1 className="hero-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="launch-hero-gradient">We're live on Product Hunt!</span>{' '}
            <span className="launch-hero-emoji" aria-hidden="true">
              🚀
            </span>
          </h1>
          <p className="launch-hero-sub hero-reveal" style={{ animationDelay: '0.2s' }}>
            Kraken Interview — the AI interview copilot that's invisible on screen share.
            <br />
            Help us reach <strong>#1 Product of the Day!</strong>
          </p>
          <div className="hero-actions hero-reveal" style={{ animationDelay: '0.3s' }}>
            <a
              href={PH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-glow btn-lg launch-ph-btn"
            >
              🐱 Support us on Product Hunt
            </a>
            <a href="/#download" className="btn btn-glass btn-lg">
              Download free
            </a>
          </div>
        </div>
      </section>

      {/* ——— What is Kraken Interview ——— */}
      <section className="landing-section launch-what-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">What is Kraken Interview</p>
          <h2>Your invisible interview advantage</h2>
          <ul className="launch-bullets">
            <li>
              <span className="launch-bullet-icon">◈</span>
              <div>
                <strong>AI copilot for every round</strong>
                <p>Coding, system design with Mermaid diagrams, and behavioral STAR answers.</p>
              </div>
            </li>
            <li>
              <span className="launch-bullet-icon">👁</span>
              <div>
                <strong>Invisible on Zoom, Teams, Meet</strong>
                <p>Capture exclusion keeps the overlay off every screenshare pipeline.</p>
              </div>
            </li>
            <li>
              <span className="launch-bullet-icon">◉</span>
              <div>
                <strong>Personalized to your profile</strong>
                <p>
                  Job description + resume context for answers that match the role, stack, and
                  company.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* ——— The Numbers ——— */}
      <section className="landing-section launch-stats-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">The numbers</p>
          <h2>Built for real interviews</h2>
          <div className="launch-stats-grid">
            {STATS.map((s, i) => (
              <StatCard key={s.label} value={s.value} label={s.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ——— How it works ——— */}
      <section className="landing-section launch-steps-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">How it works</p>
          <h2>Three steps to launch-day confidence</h2>
          <div className="launch-steps-grid">
            {STEPS.map((s) => (
              <div key={s.num} className="launch-step-card">
                <div className="launch-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Pricing preview ——— */}
      <section className="landing-section launch-pricing-section">
        <div className="landing-section-inner">
          <div className="launch-pricing-card">
            <div className="launch-pricing-content">
              <p className="section-eyebrow">Pricing</p>
              <h2>Free tier available. Pro from $24/week.</h2>
              <p className="section-lead">
                $15 less than leading competitors on equivalent tiers. No signup required for the
                desktop app.
              </p>
              <a href="/pricing" className="btn btn-glass btn-lg">
                View full pricing →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Social proof ——— */}
      <section className="landing-section testimonials-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">Social proof</p>
          <h2>Loved by engineers preparing for real rounds</h2>
          <p className="section-lead">
            From FAANG loops to startup screens — Kraken Interview helps you stay calm, structured,
            and invisible.
          </p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((item) => (
              <blockquote key={item.quote.slice(0, 24)} className="testimonial-card">
                <div className="testimonial-stars" aria-hidden="true">
                  ★★★★★
                </div>
                <p>&ldquo;{item.quote}&rdquo;</p>
                <footer>
                  <strong>{item.role}</strong>
                  <span>{item.company}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Final CTA ——— */}
      <section className="landing-section landing-final-cta">
        <div className="landing-section-inner">
          <div className="landing-final-cta-inner">
            <div className="landing-final-cta-ring" />
            <div className="landing-final-cta-glow" />
            <h2>
              Help Kraken reach{' '}
              <span className="hero-gradient-text" style={{ display: 'inline' }}>
                #1 Product of the Day
              </span>
            </h2>
            <p>Your upvote means the world. Every vote helps us build something bigger.</p>
            <div className="hero-actions">
              <a
                href={PH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-glow btn-lg btn-pulse launch-ph-btn"
              >
                🐱 Support us on Product Hunt
              </a>
              <a href="/#download" className="btn btn-glass btn-lg">
                Download free
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
