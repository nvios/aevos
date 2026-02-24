import fs from "node:fs";
import path from "node:path";

const [, , section, slug] = process.argv;

if (!section || !slug) {
  console.log("Usage: npm run new-page -- <section> <slug>");
  process.exit(1);
}

const allowed = new Set(["guide", "prodotti", "ricerca", "servizi"]);
if (!allowed.has(section)) {
  console.log(`Section must be one of: ${Array.from(allowed).join(", ")}`);
  process.exit(1);
}

const dir = path.join(process.cwd(), "content", section);
const target = path.join(dir, `${slug}.mdx`);

fs.mkdirSync(dir, { recursive: true });
if (fs.existsSync(target)) {
  console.log(`Page already exists: ${target}`);
  process.exit(1);
}

const template = `---
title: ""
description: ""
faq:
  - question: ""
    answer: ""
---

# Titolo pagina

Scrivi qui il contenuto principale.
`;

fs.writeFileSync(target, template, "utf8");
console.log(`Created ${target}`);
