import { Link } from 'react-router-dom'

export default function TrialBanner(): JSX.Element {
  return (
    <div className="trial-banner" role="banner">
      <p>
        <strong>Free 30-minute trial</strong> — no signup required. Download and start your first
        interview today.
      </p>
      <div className="trial-banner-actions">
        <a href="#download" className="btn btn-primary btn-sm">
          Download free
        </a>
        <Link to="/pricing" className="trial-banner-link">
          View pricing →
        </Link>
      </div>
    </div>
  )
}
