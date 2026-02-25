import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/schema";
import Script from "next/script";
import Link from "next/link";
import { ChevronLeft, Clock, User, ExternalLink, ArrowRight } from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { FaqSubmission } from "@/components/faq-submission";

import type { Article } from "@/lib/content/articles";

type FaqItem = {
  question: string;
  answer: string;
};

type ArticleProps = {
  title: string;
  description: string;
  author: {
    name: string;
    role?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  faq?: FaqItem[];
  cta?: Array<{ text: string; link: string; description?: string }>;
  resources?: Array<{ name: string; link: string }>;
  relatedArticles?: Article[];
  children: React.ReactNode;
};

import { getCategoryBySlug } from "@/lib/content/categories";

export function ArticleLayout({
  title,
  description,
  author,
  category,
  faq,
  cta,
  resources,
  relatedArticles,
  children,
}: ArticleProps) {
  const faqSchema = faq ? faqJsonLd(faq) : null;

  return (
    <article className="mx-auto max-w-3xl py-8">
      {faqSchema && (
        <Script
          id="article-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb / Back Link */}
      <div className="mb-4">
        <Link
          href="/articoli"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Torna agli articoli
        </Link>
      </div>

      {/* Header */}
      <header className="mb-6 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
          {title}
        </h1>
        <p className="text-xl leading-relaxed text-zinc-600">{description}</p>

        <div className="flex items-center gap-3 border-t border-zinc-100 pt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
            <User className="h-5 w-5 text-zinc-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-800">{author.name}</p>
            {author.role && <p className="text-xs text-zinc-500">{author.role}</p>}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-zinc-200/50 backdrop-blur-sm sm:p-12">
        <div className="prose prose-lg prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-800 prose-p:my-6 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-zinc-500 prose-ol:list-decimal prose-ul:list-disc prose-ol:pl-6 prose-ul:pl-6 prose-li:pl-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_p]:mb-6">
          {children}
        </div>

        {/* CTAs */}
        {cta && cta.length > 0 && (
          <div className="mt-12 space-y-6 border-t border-zinc-100 pt-8">
            {cta.map((action, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-2xl bg-zinc-50 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                {action.description && (
                  <p className="text-lg font-medium text-zinc-800 sm:max-w-[60%]">
                    {action.description}
                  </p>
                )}
                <Link
                  href={action.link}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  {action.text}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      {faq && faq.length > 0 && (
        <section className="mt-16 border-t border-zinc-200 pt-10">
          <h2 className="mb-6 text-2xl font-bold text-zinc-800">
            Domande Frequenti
          </h2>
          <FaqAccordion items={faq.map(item => ({ question: item.question, answer: item.answer }))} />
          <FaqSubmission />
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mt-16 border-t border-zinc-200 pt-10">
          <h3 className="mb-6 text-2xl font-bold text-zinc-800">Articoli Correlati</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/articoli/${article.category}/${article.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                    {getCategoryBySlug(article.category)?.title || article.category}
                  </span>
                  <h4 className="text-lg font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                  Leggi <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      {resources && resources.length > 0 && (
        <section className="mt-16 border-t border-zinc-200 pt-10">
          <h3 className="mb-6 text-2xl font-bold text-zinc-800">Approfondimenti Esterni</h3>
          <ul className="space-y-3">
            {resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-zinc-600 hover:text-emerald-600 transition-colors"
                >
                  <ExternalLink className="mr-2 h-4 w-4 text-zinc-400 group-hover:text-emerald-500" />
                  <span className="underline decoration-zinc-300 underline-offset-4 group-hover:decoration-emerald-500">
                    {resource.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
