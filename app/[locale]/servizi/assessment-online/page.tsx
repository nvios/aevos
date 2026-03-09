import { AssessmentWizard } from "@/components/screening/assessment-wizard";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: "Assessment Lifestyle",
    titleEn: "Lifestyle Assessment",
    description: "Rispondi a poche semplici domande e ricevi un report di longevità personalizzato con azioni basate sulla scienza per massimizzare il tuo healthspan.",
    descriptionEn: "Answer a few simple questions and get a personalised longevity report with science-backed actions to maximise your healthspan.",
    path: "/servizi/assessment-online",
    locale,
  });
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
