import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";
import { LongevityCalculator } from "./calculator";

export const metadata = buildMetadata({
  title: "Calcolo longevita",
  description:
    "Calcola un profilo iniziale di longevita con insight gratuiti e benchmark avanzati dopo signup.",
  path: "/calcolo-longevita",
});

export default function CalcoloLongevitaPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Calcolo longevita", path: "/calcolo-longevita" },
  ]);
  const faq = faqJsonLd([
    {
      question: "Il risultato e una diagnosi medica?",
      answer:
        "No, e una stima orientativa per supportare priorita pratiche e monitoraggio nel tempo.",
    },
    {
      question: "Come vengono usati i miei dati?",
      answer:
        "Nella versione corrente servono per generare insight iniziali e benchmark; l accesso avanzato richiede account.",
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
      <h1 className="text-3xl font-semibold">Calcolo longevita</h1>
      <p className="max-w-3xl text-zinc-700">
        Versione iniziale del motore di valutazione. Oggi parte da dati base,
        domani estendibile a wearable, biomarker e trend longitudinali.
      </p>
      <LongevityCalculator />
    </section>
  );
}
