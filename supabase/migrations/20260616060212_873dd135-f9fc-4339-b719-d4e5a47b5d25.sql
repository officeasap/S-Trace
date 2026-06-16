CREATE TABLE public.email_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_code text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (tracking_code, email)
);
GRANT INSERT ON public.email_subscriptions TO anon, authenticated;
GRANT ALL ON public.email_subscriptions TO service_role;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.email_subscriptions FOR INSERT TO anon, authenticated WITH CHECK (true);