import { Link } from 'react-router-dom'
import { DISCORD_INVITE } from '../components/DiscordWidget'

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
        <a className="btn btn-glass" href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
          Join Discord
        </a>
      </div>
      <p className="hint" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Share your win in Discord — we love hearing about offers landed.
      </p>
    </section>
  )
}
