export const siteConfig = {
  name: "Aevos Health",
  description:
    "Guide pratiche su longevità, prevenzione e performance quotidiana con approccio evidence-based.",
  domain: "https://aevos.netfly.app",
  locale: "it_IT",
} as const;

export const navItems = [
  { href: "/guide", label: "Guide" },
  { href: "/prodotti", label: "Prodotti" },
  { href: "/ricerca", label: "Ricerca" },
  { href: "/servizi", label: "Servizi" },
  { href: "/calcolo-longevita", label: "Calcolo longevità" },
] as const;
