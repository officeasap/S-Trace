
CREATE TABLE IF NOT EXISTS public.tracking_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT UNIQUE NOT NULL,
  front_image_url TEXT NOT NULL,
  back_image_url TEXT NOT NULL,
  sorting_location TEXT,
  departure_location TEXT,
  status TEXT DEFAULT 'Sorting',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

GRANT SELECT ON public.tracking_cards TO anon, authenticated;
GRANT ALL ON public.tracking_cards TO service_role;

ALTER TABLE public.tracking_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tracking cards"
  ON public.tracking_cards FOR SELECT
  USING (true);

INSERT INTO public.tracking_cards (
  tracking_code, front_image_url, back_image_url,
  sorting_location, departure_location, status
) VALUES (
  'AU-Y0312J9',
  '/image1.svg',
  '/image2.svg',
  'Addis Ababa Sorting Center',
  'Bole | Addis Ababa',
  'Sorting'
) ON CONFLICT (tracking_code) DO NOTHING;
