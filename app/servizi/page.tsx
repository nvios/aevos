import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { MapPin, Activity, Building2, Stethoscope } from "lucide-react";

export const metadata = buildMetadata({
  title: "Servizi e Partner per la Longevità",
  description:
    "Assessment personalizzati, partnership esclusive e servizi locali per ottimizzare la tua salute.",
  path: "/servizi",
});

const services = [
  {
    title: "Screening Digitale Avanzato",
    description: "Un'analisi preliminare del tuo profilo di invecchiamento basata su biomarcatori ematici e stile di vita. Il primo passo verso la consapevolezza.",
    href: "/servizi/assessment-online",
    icon: Activity,
  },
  {
    title: "Protocollo Clinico Aevos",
    description: "L'esperienza definitiva. Una giornata nel nostro centro per test funzionali, imaging avanzato e valutazione biologica completa.",
    href: "/servizi/assessment-clinico",
    icon: Stethoscope,
  },
];

export default function ServiziPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Assessment", path: "/servizi" },
  ]);

  return (
    <div className="space-y-12 py-12">
      <Script
        id="servizi-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          Il Gold Standard per la Longevità
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-zinc-600">
          Oltre i trend del momento. Un approccio clinico consolidato da decenni di ricerca ed esperienza sul campo, per offrirti la massima precisione diagnostica.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-lg flex flex-col items-center text-center"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
              <service.icon className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-zinc-800">
              {service.title}
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-6">{service.description}</p>
            <span className="mt-auto inline-flex items-center text-sm font-semibold text-zinc-900 group-hover:underline">
              Scopri di più
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-3xl space-y-8 border-t border-zinc-200 pt-12 text-center">
        <h2 className="text-3xl font-bold text-zinc-800">Perché scegliere il protocollo in sede?</h2>
        <p className="text-lg text-zinc-600 leading-relaxed">
          Mentre lo screening digitale offre un ottimo punto di partenza, la visita presso la nostra clinica permette misurazioni impossibili da remoto:
          analisi della composizione corporea avanzata, test VO2 max, valutazione della flessibilità metabolica e screening cognitivo approfondito.
        </p>
        <div className="pt-4">
          <Link
            href="/contatti"
            className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            Prenota una consulenza orientativa
          </Link>
        </div>
      </div>
    </div>
  );
}
