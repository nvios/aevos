import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MarkdownRenderer } from "@/components/markdown-renderer";

import { RecipeLayout } from "@/components/recipe-layout";
import { getRecipeBySlug, getAllRecipes, getRelatedRecipes } from "@/lib/content/recipes";
import { getCategoryBySlug } from "@/lib/content/categories";
import { buildMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{
    category: string;
    slug: string;
    locale: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const recipeIt = getRecipeBySlug(slug, 'it');
  const recipeLocale = getRecipeBySlug(slug, locale);

  if (!recipeIt) {
    return {};
  }

  const primaryCategory = recipeIt.categories[0];

  return buildMetadata({
    title: recipeIt.title,
    titleEn: locale === 'en' && recipeLocale ? recipeLocale.title : undefined,
    description: recipeIt.description,
    descriptionEn: locale === 'en' && recipeLocale ? recipeLocale.description : undefined,
    path: `/ricette/${primaryCategory}/${slug}`,
    locale,
  });
}

export async function generateStaticParams() {
  const recipes = getAllRecipes();
  const params = [];
  for (const recipe of recipes) {
    for (const category of recipe.categories) {
      params.push({ category, slug: recipe.slug });
    }
  }
  return params;
}

export default async function RecipePage({ params }: Props) {
  const { category: categorySlug, slug, locale } = await params;
  const recipe = getRecipeBySlug(slug, locale);

  if (!recipe || !recipe.categories.includes(categorySlug)) {
    notFound();
  }

  const category = getCategoryBySlug(categorySlug, locale) || {
    title: categorySlug,
    slug: categorySlug,
    description: "",
  };

  const relatedRecipes = getRelatedRecipes(recipe.slug, categorySlug, recipe.tags, 3, locale);

  return (
    <RecipeLayout
      title={recipe.title}
      description={recipe.description}
      category={{
        name: category.title,
        slug: category.slug,
      }}
      locale={locale}
      prepTime={recipe.prepTime}
      cookTime={recipe.cookTime}
      servings={recipe.servings}
      calories={recipe.calories}
      ingredients={recipe.ingredients}
      instructions={recipe.instructions}
      benefits={recipe.benefits}
      image={recipe.image}
      relatedRecipes={relatedRecipes}
    >
      <MarkdownRenderer content={recipe.content} locale={locale} />
    </RecipeLayout>
  );
}
