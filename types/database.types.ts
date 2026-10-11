// Auto-generated Supabase types — run `npx supabase gen types typescript` to regenerate.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: "client" | "landlord" | "agent" | "admin";
          verification_status: "unverified" | "pending" | "verified" | "rejected";
          role_metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role: "client" | "landlord" | "agent" | "admin";
          verification_status?: "unverified" | "pending" | "verified" | "rejected";
          role_metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      property_listings: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          status: string;
          price: number;
          price_period: string;
          bedrooms: number;
          bathrooms: number;
          area_sqft: number | null;
          images: Json;
          location: Json;
          amenities: string[];
          is_verified: boolean;
          is_featured: boolean;
          owner_id: string;
          owner_type: string;
          agent_id: string | null;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["property_listings"]["Row"], "id" | "created_at" | "updated_at" | "views_count"> & {
          id?: string;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["property_listings"]["Insert"]>;
      };
      saved_properties: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_properties"]["Row"], "id" | "created_at">;
        Update: never;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          property_id: string | null;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "id" | "created_at" | "read"> & { read?: boolean };
        Update: Partial<Pick<Database["public"]["Tables"]["messages"]["Row"], "read">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "client" | "landlord" | "agent" | "admin";
      verification_status: "unverified" | "pending" | "verified" | "rejected";
      property_type: "student_lodge" | "family_apartment" | "shared_flat" | "single_room" | "duplex" | "villa" | "short_let";
      property_status: "available" | "rented" | "under_review" | "inactive";
    };
  };
}
