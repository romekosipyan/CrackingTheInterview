import type { Env } from '../../lib/env'
import { activateSubscriptionDevice } from '../../lib/activation'
import { corsPreflight, json, withCors } from '../../lib/responses'

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return corsPreflight(request, env)
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as {
      email?: string
      machineId?: string
      machineName?: string
    }
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const machineId = typeof body?.machineId === 'string' ? body.machineId.trim() : ''
    const machineName = typeof body?.machineName === 'string' ? body.machineName.trim() : 'Unknown device'

    if (!email) {
      return withCors(request, env, json({ error: 'Email is required.' }, 400))
    }
    if (!machineId) {
      return withCors(request, env, json({ error: 'Machine ID is required.' }, 400))
    }

    const result = await activateSubscriptionDevice(env, email, machineId, machineName)
    const status = result.allowed ? 200 : 403
    return withCors(request, env, json(result, status))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Activation failed.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
