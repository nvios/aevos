"use client";

import { useState } from "react";
import { BIOMARKERS, Biomarker } from "@/lib/config/biomarkers";
import { PROTOCOLS } from "@/lib/content/protocols";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

type ScreeningData = {
  [key: string]: number | null; // null means "I don't know"
};

export function ScreeningWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ScreeningData>({});
  const [showUpsell, setShowUpsell] = useState<string | null>(null); // ID of biomarker triggering upsell

  const handleBiomarkerChange = (id: string, value: string) => {
    const numValue = parseFloat(value);
    setData((prev) => ({ ...prev, [id]: isNaN(numValue) ? undefined : numValue }));
  };

  const handleMissingData = (biomarker: Biomarker, isMissing: boolean) => {
    if (isMissing) {
      setData((prev) => ({ ...prev, [biomarker.id]: null }));
      setShowUpsell(biomarker.id);
    } else {
      setData((prev) => {
        const newData = { ...prev };
        delete newData[biomarker.id];
        return newData;
      });
    }
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
  const currentBiomarker = BIOMARKERS[step];
  const isComplete = step >= BIOMARKERS.length;

  if (isComplete) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Punteggio Salute</h3>
            <div className="text-5xl font-bold text-primary mb-2">{healthScore}/100</div>
            <p className="text-muted-foreground">Basato sui dati forniti.</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-semibold mb-2">Affidabilità Analisi</h3>
            <div className={`text-5xl font-bold mb-2 ${confidenceScore < 80 ? 'text-yellow-500' : 'text-green-500'}`}>
              {confidenceScore}%
            </div>
            <p className="text-muted-foreground mb-4">
              {confidenceScore < 100 
                ? "Dati incompleti. Il risultato potrebbe non riflettere la tua reale condizione." 
                : "Analisi completa e affidabile."}
            </p>
            {confidenceScore < 100 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Ti mancano dati cruciali per una valutazione precisa.
                      <Link href={`/servizi/protocolli/${recommendedProtocol.slug}`} className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                        Prenota un check-up completo con il 20% di sconto.
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Il tuo prossimo passo</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In base ai tuoi risultati (e ai dati mancanti), ti consigliamo di iniziare con:
          </p>
          
          <div className="py-4">
            <h3 className="text-3xl font-bold text-primary mb-2">{recommendedProtocol.title}</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">{recommendedProtocol.subtitle}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={`/servizi/protocolli/${recommendedProtocol.slug}`}>
                Scopri il Protocollo Consigliato
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl border shadow-sm">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Biomarcatore {step + 1} di {BIOMARKERS.length}</span>
          <span>{Math.round(((step) / BIOMARKERS.length) * 100)}% Completato</span>
        </div>
        <Progress value={((step) / BIOMARKERS.length) * 100} className="h-2" />
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{currentBiomarker.name}</h2>
          <p className="text-muted-foreground">{currentBiomarker.description}</p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor={currentBiomarker.id}>Valore ({currentBiomarker.unit})</Label>
            <Input
              id={currentBiomarker.id}
              type="number"
              placeholder={`Es. ${currentBiomarker.optimalRange.min}`}
              value={data[currentBiomarker.id] === null || data[currentBiomarker.id] === undefined ? '' : data[currentBiomarker.id] as number}
              onChange={(e) => handleBiomarkerChange(currentBiomarker.id, e.target.value)}
              disabled={data[currentBiomarker.id] === null}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Indietro
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleMissingData(currentBiomarker, true)}>
              Salta
            </Button>
            <Button onClick={() => setStep(step + 1)}>
              {step === BIOMARKERS.length - 1 ? "Vedi Risultati" : "Avanti"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!showUpsell} onOpenChange={() => setShowUpsell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dato mancante: {BIOMARKERS.find(b => b.id === showUpsell)?.name}</DialogTitle>
            <DialogDescription>
              {BIOMARKERS.find(b => b.id === showUpsell)?.upsellMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-md my-2">
            <p className="font-medium text-primary">Offerta Esclusiva:</p>
            <p className="text-sm">Misura questo valore nel nostro centro con uno sconto del 20% sul pacchetto {BIOMARKERS.find(b => b.id === showUpsell)?.protocolSlug}.</p>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => {
              setShowUpsell(null);
              setStep(step + 1);
            }}>
              Continua senza dato
            </Button>
            <Button asChild>
              <Link href={`/servizi/protocolli/${BIOMARKERS.find(b => b.id === showUpsell)?.protocolSlug}`}>
                Prenota Misurazione
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
