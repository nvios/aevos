import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ChevronLeft, Clock, ExternalLink, ArrowRight, ChefHat, Flame, Users, Heart, Brain, Zap } from "lucide-react";

import { FaqAccordion } from "@/components/faq-accordion";
import { FaqSubmission } from "@/components/faq-submission";

import type { Recipe } from "@/lib/content/recipes";

type FaqItem = {
  question: string;
  answer: string;
};

type RecipeProps = {
  title: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  prepTime: string;
  cookTime: string;
  servings: number;
  calories?: number;
  ingredients: string[];
  instructions: string[];
  benefits?: Array<{ title: string; description: string }>;
  image?: string;
  faq?: FaqItem[];
  relatedRecipes?: Recipe[];
  children: React.ReactNode;
};

export function RecipeLayout({
  title,
  description,
  category,
  prepTime,
  cookTime,
  servings,
  calories,
  ingredients,
  instructions,
  benefits,
  image,
  faq,
  relatedRecipes,
  children,
}: RecipeProps) {

  // Basic Schema.org Recipe structured data
  const recipeSchema = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": "Aevos Health"
    },
    "prepTime": prepTime, // Note: Should be ISO 8601 duration format ideally
    "cookTime": cookTime, // Note: Should be ISO 8601 duration format ideally
    "recipeYield": servings,
    "recipeIngredient": ingredients,
    "recipeInstructions": instructions.map((step, index) => ({
      "@type": "HowToStep",
      "text": step,
      "position": index + 1
    })),
    ...(calories && { "nutrition": { "@type": "NutritionInformation", "calories": `${calories} calories` } }),
    ...(image && { "image": [image] }),
  };

  return (
    <article className="mx-auto max-w-4xl py-8">
      <Script
        id="recipe-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />

      {/* Breadcrumb / Back Link */}
      <div className="mb-4 px-4 sm:px-0">
        <Link
          href="/ricette"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Torna alle ricette
        </Link>
      </div>

      {/* Header */}
      <header className="mb-8 space-y-6 px-4 sm:px-0">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl">
            {title}
          </h1>
          <p className="text-xl leading-relaxed text-zinc-600 max-w-2xl">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-600">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            <span>Prep: {prepTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-emerald-600" />
            <span>Cottura: {cookTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span>Porzioni: {servings}</span>
          </div>
          {calories && (
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-emerald-600" />
              <span>{calories} kcal</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-zinc-100 pt-6">

        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">

          {/* Ingredients Mobile (visible only on small screens if needed, but keeping simple for now) */}

          {/* Benefits Section - Prominent */}
          {benefits && benefits.length > 0 && (
            <div className="rounded-3xl bg-emerald-50 p-6 sm:p-8 border border-emerald-100">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-emerald-600" />
                Benefici per la Longevità
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-bold text-emerald-800 text-lg">{benefit.title}</h3>
                    <p className="text-emerald-700/80 leading-relaxed text-sm">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/50 sm:p-8">
            <h2 className="text-2xl font-bold text-zinc-800 mb-6">Procedimento</h2>
            <div className="space-y-6">
              {instructions.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-none flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-zinc-600 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Content */}
          {children && (
            <div className="prose prose-lg prose-zinc max-w-none">
              {children}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Ingredients Card */}
          <div className="rounded-3xl bg-emerald-50/50 p-6 ring-1 ring-emerald-100/50">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Ingredienti</h3>
            <ul className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 text-zinc-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-2 flex-none" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Recipes */}
      {relatedRecipes && relatedRecipes.length > 0 && (
        <section className="mt-16 border-t border-zinc-200 pt-10 px-4 sm:px-0">
          <h3 className="mb-6 text-2xl font-bold text-zinc-800">Potrebbe piacerti anche</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedRecipes.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/ricette/${recipe.category}/${recipe.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {recipe.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.prepTime}</span>
                    <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.calories} kcal</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                  Scopri <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
