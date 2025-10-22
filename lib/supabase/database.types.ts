// TypeScript types for Supabase database schema
// These types match the schema.sql structure

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          company: string
          description: string
          start_date: string
          end_date: string | null
          current: boolean
          highlights: string[] | null
          technologies: string[]
          demo_url: string | null
          github_url: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          company: string
          description: string
          start_date: string
          end_date?: string | null
          current?: boolean
          highlights?: string[] | null
          technologies: string[]
          demo_url?: string | null
          github_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          company?: string
          description?: string
          start_date?: string
          end_date?: string | null
          current?: boolean
          highlights?: string[] | null
          technologies?: string[]
          demo_url?: string | null
          github_url?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          company: string
          position: string
          location: string | null
          start_date: string
          end_date: string | null
          current: boolean
          description: string | null
          responsibilities: string[] | null
          technologies: string[]
          achievements: string[] | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company: string
          position: string
          location?: string | null
          start_date: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          responsibilities?: string[] | null
          technologies: string[]
          achievements?: string[] | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: string
          position?: string
          location?: string | null
          start_date?: string
          end_date?: string | null
          current?: boolean
          description?: string | null
          responsibilities?: string[] | null
          technologies?: string[]
          achievements?: string[] | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          category: string
          skill_name: string
          proficiency_level: number | null
          years_experience: number | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          skill_name: string
          proficiency_level?: number | null
          years_experience?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          skill_name?: string
          proficiency_level?: number | null
          years_experience?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      certifications: {
        Row: {
          id: string
          name: string
          issuer: string
          issue_date: string
          expiry_date: string | null
          credential_id: string | null
          credential_url: string | null
          description: string | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          issuer: string
          issue_date: string
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          issuer?: string
          issue_date?: string
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          admin_user_id: string | null
          table_name: string
          record_id: string
          action: 'CREATE' | 'UPDATE' | 'DELETE'
          old_data: Json | null
          new_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id?: string | null
          table_name: string
          record_id: string
          action: 'CREATE' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string | null
          table_name?: string
          record_id?: string
          action?: 'CREATE' | 'UPDATE' | 'DELETE'
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
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
  }
}
