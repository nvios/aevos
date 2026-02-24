import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  authorRole?: string;
  faq?: Array<{ question: string; answer: string }>;
  cta?: Array<{ text: string; link: string; description?: string }>;
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

    return {
      slug,
      title: data.title,
      description: data.description,
      category: data.category,
      author: data.author,
      authorRole: data.authorRole,
      faq: data.faq,
      cta: data.cta,
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
  return allArticles.filter((article) => article.category === category);
}
