import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/markdown-renderer";

import { RecipeLayout } from "@/components/recipe-layout";
import { getRecipeBySlug, getAllRecipes, getRelatedRecipes } from "@/lib/content/recipes";
import { getCategoryBySlug } from "@/lib/content/categories";

type Props = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    return {};
  }

  return {
    title: `${recipe.title} | Aevos Health`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: "article",
      authors: [recipe.author],
    },
  };
}

export async function generateStaticParams() {
  const recipes = getAllRecipes();

  return recipes.map((recipe) => ({
    category: recipe.category,
    slug: recipe.slug,
  }));
}

export default async function RecipePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe || recipe.category !== categorySlug) {
    notFound();
  }

  const category = getCategoryBySlug(recipe.category) || {
    title: recipe.category,
    slug: recipe.category,
    description: "",
  };

  const relatedRecipes = getRelatedRecipes(recipe.slug, recipe.category, recipe.tags);

  return (
    <RecipeLayout
      title={recipe.title}
      description={recipe.description}
      category={{
        name: category.title,
        slug: category.slug,
      }}
      prepTime={recipe.prepTime}
      cookTime={recipe.cookTime}
      servings={recipe.servings}
      calories={recipe.calories}
      ingredients={recipe.ingredients}
      instructions={recipe.instructions}
      benefits={recipe.benefits}
      image={recipe.image}
      faq={recipe.faq}
      relatedRecipes={relatedRecipes}
    >
      <MarkdownRenderer content={recipe.content} />
    </RecipeLayout>
  );
}
