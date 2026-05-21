import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('../..', import.meta.url)))

export const WIN_INSTALLER_FILENAME = 'KrakenInterview.exe'
export const MAC_INSTALLER_FILENAME = 'KrakenInterview.dmg'

export type DownloadAsset = {
  platform: 'win' | 'mac'
  label: string
  filename: string
  urlPath: string
  absolutePath: string
}

const WIN_SOURCE_NAMES = [
  /^KrakenInterview\.exe$/i,
  /^KrakenInterview(\sSetup.*)?\.exe$/i,
  /^KrakenInterview-Setup\.exe$/i
]
const MAC_SOURCE_NAMES = [/^KrakenInterview\.dmg$/i, /^KrakenInterview(\sSetup.*)?\.dmg$/i]

function searchDirs(): string[] {
  const dirs = [
    join(rootDir, 'website', 'public', 'downloads'),
    join(rootDir, 'electron-dist'),
    join(rootDir, 'build-output')
  ]

  try {
    for (const entry of readdirSync(rootDir)) {
      if (entry.startsWith('build-output')) {
        dirs.push(join(rootDir, entry))
      }
    }
  } catch {
    // ignore
  }

  return dirs
}

function findFile(dirs: string[], matchers: RegExp[]): string | undefined {
  for (const dir of dirs) {
    if (!existsSync(dir)) continue
    const entries = readdirSync(dir)
    for (const matcher of matchers) {
      const match = entries.find((name) => matcher.test(name))
      if (match) {
        const absolutePath = join(dir, match)
        if (statSync(absolutePath).isFile()) return absolutePath
      }
    }
  }
  return undefined
}

function findDownloadAssets(): DownloadAsset[] {
  const dirs = searchDirs()
  const assets: DownloadAsset[] = []

  const winPath = findFile(dirs, WIN_SOURCE_NAMES)
  if (winPath) {
    assets.push({
      platform: 'win',
      label: 'Download for Windows',
      filename: WIN_INSTALLER_FILENAME,
      urlPath: `/downloads/${encodeURIComponent(WIN_INSTALLER_FILENAME)}`,
      absolutePath: winPath
    })
  }

  const macPath = findFile(dirs, MAC_SOURCE_NAMES)
  if (macPath) {
    assets.push({
      platform: 'mac',
      label: 'Download for macOS',
      filename: MAC_INSTALLER_FILENAME,
      urlPath: `/downloads/${encodeURIComponent(MAC_INSTALLER_FILENAME)}`,
      absolutePath: macPath
    })
  }

  return assets
}

export function resolveDownloadAssets(apiBaseUrl: string): DownloadAsset[] {
  const base = apiBaseUrl.replace(/\/$/, '')
  return findDownloadAssets().map((asset) => ({
    ...asset,
    urlPath: `${base}${asset.urlPath}`
  }))
}

export function getDownloadByFilename(filename: string): DownloadAsset | undefined {
  const decoded = decodeURIComponent(filename)
  if (decoded !== WIN_INSTALLER_FILENAME && decoded !== MAC_INSTALLER_FILENAME) {
    return undefined
  }
  return findDownloadAssets().find((asset) => asset.filename === decoded)
}
