import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { ArrowRight } from "lucide-react";
import { getArticlesByCategory } from "@/lib/content/articles";
import { categories, getCategoryBySlug } from "@/lib/content/categories";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const config = getCategoryBySlug(category);
  if (!config) {
    return {};
  }

  return buildMetadata({
    title: config.heroTitle,
    description: config.heroDescription,
    path: `/articoli/${category}`,
  });
}

export default async function GuideCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const config = getCategoryBySlug(category);

  if (!config) {
    notFound();
  }

  const articles = getArticlesByCategory(category);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Articoli", path: "/articoli" },
    { name: config.heroTitle, path: `/articoli/${category}` },
  ]);

  return (
    <section className="space-y-12 py-8">
      <Script
        id="category-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800">
          {config.heroTitle}
        </h1>
        <p className="max-w-3xl text-lg text-zinc-600 leading-relaxed">
          {config.heroDescription}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articoli/${category}/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
            >
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {article.description}
                </p>
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-emerald-600">
                Leggi articolo <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-12 text-center">
          <p className="text-zinc-500 italic">
            Articoli e approfondimenti per questa categoria saranno disponibili a breve.
          </p>
        </div>
      )}
    </section>
  );
}
