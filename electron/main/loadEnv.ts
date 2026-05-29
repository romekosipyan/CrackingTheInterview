import { app } from 'electron'
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Dev only — packaged installers embed the key at build time via __KRAKEN_OPENAI_API_KEY__.
if (!app.isPackaged && !process.env.OPENAI_API_KEY?.trim()) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
  config({ path: path.join(root, '.env') })
}
