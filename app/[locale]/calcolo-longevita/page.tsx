import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";
import { LongevityCalculator } from "./calculator";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: "Calcolo longevità",
    titleEn: "Longevity calculator",
    description: "Calcola un profilo iniziale di longevità con insight gratuiti e benchmark avanzati dopo signup.",
    descriptionEn: "Calculate an initial longevity profile with free insights and advanced benchmarks after signup.",
    path: "/calcolo-longevita",
    locale,
  });
}

export default async function CalcoloLongevitaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: isEn ? "Longevity Calculator" : "Calcolo longevità", path: isEn ? "/longevity-calculator" : "/calcolo-longevita" },
  ]);
  const faq = faqJsonLd([
    {
      question: isEn ? "Is the result a medical diagnosis?" : "Il risultato è una diagnosi medica?",
      answer: isEn
        ? "No, it is an indicative estimate to support practical priorities and monitoring over time."
        : "No, è una stima orientativa per supportare priorità pratiche e monitoraggio nel tempo.",
    },
    {
      question: isEn ? "How is my data used?" : "Come vengono usati i miei dati?",
      answer: isEn
        ? "In the current version they are used to generate initial insights and benchmarks; advanced access requires an account."
        : "Nella versione corrente servono per generare insight iniziali e benchmark; l'accesso avanzato richiede account.",
    },
  ]);

  return (
    <section className="space-y-5">
      <Script
        id="calcolo-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="calcolo-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <h1 className="text-3xl font-semibold">
        {isEn ? 'Longevity Calculator' : 'Calcolo longevità'}
      </h1>
      <p className="max-w-3xl text-zinc-700">
        {isEn
          ? 'This is the initial version of our evaluation engine. The report will be extendable with wearable data, biomarkers and longitudinal trends as part of our advanced screening.'
          : "Questa è la versione iniziale del nostro motore di valutazione. Il report sarà estendibile a wearable, biomarker e trend longitudinali parte del nostro screening avanzato."}
      </p>
      <LongevityCalculator />
    </section>
  );
}
