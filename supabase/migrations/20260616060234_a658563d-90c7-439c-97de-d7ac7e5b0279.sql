DROP POLICY "Anyone can subscribe" ON public.email_subscriptions;
CREATE POLICY "Anyone can subscribe with valid email" ON public.email_subscriptions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(tracking_code) BETWEEN 3 AND 64
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(email) <= 254
  );