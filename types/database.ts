/**
 * Types de la base Supabase (écrits à la main, alignés sur db/migrations/0001_init.sql).
 * Chaque table déclare Row/Insert/Update/Relationships (forme attendue par supabase-js).
 * Régénérables plus tard via :
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 */

type Timestamp = string;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          locale: string;
          current_level: number;
          xp: number;
          streak_count: number;
          last_active_date: string | null;
          is_premium: boolean;
          avatar_url: string | null;
          bio: string | null;
          hearts: number;
          hearts_updated_at: Timestamp;
          created_at: Timestamp;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          locale?: string;
          current_level?: number;
          xp?: number;
          streak_count?: number;
          last_active_date?: string | null;
          is_premium?: boolean;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Update: {
          display_name?: string | null;
          locale?: string;
          current_level?: number;
          xp?: number;
          streak_count?: number;
          last_active_date?: string | null;
          is_premium?: boolean;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Relationships: [];
      };
      levels: {
        Row: { id: number; position: number; title: string; description: string | null; is_premium: boolean };
        Insert: { position: number; title: string; description?: string | null; is_premium?: boolean };
        Update: { position?: number; title?: string; description?: string | null; is_premium?: boolean };
        Relationships: [];
      };
      lessons: {
        Row: { id: number; level_id: number; position: number; title: string; lesson_type: string; is_premium: boolean };
        Insert: { level_id: number; position: number; title: string; lesson_type?: string; is_premium?: boolean };
        Update: { level_id?: number; position?: number; title?: string; lesson_type?: string; is_premium?: boolean };
        Relationships: [];
      };
      lesson_items: {
        Row: {
          id: number;
          lesson_id: number;
          position: number;
          item_type: string;
          arabic_text: string;
          transliteration: string | null;
          translation_fr: string | null;
          audio_url: string | null;
        };
        Insert: {
          lesson_id: number;
          position: number;
          item_type: string;
          arabic_text: string;
          transliteration?: string | null;
          translation_fr?: string | null;
          audio_url?: string | null;
        };
        Update: {
          lesson_id?: number;
          position?: number;
          item_type?: string;
          arabic_text?: string;
          transliteration?: string | null;
          translation_fr?: string | null;
          audio_url?: string | null;
        };
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: number;
          lesson_id: number;
          position: number;
          question_type: string;
          prompt: string | null;
          arabic_text: string | null;
          audio_url: string | null;
          correct_answer: string;
          options: string[] | null;
        };
        Insert: {
          lesson_id: number;
          position: number;
          question_type: string;
          prompt?: string | null;
          arabic_text?: string | null;
          audio_url?: string | null;
          correct_answer: string;
          options?: string[] | null;
        };
        Update: {
          lesson_id?: number;
          position?: number;
          question_type?: string;
          prompt?: string | null;
          arabic_text?: string | null;
          audio_url?: string | null;
          correct_answer?: string;
          options?: string[] | null;
        };
        Relationships: [];
      };
      surahs: {
        Row: { id: number; number: number; name_ar: string; name_fr: string; revelation_type: string | null; verse_count: number };
        Insert: { number: number; name_ar: string; name_fr: string; revelation_type?: string | null; verse_count: number };
        Update: { number?: number; name_ar?: string; name_fr?: string; revelation_type?: string | null; verse_count?: number };
        Relationships: [];
      };
      verses: {
        Row: {
          id: number;
          surah_id: number;
          number: number;
          arabic_text: string;
          translation_fr: string | null;
          translation_en: string | null;
          audio_url: string | null;
        };
        Insert: {
          surah_id: number;
          number: number;
          arabic_text: string;
          translation_fr?: string | null;
          translation_en?: string | null;
          audio_url?: string | null;
        };
        Update: {
          surah_id?: number;
          number?: number;
          arabic_text?: string;
          translation_fr?: string | null;
          translation_en?: string | null;
          audio_url?: string | null;
        };
        Relationships: [];
      };
      user_progress: {
        Row: { id: number; user_id: string; lesson_id: number; status: string; stars: number; completed_at: Timestamp | null };
        Insert: { user_id: string; lesson_id: number; status?: string; stars?: number; completed_at?: Timestamp | null };
        Update: { user_id?: string; lesson_id?: number; status?: string; stars?: number; completed_at?: Timestamp | null };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_lesson: {
        Args: { p_lesson_id: number; p_stars: number };
        Returns: undefined;
      };
      set_premium: {
        Args: { p_value: boolean };
        Returns: undefined;
      };
      consume_heart: {
        Args: Record<string, never>;
        Returns: number;
      };
      refill_hearts: {
        Args: { p_amount: number };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
  };
}
