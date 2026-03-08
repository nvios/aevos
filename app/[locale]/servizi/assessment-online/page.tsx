import { Metadata } from "next";
import { AssessmentWizard } from "@/components/screening/assessment-wizard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? "Lifestyle Assessment | Aevos Health" : "Assessment Lifestyle | Aevos Health",
    description: isEn
      ? "Answer a few simple questions and get a personalised longevity report with science-backed actions to maximise your healthspan."
      : "Rispondi a poche semplici domande e ricevi un report di longevità personalizzato con azioni basate sulla scienza per massimizzare il tuo healthspan.",
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
    <div className="container max-w-6xl py-12">
      <AssessmentWizard locale={locale} />
    </div>
  );
}
