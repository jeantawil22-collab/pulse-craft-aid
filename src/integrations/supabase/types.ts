export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          data: Json | null
          description: string | null
          expires_at: string | null
          id: string
          is_applied: boolean | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean | null
          recommendation_type: string
          title: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          data?: Json | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_applied?: boolean | null
          recommendation_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      biometric_data: {
        Row: {
          created_at: string | null
          data_type: string
          device_id: string | null
          id: string
          recorded_at: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          data_type: string
          device_id?: string | null
          id?: string
          recorded_at?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          data_type?: string
          device_id?: string | null
          id?: string
          recorded_at?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "biometric_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "wearable_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_log: {
        Row: {
          ai_analyzed: boolean | null
          created_at: string | null
          food_items: Json
          id: string
          logged_at: string | null
          macronutrients: Json | null
          meal_type: string | null
          total_calories: number | null
          user_id: string
        }
        Insert: {
          ai_analyzed?: boolean | null
          created_at?: string | null
          food_items: Json
          id?: string
          logged_at?: string | null
          macronutrients?: Json | null
          meal_type?: string | null
          total_calories?: number | null
          user_id: string
        }
        Update: {
          ai_analyzed?: boolean | null
          created_at?: string | null
          food_items?: Json
          id?: string
          logged_at?: string | null
          macronutrients?: Json | null
          meal_type?: string | null
          total_calories?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          dietary_restrictions: string[] | null
          first_name: string | null
          fitness_goals: string[] | null
          fitness_level: string | null
          height: number | null
          id: string
          last_name: string | null
          preferred_language: string | null
          timezone: string | null
          units: string | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          first_name?: string | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          height?: number | null
          id?: string
          last_name?: string | null
          preferred_language?: string | null
          timezone?: string | null
          units?: string | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          first_name?: string | null
          fitness_goals?: string[] | null
          fitness_level?: string | null
          height?: number | null
          id?: string
          last_name?: string | null
          preferred_language?: string | null
          timezone?: string | null
          units?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_description: string | null
          achievement_name: string
          achievement_type: string
          created_at: string | null
          earned_at: string | null
          id: string
          points: number | null
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_name: string
          achievement_type: string
          created_at?: string | null
          earned_at?: string | null
          id?: string
          points?: number | null
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_name?: string
          achievement_type?: string
          created_at?: string | null
          earned_at?: string | null
          id?: string
          points?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string | null
          current_value: number | null
          id: string
          metric_type: string
          progress_percentage: number | null
          recorded_at: string | null
          target_value: number | null
          unit: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          id?: string
          metric_type: string
          progress_percentage?: number | null
          recorded_at?: string | null
          target_value?: number | null
          unit?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          id?: string
          metric_type?: string
          progress_percentage?: number | null
          recorded_at?: string | null
          target_value?: number | null
          unit?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wearable_devices: {
        Row: {
          battery_level: number | null
          created_at: string | null
          device_data: Json | null
          device_name: string
          device_type: string
          id: string
          is_connected: boolean | null
          last_sync: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          battery_level?: number | null
          created_at?: string | null
          device_data?: Json | null
          device_name: string
          device_type: string
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          battery_level?: number | null
          created_at?: string | null
          device_data?: Json | null
          device_name?: string
          device_type?: string
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          ai_generated: boolean | null
          calories_burned: number | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          exercises: Json
          id: string
          intensity: string | null
          name: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          exercises: Json
          id?: string
          intensity?: string | null
          name: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          exercises?: Json
          id?: string
          intensity?: string | null
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
