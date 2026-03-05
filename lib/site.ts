export const siteConfig = {
  name: "Aevos Health",
  description:
    "Guide pratiche su longevità, prevenzione e performance quotidiana con approccio evidence-based.",
  domain: "https://aevos.it",
  locale: "it_IT",
} as const;

export type NavItem = { href: string; label: string };

export const navItemsByLocale: Record<string, NavItem[]> = {
  it: [
    { href: "/articoli", label: "Articoli" },
    { href: "/ricette", label: "Ricette" },
    { href: "/servizi", label: "Servizi" },
    { href: "/calcolo-longevita", label: "Calcolo longevità" },
  ],
  en: [
    { href: "/articles", label: "Articles" },
    { href: "/recipes", label: "Recipes" },
    { href: "/services", label: "Services" },
    { href: "/longevity-calculator", label: "Longevity Calculator" },
  ],
};

// Backward compat
export const navItems = navItemsByLocale.it;
