import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import {
  products,
  createWhatsAppUrl,
  WHATSAPP_NUMBER,
} from "../src/content.js";

test("WhatsApp drafts go to the supplied business number and safely encode user text", () => {
  const url = new URL(
    createWhatsAppUrl({
      name: "Alex & Co",
      type: "A website",
      message: "Order flow? 50% simpler\nWith a #menu & details",
    }),
  );
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/" + WHATSAPP_NUMBER);
  assert.equal(WHATSAPP_NUMBER, "6281944496015");
  assert.equal(url.searchParams.size, 1);
  assert.match(url.searchParams.get("text"), /Alex & Co/);
  assert.match(
    url.searchParams.get("text"),
    /50% simpler\nWith a #menu & details/,
  );
});

test("a draft without optional fields is readable and whitespace is removed", () => {
  const message = new URL(
    createWhatsAppUrl({ message: "  My new app  " }),
  ).searchParams.get("text");
  assert.equal(message, "Hi R Studio Hub!\n\nMy new app");
});

test("every product control has matching content and meaningful features", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const ids = [...html.matchAll(/data-product="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(ids.length, 3);
  for (const id of ids) {
    assert.ok(products[id]);
    assert.equal(products[id].features.length, 3);
  }
});

test("internal navigation anchors resolve and ids are unique", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.includes(target), `Missing anchor: ${target}`);
  assert.match(html, /<html lang="en">/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
});

test("all local image and source references exist before publication", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  const refs = [...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)].map(
    (match) => match[1],
  );
  for (const ref of new Set(refs))
    await access(new URL(`../${ref}`, import.meta.url));
});
