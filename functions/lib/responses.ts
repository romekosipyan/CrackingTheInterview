import type { Env } from './env'
import { websiteOrigin } from './env'

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function withCors(request: Request, env: Env, response: Response): Response {
  const origin = request.headers.get('Origin')
  const allowed = websiteOrigin(env)
  if (!origin || origin !== allowed) {
    return response
  }

  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', origin)
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Stripe-Signature')
  headers.set('Vary', 'Origin')
  return new Response(response.body, { status: response.status, headers })
}

export function corsPreflight(request: Request, env: Env): Response {
  return withCors(request, env, new Response(null, { status: 204 }))
}
