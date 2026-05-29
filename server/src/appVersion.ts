import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { AppVersionManifest } from '../../shared/appVersion.js'
import { APP_VERSION_MANIFEST } from '../../shared/appVersionManifest.js'
import {
  MAC_INSTALLER_FILENAME,
  WIN_INSTALLER_FILENAME,
  resolveDownloadAssets
} from './downloads.js'

const rootDir = resolve(fileURLToPath(new URL('../..', import.meta.url)))

function readManifestVersion(): string {
  const manifestPath = join(rootDir, 'shared', 'app-version.json')
  if (!existsSync(manifestPath)) {
    return APP_VERSION_MANIFEST.version
  }

  try {
    const parsed = JSON.parse(readFileSync(manifestPath, 'utf8')) as { version?: string }
    return parsed.version?.trim() || APP_VERSION_MANIFEST.version
  } catch {
    return APP_VERSION_MANIFEST.version
  }
}

export function resolveAppVersion(apiBaseUrl: string): AppVersionManifest {
  const downloads = resolveDownloadAssets(apiBaseUrl)
  const win = downloads.find((asset) => asset.filename === WIN_INSTALLER_FILENAME)
  const mac = downloads.find((asset) => asset.filename === MAC_INSTALLER_FILENAME)

  return {
    version: readManifestVersion(),
    winUrl: win?.urlPath ?? null,
    macUrl: mac?.urlPath ?? null
  }
}
