import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testIgnore: "static-demo.spec.ts",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:1420", browserName: "chromium" },
  webServer: [
    { command: "npm run dev -- --host 127.0.0.1", port: 1420, reuseExistingServer: true },
    { command: "npm run dev:site -- --host 127.0.0.1 --port 4174", port: 4174, reuseExistingServer: true }
  ]
});
