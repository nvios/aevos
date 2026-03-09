import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { localePath } from "@/lib/i18n/paths";
import { getAllArticles } from "@/lib/content/articles";
import { getAllRecipes } from "@/lib/content/recipes";
import { categories } from "@/lib/content/categories";

const staticRoutes = [
  "",
  "/articoli",
  "/ricette",
  "/servizi",
  "/servizi/assessment-online",
  "/servizi/lab-tests",
  "/servizi/lombardia/milano",
  "/servizi/lombardia/bergamo",
  "/servizi/lombardia/brescia",
  "/servizi/protocolli/sonno",
  "/servizi/protocolli/pelle",
  "/servizi/protocolli/capelli-pelle",
  "/servizi/protocolli/longevita",
  "/eta-biologica",
  "/aspettativa-di-vita",
  "/calcolo-longevita",
  "/glossario",
  "/sedi/milano",
  "/sedi/roma",
  "/sedi/torino",
  "/sedi/brescia",
  "/sedi/monza",
];

function bilingualEntry(
  base: string,
  route: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  const enPath = localePath(route || "/", "en");
  return [
    { url: `${base}${route}`, lastModified, changeFrequency, priority },
    {
      url: `${base}/en${enPath === "/" ? "" : enPath}`,
      lastModified,
      changeFrequency,
      priority: Math.max(priority - 0.1, 0.1),
    },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Home
  entries.push(...bilingualEntry(base, "", lastModified, "weekly", 1));

  // Static pages (skip home, handled above)
  for (const route of staticRoutes.filter(Boolean)) {
    entries.push(...bilingualEntry(base, route, lastModified, "monthly", 0.7));
  }

  // Article category listing pages
  for (const cat of categories) {
    entries.push(
      ...bilingualEntry(base, `/articoli/${cat.slug}`, lastModified, "weekly", 0.7),
    );
  }

  // Individual articles
  const articles = getAllArticles("it");
  for (const article of articles) {
    entries.push(
      ...bilingualEntry(
        base,
        `/articoli/${article.category}/${article.slug}`,
        lastModified,
        "monthly",
        0.6,
      ),
    );
  }

  // Individual recipes
  const recipes = getAllRecipes("it");
  for (const recipe of recipes) {
    entries.push(
      ...bilingualEntry(
        base,
        `/ricette/${recipe.category}/${recipe.slug}`,
        lastModified,
        "monthly",
        0.6,
      ),
    );
  }

  return entries;
}
