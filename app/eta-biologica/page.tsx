import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Eta biologica: cos'e e come migliorarla",
  description:
    "Guida pratica sull'eta biologica con azioni concrete e accesso al calcolo longevita interattivo.",
  path: "/eta-biologica",
});

export default function EtaBiologicaPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Eta biologica", path: "/eta-biologica" },
  ]);
  const faq = faqJsonLd([
    {
      question: "Cos e l eta biologica?",
      answer:
        "E una stima dello stato funzionale del corpo rispetto all eta anagrafica.",
    },
    {
      question: "Come posso migliorarla?",
      answer:
        "Con interventi coerenti su sonno, composizione corporea, attivita fisica, alimentazione e monitoraggio nel tempo.",
    },
  ]);

  return (
    <section className="space-y-5">
      <Script
        id="eta-biologica-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="eta-biologica-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <h1 className="text-3xl font-semibold">Età biologica: guida pratica</h1>
      <p className="max-w-3xl text-zinc-700">
        L&apos;età biologica descrive quanto bene stanno funzionando i tuoi
        sistemi rispetto alla media. Non e solo un numero: e una leva utile per
        orientare sonno, nutrizione, allenamento e prevenzione.
      </p>
      <div className="rounded-xl border border-zinc-200 p-4">
        <h2 className="mb-2 text-lg font-semibold">Inizia dal tuo profilo base</h2>
        <p className="mb-3 text-sm text-zinc-700">
          Usa il calcolo longevita per ottenere subito insight iniziali e sbloccare
          benchmark avanzati dopo registrazione.
        </p>
        <Link
          href="/calcolo-longevita"
          className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Vai al calcolo longevita
        </Link>
      </div>
    </section>
  );
}
