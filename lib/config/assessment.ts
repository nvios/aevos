// ---------------------------------------------------------------------------
// Lifestyle Assessment – types, options, scoring & recommendation engine
// ---------------------------------------------------------------------------

export const CALCULATOR_STORAGE_KEY = "aevos_calculator_data";
export const ASSESSMENT_STORAGE_KEY = "aevos_assessment_data";
export const ASSESSMENT_EXPIRY_DAYS = 14;

// ── Types ─────────────────────────────────────────────────────────────────

export type Gender = "male" | "female" | "other";

export type AgeRange =
  | "18-25"
  | "26-35"
  | "36-45"
  | "46-55"
  | "56-65"
  | "65+";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "athlete";

export type Goal =
  | "longevity"
  | "build_muscle"
  | "lose_weight"
  | "improve_energy"
  | "better_sleep"
  | "reduce_stress";

export type ExerciseAccess =
  | "outdoors"
  | "gym"
  | "home_gym"
  | "none";

export type TrainingTime =
  | "morning"
  | "lunch"
  | "evening"
  | "flexible";

export type ScheduleConsistency =
  | "very_consistent"
  | "somewhat_consistent"
  | "unpredictable";

export type SleepQuality = "great" | "okay" | "poor";

export type MealPrepCapacity =
  | "cook_daily"
  | "meal_prep"
  | "eat_out"
  | "mixed";

export type WeeklyHours = "lt3" | "3to5" | "5to8" | "8plus";

export interface ProfileData {
  gender: Gender;
  ageRange: AgeRange;
  heightCm: number | "";
  weightKg: number | "";
  activityLevel: ActivityLevel;
}

export interface GoalsData {
  primaryGoal: Goal;
  secondaryGoals: Goal[];
}

export interface LifestyleData {
  exerciseAccess: ExerciseAccess[];
  trainingTime: TrainingTime;
  scheduleConsistency: ScheduleConsistency;
  sleepQuality: SleepQuality;
  mealPrep: MealPrepCapacity;
  weeklyHours: WeeklyHours;
}

export interface AssessmentData {
  profile: ProfileData;
  goals: GoalsData;
  lifestyle: LifestyleData;
}

// ── Pillar scores ─────────────────────────────────────────────────────────

export type PillarKey =
  | "exercise"
  | "nutrition"
  | "sleep"
  | "stress"
  | "recovery";

export interface PillarScore {
  key: PillarKey;
  score: number; // 0-100
  label: { it: string; en: string };
}

export interface AssessmentResult {
  overallScore: number;
  potentialScore: number;
  pillars: PillarScore[];
  topActions: ActionRecommendation[];
  weeklyBlueprint: DayPlan[];
  benchmarks: Benchmark[];
  bmi: number | null;
}

export interface ActionRecommendation {
  id: string;
  icon: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  impact: "high" | "medium";
  pillar: PillarKey;
}

export interface DayPlan {
  day: { it: string; en: string };
  activity: { it: string; en: string };
  icon: string;
  type: "cardio" | "strength" | "rest" | "flexibility" | "nutrition" | "sleep";
}

export interface Benchmark {
  label: { it: string; en: string };
  userValue: number;
  optimalValue: number;
  unit: string;
}

// ── Option labels (IT / EN) ───────────────────────────────────────────────

export const GENDER_OPTIONS: { value: Gender; it: string; en: string }[] = [
  { value: "male", it: "Uomo", en: "Male" },
  { value: "female", it: "Donna", en: "Female" },
  { value: "other", it: "Altro", en: "Other" },
];

export const AGE_RANGE_OPTIONS: { value: AgeRange; it: string; en: string }[] = [
  { value: "18-25", it: "18-25 anni", en: "18-25 years" },
  { value: "26-35", it: "26-35 anni", en: "26-35 years" },
  { value: "36-45", it: "36-45 anni", en: "36-45 years" },
  { value: "46-55", it: "46-55 anni", en: "46-55 years" },
  { value: "56-65", it: "56-65 anni", en: "56-65 years" },
  { value: "65+", it: "65+ anni", en: "65+ years" },
];

