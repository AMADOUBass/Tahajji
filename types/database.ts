/**
 * Types de la base Supabase.
 *
 * ⚠️ PLACEHOLDER — à régénérer après l'exécution de la migration SQL :
 *   supabase gen types typescript --project-id <ref> > types/database.ts
 *
 * En attendant, on expose un type permissif pour ne pas bloquer la compilation.
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
