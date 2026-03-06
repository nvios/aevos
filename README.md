# Aevos Health

Guide pratiche su longevità, prevenzione e performance quotidiana con approccio evidence-based. Disponibile in italiano e inglese su [aevos.it](https://aevos.it).

## Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **i18n:** [next-intl](https://next-intl.dev) (IT / EN)
- **Backend:** [Supabase](https://supabase.com)
- **Analytics:** [PostHog](https://posthog.com)
- **Testing:** [Playwright](https://playwright.dev)

## Features

### Pages & Routes

| Route | What it does |
|-------|--------------|
| `/` | Homepage — hero, feature highlights, trending articles, newsletter signup |
| `/articoli` | Article index, filterable by category |
| `/articoli/[category]/[slug]` | Article detail with FAQ, related articles, also-read |
| `/ricette` | Recipe index with search and category filters |
| `/ricette/[category]/[slug]` | Recipe detail with ingredients, instructions, benefits |
| `/servizi` | Services overview |
| `/servizi/assessment-online` | Multi-step screening wizard (biomarkers → health score → protocol) |
| `/servizi/lab-tests` | Lab tests information |
| `/servizi/protocolli/[slug]` | Protocol detail pages (sonno, pelle, capelli-pelle, longevita) |
| `/servizi/lombardia/[province]` | Regional location pages |
| `/calcolo-longevita` | Longevity calculator (BMI, RHR, VO2 Max → score 1–99) |
| `/eta-biologica` | Biological age explainer |
| `/aspettativa-di-vita` | Life expectancy explainer |
| `/glossario` | Glossary of scientific terms |
| `/sedi/[city]` | Location pages |
| `/login` | Auth (Google OAuth + email/password via Supabase) |

### Content System

- **Markdown-based** articles and recipes under `content/articles/` and `content/recipes/`
- **Localized** with `.md` (IT) / `.en.md` (EN) file pairs
- **Categories:** sonno, esercizio, nutrizione, skin-care, capelli, longevita, tecnologie
- **Article frontmatter:** title, description, category, author, authorRole, faq, cta, tags, resources
- **Recipe frontmatter:** title, description, category, prepTime, cookTime, servings, calories, ingredients, instructions, benefits, image, faq
- **Glossary integration:** `MarkdownRenderer` auto-wraps glossary terms in popovers with definitions
- **Related content:** tag-based matching with optional engagement boost from `article_stats`

### i18n

- **Locales:** `it` (default, root paths), `en` (under `/en`)
- **Path translation:** Italian paths for IT, English for EN (e.g. `/articoli` ↔ `/articles`, `/calcolo-longevita` ↔ `/longevity-calculator`)
- **Category slug translation:** e.g. sonno ↔ sleep, esercizio ↔ exercise
- **Messages:** `messages/it.json` and `messages/en.json` via next-intl
- **Detection:** `Accept-Language` header + `AEVOS_LOCALE` cookie
- **Middleware:** rewrites EN paths to internal Italian route structure

### Longevity Calculator

- Inputs: age, height, weight, gender, optional RHR and VO2 Max
- Outputs a score (1–99) with population distribution chart (SVG)
- Advanced benchmarks gated behind signup

### Screening Wizard

- Multi-step biomarker questionnaire (metabolic, inflammation, hormonal, nutritional, functional, body composition)
- Biomarkers: HbA1c, LDL, HDL, triglycerides, hs-CRP, Vitamin D, etc.
- Progress persisted in localStorage (5-day expiry)
- Produces a health score and recommends a protocol

### Auth

- Supabase Auth with Google OAuth and email/password
- Newsletter signup → account creation flow with pre-filled email
- PostHog `identify()` on login

### Analytics & Tracking

- **PostHog** proxied through `/ingest` rewrites (ad-blocker resilient)
- **Session recording** and autocapture (clicks, submits)
- **Custom events:** auth, newsletter, calculator, screening, recipes, FAQ, glossary, CTAs, recommendations
- **Supabase tables:** `reading_sessions` (per-view with device/UTM), `article_stats` (view counts, CTA clicks), `newsletter_subscribers`
- **Trending articles:** time-decay scoring from reading sessions (7-day window)
- **Also-read:** collaborative filtering from co-read sessions

### SEO

- `buildMetadata()` helper for title, description, canonical, Open Graph, Twitter cards
- `hreflang` alternates for IT/EN on every page
- Structured data via `lib/seo/schema.ts`: BreadcrumbList, FAQPage, WebSite

### UI & Styling

- Tailwind CSS 4 with `@tailwindcss/typography`
- CSS variable-based theme (zinc palette, emerald/cyan accents)
- Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`
- Components: button, card, input, checkbox, label, progress, dialog, FAQ accordion, newsletter form, language switcher, mobile nav

### Scripts & Tooling

| Command | Description |
|---------|-------------|
| `npm run new-page` | Scaffold a new content page (guide, prodotti, ricerca, servizi) |
| `npm run seo-check` | Audit pages for `buildMetadata` and description |
| `npm run audit-links` | Link density audit + missed internal link opportunities |
| `npm run lint-content` | Content linter: categories, word count, link rules, acronyms, glossary coverage |

## Getting Started

```bash
cp .env.example .env.local   # fill in Supabase keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the local site.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run new-page` | Scaffold a new content page |
| `npm run seo-check` | Run SEO audit |
| `npm run audit-links` | Link density audit |
| `npm run lint-content` | Content linter |

## Content Guidelines

See `CONTENT_GUIDELINES.md` and `.cursor/rules/content-style.mdc` for tone, language, and formatting rules.
