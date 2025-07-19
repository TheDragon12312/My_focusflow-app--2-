
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwgnlsrqnyugloobrsxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3Z25sc3Jxbnl1Z2xvb2Jyc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTkzNTMsImV4cCI6MjA2NjAzNTM1M30.adv-UqRZ2lLI9cjABwMCORhugtP2-vJEMWJYnLvk1Q8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
