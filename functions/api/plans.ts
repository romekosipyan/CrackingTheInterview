import type { Env } from '../lib/env'
import { json, withCors } from '../lib/responses'
import { SUBSCRIPTION_PLANS } from '../../shared/subscriptionPlans'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  return withCors(request, env, json({ plans: SUBSCRIPTION_PLANS }))
}
