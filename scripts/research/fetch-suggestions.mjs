import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = path.join(process.cwd(), 'data/market-research-it.json');

// Core categories and seed terms for Longevity in Italy
const SEEDS = [
  // General Longevity
  "longevità", "anti-aging", "invecchiamento sano", "biohacking italia",
  
  // Nutrition
  "dieta longevità", "digiuno intermittente", "mima digiuno", "dieta valter longo",
  "cibi antiossidanti", "integratori longevità", "spermidina", "resveratrolo", "nmn italia",
  
  // Sleep
  "migliorare sonno", "ritmo circadiano", "insonnia rimedi", "melatonina", "magnesio sonno",
  
  // Exercise
  "allenamento longevità", "zona 2", "vo2 max", "allenamento forza over 50",
  
  // Tech & Gadgets
  "anello smart", "misuratore glucosio", "luce rossa terapia", "sauna infrarossi",
  
  // Mental
  "stress cortisolo", "meditazione", "respirazione wim hof", "vago",
  
  // Specific Questions
  "come vivere 100 anni", "perché invecchiamo", "cosa mangiare per vivere a lungo"
];

// Helper to fetch suggestions from Google
async function fetchSuggestions(term, lang = 'it', country = 'it') {
  const url = `http://suggestqueries.google.com/complete/search?client=chrome&hl=${lang}&gl=${country}&q=${encodeURIComponent(term)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const data = await response.json();
    // data[1] contains the suggestions array
    return data[1] || [];
  } catch (error) {
    console.error(`Error fetching for "${term}":`, error.message);
    return [];
  }
}

async function run() {
  console.log("🔍 Starting Italian Market Research...");
  
  const results = {};
  
  // 1. Fetch suggestions for each seed
  for (const seed of SEEDS) {
    console.log(`  Processing seed: ${seed}`);
    const suggestions = await fetchSuggestions(seed);
    results[seed] = suggestions;
    
    // 2. Recursive/Deep dive: Fetch suggestions for the top 3 results of each seed
    // This helps find long-tail keywords
    for (const subSeed of suggestions.slice(0, 3)) {
        if (subSeed !== seed && !results[subSeed]) {
             // Avoid re-fetching if we already have it or if it's the same
             const subSuggestions = await fetchSuggestions(subSeed);
             results[subSeed] = subSuggestions;
        }
    }
    
    // Polite delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Flatten and dedup
  const allSuggestions = new Set();
  Object.values(results).forEach(list => list.forEach(item => allSuggestions.add(item)));
  
  const finalData = {
    timestamp: new Date().toISOString(),
    seeds: SEEDS,
    total_unique_suggestions: allSuggestions.size,
    suggestions_by_seed: results,
    all_suggestions_flat: Array.from(allSuggestions).sort()
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
  console.log(`✅ Research complete. Found ${allSuggestions.size} unique topics.`);
  console.log(`📁 Saved to ${OUTPUT_FILE}`);
}

run();
