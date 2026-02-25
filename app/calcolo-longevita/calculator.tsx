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

  if (bmi < 18.5) score -= 5; // Underweight
  if (bmi >= 25 && bmi < 30) score -= 3; // Overweight
  if (bmi >= 30) score -= 10; // Obese

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

  return Math.max(10, Math.min(99, score));
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
                  {score > 85 ? (
                    "Ottimo lavoro. I tuoi indicatori suggeriscono un profilo metabolico e funzionale superiore alla media. Focus sul mantenimento."
                  ) : score > 60 ? (
                    "Buona base di partenza. C'è margine per ottimizzare, specialmente lavorando su composizione corporea e capacità aerobica (VO2 Max)."
                  ) : (
                    "Priorità alta. I dati indicano aree di rischio. Concentrati su sonno regolare, camminata quotidiana e riduzione degli zuccheri."
                  )}
                </p>
                {!input.vo2max && !input.rhr && (
                  <p className="mt-2 text-xs text-zinc-400 italic">
                    *Stima basata solo su dati antropometrici. Aggiungi RHR o VO2 Max per maggiore precisione.
                  </p>
                )}
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
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <span className="text-sm text-zinc-600">Percentile fascia età</span>
                    <span className="font-semibold text-zinc-900">Top 42%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <span className="text-sm text-zinc-600">Gap su profilo ottimale</span>
                    <span className="font-semibold text-red-500">-13 punti</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <span className="text-sm text-zinc-600">Trend atteso (90gg)</span>
                    <span className="font-semibold text-emerald-600">+4 a +7 punti</span>
                  </div>
                  <div className="h-32 w-full bg-zinc-100 rounded-lg flex items-end justify-between px-4 pb-2">
                    <div className="w-8 bg-zinc-300 h-[40%] rounded-t"></div>
                    <div className="w-8 bg-zinc-300 h-[60%] rounded-t"></div>
                    <div className="w-8 bg-zinc-300 h-[50%] rounded-t"></div>
                    <div className="w-8 bg-zinc-300 h-[70%] rounded-t"></div>
                    <div className="w-8 bg-zinc-300 h-[80%] rounded-t"></div>
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

            {/* CTA for Clinical Assessment */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 transition-all hover:bg-emerald-50 hover:shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Passa dalla stima alla certezza
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
                    Il calcolatore offre una stima statistica. Per un piano d'azione clinico e personalizzato, hai bisogno di misurazioni reali.
                  </p>
                  <Link
                    href="/servizi"
                    className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    Scopri il Protocollo Clinico Aevos <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
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
