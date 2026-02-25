export type CategoryConfig = {
  slug: string;
  title: string;
  description: string;
  iconName: "Moon" | "Dumbbell" | "Utensils" | "Sparkles" | "Scissors" | "Activity" | "HeartPulse" | "Brain" | "Zap";
  heroTitle: string;
  heroDescription: string;
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

export function getCategoryBySlug(slug: string) {
  return categories.find(c => c.slug === slug);
}

export function getAllCategories() {
  return categories;
}
