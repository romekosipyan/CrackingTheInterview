type Props = {
  title: string
}

export default function ShellCloseButton({ title }: Props): JSX.Element {
  return (
    <button
      type="button"
      className="icon-btn shell-close-btn no-drag"
      title={title}
      aria-label={title}
      onClick={() => void window.api.shell.close()}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 6l12 12M18 6 6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
