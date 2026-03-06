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

// ── Trending (exponential time-decay, locale-aware) ──────────

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

  let query = supabase
    .from("reading_sessions")
    .select("article_slug, created_at")
    .gte("created_at", cutoff.toISOString());

  query = query.eq("locale", locale);

  const { data: sessions } = await query;

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

  const { data: matchingSessions } = await supabase
    .from("reading_sessions")
    .select("session_id")
    .eq("article_slug", currentSlug)
    .eq("locale", locale);

  if (!matchingSessions || matchingSessions.length === 0) return [];

  const sessionIds = matchingSessions.map((s) => s.session_id);

  const { data: coReads } = await supabase
    .from("reading_sessions")
    .select("article_slug")
    .in("session_id", sessionIds)
    .neq("article_slug", currentSlug);

  if (!coReads || coReads.length === 0) return [];

  const coOccurrence = new Map<string, number>();
  for (const r of coReads) {
    coOccurrence.set(r.article_slug, (coOccurrence.get(r.article_slug) ?? 0) + 1);
  }

  const slugs = [currentSlug, ...coOccurrence.keys()];
  const { data: stats } = await supabase
    .from("article_stats")
    .select("slug, view_count")
    .eq("locale", locale)
    .in("slug", slugs);

  const viewCounts = new Map<string, number>();
  if (stats) {
    for (const s of stats) viewCounts.set(s.slug, s.view_count);
  }

  const currentViews = viewCounts.get(currentSlug) ?? 1;

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

// ── Article stats for engagement boost (locale-aware) ────────

export async function getArticleStatsMap(
  locale: string = "it"
): Promise<Map<string, ArticleStats>> {
  const supabase = getSupabase();
  if (!supabase) return new Map();

  const { data } = await supabase
    .from("article_stats")
    .select("slug, view_count, cta_clicks")
    .eq("locale", locale);

  if (!data) return new Map();

  return new Map(data.map((s) => [s.slug, s]));
}

// ── Most popular articles by view count (locale-aware) ───────

export async function getPopularArticleSlugs(
  limit: number = 10,
  locale: string = "it"
): Promise<Set<string>> {
  const supabase = getSupabase();
  if (!supabase) return new Set();

  const { data } = await supabase
    .from("article_stats")
    .select("slug")
    .eq("locale", locale)
    .order("view_count", { ascending: false })
    .limit(limit);

  if (!data) return new Set();
  return new Set(data.map((s) => s.slug));
}
