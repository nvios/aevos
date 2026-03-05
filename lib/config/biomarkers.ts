export interface Biomarker {
  id: string;
  name: string;
  unit: string;
  category: 'metabolic' | 'inflammation' | 'hormonal' | 'nutritional' | 'functional' | 'body_comp';
  description: string;
  normalRange: { min: number; max: number };
  optimalRange: { min: number; max: number };
  upsellMessage: string; // Message shown when user clicks "I don't have this data"
  protocolSlug: string; // Slug of the protocol to upsell
}

export const BIOMARKERS: Biomarker[] = [
  // Metabolic
  {
    id: 'hba1c',
    name: 'Emoglobina Glicata (HbA1c)',
    unit: '%',
    category: 'metabolic',
    description: 'Indicatore medio dei livelli di glucosio nel sangue negli ultimi 3 mesi.',
    normalRange: { min: 4.0, max: 5.7 },
    optimalRange: { min: 4.5, max: 5.2 },
    upsellMessage: 'La glicata è fondamentale per capire la tua salute metabolica e il rischio di diabete. Misurala con precisione nel nostro protocollo Longevità.',
    protocolSlug: 'longevita'
  },
  {
    id: 'ldl',
    name: 'Colesterolo LDL',
    unit: 'mg/dL',
    category: 'metabolic',
    description: 'Il cosiddetto "colesterolo cattivo", principale fattore di rischio cardiovascolare.',
    normalRange: { min: 0, max: 130 },
    optimalRange: { min: 40, max: 80 },
    upsellMessage: 'Conoscere il tuo LDL è il primo passo per proteggere il tuo cuore. Includiamo un profilo lipidico completo nel nostro check-up.',
    protocolSlug: 'longevita'
  },
  {
    id: 'hdl',
    name: 'Colesterolo HDL',
    unit: 'mg/dL',
    category: 'metabolic',
    description: 'Il "colesterolo buono" che aiuta a rimuovere il colesterolo dalle arterie.',
    normalRange: { min: 40, max: 100 },
    optimalRange: { min: 60, max: 90 },
    upsellMessage: 'Un HDL ottimale è segno di buona salute metabolica. Verificalo con noi.',
    protocolSlug: 'longevita'
  },
  {
    id: 'triglycerides',
    name: 'Trigliceridi',
    unit: 'mg/dL',
    category: 'metabolic',
    description: 'Grassi nel sangue legati alla dieta e al metabolismo degli zuccheri.',
    normalRange: { min: 0, max: 150 },
    optimalRange: { min: 40, max: 80 },
    upsellMessage: 'Trigliceridi alti spesso indicano insulino-resistenza. Misurali ora.',
    protocolSlug: 'longevita'
  },
  
  // Inflammation
  {
    id: 'hs_crp',
    name: 'Proteina C Reattiva (hs-CRP)',
    unit: 'mg/L',
    category: 'inflammation',
    description: 'Marker di infiammazione sistemica di basso grado.',
    normalRange: { min: 0, max: 3.0 },
    optimalRange: { min: 0, max: 0.5 },
    upsellMessage: 'L\'infiammazione cronica è il killer silenzioso. Il test hs-CRP è incluso nel nostro pacchetto infiammazione.',
    protocolSlug: 'longevita'
  },

  // Nutritional / Hormonal
  {
    id: 'vitamin_d',
    name: 'Vitamina D (25-OH)',
    unit: 'ng/mL',
    category: 'nutritional',
    description: 'Ormone essenziale per ossa, immunità e umore.',
    normalRange: { min: 30, max: 100 },
    optimalRange: { min: 50, max: 80 },
    upsellMessage: 'La carenza di Vitamina D è comunissima e impatta tutto, dall\'umore alle ossa. Scoprilo subito.',
    protocolSlug: 'longevita'
  },
  {
    id: 'ferritin',
    name: 'Ferritina',
    unit: 'ng/mL',
    category: 'nutritional',
    description: 'Riserva di ferro dell\'organismo.',
    normalRange: { min: 30, max: 400 },
    optimalRange: { min: 50, max: 150 },
    upsellMessage: 'Stanchezza cronica? Potrebbe essere la ferritina. Controllala con noi.',
    protocolSlug: 'longevita'
  },
  {
    id: 'tsh',
    name: 'TSH',
    unit: 'mIU/L',
    category: 'hormonal',
    description: 'Ormone stimolante la tiroide, regola il metabolismo.',
    normalRange: { min: 0.4, max: 4.0 },
    optimalRange: { min: 1.0, max: 2.5 },
    upsellMessage: 'La tiroide regola il tuo metabolismo. Un controllo TSH è rapido e fondamentale.',
    protocolSlug: 'longevita'
  },

  // Functional / Wearable Data
  {
    id: 'hrv',
    name: 'HRV (Variabilità Cardiaca)',
    unit: 'ms',
    category: 'functional',
    description: 'Misura della variazione di tempo tra i battiti cardiaci. Indica lo stato di recupero e stress.',
    normalRange: { min: 20, max: 150 },
    optimalRange: { min: 50, max: 100 }, // Highly individual, but >50 is generally good
    upsellMessage: 'L\'HRV è un potente indicatore di stress. Possiamo misurarlo con precisione clinica.',
    protocolSlug: 'sonno'
  },
  {
    id: 'rhr',
    name: 'RHR (Battiti a Riposo)',
    unit: 'bpm',
    category: 'functional',
    description: 'Frequenza cardiaca a riposo. Più è bassa (entro limiti fisiologici), più il cuore è efficiente.',
    normalRange: { min: 50, max: 90 },
    optimalRange: { min: 40, max: 60 },
    upsellMessage: 'Un RHR elevato può indicare sovrallenamento o stress. Verificalo nel nostro check-up.',
    protocolSlug: 'longevita'
  },
  {
    id: 'vo2max',
    name: 'VO2 Max',
    unit: 'ml/kg/min',
    category: 'functional',
    description: 'Il massimo volume di ossigeno che il corpo può utilizzare. Il miglior predittore di longevità.',
    normalRange: { min: 30, max: 60 },
    optimalRange: { min: 45, max: 70 },
    upsellMessage: 'Il VO2 Max è il parametro #1 per la longevità. Misuralo con il nostro test da sforzo.',
    protocolSlug: 'longevita'
  },

  // Lab / Physical
  {
    id: 'lean_mass',
    name: 'Massa Magra (Lean Mass)',
    unit: '%',
    category: 'body_comp',
    description: 'Percentuale di peso corporeo non grasso (muscoli, ossa, acqua).',
    normalRange: { min: 70, max: 90 },
    optimalRange: { min: 80, max: 95 }, // Higher is generally better (lower body fat)
    upsellMessage: 'La massa muscolare è la tua "pensione" di salute. Misurala con la nostra analisi BIA professionale.',
    protocolSlug: 'longevita'
  },
  {
    id: 'grip_strength',
    name: 'Grip Strength (Forza Presa)',
    unit: 'kg',
    category: 'functional',
    description: 'Forza della presa della mano. Correlata alla forza totale e alla longevità.',
    normalRange: { min: 25, max: 70 },
    optimalRange: { min: 40, max: 80 }, // Men >40, Women >25 roughly
    upsellMessage: 'La forza della presa predice la mortalità meglio della pressione sanguigna. Testala ora con il nostro dinamometro digitale.',
    protocolSlug: 'longevita'
  }
];
