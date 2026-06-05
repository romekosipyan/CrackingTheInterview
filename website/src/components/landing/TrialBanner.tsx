import { Link } from 'react-router-dom'

export default function TrialBanner(): JSX.Element {
  return (
    <div className="trial-banner" role="banner">
      <p>
        <strong>Free 30-minute trial</strong> — no signup required. Use <strong>LAUNCH10</strong> for
        10% off your first payment.
      </p>
      <div className="trial-banner-actions">
        <a href="#download" className="btn btn-primary btn-sm">
          Download free
        </a>
        <Link to="/pricing?promo=LAUNCH10" className="trial-banner-link">
          Claim LAUNCH10 →
        </Link>
      </div>
    </div>
  )
}
