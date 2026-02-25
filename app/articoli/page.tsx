import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { Moon, Dumbbell, Utensils, Sparkles, Scissors, Activity, HeartPulse, Brain, Zap } from "lucide-react";
import { categories } from "@/lib/content/categories";
import { getArticlesByCategory } from "@/lib/content/articles";

export const metadata = buildMetadata({
  title: "Articoli salute e longevità",
  description:
    "Articoli pratici su sonno, esercizio, nutrizione, skin care e hair per migliorare energia, prevenzione e qualità della vita.",
  path: "/articoli",
});

const iconMap: Record<string, any> = {
  Moon,
  Dumbbell,
  Utensils,
  Sparkles,
  Scissors,
  Activity,
  HeartPulse,
  Brain,
  Zap,
};

export default function GuidePage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Articoli", path: "/articoli" },
  ]);

  // Filter categories that have at least one article
  const activeCategories = categories.filter(category => {
    const articles = getArticlesByCategory(category.slug);
    return articles.length > 0;
  });

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
        {activeCategories.map((item) => {
          const Icon = iconMap[item.iconName] || Activity;
          return (
            <Link
              key={item.slug}
              href={`/articoli/${item.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">{item.title}</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
