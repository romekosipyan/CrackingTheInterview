import { getFreeTrialStatus, consumeFreeTrialSession } from '../../lib/freeTrial'
import type { Env } from '../../lib/env'
import { corsPreflight, json, withCors } from '../../lib/responses'

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return corsPreflight(request, env)
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as {
      machineId?: string
      action?: string
      sessionMs?: number
    }
    const machineId = typeof body?.machineId === 'string' ? body.machineId.trim() : ''
    const action = typeof body?.action === 'string' ? body.action.trim() : 'status'

    if (!machineId) {
      return withCors(request, env, json({ error: 'Machine ID is required.' }, 400))
    }

    if (action === 'consume') {
      const sessionMs = typeof body?.sessionMs === 'number' ? body.sessionMs : 0
      const result = await consumeFreeTrialSession(env, machineId, sessionMs)
      return withCors(request, env, json(result))
    }

    if (action === 'status') {
      const result = await getFreeTrialStatus(env, machineId)
      return withCors(request, env, json(result))
    }

    return withCors(request, env, json({ error: 'Invalid action. Use "status" or "consume".' }, 400))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Free trial request failed.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
