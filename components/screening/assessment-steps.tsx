"use client";

import {
  type ProfileData,
  type GoalsData,
  type LifestyleData,
  type Goal,
  type ExerciseAccess,
  GENDER_OPTIONS,
  AGE_RANGE_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
  GOAL_OPTIONS,
  EXERCISE_ACCESS_OPTIONS,
  TRAINING_TIME_OPTIONS,
  SCHEDULE_CONSISTENCY_OPTIONS,
  SLEEP_QUALITY_OPTIONS,
  MEAL_PREP_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
} from "@/lib/config/assessment";
import {
  User,
  Ruler,
  Scale,
  HeartPulse,
  Dumbbell,
  TrendingDown,
  Zap,
  Moon,
  Wind,
  Trophy,
  Armchair,
  Footprints,
  Bike,
  TreePine,
  Home,
  X,
  Star,
  Minus,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse,
  Dumbbell,
  TrendingDown,
  Zap,
  Moon,
  Wind,
  Trophy,
  Armchair,
  Footprints,
  Bike,
  TreePine,
  Home,
  X,
  Star,
  Minus,
  AlertTriangle,
};

function OptionCard({
  selected,
  onClick,
  icon,
  label,
  description,
  compact,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  description?: string;
  compact?: boolean;
}) {
  const Icon = icon ? ICON_MAP[icon] : null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
        compact ? "py-3" : ""
      } ${
        selected
          ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400 hover:shadow-sm"
      }`}
    >
      {Icon && (
        <div
          className={`shrink-0 rounded-lg p-2 ${
            selected ? "bg-white/15" : "bg-zinc-100 group-hover:bg-zinc-200"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div className="min-w-0">
        <p className={`text-sm font-semibold leading-tight ${compact ? "" : "mb-0.5"}`}>
          {label}
        </p>
        {description && (
          <p
            className={`text-xs leading-relaxed ${
              selected ? "text-zinc-300" : "text-zinc-500"
            }`}
          >
            {description}
          </p>
        )}
      </div>
      <div
        className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 transition-colors ${
          selected
            ? "border-white bg-white"
            : "border-zinc-300 bg-transparent"
        }`}
      >
        {selected && (
          <div className="absolute inset-[3px] rounded-full bg-zinc-900" />
        )}
      </div>
    </button>
  );
}

function CheckboxCard({
  selected,
  onClick,
  icon,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
}) {
  const Icon = icon ? ICON_MAP[icon] : null;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
        selected
          ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400 hover:shadow-sm"
      }`}
    >
      {Icon && (
        <div
          className={`shrink-0 rounded-lg p-2 ${
            selected ? "bg-white/15" : "bg-zinc-100 group-hover:bg-zinc-200"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      )}
      <span className="text-sm font-semibold">{label}</span>
      <div
        className={`ml-auto h-4 w-4 shrink-0 rounded border-2 transition-colors ${
          selected ? "border-white bg-white" : "border-zinc-300"
        }`}
      >
        {selected && (
          <svg viewBox="0 0 16 16" className="h-full w-full text-zinc-900">
            <path
              d="M4 8l3 3 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-sm font-semibold text-zinc-900">{children}</p>
  );
}

// ── Step 1: Profile ──────────────────────────────────────────────────────

export function ProfileStep({
  data,
  onChange,
  locale,
}: {
  data: ProfileData;
  onChange: (d: ProfileData) => void;
  locale: string;
}) {
  const isEn = locale === "en";
  const update = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>{isEn ? "Gender" : "Genere"}</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {GENDER_OPTIONS.map((o) => (
            <OptionCard
              key={o.value}
              selected={data.gender === o.value}
              onClick={() => update("gender", o.value)}
              icon={o.value === "male" ? "User" : o.value === "female" ? "User" : "User"}
              label={isEn ? o.en : o.it}
              compact
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>{isEn ? "Age range" : "Fascia d'età"}</SectionLabel>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {AGE_RANGE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("ageRange", o.value)}
              className={`rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                data.ageRange === o.value
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              }`}
            >
              {o.value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>{isEn ? "Height & Weight" : "Altezza e Peso"}</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              {isEn ? "Height (cm)" : "Altezza (cm)"}
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="number"
                min={130}
                max={220}
                placeholder="175"
                value={data.heightCm === "" ? "" : data.heightCm}
                onChange={(e) =>
                  update(
                    "heightCm",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500">
              {isEn ? "Weight (kg)" : "Peso (kg)"}
            </label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="number"
                min={35}
                max={200}
                placeholder="75"
                value={data.weightKg === "" ? "" : data.weightKg}
                onChange={(e) =>
                  update(
                    "weightKg",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>
          {isEn ? "Current activity level" : "Livello di attività attuale"}
        </SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACTIVITY_LEVEL_OPTIONS.map((o) => (
            <OptionCard
              key={o.value}
              selected={data.activityLevel === o.value}
              onClick={() => update("activityLevel", o.value)}
              icon={o.icon}
              label={isEn ? o.en : o.it}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Goals ────────────────────────────────────────────────────────

export function GoalsStep({
  data,
  onChange,
  locale,
}: {
  data: GoalsData;
  onChange: (d: GoalsData) => void;
  locale: string;
}) {
  const isEn = locale === "en";

  const handlePrimary = (goal: Goal) => {
    onChange({
      primaryGoal: goal,
      secondaryGoals: data.secondaryGoals.filter((g) => g !== goal),
    });
  };

  const toggleSecondary = (goal: Goal) => {
    if (goal === data.primaryGoal) return;
    const current = data.secondaryGoals;
    if (current.includes(goal)) {
      onChange({ ...data, secondaryGoals: current.filter((g) => g !== goal) });
    } else if (current.length < 2) {
      onChange({ ...data, secondaryGoals: [...current, goal] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
        <p className="text-sm text-emerald-900 leading-relaxed">
          <span className="font-semibold">
            {isEn ? "Our philosophy:" : "La nostra filosofia:"}
          </span>{" "}
          {isEn
            ? "True longevity comes from balanced habits, not extreme approaches. We help you find the interventions with the highest return on investment for your healthspan."
            : "La vera longevità nasce da abitudini equilibrate, non da approcci estremi. Ti aiutiamo a trovare gli interventi con il più alto ritorno sull'investimento per il tuo healthspan."}
        </p>
      </div>

      <div>
        <SectionLabel>
          {isEn ? "Primary goal (pick one)" : "Obiettivo principale (scegline uno)"}
        </SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {GOAL_OPTIONS.map((o) => (
            <OptionCard
              key={o.value}
              selected={data.primaryGoal === o.value}
              onClick={() => handlePrimary(o.value)}
              icon={o.icon}
              label={isEn ? o.en : o.it}
              description={isEn ? o.description.en : o.description.it}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>
          {isEn
            ? "Secondary goals (up to 2, optional)"
            : "Obiettivi secondari (fino a 2, opzionali)"}
        </SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {GOAL_OPTIONS.filter((o) => o.value !== data.primaryGoal).map(
            (o) => (
              <CheckboxCard
                key={o.value}
                selected={data.secondaryGoals.includes(o.value)}
                onClick={() => toggleSecondary(o.value)}
                icon={o.icon}
                label={isEn ? o.en : o.it}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Lifestyle ────────────────────────────────────────────────────

export function LifestyleStep({
  data,
  onChange,
  locale,
}: {
  data: LifestyleData;
  onChange: (d: LifestyleData) => void;
  locale: string;
}) {
  const isEn = locale === "en";
  const update = <K extends keyof LifestyleData>(k: K, v: LifestyleData[K]) =>
    onChange({ ...data, [k]: v });

  const toggleAccess = (val: ExerciseAccess) => {
    if (val === "none") {
      update("exerciseAccess", ["none"]);
      return;
    }
    const without = data.exerciseAccess.filter((v) => v !== "none");
    if (without.includes(val)) {
      update(
        "exerciseAccess",
        without.filter((v) => v !== val)
      );
    } else {
      update("exerciseAccess", [...without, val]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>
          {isEn
            ? "What exercise options do you have?"
            : "Quali opzioni di allenamento hai?"}
        </SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {EXERCISE_ACCESS_OPTIONS.map((o) => (
            <CheckboxCard
              key={o.value}
              selected={data.exerciseAccess.includes(o.value)}
              onClick={() => toggleAccess(o.value)}
              icon={o.icon}
              label={isEn ? o.en : o.it}
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>
          {isEn ? "Preferred training time" : "Quando preferisci allenarti?"}
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TRAINING_TIME_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("trainingTime", o.value)}
              className={`rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                data.trainingTime === o.value
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              }`}
            >
              {isEn ? o.en : o.it}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>
          {isEn
            ? "How consistent is your schedule?"
            : "Quanto è regolare la tua routine?"}
        </SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {SCHEDULE_CONSISTENCY_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("scheduleConsistency", o.value)}
              className={`rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                data.scheduleConsistency === o.value
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              }`}
            >
              {isEn ? o.en : o.it}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>
          {isEn ? "How do you sleep?" : "Come dormi?"}
        </SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {SLEEP_QUALITY_OPTIONS.map((o) => (
            <OptionCard
              key={o.value}
              selected={data.sleepQuality === o.value}
              onClick={() => update("sleepQuality", o.value)}
              icon={o.icon}
              label={isEn ? o.en : o.it}
              compact
            />
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>
          {isEn ? "Meal preparation" : "Preparazione dei pasti"}
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {MEAL_PREP_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("mealPrep", o.value)}
              className={`rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                data.mealPrep === o.value
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              }`}
            >
              {isEn ? o.en : o.it}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>
          {isEn
            ? "Weekly hours for health activities"
            : "Ore settimanali per la salute"}
        </SectionLabel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {WEEKLY_HOURS_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("weeklyHours", o.value)}
              className={`rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                data.weeklyHours === o.value
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
              }`}
            >
              {isEn ? o.en : o.it}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
