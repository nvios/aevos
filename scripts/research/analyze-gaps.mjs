import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');
const OUTPUT_FILE = path.join(process.cwd(), 'STRATEGY.md');

// Load Data
const itData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'market-research-it.json'), 'utf8'));
const usData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'market-research-us.json'), 'utf8'));

// Get Existing Content
const existingFiles = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));
const existingSlugs = existingFiles.map(f => f.replace(/\.(it|en)?\.md$/, '').toLowerCase());
const existingContentString = existingSlugs.join(' ');

// Helper: Check if a topic is covered
function isCovered(topic, contentString) {
  const tokens = topic.toLowerCase().split(' ').filter(t => t.length > 3);
  if (tokens.length === 0) return false;
  
  for (const slug of existingSlugs) {
    const slugTokens = slug.split('-');
    const matchCount = tokens.filter(t => slugTokens.some(st => st.includes(t))).length;
    if (matchCount / tokens.length >= 0.5) return true;
  }
  return false;
}

// Scoring Logic (for individual keywords)
function calculateScore(topic, lang = 'it') {
  let score = 0;
  const lowerTopic = topic.toLowerCase();
  const words = lowerTopic.split(' ');

  const questionKeywords = lang === 'it' 
    ? ['come', 'cosa', 'perché', 'quando', 'chi', 'dove']
    : ['how', 'what', 'why', 'when', 'who', 'where'];
  if (questionKeywords.some(k => lowerTopic.includes(k))) score += 3;

  const commercialKeywords = lang === 'it'
    ? ['miglior', 'recensione', 'prezzo', 'costo', 'vs', 'comprare', 'acquisto']
    : ['best', 'review', 'price', 'cost', 'vs', 'buy', 'purchase'];
  if (commercialKeywords.some(k => lowerTopic.includes(k))) score += 3;

  if (words.length > 3) score += (words.length - 3);

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  if (lowerTopic.includes(currentYear.toString()) || lowerTopic.includes(nextYear.toString())) score += 2;

  const formatKeywords = lang === 'it'
    ? ['guida', 'protocollo', 'routine', 'blueprint', 'pdf', 'schema', 'esempio']
    : ['guide', 'protocol', 'routine', 'blueprint', 'pdf', 'template', 'example'];
  if (formatKeywords.some(k => lowerTopic.includes(k))) score += 1;

  return score;
}

function analyzeClusters(data, lang = 'it') {
  const clusters = [];
  
  data.seeds.forEach(seed => {
    // Find all suggestions that belong to this cluster
    const clusterItems = data.all_suggestions_flat.filter(s => s.toLowerCase().includes(seed.toLowerCase()));
    
    // Calculate Cluster Volume (Addressable Market Proxy)
    const volume = clusterItems.length;
    
    // Check if the main seed is covered
    const covered = isCovered(seed, existingContentString);
    
    // Find gaps within this cluster
    const gaps = clusterItems.filter(item => !isCovered(item, existingContentString));
    
    if (volume > 0) {
      clusters.push({
        seed,
        volume,
        covered,
        gaps,
        gapCount: gaps.length
      });
    }
  });

  return clusters.sort((a, b) => b.volume - a.volume);
}

function generateStrategy() {
  console.log("📊 Analyzing Traffic Clusters...");

  const itClusters = analyzeClusters(itData, 'it');
  const usClusters = analyzeClusters(usData, 'en');

  // Filter for Critical Gaps (High Volume, Not Covered)
  const criticalGaps = itClusters.filter(c => !c.covered && c.volume >= 5);
  
  // Filter for Expansion Ops (Covered, but many missing sub-topics)
  const expansionOps = itClusters.filter(c => c.covered && c.gapCount >= 5);

  // Filter for Arbitrage Clusters (US Trends)
  const arbitrageClusters = usClusters.filter(c => !c.covered && c.volume >= 5);

  // Generate Report
  const report = `---
title: Traffic-Focused Content Strategy
last_updated: ${new Date().toISOString().split('T')[0]}
---

# 🚀 Aevos Traffic Strategy: The Pillar Approach

This strategy prioritizes **Topic Clusters** with the highest "Addressable Market" (search volume proxy).
Focus on building "Pillar Pages" for the Critical Gaps first.

## 🚨 Critical Traffic Gaps (High Volume, Zero Coverage)
These are massive topic clusters in Italy that you are completely missing.
*Action: Write a comprehensive "Ultimate Guide" for each seed to capture this traffic.*

${criticalGaps.map(c => `### 🔴 ${c.seed} (Potential Traffic: ${c.volume} keywords)
- **Cluster Size:** ${c.volume} variations found.
- **Top Missing Keywords:**
${c.gaps.slice(0, 5).map(g => `  - ${g}`).join('\n')}
`).join('\n')}

## 📈 Expansion Opportunities (Deepen Authority)
You already have content here, but you are missing significant long-tail traffic.
*Action: Write supporting articles to link back to your main page.*

${expansionOps.map(c => `### 🟡 ${c.seed} (Missing: ${c.gapCount} keywords)
- **Top Missing Keywords:**
${c.gaps.slice(0, 5).map(g => `  - ${g}`).join('\n')}
`).join('\n')}

## 🇺🇸 Arbitrage Clusters (US Trends)
Big topics in the US that are wide open in Italy.

${arbitrageClusters.map(c => `### 🔵 ${c.seed} (US Volume: ${c.volume})
- **Top Keywords:**
${c.gaps.slice(0, 5).map(g => `  - ${g}`).join('\n')}
`).join('\n')}

## 💎 Quick Wins (High Intent Niche Queries)
Specific questions with high conversion potential, regardless of cluster size.

${itData.all_suggestions_flat
  .filter(t => !isCovered(t, existingContentString))
  .map(t => ({ topic: t, score: calculateScore(t, 'it') }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
  .map(t => `- [ ] **${t.topic}** (Score: ${t.score})`)
  .join('\n')}

## 📚 Existing Coverage
Total Articles: ${existingFiles.length}
`;

  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`✅ Traffic Strategy updated at ${OUTPUT_FILE}`);
}

generateStrategy();
