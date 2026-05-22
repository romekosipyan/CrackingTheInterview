import type { Env } from '../../lib/env'
import { deviceListResponse, removeRegisteredDevice } from '../../lib/devices'
import { corsPreflight, json, withCors } from '../../lib/responses'
import { isValidEmail } from '../../lib/stripeClient'

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return corsPreflight(request, env)
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { email?: string; machineId?: string }
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const machineId = typeof body?.machineId === 'string' ? body.machineId.trim() : ''

    if (!isValidEmail(email)) {
      return withCors(request, env, json({ error: 'Enter a valid email address.' }, 400))
    }
    if (!machineId) {
      return withCors(request, env, json({ error: 'Machine ID is required.' }, 400))
    }

    const result = await removeRegisteredDevice(env, email, machineId)
    if (!result.removed) {
      return withCors(request, env, json({ error: 'Device not found for this email.' }, 404))
    }

    return withCors(request, env, json(deviceListResponse(email, result.devices)))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not remove device.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
