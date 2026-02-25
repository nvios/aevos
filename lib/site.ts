export const siteConfig = {
  name: "Aevos Health",
  description:
    "Guide pratiche su longevità, prevenzione e performance quotidiana con approccio evidence-based.",
  domain: "https://aevos.netfly.app",
  locale: "it_IT",
} as const;

export const navItems = [
  { href: "/articoli", label: "Articoli" },
  { href: "/ricette", label: "Ricette" },
  { href: "/servizi", label: "Servizi" },
  { href: "/calcolo-longevita", label: "Calcolo longevità" },
] as const;
