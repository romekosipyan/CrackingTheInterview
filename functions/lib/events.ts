import type { Env } from './env'

/**
 * Lightweight first-party marketing counters stored in the optional EVENTS KV namespace.
 * Key layout: `ev:<YYYY-MM-DD>:<event>:<source>` → integer count as string.
 * Counters are best-effort (non-atomic read/modify/write); they exist to show channel
 * direction for the weekly scorecard, not to replace GA4/Stripe as the source of truth.
 */

const KEY_PREFIX = 'ev:'
const TTL_SECONDS = 400 * 24 * 60 * 60
const MAX_TOKEN_LENGTH = 40

export function sanitizeToken(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, MAX_TOKEN_LENGTH)
  return cleaned || fallback
}

export function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function eventsEnabled(env: Env): boolean {
  return Boolean(env.EVENTS)
}

export async function recordEvent(
  env: Env,
  event: string,
  source: string = 'direct',
  date = new Date()
): Promise<void> {
  if (!env.EVENTS) return
  const key = `${KEY_PREFIX}${dayKey(date)}:${sanitizeToken(event, 'unknown')}:${sanitizeToken(source, 'direct')}`
  try {
    const current = Number((await env.EVENTS.get(key)) ?? '0') || 0
    await env.EVENTS.put(key, String(current + 1), { expirationTtl: TTL_SECONDS })
  } catch (error) {
    console.warn('[events] failed to record', key, error)
  }
}

export interface EventSummary {
  from: string
  to: string
  days: number
  /** event → total */
  totals: Record<string, number>
  /** event → source → total */
  bySource: Record<string, Record<string, number>>
  /** day → event → total */
  byDay: Record<string, Record<string, number>>
}

export async function summarizeEvents(env: Env, days: number, until = new Date()): Promise<EventSummary> {
  const span = Math.min(Math.max(Math.floor(days) || 7, 1), 90)
  const summary: EventSummary = { from: '', to: dayKey(until), days: span, totals: {}, bySource: {}, byDay: {} }
  if (!env.EVENTS) return summary

  for (let offset = span - 1; offset >= 0; offset--) {
    const date = new Date(until.getTime() - offset * 24 * 60 * 60 * 1000)
    const day = dayKey(date)
    if (!summary.from) summary.from = day
    summary.byDay[day] = {}

    const prefix = `${KEY_PREFIX}${day}:`
    let cursor: string | undefined
    do {
      const page = await env.EVENTS.list({ prefix, cursor })
      for (const { name } of page.keys) {
        const [, , event, source] = name.split(':')
        if (!event) continue
        const count = Number((await env.EVENTS.get(name)) ?? '0') || 0
        summary.totals[event] = (summary.totals[event] ?? 0) + count
        summary.byDay[day][event] = (summary.byDay[day][event] ?? 0) + count
        summary.bySource[event] ??= {}
        summary.bySource[event][source ?? 'direct'] = (summary.bySource[event][source ?? 'direct'] ?? 0) + count
      }
      cursor = page.list_complete ? undefined : page.cursor
    } while (cursor)
  }

  return summary
}
