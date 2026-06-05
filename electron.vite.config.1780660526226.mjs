// electron.vite.config.ts
import { config as loadDotenv } from "dotenv";
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin, loadEnv } from "electron-vite";
import react from "@vitejs/plugin-react";
var __electron_vite_injected_dirname = "C:\\Users\\roman\\source\\repos\\Private\\CrackingTheInterview";
loadDotenv();
var electron_vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const openAiApiKey = (env.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? "").trim();
  return {
    main: {
      define: {
        __KRAKEN_OPENAI_API_KEY__: JSON.stringify(openAiApiKey)
      },
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          "@shared": resolve(__electron_vite_injected_dirname, "shared")
        }
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__electron_vite_injected_dirname, "electron/main/index.ts")
          }
        }
      }
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          "@shared": resolve(__electron_vite_injected_dirname, "shared")
        }
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__electron_vite_injected_dirname, "electron/preload/index.ts")
          }
        }
      }
    },
    renderer: {
      root: resolve(__electron_vite_injected_dirname, "src/renderer"),
      build: {
        rollupOptions: {
          input: {
            index: resolve(__electron_vite_injected_dirname, "src/renderer/index.html")
          }
        }
      },
      resolve: {
        alias: {
          "@renderer": resolve(__electron_vite_injected_dirname, "src/renderer/src"),
          "@shared": resolve(__electron_vite_injected_dirname, "shared")
        }
      },
      plugins: [react()]
    }
  };
});
export {
  electron_vite_config_default as default
};
