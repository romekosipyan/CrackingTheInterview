import type { Env } from './env'
import { publicOrigin } from './env'

export const WIN_INSTALLER_FILENAME = 'KrakenInterview.exe'
export const MAC_INSTALLER_FILENAME = 'KrakenInterview.dmg'

export type DownloadInfo = {
  platform: 'win' | 'mac'
  label: string
  filename: string
  url: string
}

const INSTALLERS = [
  {
    platform: 'win' as const,
    label: 'Download for Windows',
    filename: WIN_INSTALLER_FILENAME
  },
  {
    platform: 'mac' as const,
    label: 'Download for macOS',
    filename: MAC_INSTALLER_FILENAME
  }
]

async function objectExists(bucket: R2Bucket, key: string): Promise<boolean> {
  const head = await bucket.head(key)
  return head !== null
}

export async function resolveDownloadAssets(
  request: Request,
  env: Env
): Promise<DownloadInfo[]> {
  const base = publicOrigin(request)
  const downloads: DownloadInfo[] = []

  for (const installer of INSTALLERS) {
    const exists = await objectExists(env.INSTALLERS, installer.filename)
    if (!exists) continue

    downloads.push({
      platform: installer.platform,
      label: installer.label,
      filename: installer.filename,
      url: `${base}/downloads/${encodeURIComponent(installer.filename)}`
    })
  }

  return downloads
}

export function isAllowedDownloadFilename(filename: string): boolean {
  const decoded = decodeURIComponent(filename)
  return decoded === WIN_INSTALLER_FILENAME || decoded === MAC_INSTALLER_FILENAME
}
