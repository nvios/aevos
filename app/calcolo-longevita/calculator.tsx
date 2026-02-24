"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/auth/supabase";
import { ChevronRight, Lock, Unlock, User, Activity, Scale, Ruler, Calendar } from "lucide-react";
import clsx from "clsx";

type InputState = {
  age: number;
  heightCm: number;
  weightKg: number;
  gender: "uomo" | "donna" | "altro";
};

function calculateBmi(weightKg: number, heightCm: number) {
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
}

function calculateScore(input: InputState) {
  const bmi = calculateBmi(input.weightKg, input.heightCm);
  let score = 100;

  if (input.age > 50) score -= 8;
  if (input.age > 60) score -= 7;
  if (bmi < 18.5 || bmi > 30) score -= 10;
  if (bmi >= 25 && bmi <= 30) score -= 5;

  return Math.max(30, Math.min(90, score));
}

export function LongevityCalculator() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [input, setInput] = useState<InputState>({
    age: 40,
    heightCm: 175,
    weightKg: 75,
    gender: "uomo",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));
  const [showResult, setShowResult] = useState(false);

  const basicScore = useMemo(() => calculateScore(input), [input]);
  const bmi = useMemo(
    () => calculateBmi(input.weightKg, input.heightCm).toFixed(1),
    [input.heightCm, input.weightKg],
  );

  const updateInput = <K extends keyof InputState>(key: K, value: InputState[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const currentEmail = data.session?.user?.email ?? null;
      setSessionEmail(currentEmail);
      setUnlocked(Boolean(data.session));
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentEmail = session?.user?.email ?? null;
      setSessionEmail(currentEmail);
      setUnlocked(Boolean(session));
      if (session) {
        setStatus("Accesso confermato. Benchmark avanzati sbloccati.");
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleOAuth = async () => {
    if (!supabase) {
      setStatus("Configura Supabase nelle variabili ambiente per attivare login.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/calcolo-longevita`,
      },
    });

    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus("Reindirizzamento a Google in corso...");
  };

  const handleEmail = async () => {
    if (!supabase) {
      setStatus("Configura Supabase nelle variabili ambiente per attivare login.");
      return;
    }

    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (!signIn.error) {
      setStatus("Accesso effettuato.");
      return;
    }

    const signUp = await supabase.auth.signUp({ email, password });
    if (signUp.error) {
      setStatus(signUp.error.message);
      return;
    }

    setStatus("Account creato. Se richiesto, conferma email per completare accesso.");
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUnlocked(false);
    setSessionEmail(null);
    setStatus("Sessione terminata.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-zinc-900 flex items-center gap-2">
            <User className="h-5 w-5 text-zinc-500" />
            I tuoi dati
          </h2>
          
          <div className="space-y-5">
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

            <button
              onClick={() => setShowResult(true)}
              className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98]"
            >
              Calcola Profilo Longevità
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-7 space-y-6">
        {showResult ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Basic Insights */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  Analisi Preliminare
                </h2>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  Gratuito
                </span>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4 text-center">
                  <p className="text-sm text-zinc-500 mb-1">Punteggio Stimato</p>
                  <p className="text-3xl font-bold text-zinc-900">{basicScore}<span className="text-lg text-zinc-400 font-normal">/90</span></p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4 text-center">
                  <p className="text-sm text-zinc-500 mb-1">BMI</p>
                  <p className="text-3xl font-bold text-zinc-900">{bmi}</p>
                </div>
              </div>
              
              <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                <p className="text-sm font-medium text-zinc-900 mb-2">Priorità Immediata:</p>
                <p className="text-sm text-zinc-600">
                  Basato sui tuoi dati, il focus iniziale dovrebbe essere sulla regolarizzazione del sonno 
                  e l'ottimizzazione della composizione corporea per migliorare il metabolismo basale.
                </p>
              </div>
            </div>

            {/* Advanced Benchmarks (Gated) */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  {unlocked ? <Unlock className="h-5 w-5 text-indigo-500" /> : <Lock className="h-5 w-5 text-zinc-400" />}
                  Benchmark Avanzati
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
                    <button
                      onClick={handleOAuth}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continua con Google
                    </button>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-zinc-200"></div>
                      <span className="flex-shrink-0 px-2 text-xs text-zinc-400">oppure email</span>
                      <div className="flex-grow border-t border-zinc-200"></div>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
                      />
                      <button
                        onClick={handleEmail}
                        className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
                      >
                        Accedi / Registrati
                      </button>
                    </div>
                    {status && <p className="text-xs text-center text-zinc-600">{status}</p>}
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
