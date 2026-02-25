export type GlossaryTerm = {
  term: string;
  definition: string;
  slug: string;
  relatedArticles?: string[]; // Slugs of related articles
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "ApoB",
    slug: "apob",
    definition: "Apolipoproteina B. La proteina principale presente nelle particelle di colesterolo 'cattivo' (LDL, VLDL). È considerata un indicatore più preciso del rischio cardiovascolare rispetto al solo colesterolo LDL.",
    relatedArticles: ["biomarker-longevita-guida"],
  },
  {
    term: "Autofagia",
    slug: "autofagia",
    definition: "Un processo cellulare di 'pulizia' in cui la cellula degrada e ricicla i propri componenti danneggiati o non necessari. È fondamentale per il rinnovamento cellulare e la longevità.",
    relatedArticles: ["digiuno-intermittente-autofagia", "dieta-mima-digiuno-fmd"],
  },
  {
    term: "Cortisolo",
    slug: "cortisolo",
    definition: "Un ormone steroideo prodotto dalle ghiandole surrenali in risposta allo stress. Livelli cronicamente elevati possono avere effetti negativi su metabolismo, sistema immunitario e salute mentale.",
    relatedArticles: ["cortisolo-stress-cronico", "ritmo-circadiano-master-clock"],
  },
  {
    term: "Disbiosi",
    slug: "disbiosi",
    definition: "Uno squilibrio nella composizione o nella funzione del microbioma, spesso associato a disturbi gastrointestinali, infiammazione e altre patologie.",
    relatedArticles: ["gut-health-microbioma", "microbioma"],
  },
  {
    term: "EPOC",
    slug: "epoc",
    definition: "Excess Post-exercise Oxygen Consumption. Il fenomeno per cui il corpo continua a bruciare calorie a un tasso elevato anche dopo la fine dell'allenamento per ripristinare l'equilibrio fisiologico.",
    relatedArticles: ["esercizio-massimizzare-risultati"],
  },
  {
    term: "FMD",
    slug: "fmd",
    definition: "Fasting Mimicking Diet (Dieta Mima Digiuno). Un protocollo alimentare a basso contenuto calorico e proteico progettato per indurre gli effetti benefici del digiuno (come l'autofagia) pur continuando a mangiare.",
    relatedArticles: ["dieta-mima-digiuno-fmd"],
  },
  {
    term: "GABA",
    slug: "gaba",
    definition: "Acido Gamma-Amminobutirrico. Il principale neurotrasmettitore inibitorio del cervello, responsabile del rilassamento e della riduzione dell'eccitabilità neuronale.",
    relatedArticles: ["gut-health-microbioma", "12-consigli-pratici-sonno-insonnia"],
  },
  {
    term: "GLUT4",
    slug: "glut4",
    definition: "Una proteina che trasporta il glucosio dal sangue all'interno delle cellule muscolari e adipose. L'esercizio fisico può attivare i GLUT4 indipendentemente dall'insulina.",
    relatedArticles: ["insulina-resistenza-metabolismo", "esercizio-massimizzare-risultati"],
  },
  {
    term: "HbA1c",
    slug: "hba1c",
    definition: "Emoglobina Glicata. Un test che misura la media dei livelli di zucchero nel sangue negli ultimi 3 mesi, offrendo una visione a lungo termine del controllo glicemico.",
    relatedArticles: ["biomarker-longevita-guida", "insulina-resistenza-metabolismo"],
  },
  {
    term: "HIIT",
    slug: "hiit",
    definition: "High Intensity Interval Training. Una forma di allenamento cardiovascolare che alterna brevi periodi di esercizio anaerobico intenso a periodi di recupero meno intensi.",
    relatedArticles: ["esercizio-massimizzare-risultati", "hrv-vo2-rhr-guida"],
  },
  {
    term: "HOMA-IR",
    slug: "homa-ir",
    definition: "Homeostatic Model Assessment for Insulin Resistance. Un indice utilizzato per stimare la resistenza all'insulina e la funzione delle cellule beta del pancreas.",
    relatedArticles: ["insulina-resistenza-metabolismo"],
  },
  {
    term: "HRV",
    slug: "hrv",
    definition: "Heart Rate Variability (Variabilità della Frequenza Cardiaca). La variazione nell'intervallo di tempo tra battiti cardiaci consecutivi. È un indicatore chiave dello stato del sistema nervoso autonomo e del recupero.",
    relatedArticles: ["hrv-vo2-rhr-guida", "gadget-sonno-tracker"],
  },
  {
    term: "hs-CRP",
    slug: "hs-crp",
    definition: "High-sensitivity C-reactive Protein. Una proteina prodotta dal fegato che aumenta in presenza di infiammazione. La versione ad alta sensibilità è usata per valutare il rischio cardiovascolare.",
    relatedArticles: ["biomarker-longevita-guida"],
  },
  {
    term: "IGF-1",
    slug: "igf-1",
    definition: "Insulin-like Growth Factor 1. Un ormone simile all'insulina che regola la crescita cellulare. Livelli ridotti sono associati a una maggiore longevità in molti organismi modello.",
    relatedArticles: ["dieta-mima-digiuno-fmd", "miti-proteine"],
  },
  {
    term: "Insulina Resistenza",
    slug: "insulina-resistenza",
    definition: "Una condizione in cui le cellule del corpo non rispondono adeguatamente all'insulina, portando a livelli elevati di glucosio nel sangue e aumentando il rischio di diabete di tipo 2.",
    relatedArticles: ["insulina-resistenza-metabolismo"],
  },
  {
    term: "MACs",
    slug: "macs",
    definition: "Microbiota Accessible Carbohydrates. Carboidrati complessi (fibre) che non vengono digeriti dall'ospite ma sono fermentabili dai batteri intestinali, promuovendo un microbioma sano.",
    relatedArticles: ["gut-health-microbioma", "miti-fibre"],
  },
  {
    term: "MED",
    slug: "med",
    definition: "Minimum Effective Dose (Dose Minima Efficace). Il concetto di trovare la quantità minima di uno stimolo (come l'esercizio fisico o un integratore) necessaria per ottenere il risultato desiderato, massimizzando l'efficienza e riducendo lo stress inutile.",
    relatedArticles: ["esercizio-massimizzare-risultati"],
  },
  {
    term: "Microbioma",
    slug: "microbioma",
    definition: "L'insieme di microrganismi (batteri, virus, funghi) che vivono in un determinato ambiente, come l'intestino umano. Svolge un ruolo cruciale nella digestione, nel sistema immunitario e nella sintesi di vitamine.",
    relatedArticles: ["microbioma", "gut-health-microbioma"],
  },
  {
    term: "mTOR",
    slug: "mtor",
    definition: "mammalian Target of Rapamycin. Una proteina che funge da sensore centrale dei nutrienti, regolando la crescita cellulare e la sintesi proteica. La sua inibizione è legata all'autofagia e alla longevità.",
    relatedArticles: ["dieta-mima-digiuno-fmd", "miti-proteine"],
  },
  {
    term: "ORAC",
    slug: "orac",
    definition: "Oxygen Radical Absorbance Capacity. Un metodo di misurazione della capacità antiossidante di alimenti e sostanze biologiche.",
    relatedArticles: ["cibi-processati-impatto"],
  },
  {
    term: "Polifenoli",
    slug: "polifenoli",
    definition: "Composti naturali presenti nelle piante con potenti proprietà antiossidanti e antinfiammatorie. Molti polifenoli agiscono anche come prebiotici.",
    relatedArticles: ["gut-health-microbioma"],
  },
  {
    term: "Prebiotici",
    slug: "prebiotici",
    definition: "Sostanze non digeribili (spesso fibre) che stimolano selettivamente la crescita e/o l'attività di uno o più batteri nel colon, migliorando la salute dell'ospite.",
    relatedArticles: ["gut-health-microbioma"],
  },
  {
    term: "Probiotici",
    slug: "probiotici",
    definition: "Microrganismi vivi che, se somministrati in quantità adeguate, conferiscono un beneficio alla salute dell'ospite.",
    relatedArticles: ["gut-health-microbioma", "guida-integratori"],
  },
  {
    term: "RHR",
    slug: "rhr",
    definition: "Resting Heart Rate (Frequenza Cardiaca a Riposo). Il numero di battiti del cuore al minuto quando il corpo è a completo riposo. Un RHR più basso indica generalmente una migliore efficienza cardiovascolare.",
    relatedArticles: ["hrv-vo2-rhr-guida"],
  },
  {
    term: "SCFA",
    slug: "scfa",
    definition: "Short Chain Fatty Acids (Acidi Grassi a Catena Corta). Prodotti dalla fermentazione batterica delle fibre nell'intestino. Sono fondamentali per la salute del colon e il metabolismo.",
    relatedArticles: ["gut-health-microbioma", "miti-fibre"],
  },
  {
    term: "SCN",
    slug: "scn",
    definition: "Nucleo Soprachiasmatico. Una piccola regione dell'ipotalamo che funge da 'orologio mastro' del corpo, coordinando i ritmi circadiani in risposta alla luce.",
    relatedArticles: ["ritmo-circadiano-master-clock"],
  },
  {
    term: "Telomeri",
    slug: "telomeri",
    definition: "Le estremità protettive dei cromosomi. Si accorciano ogni volta che una cellula si divide e la loro lunghezza è considerata un indicatore dell'invecchiamento biologico.",
    relatedArticles: ["eta-biologica"],
  },
  {
    term: "VO2 Max",
    slug: "vo2-max",
    definition: "Il volume massimo di ossigeno che il corpo può utilizzare durante un esercizio fisico intenso. È considerato uno dei migliori indicatori di fitness cardiorespiratorio e longevità.",
    relatedArticles: ["hrv-vo2-rhr-guida", "biomarker-longevita-guida"],
  },
  {
    term: "Zeitgeber",
    slug: "zeitgeber",
    definition: "Dal tedesco 'donatore di tempo'. Qualsiasi segnale esterno (come la luce solare o il cibo) che sincronizza i ritmi biologici dell'organismo con il ciclo di 24 ore della Terra.",
    relatedArticles: ["ritmo-circadiano-master-clock"],
  },
  {
    term: "Zona 2",
    slug: "zona-2",
    definition: "Allenamento a bassa intensità (60-70% della frequenza cardiaca massima) che migliora la funzione mitocondriale e la capacità di ossidare i grassi. Fondamentale per la salute metabolica e la longevità.",
    relatedArticles: ["hrv-vo2-rhr-guida", "esercizio-massimizzare-risultati"],
  },
  {
    term: "Zona 5",
    slug: "zona-5",
    definition: "Allenamento ad altissima intensità (90-100% della frequenza cardiaca massima), tipico dell'HIIT. Utile per migliorare il VO2 Max e la potenza cardiaca.",
    relatedArticles: ["hrv-vo2-rhr-guida", "esercizio-massimizzare-risultati"],
  }
].sort((a, b) => a.term.localeCompare(b.term));

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return glossaryTerms;
}

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((term) => term.slug === slug);
}
