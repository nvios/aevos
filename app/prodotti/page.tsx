import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import Script from "next/script";
import Link from "next/link";
import { Pill, Sparkles, Watch, Activity } from "lucide-react";

export const metadata = buildMetadata({
  title: "Prodotti e Strumenti per la Longevità",
  description:
    "Recensioni oneste e basate sui dati di supplementi, cosmetici, wearable e strumenti per ottimizzare la tua salute.",
  path: "/prodotti",
});

const productCategories = [
  {
    title: "Supplementi",
    description: "Analisi di integratori e nutraceutici con comprovata efficacia scientifica.",
    href: "/prodotti/supplementi",
    icon: Pill,
  },
  {
    title: "Skin Care & Cosmetica",
    description: "Prodotti funzionali per la salute della pelle e l'anti-aging.",
    href: "/prodotti/cosmetica",
    icon: Sparkles,
  },
  {
    title: "Wearable",
    description: "Recensioni di smartwatch e tracker per monitorare sonno e attività.",
    href: "/prodotti/wearable",
    icon: Watch,
  },
  {
    title: "Strumenti di Misurazione",
    description: "Dispositivi per monitorare biomarker e metriche di salute a casa.",
    href: "/prodotti/strumenti",
    icon: Activity,
  },
];

export default function ProdottiPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Prodotti", path: "/prodotti" },
  ]);

  return (
    <div className="space-y-12 py-12">
      <Script
        id="prodotti-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          Prodotti e Strumenti
        </h1>
        <p className="max-w-2xl text-xl text-zinc-600">
          Selezioniamo e analizziamo i migliori strumenti per la tua longevità.
          Nessun hype, solo utilità reale basata sui dati.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {productCategories.map((category) => (
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
