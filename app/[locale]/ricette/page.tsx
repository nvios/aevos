import type { Metadata } from "next";
import { getAllRecipes } from "@/lib/content/recipes";
import { RecipeList } from "@/components/recipe-list";

export const metadata: Metadata = {
  title: "Ricette per la Longevità | Aevos Health",
  description: "Scopri ricette scientificamente studiate per supportare la tua salute metabolica e promuovere la longevità.",
};

export default function RecipesPage() {
  const recipes = getAllRecipes();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Ricette per la Longevità
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600">
          Nutrizione mirata per ottimizzare il tuo metabolismo. Ogni ricetta è bilanciata per supportare i tuoi obiettivi di salute.
        </p>
      </div>

      <RecipeList initialRecipes={recipes} />
    </div>
  );
}
