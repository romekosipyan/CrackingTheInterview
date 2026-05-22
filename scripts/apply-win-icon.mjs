import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rcedit from 'rcedit'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.resolve(root, process.argv[2] ?? 'electron-dist')
const iconPath = path.join(root, 'resources', 'icon.ico')
const productName = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
).build.productName

if (!fs.existsSync(iconPath)) {
  console.error(`[icon] Missing icon file: ${iconPath}`)
  process.exit(1)
}

const appExePath = path.join(outputDir, 'win-unpacked', `${productName}.exe`)
if (!fs.existsSync(appExePath)) {
  console.warn(`[icon] App executable not found: ${appExePath}`)
  process.exit(0)
}

// Only patch the unpacked app binary. Patching the NSIS installer breaks its
// integrity check and causes "Installer integrity check has failed".
console.log(`[icon] Applying icon to ${appExePath}`)
await rcedit(appExePath, { icon: iconPath })
console.log('[icon] App executable updated.')
