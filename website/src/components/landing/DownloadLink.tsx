import type { ReactNode } from 'react'
import { trackEvent } from '../../lib/analytics'

type Props = {
  href: string
  download?: string
  className?: string
  platform: 'win' | 'mac'
  children: ReactNode
}

export default function DownloadLink({ href, download, className, platform, children }: Props): JSX.Element {
  return (
    <a
      className={className}
      href={href}
      download={download}
      onClick={() => trackEvent('download_click', { platform })}
    >
      {children}
    </a>
  )
}
