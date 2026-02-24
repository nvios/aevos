import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { Moon, Dumbbell, Utensils, Sparkles, Scissors } from "lucide-react";

export const metadata = buildMetadata({
  title: "Guide salute e longevità",
  description:
    "Guide pratiche su sonno, esercizio, nutrizione, skin care e hair per migliorare energia, prevenzione e qualità della vita.",
  path: "/guide",
});

const categories = [
  {
    slug: "sonno",
    title: "Sonno",
    text: "Il sonno è il predittore più potente della longevità, eppure l'83% degli adulti non raggiunge la quota ottimale di sonno.",
    icon: Moon,
  },
  {
    slug: "esercizio",
    title: "Esercizio",
    text: "Il VO2 max è correlato a una riduzione del 50% della mortalità. Costruisci un motore metabolico resiliente.",
    icon: Dumbbell,
  },
  {
    slug: "nutrizione",
    title: "Nutrizione",
    text: "La restrizione calorica moderata e il timing dei pasti possono estendere la durata della vita sana fino al 15%.",
    icon: Utensils,
  },
  {
    slug: "skin-care",
    title: "Skin Care",
    text: "La pelle è la prima barriera immunitaria. Il 90% dell'invecchiamento visibile è causato dal foto-danneggiamento prevenibile.",
    icon: Sparkles,
  },
  {
    slug: "capelli",
    title: "Capelli",
    text: "La salute del follicolo riflette lo stato infiammatorio sistemico. Intervieni sui marker biologici prima che la caduta diventi visibile.",
    icon: Scissors,
  },
];

export default function GuidePage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guide", path: "/guide" },
  ]);

  return (
    <section className="space-y-8 py-8">
      <Script
        id="guide-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Guide alla Longevità</h1>
        <p className="max-w-3xl text-lg text-zinc-600">
          Risorse pratiche e approfondite per prendere il controllo della tua salute.
          Ogni guida è progettata per offrirti azioni concrete basate sulle ultime evidenze scientifiche.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.slug}
              href={`/guide/${item.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">{item.title}</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{item.text}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
