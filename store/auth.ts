/**
 * Authentification via Supabase Auth — confirmation par CODE e-mail (OTP),
 * sans deep link. L'e-mail (envoyé par Supabase, via Resend en prod) contient
 * un code à 6 chiffres que l'utilisateur saisit dans l'app.
 */
import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

interface AuthResult {
  error: string | null;
  needsConfirmation?: boolean;
}

type OtpType = 'signup' | 'recovery';

interface AuthState {
  session: Session | null;
  userId: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  init: () => () => void;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  /** Vérifie le code à 6 chiffres reçu par e-mail. */
  verifyOtp: (email: string, token: string, type: OtpType) => Promise<AuthResult>;
  resendSignup: (email: string) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
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
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // Un e-mail déjà inscrit : Supabase masque l'existence du compte (anti-
    // énumération) en renvoyant un utilisateur SANS identités. On le détecte pour
    // empêcher un doublon (un e-mail = un seul compte).
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      return { error: 'Un compte existe déjà avec cet e-mail. Connecte-toi plutôt.' };
    }
    // Pas de session immédiate ⇒ un code de confirmation a été envoyé par e-mail.
    return { error: null, needsConfirmation: !data.session };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  verifyOtp: async (email, token, type) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type });
    return { error: error?.message ?? null };
  },

  resendSignup: async (email) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    return { error: error?.message ?? null };
  },

  requestPasswordReset: async (email) => {
    // Envoie un e-mail de réinitialisation (code OTP de type « recovery »).
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error?.message ?? null };
  },
}));
