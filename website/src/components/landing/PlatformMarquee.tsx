import { useState } from 'react'
import type { PlatformBrand } from '../content/landing'

type Props = {
  title: string
  platforms: PlatformBrand[]
  variant: 'code' | 'meet'
  reverse?: boolean
  ariaLabel: string
}

function iconUrl(slug: string, color: string): string {
  return `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`
}

function PlatformCard({
  platform,
  variant
}: {
  platform: PlatformBrand
  variant: 'code' | 'meet'
}): JSX.Element {
  const [iconFailed, setIconFailed] = useState(false)
  const showIcon = platform.icon && !iconFailed

  return (
    <div className={`platform-card platform-card--${variant}`} style={{ '--brand': platform.color }}>
      <div className="platform-card-logo" aria-hidden="true">
        {showIcon ? (
          <img
            src={iconUrl(platform.icon!, platform.color)}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setIconFailed(true)}
          />
        ) : (
          <span className="platform-card-fallback">{platform.name.charAt(0)}</span>
        )}
      </div>
      <span className="platform-card-name">{platform.name}</span>
    </div>
  )
}

export default function PlatformMarquee({
  title,
  platforms,
  variant,
  reverse = false,
  ariaLabel
}: Props): JSX.Element {
  const track = [...platforms, ...platforms]

  return (
    <div className="platform-block">
      <h3>{title}</h3>
      <div
        className={`platform-marquee${reverse ? ' platform-marquee--reverse' : ''}`}
        aria-label={ariaLabel}
      >
        <div className="platform-marquee-track">
          {track.map((platform, index) => (
            <PlatformCard key={`${platform.name}-${index}`} platform={platform} variant={variant} />
          ))}
        </div>
      </div>
    </div>
  )
}
