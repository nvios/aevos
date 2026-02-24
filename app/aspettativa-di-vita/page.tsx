import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Aspettativa di vita: fattori e miglioramenti concreti",
  description:
    "Capire i principali driver di aspettativa di vita e trasformarli in azioni pratiche e monitorabili.",
  path: "/aspettativa-di-vita",
});

export default function AspettativaDiVitaPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Aspettativa di vita", path: "/aspettativa-di-vita" },
  ]);
  const faq = faqJsonLd([
    {
      question: "Da cosa dipende l aspettativa di vita individuale?",
      answer:
        "Dipende da genetica, ambiente, abitudini quotidiane e gestione dei fattori di rischio modificabili.",
    },
    {
      question: "Si puo aumentare l aspettativa di vita?",
      answer:
        "Si puo migliorare la traiettoria di salute intervenendo su sonno, allenamento, alimentazione, prevenzione e aderenza.",
    },
  ]);

  return (
    <section className="space-y-5">
      <Script
        id="aspettativa-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="aspettativa-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <h1 className="text-3xl font-semibold">
        Aspettativa di vita: guida orientata all&apos;azione
      </h1>
      <p className="max-w-3xl text-zinc-700">
        Le variabili che influenzano longevita non sono solo genetiche:
        abitudini quotidiane, composizione corporea, sonno e aderenza nel tempo
        hanno un impatto misurabile.
      </p>
      <div className="rounded-xl border border-zinc-200 p-4">
        <h2 className="mb-2 text-lg font-semibold">Trasforma teoria in piano</h2>
        <p className="mb-3 text-sm text-zinc-700">
          Avvia il calcolo longevita per ricevere indicazioni immediate e
          confronti avanzati dopo iscrizione.
        </p>
        <Link
          href="/calcolo-longevita"
          className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Calcola ora
        </Link>
      </div>
    </section>
  );
}
