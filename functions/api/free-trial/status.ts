import { getFreeTrialStatus } from '../../lib/freeTrial'
import type { Env } from '../../lib/env'
import { json, withCors } from '../../lib/responses'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { machineId?: string }
    const machineId = typeof body?.machineId === 'string' ? body.machineId.trim() : ''
    if (!machineId) {
      return withCors(request, env, json({ error: 'Machine ID is required.' }, 400))
    }
    const status = await getFreeTrialStatus(env, machineId)
    return withCors(request, env, json(status))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load free trial status.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
