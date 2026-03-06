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
    const linkCount = (content.match(/\]\(\/(articoli|ricette)\//g) || []).length;
    const wordCount = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').split(/\s+/).length;
    const linkDensity = wordCount > 0 ? (linkCount / wordCount) * 100 : 0;

    return {
      file,
      slug: file.replace('.md', ''),
      title: parsed.data.title,
      tags: parsed.data.tags || [],
      content: parsed.content,
      linkCount,
      wordCount,
      linkDensity
    };
  });
}

function auditLinks() {
  const articles = getArticles();
  
  // --- PART 1: OVER-LINKING CHECK ---
  console.log('\n🚨 Link Density Audit: Potential Keyword Stuffing\n');
  
  // Filter for articles with at least some links to avoid noise
  const denseArticles = articles
    .filter(a => a.linkCount > 3) 
    .sort((a, b) => b.linkDensity - a.linkDensity);

  if (denseArticles.length === 0) {
      console.log('No articles found with significant link density.');
  } else {
      let highDensityFound = false;
      denseArticles.slice(0, 5).forEach(a => {
        // Threshold: > 3% density (approx 1 link every 33 words) is getting high for readability
        const isHigh = a.linkDensity > 3.0;
        if (isHigh) highDensityFound = true;
        
        const status = isHigh ? '⚠️ HIGH' : '✅ OK';
        console.log(`${status} "${a.title}"`);
        console.log(`   Density: ${a.linkDensity.toFixed(2)}% (${a.linkCount} links / ~${a.wordCount} words)`);
        if (isHigh) console.log(`   Suggestion: Consider removing 1-2 less relevant links to improve readability.`);
        console.log('');
      });
      
      if (!highDensityFound) {
          console.log('All top articles are within safe link density limits (< 3%).');
      }
  }

  // --- PART 2: MISSED OPPORTUNITIES ---
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
             // Penalize based on existing link count to avoid overcrowding
             // Formula: Score - (Existing Links * 0.15)
             // Example: 2 shared tags - (10 existing links * 0.15) = 0.5 score
             const adjustedScore = score - (article.linkCount * 0.15);
             
             opportunities.push({
                source: article.title,
                target: otherArticle.title,
                targetSlug: otherSlug,
                score: adjustedScore,
                rawScore: score,
                existingLinks: article.linkCount,
                sharedTags: article.tags.filter(t => otherArticle.tags.map(ot => ot.toLowerCase()).includes(t.toLowerCase()))
            });
        }
      }
    });
  });

  // Sort by adjusted score (relevance - penalty)
  opportunities.sort((a, b) => {
      // Primary sort: Adjusted Score (Descending)
      if (Math.abs(b.score - a.score) > 0.001) {
          return b.score - a.score;
      }
      // Tie-breaker 1: Raw score descending (more shared tags is better)
      if (b.rawScore !== a.rawScore) {
          return b.rawScore - a.rawScore;
      }
      // Tie-breaker 2: Existing links ascending (fewer links is better/more urgent)
      return a.existingLinks - b.existingLinks;
  });

  console.log('\n🔗 Link Audit: Missed Opportunities (Weighted by existing link density)\n');
  if (opportunities.length === 0) {
      console.log('Great job! No obvious missed linking opportunities found based on tags.');
  } else {
      opportunities.slice(0, 20).forEach(op => {
        console.log(`❌ "${op.source}" could link to "${op.target}"`);
        console.log(`   Reason: Shared tags [${op.sharedTags.join(', ')}]`);
        console.log(`   Metrics: Tag Score ${op.rawScore} | Existing Links: ${op.existingLinks} | Adj. Score: ${op.score.toFixed(2)}`);
        console.log(`   Suggestion: Add a link to /articoli/category/${op.targetSlug}\n`);
      });
      
      if (opportunities.length > 20) {
          console.log(`... and ${opportunities.length - 20} more opportunities.`);
      }
  }
}

auditLinks();
