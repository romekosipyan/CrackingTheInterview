import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pngToIco from 'png-to-ico'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pngPath = path.join(root, 'resources', 'icon.png')
const icoPath = path.join(root, 'resources', 'icon.ico')
const iconWorkDir = path.join(root, 'resources', '.icon-work')
const websitePublic = path.join(root, 'website', 'public')
const psPath = path.join(iconWorkDir, 'export-icons.ps1')

const ICON_SIZES = [256, 128, 64, 48, 32, 16]
const WEBSITE_EXPORTS = [
  { size: 512, name: 'logo.png' },
  { size: 192, name: 'favicon-192.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 48, name: 'favicon-48.png' },
  { size: 32, name: 'favicon-32.png' }
]

if (!fs.existsSync(pngPath)) {
  console.error(`[icon] Missing source icon: ${pngPath}`)
  process.exit(1)
}

fs.mkdirSync(iconWorkDir, { recursive: true })

const exportLines = [
  ...ICON_SIZES.map((size) => `Export-Size ${size} 'icon-${size}.png' 0.94`),
  ...WEBSITE_EXPORTS.map((entry) => `Export-Size ${entry.size} '${entry.name}' 0.94`)
]

const psScript = `Add-Type -AssemblyName System.Drawing
$src = '${pngPath.replace(/'/g, "''")}'
$work = '${iconWorkDir.replace(/'/g, "''")}'
$img = [System.Drawing.Image]::FromFile($src)
function Export-Size([int]$size, [string]$name, [double]$fill) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
  $pad = [int][Math]::Round($size * (1 - $fill) / 2)
  $inner = $size - (2 * $pad)
  $g.DrawImage($img, $pad, $pad, $inner, $inner)
  $dest = Join-Path $work $name
  $bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}
${exportLines.join('\n')}
$img.Dispose()
`

fs.writeFileSync(psPath, psScript, 'utf8')
const { execSync } = await import('node:child_process')
execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${psPath}"`, { stdio: 'inherit' })

const icoInputs = ICON_SIZES.map((size) => path.join(iconWorkDir, `icon-${size}.png`))
const iconBuffer = await pngToIco(icoInputs)
fs.writeFileSync(icoPath, iconBuffer)
console.log(`[icon] Wrote ${icoPath}`)

const rendererLogo = path.join(root, 'src', 'renderer', 'src', 'assets', 'logo.png')
fs.copyFileSync(path.join(iconWorkDir, 'logo.png'), rendererLogo)
console.log(`[icon] Synced ${rendererLogo}`)

for (const entry of WEBSITE_EXPORTS) {
  const src = path.join(iconWorkDir, entry.name)
  const dest = path.join(websitePublic, entry.name)
  fs.copyFileSync(src, dest)
  console.log(`[icon] Wrote ${dest}`)
}

try {
  fs.rmSync(iconWorkDir, { recursive: true, force: true })
} catch {
  // ignore
}
