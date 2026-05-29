export type AppVersionManifest = {
  version: string
  winUrl: string | null
  macUrl: string | null
}

export type AppUpdateCheckResult =
  | { status: 'up-to-date'; currentVersion: string; latestVersion: string }
  | {
      status: 'update-available'
      currentVersion: string
      latestVersion: string
      downloadUrl: string
    }
  | { status: 'error'; currentVersion: string; message: string }

export type AppUpdateDownloadResult =
  | { ok: true; installerPath: string; latestVersion: string }
  | { ok: false; error: string }

export type AppUpdateInstallResult = { ok: true } | { ok: false; error: string }

export function compareSemver(a: string, b: string): -1 | 0 | 1 {
  const parse = (value: string): number[] =>
    value.split('.').map((part) => {
      const parsed = Number.parseInt(part, 10)
      return Number.isNaN(parsed) ? 0 : parsed
    })

  const left = parse(a)
  const right = parse(b)
  const length = Math.max(left.length, right.length, 3)

  for (let index = 0; index < length; index += 1) {
    const lv = left[index] ?? 0
    const rv = right[index] ?? 0
    if (lv > rv) return 1
    if (lv < rv) return -1
  }

  return 0
}

export function isNewerVersion(latest: string, current: string): boolean {
  return compareSemver(latest, current) > 0
}
