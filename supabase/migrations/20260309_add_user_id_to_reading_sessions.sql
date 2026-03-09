ALTER TABLE public.reading_sessions
  ADD COLUMN IF NOT EXISTS user_id uuid;

CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id
  ON public.reading_sessions (user_id);
