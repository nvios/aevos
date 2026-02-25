import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { getArticleBySlug, getArticlesByCategory, getAllArticles, getRelatedArticles, type Article } from "@/lib/content/articles";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { MarkdownRenderer } from "@/components/markdown-renderer";

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
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {};
  }

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/articoli/${category}/${slug}`,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = getArticleBySlug(slug);
  const categoryConfig = getCategoryBySlug(category);
  const categoryTitle = categoryConfig?.title || category;

  if (!article || !article.categories.includes(category)) {
    notFound();
  }


  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Articoli", path: "/articoli" },
    { name: categoryTitle, path: `/articoli/${category}` },
    { name: article.title, path: `/articoli/${category}/${slug}` },
  ]);

  const relatedArticles = getRelatedArticles(slug, category, article.tags);

  return (
    <>
      <Script
        id="article-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ArticleLayout
        title={article.title}
        description={article.description}
        author={{ name: article.author, role: article.authorRole }}
        category={{ name: categoryTitle, slug: category }}
        faq={article.faq}
        cta={article.cta}
        resources={article.resources}
        relatedArticles={relatedArticles}
      >
        <MarkdownRenderer content={article.content} />
      </ArticleLayout>
    </>
  );
}
