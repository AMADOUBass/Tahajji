/**
 * Préférences utilisateur locales (rappels quotidiens, etc.).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PrefsState {
  remindersEnabled: boolean;
  reminderHour: number;
  setRemindersEnabled: (v: boolean) => void;
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      remindersEnabled: false,
      reminderHour: 19,
      setRemindersEnabled: (remindersEnabled) => set({ remindersEnabled }),
    }),
    {
      name: 'tahajji-prefs',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
