"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/auth/supabase";
import { ChevronRight, Lock, Unlock, User, Activity, Scale, Ruler, Calendar, Heart, Zap, Dumbbell, Watch } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

type InputState = {
  age: number;
  heightCm: number;
  weightKg: number;
  gender: "uomo" | "donna" | "altro";
  // Advanced Metrics (Optional)
  rhr?: number; // Resting Heart Rate
  vo2max?: number;
  hrv?: number; // ms
  gripStrength?: number; // kg
};

function PopulationChart({ score }: { score: number }) {
  // Generate curve points
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 100; i += 1) {
      // Bell curve centered at 60 (average), spread 15
      const y = 100 - (80 * Math.exp(-Math.pow(i - 60, 2) / (2 * Math.pow(15, 2))));
      pts.push(`${i},${y}`);
    }
    return pts;
  }, []);

  const pathData = `M 0,100 L ${points.join(" L ")} L 100,100 Z`;

  // Calculate user Y position on the curve for the dot (percentage from top)
  // We use the same formula as above for consistency
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

        {/* The Curve Area */}
        <path d={pathData} fill="url(#curveGradient)" stroke="none" />

        {/* The Curve Line */}
        <path d={`M ${points.join(" L ")}`} fill="none" stroke="#10b981" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

        {/* User Marker Line */}
        <line
          x1={score} y1={userY} x2={score} y2="100"
          stroke="#18181b" strokeWidth="1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity="0.3"
        />

        {/* User Dot */}
        <circle cx={score} cy={userY} r="1.5" fill="#18181b" stroke="white" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Labels Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* User Label */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out"
          style={{ left: `${score}%`, top: `${userY}%`, marginTop: '-2.5rem' }}
        >
          <div className="bg-zinc-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap flex flex-col items-center">
            <span>Tu</span>
            <span className="text-[9px] font-normal opacity-80">{score}/100</span>
          </div>
          <div className="w-px h-2 bg-zinc-900/50"></div>
        </div>

        {/* Average Label */}
        <div
          className="absolute top-[25%] left-[60%] -translate-x-1/2 flex flex-col items-center opacity-40"
        >
          <span className="text-[10px] text-zinc-500 font-medium">Media</span>
        </div>
      </div>

      {/* X Axis Labels */}
      <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-zinc-400 px-1 pt-2 border-t border-zinc-100">
        <span>0 (Critico)</span>
        <span>100 (Ottimale)</span>
      </div>
    </div>
  );
}

function calculateBmi(weightKg: number, heightCm: number) {
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
}

function calculateScore(input: InputState) {
  const bmi = calculateBmi(input.weightKg, input.heightCm);
  let score = 80; // Start slightly lower to allow room for bonuses

  // 1. Basic Demographics & BMI Impact
  if (input.age > 50) score -= 5;
  if (input.age > 70) score -= 5;

  if (bmi < 18.5) score -= 20; // Underweight (Increased penalty)
  else if (bmi >= 35) score -= 75; // Severe Obesity (Score ~5)
  else if (bmi >= 30) score -= 60; // Obese (Score ~20)
  else if (bmi >= 25) score -= 20; // Overweight (Score ~60)

  // 2. Advanced Metrics Impact (if provided)
  let advancedDataPoints = 0;

  // Resting Heart Rate (RHR)
  if (input.rhr) {
    advancedDataPoints++;
    if (input.rhr < 60) score += 5;
    else if (input.rhr > 80) score -= 5;
    else score += 2; // Neutral/Okay
  }

  // VO2 Max (The biggest predictor)
  if (input.vo2max) {
    advancedDataPoints++;
    // Simplified thresholds (ideally age-adjusted)
    if (input.vo2max > 50) score += 10;
    else if (input.vo2max > 40) score += 5;
    else if (input.vo2max < 30) score -= 5;
  }

  // HRV (Highly individual, but generally higher is better)
  if (input.hrv) {
    advancedDataPoints++;
    if (input.hrv > 60) score += 3;
    else if (input.hrv < 20) score -= 2;
  }

  // Grip Strength
  if (input.gripStrength) {
    advancedDataPoints++;
    const threshold = input.gender === "donna" ? 25 : 40;
    if (input.gripStrength > threshold) score += 5;
    else if (input.gripStrength < (threshold - 10)) score -= 3;
  }

  // Precision Bonus: Reward for knowing your data
  if (advancedDataPoints > 0) {
    score += advancedDataPoints;
  }

  return Math.max(1, Math.min(99, score));
}

