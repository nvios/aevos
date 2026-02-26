import { Metadata } from "next";
import { ScreeningWizard } from "@/components/screening/screening-wizard";

export const metadata: Metadata = {
  title: "Screening Digitale Avanzato | Aevos Health",
  description: "Analisi approfondita dei tuoi biomarcatori e stile di vita per calcolare la tua età biologica e ottimizzare la tua salute.",
};

export default function AssessmentOnlinePage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Screening Digitale Avanzato
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Scopri la tua vera età biologica e ricevi un piano personalizzato basato sui tuoi dati clinici reali.
        </p>
      </div>
      
      <ScreeningWizard />
    </div>
  );
}
