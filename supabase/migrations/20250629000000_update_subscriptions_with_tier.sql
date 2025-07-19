-- Add subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'team', 'enterprise');

-- Update subscriptions table
ALTER TABLE public.subscriptions 
    ADD COLUMN IF NOT EXISTS tier subscription_tier NOT NULL DEFAULT 'free';

-- Grant admin access to specific email
CREATE POLICY "Admin users have full access" ON public.subscriptions
    AS RESTRICTIVE
    FOR ALL
    TO authenticated
    USING (auth.jwt()->>'email' = 'djuliusvdijk@protonmail.com');

-- Update existing pro_monthly and pro_yearly subscriptions to use tier
UPDATE public.subscriptions
SET tier = 'pro'
WHERE plan_type LIKE 'pro%';

-- Update existing team_monthly and team_yearly subscriptions to use tier
UPDATE public.subscriptions
SET tier = 'team'
WHERE plan_type LIKE 'team%';
