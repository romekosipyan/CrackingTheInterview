import type { Env } from '../../lib/env'
import { deviceListResponse, loadRegisteredDevices } from '../../lib/devices'
import { corsPreflight, json, withCors } from '../../lib/responses'
import { isValidEmail } from '../../lib/stripeClient'

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

    const devices = await loadRegisteredDevices(env, email)
    return withCors(request, env, json(deviceListResponse(email, devices)))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load devices.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
