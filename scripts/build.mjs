import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "./vendor.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = path.join(root, "dist");
if (output !== path.resolve(root, "dist") || path.dirname(output) !== root)
  throw new Error("Unsafe output path");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, "index.html"), path.join(output, "index.html"));
await cp(path.join(root, "src"), path.join(output, "src"), { recursive: true });
await cp(path.join(root, "public"), output, { recursive: true });
console.log(`Static site built at ${output}`);
