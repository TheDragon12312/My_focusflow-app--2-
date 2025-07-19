export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null;
          criteria: Json | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          points: number | null;
        };
        Insert: {
          created_at?: string | null;
          criteria?: Json | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          points?: number | null;
        };
        Update: {
          created_at?: string | null;
          criteria?: Json | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          points?: number | null;
        };
        Relationships: [];
      };
      daily_stats: {
        Row: {
          completed_focus_blocks: number | null;
          created_at: string | null;
          date: string;
          distraction_count: number | null;
          distraction_time: number | null;
          focus_score: number | null;
          id: string;
          mood_notes: string | null;
          mood_rating: number | null;
          total_focus_time: number | null;
          user_id: string;
        };
        Insert: {
          completed_focus_blocks?: number | null;
          created_at?: string | null;
          date: string;
          distraction_count?: number | null;
          distraction_time?: number | null;
          focus_score?: number | null;
          id?: string;
          mood_notes?: string | null;
          mood_rating?: number | null;
          total_focus_time?: number | null;
          user_id: string;
        };
        Update: {
          completed_focus_blocks?: number | null;
          created_at?: string | null;
          date?: string;
          distraction_count?: number | null;
          distraction_time?: number | null;
          focus_score?: number | null;
          id?: string;
          mood_notes?: string | null;
          mood_rating?: number | null;
          total_focus_time?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_stats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      distractions: {
        Row: {
          app_name: string;
          category: string | null;
          detected_at: string | null;
          duration: number;
          focus_block_id: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          app_name: string;
          category?: string | null;
          detected_at?: string | null;
          duration: number;
          focus_block_id?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          app_name?: string;
          category?: string | null;
          detected_at?: string | null;
          duration?: number;
          focus_block_id?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "distractions_focus_block_id_fkey";
            columns: ["focus_block_id"];
            isOneToOne: false;
            referencedRelation: "focus_blocks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "distractions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      focus_blocks: {
        Row: {
          actual_duration: number | null;
          block_type: string;
          created_at: string | null;
          duration: number;
          end_time: string | null;
          id: string;
          notes: string | null;
          start_time: string | null;
          status: string | null;
          task_id: string | null;
          user_id: string;
        };
        Insert: {
          actual_duration?: number | null;
          block_type: string;
          created_at?: string | null;
          duration: number;
          end_time?: string | null;
          id?: string;
          notes?: string | null;
          start_time?: string | null;
          status?: string | null;
          task_id?: string | null;
          user_id: string;
        };
        Update: {
          actual_duration?: number | null;
          block_type?: string;
          created_at?: string | null;
          duration?: number;
          end_time?: string | null;
          id?: string;
          notes?: string | null;
          start_time?: string | null;
          status?: string | null;
          task_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "focus_blocks_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "focus_blocks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      friendships: {
        Row: {
          addressee_id: string;
          created_at: string | null;
          id: string;
          requester_id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          addressee_id: string;
          created_at?: string | null;
          id?: string;
          requester_id: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          addressee_id?: string;
          created_at?: string | null;
          id?: string;
          requester_id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      integrations: {
        Row: {
          access_token: string | null;
          created_at: string | null;
          expires_at: string | null;
          id: string;
          integration_type: string;
          is_active: boolean | null;
          refresh_token: string | null;
          settings: Json | null;
          user_id: string;
        };
        Insert: {
          access_token?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          integration_type: string;
          is_active?: boolean | null;
          refresh_token?: string | null;
          settings?: Json | null;
          user_id: string;
        };
        Update: {
          access_token?: string | null;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          integration_type?: string;
          is_active?: boolean | null;
          refresh_token?: string | null;
          settings?: Json | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "integrations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          is_admin: boolean | null;
          plan: string | null;
          subscription_expires_at: string | null;
          subscription_id: string | null;
          subscription_status: string | null;
          subscription_type: string | null;
          team_id: string | null;
          trial_ends_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email: string;
          full_name: string;
          id: string;
          is_admin?: boolean | null;
          plan?: string | null;
          subscription_expires_at?: string | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          subscription_type?: string | null;
          team_id?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          is_admin?: boolean | null;
          plan?: string | null;
          subscription_expires_at?: string | null;
          subscription_id?: string | null;
          subscription_status?: string | null;
          subscription_type?: string | null;
          team_id?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_profiles_team";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      session_participants: {
        Row: {
          id: string;
          joined_at: string | null;
          session_id: string;
          status: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string | null;
          session_id: string;
          status?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string | null;
          session_id?: string;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "shared_focus_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      shared_focus_sessions: {
        Row: {
          created_at: string | null;
          created_by: string;
          description: string | null;
          duration: number;
          id: string;
          name: string;
          start_time: string;
          status: string | null;
          team_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          description?: string | null;
          duration: number;
          id?: string;
          name: string;
          start_time: string;
          status?: string | null;
          team_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          description?: string | null;
          duration?: number;
          id?: string;
          name?: string;
          start_time?: string;
          status?: string | null;
          team_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shared_focus_sessions_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          created_at: string | null;
          expires_at: string | null;
          id: string;
          paddle_subscription_id: string | null;
          plan_type: string;
          started_at: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          paddle_subscription_id?: string | null;
          plan_type: string;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          paddle_subscription_id?: string | null;
          plan_type?: string;
          started_at?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          created_at: string | null;
          description: string | null;
          estimated_duration: number;
          id: string;
          priority: number | null;
          scheduled_date: string | null;
          status: string | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          estimated_duration: number;
          id?: string;
          priority?: number | null;
          scheduled_date?: string | null;
          status?: string | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          estimated_duration?: number;
          id?: string;
          priority?: number | null;
          scheduled_date?: string | null;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      team_challenges: {
        Row: {
          challenge_type: string;
          created_at: string | null;
          current_value: number | null;
          description: string | null;
          end_date: string;
          id: string;
          name: string;
          reward_points: number | null;
          start_date: string;
          status: string | null;
          target_value: number;
          team_id: string;
        };
        Insert: {
          challenge_type: string;
          created_at?: string | null;
          current_value?: number | null;
          description?: string | null;
          end_date: string;
          id?: string;
          name: string;
          reward_points?: number | null;
          start_date: string;
          status?: string | null;
          target_value: number;
          team_id: string;
        };
        Update: {
          challenge_type?: string;
          created_at?: string | null;
          current_value?: number | null;
          description?: string | null;
          end_date?: string;
          id?: string;
          name?: string;
          reward_points?: number | null;
          start_date?: string;
          status?: string | null;
          target_value?: number;
          team_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_challenges_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      team_invitations: {
        Row: {
          created_at: string | null;
          email: string;
          expires_at: string | null;
          id: string;
          inviter_id: string;
          status: string | null;
          team_id: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          expires_at?: string | null;
          id?: string;
          inviter_id: string;
          status?: string | null;
          team_id: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          expires_at?: string | null;
          id?: string;
          inviter_id?: string;
          status?: string | null;
          team_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      team_memberships: {
        Row: {
          id: string;
          joined_at: string | null;
          role: string | null;
          team_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string | null;
          role?: string | null;
          team_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string | null;
          role?: string | null;
          team_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_memberships_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      team_sessions: {
        Row: {
          created_at: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          owner_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          owner_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          owner_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_badges: {
        Row: {
          badge_id: string;
          earned_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          badge_id: string;
          earned_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          badge_id?: string;
          earned_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_badges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_daily_stats: {
        Args: { p_user_id: string; p_date?: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
