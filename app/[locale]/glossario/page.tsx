import React from "react";
import { getAllGlossaryTerms } from "@/lib/content/glossary";
import { getArticleBySlug } from "@/lib/content/articles";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Glossario della Salute e Longevità | Aevos",
  description: "Definizioni chiare e semplici dei termini scientifici legati a salute, longevità, nutrizione e biohacking. Scopri il significato di ApoB, HRV, Autofagia e molto altro.",
  alternates: {
    canonical: "/glossario",
  },
  openGraph: {
    title: "Glossario della Salute e Longevità | Aevos",
    description: "Definizioni chiare e semplici dei termini scientifici legati a salute, longevità, nutrizione e biohacking.",
    type: "website",
    url: "/glossario",
  },
};

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms();

  // Enrich terms with article data
  const enrichedTerms = terms.map((term) => {
    const relatedArticles = term.relatedArticles
      ?.map((slug) => {
        const article = getArticleBySlug(slug);
        if (article) {
          return {
            title: article.title,
            href: `/articoli/${article.category}/${article.slug}`,
          };
        }
        return null;
      })
      .filter((item): item is { title: string; href: string } => item !== null) || [];

    return { ...term, relatedArticles };
  });

  // Group terms by first letter
  const groupedTerms = enrichedTerms.reduce((acc, term) => {
    const letter = term.term.charAt(0).toUpperCase();
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(term);
    return acc;
  }, {} as Record<string, typeof enrichedTerms>);

  const letters = Object.keys(groupedTerms).sort();

  // Create JSON-LD for DefinedTermSet
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Glossario Aevos Health",
    "description": "Definizioni di termini relativi a salute, longevità e biohacking.",
    "hasDefinedTerm": terms.map(term => ({
      "@type": "DefinedTerm",
      "name": term.term,
      "description": term.definition,
      "url": `https://aevos.health/glossario#${term.slug}`
    }))
  };

  return (
    <>
      <Script
        id="glossary-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl mb-4">
            Glossario della Salute
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Una guida completa ai termini scientifici che incontri nei nostri articoli.
            Dalla A alla Z, tutto quello che devi sapere per comprendere meglio il tuo corpo,
            la nutrizione e le strategie per la longevità.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12 sticky top-4 z-10 bg-zinc-50/90 backdrop-blur-sm py-4 rounded-xl border border-zinc-200/50 shadow-sm">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-medium text-sm"
            >
              {letter}
            </a>
          ))}
        </div>

        <div className="space-y-12">
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-32">
              <h2 className="text-3xl font-bold text-zinc-900 mb-6 pb-2 border-b border-zinc-200 flex items-center">
                <span className="bg-emerald-100 text-emerald-800 w-10 h-10 flex items-center justify-center rounded-lg mr-3 text-xl">
                  {letter}
                </span>
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {groupedTerms[letter].map((term) => (
                  <div
                    key={term.slug}
                    id={term.slug}
                    className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-200 group scroll-mt-32 flex flex-col"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {term.term}
                      </h3>
                      <p className="text-zinc-600 leading-relaxed text-sm">
                        {term.definition}
                      </p>
                    </div>

                    {term.relatedArticles.length > 0 && (
                      <div className="mt-auto pt-4 border-t border-zinc-100">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                          Approfondisci in:
                        </span>
                        <ul className="space-y-2">
                          {term.relatedArticles.map((article, idx) => (
                            <li key={idx}>
                              <Link
                                href={article.href}
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-start gap-1 leading-snug"
                              >
                                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{article.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
