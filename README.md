# Aevos Health

Guide pratiche su longevità, prevenzione e performance quotidiana con approccio evidence-based. Disponibile in italiano e inglese su [aevos.it](https://aevos.it).

## Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **i18n:** [next-intl](https://next-intl.dev) (IT / EN)
- **Backend:** [Supabase](https://supabase.com)
- **Analytics:** [PostHog](https://posthog.com)
- **Testing:** [Playwright](https://playwright.dev)

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
| `npm run new-page` | Scaffold a new page |
| `npm run seo-check` | Run SEO audit |

## Content Guidelines

See `CONTENT_GUIDELINES.md` and `.cursor/rules/content-style.mdc` for tone, language, and formatting rules.
