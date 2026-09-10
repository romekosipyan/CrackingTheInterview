import type { Env } from '../lib/env'
import { recordEvent } from '../lib/events'
import { corsPreflight, withCors } from '../lib/responses'

const MAX_BODY_BYTES = 4096

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return corsPreflight(request, env)
}

/** Receives `trackEvent` payloads from website/src/lib/analytics.ts. Always 204 — never block the UI. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return withCors(request, env, new Response(null, { status: 204 }))
    }
    const body = JSON.parse(raw) as { event?: string; utm_source?: string; referrer?: string }
    if (typeof body?.event === 'string' && body.event) {
      const source = body.utm_source || referrerSource(body.referrer) || 'direct'
      await recordEvent(env, body.event, source)
    }
  } catch {
    // Malformed payloads are dropped silently by design.
  }
  return withCors(request, env, new Response(null, { status: 204 }))
}

function referrerSource(referrer: unknown): string | null {
  if (typeof referrer !== 'string' || !referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    if (!host || host.endsWith('krakeninterview.com')) return null
    return `ref-${host}`
  } catch {
    return null
  }
}
