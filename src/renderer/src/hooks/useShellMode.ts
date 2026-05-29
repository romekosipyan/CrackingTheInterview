import { useEffect } from 'react'

export function useShellMode(enabled = true): void {
  useEffect(() => {
    if (!enabled) return undefined

    document.documentElement.classList.add('shell-mode')
    document.body.classList.remove('interview-mode')
    document.documentElement.classList.remove('interview-mode')
    document.body.classList.add('shell-mode')

    return () => {
      document.documentElement.classList.remove('shell-mode')
      document.body.classList.remove('shell-mode')
    }
  }, [enabled])
}
