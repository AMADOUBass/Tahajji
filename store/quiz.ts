/**
 * Progression en cours d'un quiz (par leçon), persistée localement.
 * Permet de REPRENDRE là où on s'est arrêté si on quitte le quiz avant la fin.
 * Effacée quand la leçon est terminée.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Snapshot {
  qIndex: number;
  correctCount: number;
}

interface QuizState {
  byLesson: Record<number, Snapshot>;
  save: (lessonId: number, snap: Snapshot) => void;
  clear: (lessonId: number) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      byLesson: {},
      save: (lessonId, snap) =>
        set((s) => ({ byLesson: { ...s.byLesson, [lessonId]: snap } })),
      clear: (lessonId) =>
        set((s) => {
          const copy = { ...s.byLesson };
          delete copy[lessonId];
          return { byLesson: copy };
        }),
    }),
    { name: 'tahajji-quiz-progress', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
