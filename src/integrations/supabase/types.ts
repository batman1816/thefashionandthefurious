export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      announcement_banner: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          text?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          button_link: string | null
          button_text: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean
          media_type: string | null
          title: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          media_type?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          media_type?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      bundle_deals: {
        Row: {
          applicable_categories: string[] | null
          created_at: string
          deal_type: string
          description: string | null
          discount_percentage: number
          end_date: string | null
          id: string
          is_active: boolean
          max_discount_items: number | null
          minimum_quantity: number
          name: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          applicable_categories?: string[] | null
          created_at?: string
          deal_type?: string
          description?: string | null
          discount_percentage?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_discount_items?: number | null
          minimum_quantity?: number
          name: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          applicable_categories?: string[] | null
          created_at?: string
          deal_type?: string
          description?: string | null
          discount_percentage?: number
          end_date?: string | null
          id?: string
          is_active?: boolean
          max_discount_items?: number | null
          minimum_quantity?: number
          name?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          bkash_sender_number: string | null
          bkash_transaction_id: string | null
          created_at: string
          customer_address: string
          customer_city: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_zip_code: string
          id: string
          items: Json
          shipping_cost: number
          shipping_option: string
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          bkash_sender_number?: string | null
          bkash_transaction_id?: string | null
          created_at?: string
          customer_address: string
          customer_city: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_zip_code: string
          id: string
          items: Json
          shipping_cost?: number
          shipping_option?: string
          status?: string
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          bkash_sender_number?: string | null
          bkash_transaction_id?: string | null
          created_at?: string
          customer_address?: string
          customer_city?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          customer_zip_code?: string
          id?: string
          items?: Json
          shipping_cost?: number
          shipping_option?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          color_variants: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean
          main_image: string | null
          name: string
          price: number
          size_pricing: Json | null
          size_variants: Json | null
          sizes: string[]
          slug: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          color_variants?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          main_image?: string | null
          name: string
          price: number
          size_pricing?: Json | null
          size_variants?: Json | null
          sizes?: string[]
          slug?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          color_variants?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          main_image?: string | null
          name?: string
          price?: number
          size_pricing?: Json | null
          size_variants?: Json | null
          sizes?: string[]
          slug?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          original_price: number
          product_id: string | null
          sale_description: string | null
          sale_price: number
          sale_title: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          original_price: number
          product_id?: string | null
          sale_description?: string | null
          sale_price: number
          sale_title?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          original_price?: number
          product_id?: string | null
          sale_description?: string | null
          sale_price?: number
          sale_title?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_settings: {
        Row: {
          created_at: string
          global_sale_active: boolean
          global_sale_end: string | null
          global_sale_start: string | null
          global_sale_title: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          global_sale_active?: boolean
          global_sale_end?: string | null
          global_sale_start?: string | null
          global_sale_title?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          global_sale_active?: boolean
          global_sale_end?: string | null
          global_sale_start?: string | null
          global_sale_title?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string
          created_at: string
          id: string
          logo_url: string | null
          next_sale_date: string | null
          next_sale_title: string | null
          show_sale_countdown: boolean | null
          site_name: string
          support_email: string
          total_orders: number | null
          total_revenue: number | null
          total_visitors: number | null
          updated_at: string
        }
        Insert: {
          contact_email?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          next_sale_date?: string | null
          next_sale_title?: string | null
          show_sale_countdown?: boolean | null
          site_name?: string
          support_email?: string
          total_orders?: number | null
          total_revenue?: number | null
          total_visitors?: number | null
          updated_at?: string
        }
        Update: {
          contact_email?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          next_sale_date?: string | null
          next_sale_title?: string | null
          show_sale_countdown?: boolean | null
          site_name?: string
          support_email?: string
          total_orders?: number | null
          total_revenue?: number | null
          total_visitors?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { input_text: string }
        Returns: string
      }
      update_expired_sales: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_product_slug: {
        Args: { p_product_id: number; p_new_name: string }
        Returns: undefined
      }
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
