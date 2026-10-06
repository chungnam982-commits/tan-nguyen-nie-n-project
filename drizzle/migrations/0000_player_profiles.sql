CREATE TABLE public.player_profiles (
  user_id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT 'LUCIEN ARCLIGHT',
  bio text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.player_profiles TO authenticated;
GRANT ALL ON public.player_profiles TO service_role;
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players read own profile" ON public.player_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Players insert own profile" ON public.player_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Players update own profile" ON public.player_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);