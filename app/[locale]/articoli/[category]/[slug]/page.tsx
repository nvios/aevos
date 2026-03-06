import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { getArticleBySlug, getAllArticles, getRelatedArticles } from "@/lib/content/articles";
import { getAlsoReadArticles, getArticleStatsMap } from "@/lib/content/recommendations";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { Metadata } from "next";
import { localePath } from "@/lib/i18n/paths";

import { getCategoryBySlug } from "@/lib/content/categories";

export async function generateStaticParams() {
  const articles = getAllArticles();
  const params = [];
  for (const article of articles) {
    for (const category of article.categories) {
      params.push({ category, slug: article.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string; locale: string }>;
}): Promise<Metadata> {
  const { category, slug, locale } = await params;
  const articleIt = getArticleBySlug(slug, 'it');
  const articleLocale = getArticleBySlug(slug, locale);
  if (!articleIt) return {};

  return buildMetadata({
    title: articleIt.title,
    titleEn: locale === 'en' && articleLocale ? articleLocale.title : undefined,
    description: articleIt.description,
    descriptionEn: locale === 'en' && articleLocale ? articleLocale.description : undefined,
    path: `/articoli/${category}/${slug}`,
    locale,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string; locale: string }>;
}) {
  const { category, slug, locale } = await params;
  const lp = (path: string) => localePath(path, locale);
  const article = getArticleBySlug(slug, locale);
  const categoryConfig = getCategoryBySlug(category, locale);
  const categoryTitle = categoryConfig?.title || category;

  if (!article || !article.categories.includes(category)) {
    notFound();
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: locale === 'en' ? "Articles" : "Articoli", path: lp("/articoli") },
    { name: categoryTitle, path: lp(`/articoli/${category}`) },
    { name: article.title, path: lp(`/articoli/${category}/${slug}`) },
  ]);

  const [statsMap, alsoReadArticles] = await Promise.all([
    getArticleStatsMap(locale),
    getAlsoReadArticles(slug, 3, locale),
  ]);

  const relatedArticles = getRelatedArticles(slug, category, article.tags, 3, locale, statsMap);

  return (
    <>
      <Script
        id="article-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ArticleLayout
        slug={slug}
        title={article.title}
        description={article.description}
        author={{ name: article.author, role: article.authorRole }}
        category={{ name: categoryTitle, slug: category }}
        locale={locale}
        faq={article.faq}
        cta={article.cta}
        resources={article.resources}
        relatedArticles={relatedArticles}
        alsoReadArticles={alsoReadArticles}
      >
        <MarkdownRenderer content={article.content} locale={locale} />
      </ArticleLayout>
    </>
  );
}
