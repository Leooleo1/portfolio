const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function send(res, status, body, contentType, headers = {}) {
  res.writeHead(status, { "Content-Type": contentType, ...headers });
  res.end(body);
}

function resolveRequestPath(urlPath) {
  const normalizedPath = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = normalizedPath === "/" ? "/index.html" : normalizedPath;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[\\/])+/, "");
  return path.join(ROOT, safePath);
}

const server = http.createServer((req, res) => {
  const requestPath = (req.url || "/").split("?")[0];

  if (requestPath === "/api/health") {
    send(res, 200, JSON.stringify({ ok: true }), "application/json; charset=utf-8");
    return;
  }

  const filePath = resolveRequestPath(req.url || "/");

  if (!filePath.startsWith(ROOT)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) {
      send(res, 404, "Not Found", "text/plain; charset=utf-8");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[extension] || "application/octet-stream";
    const cacheHeaders = contentType.startsWith("image/")
      ? { "Cache-Control": "public, max-age=86400" }
      : {};

    fs.readFile(filePath, (readError, content) => {
      if (readError) {
        send(res, 500, "Internal Server Error", "text/plain; charset=utf-8");
        return;
      }

      send(res, 200, content, contentType, cacheHeaders);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio rodando em http://localhost:${PORT}`);
});
