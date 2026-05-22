import type { Env } from '../../lib/env'
import { corsPreflight, json, withCors } from '../../lib/responses'
import { isValidEmail, stripeClient } from '../../lib/stripeClient'
import { lookupSubscriptionsByEmail } from '../../lib/subscriptions'

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return corsPreflight(request, env)
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { email?: string }
    const email = typeof body?.email === 'string' ? body.email.trim() : ''

    if (!isValidEmail(email)) {
      return withCors(request, env, json({ error: 'Enter a valid email address.' }, 400))
    }

    const result = await lookupSubscriptionsByEmail(env, stripeClient(env), email)
    return withCors(request, env, json(result))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Lookup failed.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
