import { Link } from 'react-router-dom'

type Props = {
  title: string
}

export default function SettingsGearButton({ title }: Props): JSX.Element {
  return (
    <Link to="/settings" className="icon-btn home-settings-btn no-drag" title={title} aria-label={title}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M19.4 13.5a7.8 7.8 0 0 0 .1-3l2-1.2-2-3.5-2.3.7a7.9 7.9 0 0 0-2.6-1.5L14.5 2h-5L9.4 5a7.9 7.9 0 0 0-2.6 1.5l-2.3-.7-2 3.5 2 1.2a7.8 7.8 0 0 0 0 3l-2 1.2 2 3.5 2.3-.7a7.9 7.9 0 0 0 2.6 1.5L9.5 22h5l.5-3.5a7.9 7.9 0 0 0 2.6-1.5l2.3.7 2-3.5-2-1.2Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
