-- Fix integrations table to reference auth.users instead of profiles
-- and ensure RLS policies work correctly

DO $$
BEGIN
  -- Check if the integrations table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'integrations' AND table_schema = 'public') THEN
    
    -- Drop the existing foreign key constraint if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'integrations_user_id_fkey' 
      AND table_name = 'integrations'
    ) THEN
      ALTER TABLE public.integrations DROP CONSTRAINT integrations_user_id_fkey;
    END IF;
    
    -- Add the correct foreign key constraint to auth.users
    ALTER TABLE public.integrations 
    ADD CONSTRAINT integrations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- Update the RLS policy to be more explicit
    DROP POLICY IF EXISTS "Users can manage their own integrations" ON public.integrations;
    
    CREATE POLICY "Users can view their own integrations" ON public.integrations
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert their own integrations" ON public.integrations
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update their own integrations" ON public.integrations
      FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete their own integrations" ON public.integrations
      FOR DELETE USING (auth.uid() = user_id);
    
  ELSE
    -- Create integrations table if it doesn't exist
    CREATE TABLE public.integrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      integration_type TEXT NOT NULL CHECK (integration_type IN ('google_calendar', 'outlook', 'teams', 'slack', 'microsoft_calendar')),
      access_token TEXT,
      refresh_token TEXT,
      expires_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN DEFAULT true,
      settings JSONB,
      connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, integration_type)
    );
    
    -- Enable RLS
    ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    CREATE POLICY "Users can view their own integrations" ON public.integrations
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert their own integrations" ON public.integrations
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update their own integrations" ON public.integrations
      FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete their own integrations" ON public.integrations
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
  
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON public.integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_user_type ON public.integrations(user_id, integration_type);
CREATE INDEX IF NOT EXISTS idx_integrations_active ON public.integrations(user_id, is_active);
