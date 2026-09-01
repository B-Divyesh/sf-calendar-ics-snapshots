import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: "static-demo.spec.ts",
  timeout: 30_000,
  use: { browserName: "chromium" },
  webServer: {
    command: "npm run build:site && vite preview --config vite.site.config.ts --host 127.0.0.1 --port 4175",
    port: 4175,
    reuseExistingServer: false
  }
});
