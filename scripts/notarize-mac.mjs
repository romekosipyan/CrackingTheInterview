import { config as loadEnv } from 'dotenv'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
loadEnv({ path: path.join(root, '.env') })

const appPath = path.join(root, 'electron-dist', 'mac', 'Kraken Interview.app')
const dmgPath = path.join(root, 'electron-dist', 'KrakenInterview.dmg')
const identity = 'Developer ID Application: Roman Osipyan (4P672G3WS8)'

function findNotarytool() {
  const result = spawnSync('xcrun', ['--find', 'notarytool'], { encoding: 'utf8' })
  if (result.status === 0) return result.stdout.trim()
  return null
}

function notarizeAndStaple(target) {
  const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID } = process.env
  if (!APPLE_ID || !APPLE_APP_SPECIFIC_PASSWORD || !APPLE_TEAM_ID) {
    console.error('[notarize] Missing APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, or APPLE_TEAM_ID in .env')
    process.exit(1)
  }

  const notarytool = findNotarytool()
  if (!notarytool) {
    console.error('[notarize] notarytool not found. Install Xcode Command Line Tools:')
    console.error('  xcode-select --install')
    process.exit(1)
  }

  let submitPath = target
  let staplePath = target
  let zipPath

  if (target.endsWith('.app')) {
    zipPath = path.join(path.dirname(target), `${path.basename(target, '.app')}.zip`)
    console.log(`[notarize] Zipping ${path.basename(target)}…`)
    fs.rmSync(zipPath, { force: true })
    const zip = spawnSync('ditto', ['-c', '-k', '--keepParent', target, zipPath], { stdio: 'inherit' })
    if (zip.status !== 0) process.exit(zip.status ?? 1)
    submitPath = zipPath
  }

  console.log(`[notarize] Submitting ${path.basename(submitPath)}…`)
  const submit = spawnSync(
    'xcrun',
    [
      'notarytool',
      'submit',
      submitPath,
      '--apple-id',
      APPLE_ID,
      '--password',
      APPLE_APP_SPECIFIC_PASSWORD,
      '--team-id',
      APPLE_TEAM_ID,
      '--wait'
    ],
    { stdio: 'inherit' }
  )
  if (zipPath) fs.rmSync(zipPath, { force: true })
  if (submit.status !== 0) process.exit(submit.status ?? 1)

  console.log(`[notarize] Stapling ${path.basename(staplePath)}…`)
  const staple = spawnSync('xcrun', ['stapler', 'staple', staplePath], { stdio: 'inherit' })
  if (staple.status !== 0) process.exit(staple.status ?? 1)
}

function rebuildSignedDmg() {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const configPath = path.join(root, '.electron-builder.pack.json')
  fs.writeFileSync(
    configPath,
    JSON.stringify({ ...pkg.build, directories: { ...pkg.build.directories, output: 'electron-dist' } }, null, 2)
  )

  const env = { ...process.env }
  delete env.APPLE_ID
  delete env.APPLE_APP_SPECIFIC_PASSWORD
  delete env.APPLE_TEAM_ID

  const build = spawnSync(
    'npx',
    ['electron-builder', '--config', configPath, '--mac', 'dmg', '--prepackaged', 'electron-dist/mac'],
    { cwd: root, stdio: 'inherit', env, shell: true }
  )
  fs.unlinkSync(configPath)
  if (build.status !== 0) process.exit(build.status ?? 1)

  console.log('[notarize] Signing DMG…')
  const sign = spawnSync(
    'codesign',
    ['--sign', identity, '--timestamp', dmgPath],
    { stdio: 'inherit' }
  )
  if (sign.status !== 0) process.exit(sign.status ?? 1)
}

if (!fs.existsSync(appPath)) {
  console.error(`[notarize] Signed app not found: ${appPath}`)
  console.error('Run npm run build && node scripts/pack.mjs --installer first.')
  process.exit(1)
}

if (process.argv.includes('--dmg-only')) {
  if (!fs.existsSync(dmgPath)) rebuildSignedDmg()
  notarizeAndStaple(dmgPath)
  process.exit(0)
}

notarizeAndStaple(appPath)
rebuildSignedDmg()
notarizeAndStaple(dmgPath)
console.log('[notarize] Done — signed, notarized, and stapled DMG at electron-dist/KrakenInterview.dmg')
