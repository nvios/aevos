import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = [
  "",
  "/guide",
  "/guide/sonno",
  "/guide/esercizio",
  "/guide/nutrizione",
  "/prodotti",
  "/ricerca",
  "/servizi",
  "/servizi/lombardia/milano",
  "/servizi/lombardia/bergamo",
  "/servizi/lombardia/brescia",
  "/eta-biologica",
  "/aspettativa-di-vita",
  "/calcolo-longevita",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain;
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
