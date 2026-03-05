import { createClient } from "@supabase/supabase-js";
import { getAllArticles, type Article } from "./articles";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

type ArticleStats = {
  slug: string;
  view_count: number;
  cta_clicks: number;
};

// ── Trending (exponential time-decay) ──────────────────

const DECAY = 0.85;
const TRENDING_WINDOW_DAYS = 7;

export async function getTrendingArticles(
  limit: number = 6,
  locale: string = "it"
): Promise<Article[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - TRENDING_WINDOW_DAYS);

  const { data: sessions } = await supabase
    .from("reading_sessions")
    .select("article_slug, created_at")
    .gte("created_at", cutoff.toISOString());

  if (!sessions || sessions.length === 0) return [];

  const now = Date.now();
  const scores = new Map<string, number>();

  for (const s of sessions) {
    const daysAgo = (now - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24);
    const weight = Math.pow(DECAY, daysAgo);
    scores.set(s.article_slug, (scores.get(s.article_slug) ?? 0) + weight);
  }

  const ranked = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);

  const allArticles = getAllArticles(locale);
  const bySlug = new Map(allArticles.map((a) => [a.slug, a]));

  return ranked.map((slug) => bySlug.get(slug)).filter((a): a is Article => a != null);
}

// ── "Readers Also Read" (item-item collaborative filtering) ──

export async function getAlsoReadArticles(
  currentSlug: string,
  limit: number = 3,
  locale: string = "it"
): Promise<Article[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  // Find all sessions that include the current article
  const { data: matchingSessions } = await supabase
    .from("reading_sessions")
    .select("session_id")
    .eq("article_slug", currentSlug);

  if (!matchingSessions || matchingSessions.length === 0) return [];

  const sessionIds = matchingSessions.map((s) => s.session_id);

  // Find all articles read in those sessions (excluding current)
  const { data: coReads } = await supabase
    .from("reading_sessions")
    .select("article_slug")
    .in("session_id", sessionIds)
    .neq("article_slug", currentSlug);

  if (!coReads || coReads.length === 0) return [];

  // Count co-occurrences
  const coOccurrence = new Map<string, number>();
  for (const r of coReads) {
    coOccurrence.set(r.article_slug, (coOccurrence.get(r.article_slug) ?? 0) + 1);
  }

  // Get view counts for normalization (cosine similarity)
  const slugs = [currentSlug, ...coOccurrence.keys()];
  const { data: stats } = await supabase
    .from("article_stats")
    .select("slug, view_count")
    .in("slug", slugs);

  const viewCounts = new Map<string, number>();
  if (stats) {
    for (const s of stats) viewCounts.set(s.slug, s.view_count);
  }

  const currentViews = viewCounts.get(currentSlug) ?? 1;

  // score(A, B) = co_reads(A, B) / sqrt(views(A) * views(B))
  const scored = Array.from(coOccurrence.entries()).map(([slug, count]) => {
    const views = viewCounts.get(slug) ?? 1;
    const score = count / Math.sqrt(currentViews * views);
    return { slug, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topSlugs = scored.slice(0, limit).map((s) => s.slug);

  const allArticles = getAllArticles(locale);
  const bySlug = new Map(allArticles.map((a) => [a.slug, a]));

  return topSlugs.map((slug) => bySlug.get(slug)).filter((a): a is Article => a != null);
}

// ── Article stats for engagement boost ──────────────────

export async function getArticleStatsMap(): Promise<Map<string, ArticleStats>> {
  const supabase = getSupabase();
  if (!supabase) return new Map();

  const { data } = await supabase
    .from("article_stats")
    .select("slug, view_count, cta_clicks");

  if (!data) return new Map();

  return new Map(data.map((s) => [s.slug, s]));
}

// ── Most popular articles (by view count) ───────────────

export async function getPopularArticleSlugs(
  limit: number = 10
): Promise<Set<string>> {
  const supabase = getSupabase();
  if (!supabase) return new Set();

  const { data } = await supabase
    .from("article_stats")
    .select("slug")
    .order("view_count", { ascending: false })
    .limit(limit);

  if (!data) return new Set();
  return new Set(data.map((s) => s.slug));
}
