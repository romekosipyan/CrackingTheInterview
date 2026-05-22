import { LANDING_FEATURES } from '../../content/landing'
import RevealOnScroll from './RevealOnScroll'

export default function FeatureBento(): JSX.Element {
  return (
    <div className="bento-grid">
      {LANDING_FEATURES.map((feature, index) => (
        <RevealOnScroll key={feature.title} delay={index * 70} displayContents>
          <article className={`bento-card${feature.span === 'large' ? ' bento-card--wide' : ''}`}>
            <span className="bento-icon" aria-hidden="true">
              {feature.icon}
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        </RevealOnScroll>
      ))}
    </div>
  )
}
