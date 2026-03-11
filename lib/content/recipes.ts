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

export function getRecipeBySlug(slug: string, locale: string = 'it'): Recipe | null {
  try {
    let fullPath = path.join(recipesDirectory, `${slug}.${locale}.md`);

    if (!fs.existsSync(fullPath)) {
      if (locale === 'it') {
        fullPath = path.join(recipesDirectory, `${slug}.md`);
      } else {
        const defaultPath = path.join(recipesDirectory, `${slug}.md`);
        if (fs.existsSync(defaultPath)) {
          fullPath = defaultPath;
        } else {
          return null;
        }
      }
    }

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Handle category/categories normalization
    const categories: string[] = Array.isArray(data.categories) && data.categories.length > 0
      ? data.categories
      : ["uncategorized"];

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
      author: data.author || "Aevos Team",
      image: data.image,
      faq: data.faq,
    };
  } catch (error) {
    console.error(`Error reading recipe ${slug}:`, error);
    return null;
  }
}

export function getAllRecipes(locale: string = 'it'): Recipe[] {
  if (!fs.existsSync(recipesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(recipesDirectory);

  const slugs = new Set<string>();
  fileNames.forEach(fileName => {
    if (fileName.endsWith(".md")) {
      const slug = fileName.replace(/\.en\.md$/, "").replace(/\.it\.md$/, "").replace(/\.md$/, "");
      slugs.add(slug);
    }
  });

  const recipes = Array.from(slugs)
    .map((slug) => getRecipeBySlug(slug, locale))
    .filter((recipe): recipe is Recipe => recipe !== null);

  return recipes;
}

export function getRecipesByCategory(category: string, locale: string = 'it'): Recipe[] {
  const allRecipes = getAllRecipes(locale);
  return allRecipes.filter((recipe) => recipe.categories.includes(category));
}

export function getRelatedRecipes(currentSlug: string, category: string, tags?: string[], limit: number = 3, locale: string = 'it'): Recipe[] {
  const allRecipes = getAllRecipes(locale);

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
