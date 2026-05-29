import type { Env } from './env'
import { publicOrigin } from './env'
import { MAC_INSTALLER_FILENAME, WIN_INSTALLER_FILENAME } from './downloads'
import { APP_VERSION_MANIFEST } from '../../shared/appVersionManifest'
import type { AppVersionManifest } from '../../shared/appVersion'

async function objectExists(bucket: R2Bucket, key: string): Promise<boolean> {
  const head = await bucket.head(key)
  return head !== null
}

function buildDownloadUrl(base: string, filename: string): string {
  return `${base}/downloads/${encodeURIComponent(filename)}`
}

export async function resolveAppVersion(request: Request, env: Env): Promise<AppVersionManifest> {
  const base = publicOrigin(request)
  const version = env.APP_LATEST_VERSION?.trim() || APP_VERSION_MANIFEST.version

  const [winExists, macExists] = await Promise.all([
    objectExists(env.INSTALLERS, WIN_INSTALLER_FILENAME),
    objectExists(env.INSTALLERS, MAC_INSTALLER_FILENAME)
  ])

  return {
    version,
    winUrl: winExists ? buildDownloadUrl(base, WIN_INSTALLER_FILENAME) : null,
    macUrl: macExists ? buildDownloadUrl(base, MAC_INSTALLER_FILENAME) : null
  }
}
