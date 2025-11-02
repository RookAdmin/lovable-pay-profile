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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      paym_reminders: {
        Row: {
          channel: string
          created_at: string
          id: string
          paym_id: string
          recipient: string
          scheduled_at: string
          sent_at: string | null
          status: string
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          paym_id: string
          recipient: string
          scheduled_at: string
          sent_at?: string | null
          status: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          paym_id?: string
          recipient?: string
          scheduled_at?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "paym_reminders_paym_id_fkey"
            columns: ["paym_id"]
            isOneToOne: false
            referencedRelation: "payms"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          profile_id: string
          qr_code_url: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          profile_id: string
          qr_code_url?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          profile_id?: string
          qr_code_url?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payms: {
        Row: {
          amount: number
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          invoice_app: string | null
          invoice_id: string | null
          is_paid: boolean
          last_reminder_sent: string | null
          metadata: Json | null
          profile_id: string
          reminder_enabled: boolean
          title: string
          unique_link: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          invoice_app?: string | null
          invoice_id?: string | null
          is_paid?: boolean
          last_reminder_sent?: string | null
          metadata?: Json | null
          profile_id: string
          reminder_enabled?: boolean
          title: string
          unique_link: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          invoice_app?: string | null
          invoice_id?: string | null
          is_paid?: boolean
          last_reminder_sent?: string | null
          metadata?: Json | null
          profile_id?: string
          reminder_enabled?: boolean
          title?: string
          unique_link?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payms_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_pin_audit: {
        Row: {
          attempt_ip: string | null
          attempt_success: boolean
          attempt_user_agent: string | null
          created_at: string | null
          id: string
          profile_id: string
        }
        Insert: {
          attempt_ip?: string | null
          attempt_success: boolean
          attempt_user_agent?: string | null
          created_at?: string | null
          id?: string
          profile_id: string
        }
        Update: {
          attempt_ip?: string | null
          attempt_success?: boolean
          attempt_user_agent?: string | null
          created_at?: string | null
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_pin_audit_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          amazon_store_username: string | null
          apple_music_username: string | null
          avatar_url: string | null
          behance_username: string | null
          bio: string | null
          bluesky_handle: string | null
          created_at: string
          discord_username: string | null
          display_name: string | null
          dribbble_username: string | null
          etsy_shop_username: string | null
          facebook_username: string | null
          first_name: string | null
          github_username: string | null
          goodreads_username: string | null
          id: string
          instagram_url: string | null
          is_verified: boolean | null
          last_name: string | null
          letterboxd_username: string | null
          linkedin_company_username: string | null
          linkedin_person_username: string | null
          linkedin_url: string | null
          mastodon_username: string | null
          medium_username: string | null
          patreon_username: string | null
          paypal_me_username: string | null
          pinterest_username: string | null
          producthunt_username: string | null
          profile_pin_enabled: boolean | null
          profile_pin_hash: string | null
          qq_username: string | null
          quora_username: string | null
          reddit_username: string | null
          rumble_username: string | null
          snapchat_username: string | null
          soundcloud_username: string | null
          spotify_username: string | null
          telegram_username: string | null
          threads_username: string | null
          tiktok_username: string | null
          tumblr_username: string | null
          twitch_username: string | null
          twitter_url: string | null
          updated_at: string
          upi_id: string | null
          username: string
          username_updated_at: string | null
          vimeo_username: string | null
          website_url: string | null
          wechat_username: string | null
          whatsapp_number: string | null
          youtube_username: string | null
        }
        Insert: {
          amazon_store_username?: string | null
          apple_music_username?: string | null
          avatar_url?: string | null
          behance_username?: string | null
          bio?: string | null
          bluesky_handle?: string | null
          created_at?: string
          discord_username?: string | null
          display_name?: string | null
          dribbble_username?: string | null
          etsy_shop_username?: string | null
          facebook_username?: string | null
          first_name?: string | null
          github_username?: string | null
          goodreads_username?: string | null
          id: string
          instagram_url?: string | null
          is_verified?: boolean | null
          last_name?: string | null
          letterboxd_username?: string | null
          linkedin_company_username?: string | null
          linkedin_person_username?: string | null
          linkedin_url?: string | null
          mastodon_username?: string | null
          medium_username?: string | null
          patreon_username?: string | null
          paypal_me_username?: string | null
          pinterest_username?: string | null
          producthunt_username?: string | null
          profile_pin_enabled?: boolean | null
          profile_pin_hash?: string | null
          qq_username?: string | null
          quora_username?: string | null
          reddit_username?: string | null
          rumble_username?: string | null
          snapchat_username?: string | null
          soundcloud_username?: string | null
          spotify_username?: string | null
          telegram_username?: string | null
          threads_username?: string | null
          tiktok_username?: string | null
          tumblr_username?: string | null
          twitch_username?: string | null
          twitter_url?: string | null
          updated_at?: string
          upi_id?: string | null
          username: string
          username_updated_at?: string | null
          vimeo_username?: string | null
          website_url?: string | null
          wechat_username?: string | null
          whatsapp_number?: string | null
          youtube_username?: string | null
        }
        Update: {
          amazon_store_username?: string | null
          apple_music_username?: string | null
          avatar_url?: string | null
          behance_username?: string | null
          bio?: string | null
          bluesky_handle?: string | null
          created_at?: string
          discord_username?: string | null
          display_name?: string | null
          dribbble_username?: string | null
          etsy_shop_username?: string | null
          facebook_username?: string | null
          first_name?: string | null
          github_username?: string | null
          goodreads_username?: string | null
          id?: string
          instagram_url?: string | null
          is_verified?: boolean | null
          last_name?: string | null
          letterboxd_username?: string | null
          linkedin_company_username?: string | null
          linkedin_person_username?: string | null
          linkedin_url?: string | null
          mastodon_username?: string | null
          medium_username?: string | null
          patreon_username?: string | null
          paypal_me_username?: string | null
          pinterest_username?: string | null
          producthunt_username?: string | null
          profile_pin_enabled?: boolean | null
          profile_pin_hash?: string | null
          qq_username?: string | null
          quora_username?: string | null
          reddit_username?: string | null
          rumble_username?: string | null
          snapchat_username?: string | null
          soundcloud_username?: string | null
          spotify_username?: string | null
          telegram_username?: string | null
          threads_username?: string | null
          tiktok_username?: string | null
          tumblr_username?: string | null
          twitch_username?: string | null
          twitter_url?: string | null
          updated_at?: string
          upi_id?: string | null
          username?: string
          username_updated_at?: string | null
          vimeo_username?: string | null
          website_url?: string | null
          wechat_username?: string | null
          whatsapp_number?: string | null
          youtube_username?: string | null
        }
        Relationships: []
      }
      smart_links: {
        Row: {
          amount: number | null
          created_at: string
          currency: string
          gradient: boolean | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          profile_id: string
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string
          gradient?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          profile_id: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string
          gradient?: boolean | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          profile_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_gateway: string
          profile_id: string
          status: string
          transaction_date: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_gateway: string
          profile_id: string
          status: string
          transaction_date?: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_gateway?: string
          profile_id?: string
          status?: string
          transaction_date?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          notification_preferences: Json | null
          tfa_enabled: boolean
          time_zone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          tfa_enabled?: boolean
          time_zone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          tfa_enabled?: boolean
          time_zone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          referrer: string | null
          smart_link_id: string | null
          visitor_ip: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          referrer?: string | null
          smart_link_id?: string | null
          visitor_ip?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          referrer?: string | null
          smart_link_id?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_smart_link_id_fkey"
            columns: ["smart_link_id"]
            isOneToOne: false
            referencedRelation: "smart_links"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_random_pin: { Args: never; Returns: string }
      hash_pin: { Args: { pin: string }; Returns: string }
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