export const ACTIVITY_LEVEL_OPTIONS: {
  value: ActivityLevel;
  it: string;
  en: string;
  icon: string;
}[] = [
  { value: "sedentary", it: "Sedentario", en: "Sedentary", icon: "Armchair" },
  { value: "lightly_active", it: "Leggermente attivo", en: "Lightly active", icon: "Footprints" },
  { value: "moderately_active", it: "Moderatamente attivo", en: "Moderately active", icon: "Bike" },
  { value: "very_active", it: "Molto attivo", en: "Very active", icon: "Dumbbell" },
  { value: "athlete", it: "Atleta", en: "Athlete", icon: "Trophy" },
];

export const GOAL_OPTIONS: {
  value: Goal;
  it: string;
  en: string;
  icon: string;
  description: { it: string; en: string };
}[] = [
  {
    value: "longevity",
    it: "Longevità e healthspan",
    en: "Longevity & healthspan",
    icon: "HeartPulse",
    description: {
      it: "Vivere più a lungo e meglio, rallentando l'invecchiamento biologico",
      en: "Live longer and better by slowing biological aging",
    },
  },
  {
    value: "build_muscle",
    it: "Costruire massa muscolare",
    en: "Build muscle",
    icon: "Dumbbell",
    description: {
      it: "Aumentare forza e massa magra per una base solida",
      en: "Increase strength and lean mass for a solid foundation",
    },
  },
  {
    value: "lose_weight",
    it: "Perdere peso",
    en: "Lose weight",
    icon: "TrendingDown",
    description: {
      it: "Ridurre grasso corporeo in modo sostenibile e salutare",
      en: "Reduce body fat in a sustainable and healthy way",
    },
  },
  {
    value: "improve_energy",
    it: "Migliorare l'energia",
    en: "Improve energy",
    icon: "Zap",
    description: {
      it: "Avere più energia durante il giorno e meno stanchezza cronica",
      en: "Have more energy throughout the day and less chronic fatigue",
    },
  },
  {
    value: "better_sleep",
    it: "Dormire meglio",
    en: "Better sleep",
    icon: "Moon",
    description: {
      it: "Migliorare qualità e durata del sonno per un recupero ottimale",
      en: "Improve sleep quality and duration for optimal recovery",
    },
  },
  {
    value: "reduce_stress",
    it: "Ridurre lo stress",
    en: "Reduce stress",
    icon: "Wind",
    description: {
      it: "Gestire meglio ansia e tensione per una vita più equilibrata",
      en: "Better manage anxiety and tension for a more balanced life",
    },
  },
];

export const EXERCISE_ACCESS_OPTIONS: {
  value: ExerciseAccess;
  it: string;
  en: string;
  icon: string;
}[] = [
  { value: "outdoors", it: "Corsa/attività all'aperto", en: "Running/outdoor activities", icon: "TreePine" },
  { value: "gym", it: "Palestra", en: "Gym membership", icon: "Dumbbell" },
  { value: "home_gym", it: "Home gym", en: "Home gym", icon: "Home" },
  { value: "none", it: "Nessuno di questi", en: "None of these", icon: "X" },
];

export const TRAINING_TIME_OPTIONS: {
  value: TrainingTime;
  it: string;
  en: string;
}[] = [
  { value: "morning", it: "Mattina (prima del lavoro)", en: "Morning (before work)" },
  { value: "lunch", it: "Pausa pranzo", en: "Lunch break" },
  { value: "evening", it: "Sera (dopo il lavoro)", en: "Evening (after work)" },
  { value: "flexible", it: "Flessibile", en: "Flexible" },
];

export const SCHEDULE_CONSISTENCY_OPTIONS: {
  value: ScheduleConsistency;
  it: string;
  en: string;
}[] = [
  { value: "very_consistent", it: "Molto regolare", en: "Very consistent" },
  { value: "somewhat_consistent", it: "Abbastanza regolare", en: "Somewhat consistent" },
  { value: "unpredictable", it: "Imprevedibile", en: "Unpredictable" },
];

