import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import Script from "next/script";
import Link from "next/link";
import { BookOpen, MessageSquare, FileText, Microscope } from "lucide-react";

export const metadata = buildMetadata({
  title: "Ricerca e Scienza della Longevità",
  description:
    "Studi, commenti di esperti ed evidenze scientifiche contestualizzate per prendere decisioni informate sulla tua salute.",
  path: "/ricerca",
});

const researchCategories = [
  {
    title: "Studi Recenti",
    description: "Analisi approfondite delle ultime pubblicazioni scientifiche su invecchiamento e salute.",
    href: "/ricerca/studi",
    icon: Microscope,
  },
  {
    title: "Sintesi delle Evidenze",
    description: "Cosa dice davvero la scienza su argomenti controversi. Meta-analisi e review sistematiche.",
    href: "/ricerca/evidenze",
    icon: FileText,
  },
  {
    title: "Commenti degli Esperti",
    description: "Interviste e opinioni di ricercatori e medici leader nel campo della longevità.",
    href: "/ricerca/esperti",
    icon: MessageSquare,
  },
  {
    title: "Glossario Scientifico",
    description: "Spiegazione chiara dei termini tecnici e dei meccanismi biologici fondamentali.",
    href: "/ricerca/glossario",
    icon: BookOpen,
  },
];

export default function RicercaPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Ricerca", path: "/ricerca" },
  ]);

  return (
    <div className="space-y-12 py-12">
      <Script
        id="ricerca-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          Ricerca e Scienza
        </h1>
        <p className="max-w-2xl text-xl text-zinc-600">
          Traduciamo la scienza complessa in informazioni azionabili.
          Ogni contenuto include metodologia, limiti e impatto pratico.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {researchCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
              <category.icon className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-zinc-800">
              {category.title}
            </h2>
            <p className="text-zinc-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
