import { Link } from 'react-router-dom'

export default function SuccessPage(): JSX.Element {
  return (
    <section className="status-page">
      <h1>Welcome aboard 🐙</h1>
      <p>Your Kraken Interview subscription is active. Download the desktop app to get started.</p>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/#download">
          Download app
        </Link>
        <Link className="btn btn-secondary" to="/account">
          View my plan
        </Link>
      </div>
    </section>
  )
}
