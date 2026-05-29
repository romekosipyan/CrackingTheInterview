import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')

if (fs.existsSync(envPath)) {
  config({ path: envPath })
} else {
  config()
}

const apiKey = process.env.OPENAI_API_KEY?.trim() ?? ''
if (!apiKey) {
  console.error(
    '[build] OPENAI_API_KEY is missing. Create a root .env file (see .env.example) before npm run dist.'
  )
  process.exit(1)
}

console.info('[build] OPENAI_API_KEY loaded for installer build.')
