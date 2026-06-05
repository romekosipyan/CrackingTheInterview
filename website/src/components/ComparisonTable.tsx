const COMPETITORS = [
  { id: 'shadecoder', name: 'ShadeCoder', href: 'https://www.shadecoder.com/' },
  { id: 'lockedin', name: 'LockedIn AI', href: 'https://www.lockedinai.com/' },
  { id: 'finalround', name: 'Final Round AI', href: 'https://www.finalroundai.com/' },
] as const

type CompetitorId = (typeof COMPETITORS)[number]['id']

type FeatureRow = {
  label: string
  kraken: boolean | string
} & Record<CompetitorId, boolean | string>

/** Public pricing & features from competitor sites (May 2026). */
const FEATURES: FeatureRow[] = [
  {
    label: 'Weekly price',
    kraken: '$24',
    shadecoder: '$39',
    lockedin: '—',
    finalround: '—',
  },
  {
    label: 'Monthly price',
    kraken: '$54',
    shadecoder: '$69',
    lockedin: '$69.99',
    finalround: '$90',
  },
  {
    label: 'Lifetime option',
    kraken: '$684',
    shadecoder: '$699',
    lockedin: '—',
    finalround: '—',
  },
  {
    label: 'Coding interviews',
    kraken: true,
    shadecoder: true,
    lockedin: true,
    finalround: true,
  },
  {
    label: 'System design',
    kraken: '✓ (Mermaid)',
    shadecoder: 'Text only',
    lockedin: 'Text only',
    finalround: 'Text only',
  },
  {
    label: 'Behavioral (STAR)',
    kraken: true,
    shadecoder: false,
    lockedin: true,
    finalround: true,
  },
  {
    label: 'Screen share stealth',
    kraken: true,
    shadecoder: true,
    lockedin: 'Pro plan only',
    finalround: 'Pro tier only',
  },
  {
    label: 'Voice input',
    kraken: true,
    shadecoder: 'Screenshot',
    lockedin: true,
    finalround: true,
  },
  {
    label: 'JD + Resume context',
    kraken: true,
    shadecoder: false,
    lockedin: true,
    finalround: true,
  },
  {
    label: 'Multi-platform',
    kraken: '18+ platforms',
    shadecoder: '15+ platforms',
    lockedin: '20+ platforms',
    finalround: '10+ platforms',
  },
  {
    label: 'Free tier',
    kraken: 'One-time 30 min trial',
    shadecoder: 'Free (0 credits)',
    lockedin: 'Free tier',
    finalround: '10-min trial',
  },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="cmp-check">✓</span>
  if (value === false) return <span className="cmp-cross">✗</span>
  return <span className="cmp-text">{value}</span>
}

export default function ComparisonTable(): JSX.Element {
  return (
    <div className="comparison-table-wrap">
      <div className="comparison-table-scroll">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="cmp-feature-col">Feature</th>
              <th className="cmp-kraken-col">Kraken Interview</th>
              {COMPETITORS.map((competitor) => (
                <th key={competitor.id}>
                  <a href={competitor.href} target="_blank" rel="noopener noreferrer">
                    {competitor.name}
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature) => (
              <tr key={feature.label}>
                <td className="cmp-feature-col">{feature.label}</td>
                <td className="cmp-kraken-col">
                  <Cell value={feature.kraken} />
                </td>
                {COMPETITORS.map((competitor) => (
                  <td key={competitor.id}>
                    <Cell value={feature[competitor.id]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="comparison-disclaimer">
        Comparison based on publicly listed pricing and features from{' '}
        <a href="https://www.shadecoder.com/" target="_blank" rel="noopener noreferrer">
          ShadeCoder
        </a>
        ,{' '}
        <a href="https://www.lockedinai.com/" target="_blank" rel="noopener noreferrer">
          LockedIn AI
        </a>
        , and{' '}
        <a href="https://www.finalroundai.com/" target="_blank" rel="noopener noreferrer">
          Final Round AI
        </a>{' '}
        as of May 2026. Plans change — verify on each site before buying.
      </p>
    </div>
  )
}
