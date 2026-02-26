-- Create table for storing screening results
create table if not exists public.screening_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- JSONB column to store flexible answers and biomarker data
  -- Structure: { "biomarkers": { "hba1c": 5.4, ... }, "lifestyle": { ... } }
  data jsonb not null default '{}'::jsonb,
  
  -- Calculated scores
  health_score numeric,
  confidence_score numeric,
  
  -- Status of the assessment
  status text check (status in ('completed', 'partial')) default 'partial'
);

-- Enable RLS
alter table public.screening_results enable row level security;

-- Policies
create policy "Users can view their own results"
  on public.screening_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own results"
  on public.screening_results for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own results"
  on public.screening_results for update
  using (auth.uid() = user_id);