export const SLEEP_QUALITY_OPTIONS: {
  value: SleepQuality;
  it: string;
  en: string;
  icon: string;
}[] = [
  { value: "great", it: "Ottimo", en: "Great", icon: "Star" },
  { value: "okay", it: "Discreto", en: "Okay", icon: "Minus" },
  { value: "poor", it: "Scarso", en: "Poor", icon: "AlertTriangle" },
];

export const MEAL_PREP_OPTIONS: {
  value: MealPrepCapacity;
  it: string;
  en: string;
}[] = [
  { value: "cook_daily", it: "Cucino ogni giorno", en: "Cook daily" },
  { value: "meal_prep", it: "Meal prep settimanale", en: "Weekly meal prep" },
  { value: "eat_out", it: "Mangio fuori spesso", en: "Mostly eat out" },
  { value: "mixed", it: "Un mix di tutto", en: "A mix of everything" },
];

export const WEEKLY_HOURS_OPTIONS: {
  value: WeeklyHours;
  it: string;
  en: string;
}[] = [
  { value: "lt3", it: "Meno di 3 ore", en: "Less than 3 hours" },
  { value: "3to5", it: "3-5 ore", en: "3-5 hours" },
  { value: "5to8", it: "5-8 ore", en: "5-8 hours" },
  { value: "8plus", it: "8+ ore", en: "8+ hours" },
];

// ── Scoring engine ────────────────────────────────────────────────────────

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function calculateBmi(h: number | "", w: number | ""): number | null {
  if (h === "" || w === "" || h === 0) return null;
  return w / ((h / 100) ** 2);
}

const ACTIVITY_SCORE: Record<ActivityLevel, number> = {
  sedentary: 15,
  lightly_active: 35,
  moderately_active: 55,
  very_active: 75,
  athlete: 90,
};

const HOURS_MULTIPLIER: Record<WeeklyHours, number> = {
  lt3: 0.6,
  "3to5": 0.8,
  "5to8": 1.0,
  "8plus": 1.1,
};

function scoreExercise(d: AssessmentData): number {
  const base = ACTIVITY_SCORE[d.profile.activityLevel];
  const hasAccess = d.lifestyle.exerciseAccess.length > 0 && !d.lifestyle.exerciseAccess.includes("none");
  const accessBonus = hasAccess ? 10 : -5;
  const hours = HOURS_MULTIPLIER[d.lifestyle.weeklyHours];
  return clamp(Math.round((base + accessBonus) * hours));
}

function scoreNutrition(d: AssessmentData): number {
  const bmi = calculateBmi(d.profile.heightCm, d.profile.weightKg);
  let base = 60;
  if (bmi !== null) {
    if (bmi >= 18.5 && bmi < 25) base = 80;
    else if (bmi >= 25 && bmi < 30) base = 55;
    else if (bmi >= 30) base = 35;
    else base = 45;
  }
  const mealBonus: Record<MealPrepCapacity, number> = {
    cook_daily: 15,
    meal_prep: 10,
    mixed: 0,
    eat_out: -15,
  };
  return clamp(base + mealBonus[d.lifestyle.mealPrep]);
}

function scoreSleep(d: AssessmentData): number {
  const qualityBase: Record<SleepQuality, number> = {
    great: 85,
    okay: 55,
    poor: 25,
  };
  const consistencyBonus: Record<ScheduleConsistency, number> = {
    very_consistent: 15,
    somewhat_consistent: 5,
    unpredictable: -10,
  };
  return clamp(qualityBase[d.lifestyle.sleepQuality] + consistencyBonus[d.lifestyle.scheduleConsistency]);
}

