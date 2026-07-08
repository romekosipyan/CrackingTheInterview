import { config as loadEnv } from 'dotenv'
import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')
if (fs.existsSync(envPath)) {
  loadEnv({ path: envPath })
} else {
  loadEnv()
}
const AZURE_TIMESTAMP = 'http://timestamp.acs.microsoft.com'

export function resolveSigningCertificate() {
  const certPath = process.env.WIN_CSC_LINK || process.env.CSC_LINK
  const certPassword = process.env.WIN_CSC_KEY_PASSWORD || process.env.CSC_KEY_PASSWORD || ''
  return certPath ? { certPath, certPassword } : null
}

export function resolveAzureSigningMetadata({ strict = false } = {}) {
  const metadataPath =
    process.env.AZURE_ARTIFACT_SIGNING_METADATA || process.env.AZURE_SIGNING_METADATA
  if (!metadataPath) return null

  const resolved = path.isAbsolute(metadataPath)
    ? metadataPath
    : path.join(root, metadataPath)

  if (!fs.existsSync(resolved)) {
    const message = `[sign] Azure metadata not found: ${resolved}`
    if (strict) {
      console.error(message)
      process.exit(1)
    }
    console.warn(`${message} (skipping Azure signing)`)
    return null
  }

  let metadata
  try {
    metadata = JSON.parse(fs.readFileSync(resolved, 'utf8'))
  } catch (err) {
    console.error(`[sign] Invalid Azure metadata JSON: ${resolved}`, err)
    process.exit(1)
  }

  for (const key of ['Endpoint', 'CodeSigningAccountName', 'CertificateProfileName']) {
    if (!metadata[key]) {
      console.error(`[sign] Azure metadata missing "${key}" in ${resolved}`)
      process.exit(1)
    }
  }

  return { metadataPath: resolved, metadata }
}

/** @returns {'azure' | 'pfx' | null} */
export function resolveSigningMode() {
  if (resolveAzureSigningMetadata()) return 'azure'
  if (resolveSigningCertificate()) return 'pfx'
  return null
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

function findAzureDlib() {
  const override = process.env.AZURE_ARTIFACT_SIGNING_DLIB
  if (override && fs.existsSync(override)) return override

  const repoDlib = path.join(
    root,
    'tools',
    'artifact-signing',
    'Microsoft.ArtifactSigning.Client',
    'bin',
    'x64',
    'Azure.CodeSigning.Dlib.dll'
  )

  const candidates = [
    process.env.AZURE_ARTIFACT_SIGNING_DLIB,
    repoDlib,
    'C:\\Program Files\\Microsoft Azure Artifact Signing Client Tools\\x64\\Azure.CodeSigning.Dlib.dll',
    'C:\\Program Files (x86)\\Microsoft Azure Artifact Signing Client Tools\\x64\\Azure.CodeSigning.Dlib.dll'
  ].filter(Boolean)

  for (const candidate of candidates) {
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

function signFilePfx(signtool, certPath, certPassword, filePath) {
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
  const result = spawnSync(signtool, args, { stdio: 'inherit', shell: false })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function signFileAzure(signtool, dlib, metadataPath, filePath) {
  const args = [
    'sign',
    '/v',
    '/fd',
    'SHA256',
    '/tr',
    AZURE_TIMESTAMP,
    '/td',
    'SHA256',
    '/dlib',
    dlib,
    '/dmdf',
    metadataPath,
    filePath
  ]

  console.log(`[sign] ${path.basename(filePath)} (Azure Artifact Signing)`)
  const result = spawnSync(signtool, args, { stdio: 'inherit', shell: false })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

export function signWindowsTargets(targets) {
  const azure = resolveAzureSigningMetadata({ strict: true })
  const cert = azure ? null : resolveSigningCertificate()
  const mode = azure ? 'azure' : cert ? 'pfx' : null

  if (!mode) {
    console.log(
      '[sign] Skipping — set AZURE_ARTIFACT_SIGNING_METADATA (Azure) or WIN_CSC_LINK (.pfx).'
    )
    return false
  }

  const signtool = findSigntool()
  if (!signtool) {
    console.error(
      '[sign] signtool.exe not found. Install Windows SDK 10.0.2261.755+ or Visual Studio Build Tools.'
    )
    process.exit(1)
  }

  let dlib
  let metadataPath
  if (mode === 'azure') {
    dlib = findAzureDlib()
    if (!dlib) {
      console.error(
        '[sign] Azure.CodeSigning.Dlib.dll not found. Install: winget install -e --id Microsoft.Azure.ArtifactSigningClientTools',
        'Or set AZURE_ARTIFACT_SIGNING_DLIB.'
      )
      process.exit(1)
    }
    metadataPath = azure.metadataPath
    console.log('[sign] Using Azure Artifact Signing (run `az login` if signing fails).')
  } else if (!fs.existsSync(cert.certPath)) {
    console.error(`[sign] Certificate not found: ${cert.certPath}`)
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
      if (mode === 'azure') {
        signFileAzure(signtool, dlib, metadataPath, file)
      } else {
        signFilePfx(signtool, cert.certPath, cert.certPassword, file)
      }
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
