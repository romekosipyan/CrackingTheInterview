import type { Env } from '../../lib/env'
import { resolveAppVersion } from '../../lib/appVersion'
import { json, withCors } from '../../lib/responses'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const version = await resolveAppVersion(request, env)
  return withCors(request, env, json(version))
}