function scoreStress(d: AssessmentData): number {
  let base = 60;
  if (d.lifestyle.scheduleConsistency === "unpredictable") base -= 20;
  else if (d.lifestyle.scheduleConsistency === "very_consistent") base += 15;
  if (d.lifestyle.weeklyHours === "lt3") base -= 10;
  if (d.goals.primaryGoal === "reduce_stress" || d.goals.secondaryGoals.includes("reduce_stress")) base -= 5;
  if (d.lifestyle.sleepQuality === "poor") base -= 10;
  if (d.lifestyle.sleepQuality === "great") base += 10;
  return clamp(base);
}

function scoreRecovery(d: AssessmentData): number {
  let base = 60;
  if (d.lifestyle.sleepQuality === "great") base += 20;
  else if (d.lifestyle.sleepQuality === "poor") base -= 20;
  if (d.lifestyle.scheduleConsistency === "very_consistent") base += 10;
  if (d.profile.activityLevel === "athlete") base -= 5; // high training stress
  if (d.lifestyle.trainingTime === "morning") base += 5;
  return clamp(base);
}

const PILLAR_LABELS: Record<PillarKey, { it: string; en: string }> = {
  exercise: { it: "Esercizio", en: "Exercise" },
  nutrition: { it: "Nutrizione", en: "Nutrition" },
  sleep: { it: "Sonno", en: "Sleep" },
  stress: { it: "Stress", en: "Stress" },
  recovery: { it: "Recupero", en: "Recovery" },
};

const PILLAR_WEIGHTS: Record<PillarKey, number> = {
  exercise: 0.3,
  nutrition: 0.25,
  sleep: 0.25,
  stress: 0.1,
  recovery: 0.1,
};

// ── Recommendation library ───────────────────────────────────────────────

