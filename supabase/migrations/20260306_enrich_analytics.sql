-- ── Enrich reading_sessions with segmentation columns ──────────

ALTER TABLE public.reading_sessions
  ADD COLUMN IF NOT EXISTS locale text,
  ADD COLUMN IF NOT EXISTS country_code text,
  ADD COLUMN IF NOT EXISTS device_tier text,
  ADD COLUMN IF NOT EXISTS os_name text,
  ADD COLUMN IF NOT EXISTS is_mobile boolean,
  ADD COLUMN IF NOT EXISTS referrer_type text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS is_entry boolean;

CREATE INDEX IF NOT EXISTS idx_reading_sessions_locale
  ON public.reading_sessions (locale);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_device_tier
  ON public.reading_sessions (device_tier);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_country
  ON public.reading_sessions (country_code);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_referrer
  ON public.reading_sessions (referrer_type);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_slug_locale
  ON public.reading_sessions (article_slug, locale);

-- ── Make article_stats locale-aware (compound key) ────────────

ALTER TABLE public.article_stats
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'it';

ALTER TABLE public.article_stats
  DROP CONSTRAINT article_stats_pkey;

ALTER TABLE public.article_stats
  ADD PRIMARY KEY (slug, locale);

-- ── Updated RPC functions with locale parameter ───────────────

CREATE OR REPLACE FUNCTION public.increment_article_views(
  article_slug text,
  p_locale text DEFAULT 'it'
)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.article_stats (slug, locale, view_count, updated_at)
  VALUES (article_slug, p_locale, 1, now())
  ON CONFLICT (slug, locale)
  DO UPDATE SET view_count = article_stats.view_count + 1, updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_article_cta_clicks(
  article_slug text,
  p_locale text DEFAULT 'it'
)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.article_stats (slug, locale, cta_clicks, updated_at)
  VALUES (article_slug, p_locale, 1, now())
  ON CONFLICT (slug, locale)
  DO UPDATE SET cta_clicks = article_stats.cta_clicks + 1, updated_at = now();
END;
$$;
