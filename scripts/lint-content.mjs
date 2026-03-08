import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── Configuration ──────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  "sonno",
  "esercizio",
  "nutrizione",
  "skin-care",
  "capelli",
  "longevita",
  "tecnologie",
];

const MIN_WORDS_ERROR = 250;
const MIN_WORDS_WARN = 300;
const MAX_WORDS = 2500;
const MAX_LINKS = 20;
const MAX_LINK_DENSITY_PCT = 3.0;
const MAX_PARENTHESES_DENSITY_PCT = 2.5;

const SKIP_ACRONYMS = new Set([
  "AM", "PM", "OK", "IT", "EN", "US", "EU", "II", "III", "IV",
  "URL", "HTML", "CSS", "FAQ", "CTA", "PDF", "API",
  "UV", "IA", "AI", "OH", "ML", "NO", "TV", "CEO", "DIY",
  "LED", "DNA", "CO2", "FDA",
  "NASA", "NIH", "IU", "UI", "HEPA", "BPA"
]);

// ── Helpers ────────────────────────────────────────────────────────────────────

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;

const severityLabel = {
  error: red("ERROR"),
  warning: yellow("WARN "),
  info: cyan("INFO "),
};

function loadGlossaryTerms() {
  const glossaryPath = path.join(process.cwd(), "lib/content/glossary.ts");
  const src = fs.readFileSync(glossaryPath, "utf8");

  const itBlock = src.match(
    /const glossaryTermsIt[\s\S]*?\].sort/
  )?.[0] ?? "";
  const enBlock = src.match(
    /const glossaryTermsEn[\s\S]*?\].sort/
  )?.[0] ?? "";

  const extract = (block) => {
    const terms = new Set();
    const re = /term:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(block)) !== null) terms.add(m[1]);
    return terms;
  };

  return { it: extract(itBlock), en: extract(enBlock) };
}

function getAllArticleSlugs() {
  const dir = path.join(process.cwd(), "content/articles");
  const slugs = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    slugs.add(f.replace(/\.en\.md$/, "").replace(/\.md$/, ""));
  }
  return slugs;
}

function getArticleFiles(filterSlug) {
  const dir = path.join(process.cwd(), "content/articles");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => {
      if (!filterSlug) return true;
      const slug = f.replace(/\.en\.md$/, "").replace(/\.md$/, "");
      return slug === filterSlug;
    })
    .map((file) => {
      const locale = file.endsWith(".en.md") ? "en" : "it";
      const slug = file.replace(/\.en\.md$/, "").replace(/\.md$/, "");
      return { file, slug, locale, filePath: path.join(dir, file) };
    });
}

// ── Lint rules ─────────────────────────────────────────────────────────────────

