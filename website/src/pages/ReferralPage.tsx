import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SeoHead from '../components/SeoHead'
import { PROMO_DISCOUNT_LABEL } from '@shared/promoCodes'
import { trackEvent } from '../lib/analytics'

const SITE_URL = 'https://krakeninterview.com'

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

function buildLink(code: 'FRIEND10' | 'CREATOR10', handle: string): string {
  const params = new URLSearchParams({
    promo: code,
    utm_source: code === 'CREATOR10' ? 'creator' : 'referral',
    utm_medium: code === 'CREATOR10' ? 'affiliate' : 'friend',
  })
  const campaign = slugify(handle)
  if (campaign) params.set('utm_campaign', campaign)
  return `${SITE_URL}/pricing?${params.toString()}`
}

const HOW_IT_WORKS = [
  { num: 1, title: 'Grab your link', body: 'Add your name or handle below to generate a personal share link.' },
  { num: 2, title: 'Share it', body: 'Post it wherever engineers prep — group chats, Discord, X, or your audience.' },
  { num: 3, title: 'They save, you earn', body: 'Friends get 10% off their first payment. Verified referrals and creators earn rewards.' },
]

export default function ReferralPage(): JSX.Element {
  const [handle, setHandle] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const friendLink = useMemo(() => buildLink('FRIEND10', handle), [handle])
  const creatorLink = useMemo(() => buildLink('CREATOR10', handle), [handle])

  const copy = async (label: string, link: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(label)
      trackEvent('referral_link_copied', { link_type: label })
      window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 2000)
    } catch {
      setCopied(null)
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does the Kraken Interview referral program work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Share your personal link. Anyone who subscribes through it gets 10% off their first payment, and verified referrers and creators earn rewards.',
        },
      },
    ],
  }

  return (
    <div className="referral-page">
      <SeoHead
        title="Referral & Affiliate Program — Share Kraken Interview"
        description="Refer friends and earn rewards. Share your Kraken Interview link — friends get 10% off their first payment. Creators and affiliates welcome."
        path="/referral"
        jsonLd={jsonLd}
      />

      <section className="launch-hero">
        <div className="launch-hero-aurora" aria-hidden="true">
          <div className="launch-hero-orb launch-hero-orb--cyan" />
          <div className="launch-hero-orb launch-hero-orb--violet" />
        </div>
        <div className="landing-section-inner launch-hero-inner">
          <div className="launch-badge">
            <span className="launch-badge-live" />
            Referral & affiliate program
          </div>
          <h1 className="hero-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="launch-hero-gradient">Share Kraken. Everyone wins.</span>
          </h1>
          <p className="launch-hero-sub hero-reveal" style={{ animationDelay: '0.2s' }}>
            Help someone land their offer and get rewarded for it. Friends save {PROMO_DISCOUNT_LABEL.toLowerCase()};
            referrers and creators earn.
          </p>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">How it works</p>
          <h2>Three steps to start earning</h2>
          <div className="launch-steps-grid">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} className="launch-step-card">
                <div className="launch-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner referral-generator">
          <p className="section-eyebrow">Your link</p>
          <h2>Generate your share link</h2>
          <p className="section-lead">
            Add your name or handle so we can attribute referrals to you. Then copy and share.
          </p>

          <label className="referral-field">
            <span>Your name or handle</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. alex or @alexcodes"
              maxLength={40}
              autoComplete="off"
            />
          </label>

          <div className="referral-link-card">
            <div className="referral-link-head">
              <strong>Refer a friend</strong>
              <span className="referral-tag">FRIEND10 · 10% off for them</span>
            </div>
            <div className="referral-link-row">
              <code>{friendLink}</code>
              <button type="button" className="btn btn-primary" onClick={() => void copy('friend', friendLink)}>
                {copied === 'friend' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="referral-link-card">
            <div className="referral-link-head">
              <strong>Creator / affiliate link</strong>
              <span className="referral-tag">CREATOR10 · for audiences</span>
            </div>
            <div className="referral-link-row">
              <code>{creatorLink}</code>
              <button type="button" className="btn btn-glass" onClick={() => void copy('creator', creatorLink)}>
                {copied === 'creator' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="hint" style={{ marginTop: '0.6rem' }}>
              Running a newsletter, YouTube channel, or community? Email{' '}
              <a href="mailto:partners@krakeninterview.com">partners@krakeninterview.com</a> for a custom
              code, higher discount, and revenue share.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section landing-final-cta">
        <div className="landing-section-inner landing-final-cta-inner">
          <div className="landing-final-cta-glow" aria-hidden="true" />
          <div className="landing-final-cta-ring" aria-hidden="true" />
          <h2>New here? Try it first</h2>
          <p>Run a free 30-minute mock round, then share it with someone who needs it.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-glow btn-lg" to="/#download">
              Download free
            </Link>
            <Link className="btn btn-glass btn-lg" to="/pricing">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
