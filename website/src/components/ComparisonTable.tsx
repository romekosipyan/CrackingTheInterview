const FEATURES = [
  {
    label: 'Weekly price',
    kraken: '$24',
    compA: '$39',
    compB: '$29',
  },
  {
    label: 'Monthly price',
    kraken: '$54',
    compA: '$69',
    compB: '—',
  },
  {
    label: 'Lifetime option',
    kraken: '$684',
    compA: '$699',
    compB: '—',
  },
  {
    label: 'Coding interviews',
    kraken: true,
    compA: true,
    compB: true,
  },
  {
    label: 'System design',
    kraken: '✓ (Mermaid)',
    compA: 'Basic',
    compB: false,
  },
  {
    label: 'Behavioral (STAR)',
    kraken: true,
    compA: false,
    compB: true,
  },
  {
    label: 'Screen share stealth',
    kraken: true,
    compA: true,
    compB: true,
  },
  {
    label: 'Voice input',
    kraken: true,
    compA: true,
    compB: false,
  },
  {
    label: 'JD + Resume context',
    kraken: true,
    compA: false,
    compB: false,
  },
  {
    label: 'Multi-platform',
    kraken: '18+ platforms',
    compA: '10+',
    compB: '8+',
  },
  {
    label: 'Free tier',
    kraken: 'One-time 30 min trial',
    compA: false,
    compB: 'Limited',
  },
] as const

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
              <th>Competitor A</th>
              <th>Competitor B</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f) => (
              <tr key={f.label}>
                <td className="cmp-feature-col">{f.label}</td>
                <td className="cmp-kraken-col">
                  <Cell value={f.kraken} />
                </td>
                <td>
                  <Cell value={f.compA} />
                </td>
                <td>
                  <Cell value={f.compB} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="comparison-disclaimer">
        Comparison based on publicly available information as of 2026. Features and pricing may vary.
      </p>
    </div>
  )
}
