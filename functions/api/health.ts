import type { Env } from '../lib/env'
import { json, withCors } from '../lib/responses'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  return withCors(request, env, json({ ok: true, service: 'kraken-interview-api' }))
}
