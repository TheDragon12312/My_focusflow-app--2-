
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
  team_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for team_id in profiles
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_team 
  FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration INTEGER NOT NULL, -- in minutes
  priority INTEGER DEFAULT 1 CHECK (priority IN (1, 2, 3)), -- 1=low, 2=medium, 3=high
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  scheduled_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create focus blocks table
CREATE TABLE public.focus_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('focus', 'break')),
  duration INTEGER NOT NULL, -- in minutes
  actual_duration INTEGER, -- actual time spent
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'paused', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily stats table
CREATE TABLE public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  focus_score INTEGER DEFAULT 0 CHECK (focus_score >= 0 AND focus_score <= 100),
  completed_focus_blocks INTEGER DEFAULT 0,
  total_focus_time INTEGER DEFAULT 0, -- in minutes
  distraction_count INTEGER DEFAULT 0,
  distraction_time INTEGER DEFAULT 0, -- in minutes
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  mood_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create distractions table
CREATE TABLE public.distractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  app_name TEXT NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN ('social_media', 'news', 'games', 'entertainment', 'other')),
  duration INTEGER NOT NULL, -- in seconds
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  focus_block_id UUID REFERENCES public.focus_blocks(id) ON DELETE SET NULL
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  criteria JSONB, -- conditions to earn the badge
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user badges table (many-to-many)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create team challenges table
CREATE TABLE public.team_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('focus_time', 'completed_tasks', 'team_focus_score')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reward_points INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integrations table
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('google_calendar', 'outlook', 'teams', 'slack')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, integration_type)
);

-- Insert some initial badges
INSERT INTO public.badges (name, description, icon, criteria, points) VALUES
('First Focus', 'Complete your first focus block', '🎯', '{"completed_focus_blocks": 1}', 10),
('Focus Streak', 'Complete 5 focus blocks in a row', '🔥', '{"focus_streak": 5}', 25),
('Daily Champion', 'Achieve 100% focus score for a day', '👑', '{"daily_focus_score": 100}', 50),
('Week Warrior', 'Complete all planned tasks for a week', '⚔️', '{"weekly_completion": 100}', 100),
('Zen Master', 'Complete 50 break sessions', '🧘', '{"completed_breaks": 50}', 75);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for tasks
CREATE POLICY "Users can manage their own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for focus_blocks
CREATE POLICY "Users can manage their own focus blocks" ON public.focus_blocks
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for daily_stats
CREATE POLICY "Users can manage their own stats" ON public.daily_stats
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for distractions
CREATE POLICY "Users can manage their own distractions" ON public.distractions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for badges (read-only for all authenticated users)
CREATE POLICY "All users can view badges" ON public.badges
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for teams
CREATE POLICY "Team members can view their team" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.team_id = teams.id
    )
  );

-- RLS Policies for team_challenges
CREATE POLICY "Team members can view team challenges" ON public.team_challenges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.team_id = team_challenges.team_id
    )
  );

-- RLS Policies for integrations
CREATE POLICY "Users can manage their own integrations" ON public.integrations
  FOR ALL USING (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update daily stats
CREATE OR REPLACE FUNCTION public.update_daily_stats(
  p_user_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
DECLARE
  completed_blocks INTEGER;
  total_time INTEGER;
  distraction_cnt INTEGER;
  distraction_time_total INTEGER;
  calculated_score INTEGER;
BEGIN
  -- Calculate completed focus blocks for the day
  SELECT COUNT(*), COALESCE(SUM(actual_duration), 0)
  INTO completed_blocks, total_time
  FROM public.focus_blocks
  WHERE user_id = p_user_id 
    AND block_type = 'focus'
    AND status = 'completed'
    AND DATE(start_time) = p_date;

  -- Calculate distractions
  SELECT COUNT(*), COALESCE(SUM(duration/60), 0)
  INTO distraction_cnt, distraction_time_total
  FROM public.distractions
  WHERE user_id = p_user_id 
    AND DATE(detected_at) = p_date;

  -- Calculate focus score (simple formula)
  IF total_time > 0 THEN
    calculated_score := GREATEST(0, LEAST(100, 
      (total_time * 100 / (total_time + distraction_time_total))::INTEGER
    ));
  ELSE
    calculated_score := 0;
  END IF;

  -- Insert or update daily stats
  INSERT INTO public.daily_stats (
    user_id, date, focus_score, completed_focus_blocks, 
    total_focus_time, distraction_count, distraction_time
  )
  VALUES (
    p_user_id, p_date, calculated_score, completed_blocks,
    total_time, distraction_cnt, distraction_time_total
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    focus_score = EXCLUDED.focus_score,
    completed_focus_blocks = EXCLUDED.completed_focus_blocks,
    total_focus_time = EXCLUDED.total_focus_time,
    distraction_count = EXCLUDED.distraction_count,
    distraction_time = EXCLUDED.distraction_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
