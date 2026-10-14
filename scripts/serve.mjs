import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "./vendor.mjs";

const project = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const root = process.argv.includes("--dist")
  ? path.join(project, "dist")
  : project;
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    if (
      !["index.html", "robots.txt", "sitemap.xml"].includes(relative) &&
      !/^(public\/(?:assets|vendor)|src)\//.test(relative)
    ) {
      res.writeHead(404);
      return res.end("Not found");
    }
    const source = root;
    const file = path.resolve(source, relative);
    if (!file.startsWith(source + path.sep)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    if (!(await stat(file)).isFile()) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Local: http://localhost:${port}`),
);
