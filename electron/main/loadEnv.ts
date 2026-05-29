import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

if (!process.env.OPENAI_API_KEY?.trim()) {
  config({ path: path.join(root, '.env') })
}
