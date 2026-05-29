import { app, shell } from 'electron'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type {
  AppUpdateCheckResult,
  AppUpdateDownloadResult,
  AppUpdateInstallResult,
  AppVersionManifest
} from '../../shared/appVersion'
import { isNewerVersion } from '../../shared/appVersion'
import { getApiBaseUrl } from './subscriptionClient'

const WIN_INSTALLER_FILENAME = 'KrakenInterview.exe'
const MAC_INSTALLER_FILENAME = 'KrakenInterview.dmg'

let pendingDownloadUrl: string | null = null
let pendingLatestVersion: string | null = null
let downloadedInstallerPath: string | null = null

export function getLocalAppVersion(): string {
  return app.getVersion()
}

async function fetchLatestVersionManifest(): Promise<AppVersionManifest> {
  const response = await fetch(`${getApiBaseUrl()}/api/app/version`)
  if (!response.ok) {
    throw new Error('Could not reach the update server. Check your connection and try again.')
  }

  const data = (await response.json()) as AppVersionManifest & { error?: string }
  if (typeof data.version !== 'string' || !data.version.trim()) {
    throw new Error(data.error ?? 'Update server returned an invalid version.')
  }

  return {
    version: data.version.trim(),
    winUrl: typeof data.winUrl === 'string' ? data.winUrl : null,
    macUrl: typeof data.macUrl === 'string' ? data.macUrl : null
  }
}

function resolvePlatformDownloadUrl(manifest: AppVersionManifest): string | null {
  if (process.platform === 'darwin') {
    return manifest.macUrl
  }
  if (process.platform === 'win32') {
    return manifest.winUrl
  }
  return manifest.winUrl ?? manifest.macUrl
}

export async function checkForAppUpdates(): Promise<AppUpdateCheckResult> {
  const currentVersion = getLocalAppVersion()

  try {
    const manifest = await fetchLatestVersionManifest()
    const downloadUrl = resolvePlatformDownloadUrl(manifest)

    if (!isNewerVersion(manifest.version, currentVersion)) {
      pendingDownloadUrl = null
      pendingLatestVersion = null
      return {
        status: 'up-to-date',
        currentVersion,
        latestVersion: manifest.version
      }
    }

    if (!downloadUrl) {
      return {
        status: 'error',
        currentVersion,
        message: 'A newer version is available, but no installer was found for this platform.'
      }
    }

    pendingDownloadUrl = downloadUrl
    pendingLatestVersion = manifest.version
    downloadedInstallerPath = null

    return {
      status: 'update-available',
      currentVersion,
      latestVersion: manifest.version,
      downloadUrl
    }
  } catch (error) {
    pendingDownloadUrl = null
    pendingLatestVersion = null
    return {
      status: 'error',
      currentVersion,
      message: error instanceof Error ? error.message : 'Update check failed.'
    }
  }
}

export async function downloadAppUpdate(downloadUrl?: string): Promise<AppUpdateDownloadResult> {
  const url = downloadUrl ?? pendingDownloadUrl
  const latestVersion = pendingLatestVersion

  if (!url || !latestVersion) {
    return { ok: false, error: 'Check for updates before downloading.' }
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { ok: false, error: 'Download failed. The installer may not be available yet.' }
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const filename =
      process.platform === 'darwin' ? MAC_INSTALLER_FILENAME : WIN_INSTALLER_FILENAME
    const installerPath = path.join(os.tmpdir(), filename)
    fs.writeFileSync(installerPath, buffer)
    downloadedInstallerPath = installerPath

    return { ok: true, installerPath, latestVersion }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Download failed.'
    }
  }
}

export async function installAppUpdate(installerPath?: string): Promise<AppUpdateInstallResult> {
  const target = installerPath ?? downloadedInstallerPath
  if (!target || !fs.existsSync(target)) {
    return { ok: false, error: 'Installer not found. Download the update first.' }
  }

  const errorMessage = await shell.openPath(target)
  if (errorMessage) {
    return { ok: false, error: errorMessage }
  }

  return { ok: true }
}
