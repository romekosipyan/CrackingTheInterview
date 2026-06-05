import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { DISCORD_INVITE } from './DiscordWidget'
import { usePageTracking } from '../lib/analytics'

export default function SiteLayout(): JSX.Element {
  usePageTracking()
  const location = useLocation()
  const contained = location.pathname !== '/'

  return (
    <div className="site">
      <div className="site-bg" aria-hidden="true">
        <span className="site-bg-orb site-bg-orb--1" />
        <span className="site-bg-orb site-bg-orb--2" />
        <span className="site-bg-orb site-bg-orb--3" />
      </div>
      <header className="site-header">
        <Link to="/" className="brand">
          <img className="brand-logo" src="/logo.png?v=3" alt="" width={80} height={80} />
          <span>Kraken Interview</span>
        </Link>
        <nav className="site-nav">
          <a href="/#features">Features</a>
          <a href="/#system-design">System design</a>
          <a href="/#platforms">Platforms</a>
          <a href="/#testimonials">Reviews</a>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/account">My plan</NavLink>
        </nav>
      </header>
      <main className={contained ? 'site-main--contained' : undefined}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-social">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="footer-social-link"
            >
              <svg viewBox="0 0 71 55" fill="currentColor" aria-hidden="true">
                <path d="M60.1 4.9A58.5 58.5 0 0045.4.5a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.6a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.2a58.9 58.9 0 0017.7 9 .2.2 0 00.3-.1 42.2 42.2 0 003.6-5.9.2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.3 47.3 0 003.6 5.9.2.2 0 00.3.1 58.7 58.7 0 0017.7-9 .2.2 0 00.1-.2c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.3c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.1 6.3 7-2.8 7-6.3 7zm23.3 0c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.1 6.3 7-2.8 7-6.3 7z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/krakeninterview"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="footer-social-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/krakeninterview"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="footer-social-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Kraken Interview. Built for every interview round.</p>
        </div>
      </footer>
    </div>
  )
}
