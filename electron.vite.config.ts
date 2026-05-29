import { config as loadDotenv } from 'dotenv'
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'

loadDotenv()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const openAiApiKey = (env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim()

  return {
    main: {
      define: {
        __KRAKEN_OPENAI_API_KEY__: JSON.stringify(openAiApiKey)
      },
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          '@shared': resolve(__dirname, 'shared')
        }
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'electron/main/index.ts')
          }
        }
      }
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          '@shared': resolve(__dirname, 'shared')
        }
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'electron/preload/index.ts')
          }
        }
      }
    },
    renderer: {
      root: resolve(__dirname, 'src/renderer'),
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'src/renderer/index.html')
          }
        }
      },
      resolve: {
        alias: {
          '@renderer': resolve(__dirname, 'src/renderer/src'),
          '@shared': resolve(__dirname, 'shared')
        }
      },
      plugins: [react()]
    }
  }
})
