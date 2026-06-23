import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const codesignDir = path.join(root, 'codesign')
const keyPath = path.join(codesignDir, 'mac-signing.key')
const csrPath = path.join(codesignDir, 'mac-signing.csr')
const p12Path = path.join(codesignDir, 'mac-cert.p12')

function usage() {
  console.log(`Usage:
  node scripts/prepare-mac-cert.mjs check
  node scripts/prepare-mac-cert.mjs import <path-to-downloaded.cer> [p12-password]
  node scripts/prepare-mac-cert.mjs export-env

Steps:
  1. Upload ${path.relative(root, csrPath)} in Apple Developer → Certificates → Developer ID Application
  2. Download the .cer file from Apple
  3. Run: node scripts/prepare-mac-cert.mjs import ~/Downloads/developerID_application.cer
  4. Add APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID to .env
  5. Run: npm run dist`)
  process.exit(1)
}

function checkKeychain() {
  const output = execSync('security find-identity -v -p codesigning', { encoding: 'utf8' })
  const devId = output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('Developer ID Application'))

  if (devId.length === 0) {
    console.log('[mac-sign] No Developer ID Application identity in Keychain yet.')
  } else {
    console.log('[mac-sign] Keychain identities:')
    for (const line of devId) console.log(`  ${line}`)
  }
}

function importCer(cerPath, password) {
  if (!fs.existsSync(keyPath)) {
    console.error(`[mac-sign] Missing private key: ${keyPath}`)
    process.exit(1)
  }
  if (!fs.existsSync(cerPath)) {
    console.error(`[mac-sign] Certificate not found: ${cerPath}`)
    process.exit(1)
  }

  fs.mkdirSync(codesignDir, { recursive: true })
  const pemPath = path.join(codesignDir, 'mac-cert.pem')

  execSync(`openssl x509 -inform der -in "${cerPath}" -out "${pemPath}"`, { stdio: 'inherit' })
  execSync(
    `openssl pkcs12 -export -out "${p12Path}" -inkey "${keyPath}" -in "${pemPath}" -password pass:${password}`,
    { stdio: 'inherit' }
  )

  console.log(`[mac-sign] Created ${path.relative(root, p12Path)}`)
  console.log('[mac-sign] Add to .env:')
  console.log(`CSC_LINK=${path.relative(root, p12Path)}`)
  console.log(`CSC_KEY_PASSWORD=${password}`)
  checkKeychain()
}

function exportEnvHint() {
  console.log('[mac-sign] Required .env entries for signed + notarized DMG:')
  console.log('CSC_LINK=codesign/mac-cert.p12')
  console.log('CSC_KEY_PASSWORD=<your-p12-password>')
  console.log('APPLE_ID=<your-apple-id-email>')
  console.log('APPLE_APP_SPECIFIC_PASSWORD=<from appleid.apple.com>')
  console.log('APPLE_TEAM_ID=<10-char team id from developer.apple.com/account>')
  checkKeychain()
}

const [command, ...rest] = process.argv.slice(2)
switch (command) {
  case 'check':
    checkKeychain()
    break
  case 'import': {
    const [cerPath, password = 'kraken-sign'] = rest
    if (!cerPath) usage()
    importCer(path.resolve(cerPath), password)
    break
  }
  case 'export-env':
    exportEnvHint()
    break
  default:
    usage()
}