const RECOMMENDATIONS: ActionRecommendation[] = [
  {
    id: "zone2",
    icon: "HeartPulse",
    pillar: "exercise",
    impact: "high",
    title: {
      it: "Zone 2 cardio: 150 min/settimana",
      en: "Zone 2 cardio: 150 min/week",
    },
    description: {
      it: "L'esercizio aerobico a bassa intensità (Zone 2) è il singolo intervento con il più alto impatto per la longevità. Migliora la funzione mitocondriale, riduce il rischio cardiovascolare e migliora la sensibilità insulinica.",
      en: "Low-intensity aerobic exercise (Zone 2) is the single highest-impact intervention for longevity. It improves mitochondrial function, reduces cardiovascular risk, and enhances insulin sensitivity.",
    },
  },
  {
    id: "strength",
    icon: "Dumbbell",
    pillar: "exercise",
    impact: "high",
    title: {
      it: "Allenamento di forza 2-3x/settimana",
      en: "Strength training 2-3x/week",
    },
    description: {
      it: "La massa muscolare è il miglior predittore di longevità dopo il VO2 Max. Anche 2 sessioni settimanali di 30 minuti riducono la mortalità per tutte le cause del 20%.",
      en: "Muscle mass is the best predictor of longevity after VO2 Max. Even 2 weekly 30-minute sessions reduce all-cause mortality by 20%.",
    },
  },
  {
    id: "protein",
    icon: "Beef",
    pillar: "nutrition",
    impact: "high",
    title: {
      it: "Proteine: 1.6-2.2g/kg al giorno",
      en: "Protein: 1.6-2.2g/kg per day",
    },
    description: {
      it: "L'apporto proteico adeguato preserva la massa muscolare, migliora la sazietà e supporta il recupero. Distribuiscilo in 3-4 pasti da almeno 30g.",
      en: "Adequate protein intake preserves muscle mass, improves satiety, and supports recovery. Spread it across 3-4 meals of at least 30g each.",
    },
  },
  {
    id: "sleep_routine",
    icon: "Moon",
    pillar: "sleep",
    impact: "high",
    title: {
      it: "Routine del sonno: 7-9 ore costanti",
      en: "Sleep routine: consistent 7-9 hours",
    },
    description: {
      it: "Dormire meno di 7 ore accelera l'invecchiamento biologico. Mantenere orari regolari migliora l'HRV e riduce il cortisolo. La costanza conta più della durata.",
      en: "Sleeping less than 7 hours accelerates biological aging. Keeping regular hours improves HRV and reduces cortisol. Consistency matters more than duration.",
    },
  },
  {
    id: "meal_quality",
    icon: "Salad",
    pillar: "nutrition",
    impact: "medium",
    title: {
      it: "Prioritizza cibi interi e non processati",
      en: "Prioritize whole, unprocessed foods",
    },
    description: {
      it: "Una dieta ricca di vegetali, proteine magre e grassi sani riduce l'infiammazione cronica. Non serve una dieta perfetta: l'80% è sufficiente.",
      en: "A diet rich in vegetables, lean proteins, and healthy fats reduces chronic inflammation. No need for a perfect diet: 80% is enough.",
    },
  },
  {
    id: "walking",
    icon: "Footprints",
    pillar: "exercise",
    impact: "medium",
    title: {
      it: "8.000-10.000 passi al giorno",
      en: "8,000-10,000 steps per day",
    },
    description: {
      it: "Camminare è il fondamento dell'attività fisica. I benefici cardiovascolari sono quasi massimi a 8.000 passi/giorno, con costo zero di recupero.",
      en: "Walking is the foundation of physical activity. Cardiovascular benefits plateau at 8,000 steps/day, with zero recovery cost.",
    },
  },
  {
    id: "stress_mgmt",
    icon: "Wind",
    pillar: "stress",
    impact: "medium",
    title: {
      it: "10 minuti di gestione dello stress al giorno",
      en: "10 minutes of daily stress management",
    },
    description: {
      it: "Meditazione, respirazione o una camminata nella natura riducono il cortisolo e l'infiammazione. L'effetto è cumulativo e misurabile sull'HRV.",
      en: "Meditation, breathing exercises, or a nature walk reduce cortisol and inflammation. The effect is cumulative and measurable via HRV.",
    },
  },
  {
    id: "bodyweight",
    icon: "PersonStanding",
    pillar: "exercise",
    impact: "medium",
    title: {
      it: "Allenamento a corpo libero a casa",
      en: "Bodyweight training at home",
    },
    description: {
      it: "Senza palestra, gli esercizi a corpo libero (push-up, squat, plank) costruiscono forza funzionale e non richiedono attrezzatura.",
      en: "Without a gym, bodyweight exercises (push-ups, squats, planks) build functional strength and require no equipment.",
    },
  },
  {
    id: "sleep_hygiene",
    icon: "BedDouble",
    pillar: "sleep",
    impact: "medium",
    title: {
      it: "Igiene del sonno: buio, fresco, senza schermi",
      en: "Sleep hygiene: dark, cool, screen-free",
    },
    description: {
      it: "Camera a 18-19°C, oscuramento totale e niente schermi 30 min prima migliora la latenza del sonno e la qualità del sonno profondo.",
      en: "Room at 18-19°C, total darkness, and no screens 30 min before improves sleep latency and deep sleep quality.",
    },
  },
  {
    id: "recovery_day",
    icon: "Battery",
    pillar: "recovery",
    impact: "medium",
    title: {
      it: "1-2 giorni di recupero attivo a settimana",
      en: "1-2 active recovery days per week",
    },
    description: {
      it: "Il recupero è quando il corpo si adatta. Camminata leggera, stretching o yoga nei giorni di riposo accelerano l'adattamento e riducono gli infortuni.",
      en: "Recovery is when the body adapts. Light walking, stretching, or yoga on rest days accelerate adaptation and reduce injury risk.",
    },
  },
];

// ── Weekly blueprint generation ──────────────────────────────────────────