function lintArticle(entry, glossary, allSlugs) {
  const raw = fs.readFileSync(entry.filePath, "utf8");
  const { data: fm, content } = matter(raw);
  const issues = [];

  const push = (severity, rule, message) =>
    issues.push({ severity, rule, message });

  // ── 1. Valid category ────────────────────────────────────────────────────────
  if (fm.category) {
    push("error", "deprecated-category", "Use 'categories' (array) instead of 'category' (string).");
  }

  if (!Array.isArray(fm.categories) || fm.categories.length === 0) {
    push("error", "missing-categories", "No 'categories' array defined in frontmatter.");
  }

  const categories = fm.categories || [];

  for (const cat of categories) {
    if (!VALID_CATEGORIES.includes(cat)) {
      push(
        "error",
        "invalid-category",
        `Category "${cat}" is not valid. Accepted: ${VALID_CATEGORIES.join(", ")}`
      );
    }
  }

  // ── 2. Article length ────────────────────────────────────────────────────────
  const plainBody = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip link syntax
    .replace(/[#*_`>|-]+/g, " ");
  const wordCount = plainBody.split(/\s+/).filter((w) => w.length > 0).length;

  if (wordCount < MIN_WORDS_ERROR) {
    push(
      "error",
      "too-short",
      `Only ${wordCount} words (minimum: ${MIN_WORDS_ERROR}).`
    );
  } else if (wordCount < MIN_WORDS_WARN) {
    push(
      "warning",
      "too-short",
      `Only ${wordCount} words (recommended minimum: ${MIN_WORDS_WARN}).`
    );
  }
  if (wordCount > MAX_WORDS) {
    push(
      "warning",
      "too-long",
      `${wordCount} words (recommended maximum: ${MAX_WORDS}).`
    );
  }

  // ── 3. Links and Parentheses in headings ─────────────────────────────────────
  const lines = content.split("\n");
  lines.forEach((line, i) => {
    if (/^#{1,6}\s/.test(line)) {
      if (/\[[^\]]+\]\([^)]+\)/.test(line)) {
        push(
          "error",
          "link-in-heading",
          `Line ${i + 1}: heading contains a link — "${line.trim()}"`
        );
      }
      if (/[()]/.test(line)) {
        const parenMatches = line.match(/\(([^)]+)\)/g);
        if (parenMatches) {
          for (const match of parenMatches) {
            const content = match.slice(1, -1).trim();
            // Allow:
            // 1. Content containing numbers (e.g. "Step 1", "30 minutes", "2024")
            // 2. Uppercase acronyms (e.g. "FMD", "LLLT", "UV-A", "NAD+")
            const isAllowed = /\d/.test(content) || /^[A-Z0-9\+\-\/]+$/.test(content);
            
            if (!isAllowed) {
              push(
                "error",
                "parentheses-in-heading",
                `Line ${i + 1}: heading contains disallowed parentheses — "${match}". Only numbers or uppercase acronyms are allowed in headings.`
              );
            }
          }
        }
      }
    }
  });

  // ── 4. Links inside bold text ────────────────────────────────────────────────
  const boldSegments = content.match(/\*\*(?:(?!\*\*)[\s\S])+?\*\*/g) || [];
  for (const seg of boldSegments) {
    if (/\[[^\]]+\]\([^)]+\)/.test(seg)) {
      const preview =
        seg.length > 80 ? seg.substring(0, 77) + "..." : seg;
      push(
        "error",
        "link-in-bold",
        `Link inside bold text: ${preview}`
      );
    }
  }

  // ── 5. Link count and density ────────────────────────────────────────────────
  const allLinks = content.match(/\[[^\]]+\]\([^)]+\)/g) || [];
  const internalLinks = allLinks.filter((l) =>
    /\]\(\/(articoli|ricette)\//.test(l)
  );

  if (allLinks.length > MAX_LINKS) {
    push(
      "warning",
      "too-many-links",
      `${allLinks.length} links in article (max recommended: ${MAX_LINKS}).`
    );
  }

  const density =
    wordCount > 0 ? (allLinks.length / wordCount) * 100 : 0;
  if (density > MAX_LINK_DENSITY_PCT) {
    push(
      "warning",
      "high-link-density",
      `Link density ${density.toFixed(1)}% exceeds ${MAX_LINK_DENSITY_PCT}% threshold.`
    );
  }

  // ── 6. Links to related articles ─────────────────────────────────────────────
  if (internalLinks.length === 0) {
    push(
      "warning",
      "no-internal-links",
      "Article has no links to other articles or recipes."
    );
  }

  // Check that internal links point to existing articles
  for (const link of internalLinks) {
    const href = link.match(/\]\(([^)]+)\)/)?.[1];
    if (!href) continue;
    const slugMatch = href.match(
      /\/articoli\/[^/]+\/([^/)]+)/
    );
    if (slugMatch) {
      const targetSlug = slugMatch[1];
      if (!allSlugs.has(targetSlug)) {
        push(
          "error",
          "broken-internal-link",
          `Links to non-existent article "${targetSlug}" — ${href}`
        );
      }
    }
  }

  // ── 7. Acronyms not in glossary ──────────────────────────────────────────────
  const glossaryTerms = glossary[entry.locale] || glossary.it;
  const glossaryUpper = new Set(
    [...glossaryTerms].map((t) => t.toUpperCase())
  );
  for (const t of glossaryTerms) {
    glossaryUpper.add(t.split(" ")[0].toUpperCase());
  }

  // Only scan the article body, not the frontmatter (which includes FAQ answers)
  const acronymRe = /\b([A-Z]{2,}[A-Z0-9+/-]*)\b/g;
  const foundAcronyms = new Set();
  let m;
  while ((m = acronymRe.exec(content)) !== null) {
    const cleaned = m[1].replace(/[-/]+$/, "");
    if (cleaned.length >= 2) foundAcronyms.add(cleaned);
  }

  // Strip bold/italic markers so **text** inside parentheses doesn't break detection
  const contentPlain = content.replace(/\*{1,2}/g, "");

  // Check if an acronym is explained inline via parentheses:
  //   "ACRONYM (Full Explanation Here)"  or  "Full Name (ACRONYM)"
  function isExplainedInContext(acr) {
    const escaped = acr.replace(/[+]/g, "\\+");

    // Pattern 1: ACRONYM followed by parenthetical with 2+ words
    const afterRe = new RegExp(
      `\\b${escaped}\\b\\s*\\([^)]{4,}\\)`,
    );
    if (afterRe.test(contentPlain)) return true;

    // Pattern 2: ACRONYM appears inside parentheses (defined as aside or standalone)
    const insideRe = new RegExp(
      `\\([^)]*\\b${escaped}\\b[^)]*\\)`,
    );
    if (insideRe.test(contentPlain)) return true;

    return false;
  }

  for (const acr of foundAcronyms) {
    if (SKIP_ACRONYMS.has(acr)) continue;
    if (glossaryUpper.has(acr)) continue;
    if (glossaryUpper.has(acr + "+")) continue;
    if (isExplainedInContext(acr)) continue;
    push(
      "info",
      "acronym-not-in-glossary",
      `Acronym "${acr}" is used but not defined in the glossary and not explained inline.`
    );
  }

  // ── 8. Parentheses density (AI tell) ─────────────────────────────────────────
  // AI often over-explains using parentheses: "The mitochondria (powerhouse of the cell)..."
  // We count opening parentheses in the plain text body.
  const parenthesesCount = (plainBody.match(/\(/g) || []).length;
  const parenthesesDensity =
    wordCount > 0 ? (parenthesesCount / wordCount) * 100 : 0;

  if (parenthesesDensity > MAX_PARENTHESES_DENSITY_PCT) {
    push(
      "warning",
      "high-parentheses-density",
      `High usage of parentheses: ${parenthesesDensity.toFixed(1)}% (${parenthesesCount} pairs). This can feel robotic or over-explained.`
    );
  }

  return { wordCount, linkCount: allLinks.length, internalLinkCount: internalLinks.length, issues };
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  const filterSlug = process.argv[2] || null;

  console.log(
    `\n${bold("Aevos Content Linter")}\n${dim("─".repeat(60))}\n`
  );

  const glossary = loadGlossaryTerms();
  const allSlugs = getAllArticleSlugs();
  const articles = getArticleFiles(filterSlug);

  if (articles.length === 0) {
    console.log(
      filterSlug
        ? red(`No article found matching slug "${filterSlug}".`)
        : red("No articles found in content/articles/.")
    );
    process.exit(1);
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  let totalInfos = 0;
  let cleanFiles = 0;

  for (const entry of articles) {
    const result = lintArticle(entry, glossary, allSlugs);
    const errors = result.issues.filter((i) => i.severity === "error");
    const warnings = result.issues.filter((i) => i.severity === "warning");
    const infos = result.issues.filter((i) => i.severity === "info");

    totalErrors += errors.length;
    totalWarnings += warnings.length;
    totalInfos += infos.length;

    if (result.issues.length === 0) {
      cleanFiles++;
      continue;
    }

    const stats = dim(
      `(${result.wordCount} words, ${result.linkCount} links, ${result.internalLinkCount} internal)`
    );
    console.log(`${bold(entry.file)} ${stats}`);

    for (const issue of result.issues) {
      console.log(`  ${severityLabel[issue.severity]}  ${issue.message}`);
    }
    console.log();
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log(dim("─".repeat(60)));
  console.log(
    `${bold("Summary:")} ${articles.length} files scanned, ${green(cleanFiles + " clean")}`
  );

  const parts = [];
  if (totalErrors > 0) parts.push(red(`${totalErrors} errors`));
  if (totalWarnings > 0) parts.push(yellow(`${totalWarnings} warnings`));
  if (totalInfos > 0) parts.push(cyan(`${totalInfos} info`));

  if (parts.length > 0) {
    console.log(`  ${parts.join(", ")}`);
  } else {
    console.log(`  ${green("All articles pass content guidelines!")}`);
  }
  console.log();

  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
