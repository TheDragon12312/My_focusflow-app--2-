export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
          subscription_type?: string;
          team_id?: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
          subscription_type?: string;
          team_id?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
          subscription_type?: string;
          team_id?: string;
        };
      };
      daily_stats: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          focus_score: number;
          completed_focus_blocks: number;
          total_focus_time: number;
          distraction_count: number;
          distraction_time: number;
          mood_rating?: number;
          mood_notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          focus_score?: number;
          completed_focus_blocks?: number;
          total_focus_time?: number;
          distraction_count?: number;
          distraction_time?: number;
          mood_rating?: number;
          mood_notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          focus_score?: number;
          completed_focus_blocks?: number;
          total_focus_time?: number;
          distraction_count?: number;
          distraction_time?: number;
          mood_rating?: number;
          mood_notes?: string;
          created_at?: string;
        };
      };
      integrations: {
        Row: {
          id: string;
          user_id: string;
          integration_type: string;
          access_token: string;
          refresh_token?: string;
          expires_at?: string;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          integration_type: string;
          access_token: string;
          refresh_token?: string;
          expires_at?: string;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          integration_type?: string;
          access_token?: string;
          refresh_token?: string;
          expires_at?: string;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      // NIEUW: Voeg de planning table toe
      planning: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          start_time: string;
          end_time: string;
          event_type: string;
          google_event_id?: string;
          location?: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          start_time: string;
          end_time: string;
          event_type: string;
          google_event_id?: string;
          location?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          start_time?: string;
          end_time?: string;
          event_type?: string;
          google_event_id?: string;
          location?: string;
          status?: string;
          created_at?: string;
        };
      };
      // ... andere tables (badges, focus_blocks, tasks, etc.)
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          criteria: Json;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          criteria: Json;
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          criteria?: Json;
          points?: number;
          created_at?: string;
        };
      };
      focus_blocks: {
        Row: {
          id: string;
          user_id: string;
          block_type: string;
          duration: number;
          start_time?: string;
          end_time?: string;
          notes?: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          block_type: string;
          duration: number;
          start_time?: string;
          end_time?: string;
          notes?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          block_type?: string;
          duration?: number;
          start_time?: string;
          end_time?: string;
          notes?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          due_date?: string;
          priority: string;
          status: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          due_date?: string;
          priority?: string;
          status?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          due_date?: string;
          priority?: string;
          status?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      distractions: {
        Row: {
          id: string;
          user_id: string;
          focus_block_id?: string;
          distraction_type: string;
          description?: string;
          duration: number;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          focus_block_id?: string;
          distraction_type: string;
          description?: string;
          duration: number;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          focus_block_id?: string;
          distraction_type?: string;
          description?: string;
          duration?: number;
          timestamp?: string;
          created_at?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description?: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      shared_focus_sessions: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          joined_at: string;
          left_at?: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          joined_at?: string;
          left_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          joined_at?: string;
          left_at?: string;
          is_active?: boolean;
        };
      };
      session_participants: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          role: string;
          joined_at: string;
          left_at?: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
          left_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
          left_at?: string;
          is_active?: boolean;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
          progress: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
          progress?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          earned_at?: string;
          progress?: number;
        };
      };
      productivity_coach_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: string;
          content: Json;
          feedback: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: string;
          content: Json;
          feedback?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: string;
          content?: Json;
          feedback?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
