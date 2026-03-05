export type CategoryConfig = {
  slug: string;
  title: string;
  description: string;
  iconName: "Moon" | "Dumbbell" | "Utensils" | "Sparkles" | "Scissors" | "Activity" | "HeartPulse" | "Brain" | "Zap";
  heroTitle: string;
  heroDescription: string;
};

type CategoryTranslations = Record<string, {
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
}>;

const categoryTranslations: Record<string, CategoryTranslations> = {
  en: {
    sonno: {
      title: "Sleep",
      description: "Sleep is the most powerful predictor of longevity, yet 83% of adults don't reach optimal sleep levels.",
      heroTitle: "Sleep Articles",
      heroDescription: "Discover how to optimize your rest to maximize energy, mental focus, and physical recovery.",
    },
    esercizio: {
      title: "Exercise",
      description: "VO2 max correlates with a 50% reduction in mortality. Build a resilient metabolic engine.",
      heroTitle: "Exercise Articles",
      heroDescription: "Build strength and endurance with sustainable, scientifically validated training protocols.",
    },
    nutrizione: {
      title: "Nutrition",
      description: "Moderate caloric restriction and meal timing can extend healthy lifespan by up to 15%.",
      heroTitle: "Nutrition Articles",
      heroDescription: "Practical dietary strategies to nourish your body, improve metabolism, and support longevity.",
    },
    "skin-care": {
      title: "Skin Care",
      description: "Skin is the first immune barrier. 90% of visible aging is caused by preventable photo-damage.",
      heroTitle: "Skin Care Articles",
      heroDescription: "Treatments and routines for healthy, radiant skin protected from the signs of aging.",
    },
    capelli: {
      title: "Hair",
      description: "Follicle health reflects systemic inflammatory status. Act on biological markers before hair loss becomes visible.",
      heroTitle: "Hair Articles",
      heroDescription: "Strategies for strong, vital hair — from preventing loss to maintaining density.",
    },
    longevita: {
      title: "Longevity",
      description: "Holistic and scientific approaches to extend not just lifespan, but the quality of years lived.",
      heroTitle: "Longevity Articles",
      heroDescription: "Protocols, habits, and mindset for those who want to live at their full biological potential.",
    },
    tecnologie: {
      title: "Technology",
      description: "Advanced devices, gadgets, and tools for health monitoring and optimization.",
      heroTitle: "Health Technologies",
      heroDescription: "Reviews and usage guides for wearables, therapeutic lights, and biohacking tools.",
    },
  },
};

export const categories: CategoryConfig[] = [
  {
    slug: "sonno",
    title: "Sonno",
    description: "Il sonno è il predittore più potente della longevità, eppure l'83% degli adulti non raggiunge la quota ottimale di sonno.",
    iconName: "Moon",
    heroTitle: "Articoli Sonno",
    heroDescription: "Scopri come ottimizzare il tuo riposo per massimizzare energia, focus mentale e recupero fisico."
  },
  {
    slug: "esercizio",
    title: "Esercizio",
    description: "Il VO2 max è correlato a una riduzione del 50% della mortalità. Costruisci un motore metabolico resiliente.",
    iconName: "Dumbbell",
    heroTitle: "Articoli Esercizio",
    heroDescription: "Costruisci forza e resistenza con protocolli di allenamento sostenibili e scientificamente validati."
  },
  {
    slug: "nutrizione",
    title: "Nutrizione",
    description: "La restrizione calorica moderata e il timing dei pasti possono estendere la durata della vita sana fino al 15%.",
    iconName: "Utensils",
    heroTitle: "Articoli Nutrizione",
    heroDescription: "Strategie alimentari pratiche per nutrire il tuo corpo, migliorare il metabolismo e sostenere la longevità."
  },
  {
    slug: "skin-care",
    title: "Skin Care",
    description: "La pelle è la prima barriera immunitaria. Il 90% dell'invecchiamento visibile è causato dal foto-danneggiamento prevenibile.",
    iconName: "Sparkles",
    heroTitle: "Articoli Skin Care",
    heroDescription: "Trattamenti e routine per una pelle sana, luminosa e protetta dai segni del tempo."
  },
  {
    slug: "capelli",
    title: "Capelli",
    description: "La salute del follicolo riflette lo stato infiammatorio sistemico. Intervieni sui marker biologici prima che la caduta diventi visibile.",
    iconName: "Scissors",
    heroTitle: "Articoli Hair",
    heroDescription: "Strategie per capelli forti e vitali, dalla prevenzione della caduta al mantenimento della densità."
  },
  {
    slug: "longevita",
    title: "Longevità",
    description: "Approcci olistici e scientifici per estendere non solo la durata della vita, ma la qualità degli anni vissuti.",
    iconName: "Activity",
    heroTitle: "Articoli Longevità",
    heroDescription: "Protocolli, abitudini e mindset per chi vuole vivere al massimo del potenziale biologico."
  },
  {
    slug: "tecnologie",
    title: "Tecnologie",
    description: "Dispositivi, gadget e strumenti avanzati per il monitoraggio e l'ottimizzazione della salute.",
    iconName: "Zap",
    heroTitle: "Tecnologie per la Salute",
    heroDescription: "Recensioni e guide all'uso di wearable, luci terapeutiche e strumenti di biohacking."
  }
];

/** Returns the category with locale-aware labels. */
export function getCategoryBySlug(slug: string, locale: string = 'it') {
  const base = categories.find(c => c.slug === slug);
  if (!base) return undefined;
  if (locale === 'it') return base;

  const t = categoryTranslations[locale]?.[slug];
  if (!t) return base;

  return { ...base, ...t };
}

/** Returns all categories with locale-aware labels. */
export function getAllCategories(locale: string = 'it') {
  return categories.map(cat => {
    if (locale === 'it') return cat;
    const t = categoryTranslations[locale]?.[cat.slug];
    return t ? { ...cat, ...t } : cat;
  });
}
