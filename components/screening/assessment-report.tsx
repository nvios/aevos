"use client";

import Link from "next/link";
import { localePath } from "@/lib/i18n/paths";
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics/events";
import {
  ArrowRight,
  RotateCcw,
  Dumbbell,
  TrendingDown,
  TrendingUp,
  Zap,
  Moon,
  Wind,
  Footprints,
  TreePine,
  Home,
  Activity,
  Battery,
  Star,
  Beef,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import {
  GOAL_OPTIONS,
  type AssessmentResult,
  type AssessmentData,
  type PillarScore,
  type ActionRecommendation,
  type DayPlan,
  type Benchmark,
} from "@/lib/config/assessment";

const ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse: Activity,
  Dumbbell,
  TrendingDown,
  Zap,
  Moon,
  Wind,
  Footprints,
  TreePine,
  Home,
  Activity,
  Battery,
  Star,
  Beef,
  BedDouble,
  PersonStanding: Activity,
  Salad: TreePine,
};

const TYPE_COLOR: Record<string, string> = {
  cardio: "text-rose-500 bg-rose-50",
  strength: "text-blue-600 bg-blue-50",
  rest: "text-zinc-400 bg-zinc-50",
  flexibility: "text-violet-500 bg-violet-50",
  nutrition: "text-emerald-600 bg-emerald-50",
  sleep: "text-indigo-500 bg-indigo-50",
};

const LEGEND_DOT: Record<string, string> = {
  cardio: "bg-rose-500",
  strength: "bg-blue-600",
  flexibility: "bg-violet-500",
  rest: "bg-zinc-400",
};

// ── Health profile tile with radial gauge ────────────────────────────────

function HealthProfile({
  score,
  potential,
  bmi,
  locale,
  protocolHref,
}: {
  score: number;
  potential: number;
  bmi: number | null;
  locale: string;
  protocolHref: string;
}) {
  const isEn = locale === "en";
  const improvement = potential - score;

  const zone =
    score >= 75
      ? { it: "Sopra la media", en: "Above average", color: "text-emerald-600" }
      : score >= 50
        ? { it: "Nella media", en: "Average", color: "text-amber-600" }
        : { it: "Sotto la media", en: "Below average", color: "text-red-500" };

  const gaugeColor = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const r = 50;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="flex flex-col items-center justify-between h-full gap-3">
      {/* Radial gauge */}
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f4f4f5" strokeWidth="7" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-zinc-900 tabular-nums">{score}</span>
          <span className="text-[10px] text-zinc-400 font-medium">/100</span>
        </div>
      </div>

      {/* Zone label + BMI */}
      <div className="text-center">
        <span className={`text-xs font-semibold ${zone.color}`}>
          {isEn ? zone.en : zone.it}
        </span>
        {bmi !== null && (
          <span className="text-[10px] text-zinc-400 ml-2 tabular-nums">
            BMI {bmi.toFixed(1)}
          </span>
        )}
      </div>

      {/* Improvement potential with integrated CTA */}
      <div className="w-full rounded-lg bg-emerald-50/70 px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp className="h-3 w-3 text-emerald-600" />
          <span className="text-[11px] font-bold text-emerald-700">
            +{improvement} {isEn ? "points achievable" : "punti raggiungibili"}
          </span>
        </div>
        <p className="text-[10px] text-emerald-600/80 leading-relaxed">
          {isEn
            ? "Based on your age, availability, and lifestyle."
            : "In base alla tua età, disponibilità e stile di vita."}
        </p>
        <Link
          href={protocolHref}
          onClick={() => analytics.assessmentDeepScreeningClicked("longevita")}
          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          {isEn ? "Unlock more with a personalised plan" : "Sblocca di più con un percorso personalizzato"}
          <ArrowRight className="h-2.5 w-2.5" />
        </Link>
      </div>
    </div>
  );
}

// ── Compact radar chart ─────────────────────────────────────────────────

