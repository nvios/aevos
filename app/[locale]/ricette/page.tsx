import { getAllRecipes } from "@/lib/content/recipes";
import { RecipeList } from "@/components/recipe-list";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({
    title: "Ricette per la longevità",
    titleEn: "Longevity recipes",
    description: "Scopri ricette scientificamente studiate per supportare la tua salute metabolica e promuovere la longevità.",
    descriptionEn: "Discover scientifically designed recipes to support your metabolic health and promote longevity.",
    path: "/ricette",
    locale,
  });
}

export default async function RecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const recipes = getAllRecipes(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {locale === 'en' ? 'Longevity Recipes' : 'Ricette per la Longevità'}
        </h1>
        <p className="mt-2 text-base text-zinc-500">
          {locale === 'en'
            ? 'Targeted nutrition to optimize your metabolism. Each recipe is balanced to support your health goals.'
            : 'Nutrizione mirata per ottimizzare il tuo metabolismo. Ogni ricetta è bilanciata per supportare i tuoi obiettivi di salute.'}
        </p>
      </div>

      <RecipeList initialRecipes={recipes} />
    </div>
  );
}
