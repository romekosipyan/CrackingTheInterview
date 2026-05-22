import type { Env } from '../../lib/env'
import { corsPreflight, json, withCors } from '../../lib/responses'
import { isValidEmail, stripeClient } from '../../lib/stripe'
import { cancelSubscription } from '../../lib/subscriptions'

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return corsPreflight(request, env)
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { email?: string; subscriptionId?: string }
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const subscriptionId =
      typeof body?.subscriptionId === 'string' ? body.subscriptionId.trim() : ''

    if (!isValidEmail(email)) {
      return withCors(request, env, json({ error: 'Enter a valid email address.' }, 400))
    }
    if (!subscriptionId) {
      return withCors(request, env, json({ error: 'Subscription ID is required.' }, 400))
    }

    const result = await cancelSubscription(stripeClient(env), email, subscriptionId)
    return withCors(request, env, json(result))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cancel failed.'
    return withCors(request, env, json({ error: message }, 400))
  }
}
