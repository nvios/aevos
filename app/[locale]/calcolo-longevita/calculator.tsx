"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/auth/supabase";
import { ChevronRight, Lock, Unlock, User, Activity, Scale, Ruler, Calendar, Heart, Zap } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { localeHref } from "@/lib/i18n/paths";
import { analytics } from "@/lib/analytics/events";

type InputState = {
  age: number | "";
  heightCm: number | "";
  weightKg: number | "";
  gender: "uomo" | "donna" | "altro";
  rhr?: number;
  vo2max?: number;
};

function PopulationChart({ score, locale }: { score: number; locale: string }) {
  const isEn = locale === 'en';
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 100; i += 1) {
      const y = 100 - (80 * Math.exp(-Math.pow(i - 60, 2) / (2 * Math.pow(15, 2))));
      pts.push(`${i},${y}`);
    }
    return pts;
  }, []);

  const pathData = `M 0,100 L ${points.join(" L ")} L 100,100 Z`;
  const userY = 100 - (80 * Math.exp(-Math.pow(score - 60, 2) / (2 * Math.pow(15, 2))));

  return (
    <div className="relative h-48 w-full mt-8 select-none">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={pathData} fill="url(#curveGradient)" stroke="none" />
        <path d={`M ${points.join(" L ")}`} fill="none" stroke="#10b981" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        <line x1={score} y1={userY} x2={score} y2="100" stroke="#18181b" strokeWidth="1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity="0.3" />
        <circle cx={score} cy={userY} r="1.5" fill="#18181b" stroke="white" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out" style={{ left: `${score}%`, top: `${userY}%`, marginTop: '-2.5rem' }}>
          <div className="bg-zinc-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap flex flex-col items-center">
            <span>{isEn ? 'You' : 'Tu'}</span>
            <span className="text-[9px] font-normal opacity-80">{score}/100</span>
          </div>
          <div className="w-px h-2 bg-zinc-900/50"></div>
        </div>
        <div className="absolute top-[25%] left-[60%] -translate-x-1/2 flex flex-col items-center opacity-40">
          <span className="text-[10px] text-zinc-500 font-medium">{isEn ? 'Average' : 'Media'}</span>
        </div>
      </div>
      <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-zinc-400 px-1 pt-2 border-t border-zinc-100">
        <span>0 ({isEn ? 'Critical' : 'Critico'})</span>
        <span>100 ({isEn ? 'Optimal' : 'Ottimale'})</span>
      </div>
    </div>
  );
}

function calculateBmi(weightKg: number | "", heightCm: number | "") {
  if (weightKg === "" || heightCm === "" || heightCm === 0) return 0;
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
}

function calculateScore(input: InputState) {
  const bmi = calculateBmi(input.weightKg, input.heightCm);
  let score = 80;
  const age = input.age || 0;
  if (age > 50) score -= 5;
  if (age > 70) score -= 5;
  if (bmi < 18.5) score -= 20;
  else if (bmi >= 35) score -= 75;
  else if (bmi >= 30) score -= 60;
  else if (bmi >= 25) score -= 20;
  let advancedDataPoints = 0;
  if (input.rhr) {
    advancedDataPoints++;
    if (input.rhr < 60) score += 5;
    else if (input.rhr > 80) score -= 5;
    else score += 2;
  }
  if (input.vo2max) {
    advancedDataPoints++;
    if (input.vo2max > 50) score += 10;
    else if (input.vo2max > 40) score += 5;
    else if (input.vo2max < 30) score -= 5;
  }
  if (advancedDataPoints > 0) score += advancedDataPoints;
  return Math.max(1, Math.min(99, score));
}

function handleNumericChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (val: number | "") => void
) {
  if (e.target.value === "") {
    setter("");
    return;
  }
  const val = e.target.valueAsNumber;
  if (!isNaN(val)) setter(val);
}

