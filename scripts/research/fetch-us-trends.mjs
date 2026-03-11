import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = path.join(process.cwd(), 'data/market-research-us.json');

// Core categories and seed terms for Longevity in US/International Market
// These are broader and include cutting-edge terms
const SEEDS = [
  // General Longevity
  "longevity blueprint", "biological age reversal", "healthspan optimization", "biohacking trends 2026",
  
  // Nutrition
  "longevity diet", "fasting mimicking diet", "time restricted feeding", "blue zones diet",
  "spermidine rich foods", "resveratrol benefits", "nmn supplements", "urolithin a", "rapamycin longevity",
  
  // Sleep
  "sleep optimization", "circadian rhythm hacking", "sleep hygiene protocols", "magnesium threonate sleep",
  
  // Exercise
  "zone 2 training", "vo2 max longevity", "grip strength mortality", "sarcopenia prevention",
  
  // Tech & Gadgets
  "smart ring sleep tracker", "continuous glucose monitor", "red light therapy panel", "infrared sauna benefits",
  "hyperbaric oxygen therapy", "cryotherapy benefits",
  
  // Mental
  "stress resilience", "vagus nerve stimulation", "breathwork for longevity", "meditation for aging",
  
  // Specific Questions
  "how to reverse aging", "best supplements for longevity", "bryan johnson protocol"
];

// Helper to fetch suggestions from Google (US Endpoint)
async function fetchSuggestions(term) {
  const url = `http://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=us&q=${encodeURIComponent(term)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const data = await response.json();
    return data[1] || [];
  } catch (error) {
    console.error(`Error fetching for "${term}":`, error.message);
    return [];
  }
}

async function run() {
  console.log("🇺🇸 Starting US Market Trend Research...");
  
  const results = {};
  const allSuggestions = new Set();
  
  for (const seed of SEEDS) {
    console.log(`  Processing seed: ${seed}`);
    const suggestions = await fetchSuggestions(seed);
    results[seed] = suggestions;
    suggestions.forEach(s => allSuggestions.add(s));
    
    // Deep dive into top 2 results
    for (const subSeed of suggestions.slice(0, 2)) {
        if (subSeed !== seed && !results[subSeed]) {
             const subSuggestions = await fetchSuggestions(subSeed);
             results[subSeed] = subSuggestions;
             subSuggestions.forEach(s => allSuggestions.add(s));
        }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const finalData = {
    timestamp: new Date().toISOString(),
    seeds: SEEDS,
    total_unique_suggestions: allSuggestions.size,
    suggestions_by_seed: results,
    all_suggestions_flat: Array.from(allSuggestions).sort()
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
  console.log(`✅ US Research complete. Found ${allSuggestions.size} unique trends.`);
  console.log(`📁 Saved to ${OUTPUT_FILE}`);
}

run();
