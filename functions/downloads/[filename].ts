import type { Env } from '../lib/env'
import { isAllowedDownloadFilename } from '../lib/downloads'

export const onRequestGet: PagesFunction<Env, 'filename'> = async ({ env, params }) => {
  const filename = decodeURIComponent(params.filename ?? '')

  if (!isAllowedDownloadFilename(filename)) {
    return Response.json(
      { error: 'Installer not found. Upload KrakenInterview.exe to the R2 bucket.' },
      { status: 404 }
    )
  }

  const object = await env.INSTALLERS.get(filename)
  if (!object) {
    return Response.json(
      { error: 'Installer not found. Upload KrakenInterview.exe to the R2 bucket.' },
      { status: 404 }
    )
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('Content-Type', 'application/octet-stream')
  headers.set('Content-Disposition', `attachment; filename="${filename}"`)
  headers.set('Cache-Control', 'public, max-age=3600')

  return new Response(object.body, { headers })
}
