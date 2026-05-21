import { LANDING_FEATURES } from '../../content/landing'

export default function FeatureBento(): JSX.Element {
  return (
    <div className="bento-grid">
      {LANDING_FEATURES.map((feature) => (
        <article
          key={feature.title}
          className={`bento-card${feature.span === 'large' ? ' bento-card--wide' : ''}`}
        >
          <span className="bento-icon" aria-hidden="true">
            {feature.icon}
          </span>
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </article>
      ))}
    </div>
  )
}
