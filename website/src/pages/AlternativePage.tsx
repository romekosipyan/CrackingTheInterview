import { useEffect, useMemo } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import SeoHead from '../components/SeoHead'
import { getAlternative } from '../content/alternatives'

const SITE_URL = 'https://krakeninterview.com'

export default function AlternativePage(): JSX.Element {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+/, '').replace(/\/+$/, '')
  const alt = getAlternative(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const jsonLd = useMemo(() => {
    if (!alt) return undefined
    const url = `${SITE_URL}/${alt.slug}`
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: alt.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: `${alt.competitor} alternative`, item: url },
        ],
      },
    ]
  }, [alt])

  if (!alt) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="alt-page">
      <SeoHead
        title={alt.title}
        description={alt.description}
        path={`/${alt.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <section className="alt-hero">
        <div className="alt-hero-aurora" aria-hidden="true">
          <span className="launch-hero-orb launch-hero-orb--cyan" />
          <span className="launch-hero-orb launch-hero-orb--violet" />
        </div>
        <div className="landing-section-inner alt-hero-inner">
          <p className="section-eyebrow">Kraken Interview vs {alt.competitor}</p>
          <h1>{alt.title}</h1>
          <p className="section-lead">{alt.tagline}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-glow btn-lg" to="/pricing">
              See pricing
            </Link>
            <Link className="btn btn-glass btn-lg" to="/#download">
              Try free — 30 min
            </Link>
          </div>
          <p className="hint" style={{ marginTop: '0.85rem' }}>
            One-time 30-minute free trial per device. No signup for the desktop app.
          </p>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">Why switch</p>
          <h2>Why engineers choose Kraken over {alt.competitor}</h2>
          <ul className="alt-reasons">
            {alt.whySwitch.map((reason) => (
              <li key={reason}>
                <span className="alt-reason-check" aria-hidden="true">
                  ✓
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner">
          <p className="section-eyebrow">Head to head</p>
          <h2>Kraken Interview vs {alt.competitor}</h2>
          <div className="comparison-table-wrap">
            <div className="comparison-table-scroll">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="cmp-feature-col">Feature</th>
                    <th className="cmp-kraken-col">Kraken Interview</th>
                    <th>{alt.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {alt.rows.map((row) => (
                    <tr key={row.label}>
                      <td className="cmp-feature-col">{row.label}</td>
                      <td className="cmp-kraken-col">
                        <span className={row.krakenWins ? 'cmp-text alt-win' : 'cmp-text'}>
                          {row.kraken}
                        </span>
                      </td>
                      <td>
                        <span className="cmp-text">{row.competitor}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="comparison-disclaimer">
              Comparison based on publicly listed pricing and features as of 2026
              {alt.competitorUrl ? (
                <>
                  {' '}
                  (
                  <a href={alt.competitorUrl} target="_blank" rel="nofollow noopener noreferrer">
                    {alt.competitor}
                  </a>
                  )
                </>
              ) : null}
              . Plans change — verify on the provider’s site before buying.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner faq-inner">
          <p className="section-eyebrow">FAQ</p>
          <h2>{alt.competitor} alternative — questions</h2>
          <div className="faq-list">
            {alt.faqs.map((item) => (
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
          <h2>Try the {alt.competitor} alternative built for every round</h2>
          <p>Download free, upgrade when you&apos;re ready. Pro from $24/week.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-glow btn-lg btn-pulse" to="/#download">
              Get Kraken Interview
            </Link>
            <Link className="btn btn-glass btn-lg" to="/pricing">
              Compare plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
