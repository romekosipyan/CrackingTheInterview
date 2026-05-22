import { useEffect, useRef } from 'react'

type Column = {
  y: number
  speed: number
}

const BINARY = ['0', '1']
const FONT_SIZE = 13

export default function HeroParticles(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frameId = 0
    let columns: Column[] = []

    const resize = (): void => {
      const { width, height } = container.getBoundingClientRect()
      if (width <= 0 || height <= 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const columnCount = Math.ceil(width / FONT_SIZE)
      columns = Array.from({ length: columnCount }, (_, index) => ({
        y: Math.random() * (height / FONT_SIZE),
        speed: 0.35 + Math.random() * 0.65 + (index % 4) * 0.12
      }))
    }

    const draw = (): void => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      ctx.fillStyle = 'rgba(7, 9, 15, 0.14)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE}px "Cascadia Code", Consolas, monospace`

      for (let index = 0; index < columns.length; index++) {
        const column = columns[index]
        const x = index * FONT_SIZE
        const y = column.y * FONT_SIZE
        const head = BINARY[Math.floor(Math.random() * BINARY.length)]

        ctx.fillStyle = index % 7 === 0 ? 'rgba(110, 231, 183, 0.95)' : 'rgba(125, 211, 252, 0.88)'
        ctx.fillText(head, x, y)

        ctx.fillStyle = 'rgba(124, 92, 255, 0.35)'
        ctx.fillText(BINARY[(index + Math.floor(column.y)) % 2], x, y - FONT_SIZE)

        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)'
        ctx.fillText(BINARY[(index + 1) % 2], x, y - FONT_SIZE * 2)

        if (y > height + FONT_SIZE * 2 && Math.random() > 0.985) {
          column.y = -Math.random() * 12
        } else {
          column.y += column.speed
        }
      }

      frameId = requestAnimationFrame(draw)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    frameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="hero-matrix-rain" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
