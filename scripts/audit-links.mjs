import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDir = path.join(process.cwd(), 'content/articles');

// Helper to get all articles
function getArticles() {
  if (!fs.existsSync(articlesDir)) {
    console.error(`Directory not found: ${articlesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md') && !f.endsWith('.en.md'));
  
  return files.map(file => {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    return {
      file,
      slug: file.replace('.md', ''),
      title: parsed.data.title,
      tags: parsed.data.tags || [],
      content: parsed.content
    };
  });
}

function auditLinks() {
  const articles = getArticles();
  const tagMap = {};

  // Build Tag Map
  articles.forEach(article => {
    article.tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase().trim();
      if (!tagMap[normalizedTag]) tagMap[normalizedTag] = [];
      tagMap[normalizedTag].push(article.slug);
    });
  });

  const opportunities = [];

  articles.forEach(article => {
    const relatedScores = {};

    // Find related articles based on tags
    article.tags.forEach(tag => {
      const normalizedTag = tag.toLowerCase().trim();
      const others = tagMap[normalizedTag] || [];
      others.forEach(otherSlug => {
        if (otherSlug !== article.slug) {
          relatedScores[otherSlug] = (relatedScores[otherSlug] || 0) + 1;
        }
      });
    });

    // Filter and check for existing links
    Object.entries(relatedScores).forEach(([otherSlug, score]) => {
      // Check if link exists in content
      // We look for:
      // 1. Markdown links: [text](/articoli/.../slug) or [text](slug)
      // 2. Direct mentions of the slug (heuristic)
      
      const linkRegex = new RegExp(`/${otherSlug}|${otherSlug}\\.md|\\(${otherSlug}\\)`, 'i');
      
      if (!linkRegex.test(article.content)) {
        const otherArticle = articles.find(a => a.slug === otherSlug);
        if (otherArticle) {
             opportunities.push({
                source: article.title,
                target: otherArticle.title,
                targetSlug: otherSlug,
                score: score,
                sharedTags: article.tags.filter(t => otherArticle.tags.map(ot => ot.toLowerCase()).includes(t.toLowerCase()))
            });
        }
      }
    });
  });

  // Sort by score (relevance)
  opportunities.sort((a, b) => b.score - a.score);

  console.log('\n🔗 Link Audit: Missed Opportunities\n');
  if (opportunities.length === 0) {
      console.log('Great job! No obvious missed linking opportunities found based on tags.');
  } else {
      opportunities.slice(0, 20).forEach(op => {
        console.log(`❌ "${op.source}" could link to "${op.target}"`);
        console.log(`   Reason: Shared tags [${op.sharedTags.join(', ')}] (Score: ${op.score})`);
        console.log(`   Suggestion: Add a link to /articoli/category/${op.targetSlug}\n`);
      });
      
      if (opportunities.length > 20) {
          console.log(`... and ${opportunities.length - 20} more opportunities.`);
      }
  }
}

auditLinks();
