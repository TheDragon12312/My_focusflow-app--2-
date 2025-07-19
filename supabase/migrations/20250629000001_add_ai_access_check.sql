-- Create function to check AI feature access
CREATE OR REPLACE FUNCTION check_ai_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email text;
    user_subscription record;
BEGIN
    -- Get the current user's email
    SELECT email INTO user_email 
    FROM auth.users 
    WHERE id = auth.uid();

    -- Admin access for specific email
    IF user_email = 'djuliusvdijk@protonmail.com' THEN
        RETURN true;
    END IF;

    -- Check user's subscription
    SELECT * INTO user_subscription 
    FROM public.subscriptions 
    WHERE user_id = auth.uid() 
    AND status = 'active' 
    AND current_period_end > now();

    -- If no active subscription found, return false
    IF user_subscription IS NULL THEN
        RETURN false;
    END IF;

    -- Check if subscription tier includes AI features
    RETURN user_subscription.tier IN ('pro', 'team', 'enterprise');
END;
$$;
