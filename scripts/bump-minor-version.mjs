import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

const parts = pkg.version.split('.').map((part) => Number.parseInt(part, 10))
if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
  console.error(`[version] Invalid semver in package.json: ${pkg.version}`)
  process.exit(1)
}

const [major, minor] = parts
const previousVersion = pkg.version
const nextVersion = `${major}.${minor + 1}.0`

pkg.version = nextVersion
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
console.log(`[version] Bumped minor version: ${previousVersion} -> ${nextVersion}`)
