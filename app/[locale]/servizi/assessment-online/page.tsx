import { Metadata } from "next";
import { ScreeningWizard } from "@/components/screening/screening-wizard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? "Advanced Digital Screening | Aevos Health" : "Screening Digitale Avanzato | Aevos Health",
    description: isEn
      ? "In-depth analysis of your biomarkers and lifestyle to calculate your biological age and optimize your health."
      : "Analisi approfondita dei tuoi biomarcatori e stile di vita per calcolare la tua età biologica e ottimizzare la tua salute.",
  } satisfies Metadata;
}

export default async function AssessmentOnlinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          {isEn ? 'Advanced Digital Screening' : 'Screening Digitale Avanzato'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {isEn
            ? 'Discover your true biological age and receive a personalized plan based on your real clinical data.'
            : 'Scopri la tua vera età biologica e ricevi un piano personalizzato basato sui tuoi dati clinici reali.'}
        </p>
      </div>

      <ScreeningWizard />
    </div>
  );
}
