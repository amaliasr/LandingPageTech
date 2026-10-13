import { cp, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const target = path.join(root, "public", "vendor");
const source = path.join(root, "node_modules", "lenis");
await mkdir(target, { recursive: true });
for (const name of ["lenis.mjs", "lenis.mjs.map", "lenis.css"]) {
  await cp(path.join(source, "dist", name), path.join(target, name));
}
await cp(path.join(source, "LICENSE"), path.join(target, "LENIS-LICENSE.txt"));
