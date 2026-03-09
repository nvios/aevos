import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { ArrowRight, Flame } from "lucide-react";
import { getArticlesByCategory, getAllArticles } from "@/lib/content/articles";
import { categories, getCategoryBySlug } from "@/lib/content/categories";
import { getArticleStatsMap } from "@/lib/content/recommendations";
import { localeHref } from "@/lib/i18n/paths";
import { ArticleSearch } from "@/components/article-search";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}): Promise<Metadata> {
  const { category, locale } = await params;
  const configIt = getCategoryBySlug(category, 'it');
  const configLocale = getCategoryBySlug(category, locale);
  if (!configIt || !configLocale) return {};

  return buildMetadata({
    title: configIt.heroTitle,
    titleEn: locale === 'en' ? configLocale.heroTitle : undefined,
    description: configIt.heroDescription,
    descriptionEn: locale === 'en' ? configLocale.heroDescription : undefined,
    path: `/articoli/${category}`,
    locale,
  });
}

export default async function GuideCategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await params;
  const lp = (path: string) => localeHref(path, locale);
  const config = getCategoryBySlug(category, locale);

  if (!config) {
    notFound();
  }

  const statsMap = await getArticleStatsMap(locale);
  const articles = getArticlesByCategory(category, locale).sort((a, b) => {
    const aViews = statsMap.get(a.slug)?.view_count ?? 0;
    const bViews = statsMap.get(b.slug)?.view_count ?? 0;
    return bViews - aViews;
  });
  
  const allArticles = getAllArticles(locale).map(article => {
    const { content, ...rest } = article;
    return rest;
  });

  // Calculate maxPopular based on article count
  const maxPopular = Math.max(1, Math.floor(articles.length * 0.3));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: locale === 'en' ? "Articles" : "Articoli", path: lp("/articoli") },
    { name: config.heroTitle, path: lp(`/articoli/${category}`) },
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

      <ArticleSearch articles={allArticles} locale={locale} placeholder={locale === 'en' ? `Search in ${config.title} or all articles...` : `Cerca in ${config.title} o tutti gli articoli...`}>
        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article, index) => {
              const views = statsMap.get(article.slug)?.view_count ?? 0;
              // Use index < maxPopular instead of topViewCount
              const isPopular = views > 0 && index < maxPopular;
              return (
                <Link
                  key={article.slug}
                  href={lp(`/articoli/${category}/${article.slug}`)}
                  className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
                >
                  <div className="space-y-3">
                    {isPopular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                        <Flame className="h-3 w-3" />
                        {locale === 'en' ? 'Most Read' : 'Più letto'}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-emerald-600">
                    {locale === 'en' ? 'Read article' : 'Leggi articolo'} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-12 text-center">
            <p className="text-zinc-500 italic">
              {locale === 'en'
                ? 'Articles for this category will be available soon.'
                : 'Articoli e approfondimenti per questa categoria saranno disponibili a breve.'}
            </p>
          </div>
        )}
      </ArticleSearch>
    </section>
  );
}
