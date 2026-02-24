import fs from "node:fs";
import path from "node:path";

const appDir = path.join(process.cwd(), "app");

const filesToCheck = [
  "page.tsx",
  "guide/page.tsx",
  "prodotti/page.tsx",
  "ricerca/page.tsx",
  "servizi/page.tsx",
  "eta-biologica/page.tsx",
  "aspettativa-di-vita/page.tsx",
  "calcolo-longevita/page.tsx",
];

let hasError = false;

for (const relativePath of filesToCheck) {
  const fullPath = path.join(appDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing page: app/${relativePath}`);
    hasError = true;
    continue;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  if (!content.includes("buildMetadata")) {
    console.error(`Missing metadata builder in app/${relativePath}`);
    hasError = true;
  }

  if (!content.includes("description")) {
    console.error(`Missing description signal in app/${relativePath}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}

console.log("SEO check passed.");