export function LongevityCalculator() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [input, setInput] = useState<InputState>({
    age: 40,
    heightCm: 175,
    weightKg: 75,
    gender: "uomo",
  });

  const [showAdvanced, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  // Auth State
  const [unlocked, setUnlocked] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));

  const score = useMemo(() => calculateScore(input), [input]);
  const bmi = useMemo(
    () => calculateBmi(input.weightKg, input.heightCm).toFixed(1),
    [input.heightCm, input.weightKg],
  );

  const updateInput = <K extends keyof InputState>(key: K, value: InputState[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const insightMessage = useMemo(() => {
    const bmiValue = parseFloat(bmi);

    if (bmiValue >= 35) {
      return "Critico. Il tuo indice di massa corporea indica obesità severa. Il rischio per la salute è molto elevato. È fondamentale consultare un medico specialista per un piano di intervento immediato.";
    }
    if (bmiValue >= 30) {
      return "Attenzione. Il tuo indice di massa corporea indica obesità, un fattore di rischio significativo per la longevità. La priorità assoluta è la gestione del peso sotto supervisione medica.";
    }
    if (bmiValue >= 25) {
      return "Profilo da monitorare. Il sovrappeso è un fattore infiammatorio cronico che accelera l'invecchiamento biologico. Focus su deficit calorico controllato e aumento dell'attività fisica.";
    }
    if (bmiValue < 18.5) {
      return "Attenzione. Il sottopeso può indicare scarsa riserva muscolare e fragilità. Focus su nutrizione adeguata e allenamento di forza per costruire massa magra.";
    }

    // Normal BMI logic based on score
    if (score > 85) return "Ottimo lavoro. I tuoi indicatori suggeriscono un profilo metabolico e funzionale superiore alla media. Focus sul mantenimento.";
    if (score > 60) return "Buona base di partenza. C'è margine per ottimizzare, specialmente lavorando su composizione corporea e capacità aerobica (VO2 Max).";
    return "Priorità alta. I dati indicano aree di rischio. Concentrati su sonno regolare, camminata quotidiana e riduzione degli zuccheri.";
  }, [score, bmi]);

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

  // Auth Effect (Simplified for brevity as logic is same)
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

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUnlocked(false);
    setSessionEmail(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
              <User className="h-5 w-5 text-zinc-500" />
              I tuoi dati
            </h2>
            {showAdvanced && (
              <div className="flex bg-zinc-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={clsx("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === "basic" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                >
                  Base
                </button>
                <button
                  onClick={() => setActiveTab("advanced")}
                  className={clsx("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === "advanced" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                >
                  Avanzati
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {activeTab === "basic" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">Età</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      min={18}
                      max={95}
                      value={input.age}
                      onChange={(e) => updateInput("age", Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">Genere</label>
                  <select
                    value={input.gender}
                    onChange={(e) => updateInput("gender", e.target.value as InputState["gender"])}
                    className="w-full rounded-lg border border-zinc-300 py-2.5 px-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="uomo">Uomo</option>
                    <option value="donna">Donna</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Altezza (cm)</label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="number"
                        min={130}
                        max={220}
                        value={input.heightCm}
                        onChange={(e) => updateInput("heightCm", Number(e.target.value))}
                        className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700">Peso (kg)</label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="number"
                        min={35}
                        max={200}
                        value={input.weightKg}
                        onChange={(e) => updateInput("weightKg", Number(e.target.value))}
                        className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "advanced" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Inserisci i dati dal tuo smartwatch o dalle ultime analisi per raffinare il punteggio. Lascia vuoto se non conosci il valore.
                </p>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 flex items-center justify-between">
                    <span>RHR (Battiti a riposo)</span>
                    <span className="text-xs text-zinc-400 font-normal">bpm</span>
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      placeholder="es. 55"
                      value={input.rhr || ""}
                      onChange={(e) => updateInput("rhr", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 flex items-center justify-between">
                    <span>VO2 Max</span>
                    <span className="text-xs text-zinc-400 font-normal">ml/kg/min</span>
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      placeholder="es. 45"
                      value={input.vo2max || ""}
                      onChange={(e) => updateInput("vo2max", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 flex items-center justify-between">
                    <span>HRV (Variabilità cardiaca)</span>
                    <span className="text-xs text-zinc-400 font-normal">ms</span>
                  </label>
                  <div className="relative">
                    <Watch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      placeholder="es. 60"
                      value={input.hrv || ""}
                      onChange={(e) => updateInput("hrv", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 flex items-center justify-between">
                    <span>Grip Strength (Presa)</span>
                    <span className="text-xs text-zinc-400 font-normal">kg</span>
                  </label>
                  <div className="relative">
                    <Dumbbell className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="number"
                      placeholder="es. 40"
                      value={input.gripStrength || ""}
                      onChange={(e) => updateInput("gripStrength", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {!showAdvanced ? (
              <button
                onClick={() => { setShowResult(true); }}
                className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98]"
              >
                Calcola Profilo Longevità
              </button>
            ) : (
              activeTab === "basic" && (
                <button
                  onClick={() => setActiveTab("advanced")}
                  className="w-full rounded-full border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-50 hover:border-zinc-300"
                >
                  Hai dati da smartwatch?
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-7 space-y-6">
        {showAdvanced ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Basic Insights */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  Analisi & Punteggio
                </h2>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  Gratuito
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4 text-center relative overflow-hidden">
                  <p className="text-sm text-zinc-500 mb-1">Longevity Score</p>
                  <p className="text-4xl font-bold text-zinc-900">{score}<span className="text-lg text-zinc-400 font-normal">/100</span></p>
                  {input.vo2max && (
                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Dati avanzati inclusi" />
                  )}
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 text-center">
                  <p className="text-sm text-zinc-500 mb-1">BMI</p>
                  <p className="text-3xl font-bold text-zinc-900">{bmi}</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                <p className="text-sm font-medium text-zinc-900 mb-2">Insight:</p>
                <p className="text-sm text-zinc-600">
                  {insightMessage}
                </p>
                {!input.vo2max && !input.rhr && (
                  <p className="mt-2 text-xs text-zinc-400 italic">
                    *Stima basata solo su dati antropometrici. Aggiungi RHR o VO2 Max per maggiore precisione.
                  </p>
                )}
              </div>
            </div>

            {/* CTA for Clinical Assessment */}
            <div className="rounded-2xl bg-zinc-900 p-6 text-white shadow-lg transform transition-all hover:scale-[1.01]">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="rounded-full bg-white/10 p-3 text-emerald-400 shrink-0">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Passa dalla stima alla certezza
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-lg">
                    Il calcolatore offre una stima statistica. Per un piano d'azione clinico e personalizzato, hai bisogno di misurazioni reali e di un team medico dedicato.
                  </p>
                  <Link
                    href="/servizi"
                    className="mt-4 inline-flex items-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  >
                    Scopri il Nostro Protocollo Clinico<ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Advanced Benchmarks (Gated) */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  {unlocked ? <Unlock className="h-5 w-5 text-indigo-500" /> : <Lock className="h-5 w-5 text-zinc-400" />}
                  Benchmark di Popolazione
                </h2>
                {sessionEmail && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 hidden sm:inline">Logged as {sessionEmail}</span>
                    <button
                      onClick={handleSignOut}
                      className="text-xs font-medium text-zinc-900 hover:underline"
                    >
                      Esci
                    </button>
                  </div>
                )}
              </div>

              <div className={clsx("space-y-4 transition-all duration-500", !unlocked && "blur-sm opacity-50 select-none")}>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center border-b border-zinc-100 pb-4">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Percentile</p>
                      <p className="font-bold text-zinc-900">{percentileText}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Gap Ottimale</p>
                      <p className={clsx("font-bold", gapPoints > 0 ? "text-red-500" : "text-emerald-500")}>
                        {gapPoints > 0 ? `-${gapPoints}` : "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Potenziale</p>
                      <p className="font-bold text-emerald-600">+{improvementMin}-{improvementMax}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-medium text-zinc-900 mb-2">La tua posizione nella curva di popolazione</p>
                    <PopulationChart score={score} />
                  </div>
                </div>
              </div>

              {!unlocked && !checkingSession && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 text-center">
                  <Lock className="h-8 w-8 text-zinc-900 mb-3" />
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">Sblocca l'analisi completa</h3>
                  <p className="text-sm text-zinc-600 mb-6 max-w-xs">
                    Accedi gratuitamente per vedere come ti posizioni rispetto a profili simili e ricevere il piano d'azione.
                  </p>

                  <div className="w-full max-w-xs space-y-3">
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                    >
                      Accedi per sbloccare
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
              <h3 className="text-lg font-medium text-zinc-900">In attesa dei dati</h3>
              <p className="text-sm text-zinc-500">
                Compila il modulo a sinistra per generare la tua analisi personalizzata.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