export function LongevityCalculator() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const locale = useLocale();
  const isEn = locale === 'en';
  const lp = (path: string) => localeHref(path, locale);
  const [input, setInput] = useState<InputState>(() => {
    const defaults: InputState = { age: 40, heightCm: 175, weightKg: 75, gender: "uomo" };
    if (typeof window === "undefined") return defaults;
    try {
      const raw = localStorage.getItem("aevos_calculator_data");
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...defaults, ...parsed };
      }
    } catch { /* ignore */ }
    return defaults;
  });

  const [showAdvanced, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [unlocked, setUnlocked] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));

  const score = useMemo(() => calculateScore(input), [input]);
  const bmi = useMemo(() => calculateBmi(input.weightKg, input.heightCm).toFixed(1), [input.heightCm, input.weightKg]);

  const updateInput = <K extends keyof InputState>(key: K, value: InputState[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const insightMessage = useMemo(() => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue >= 35) {
      return isEn
        ? "Critical. Your BMI indicates severe obesity. Health risk is very high. It is essential to consult a specialist for an immediate intervention plan."
        : "Critico. Il tuo indice di massa corporea indica obesità severa. Il rischio per la salute è molto elevato. È fondamentale consultare un medico specialista per un piano di intervento immediato.";
    }
    if (bmiValue >= 30) {
      return isEn
        ? "Warning. Your BMI indicates obesity, a significant risk factor for longevity. The top priority is weight management under medical supervision."
        : "Attenzione. Il tuo indice di massa corporea indica obesità, un fattore di rischio significativo per la longevità. La priorità assoluta è la gestione del peso sotto supervisione medica.";
    }
    if (bmiValue >= 25) {
      return isEn
        ? "Monitor. Being overweight is a chronic inflammatory factor that accelerates biological aging. Focus on a controlled caloric deficit and increased physical activity."
        : "Profilo da monitorare. Il sovrappeso è un fattore infiammatorio cronico che accelera l'invecchiamento biologico. Focus su deficit calorico controllato e aumento dell'attività fisica.";
    }
    if (bmiValue < 18.5) {
      return isEn
        ? "Warning. Being underweight may indicate poor muscle reserve and fragility. Focus on adequate nutrition and strength training to build lean mass."
        : "Attenzione. Il sottopeso può indicare scarsa riserva muscolare e fragilità. Focus su nutrizione adeguata e allenamento di forza per costruire massa magra.";
    }
    if (score > 85) return isEn
      ? "Great work. Your indicators suggest a metabolic and functional profile above average. Focus on maintenance."
      : "Ottimo lavoro. I tuoi indicatori suggeriscono un profilo metabolico e funzionale superiore alla media. Focus sul mantenimento.";
    if (score > 60) return isEn
      ? "Good starting point. There is room to optimize, especially by working on body composition and aerobic capacity (VO2 Max)."
      : "Buona base di partenza. C'è margine per ottimizzare, specialmente lavorando su composizione corporea e capacità aerobica (VO2 Max).";
    return isEn
      ? "High priority. The data indicates areas of risk. Focus on regular sleep, daily walking and reducing sugars."
      : "Priorità alta. I dati indicano aree di rischio. Concentrati su sonno regolare, camminata quotidiana e riduzione degli zuccheri.";
  }, [score, bmi, isEn]);

  const percentileText = useMemo(() => {
    if (score >= 95) return "Top 1%";
    if (score >= 90) return "Top 5%";
    if (score >= 80) return "Top 15%";
    if (score >= 70) return "Top 30%";
    if (score >= 60) return "Top 50%";
    return "Bottom 40%";
  }, [score]);

  const gapPoints = 100 - score;
  const improvementMin = Math.max(1, Math.floor(gapPoints * 0.15));
  const improvementMax = Math.max(2, Math.ceil(gapPoints * 0.3));

  useEffect(() => {
    try {
      localStorage.setItem("aevos_calculator_data", JSON.stringify({
        age: input.age,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        gender: input.gender,
      }));
    } catch { /* ignore */ }
  }, [input.age, input.heightCm, input.weightKg, input.gender]);

  useEffect(() => {
    if (!supabase) return;
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSessionEmail(data.session?.user?.email ?? null);
      setUnlocked(Boolean(data.session));
      setCheckingSession(false);
    });
    return () => { isMounted = false; };
  }, [supabase]);

  useEffect(() => {
    if (showAdvanced) {
      analytics.calculatorScoreViewed({
        score,
        bmi: parseFloat(bmi),
        has_rhr: Boolean(input.rhr),
        has_vo2max: Boolean(input.vo2max),
        age: input.age || 0,
        gender: input.gender,
      });
    }
  }, [showAdvanced]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUnlocked(false);
    setSessionEmail(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
              <User className="h-5 w-5 text-zinc-500" />
              {isEn ? 'Your data' : 'I tuoi dati'}
            </h2>
            {showAdvanced && (
              <div className="flex bg-zinc-100 rounded-lg p-1">
                <button onClick={() => setActiveTab("basic")} className={clsx("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === "basic" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}>
                  {isEn ? 'Basic' : 'Base'}
                </button>
                <button onClick={() => setActiveTab("advanced")} className={clsx("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === "advanced" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}>
                  {isEn ? 'Advanced' : 'Avanzati'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {activeTab === "basic" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">{isEn ? 'Age' : 'Età'}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input type="number" min={18} max={95} value={input.age} onChange={(e) => handleNumericChange(e, (v) => updateInput("age", v))} className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">{isEn ? 'Gender' : 'Genere'}</label>
                  <select value={input.gender} onChange={(e) => updateInput("gender", e.target.value as InputState["gender"])} className="w-full rounded-lg border border-zinc-300 py-2.5 px-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900">
                    <option value="uomo">{isEn ? 'Male' : 'Uomo'}</option>
                    <option value="donna">{isEn ? 'Female' : 'Donna'}</option>
                    <option value="altro">{isEn ? 'Other' : 'Altro'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">{isEn ? 'Height (cm)' : 'Altezza (cm)'}</label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input type="number" min={130} max={220} value={input.heightCm} onChange={(e) => handleNumericChange(e, (v) => updateInput("heightCm", v))} className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">{isEn ? 'Weight (kg)' : 'Peso (kg)'}</label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input type="number" min={35} max={200} value={input.weightKg} onChange={(e) => handleNumericChange(e, (v) => updateInput("weightKg", v))} className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {isEn
                    ? 'Enter data from your smartwatch or latest tests to refine the score. Leave blank if unknown.'
                    : 'Inserisci i dati dal tuo smartwatch o dalle ultime analisi per raffinare il punteggio. Lascia vuoto se non conosci il valore.'}
                </p>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 flex items-center justify-between">
                    <span>{isEn ? 'RHR (Resting Heart Rate)' : 'RHR (Battiti a riposo)'}</span>
                    <span className="text-xs text-zinc-400 font-normal">bpm</span>
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input type="number" placeholder={isEn ? "e.g. 55" : "es. 55"} value={input.rhr || ""} onChange={(e) => updateInput("rhr", e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 flex items-center justify-between">
                    <span>VO2 Max</span>
                    <span className="text-xs text-zinc-400 font-normal">ml/kg/min</span>
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input type="number" placeholder={isEn ? "e.g. 45" : "es. 45"} value={input.vo2max || ""} onChange={(e) => updateInput("vo2max", e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900" />
                  </div>
                </div>
              </div>
            )}

            {!showAdvanced ? (
              <button disabled={input.age === "" || input.heightCm === "" || input.weightKg === ""} onClick={() => {
                setShowResult(true);
                const bmiVal = calculateBmi(input.weightKg, input.heightCm);
                analytics.calculatorStarted({ age: input.age || 0, gender: input.gender, bmi: parseFloat(bmiVal.toFixed(1)) });
              }} className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                {isEn ? 'Calculate Longevity Profile' : 'Calcola Profilo Longevità'}
              </button>
            ) : (
              activeTab === "basic" && (
                <button onClick={() => { setActiveTab("advanced"); analytics.calculatorAdvancedTabOpened(); }} className="w-full rounded-full border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50 hover:border-zinc-300">
                  {isEn ? 'Have smartwatch data?' : 'Hai dati da smartwatch?'}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        {showAdvanced ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  {isEn ? 'Analysis & Score' : 'Analisi & Punteggio'}
                </h2>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  {isEn ? 'Free' : 'Gratuito'}
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4 text-center relative overflow-hidden">
                  <p className="text-sm text-zinc-500 mb-1">Longevity Score</p>
                  <p className="text-4xl font-bold text-zinc-900">{score}<span className="text-lg text-zinc-400 font-normal">/100</span></p>
                  {input.vo2max && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title={isEn ? "Advanced data included" : "Dati avanzati inclusi"} />
                  )}
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 text-center">
                  <p className="text-sm text-zinc-500 mb-1">BMI</p>
                  <p className="text-3xl font-bold text-zinc-900">{bmi}</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                <p className="text-sm font-medium text-zinc-900 mb-2">Insight:</p>
                <p className="text-sm text-zinc-600">{insightMessage}</p>
                {!input.vo2max && !input.rhr && (
                  <p className="mt-2 text-xs text-zinc-400 italic">
                    {isEn
                      ? '*Estimate based on anthropometric data only. Add RHR or VO2 Max for greater precision.'
                      : '*Stima basata solo su dati antropometrici. Aggiungi RHR o VO2 Max per maggiore precisione.'}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900 p-6 text-white shadow-lg transform transition-all hover:scale-[1.01]">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="rounded-full bg-white/10 p-3 text-emerald-400 shrink-0">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isEn ? 'From estimate to certainty' : 'Passa dalla stima alla certezza'}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-lg">
                    {isEn
                      ? 'The calculator offers a statistical estimate. For a clinical and personalized action plan, you need real measurements and a dedicated medical team.'
                      : "Il calcolatore offre una stima statistica. Per un piano d'azione clinico e personalizzato, hai bisogno di misurazioni reali e di un team medico dedicato."}
                  </p>
                  <Link href={lp("/servizi")} onClick={() => analytics.calculatorCtaClicked("/servizi")} className="mt-4 inline-flex items-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    {isEn ? 'Discover Our Personalised Plans' : 'Scopri i Nostri Percorsi Personalizzati'}<ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  {unlocked ? <Unlock className="h-5 w-5 text-indigo-500" /> : <Lock className="h-5 w-5 text-zinc-400" />}
                  {isEn ? 'Population Benchmark' : 'Benchmark di Popolazione'}
                </h2>
                {sessionEmail && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 hidden sm:inline">Logged as {sessionEmail}</span>
                    <button onClick={handleSignOut} className="text-xs font-medium text-zinc-900 hover:underline">
                      {isEn ? 'Sign out' : 'Esci'}
                    </button>
                  </div>
                )}
              </div>

              <div className={clsx("space-y-4 transition-all duration-500", !unlocked && "blur-sm opacity-50 select-none")}>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center border-b border-zinc-100 pb-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">{isEn ? 'Percentile' : 'Percentile'}</p>
                      <p className="font-bold text-zinc-900">{percentileText}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">{isEn ? 'Optimal Gap' : 'Gap Ottimale'}</p>
                      <p className={clsx("font-bold", gapPoints > 0 ? "text-red-500" : "text-emerald-500")}>
                        {gapPoints > 0 ? `-${gapPoints}` : "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">{isEn ? 'Potential' : 'Potenziale'}</p>
                      <p className="font-bold text-emerald-600">+{improvementMin}-{improvementMax}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-medium text-zinc-900 mb-2">
                      {isEn ? 'Your position in the population curve' : 'La tua posizione nella curva di popolazione'}
                    </p>
                    <PopulationChart score={score} locale={locale} />
                  </div>
                </div>
              </div>

              {!unlocked && !checkingSession && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 text-center">
                  <Lock className="h-8 w-8 text-zinc-900 mb-3" />
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {isEn ? 'Unlock full analysis' : "Sblocca l'analisi completa"}
                  </h3>
                  <p className="text-sm text-zinc-600 mb-6 max-w-xs">
                    {isEn
                      ? 'Sign in for free to see how you rank against similar profiles and receive your action plan.'
                      : "Accedi gratuitamente per vedere come ti posizioni rispetto a profili simili e ricevere il piano d'azione."}
                  </p>
                  <div className="w-full max-w-xs space-y-3">
                    <Link href="/login" onClick={() => analytics.calculatorUnlockClicked()} className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                      {isEn ? 'Sign in to unlock' : 'Accedi per sbloccare'}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center">
            <div className="max-w-xs space-y-2">
              <Activity className="mx-auto h-10 w-10 text-zinc-300" />
              <h3 className="text-lg font-medium text-zinc-900">{isEn ? 'Awaiting data' : 'In attesa dei dati'}</h3>
              <p className="text-sm text-zinc-500">
                {isEn
                  ? 'Fill in the form on the left to generate your personalized analysis.'
                  : 'Compila il modulo a sinistra per generare la tua analisi personalizzata.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
