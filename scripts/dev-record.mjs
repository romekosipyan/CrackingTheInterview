import { spawn } from 'node:child_process'

process.env.KRAKEN_RECORD_DEMO = '1'

const child = spawn('npx', ['electron-vite', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
})

child.on('exit', (code) => process.exit(code ?? 0))
