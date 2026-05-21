import { useCallback, useEffect, useRef } from 'react'
import DemoVideoPanel from './DemoVideoPanel'
import { DEMO_VIDEOS } from '../../content/landing'

const DEMOS = [
  {
    title: 'You, screensharing',
    subtitle: 'Your view — capture, answers, and overlays stay on your side.',
    src: DEMO_VIDEOS.youScreensharing,
    accent: 'cyan' as const
  },
  {
    title: 'What the interviewer sees',
    subtitle: 'Their view — clean shared screen with no overlay or suspicious windows.',
    src: DEMO_VIDEOS.interviewerView,
    accent: 'violet' as const
  }
]

export default function SyncedDemoGrid(): JSX.Element {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const shorterIndexRef = useRef<number | null>(null)
  const startedRef = useRef(false)

  const restartBoth = useCallback(async () => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[]
    if (videos.length !== DEMOS.length) return

    for (const video of videos) {
      video.pause()
      video.currentTime = 0
    }

    try {
      await Promise.all(videos.map((video) => video.play()))
    } catch {
      // Autoplay can be blocked until user interaction in some browsers.
    }
  }, [])

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[]
    if (videos.length !== DEMOS.length) return

    const metadataReady = new Set<number>()
    let shorterListenerAttached = false

    const attachShorterListener = (): void => {
      if (shorterListenerAttached) return

      const durations = videos.map((video) => video.duration).filter(Number.isFinite)
      if (durations.length !== videos.length) return

      const shorterIndex = durations[0] <= durations[1] ? 0 : 1
      shorterIndexRef.current = shorterIndex
      videos[shorterIndex].addEventListener('ended', onShorterEnded)
      shorterListenerAttached = true
    }

    const onShorterEnded = (): void => {
      void restartBoth()
    }

    const onMetadata = (index: number): void => {
      if (metadataReady.has(index)) return
      metadataReady.add(index)
      if (metadataReady.size < videos.length) return
      attachShorterListener()
      if (!startedRef.current) {
        startedRef.current = true
        void restartBoth()
      }
    }

    const handlers = videos.map((video, index) => {
      const handler = (): void => onMetadata(index)
      video.addEventListener('loadedmetadata', handler)
      if (video.readyState >= 1) handler()
      return { video, handler }
    })

    return () => {
      for (const { video, handler } of handlers) {
        video.removeEventListener('loadedmetadata', handler)
      }
      const shorterIndex = shorterIndexRef.current
      if (shorterIndex !== null) {
        videos[shorterIndex]?.removeEventListener('ended', onShorterEnded)
      }
    }
  }, [restartBoth])

  return (
    <div className="demo-grid">
      {DEMOS.map((demo, index) => (
        <DemoVideoPanel
          key={demo.title}
          ref={(element) => {
            videoRefs.current[index] = element
          }}
          title={demo.title}
          subtitle={demo.subtitle}
          src={demo.src}
          accent={demo.accent}
        />
      ))}
    </div>
  )
}
