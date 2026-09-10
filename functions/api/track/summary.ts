import type { Env } from '../../lib/env'
import { eventsEnabled, summarizeEvents } from '../../lib/events'
import { json } from '../../lib/responses'

/**
 * GET /api/track/summary?days=7
 * Authorization: Bearer <EVENTS_READ_TOKEN>
 * Read-only rollup consumed by the weekly Metrics Scorecard agent.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.EVENTS_READ_TOKEN) {
    return json({ error: 'EVENTS_READ_TOKEN is not configured.' }, 503)
  }
  const auth = request.headers.get('Authorization') ?? ''
  const provided = auth.startsWith('Bearer ') ? auth.slice(7).trim() : new URL(request.url).searchParams.get('token')
  if (!provided || provided !== env.EVENTS_READ_TOKEN) {
    return json({ error: 'Unauthorized.' }, 401)
  }
  if (!eventsEnabled(env)) {
    return json({ error: 'EVENTS KV namespace is not bound.' }, 503)
  }

  const days = Number(new URL(request.url).searchParams.get('days') ?? '7')
  const summary = await summarizeEvents(env, days)
  return json(summary)
}
