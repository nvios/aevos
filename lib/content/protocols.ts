export interface Protocol {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  seoDescription: string;
  features: string[];
  pricing: {
    tier: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    ctaLink: string;
  }[];
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const PROTOCOLS: Record<string, Protocol> = {
  'sonno': {
    slug: 'sonno',
    title: 'Protocollo Sonno e Recupero',
    subtitle: 'Ottimizza il tuo riposo notturno per massimizzare energia e longevità.',
    description: 'Un percorso completo per analizzare la qualità del tuo sonno, identificare i disturbi nascosti e ristabilire i ritmi circadiani naturali per un recupero profondo.',
    seoDescription: 'Migliora la qualità del sonno con il Protocollo Aevos. Analisi avanzata e strategie personalizzate per combattere insonnia e stanchezza cronica.',
    features: [
      'Analisi del cronotipo',
      'Monitoraggio avanzato del sonno',
      'Strategie di igiene del sonno',
      'Integrazione personalizzata'
    ],
    pricing: [
      {
        tier: 'Base',
        price: '€149',
        description: 'Analisi iniziale e piano d\'azione.',
        features: [
          'Valutazione cronotipo',
          'Diario del sonno guidato',
          'Piano di igiene del sonno',
          'Consigli su integratori base'
        ],
        cta: 'Inizia Ora',
        ctaLink: '/contatti?protocollo=sonno-base'
      },
      {
        tier: 'Avanzato',
        price: '€399',
        description: 'Monitoraggio strumentale e supporto continuo.',
        features: [
          'Tutto nel pacchetto Base',
          'Analisi con dispositivo wearable (Oura/Whoop)',
          'Analisi ormonale (Cortisolo/Melatonina)',
          'Follow-up mensile per 3 mesi'
        ],
        cta: 'Prenota Consulenza',
        ctaLink: '/contatti?protocollo=sonno-avanzato'
      }
    ],
    benefits: [
      {
        title: 'Energia Costante',
        description: 'Svegliati riposato e mantieni alti livelli di energia tutto il giorno.',
        icon: 'Zap'
      },
      {
        title: 'Chiarezza Mentale',
        description: 'Migliora focus, memoria e capacità decisionale.',
        icon: 'Brain'
      },
      {
        title: 'Equilibrio Ormonale',
        description: 'Regola cortisolo e melatonina per un benessere generale.',
        icon: 'Activity'
      }
    ],
    faq: [
      {
        question: 'Quanto dura il protocollo?',
        answer: 'Il protocollo base dura 4 settimane, mentre quello avanzato prevede un monitoraggio di 3 mesi.'
      },
      {
        question: 'Devo acquistare dispositivi aggiuntivi?',
        answer: 'Per il pacchetto avanzato utilizziamo dati da wearable. Se ne possiedi già uno (Apple Watch, Oura, Garmin) possiamo integrarlo, altrimenti ti consiglieremo il migliore per te.'
      }
    ]
  },
  'pelle': {
    slug: 'pelle',
    title: 'Protocollo Pelle e Luminosità',
    subtitle: 'Analisi dermatologica avanzata e trattamenti per una pelle sana e giovane.',
    description: 'La salute della pelle parte dall\'interno. Combiniamo analisi dermatologica, nutrizione e integrazione mirata per risultati visibili e duraturi.',
    seoDescription: 'Protocollo dermatologico Aevos per una pelle luminosa e sana. Trattamenti personalizzati anti-aging e per problematiche specifiche.',
    features: [
      'Check-up dermatologico',
      'Analisi nutrizionale',
      'Piano di skincare personalizzato',
      'Integrazione mirata'
    ],
    pricing: [
      {
        tier: 'Essential',
        price: '€199',
        description: 'Analisi della pelle e routine personalizzata.',
        features: [
          'Analisi digitale della pelle',
          'Valutazione nutrizionale base',
          'Routine skincare mattino/sera',
          'Piano alimentare skin-friendly'
        ],
        cta: 'Scopri di più',
        ctaLink: '/contatti?protocollo=pelle-essential'
      },
      {
        tier: 'Complete',
        price: '€450',
        description: 'Approccio a 360° interno ed esterno.',
        features: [
          'Tutto nel pacchetto Essential',
          'Test intolleranze alimentari',
          'Piano di integrazione collagene/antiossidanti',
          '2 controlli dermatologici'
        ],
        cta: 'Prenota Ora',
        ctaLink: '/contatti?protocollo=pelle-complete'
      }
    ],
    benefits: [
      {
        title: 'Luminosità Naturale',
        description: 'Ritrova il colorito sano e la texture levigata.',
        icon: 'Sun'
      },
      {
        title: 'Anti-Aging Reale',
        description: 'Agisci sulle cause dell\'invecchiamento, non solo sui sintomi.',
        icon: 'Clock'
      },
      {
        title: 'Riduzione Infiammazione',
        description: 'Migliora acne, rossori e sensibilità cutanea.',
        icon: 'Shield'
      }
    ],
    faq: [
      {
        question: 'È adatto per l\'acne?',
        answer: 'Sì, abbiamo protocolli specifici per pelle a tendenza acneica che lavorano sull\'infiammazione sistemica.'
      },
      {
        question: 'Include trattamenti estetici?',
        answer: 'Il protocollo è clinico/nutrizionale. Possiamo consigliare trattamenti estetici partner, ma il focus è sulla salute biologica della pelle.'
      }
    ]
  },
  'capelli-pelle': {
    slug: 'capelli-pelle',
    title: 'Protocollo Capelli e Pelle',
    subtitle: 'Approccio integrato per la salute e la bellezza di capelli e pelle.',
    description: 'Un percorso sinergico che affronta le cause comuni di caduta dei capelli e invecchiamento cutaneo: stress ossidativo, carenze nutrizionali e squilibri ormonali.',
    seoDescription: 'Rafforza capelli e pelle con il protocollo integrato Aevos. Soluzioni scientifiche per caduta capelli e invecchiamento cutaneo.',
    features: [
      'Tricoscopia digitale',
      'Analisi del cuoio capelluto',
      'Screening ormonale mirato',
      'Piano nutrizionale rinforzante'
    ],
    pricing: [
      {
        tier: 'Intensive',
        price: '€550',
        description: 'Azione d\'urto per pelle e capelli.',
        features: [
          'Analisi pelle e capelli completa',
          'Screening ormonale (Tiroide, Androgeni)',
          'Piano nutrizionale personalizzato',
          'Integrazione specifica per cheratina e collagene',
          'Monitoraggio a 3 e 6 mesi'
        ],
        cta: 'Inizia il Percorso',
        ctaLink: '/contatti?protocollo=capelli-pelle'
      }
    ],
    benefits: [
      {
        title: 'Capelli più Forti',
        description: 'Riduci la caduta e migliora la densità capillare.',
        icon: 'Activity' // Placeholder icon
      },
      {
        title: 'Pelle Elastica',
        description: 'Migliora idratazione ed elasticità cutanea.',
        icon: 'Smile'
      },
      {
        title: 'Benessere Totale',
        description: 'Correggi le carenze che influenzano bellezza ed energia.',
        icon: 'Heart'
      }
    ],
    faq: [
      {
        question: 'Quanto tempo per vedere i risultati sui capelli?',
        answer: 'Il ciclo del capello è lento. I primi risultati visibili sulla qualità del fusto si notano dopo 3-4 mesi.'
      }
    ]
  },
  'longevita': {
    slug: 'longevita',
    title: 'Protocollo Longevità Completo',
    subtitle: 'Il gold standard per l\'analisi dell\'età biologica e la prevenzione.',
    description: 'Il nostro programma di punta. Una mappatura completa della tua salute attuale e futura, basata sulle più recenti scoperte della medicina della longevità.',
    seoDescription: 'Protocollo Longevità Aevos: misura la tua età biologica e rallenta l\'invecchiamento. Check-up completo e strategia personalizzata.',
    features: [
      'Analisi età biologica',
      'Screening genetico (opzionale)',
      'Valutazione cardiovascolare avanzata',
      'Piano nutrizionale e di allenamento pro-longevità'
    ],
    pricing: [
      {
        tier: 'Silver',
        price: '€800',
        description: 'Check-up annuale completo.',
        features: [
          'Analisi ematica estesa (50+ marker)',
          'Test epigenetico età biologica',
          'Valutazione composizione corporea (DEXA/BIA)',
          'Report dettagliato e piano d\'azione'
        ],
        cta: 'Prenota Check-up',
        ctaLink: '/contatti?protocollo=longevita-silver'
      },
      {
        tier: 'Gold',
        price: '€2500',
        description: 'La massima espressione della medicina preventiva.',
        features: [
          'Tutto nel pacchetto Silver',
          'Screening genomico completo',
          'Analisi microbioma intestinale',
          'Monitoraggio continuo con medico dedicato',
          'Accesso prioritario ai servizi'
        ],
        cta: 'Richiedi Informazioni',
        ctaLink: '/contatti?protocollo=longevita-gold'
      }
    ],
    benefits: [
      {
        title: 'Prevenzione Attiva',
        description: 'Identifica e mitiga i rischi prima che diventino problemi.',
        icon: 'Shield'
      },
      {
        title: 'Ottimizzazione',
        description: 'Porta le tue performance fisiche e mentali al livello successivo.',
        icon: 'TrendingUp'
      },
      {
        title: 'Futuro in Salute',
        description: 'Investi oggi per guadagnare anni di vita in salute (healthspan).',
        icon: 'Calendar'
      }
    ],
    faq: [
      {
        question: 'Cos\'è l\'età biologica?',
        answer: 'È la velocità a cui stai invecchiando internamente, che può essere diversa dalla tua età anagrafica. Possiamo misurarla e migliorarla.'
      },
      {
        question: 'È detraibile?',
        answer: 'Le prestazioni sanitarie incluse sono detraibili come spese mediche.'
      }
    ]
  }
};
