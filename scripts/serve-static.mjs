import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] || "dist/site");
const port = Number(process.argv[3] || 4175);
const types = {
  ".avif": "image/avif", ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".xml": "application/xml; charset=utf-8"
};

function fileFor(urlPath) {
  const decoded = decodeURIComponent(urlPath).replace(/^\/+/, "");
  const candidate = resolve(root, normalize(decoded));
  if (!candidate.startsWith(`${root}/`) && candidate !== root) return undefined;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) return join(candidate, "index.html");
  return candidate;
}

createServer((request, response) => {
  const requestPath = new URL(request.url || "/", "http://localhost").pathname;
  const candidate = fileFor(requestPath);
  const found = candidate && existsSync(candidate) && statSync(candidate).isFile();
  const file = found ? candidate : join(root, "404.html");
  response.writeHead(found ? 200 : 404, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Static site at http://127.0.0.1:${port}`));
