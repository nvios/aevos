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

export function getArticleBySlug(slug: string, locale: string = 'it'): Article | null {
  try {
    // Try to find the localized file first
    let fullPath = path.join(articlesDirectory, `${slug}.${locale}.md`);
    
    // If localized file doesn't exist, fall back to default (Italian)
    // For Italian, we check .it.md first, then .md
    if (!fs.existsSync(fullPath)) {
      if (locale === 'it') {
         fullPath = path.join(articlesDirectory, `${slug}.md`);
      } else {
         // If English requested but not found, fall back to Italian (default)
         // This might not be desired if we want to show 404 for missing translations
         // But for now, let's fall back to default content or return null?
         // The plan says: "Fallback to filename.md (or filename.it.md) if en doesn't exist."
         // Wait, if I return Italian content on English URL, it might be confusing.
         // Better to return null if translation is missing, so we can handle 404 or show a "translation missing" message.
         // However, for simplicity and SEO safety (avoiding broken links if we switch languages), 
         // maybe fallback is safer? 
         // Let's stick to: return null if specific locale requested and not found, UNLESS it's default locale.
         
         // Actually, let's try to find the default file as fallback
         const defaultPath = path.join(articlesDirectory, `${slug}.md`);
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

export function getAllArticles(locale: string = 'it'): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  
  // Get unique slugs
  const slugs = new Set<string>();
  fileNames.forEach(fileName => {
    if (fileName.endsWith(".md")) {
      const slug = fileName.replace(/\.en\.md$/, "").replace(/\.it\.md$/, "").replace(/\.md$/, "");
      slugs.add(slug);
    }
  });

  const articles = Array.from(slugs)
    .map((slug) => getArticleBySlug(slug, locale))
    .filter((article): article is Article => article !== null);

  return articles;
}

export function getArticlesByCategory(category: string, locale: string = 'it'): Article[] {
  const allArticles = getAllArticles(locale);
  return allArticles.filter((article) => article.categories.includes(category));
}

type ArticleStatsMap = Map<string, { view_count: number; cta_clicks: number }>;

/**
 * Content-based related articles with optional engagement boost.
 * Pass a statsMap from `getArticleStatsMap()` to boost articles
 * that drive higher CTA engagement.
 */
export function getRelatedArticles(
  currentSlug: string,
  category: string,
  tags?: string[],
  limit: number = 3,
  locale: string = 'it',
  statsMap?: ArticleStatsMap,
): Article[] {
  const allArticles = getAllArticles(locale);

  return allArticles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => {
      let contentScore = 0;

      if (article.categories.includes(category)) {
        contentScore += 2;
      }

      if (tags && article.tags) {
        const matchingTags = article.tags.filter(tag => tags?.includes(tag));
        contentScore += matchingTags.length;
      }

      let engagementBoost = 1;
      if (statsMap) {
        const stats = statsMap.get(article.slug);
        if (stats && stats.view_count > 0) {
          const ctaRate = stats.cta_clicks / stats.view_count;
          engagementBoost = 1 + ctaRate * 0.5;
        }
      }

      return { article, score: contentScore * engagementBoost };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}
