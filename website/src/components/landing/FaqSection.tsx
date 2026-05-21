import { FAQ_ITEMS } from '../../content/landing'

export default function FaqSection(): JSX.Element {
  return (
    <section id="faq" className="landing-section faq-section">
      <div className="landing-section-inner faq-inner">
        <p className="section-eyebrow">FAQ</p>
        <h2>Common questions</h2>
        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
