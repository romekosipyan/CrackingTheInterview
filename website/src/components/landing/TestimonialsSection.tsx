import { TESTIMONIALS } from '../../content/landing'

export default function TestimonialsSection(): JSX.Element {
  return (
    <section id="testimonials" className="landing-section testimonials-section">
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
  )
}
