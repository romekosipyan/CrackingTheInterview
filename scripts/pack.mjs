import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
    'Close any running KrakenInterview.exe and Explorer windows in that folder.',
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

const mode = process.argv.includes('--installer') ? 'installer' : 'dir'
const output = prepareOutputDir()

writeTempConfig(output)

const builderArgs = ['electron-builder', '--config', tempConfigPath]
if (mode === 'dir') builderArgs.push('--dir')

const result = spawnSync('npx', builderArgs, { cwd: root, stdio: 'inherit', shell: true })
cleanupTempConfig()
process.exit(result.status ?? 1)
