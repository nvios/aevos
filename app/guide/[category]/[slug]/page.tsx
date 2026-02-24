import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/content/articles";
import { buildMetadata } from "@/lib/seo/metadata";
import { marked } from "marked";

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const articles = getArticlesByCategory(category);
  return articles.map((article) => ({
    slug: article.slug,
  }));
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
    path: `/guide/${category}/${slug}`,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.category !== category) {
    notFound();
  }

  const htmlContent = await marked(article.content, { breaks: true, gfm: true });

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guide", path: "/guide" },
    { name: article.category, path: `/guide/${category}` },
    { name: article.title, path: `/guide/${category}/${slug}` },
  ]);

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
        category={{ name: article.category, slug: category }}
        faq={article.faq}
        cta={article.cta}
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </ArticleLayout>
    </>
  );
}
