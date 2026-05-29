import { syncFreeTrialUsage } from '../../lib/freeTrial'
import type { Env } from '../../lib/env'
import { json, withCors } from '../../lib/responses'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { machineId?: string; addMs?: number }
    const machineId = typeof body?.machineId === 'string' ? body.machineId.trim() : ''
    const addMs = typeof body?.addMs === 'number' ? body.addMs : 0
    if (!machineId) {
      return withCors(request, env, json({ error: 'Machine ID is required.' }, 400))
    }
    const status = await syncFreeTrialUsage(env, machineId, addMs)
    return withCors(request, env, json(status))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not sync free trial usage.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