function generateWeeklyBlueprint(d: AssessmentData): DayPlan[] {
  const hasGym = d.lifestyle.exerciseAccess.includes("gym") || d.lifestyle.exerciseAccess.includes("home_gym");
  const canRun = d.lifestyle.exerciseAccess.includes("outdoors");
  const noEquipment = d.lifestyle.exerciseAccess.includes("none") || d.lifestyle.exerciseAccess.length === 0;

  const hoursMap: Record<WeeklyHours, number> = { lt3: 2, "3to5": 4, "5to8": 6, "8plus": 8 };
  const availHours = hoursMap[d.lifestyle.weeklyHours];
  const sessionsPerWeek = Math.min(6, Math.max(2, Math.floor(availHours / 1)));

  const cardioLabel = canRun
    ? { it: "Zone 2: corsa leggera", en: "Zone 2: easy run" }
    : { it: "Zone 2: camminata veloce", en: "Zone 2: brisk walk" };

  const strengthLabel = hasGym
    ? { it: "Forza: allenamento in palestra", en: "Strength: gym workout" }
    : noEquipment
      ? { it: "Forza: corpo libero", en: "Strength: bodyweight" }
      : { it: "Forza: home gym", en: "Strength: home gym" };

  const days: { it: string; en: string }[] = [
    { it: "Lunedì", en: "Monday" },
    { it: "Martedì", en: "Tuesday" },
    { it: "Mercoledì", en: "Wednesday" },
    { it: "Giovedì", en: "Thursday" },
    { it: "Venerdì", en: "Friday" },
    { it: "Sabato", en: "Saturday" },
    { it: "Domenica", en: "Sunday" },
  ];

  const template: DayPlan[] = days.map((day) => ({
    day,
    activity: { it: "Riposo / recupero attivo", en: "Rest / active recovery" },
    icon: "Battery",
    type: "rest" as const,
  }));

  // Distribute sessions: alternate cardio and strength
  const activeDays = [0, 2, 4, 1, 3, 5].slice(0, sessionsPerWeek);
  activeDays.forEach((dayIdx, i) => {
    if (i % 2 === 0) {
      template[dayIdx] = {
        day: days[dayIdx],
        activity: cardioLabel,
        icon: canRun ? "HeartPulse" : "Footprints",
        type: "cardio",
      };
    } else {
      template[dayIdx] = {
        day: days[dayIdx],
        activity: strengthLabel,
        icon: "Dumbbell",
        type: "strength",
      };
    }
  });

  // Sunday is always rest/flexibility
  template[6] = {
    day: days[6],
    activity: { it: "Stretching / mobilità", en: "Stretching / mobility" },
    icon: "Activity",
    type: "flexibility",
  };

  return template;
}

// ── Benchmark generation ─────────────────────────────────────────────────

function generateBenchmarks(d: AssessmentData, pillars: PillarScore[]): Benchmark[] {
  const exerciseScore = pillars.find((p) => p.key === "exercise")?.score ?? 50;
  const sleepScore = pillars.find((p) => p.key === "sleep")?.score ?? 50;
  const nutritionScore = pillars.find((p) => p.key === "nutrition")?.score ?? 50;

  return [
    {
      label: { it: "Attività fisica settimanale", en: "Weekly physical activity" },
      userValue: Math.round(exerciseScore * 0.06),
      optimalValue: 5,
      unit: "h",
    },
    {
      label: { it: "Qualità del sonno", en: "Sleep quality" },
      userValue: Math.round(sleepScore * 0.09),
      optimalValue: 9,
      unit: "/10",
    },
    {
      label: { it: "Qualità nutrizionale", en: "Nutrition quality" },
      userValue: Math.round(nutritionScore * 0.08),
      optimalValue: 8,
      unit: "/10",
    },
    {
      label: { it: "Forza stimata", en: "Estimated strength" },
      userValue: Math.round(exerciseScore * 0.07),
      optimalValue: 7,
      unit: "/10",
    },
  ];
}

// ── Pick top recommendations ─────────────────────────────────────────────

