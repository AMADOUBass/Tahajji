/**
 * Dernière position de lecture du Coran (pour la carte « Reprendre »).
 * Persistée localement.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReadingState {
  lastSurahId: number | null;
  lastSurahName: string | null;
  lastVerse: number;
  setLastRead: (surahId: number, surahName: string, verse: number) => void;
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      lastSurahId: null,
      lastSurahName: null,
      lastVerse: 1,
      setLastRead: (lastSurahId, lastSurahName, lastVerse) =>
        set({ lastSurahId, lastSurahName, lastVerse }),
    }),
    {
      name: 'tahajji-reading',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
