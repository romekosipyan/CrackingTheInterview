export const DISCORD_INVITE = 'https://discord.gg/krakeninterview'

export default function DiscordWidget(): JSX.Element {
  return (
    <div className="discord-widget">
      <div className="discord-widget-accent" aria-hidden="true" />
      <div className="discord-widget-content">
        <svg
          className="discord-widget-logo"
          viewBox="0 0 71 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M60.1 4.9A58.5 58.5 0 0045.4.5a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.6a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.2a58.9 58.9 0 0017.7 9 .2.2 0 00.3-.1 42.2 42.2 0 003.6-5.9.2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.4 36.4 0 01-5.5 2.6.2.2 0 00-.1.3 47.3 47.3 0 003.6 5.9.2.2 0 00.3.1 58.7 58.7 0 0017.7-9 .2.2 0 00.1-.2c1.4-15-2.3-28-9.8-39.6a.2.2 0 00-.1-.1zM23.7 37.3c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.1 6.3 7-2.8 7-6.3 7zm23.3 0c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.1 6.3 7-2.8 7-6.3 7z"
            fill="#5865F2"
          />
        </svg>
        <h3 className="discord-widget-heading">Join our community</h3>
        <p className="discord-widget-desc">
          Connect with engineers preparing for interviews. Share tips, get help, celebrate offers.
        </p>
        <div className="discord-widget-stats">
          <span className="discord-widget-members">
            <span className="discord-widget-dot" aria-hidden="true" />
            500+ members
          </span>
        </div>
        <a
          className="btn btn-primary discord-widget-btn"
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
        >
          Join Discord
        </a>
      </div>
    </div>
  )
}
