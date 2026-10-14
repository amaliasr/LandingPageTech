import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const target = path.join(root, "public", "vendor");
const source = path.join(root, "node_modules", "lenis");
await mkdir(target, { recursive: true });
const module = await readFile(path.join(source, "dist", "lenis.mjs"), "utf8");
await writeFile(
  path.join(target, "lenis.js"),
  module.replace(/\/\/# sourceMappingURL=.*$/gm, "").trimEnd() + "\n",
);
await cp(
  path.join(source, "dist", "lenis.css"),
  path.join(target, "lenis.css"),
);
await cp(path.join(source, "LICENSE"), path.join(target, "LENIS-LICENSE.txt"));
