import type { Env } from '../lib/env'
import { json, withCors } from '../lib/responses'
import { resolveDownloadAssets } from '../lib/downloads'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const downloads = await resolveDownloadAssets(request, env)
  return withCors(request, env, json({ downloads }))
}
