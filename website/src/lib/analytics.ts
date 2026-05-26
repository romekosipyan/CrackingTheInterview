import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>

const SESSION_KEY = 'ki_utm'

function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search)
  const utm: UtmParams = {}
  let found = false
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) {
      utm[key] = value
      found = true
    }
  }
  if (found) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(utm))
  }
}

export function getUtmParams(): UtmParams {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : {}
  } catch {
    return {}
  }
}

captureUtmParams()

// ---------------------------------------------------------------------------
// GA4
// ---------------------------------------------------------------------------

export const GA_MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function initGA(measurementId?: string): void {
  const id = measurementId ?? GA_MEASUREMENT_ID
  if (!id) return
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
}

// ---------------------------------------------------------------------------
// Event & page-view tracking
// ---------------------------------------------------------------------------

const TRACK_ENDPOINT = '/api/track'

export function trackEvent(name: string, properties?: Record<string, string>): void {
  const payload = {
    event: name,
    ...getUtmParams(),
    path: window.location.pathname,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    ...properties
  }

  if (import.meta.env.DEV) {
    console.log('[analytics] event', payload)
    return
  }

  if (window.gtag) {
    window.gtag('event', name, payload)
  }

  fetch(TRACK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {})
}

export function trackPageView(path?: string): void {
  const pagePath = path ?? window.location.pathname
  trackEvent('page_view', { page_path: pagePath })

  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: pagePath })
  }
}

// ---------------------------------------------------------------------------
// React hook — auto-tracks page views on route changes
// ---------------------------------------------------------------------------

export function usePageTracking(): void {
  const location = useLocation()
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname
      trackPageView(location.pathname + location.search)
    }
  }, [location])
}
