import { useEffect, useState } from 'react'

const PHRASES = ['coding rounds', 'system design', 'behavioral interviews', 'every platform'] as const

export default function RotatingText(): JSX.Element {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible(false)
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % PHRASES.length)
        setVisible(true)
      }, 320)
    }, 3200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <span className={`hero-rotating-text${visible ? ' hero-rotating-text--visible' : ''}`}>
      {PHRASES[index]}
    </span>
  )
}
