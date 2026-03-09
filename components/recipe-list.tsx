"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Flame, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { useLocale } from "next-intl";
import { localeHref } from "@/lib/i18n/paths";
import type { Recipe } from "@/lib/content/recipes";
import { analytics } from "@/lib/analytics/events";

type RecipeListProps = {
  initialRecipes: Recipe[];
};

const PRIORITY_FILTERS = {
  en: [
    "Longevity",
    "Brain & Focus",
    "Muscles & Recovery",
    "Microbiome & Gut Health",
    "Energy & Vitality",
    "Sleep & Relaxation"
  ],
  it: [
    "Longevità",
    "Cervello & Focus",
    "Muscoli & Recupero",
    "Microbioma & Salute Intestinale",
    "Energia & Vitalità",
    "Sonno & Relax"
  ]
};

const normalizeBenefit = (title: string, locale: string) => {
  if (locale === 'en') {
    if (title === 'Microbiome Health' || title === 'Gut Health') return 'Microbiome & Gut Health';
    if (title === 'Digestion' || title === 'Easy Digestion') return 'Digestion';
    return title;
  } else {
    // Italian
    if (title === 'Salute del Microbioma' || title === 'Salute Intestinale') return 'Microbioma & Salute Intestinale';
    if (title === 'Digestione' || title === 'Digestione Leggera') return 'Digestione';
    return title;
  }
};

export function RecipeList({ initialRecipes }: RecipeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const locale = useLocale();
  const lp = (path: string) => localeHref(path, locale);

  // Extract unique benefits from recipes
  const allBenefits = useMemo(() => {
    const benefitsSet = new Set<string>();
    initialRecipes.forEach((r) => {
      r.benefits?.forEach((b) => {
        const normalized = normalizeBenefit(b.title, locale);
        benefitsSet.add(normalized);
      });
    });

    const sortedBenefits = Array.from(benefitsSet).sort();

    // Reorder based on priority
    const priorityList = PRIORITY_FILTERS[locale as keyof typeof PRIORITY_FILTERS] || [];
    const prioritySet = new Set(priorityList);

    const topBenefits = priorityList.filter(b => benefitsSet.has(b));
    const otherBenefits = sortedBenefits.filter(b => !prioritySet.has(b));

    return [...topBenefits, ...otherBenefits];
  }, [initialRecipes, locale]);

  // Show only first 6 filters by default
  const visibleBenefits = showAllFilters ? allBenefits : allBenefits.slice(0, 6);
  const hasMoreFilters = allBenefits.length > 6;

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredRecipes = useMemo(() => {
    const results = initialRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.benefits?.some((b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory = selectedCategory
        ? recipe.benefits?.some((b) => normalizeBenefit(b.title, locale) === selectedCategory)
        : true;

      return matchesSearch && matchesCategory;
    });

    // Sort: Recipes with images first
    return results.sort((a, b) => {
      if (a.image && !b.image) return -1;
      if (!a.image && b.image) return 1;
      return 0;
    });
  }, [initialRecipes, searchQuery, selectedCategory, locale]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        analytics.recipeSearched(searchQuery, filteredRecipes.length);
      }, 800);
    }
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery, filteredRecipes.length]);

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-6">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-2xl border-0 py-4 pl-12 pr-12 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-base sm:leading-6 bg-white"
            placeholder={locale === 'en' ? "Search recipes, ingredients or benefits..." : "Cerca ricette, ingredienti o benefici..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory(null);
              analytics.recipeFilterApplied(null, initialRecipes.length);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === null
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:ring-zinc-300"
              }`}
          >
            {locale === 'en' ? 'All' : 'Tutti'}
          </button>
          {visibleBenefits.map((benefit) => (
            <button
              key={benefit}
              onClick={() => {
                setSelectedCategory(benefit);
                const count = initialRecipes.filter(r => r.benefits?.some(b => normalizeBenefit(b.title, locale) === benefit)).length;
                analytics.recipeFilterApplied(benefit, count);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === benefit
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:ring-zinc-300"
                }`}
            >
              {benefit}
            </button>
          ))}

          {hasMoreFilters && (
            <button
              onClick={() => setShowAllFilters(!showAllFilters)}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-medium text-zinc-500 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:text-zinc-700 hover:ring-zinc-300 transition-all"
            >
              {showAllFilters ? (
                <>
                  {locale === 'en' ? 'Less' : 'Meno'} <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  {locale === 'en' ? 'More' : 'Altro'} <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-zinc-500">
        {locale === 'en'
          ? `Showing ${filteredRecipes.length} ${filteredRecipes.length === 1 ? "recipe" : "recipes"}`
          : `Mostrando ${filteredRecipes.length} ${filteredRecipes.length === 1 ? "ricetta" : "ricette"}`}
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.slug}
            href={lp(`/ricette/${recipe.category}/${recipe.slug}`)}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-zinc-300"
          >
            {recipe.image && (
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="flex-1">
                <div className="mb-4 flex flex-wrap gap-2">
                  {recipe.benefits?.slice(0, 2).map((benefit, index) => (
                    <span key={index} className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      {benefit.title}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold leading-6 text-zinc-900 group-hover:text-emerald-600 transition-colors">
                  {recipe.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-zinc-600 line-clamp-3">
                  {recipe.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-6">
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {recipe.prepTime}
                  </span>
                  {recipe.calories && (
                    <span className="flex items-center gap-1.5">
                      <Flame className="h-4 w-4" />
                      {recipe.calories} kcal
                    </span>
                  )}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">{locale === 'en' ? 'No recipes found with these criteria.' : 'Nessuna ricetta trovata con questi criteri.'}</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            {locale === 'en' ? 'Reset filters' : 'Resetta filtri'}
          </button>
        </div>
      )}
    </div>
  );
}
