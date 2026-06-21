/**
 * Hooks de données (React Query) — contenu pédagogique statique.
 * Aujourd'hui ils renvoient le mock ; à l'intégration, on remplace le corps
 * de chaque `queryFn` par un `supabase.from(...).select(...)` sans toucher l'UI.
 *
 * La progression (mutable) vit dans store/game.ts ; useLevelsWithProgress
 * combine le contenu statique avec la progression locale.
 */
import { useQuery } from '@tanstack/react-query';

import {
  mockLessonItems,
  mockLessons,
  mockLevels,
  mockQuizQuestions,
  mockSurahs,
  mockVerses,
} from '@/lib/mock';
import { useGameStore } from '@/store/game';
import type {
  Lesson,
  LessonItem,
  LevelWithLessons,
  QuizQuestion,
  Surah,
  Verse,
} from '@/types/models';

// Simule une latence réseau pour des états de chargement réalistes.
function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const queryKeys = {
  levels: ['levels'] as const,
  lessons: (levelId: number) => ['lessons', levelId] as const,
  lesson: (lessonId: number) => ['lesson', lessonId] as const,
  lessonItems: (lessonId: number) => ['lessonItems', lessonId] as const,
  quiz: (lessonId: number) => ['quiz', lessonId] as const,
  surahs: ['surahs'] as const,
  verses: (surahId: number) => ['verses', surahId] as const,
};

export function useLevels() {
  return useQuery({
    queryKey: queryKeys.levels,
    queryFn: () => delay(mockLevels),
  });
}

export function useLesson(lessonId: number) {
  return useQuery<Lesson | undefined>({
    queryKey: queryKeys.lesson(lessonId),
    queryFn: () => delay(mockLessons.find((l) => l.id === lessonId)),
  });
}

export function useLessonItems(lessonId: number) {
  return useQuery<LessonItem[]>({
    queryKey: queryKeys.lessonItems(lessonId),
    queryFn: () =>
      delay(
        mockLessonItems
          .filter((i) => i.lessonId === lessonId)
          .sort((a, b) => a.position - b.position),
      ),
  });
}

export function useQuizQuestions(lessonId: number) {
  return useQuery<QuizQuestion[]>({
    queryKey: queryKeys.quiz(lessonId),
    queryFn: () =>
      delay(
        mockQuizQuestions
          .filter((q) => q.lessonId === lessonId)
          .sort((a, b) => a.position - b.position),
      ),
  });
}

export function useSurahs() {
  return useQuery<Surah[]>({
    queryKey: queryKeys.surahs,
    queryFn: () => delay(mockSurahs),
  });
}

export function useVerses(surahId: number) {
  return useQuery<Verse[]>({
    queryKey: queryKeys.verses(surahId),
    queryFn: () =>
      delay(
        mockVerses
          .filter((v) => v.surahId === surahId)
          .sort((a, b) => a.number - b.number),
      ),
  });
}

/**
 * Niveaux + leçons enrichis de la progression locale (store/game).
 * C'est ce que consomme l'écran Parcours.
 */
export function useLevelsWithProgress(): {
  data: LevelWithLessons[];
  isLoading: boolean;
} {
  const { data: levels, isLoading } = useLevels();
  const progress = useGameStore((s) => s.progress);

  if (!levels) return { data: [], isLoading };

  const data: LevelWithLessons[] = levels
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((level) => ({
      ...level,
      lessons: mockLessons
        .filter((l) => l.levelId === level.id)
        .sort((a, b) => a.position - b.position)
        .map((lesson) => {
          const p = progress[lesson.id];
          return {
            ...lesson,
            status: p?.status ?? 'locked',
            stars: p?.stars ?? 0,
          };
        }),
    }));

  return { data, isLoading };
}