function pickRecommendations(d: AssessmentData, pillars: PillarScore[]): ActionRecommendation[] {
  const sorted = [...pillars].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3).map((p) => p.key);

  const noGym = d.lifestyle.exerciseAccess.includes("none") || d.lifestyle.exerciseAccess.length === 0;

  const candidates = RECOMMENDATIONS.filter((r) => {
    if (noGym && r.id === "strength") return false;
    if (!noGym && r.id === "bodyweight") return false;
    return true;
  });

  // Prioritise: high impact in weakest pillars first
  const scored = candidates.map((r) => {
    let priority = 0;
    const pillarRank = weakest.indexOf(r.pillar);
    if (pillarRank !== -1) priority += (3 - pillarRank) * 10;
    if (r.impact === "high") priority += 5;
    return { ...r, priority };
  });

  scored.sort((a, b) => b.priority - a.priority);

  // Deduplicate pillars — at most 2 per pillar
  const seen: Record<string, number> = {};
  const result: ActionRecommendation[] = [];
  for (const r of scored) {
    if (result.length >= 3) break;
    seen[r.pillar] = (seen[r.pillar] || 0) + 1;
    if (seen[r.pillar] > 2) continue;
    result.push(r);
  }

  return result;
}

// ── Main scoring function ────────────────────────────────────────────────

function computePotentialScore(
  current: number,
  pillars: PillarScore[],
  d: AssessmentData
): number {
  const hoursCapacity: Record<WeeklyHours, number> = {
    lt3: 0.35,
    "3to5": 0.55,
    "5to8": 0.75,
    "8plus": 0.9,
  };
  const ageFactor: Record<AgeRange, number> = {
    "18-25": 0.9,
    "26-35": 0.85,
    "36-45": 0.75,
    "46-55": 0.65,
    "56-65": 0.55,
    "65+": 0.45,
  };
  const timeFactor = hoursCapacity[d.lifestyle.weeklyHours];
  const ageMod = ageFactor[d.profile.ageRange];
  const gap = 100 - current;
  const improvable = Math.round(gap * timeFactor * ageMod);
  return Math.min(98, current + Math.max(3, improvable));
}

export function computeAssessmentResult(d: AssessmentData): AssessmentResult {
  const pillarScores: PillarScore[] = [
    { key: "exercise", score: scoreExercise(d), label: PILLAR_LABELS.exercise },
    { key: "nutrition", score: scoreNutrition(d), label: PILLAR_LABELS.nutrition },
    { key: "sleep", score: scoreSleep(d), label: PILLAR_LABELS.sleep },
    { key: "stress", score: scoreStress(d), label: PILLAR_LABELS.stress },
    { key: "recovery", score: scoreRecovery(d), label: PILLAR_LABELS.recovery },
  ];

  const overallScore = Math.round(
    pillarScores.reduce((sum, p) => sum + p.score * PILLAR_WEIGHTS[p.key], 0)
  );

  const potentialScore = computePotentialScore(overallScore, pillarScores, d);

  return {
    overallScore,
    potentialScore,
    pillars: pillarScores,
    topActions: pickRecommendations(d, pillarScores),
    weeklyBlueprint: generateWeeklyBlueprint(d),
    benchmarks: generateBenchmarks(d, pillarScores),
    bmi: calculateBmi(d.profile.heightCm, d.profile.weightKg),
  };
}

// ── LocalStorage helpers ─────────────────────────────────────────────────

export function loadCalculatorData(): Partial<ProfileData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CALCULATOR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result: Partial<ProfileData> = {};
    if (parsed.gender) {
      const genderMap: Record<string, Gender> = { uomo: "male", donna: "female", altro: "other" };
      result.gender = genderMap[parsed.gender] || undefined;
    }
    if (typeof parsed.heightCm === "number") result.heightCm = parsed.heightCm;
    if (typeof parsed.weightKg === "number") result.weightKg = parsed.weightKg;
    if (typeof parsed.age === "number") {
      if (parsed.age <= 25) result.ageRange = "18-25";
      else if (parsed.age <= 35) result.ageRange = "26-35";
      else if (parsed.age <= 45) result.ageRange = "36-45";
      else if (parsed.age <= 55) result.ageRange = "46-55";
      else if (parsed.age <= 65) result.ageRange = "56-65";
      else result.ageRange = "65+";
    }
    return result;
  } catch {
    return null;
  }
}
