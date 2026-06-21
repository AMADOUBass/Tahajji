/**
 * Préférence de thème de l'utilisateur (réglée depuis l'écran Profil).
 * - 'system' suit le réglage de l'OS.
 * - 'light' / 'dark' forcent un mode.
 * Persistée localement (lecture nocturne fréquente, cf. brief §3).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  hydrated: boolean;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      hydrated: false,
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: 'tahajji-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ preference: state.preference }),
      onRehydrateStorage: () => (state) => {
        state?.setPreference(state.preference);
        useThemeStore.setState({ hydrated: true });
      },
    },
  ),
);
