-- Create planning table for calendar events and planning items
CREATE TABLE IF NOT EXISTS planning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'calendar_import', 'focus_session'
  google_event_id TEXT,
  location TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE planning ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own planning items" ON planning
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own planning items" ON planning
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planning items" ON planning
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planning items" ON planning
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX idx_planning_user_id ON planning(user_id);
CREATE INDEX idx_planning_start_time ON planning(start_time);
CREATE INDEX idx_planning_google_event_id ON planning(google_event_id);
CREATE INDEX idx_planning_user_date ON planning(user_id, start_time);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_planning_updated_at
  BEFORE UPDATE ON planning
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update existing integrations table if it doesn't have the right columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'refresh_token') THEN
    ALTER TABLE integrations ADD COLUMN refresh_token TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'connected_at') THEN
    ALTER TABLE integrations ADD COLUMN connected_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'expires_at') THEN
    ALTER TABLE integrations ADD COLUMN expires_at TIMESTAMPTZ;
  END IF;
END $$;