function RadarChart({ pillars, locale }: { pillars: PillarScore[]; locale: string }) {
  const isEn = locale === "en";
  const n = pillars.length;
  const cx = 120;
  const cy = 120;
  const maxR = 80;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const pt = (i: number, r: number) => ({
    x: cx + r * Math.cos(startAngle + i * angleStep),
    y: cy + r * Math.sin(startAngle + i * angleStep),
  });

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = pillars.map((p, i) => pt(i, (p.score / 100) * maxR));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="relative mx-auto w-full max-w-[240px]">
      <svg viewBox="0 0 240 240" className="w-full">
        {gridLevels.map((level) => {
          const pts = Array.from({ length: n }, (_, i) => pt(i, level * maxR));
          const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
          return <path key={level} d={path} fill="none" stroke="#e4e4e7" strokeWidth="0.75" />;
        })}
        {Array.from({ length: n }, (_, i) => {
          const end = pt(i, maxR);
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#e4e4e7" strokeWidth="0.75" />;
        })}
        <path d={dataPath} fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.5" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10b981" />
        ))}
      </svg>
      {pillars.map((p, i) => {
        const label = pt(i, maxR + 20);
        return (
          <div
            key={p.key}
            className="absolute flex flex-col items-center"
            style={{ left: `${(label.x / 240) * 100}%`, top: `${(label.y / 240) * 100}%`, transform: "translate(-50%, -50%)" }}
          >
            <span className="text-[10px] font-semibold text-zinc-600 whitespace-nowrap">
              {isEn ? p.label.en : p.label.it}
            </span>
            <span className="text-[10px] font-bold text-emerald-600">{p.score}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Compact benchmark bars ──────────────────────────────────────────────

function BenchmarkBars({ benchmarks, locale }: { benchmarks: Benchmark[]; locale: string }) {
  const isEn = locale === "en";
  return (
    <div className="space-y-3">
      {benchmarks.map((b, i) => {
        const pct = Math.min(100, Math.round((b.userValue / b.optimalValue) * 100));
        const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
        return (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-600">{isEn ? b.label.en : b.label.it}</span>
              <span className="text-[10px] text-zinc-400 tabular-nums">
                {b.userValue}{b.unit} / {b.optimalValue}{b.unit}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div className={`h-full rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Compact action row ──────────────────────────────────────────────────

function ActionRow({ action, index, locale }: { action: ActionRecommendation; index: number; locale: string }) {
  const isEn = locale === "en";
  const Icon = ICON_MAP[action.icon] || Activity;
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-bold text-white shrink-0">
            {index + 1}
          </span>
          <h4 className="text-[13px] font-bold text-zinc-900 leading-tight">
            {isEn ? action.title.en : action.title.it}
          </h4>
          <span
            className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${action.impact === "high" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
          >
            {action.impact === "high"
              ? (isEn ? "High impact" : "Alto impatto")
              : (isEn ? "Medium impact" : "Medio impatto")}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-500">
          {isEn ? action.description.en : action.description.it}
        </p>
      </div>
    </div>
  );
}

// ── Compact weekly blueprint ────────────────────────────────────────────

function WeeklyBlueprint({ days, locale }: { days: DayPlan[]; locale: string }) {
  const isEn = locale === "en";
  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day, i) => {
        const Icon = ICON_MAP[day.icon] || Activity;
        const typeClass = TYPE_COLOR[day.type] || TYPE_COLOR.rest;
        return (
          <div key={i} className="flex flex-col items-center gap-1 rounded-lg bg-zinc-50/80 p-1.5 sm:p-2">
            <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
              {(isEn ? day.day.en : day.day.it).slice(0, 3)}
            </span>
            <div className={`flex h-7 w-7 items-center justify-center rounded-md ${typeClass}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Personalised blueprint CTA ──────────────────────────────────────────

function BlueprintCTA({
  data,
  result,
  locale,
  protocolHref,
}: {
  data: AssessmentData;
  result: AssessmentResult;
  locale: string;
  protocolHref: string;
}) {
  const isEn = locale === "en";

  const weakest = [...result.pillars].sort((a, b) => a.score - b.score)[0];
  const weakLabel = isEn ? weakest.label.en.toLowerCase() : weakest.label.it.toLowerCase();

  const goalOption = GOAL_OPTIONS.find((g) => g.value === data.goals.primaryGoal);
  const goalLabel = goalOption
    ? (isEn ? goalOption.en.toLowerCase() : goalOption.it.toLowerCase())
    : "";

  const improvement = result.potentialScore - result.overallScore;

  const headline = isEn
    ? `Without real data, you're gambling with your time`
    : `Senza dati reali, stai scommettendo con il tuo tempo`;

  const body = isEn
    ? `Your ${weakLabel} scored low and your goal is to ${goalLabel} — but without measuring and monitoring, you risk putting effort into the wrong things. Everyone responds differently: what works for others may not work for you. A personalised plan based on your biomarkers can unlock up to ${improvement} more points with targeted, efficient changes.`
    : `Il tuo ${weakLabel} ha un punteggio basso e il tuo obiettivo è ${goalLabel} — ma senza misurare e monitorare, rischi di investire energie nelle cose sbagliate. Ognuno risponde in modo diverso: ciò che funziona per altri potrebbe non funzionare per te. Un percorso personalizzato basato sui tuoi biomarcatori può sbloccare fino a ${improvement} punti in più con cambiamenti mirati ed efficienti.`;

  return (
    <div className="relative bg-zinc-900 px-5 py-5 text-white overflow-hidden">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10">
        <p className="text-[13px] font-bold leading-snug mb-1.5">
          {headline}
        </p>
        <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
          {body}
        </p>
        <Link
          href={protocolHref}
          onClick={() => analytics.assessmentDeepScreeningClicked("blueprint_cta")}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-[12px] font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-[0_0_16px_rgba(16,185,129,0.3)]"
        >
          {isEn ? "Build my personalised plan" : "Costruisci il mio percorso personalizzato"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ── Main report ─────────────────────────────────────────────────────────

export function AssessmentReport({
  result,
  data,
  locale,
  onRestart,
}: {
  result: AssessmentResult;
  data: AssessmentData;
  locale: string;
  onRestart: () => void;
}) {
  const isEn = locale === "en";
  const lp = (path: string) => localePath(path, locale);
  const protocolHref = lp("/servizi/protocolli/longevita");

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── ROW 1: Dashboard hero ─────────────────────────── */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-3">
          <h2 className="text-sm font-bold text-zinc-900">
            {isEn ? "Your Healthspan Profile" : "Il Tuo Profilo"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
          {/* Health Profile with gauge */}
          <div className="lg:col-span-3 p-5">
            <HealthProfile
              score={result.overallScore}
              potential={result.potentialScore}
              bmi={result.bmi}
              locale={locale}
              protocolHref={protocolHref}
            />
          </div>

          {/* Radar */}
          <div className="lg:col-span-5 flex items-center justify-center p-4">
            <RadarChart pillars={result.pillars} locale={locale} />
          </div>

          {/* Benchmarks */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">
              {isEn ? "Benchmarks" : "Benchmark"}
            </h3>
            <BenchmarkBars benchmarks={result.benchmarks} locale={locale} />
          </div>
        </div>
      </div>

      {/* ── ROW 2: Actions + Weekly Blueprint ─────────────── */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Top actions */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 mb-4">
            {isEn ? "Top 3 High-Impact Actions" : "Le 3 Azioni a Più Alto Impatto"}
          </h2>
          <div>
            {result.topActions.map((action, i) => (
              <ActionRow key={action.id} action={action} index={i} locale={locale} />
            ))}
          </div>
        </div>

        {/* Weekly blueprint + personalised CTA */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 flex-1">
            <h2 className="text-sm font-bold text-zinc-900 mb-4">
              {isEn ? "Weekly Blueprint" : "Piano Settimanale"}
            </h2>
            <WeeklyBlueprint days={result.weeklyBlueprint} locale={locale} />
            <div className="mt-3 flex flex-wrap gap-2.5 border-t border-zinc-100 pt-3">
              {(
                [
                  { type: "cardio", it: "Cardio", en: "Cardio" },
                  { type: "strength", it: "Forza", en: "Strength" },
                  { type: "flexibility", it: "Mobilità", en: "Mobility" },
                  { type: "rest", it: "Riposo", en: "Rest" },
                ] as const
              ).map((item) => (
                <div key={item.type} className="flex items-center gap-1 text-[10px] text-zinc-400">
                  <div className={`h-2 w-2 rounded-full ${LEGEND_DOT[item.type]}`} />
                  {isEn ? item.en : item.it}
                </div>
              ))}
            </div>
          </div>

          {/* Personalised CTA */}
          <BlueprintCTA
            data={data}
            result={result}
            locale={locale}
            protocolHref={protocolHref}
          />
        </div>
      </div>

      {/* ── Restart ──────────────────────────────────────── */}
      <div className="text-center pb-2">
        <Button variant="ghost" onClick={onRestart} className="text-zinc-400 hover:text-zinc-900 gap-2 text-xs">
          <RotateCcw className="h-3.5 w-3.5" />
          {isEn ? "Start over" : "Ricomincia"}
        </Button>
      </div>
    </div>
  );
}
