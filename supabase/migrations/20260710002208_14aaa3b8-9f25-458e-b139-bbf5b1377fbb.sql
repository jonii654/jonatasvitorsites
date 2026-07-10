
DROP POLICY IF EXISTS "Allow anonymous event inserts" ON public.analytics_events;

CREATE POLICY "Allow validated anonymous event inserts"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_type IN ('cta_click', 'page_view', 'form_submit')
  AND length(cta_location) BETWEEN 1 AND 100
  AND length(page_path) BETWEEN 1 AND 200
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);
