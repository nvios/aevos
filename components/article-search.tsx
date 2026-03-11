"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Flame } from "lucide-react";
import { localeHref } from "@/lib/i18n/paths";
import type { Article } from "@/lib/content/articles";
import { getCategoryBySlug } from "@/lib/content/categories";

type ArticleSearchProps = {
  articles: Omit<Article, "content">[];
  locale: string;
  children: React.ReactNode;
  placeholder?: string;
};

export function ArticleSearch({ articles, locale, children, placeholder }: ArticleSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const lp = (path: string) => localeHref(path, locale);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    return articles.filter((article) => {
      const titleMatch = article.title.toLowerCase().includes(query);
      const descMatch = article.description.toLowerCase().includes(query);
      // Also search in tags if available
      const tagsMatch = article.tags?.some(tag => tag.toLowerCase().includes(query));
      
      return titleMatch || descMatch || tagsMatch;
    });
  }, [articles, searchQuery]);

  // Analytics for search could be added here similar to RecipeList

  const hasResults = filteredArticles.length > 0;
  const isSearching = searchQuery.length > 0;

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full rounded-xl border-0 py-3 pl-11 pr-10 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 focus:outline-none sm:text-sm sm:leading-6 bg-white"
          placeholder={placeholder || (locale === 'en' ? "Search articles..." : "Cerca articoli...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Content */}
      {!isSearching ? (
        children
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-zinc-500 text-center">
            {locale === 'en'
              ? `Found ${filteredArticles.length} ${filteredArticles.length === 1 ? "result" : "results"}`
              : `Trovati ${filteredArticles.length} ${filteredArticles.length === 1 ? "risultato" : "risultati"}`}
          </div>

          {hasResults ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => {
                const categoryConfig = getCategoryBySlug(article.category, locale);
                const categoryTitle = categoryConfig?.title || article.category;
                
                return (
                  <Link
                    key={article.slug}
                    href={lp(`/articoli/${article.category}/${article.slug}`)}
                    className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
                  >
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800">
                        {categoryTitle}
                      </span>
                      <h2 className="text-xl font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
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
            <div className="text-center py-12">
              <p className="text-zinc-500">
                {locale === 'en' ? 'No articles found matching your search.' : 'Nessun articolo trovato corrispondente alla tua ricerca.'}
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                {locale === 'en' ? 'Clear search' : 'Cancella ricerca'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
