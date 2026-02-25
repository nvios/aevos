import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string; // Primary category for URL/Breadcrumbs
  categories: string[]; // All categories this article belongs to
  author: string;
  authorRole?: string;
  faq?: Array<{ question: string; answer: string }>;
  cta?: Array<{ text: string; link: string; description?: string }>;
  tags?: string[];
  resources?: Array<{ name: string; link: string }>;
  content: string;
};

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);

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
      author: data.author,
      authorRole: data.authorRole,
      faq: data.faq,
      cta: data.cta,
      tags: data.tags,
      resources: data.resources,
      content,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      return getArticleBySlug(slug);
    })
    .filter((article): article is Article => article !== null);

  return articles;
}

export function getArticlesByCategory(category: string): Article[] {
  const allArticles = getAllArticles();
  return allArticles.filter((article) => article.categories.includes(category));
}

export function getRelatedArticles(currentSlug: string, category: string, tags?: string[], limit: number = 3): Article[] {
  const allArticles = getAllArticles();

  return allArticles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => {
      let score = 0;

      // Category match (check if the article belongs to the current context category)
      if (article.categories.includes(category)) {
        score += 2;
      }

      if (tags && article.tags) {
        const matchingTags = article.tags.filter(tag => tags?.includes(tag));
        score += matchingTags.length;
      }

      return { article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}
