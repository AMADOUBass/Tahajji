/**
 * État d'authentification.
 * ⚠️ Mock pour l'instant (UI-first) : un simple drapeau en mémoire.
 * À l'intégration : remplacer par la session Supabase
 * (supabase.auth.onAuthStateChange → isAuthenticated).
 */
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
}));
