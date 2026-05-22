import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pngPath = path.join(root, 'resources', 'icon.png')
const icoPath = path.join(root, 'resources', 'icon.ico')

if (!fs.existsSync(pngPath)) {
  console.error(`[icon] Missing source icon: ${pngPath}`)
  process.exit(1)
}

const iconBuffer = await pngToIco(pngPath)
fs.writeFileSync(icoPath, iconBuffer)
console.log(`[icon] Wrote ${icoPath}`)
