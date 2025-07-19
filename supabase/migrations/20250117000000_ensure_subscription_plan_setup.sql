-- Ensure subscription plan and admin fields are properly set up
-- This migration ensures the profiles table has all necessary subscription fields

-- Add columns if they don't exist (safe to run multiple times)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team'));

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS subscription_id TEXT;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trial'));

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Ensure the primary admin is always set
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE id IN (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'djuliusvdijk@protonmail.com'
);

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);

-- Update the user creation trigger to set admin status automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, is_admin, plan)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    -- Make djuliusvdijk@protonmail.com admin automatically
    CASE WHEN NEW.email = 'djuliusvdijk@protonmail.com' THEN TRUE ELSE FALSE END,
    'free' -- Default plan for new users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user plan (to be called by Paddle webhook)
CREATE OR REPLACE FUNCTION public.update_user_plan(
  user_email TEXT,
  new_plan TEXT,
  paddle_subscription_id TEXT DEFAULT NULL,
  expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    plan = new_plan,
    subscription_id = COALESCE(paddle_subscription_id, subscription_id),
    subscription_expires_at = expires_at,
    subscription_status = 'active',
    updated_at = NOW()
  WHERE id IN (
    SELECT au.id 
    FROM auth.users au 
    WHERE au.email = user_email
  );
  
  RETURN FOUND;
END;
$$;

-- Function to cancel user subscription
CREATE OR REPLACE FUNCTION public.cancel_user_subscription(
  user_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    plan = 'free',
    subscription_status = 'cancelled',
    updated_at = NOW()
  WHERE id IN (
    SELECT au.id 
    FROM auth.users au 
    WHERE au.email = user_email
  );
  
  RETURN FOUND;
END;
$$;

-- Grant necessary permissions for the functions
GRANT EXECUTE ON FUNCTION public.update_user_plan TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_user_subscription TO authenticated;
