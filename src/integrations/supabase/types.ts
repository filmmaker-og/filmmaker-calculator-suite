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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      intake_submissions: {
        Row: {
          id: string
          purchase_id: string | null
          user_id: string | null
          email: string
          tier: string
          includes_working_model: boolean
          status: string
          project_title: string | null
          production_company: string | null
          genre: string | null
          logline: string | null
          total_budget: number | null
          budget_currency: string
          equity_investors: Json
          debt_tranches: Json
          soft_money: Json
          deferments: Json
          distribution_model: string | null
          sa_domestic_commission_pct: number
          sa_international_commission_pct: number
          sa_expense_cap: number
          sa_domestic_commission_is_default: boolean
          sa_international_commission_is_default: boolean
          sa_expense_cap_is_default: boolean
          dp_target_platform: string | null
          dp_deal_type: string | null
          cam_fee_pct: number
          cam_fee_is_default: boolean
          distribution_fee_domestic_pct: number
          distribution_fee_international_pct: number
          distribution_fee_domestic_is_default: boolean
          distribution_fee_international_is_default: boolean
          scenario_conservative: number | null
          scenario_target: number | null
          scenario_optimistic: number | null
          current_step: number
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          purchase_id?: string | null
          user_id?: string | null
          email: string
          tier: string
          includes_working_model?: boolean
          status?: string
          project_title?: string | null
          production_company?: string | null
          genre?: string | null
          logline?: string | null
          total_budget?: number | null
          budget_currency?: string
          equity_investors?: Json
          debt_tranches?: Json
          soft_money?: Json
          deferments?: Json
          distribution_model?: string | null
          sa_domestic_commission_pct?: number
          sa_international_commission_pct?: number
          sa_expense_cap?: number
          sa_domestic_commission_is_default?: boolean
          sa_international_commission_is_default?: boolean
          sa_expense_cap_is_default?: boolean
          dp_target_platform?: string | null
          dp_deal_type?: string | null
          cam_fee_pct?: number
          cam_fee_is_default?: boolean
          distribution_fee_domestic_pct?: number
          distribution_fee_international_pct?: number
          distribution_fee_domestic_is_default?: boolean
          distribution_fee_international_is_default?: boolean
          scenario_conservative?: number | null
          scenario_target?: number | null
          scenario_optimistic?: number | null
          current_step?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          purchase_id?: string | null
          user_id?: string | null
          email?: string
          tier?: string
          includes_working_model?: boolean
          status?: string
          project_title?: string | null
          production_company?: string | null
          genre?: string | null
          logline?: string | null
          total_budget?: number | null
          budget_currency?: string
          equity_investors?: Json
          debt_tranches?: Json
          soft_money?: Json
          deferments?: Json
          distribution_model?: string | null
          sa_domestic_commission_pct?: number
          sa_international_commission_pct?: number
          sa_expense_cap?: number
          sa_domestic_commission_is_default?: boolean
          sa_international_commission_is_default?: boolean
          sa_expense_cap_is_default?: boolean
          dp_target_platform?: string | null
          dp_deal_type?: string | null
          cam_fee_pct?: number
          cam_fee_is_default?: boolean
          distribution_fee_domestic_pct?: number
          distribution_fee_international_pct?: number
          distribution_fee_domestic_is_default?: boolean
          distribution_fee_international_is_default?: boolean
          scenario_conservative?: number | null
          scenario_target?: number | null
          scenario_optimistic?: number | null
          current_step?: number
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "intake_submissions_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      exports: {
        Row: {
          calculator_inputs: Json
          created_at: string | null
          export_type: string
          id: string
          purchase_id: string | null
          user_id: string | null
        }
        Insert: {
          calculator_inputs: Json
          created_at?: string | null
          export_type: string
          id?: string
          purchase_id?: string | null
          user_id?: string | null
        }
        Update: {
          calculator_inputs?: Json
          created_at?: string | null
          export_type?: string
          id?: string
          purchase_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exports_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          access_expires_at: string | null
          amount_paid: number
          created_at: string | null
          currency: string | null
          email: string
          id: string
          product_id: string
          product_name: string
          status: string | null
          stripe_payment_intent: string | null
          stripe_session_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_expires_at?: string | null
          amount_paid: number
          created_at?: string | null
          currency?: string | null
          email: string
          id?: string
          product_id: string
          product_name: string
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_expires_at?: string | null
          amount_paid?: number
          created_at?: string | null
          currency?: string | null
          email?: string
          id?: string
          product_id?: string
          product_name?: string
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saved_calculations: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_service_role: { Args: never; Returns: boolean }
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
