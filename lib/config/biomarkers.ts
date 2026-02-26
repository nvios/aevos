export interface Biomarker {
  id: string;
  name: string;
  unit: string;
  category: 'metabolic' | 'inflammation' | 'hormonal' | 'nutritional';
  description: string;
  normalRange: { min: number; max: number };
  optimalRange: { min: number; max: number };
  upsellMessage: string; // Message shown when user clicks "I don't have this data"
  protocolSlug: string; // Slug of the protocol to upsell
}

export const BIOMARKERS: Biomarker[] = [
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
  {
    id: 'hs_crp',
    name: 'Proteina C Reattiva (hs-CRP)',
    unit: 'mg/L',
    category: 'inflammation',
    description: 'Marker di infiammazione sistemica di basso grado.',
    normalRange: { min: 0, max: 3.0 },
    optimalRange: { min: 0, max: 0.5 },
    upsellMessage: 'L\'infiammazione cronica è il killer silenzioso. Il test hs-CRP è incluso nel nostro pacchetto infiammazione.',
    protocolSlug: 'longevita' // Could be specific inflammation protocol if created
  },
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
    normalRange: { min: 30, max: 400 }, // Wide range, varies by sex
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
  }
];
