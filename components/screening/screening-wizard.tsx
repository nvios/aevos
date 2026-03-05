"use client";

import { useState, useEffect } from "react";
import { BIOMARKERS } from "@/lib/config/biomarkers";
import { PROTOCOLS } from "@/lib/content/protocols";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";

type ScreeningData = {
  [key: string]: number | null; // null means "I don't know"
};

const STORAGE_KEY = "aevos_screening_data";
const EXPIRY_DAYS = 5;

const BIOMARKER_GROUPS: Record<string, string> = {
  metabolic: "Metabolismo",
  inflammation: "Infiammazione",
  hormonal: "Profilo Ormonale",
  nutritional: "Nutrizione",
  functional: "Funzionalità & Wearable",
  body_comp: "Composizione Corporea",
};

const GROUP_ORDER = Object.keys(BIOMARKER_GROUPS);

export function ScreeningWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ScreeningData>({});
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.timestamp) {
          const { data: storedData, step: storedStep, timestamp } = parsed;
          const ageInDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
          
          if (ageInDays < EXPIRY_DAYS) {
            if (storedData) setData(storedData);
            // We don't restore step to avoid confusion if structure changed, or maybe restore group index
            // For now, let's start from beginning or restore if valid
            if (typeof storedStep === 'number' && storedStep < GROUP_ORDER.length) {
              setStep(storedStep);
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } else {
           localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to parse screening data", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data,
        step,
        timestamp: Date.now()
      }));
    }
  }, [data, step, isMounted]);

  const handleBiomarkerChange = (id: string, value: string) => {
    if (value === "") {
        setData((prev) => {
            const newData = { ...prev };
            delete newData[id];
            return newData;
        });
        return;
    }
    const numValue = parseFloat(value);
    setData((prev) => ({ ...prev, [id]: isNaN(numValue) ? null : numValue }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let count = 0;
    
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      const biomarker = BIOMARKERS.find(b => b.id === key);
      if (!biomarker) return;

      if (value >= biomarker.optimalRange.min && value <= biomarker.optimalRange.max) {
        totalScore += 10;
      } else if (value >= biomarker.normalRange.min && value <= biomarker.normalRange.max) {
        totalScore += 5;
      }
      count++;
    });

    const maxPossible = count * 10;
    const healthScore = count > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    const totalBiomarkers = BIOMARKERS.length;
    const providedBiomarkers = Object.values(data).filter(v => v !== null && v !== undefined).length;
    const confidenceScore = Math.round((providedBiomarkers / totalBiomarkers) * 100);

    return { healthScore, confidenceScore };
  };

  const getRecommendation = () => {
    const scores: Record<string, number> = {};

    Object.entries(data).forEach(([key, value]) => {
      // If value is missing or out of optimal range, boost the related protocol
      const biomarker = BIOMARKERS.find(b => b.id === key);
      if (!biomarker) return;

      if (value === null || value === undefined) {
        // Missing data -> slight boost to related protocol to encourage measuring
        scores[biomarker.protocolSlug] = (scores[biomarker.protocolSlug] || 0) + 1;
      } else if (value < biomarker.optimalRange.min || value > biomarker.optimalRange.max) {
        // Out of optimal range -> strong boost
        scores[biomarker.protocolSlug] = (scores[biomarker.protocolSlug] || 0) + 3;
      }
    });
    
    // Also consider completely missing biomarkers that are not in data at all (skipped)
    BIOMARKERS.forEach(b => {
        if (data[b.id] === undefined || data[b.id] === null) {
             scores[b.protocolSlug] = (scores[b.protocolSlug] || 0) + 1;
        }
    });

    // Find protocol with max score
    let maxScore = -1;
    let recommendedSlug = 'longevita'; // Default

    Object.entries(scores).forEach(([slug, score]) => {
      if (score > maxScore) {
        maxScore = score;
        recommendedSlug = slug;
      }
    });

    return PROTOCOLS[recommendedSlug] || PROTOCOLS['longevita'];
  };

  const { healthScore, confidenceScore } = calculateScore();
  const recommendedProtocol = getRecommendation();
  
  const currentGroupKey = GROUP_ORDER[step];
  const isComplete = step >= GROUP_ORDER.length;
  
  const currentBiomarkers = BIOMARKERS.filter(b => b.category === currentGroupKey);

  if (isComplete) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Punteggio Salute</CardTitle>
              <CardDescription>Basato sui dati forniti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-zinc-900 mb-2">{healthScore}/100</div>
            </CardContent>
          </Card>
          
          <Card className="border-zinc-200 shadow-sm relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">Affidabilità Analisi</CardTitle>
              <CardDescription>Completezza del profilo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold mb-2 ${confidenceScore < 80 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {confidenceScore}%
              </div>
              <p className="text-zinc-500 text-sm">
                {confidenceScore < 100 
                  ? "Dati incompleti. Il risultato è parziale." 
                  : "Analisi completa e affidabile."}
              </p>
            </CardContent>
            {confidenceScore < 100 && (
                <div className="bg-amber-50 border-t border-amber-100 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Dati mancanti rilevati</p>
                      <p>
                        Per una valutazione precisa, ti consigliamo di effettuare i test mancanti.
                        <Link href={`/servizi/protocolli/${recommendedProtocol.slug}`} className="block mt-1 font-semibold underline hover:text-amber-900">
                          Prenota check-up con 20% di sconto &rarr;
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </Card>
        </div>

        {/* Recommendation Card */}
        <Card className="bg-zinc-900 text-white border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
            
          <CardHeader className="text-center pb-2 relative z-10">
            <CardTitle className="text-2xl font-bold">Il tuo prossimo passo</CardTitle>
            <CardDescription className="text-zinc-400 text-lg">
              Protocollo consigliato per te
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6 relative z-10 pt-4">
            <div>
                <h3 className="text-3xl font-bold text-white mb-2">{recommendedProtocol.title}</h3>
                <p className="text-zinc-300 max-w-xl mx-auto">{recommendedProtocol.subtitle}</p>
            </div>

            <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-200 font-semibold px-8 h-12 rounded-full" asChild>
              <Link href={`/servizi/protocolli/${recommendedProtocol.slug}`}>
                Scopri il Protocollo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <div className="text-center">
             <Button variant="ghost" onClick={() => {
                 setStep(0);
                 setData({});
                 localStorage.removeItem(STORAGE_KEY);
             }} className="text-zinc-500 hover:text-zinc-900">
                 Ricomincia da capo
             </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-zinc-500 mb-3">
          <span>{BIOMARKER_GROUPS[currentGroupKey]}</span>
          <span>Step {step + 1} di {GROUP_ORDER.length}</span>
        </div>
        <Progress value={((step) / GROUP_ORDER.length) * 100} className="h-2 bg-zinc-100" indicatorClassName="bg-zinc-900" />
      </div>

      <Card className="border-zinc-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-900">{BIOMARKER_GROUPS[currentGroupKey]}</CardTitle>
          <CardDescription>
            Inserisci i tuoi valori recenti. Lascia vuoto se non conosci il dato.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {currentBiomarkers.map((biomarker) => (
                        <div key={biomarker.id} className="space-y-2">
                            <div className="flex flex-col gap-1 mb-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor={biomarker.id} className="text-base font-semibold text-zinc-900">
                                        {biomarker.name}
                                    </Label>
                                </div>
                                <p className="text-xs text-zinc-500">{biomarker.description}</p>
                            </div>
                            <div className="relative">
                                <Input
                                    id={biomarker.id}
                                    type="number"
                                    placeholder={`${biomarker.optimalRange.min} - ${biomarker.optimalRange.max}`}
                                    value={data[biomarker.id] === null || data[biomarker.id] === undefined ? '' : data[biomarker.id] as number}
                                    onChange={(e) => handleBiomarkerChange(biomarker.id, e.target.value)}
                                    className="pr-12"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-zinc-400 text-sm">{biomarker.unit}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6 border-t bg-zinc-50/50">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Indietro
          </Button>
          <Button onClick={() => setStep(step + 1)} className="bg-zinc-900 hover:bg-zinc-800 text-white min-w-[120px]">
            {step === GROUP_ORDER.length - 1 ? "Vedi Risultati" : "Avanti"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
