CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL DEFAULT 'cta_click',
  cta_location TEXT NOT NULL,
  page_path TEXT NOT NULL DEFAULT '/',
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (anonymous tracking)
CREATE POLICY "Allow anonymous event inserts" 
ON public.analytics_events 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- No direct select from frontend (data stays private)
CREATE POLICY "Restrict direct reads" 
ON public.analytics_events 
FOR SELECT 
TO anon, authenticated 
USING (false);