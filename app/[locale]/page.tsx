import Link from "next/link";
import Script from "next/script";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { NewsletterForm } from "@/components/newsletter-form";
import { TrackedRecommendationLink } from "@/components/article-tracking";
import { getTrendingArticles } from "@/lib/content/recommendations";
import { getCategoryBySlug } from "@/lib/content/categories";
import { ArrowRight, Activity, TrendingUp, Stethoscope, Flame } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { localeHref } from "@/lib/i18n/paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: "Longevità, prevenzione e performance quotidiana",
    titleEn: "Longevity, prevention and daily performance",
    description: "Aevos Health aiuta adulti ambiziosi a migliorare sonno, nutrizione, allenamento e monitoraggio con un approccio pragmatico.",
    descriptionEn: "Aevos Health helps ambitious adults improve sleep, nutrition, training and monitoring with a pragmatic approach.",
    path: "/",
    locale,
  });
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain}/ricerca?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');
  const lp = (path: string) => localeHref(path, locale);
  const trendingArticles = await getTrendingArticles(6, locale);

  const features = [
    {
      title: locale === 'en' ? "Evidence-Based Guides" : "Guide Evidence-Based",
      text: locale === 'en'
        ? "In-depth analysis on sleep, nutrition, and exercise, based exclusively on clinical studies and meta-analyses."
        : "Analisi approfondite su sonno, nutrizione ed esercizio, basate esclusivamente su studi clinici e meta-analisi.",
      href: lp("/articoli"),
      icon: Activity,
    },
    {
      title: locale === 'en' ? "Health & Longevity Monitoring" : "Monitoraggio Salute e Longevità",
      text: locale === 'en'
        ? "Interactive dashboard to track your progress and results."
        : "Dashboard interattiva per tracciare progressi e risultati.",
      href: lp("/calcolo-longevita"),
      icon: TrendingUp,
    },
    {
      title: locale === 'en' ? "Clinical Assessment" : "Assessment Clinico",
      text: locale === 'en'
        ? "The Italian gold standard for longevity diagnostics. Protocols validated by decades of research and clinical experience."
        : "Il gold standard italiano per la diagnostica della longevità. Protocolli validati da decenni di ricerca ed esperienza clinica.",
      href: lp("/servizi"),
      icon: Stethoscope,
    },
  ];

  return (
    <div className="space-y-24 pb-12">
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-24 text-center shadow-2xl sm:px-12 sm:py-32">
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur-sm">
            <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500"></span>
            {t('title')}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t('subtitle')} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {t('subtitle_highlight')}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={lp("/calcolo-longevita")}
              className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-semibold text-zinc-900 transition-all hover:bg-zinc-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {t('cta_calculate')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={lp("/articoli")}
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-600 bg-transparent px-8 text-base font-medium text-white transition-colors hover:bg-zinc-800"
            >
              {t('cta_explore')}
            </Link>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-600 sm:text-4xl">
            {locale === 'en' ? 'Everything you need to live better, longer.' : 'Tutto ciò che serve per vivere meglio, più a lungo.'}
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            {locale === 'en' ? 'Curated resources to optimize every aspect of your health.' : 'Risorse curate per ottimizzare ogni aspetto della tua salute.'}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 [&>*:last-child:nth-child(odd)]:md:col-span-2 [&>*:last-child:nth-child(odd)]:md:w-1/2 [&>*:last-child:nth-child(odd)]:md:mx-auto">
          {features.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-zinc-800">{card.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{card.text}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Articles Section */}
      {trendingArticles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                {locale === 'en' ? 'Trending Now' : 'In Tendenza'}
              </h2>
              <p className="text-sm text-zinc-500">
                {locale === 'en' ? 'Most read this week' : 'I più letti questa settimana'}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingArticles.map((article, i) => (
              <TrackedRecommendationLink
                key={article.slug}
                href={lp(`/articoli/${article.category}/${article.slug}`)}
                articleSlug={article.slug}
                source="trending"
                position={i + 1}
                currentPage="/"
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                      {getCategoryBySlug(article.category, locale)?.title ?? article.category}
                    </span>
                    {i < 3 && (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                        #{i + 1}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                  {locale === 'en' ? 'Read' : 'Leggi'} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </TrackedRecommendationLink>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-100 p-8 text-center sm:p-16">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-800">
              {locale === 'en' ? 'Science, not hype.' : 'Scienza, non hype.'}
            </h2>
            <p className="mx-auto max-w-xl text-lg text-zinc-600">
              {locale === 'en'
                ? 'Join over 2,000 subscribers who receive practical tips on longevity and performance every week, directly in their inbox.'
                : 'Unisciti a oltre 2.000 iscritti che ricevono ogni settimana consigli pratici su longevità e performance, direttamente nella loro inbox.'}
            </p>

            <NewsletterForm />
            <p className="text-xs text-zinc-500">
              {locale === 'en' ? 'No spam. Unsubscribe anytime.' : 'Nessuno spam. Cancellati in qualsiasi momento.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
