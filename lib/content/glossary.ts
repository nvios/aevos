export type GlossaryTerm = {
  term: string;
  definition: string;
  slug: string;
  relatedArticles?: string[]; // Slugs of related articles
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "AGEs",
    slug: "ages",
    definition: "Advanced Glycation End-products (Prodotti Finali della Glicazione Avanzata). Composti dannosi che si formano quando proteine o grassi si legano allo zucchero nel sangue. Contribuiscono all'invecchiamento e alle malattie croniche.",
    relatedArticles: ["miti-zuccheri"],
  },
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
    term: "Blue Zones",
    slug: "blue-zones",
    definition: "Regioni del mondo (come la Sardegna o Okinawa) dove le persone vivono molto più a lungo della media. Lo studio di queste zone ha rivelato abitudini comuni legate alla longevità.",
    relatedArticles: [],
  },
  {
    term: "Chetoni",
    slug: "chetoni",
    definition: "Molecole prodotte dal fegato a partire dai grassi quando la disponibilità di glucosio è scarsa (digiuno, dieta chetogenica). Forniscono un'energia efficiente per il cervello e il corpo.",
    relatedArticles: ["digiuno-intermittente-autofagia"],
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
    term: "Fruttosio",
    slug: "fruttosio",
    definition: "Uno zucchero semplice presente naturalmente nella frutta. A differenza del glucosio, viene metabolizzato quasi esclusivamente dal fegato. Un eccesso (da zuccheri aggiunti) può causare fegato grasso.",
    relatedArticles: ["miti-zuccheri"],
  },
  {
    term: "GABA",
    slug: "gaba",
    definition: "Acido Gamma-Amminobutirrico. Il principale neurotrasmettitore inibitorio del cervello, responsabile del rilassamento e della riduzione dell'eccitabilità neuronale.",
    relatedArticles: ["gut-health-microbioma", "12-consigli-pratici-sonno-insonnia"],
  },
  {
    term: "Glicazione",
    slug: "glicazione",
    definition: "Un processo in cui lo zucchero in eccesso nel sangue si lega alle proteine, danneggiandole e compromettendone la funzione. È una delle cause principali dell'invecchiamento dei tessuti.",
    relatedArticles: ["miti-zuccheri"],
  },
  {
    term: "Glucosio",
    slug: "glucosio",
    definition: "La principale fonte di energia per le cellule del corpo. Viene trasportato nel sangue e la sua concentrazione è regolata dall'insulina.",
    relatedArticles: ["miti-zuccheri", "insulina-resistenza-metabolismo"],
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
    term: "Indice Glicemico",
    slug: "indice-glicemico",
    definition: "Un valore che indica quanto rapidamente un alimento contenente carboidrati fa aumentare i livelli di glucosio nel sangue rispetto al glucosio puro.",
    relatedArticles: ["miti-zuccheri"],
  },
  {
    term: "Insulina Resistenza",
    slug: "insulina-resistenza",
    definition: "Una condizione in cui le cellule del corpo non rispondono adeguatamente all'insulina, portando a livelli elevati di glucosio nel sangue e aumentando il rischio di diabete di tipo 2.",
    relatedArticles: ["insulina-resistenza-metabolismo"],
  },
  {
    term: "Lipogenesi de novo",
    slug: "lipogenesi-de-novo",
    definition: "Il processo metabolico attraverso il quale il fegato converte l'eccesso di carboidrati (soprattutto fruttosio) in nuovi acidi grassi, contribuendo al fegato grasso.",
    relatedArticles: ["miti-zuccheri"],
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
    term: "Mitocondri",
    slug: "mitocondri",
    definition: "Le 'centrali elettriche' delle cellule. Organelli responsabili della produzione di energia (ATP). La loro salute ed efficienza diminuiscono con l'età, ma possono essere potenziate con l'esercizio e la dieta.",
    relatedArticles: ["esercizio-massimizzare-risultati", "hrv-vo2-rhr-guida"],
  },
  {
    term: "mTOR",
    slug: "mtor",
    definition: "mammalian Target of Rapamycin. Una proteina che funge da sensore centrale dei nutrienti, regolando la crescita cellulare e la sintesi proteica. La sua inibizione è legata all'autofagia e alla longevità.",
    relatedArticles: ["dieta-mima-digiuno-fmd", "miti-proteine"],
  },
  {
    term: "NAD+",
    slug: "nad-plus",
    definition: "Nicotinamide Adenina Dinucleotide. Un coenzima essenziale presente in tutte le cellule viventi. È cruciale per il metabolismo energetico e per l'attività delle sirtuine. I suoi livelli diminuiscono con l'età.",
    relatedArticles: [],
  },
  {
    term: "NAFLD",
    slug: "nafld",
    definition: "Non-Alcoholic Fatty Liver Disease (Steatosi Epatica Non Alcolica). L'accumulo di grasso nel fegato non causato dall'alcol, spesso dovuto a un eccesso di fruttosio e insulino-resistenza.",
    relatedArticles: ["miti-zuccheri"],
  },
  {
    term: "Nervo Vago",
    slug: "nervo-vago",
    definition: "Il decimo nervo cranico e il componente principale del sistema nervoso parasimpatico. Collega il cervello a cuore, polmoni e intestino, regolando la frequenza cardiaca, la digestione e l'infiammazione.",
    relatedArticles: ["respirazione-biologia-scienza", "hrv-vo2-rhr-guida"],
  },
  {
    term: "ORAC",
    slug: "orac",
    definition: "Oxygen Radical Absorbance Capacity. Un metodo di misurazione della capacità antiossidante di alimenti e sostanze biologiche.",
    relatedArticles: ["cibi-processati-impatto"],
  },
  {
    term: "Ormesi",
    slug: "ormesi",
    definition: "Un fenomeno biologico in cui l'esposizione a basse dosi di un agente stressante (come il freddo, il calore o l'esercizio fisico) stimola risposte adattative benefiche che rafforzano l'organismo.",
    relatedArticles: ["sauna-longevita-calore"],
  },
  {
    term: "Ossido Nitrico",
    slug: "ossido-nitrico",
    definition: "Una molecola gassosa prodotta nei seni paranasali (e nell'endotelio). È un potente vasodilatatore, migliora l'assorbimento di ossigeno e ha proprietà antimicrobiche.",
    relatedArticles: ["respirazione-biologia-scienza"],
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
    term: "Radicali Liberi",
    slug: "radicali-liberi",
    definition: "Molecole instabili prodotte durante il metabolismo o da fattori esterni (inquinamento, raggi UV). Possono danneggiare le cellule (stress ossidativo) se non neutralizzati dagli antiossidanti.",
    relatedArticles: ["cibi-processati-impatto"],
  },
  {
    term: "RHR",
    slug: "rhr",
    definition: "Resting Heart Rate (Frequenza Cardiaca a Riposo). Il numero di battiti del cuore al minuto quando il corpo è a completo riposo. Un RHR più basso indica generalmente una migliore efficienza cardiovascolare.",
    relatedArticles: ["hrv-vo2-rhr-guida"],
  },
  {
    term: "Saccarosio",
    slug: "saccarosio",
    definition: "Il comune zucchero da tavola. È un disaccaride composto da una molecola di glucosio e una di fruttosio legate insieme.",
    relatedArticles: ["miti-zuccheri"],
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
    term: "Senescenza Cellulare",
    slug: "senescenza-cellulare",
    definition: "Uno stato in cui le cellule smettono di dividersi ma non muoiono. Queste 'cellule zombie' accumulano danni e secernono sostanze infiammatorie che danneggiano i tessuti vicini.",
    relatedArticles: [],
  },
  {
    term: "Sindrome Metabolica",
    slug: "sindrome-metabolica",
    definition: "Un cluster di condizioni (pressione alta, glicemia alta, eccesso di grasso addominale, colesterolo anomalo) che aumentano il rischio di malattie cardiache, ictus e diabete.",
    relatedArticles: ["miti-zuccheri", "insulina-resistenza-metabolismo"],
  },
  {
    term: "Sirtuine",
    slug: "sirtuine",
    definition: "Una famiglia di proteine (SIRT1-7) che regolano la salute cellulare, la riparazione del DNA e il metabolismo. La loro attività è stimolata dal NAD+ e da pratiche come il digiuno.",
    relatedArticles: ["dieta-mima-digiuno-fmd"],
  },
  {
    term: "Stress Ossidativo",
    slug: "stress-ossidativo",
    definition: "Uno squilibrio tra la produzione di radicali liberi e la capacità del corpo di neutralizzarli con gli antiossidanti. È una causa chiave dell'invecchiamento e di molte malattie.",
    relatedArticles: ["miti-zuccheri", "cibi-processati-impatto"],
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
    term: "Glicina",
    slug: "glicina",
    definition: "Un amminoacido che agisce come neurotrasmettitore rilassante nel cervello. È fondamentale per la produzione di collagene, il sonno e la disintossicazione.",
    relatedArticles: ["guida-integratori"],
  },
  {
    term: "L-Teanina",
    slug: "l-teanina",
    definition: "Un amminoacido presente nel tè verde che promuove il rilassamento senza sonnolenza. Aumenta le onde alfa cerebrali e lavora in sinergia con la caffeina per migliorare la concentrazione.",
    relatedArticles: ["guida-integratori"],
  },
  {
    term: "Magnesio Bisglicinato",
    slug: "magnesio-bisglicinato",
    definition: "Una forma di magnesio legata all'amminoacido glicina. È altamente assorbibile e delicato sullo stomaco. Ideale per favorire il rilassamento, il sonno e il recupero muscolare.",
    relatedArticles: ["guida-integratori", "12-consigli-pratici-sonno-insonnia"],
  },
  {
    term: "Adenosina",
    slug: "adenosina",
    definition: "Un neurotrasmettitore che si accumula nel cervello durante la veglia, creando la 'pressione del sonno'. Viene eliminata durante il sonno. La caffeina agisce bloccando i recettori dell'adenosina.",
    relatedArticles: ["12-consigli-pratici-sonno-insonnia"],
  },
  {
    term: "Journaling",
    slug: "journaling",
    definition: "La pratica di scrivere regolarmente pensieri, sentimenti ed esperienze. È uno strumento potente per la gestione dello stress, l'elaborazione emotiva e il miglioramento della salute mentale.",
    relatedArticles: ["12-consigli-pratici-sonno-insonnia"],
  },
  {
    term: "Melatonina",
    slug: "melatonina",
    definition: "L'ormone che regola il ciclo sonno-veglia. Prodotta dalla ghiandola pineale in risposta al buio, segnala al corpo che è ora di dormire. La luce blu (schermi) ne inibisce la produzione.",
    relatedArticles: ["12-consigli-pratici-sonno-insonnia", "ritmo-circadiano-master-clock"],
  },
  {
    term: "REM",
    slug: "rem",
    definition: "Rapid Eye Movement. La fase del sonno caratterizzata da sogni vividi, paralisi muscolare e attività cerebrale simile alla veglia. È cruciale per la memoria, l'apprendimento e la regolazione emotiva.",
    relatedArticles: ["12-consigli-pratici-sonno-insonnia"],
  },
  {
    term: "Respirazione 4-7-8",
    slug: "respirazione-4-7-8",
    definition: "Una tecnica di respirazione rilassante: inspira per 4 secondi, trattieni per 7, espira per 8. Attiva il sistema nervoso parasimpatico, riducendo ansia e favorendo il sonno.",
    relatedArticles: ["12-consigli-pratici-sonno-insonnia"],
  },
  {
    term: "Sistema Nervoso Parasimpatico",
    slug: "sistema-nervoso-parasimpatico",
    definition: "La parte del sistema nervoso autonomo responsabile delle funzioni di 'riposo e digestione'. Rallenta il battito cardiaco, stimola la digestione e promuove il rilassamento e il recupero.",
    relatedArticles: ["respirazione-biologia-scienza", "hrv-vo2-rhr-guida"],
  },
  {
    term: "Sonno Profondo",
    slug: "sonno-profondo",
    definition: "O sonno a onde lente (NREM fase 3). La fase più rigenerativa del sonno, in cui avviene il recupero fisico, la riparazione dei tessuti, la pulizia del cervello (sistema glinfatico) e il rilascio dell'ormone della crescita.",
    relatedArticles: ["12-consigli-pratici-sonno-insonnia"],
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
