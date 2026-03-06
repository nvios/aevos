import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { localePath } from "@/lib/i18n/paths";

const routes = [
  "",
  "/articoli",
  "/articoli/sonno",
  "/articoli/esercizio",
  "/articoli/nutrizione",
  "/servizi",
  "/servizi/lombardia/milano",
  "/servizi/lombardia/bergamo",
  "/servizi/lombardia/brescia",
  "/eta-biologica",
  "/aspettativa-di-vita",
  "/calcolo-longevita",
  "/ricette",
  "/glossario",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const lastModified = new Date();
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    // Italian (default, no prefix)
    sitemapEntries.push({
      url: `${base}${route}`,
      lastModified,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.7,
    });

    // English (with /en prefix and translated path)
    const enPath = localePath(route || "/", "en");
    sitemapEntries.push({
      url: `${base}/en${enPath === "/" ? "" : enPath}`,
      lastModified,
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 0.9 : 0.6,
    });
  });

  return sitemapEntries;
}
