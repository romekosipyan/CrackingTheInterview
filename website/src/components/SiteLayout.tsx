import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export default function SiteLayout(): JSX.Element {
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
          <img className="brand-logo" src="/logo.png?v=2" alt="" width={64} height={64} />
          <span>Kraken Interview</span>
        </Link>
        <nav className="site-nav">
          <a href="/#features">Features</a>
          <a href="/#system-design">System design</a>
          <a href="/#platforms">Platforms</a>
          <a href="/#testimonials">Reviews</a>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/account">My plan</NavLink>
        </nav>
      </header>
      <main className={contained ? 'site-main--contained' : undefined}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Kraken Interview. Built for every interview round.</p>
      </footer>
    </div>
  )
}
