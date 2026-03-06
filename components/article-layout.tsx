import { faqJsonLd } from "@/lib/seo/schema";
import Script from "next/script";
import Link from "next/link";
import { ChevronLeft, User, ExternalLink, ArrowRight } from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { FaqSubmission } from "@/components/faq-submission";
import { ArticleViewTracker, TrackedCTALink, TrackedRecommendationLink } from "@/components/article-tracking";

import type { Article } from "@/lib/content/articles";
import { localePath } from "@/lib/i18n/paths";

type FaqItem = {
  question: string;
  answer: string;
};

type ArticleProps = {
  slug: string;
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
  locale: string;
  faq?: FaqItem[];
  cta?: Array<{ text: string; link: string; description?: string }>;
  resources?: Array<{ name: string; link: string }>;
  relatedArticles?: Article[];
  alsoReadArticles?: Article[];
  children: React.ReactNode;
};

import { getCategoryBySlug } from "@/lib/content/categories";

function RecommendationCard({
  article,
  locale,
  lp,
  source,
  position,
  currentPage,
}: {
  article: Article;
  locale: string;
  lp: (path: string) => string;
  source: "related" | "also_read" | "trending" | "popular";
  position: number;
  currentPage: string;
}) {
  return (
    <TrackedRecommendationLink
      href={lp(`/articoli/${article.category}/${article.slug}`)}
      articleSlug={article.slug}
      source={source}
      position={position}
      currentPage={currentPage}
      className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-lg"
    >
      <div className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
          {getCategoryBySlug(article.category, locale)?.title || article.category}
        </span>
        <h4 className="text-base font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h4>
        <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
          {article.description}
        </p>
      </div>
      <div className="mt-3 flex items-center text-sm font-medium text-emerald-600">
        {locale === 'en' ? 'Read' : 'Leggi'} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </TrackedRecommendationLink>
  );
}

export function ArticleLayout({
  slug,
  title,
  description,
  author,
  locale,
  faq,
  cta,
  resources,
  relatedArticles,
  alsoReadArticles,
  children,
}: ArticleProps) {
  const lp = (path: string) => localePath(path, locale);
  const faqSchema = faq ? faqJsonLd(faq) : null;
  const hasRelated = relatedArticles && relatedArticles.length > 0;
  const hasAlsoRead = alsoReadArticles && alsoReadArticles.length > 0;
  const hasSidebar = hasRelated || hasAlsoRead;
  const currentPage = `/articoli/${slug}`;

  return (
    <div className="mx-auto max-w-3xl py-8 xl:max-w-6xl">
      {faqSchema && (
        <Script
          id="article-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

        <ArticleViewTracker slug={slug} locale={locale} />

      <div className={hasSidebar ? "xl:flex xl:gap-10" : ""}>
        {/* Main article column */}
        <article className="min-w-0 xl:flex-1 xl:max-w-3xl">
          {/* Breadcrumb / Back Link */}
          <div className="mb-4">
            <Link
              href={lp("/articoli")}
              className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {locale === 'en' ? 'Back to articles' : 'Torna agli articoli'}
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
          <div className="relative z-10 -mx-4 px-3 md:mx-0 md:rounded-3xl md:bg-white/90 md:p-8 md:shadow-sm md:ring-1 md:ring-zinc-200/50 md:backdrop-blur-sm lg:p-12">
            <div className="prose prose-lg prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-800 prose-p:my-6 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-zinc-500 prose-ol:list-decimal prose-ul:list-disc prose-ol:pl-6 prose-ul:pl-6 prose-li:pl-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_p]:mb-6">
              {children}
            </div>

            {/* CTAs */}
            {cta && cta.length > 0 && (
              <div className="mt-12 space-y-6 border-t border-zinc-100 pt-8">
                {cta.map((action, index) => (
                  <TrackedCTALink
                    key={index}
                    slug={slug}
                    locale={locale}
                    href={action.link}
                    text={action.text}
                    description={action.description}
                  />
                ))}
              </div>
            )}
          </div>

          {/* FAQ Section */}
          {faq && faq.length > 0 && (
            <section className="mt-16 border-t border-zinc-200 pt-10">
              <h2 className="mb-6 text-2xl font-bold text-zinc-800">
                {locale === 'en' ? 'Frequently Asked Questions' : 'Domande Frequenti'}
              </h2>
              <FaqAccordion items={faq.map(item => ({ question: item.question, answer: item.answer }))} />
              <FaqSubmission />
            </section>
          )}

          {/* Recommendations — below article on smaller viewports */}
          {hasRelated && (
            <section className="mt-16 border-t border-zinc-200 pt-10 xl:hidden">
              <h3 className="mb-6 text-2xl font-bold text-zinc-800">{locale === 'en' ? 'Related Articles' : 'Articoli Correlati'}</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((article, i) => (
                  <RecommendationCard key={article.slug} article={article} locale={locale} lp={lp} source="related" position={i + 1} currentPage={currentPage} />
                ))}
              </div>
            </section>
          )}
          {hasAlsoRead && (
            <section className="mt-16 border-t border-zinc-200 pt-10 xl:hidden">
              <h3 className="mb-6 text-2xl font-bold text-zinc-800">{locale === 'en' ? 'Readers Also Read' : 'Chi ha letto questo ha letto anche'}</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {alsoReadArticles.map((article, i) => (
                  <RecommendationCard key={article.slug} article={article} locale={locale} lp={lp} source="also_read" position={i + 1} currentPage={currentPage} />
                ))}
              </div>
            </section>
          )}

          {/* Resources */}
          {resources && resources.length > 0 && (
            <section className="mt-16 border-t border-zinc-200 pt-10">
              <h3 className="mb-6 text-2xl font-bold text-zinc-800">{locale === 'en' ? 'External Resources' : 'Approfondimenti Esterni'}</h3>
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

        {/* Sidebar — recommendations on wide viewports */}
        {hasSidebar && (
          <aside className="hidden xl:block xl:w-72 xl:shrink-0">
            <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {hasRelated && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {locale === 'en' ? 'Related Articles' : 'Articoli Correlati'}
                  </h3>
                  {relatedArticles.map((article, i) => (
                    <RecommendationCard key={article.slug} article={article} locale={locale} lp={lp} source="related" position={i + 1} currentPage={currentPage} />
                  ))}
                </>
              )}
              {hasAlsoRead && (
                <>
                  <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    {locale === 'en' ? 'Readers Also Read' : 'Letti anche'}
                  </h3>
                  {alsoReadArticles.map((article, i) => (
                    <RecommendationCard key={article.slug} article={article} locale={locale} lp={lp} source="also_read" position={i + 1} currentPage={currentPage} />
                  ))}
                </>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
