import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function resolveSigningCertificate() {
  const certPath = process.env.WIN_CSC_LINK || process.env.CSC_LINK
  const certPassword = process.env.WIN_CSC_KEY_PASSWORD || process.env.CSC_KEY_PASSWORD || ''
  return certPath ? { certPath, certPassword } : null
}

function findSigntool() {
  try {
    const result = execSync('where signtool', { encoding: 'utf8', shell: true }).trim()
    const first = result.split(/\r?\n/).find(Boolean)
    if (first) return first
  } catch {
    // Fall through to Windows Kits search.
  }

  const kitsRoot = 'C:\\Program Files (x86)\\Windows Kits\\10\\bin'
  if (!fs.existsSync(kitsRoot)) return null

  const versions = fs
    .readdirSync(kitsRoot)
    .filter((entry) => /^10\./.test(entry))
    .sort()
    .reverse()

  for (const version of versions) {
    const candidate = path.join(kitsRoot, version, 'x64', 'signtool.exe')
    if (fs.existsSync(candidate)) return candidate
  }

  return null
}

function collectSignableFiles(dir) {
  const files = []

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
        continue
      }
      if (/\.(exe|dll)$/i.test(entry.name)) {
        files.push(fullPath)
      }
    }
  }

  walk(dir)
  return files
}

function signFile(signtool, certPath, certPassword, filePath) {
  const args = [
    'sign',
    '/fd',
    'SHA256',
    '/f',
    certPath,
    '/tr',
    'http://timestamp.digicert.com',
    '/td',
    'SHA256',
    '/d',
    'Kraken Interview',
    '/du',
    'https://krakeninterview.com'
  ]

  if (certPassword) {
    args.push('/p', certPassword)
  }

  args.push(filePath)

  console.log(`[sign] ${path.basename(filePath)}`)
  const result = spawnSync(signtool, args, { stdio: 'inherit' })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

export function signWindowsTargets(targets) {
  const cert = resolveSigningCertificate()
  if (!cert) {
    console.log(
      '[sign] Skipping — set WIN_CSC_LINK (path to .pfx) to enable Authenticode signing.'
    )
    return false
  }

  if (!fs.existsSync(cert.certPath)) {
    console.error(`[sign] Certificate not found: ${cert.certPath}`)
    process.exit(1)
  }

  const signtool = findSigntool()
  if (!signtool) {
    console.error(
      '[sign] signtool.exe not found. Install the Windows SDK or Visual Studio Build Tools.'
    )
    process.exit(1)
  }

  for (const target of targets) {
    const resolved = path.resolve(target)
    if (!fs.existsSync(resolved)) {
      console.warn(`[sign] Target not found: ${resolved}`)
      continue
    }

    const stat = fs.statSync(resolved)
    const files = stat.isDirectory() ? collectSignableFiles(resolved) : [resolved]
    for (const file of files) {
      signFile(signtool, cert.certPath, cert.certPassword, file)
    }
  }

  console.log('[sign] Authenticode signing complete.')
  return true
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const targets = process.argv.slice(2)
  if (targets.length === 0) {
    console.error('Usage: node scripts/sign-windows.mjs <file-or-directory> [...]')
    process.exit(1)
  }
  signWindowsTargets(targets)
}
