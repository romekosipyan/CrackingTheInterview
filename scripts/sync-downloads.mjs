import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const destDir = path.join(root, 'website', 'public', 'downloads')

const WIN_DEST = 'KrakenInterview.exe'
const MAC_DEST = 'KrakenInterview.dmg'

const sourceDirs = [
  path.join(root, 'electron-dist'),
  path.join(root, 'build-output')
]

for (const entry of fs.readdirSync(root)) {
  if (entry.startsWith('build-output')) {
    sourceDirs.push(path.join(root, entry))
  }
}

const winPattern = /KrakenInterview(\sSetup.*)?\.exe$/i
const macPattern = /KrakenInterview.*\.dmg$/i

function findFile(dirs, pattern) {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue
    const match = fs.readdirSync(dir).find((name) => pattern.test(name))
    if (match) return path.join(dir, match)
  }
  return undefined
}

fs.mkdirSync(destDir, { recursive: true })

for (const legacy of ['KrakenInterview-Setup.exe', 'KrakenInterview Setup 0.1.0.exe']) {
  const legacyPath = path.join(destDir, legacy)
  if (fs.existsSync(legacyPath)) fs.unlinkSync(legacyPath)
}

const winSrc = findFile(sourceDirs, winPattern)
const macSrc = findFile(sourceDirs, macPattern)

if (winSrc) {
  const dest = path.join(destDir, WIN_DEST)
  fs.copyFileSync(winSrc, dest)
  console.info(`Copied Windows installer -> ${dest}`)
} else {
  console.warn('Windows installer not found. Run npm run dist first.')
}

if (macSrc) {
  const dest = path.join(destDir, MAC_DEST)
  fs.copyFileSync(macSrc, dest)
  console.info(`Copied macOS installer -> ${dest}`)
} else {
  console.warn('macOS installer not found (expected on macOS builds).')
}
