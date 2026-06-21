/**
 * Authentification réelle via Supabase Auth.
 * `init()` est appelé une fois au démarrage (layout racine) : il lit la session
 * persistée et s'abonne aux changements (connexion/déconnexion/refresh token).
 */
import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { authRedirectTo } from '@/lib/authRedirect';
import { supabase } from '@/lib/supabase';

interface AuthResult {
  error: string | null;
  needsConfirmation?: boolean;
}

interface AuthState {
  session: Session | null;
  userId: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  init: () => () => void;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  userId: null,
  isAuthenticated: false,
  initializing: true,

  init: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({
        session: data.session,
        userId: data.session?.user.id ?? null,
        isAuthenticated: !!data.session,
        initializing: false,
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        userId: session?.user.id ?? null,
        isAuthenticated: !!session,
        initializing: false,
      });
    });

    return () => sub.subscription.unsubscribe();
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: authRedirectTo },
    });
    if (error) return { error: error.message };
    // Si la confirmation par e-mail est activée, aucune session n'est créée.
    return { error: null, needsConfirmation: !data.session };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
