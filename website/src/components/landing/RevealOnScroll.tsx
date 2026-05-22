import type { ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  displayContents?: boolean
}

export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  displayContents = false
}: Props): JSX.Element {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-on-scroll${inView ? ' reveal-on-scroll--visible' : ''}${displayContents ? ' reveal-on-scroll--contents' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
