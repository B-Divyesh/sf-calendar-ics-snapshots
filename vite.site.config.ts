import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const desktopSource = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  root: "site",
  cacheDir: "../node_modules/.vite-site",
  publicDir: "../public",
  build: {
    outDir: "../dist/site",
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: {
      input: {
        index: "site/index.html",
        demo: "site/demo/index.html",
        privacy: "site/privacy/index.html",
        terms: "site/terms/index.html",
        notFound: "site/404.html"
      }
    }
  },
  server: {
    fs: { allow: [".."] }
  },
  resolve: {
    alias: { "/src": desktopSource }
  }
});
