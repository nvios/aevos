"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Flame, Zap, Search, X } from "lucide-react";
import type { Recipe } from "@/lib/content/recipes";

type RecipeListProps = {
  initialRecipes: Recipe[];
};

export function RecipeList({ initialRecipes }: RecipeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique benefits from recipes
  const allBenefits = useMemo(() => {
    const benefitsSet = new Set<string>();
    initialRecipes.forEach((r) => {
      r.benefits?.forEach((b) => benefitsSet.add(b.title));
    });
    return Array.from(benefitsSet).sort();
  }, [initialRecipes]);

  const filteredRecipes = useMemo(() => {
    return initialRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.benefits?.some((b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory = selectedCategory
        ? recipe.benefits?.some((b) => b.title === selectedCategory)
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [initialRecipes, searchQuery, selectedCategory]);

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
            placeholder="Cerca ricette, ingredienti o benefici..."
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
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === null
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:ring-zinc-300"
              }`}
          >
            Tutti
          </button>
          {allBenefits.map((benefit) => (
            <button
              key={benefit}
              onClick={() => setSelectedCategory(benefit)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === benefit
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:ring-zinc-300"
                }`}
            >
              {benefit}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-zinc-500">
        Mostrando {filteredRecipes.length} {filteredRecipes.length === 1 ? "ricetta" : "ricette"}
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.slug}
            href={`/ricette/${recipe.category}/${recipe.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-zinc-300"
          >
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
          <p className="text-zinc-500">Nessuna ricetta trovata con questi criteri.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            Resetta filtri
          </button>
        </div>
      )}
    </div>
  );
}
