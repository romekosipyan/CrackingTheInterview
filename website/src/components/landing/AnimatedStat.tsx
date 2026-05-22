import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'

type Props = {
  value: string
  label: string
}

function parseStatValue(raw: string): { prefix: string; number: number; suffix: string } | null {
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] }
}

export default function AnimatedStat({ value, label }: Props): JSX.Element {
  const [ref, inView] = useInView({ threshold: 0.5 })
  const parsed = useMemo(() => parseStatValue(value), [value])
  const hasAnimated = useRef(false)
  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.prefix}0${parsed.suffix}` : value
  )

  useEffect(() => {
    if (!inView || !parsed || hasAnimated.current) return
    hasAnimated.current = true

    const { prefix, number, suffix } = parsed
    const duration = 1200
    const start = performance.now()
    let frameId = 0

    const tick = (now: number): void => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const current = Math.round(number * eased)
      setDisplay(`${prefix}${current}${suffix}`)
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      } else {
        setDisplay(value)
      }
    }

    setDisplay(`${prefix}0${suffix}`)
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [inView, parsed, value])

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="hero-stat">
      <strong>{display}</strong>
      <span>{label}</span>
    </div>
  )
}
