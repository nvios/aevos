import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";
import { localeHref } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: "Età biologica: cos'è e come migliorarla",
    titleEn: "Biological age: what it is and how to improve it",
    description: "Guida pratica sull'età biologica con azioni concrete e accesso al calcolo longevità interattivo.",
    descriptionEn: "Practical guide on biological age with actionable steps and access to the interactive longevity calculator.",
    path: "/eta-biologica",
    locale,
  });
}

export default async function EtaBiologicaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const lp = (path: string) => localeHref(path, locale);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: isEn ? "Biological age" : "Età biologica", path: lp("/eta-biologica") },
  ]);
  const faq = faqJsonLd([
    {
      question: isEn ? "What is biological age?" : "Cos'è l'età biologica?",
      answer: isEn
        ? "It is an estimate of the body's functional state compared to chronological age."
        : "È una stima dello stato funzionale del corpo rispetto all'età anagrafica.",
    },
    {
      question: isEn ? "How can I improve it?" : "Come posso migliorarla?",
      answer: isEn
        ? "With consistent interventions on sleep, body composition, physical activity, nutrition and monitoring over time."
        : "Con interventi coerenti su sonno, composizione corporea, attività fisica, alimentazione e monitoraggio nel tempo.",
    },
  ]);

  return (
    <section className="space-y-5">
      <Script id="eta-biologica-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Script id="eta-biologica-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <h1 className="text-3xl font-semibold">
        {isEn ? 'Biological age: a practical guide' : 'Età biologica: guida pratica'}
      </h1>
      <p className="max-w-3xl text-zinc-700">
        {isEn
          ? "Biological age describes how well your systems are functioning compared to average. It's not just a number: it's a useful lever for guiding sleep, nutrition, training and prevention."
          : "L'età biologica descrive quanto bene stanno funzionando i tuoi sistemi rispetto alla media. Non è solo un numero: è una leva utile per orientare sonno, nutrizione, allenamento e prevenzione."}
      </p>
      <div className="rounded-xl border border-zinc-200 p-4">
        <h2 className="mb-2 text-lg font-semibold">
          {isEn ? 'Start from your base profile' : 'Inizia dal tuo profilo base'}
        </h2>
        <p className="mb-3 text-sm text-zinc-700">
          {isEn
            ? 'Use the longevity calculator to get immediate initial insights and unlock advanced benchmarks after registration.'
            : 'Usa il calcolo longevità per ottenere subito insight iniziali e sbloccare benchmark avanzati dopo registrazione.'}
        </p>
        <Link href={lp("/calcolo-longevita")} className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          {isEn ? 'Go to longevity calculator' : 'Vai al calcolo longevità'}
        </Link>
      </div>
    </section>
  );
}
