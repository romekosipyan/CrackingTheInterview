import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SeoHead from '../components/SeoHead'
import DownloadSection from '../components/landing/DownloadSection'
import { fetchDownloads, type DownloadInfo } from '../lib/api'

/**
 * Ad-safe "interview practice" landing page.
 *
 * IMPORTANT: This is the paid-traffic / ad-compliant front door. Keep the copy
 * focused on PRACTICE, PREPARATION, and CONFIDENCE. Do NOT add "invisible",
 * "undetectable", "stealth", or "screen share" language here — that framing is
 * what gets ad accounts and payment processors flagged. Point ads (Google,
 * Reddit, YouTube) at /practice.
 */

const BENEFITS = [
  {
    icon: '🎯',
    title: 'Real-time mock practice',
    body: 'Rehearse coding, system design, and behavioral rounds with a copilot that reacts to the question, just like a live interview.',
  },
  {
    icon: '🧭',
    title: 'Structure under pressure',
    body: 'Frameworks that keep you organized when nerves hit — requirements first, then design, then trade-offs.',
  },
  {
    icon: '💬',
    title: 'Communicate clearly',
    body: 'Prompts to explain your thinking out loud — ideal for non-native English speakers and anyone who freezes up.',
  },
  {
    icon: '📐',
    title: 'System design, visualized',
    body: 'See architecture as Mermaid diagrams so you learn to walk an interviewer through boxes, arrows, and data flow.',
  },
  {
    icon: '⭐',
    title: 'Behavioral STAR coaching',
    body: 'Turn messy experiences into concise Situation-Task-Action-Result stories you can deliver in under two minutes.',
  },
  {
    icon: '📄',
    title: 'Tailored to your role',
    body: 'Add your target job description and resume so practice questions and feedback match the role and your stack.',
  },
]

const STEPS = [
  { num: 1, title: 'Set up in a minute', body: 'Add your resume and target job description, then pick your language and round type.' },
  { num: 2, title: 'Run a timed mock', body: 'Practice a coding, system design, or behavioral round with real-time, structured guidance.' },
  { num: 3, title: 'Review and improve', body: 'Compare your answers to the suggested approach and focus your prep on the gaps.' },
]

const PRACTICE_FAQS = [
  {
    q: 'What is Kraken Interview?',
    a: 'Kraken Interview is a desktop interview-practice copilot for software engineers. It helps you rehearse coding, system design, and behavioral rounds with real-time, structured guidance so you walk into the real interview calm and prepared.',
  },
  {
    q: 'Who is it for?',
    a: 'Engineers preparing for technical interviews — new grads, career switchers, and experienced developers — plus non-native English speakers and anyone who wants to practice communicating their thinking under time pressure.',
  },
  {
    q: 'How much does it cost?',
    a: 'There is a one-time 30-minute free trial per device — enough for a full mock round. Pro plans start at $24/week, and you can cancel anytime from the My plan page.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required for the desktop app. Subscribe on the website and look up your plan by email whenever you need it.',
  },
]

export default function PracticePage(): JSX.Element {
  const [downloads, setDownloads] = useState<DownloadInfo[]>([])
  const [downloadError, setDownloadError] = useState('')

  useEffect(() => {
    void fetchDownloads()
      .then(setDownloads)
      .catch((error) => {
        setDownloadError(error instanceof Error ? error.message : 'Downloads unavailable.')
      })
  }, [])

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: PRACTICE_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
    []
  )

  return (
    <div className="practice-page">
      <SeoHead
        title="Interview Practice Copilot — Coding, System Design & Behavioral"
        description="Practice technical interviews with a real-time copilot. Rehearse coding, system design, and behavioral rounds with structured guidance. Free 30-minute trial, Pro from $24/week."
        path="/practice"
        jsonLd={jsonLd}
      />

      <section className="launch-hero">
        <div className="launch-hero-aurora" aria-hidden="true">
          <div className="launch-hero-orb launch-hero-orb--cyan" />
          <div className="launch-hero-orb launch-hero-orb--violet" />
          <div className="launch-hero-orb launch-hero-orb--emerald" />
        </div>
        <div className="landing-section-inner launch-hero-inner">
          <div className="launch-badge">
            <span className="launch-badge-live" />
            Interview practice, reinvented
          </div>
          <h1 className="hero-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="launch-hero-gradient">Walk in prepared. Not panicked.</span>
          </h1>
          <p className="launch-hero-sub hero-reveal" style={{ animationDelay: '0.2s' }}>
            Kraken Interview is a real-time practice copilot for coding, system design, and behavioral
            rounds. Rehearse under realistic pressure and learn to stay structured when it counts.
          </p>
          <div className="hero-actions hero-reveal" style={{ animationDelay: '0.3s' }}>
            <a href="#download" className="btn btn-primary btn-glow btn-lg">
              Start practicing free
            </a>
            <Link to="/pricing" className="btn btn-glass btn-lg">
              View pricing
            </Link>
          </div>
          <p className="hint" style={{ marginTop: '0.85rem' }}>
            One-time 30-minute free trial per device — enough for a full mock round.
          </p>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">Why Kraken</p>
          <h2>Practice every round, the smart way</h2>
          <p className="section-lead">
            Most candidates over-index on LeetCode volume and never rehearse communication, system
            design, or behavioral stories. Kraken helps you practice all of it.
          </p>
          <div className="practice-benefit-grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="practice-benefit-card">
                <span className="practice-benefit-icon" aria-hidden="true">
                  {b.icon}
                </span>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">How it works</p>
          <h2>Three steps to interview-ready</h2>
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

      <DownloadSection downloads={downloads} downloadError={downloadError} />

      <section className="landing-section">
        <div className="landing-section-inner faq-inner">
          <p className="section-eyebrow">FAQ</p>
          <h2>Common questions</h2>
          <div className="faq-list">
            {PRACTICE_FAQS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-final-cta">
        <div className="landing-section-inner landing-final-cta-inner">
          <div className="landing-final-cta-glow" aria-hidden="true" />
          <div className="landing-final-cta-ring" aria-hidden="true" />
          <h2>Your next interview starts with practice</h2>
          <p>Download free and run your first mock round today. Pro from $24/week.</p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-glow btn-lg btn-pulse" href="#download">
              Start practicing free
            </a>
            <Link className="btn btn-glass btn-lg" to="/pricing">
              Compare plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
