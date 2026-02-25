import fs from "fs";
import path from "path";
import matter from "gray-matter";

const recipesDirectory = path.join(process.cwd(), "content/recipes");

export type Recipe = {
  slug: string;
  title: string;
  description: string;
  category: string; // Primary category for URL/Breadcrumbs
  categories: string[]; // All categories this recipe belongs to
  prepTime: string;
  cookTime: string;
  servings: number;
  calories?: number;
  ingredients: string[];
  instructions: string[];
  benefits: Array<{ title: string; description: string }>;
  tags?: string[];
  content: string; // Additional content/notes
  author: string;
  image?: string;
  faq?: Array<{ question: string; answer: string }>;
};

export function getRecipeBySlug(slug: string): Recipe | null {
  try {
    const fullPath = path.join(recipesDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Handle category/categories normalization
    let categories: string[] = [];
    if (Array.isArray(data.categories)) {
      categories = data.categories;
    } else if (data.category) {
      categories = [data.category];
    }

    // Ensure there is at least one category
    if (categories.length === 0) {
      categories = ["uncategorized"];
    }

    const primaryCategory = categories[0];

    return {
      slug,
      title: data.title,
      description: data.description,
      category: primaryCategory,
      categories: categories,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      calories: data.calories,
      ingredients: data.ingredients || [],
      instructions: data.instructions || [],
      benefits: data.benefits || [],
      tags: data.tags,
      content,
      author: data.author || "Aevos Health Team",
      image: data.image,
      faq: data.faq,
    };
  } catch (error) {
    console.error(`Error reading recipe ${slug}:`, error);
    return null;
  }
}

export function getAllRecipes(): Recipe[] {
  if (!fs.existsSync(recipesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(recipesDirectory);
  const recipes = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      return getRecipeBySlug(slug);
    })
    .filter((recipe): recipe is Recipe => recipe !== null);

  return recipes;
}

export function getRecipesByCategory(category: string): Recipe[] {
  const allRecipes = getAllRecipes();
  return allRecipes.filter((recipe) => recipe.categories.includes(category));
}

export function getRelatedRecipes(currentSlug: string, category: string, tags?: string[], limit: number = 3): Recipe[] {
  const allRecipes = getAllRecipes();

  return allRecipes
    .filter((recipe) => recipe.slug !== currentSlug)
    .map((recipe) => {
      let score = 0;

      // Category match
      if (recipe.categories.includes(category)) {
        score += 2;
      }

      if (tags && recipe.tags) {
        const matchingTags = recipe.tags.filter(tag => tags?.includes(tag));
        score += matchingTags.length;
      }

      return { recipe, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.recipe);
}
