import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveSigningCertificate, signWindowsTargets } from './sign-windows.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultOutput = 'electron-dist'
const tempConfigPath = path.join(root, '.electron-builder.pack.json')

function run(command) {
  try {
    execSync(command, { cwd: root, stdio: 'ignore', shell: true })
  } catch {
    // Best effort only.
  }
}

function killPackagedApp() {
  run('taskkill /F /IM "Kraken Interview.exe"')
  run('taskkill /F /IM KrakenInterview.exe')
}

function tryRemoveDir(dirPath) {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 })
    return true
  } catch {
    return false
  }
}

function prepareOutputDir() {
  killPackagedApp()

  const outputDir = path.join(root, defaultOutput)
  if (tryRemoveDir(outputDir)) {
    return defaultOutput
  }

  const fallback = `build-output-${Date.now()}`
  console.warn(
    `[pack] Could not delete "${defaultOutput}" (app.asar is locked).`,
    'Close any running Kraken Interview.exe and Explorer windows in that folder.',
    `Using "${fallback}" instead.`
  )
  return fallback
}

function writeTempConfig(output) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const config = {
    ...pkg.build,
    directories: {
      ...pkg.build.directories,
      output
    }
  }
  fs.writeFileSync(tempConfigPath, JSON.stringify(config, null, 2))
}

function cleanupTempConfig() {
  try {
    fs.unlinkSync(tempConfigPath)
  } catch {
    // ignore
  }
}

function syncWindowsIconAssets() {
  const logoSource = path.join(root, 'src', 'renderer', 'src', 'assets', 'logo.png')
  const iconTarget = path.join(root, 'resources', 'icon.png')
  if (fs.existsSync(logoSource)) {
    fs.copyFileSync(logoSource, iconTarget)
    console.log('[pack] Synced dragon logo to resources/icon.png')
  }
  execSync('node scripts/generate-icon.mjs', { cwd: root, stdio: 'inherit' })
}

function runElectronBuilder(args) {
  const env = { ...process.env }
  if (!resolveSigningCertificate()) {
    // Avoid slow/noisy macOS cert lookup when no Windows cert is configured.
    env.CSC_IDENTITY_AUTO_DISCOVERY = 'false'
  }

  return spawnSync('npx', ['electron-builder', '--config', tempConfigPath, ...args], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env
  })
}

const mode = process.argv.includes('--installer') ? 'installer' : 'dir'
const output = prepareOutputDir()

if (process.platform === 'win32') {
  syncWindowsIconAssets()
}

writeTempConfig(output)

let exitCode = 0

if (process.platform === 'win32') {
  // Step 1: unpack app only (signAndEditExecutable is off, so icon must be patched manually).
  console.log('[pack] Building unpacked Windows app…')
  const dirResult = runElectronBuilder(['--dir'])
  if (dirResult.status !== 0) {
    cleanupTempConfig()
    process.exit(dirResult.status ?? 1)
  }

  // Step 2: embed dragon icon into the app exe BEFORE creating the NSIS installer.
  execSync(`node scripts/apply-win-icon.mjs ${output}`, { cwd: root, stdio: 'inherit' })

  const prepackaged = path.join(root, output, 'win-unpacked')
  // Step 3: sign unpacked binaries after icon patching (patching invalidates signatures).
  signWindowsTargets([prepackaged])

  if (mode === 'installer') {
    console.log('[pack] Building NSIS installer from patched app…')
    const installerResult = runElectronBuilder(['--win', 'nsis', '--prepackaged', prepackaged])
    exitCode = installerResult.status ?? 1

    if (exitCode === 0) {
      const installerPath = path.join(root, output, 'KrakenInterview.exe')
      signWindowsTargets([installerPath])
    }
  }
} else {
  const builderArgs = mode === 'dir' ? ['--dir'] : []
  const result = runElectronBuilder(builderArgs)
  exitCode = result.status ?? 1
}

cleanupTempConfig()
process.exit(exitCode)
