-- Aggregated per-article counters for recommendations and trending
create table if not exists public.article_stats (
  slug text primary key,
  view_count int not null default 0,
  cta_clicks int not null default 0,
  updated_at timestamptz not null default now()
);

-- Per-session article reads — powers collaborative filtering ("Also Read")
create table if not exists public.reading_sessions (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  article_slug text not null,
  created_at timestamptz not null default now(),
  unique (session_id, article_slug)
);

create index if not exists idx_reading_sessions_slug
  on public.reading_sessions (article_slug);

create index if not exists idx_reading_sessions_session
  on public.reading_sessions (session_id);

create index if not exists idx_reading_sessions_created
  on public.reading_sessions (created_at);

-- Atomic increment functions
create or replace function public.increment_article_views(article_slug text)
returns void language plpgsql as $$
begin
  insert into public.article_stats (slug, view_count, updated_at)
  values (article_slug, 1, now())
  on conflict (slug)
  do update set view_count = article_stats.view_count + 1, updated_at = now();
end;
$$;

create or replace function public.increment_article_cta_clicks(article_slug text)
returns void language plpgsql as $$
begin
  insert into public.article_stats (slug, cta_clicks, updated_at)
  values (article_slug, 1, now())
  on conflict (slug)
  do update set cta_clicks = article_stats.cta_clicks + 1, updated_at = now();
end;
$$;

-- RLS with open policies — non-sensitive analytics data
alter table public.article_stats enable row level security;
alter table public.reading_sessions enable row level security;

create policy "Anyone can read article_stats"
  on public.article_stats for select using (true);
create policy "Anyone can insert article_stats"
  on public.article_stats for insert with check (true);
create policy "Anyone can update article_stats"
  on public.article_stats for update using (true);

create policy "Anyone can read reading_sessions"
  on public.reading_sessions for select using (true);
create policy "Anyone can insert reading_sessions"
  on public.reading_sessions for insert with check (true);
