import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

test("a plain Git checkout contains the complete browser dependency graph", async () => {
  const visited = new Set();
  async function inspect(file) {
    if (visited.has(file)) return;
    visited.add(file);
    assert.ok(
      file.startsWith(root + path.sep),
      `Asset escapes web root: ${file}`,
    );
    await access(file);
    if (!/\.(html|css|js)$/.test(file)) return;
    const source = await readFile(file, "utf8");
    const patterns = file.endsWith(".html")
      ? [/(?:src|href)="(\.\/[^"]+)"/g]
      : file.endsWith(".css")
        ? [/url\(["']?(\.{1,2}\/[^"')]+)["']?\)/g]
        : [/(?:from\s*|import\s*)["'](\.{1,2}\/[^"']+)["']/g];
    for (const pattern of patterns) {
      for (const [, reference] of source.matchAll(pattern)) {
        await inspect(
          path.resolve(path.dirname(file), reference.split(/[?#]/)[0]),
        );
      }
    }
  }
  await inspect(path.join(root, "index.html"));
  assert.ok(visited.has(path.join(root, "public/assets/logo-r.png")));
  assert.ok(visited.has(path.join(root, "public/assets/owner-portrait.png")));
  assert.ok(visited.has(path.join(root, "public/vendor/lenis.js")));
  assert.ok(visited.has(path.join(root, "public/vendor/lenis.css")));
});

test("search identity is consistent and fictional testimonials are not review markup", async () => {
  const html = await readFile(path.join(root, "index.html"), "utf8");
  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)[1];
  assert.equal(canonical, "https://rstudiohub.com/");
  const structured = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  );
  const entities = structured["@graph"];
  assert.ok(
    entities.some(
      (entity) =>
        entity["@type"] === "Organization" && entity.url === canonical,
    ),
  );
  assert.ok(
    entities.some(
      (entity) => entity["@type"] === "WebSite" && entity.url === canonical,
    ),
  );
  const owner = entities.find((entity) => entity["@type"] === "Person");
  assert.equal(owner.sameAs.length, 3);
  for (const link of owner.sameAs) assert.ok(html.includes(`href="${link}"`));
  assert.doesNotMatch(
    JSON.stringify(structured),
    /AggregateRating|Review|ratingValue/,
  );
  const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/rstudiohub\.com\/<\/loc>/);
  const robots = await readFile(path.join(root, "robots.txt"), "utf8");
  assert.match(robots, /Sitemap: https:\/\/rstudiohub\.com\/sitemap\.xml/);
});
