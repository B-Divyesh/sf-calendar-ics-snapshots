import { defineConfig } from "vite";

export default defineConfig({
  cacheDir: "node_modules/.vite-app",
  clearScreen: false,
  build: {
    outDir: "dist/app",
    emptyOutDir: true,
    target: "es2022"
  },
  server: { strictPort: true, port: 1420 },
  envPrefix: ["VITE_", "TAURI_"]
});
