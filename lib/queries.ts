/**
 * Hooks de données (React Query) branchés sur Supabase.
 * Les lignes (snake_case) sont mappées vers les types domaine (camelCase).
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { Database } from '@/types/database';
import type {
  Lesson,
  LessonItem,
  Level,
  LevelWithLessons,
  Profile,
  ProgressStatus,
  QuizQuestion,
  Surah,
  UserProgress,
  Verse,
} from '@/types/models';

type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

/* ---------- Mappers snake_case → camelCase ---------- */

const toLevel = (r: Row<'levels'>): Level => ({
  id: r.id, position: r.position, title: r.title, description: r.description, isPremium: r.is_premium,
});
const toLesson = (r: Row<'lessons'>): Lesson => ({
  id: r.id, levelId: r.level_id, position: r.position, title: r.title,
  lessonType: r.lesson_type as Lesson['lessonType'], isPremium: r.is_premium,
});
const toItem = (r: Row<'lesson_items'>): LessonItem => ({
  id: r.id, lessonId: r.lesson_id, position: r.position, itemType: r.item_type as LessonItem['itemType'],
  arabicText: r.arabic_text, transliteration: r.transliteration, translationFr: r.translation_fr, audioUrl: r.audio_url,
});
const toQuiz = (r: Row<'quiz_questions'>): QuizQuestion => ({
  id: r.id, lessonId: r.lesson_id, position: r.position, questionType: r.question_type as QuizQuestion['questionType'],
  prompt: r.prompt, arabicText: r.arabic_text, audioUrl: r.audio_url, correctAnswer: r.correct_answer, options: r.options,
});
const toSurah = (r: Row<'surahs'>): Surah => ({
  id: r.id, number: r.number, nameAr: r.name_ar, nameFr: r.name_fr,
  revelationType: r.revelation_type as Surah['revelationType'], verseCount: r.verse_count,
});
const toVerse = (r: Row<'verses'>): Verse => ({
  id: r.id, surahId: r.surah_id, number: r.number, arabicText: r.arabic_text,
  translationFr: r.translation_fr, translationEn: r.translation_en, audioUrl: r.audio_url,
});
const toProfile = (r: Row<'profiles'>): Profile => ({
  id: r.id, displayName: r.display_name ?? 'Apprenant', locale: r.locale, currentLevel: r.current_level,
  xp: r.xp, streakCount: r.streak_count, lastActiveDate: r.last_active_date, isPremium: r.is_premium,
  avatarUrl: r.avatar_url, bio: r.bio, hearts: r.hearts, heartsUpdatedAt: r.hearts_updated_at,
});

export const queryKeys = {
  levels: ['levels'] as const,
  lessons: ['lessons'] as const,
  lessonItems: (lessonId: number) => ['lessonItems', lessonId] as const,
  quiz: (lessonId: number) => ['quiz', lessonId] as const,
  surahs: ['surahs'] as const,
  verses: (surahId: number) => ['verses', surahId] as const,
  profile: (userId: string | null) => ['profile', userId] as const,
  progress: (userId: string | null) => ['progress', userId] as const,
};

/* ---------- Contenu (lecture publique) ---------- */

export function useLessonItems(lessonId: number) {
  return useQuery({
    queryKey: queryKeys.lessonItems(lessonId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_items').select('*').eq('lesson_id', lessonId).order('position');
      if (error) throw error;
      return data.map(toItem);
    },
  });
}

export function useQuizQuestions(lessonId: number) {
  return useQuery({
    queryKey: queryKeys.quiz(lessonId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions').select('*').eq('lesson_id', lessonId).order('position');
      if (error) throw error;
      return data.map(toQuiz);
    },
  });
}

export function useSurahs() {
  return useQuery({
    queryKey: queryKeys.surahs,
    queryFn: async () => {
      const { data, error } = await supabase.from('surahs').select('*').order('number');
      if (error) throw error;
      return data.map(toSurah);
    },
  });
}

export function useVerses(surahId: number) {
  return useQuery({
    queryKey: queryKeys.verses(surahId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verses').select('*').eq('surah_id', surahId).order('number');
      if (error) throw error;
      return data.map(toVerse);
    },
  });
}

export function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons,
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').order('position');
      if (error) throw error;
      return data.map(toLesson);
    },
  });
}

/* ---------- Profil & progression (privés) ---------- */

export function useProfile() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: queryKeys.profile(userId),
    enabled: !!userId,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId!).maybeSingle();
      if (error) throw error;
      return data ? toProfile(data) : null;
    },
  });
}

export function useProgress() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: queryKeys.progress(userId),
    enabled: !!userId,
    queryFn: async (): Promise<UserProgress[]> => {
      const { data, error } = await supabase
        .from('user_progress').select('*').eq('user_id', userId!);
      if (error) throw error;
      return data.map((r) => ({
        lessonId: r.lesson_id,
        status: r.status as ProgressStatus,
        stars: r.stars,
        completedAt: r.completed_at,
      }));
    },
  });
}

/**
 * Niveaux + leçons + statut dérivé de la progression.
 * Règle de déblocage : la 1ʳᵉ leçon est ouverte ; une leçon s'ouvre quand la
 * précédente (ordre global niveau→position) est terminée.
 */
export function useLevelsWithProgress(): { data: LevelWithLessons[]; isLoading: boolean; isError: boolean; refetch: () => void } {
  const levelsQ = useQuery({
    queryKey: queryKeys.levels,
    queryFn: async () => {
      const { data, error } = await supabase.from('levels').select('*').order('position');
      if (error) throw error;
      return data.map(toLevel);
    },
  });
  const lessonsQ = useQuery({
    queryKey: queryKeys.lessons,
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').order('position');
      if (error) throw error;
      return data.map(toLesson);
    },
  });
  const progressQ = useProgress();

  const isLoading = levelsQ.isLoading || lessonsQ.isLoading;
  const isError = levelsQ.isError || lessonsQ.isError;
  const refetch = () => { levelsQ.refetch(); lessonsQ.refetch(); progressQ.refetch(); };
  if (!levelsQ.data || !lessonsQ.data) return { data: [], isLoading, isError, refetch };

  const completions = new Map((progressQ.data ?? []).map((p) => [p.lessonId, p]));
  const levels = [...levelsQ.data].sort((a, b) => a.position - b.position);
  const lessons = [...lessonsQ.data].sort(
    (a, b) =>
      (levels.find((l) => l.id === a.levelId)?.position ?? 0) -
        (levels.find((l) => l.id === b.levelId)?.position ?? 0) || a.position - b.position,
  );

  // Statut dérivé en parcourant les leçons dans l'ordre global.
  const statusById = new Map<number, { status: ProgressStatus; stars: number }>();
  let prevCompleted = true;
  for (const lesson of lessons) {
    const done = completions.get(lesson.id);
    if (done && done.status === 'completed') {
      statusById.set(lesson.id, { status: 'completed', stars: done.stars });
      prevCompleted = true;
    } else if (prevCompleted) {
      statusById.set(lesson.id, { status: 'in_progress', stars: 0 });
      prevCompleted = false;
    } else {
      statusById.set(lesson.id, { status: 'locked', stars: 0 });
    }
  }

  const data: LevelWithLessons[] = levels.map((level) => ({
    ...level,
    lessons: lessonsQ.data!
      .filter((l) => l.levelId === level.id)
      .sort((a, b) => a.position - b.position)
      .map((lesson) => ({
        ...lesson,
        status: statusById.get(lesson.id)?.status ?? 'locked',
        stars: statusById.get(lesson.id)?.stars ?? 0,
      })),
  }));

  return { data, isLoading, isError, refetch };
}

/**
 * Termine une leçon via la fonction serveur sécurisée : la progression et l'XP
 * sont gérés CÔTÉ SERVEUR (l'XP n'est pas falsifiable par le client).
 */
export function useCompleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, stars }: { lessonId: number; stars: number }) => {
      const { error } = await supabase.rpc('complete_lesson', { p_lesson_id: lessonId, p_stars: stars });
      if (error) throw error;
    },
    onSuccess: () => {
      const userId = useAuthStore.getState().userId;
      queryClient.invalidateQueries({ queryKey: queryKeys.progress(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) });
    },
  });
}

/** Met à jour le profil de l'utilisateur (nom affiché, bio). */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: { displayName?: string; bio?: string | null }) => {
      const userId = useAuthStore.getState().userId;
      if (!userId) throw new Error('Non authentifié');
      const update: Database['public']['Tables']['profiles']['Update'] = {};
      if (patch.displayName !== undefined) update.display_name = patch.displayName;
      if (patch.bio !== undefined) update.bio = patch.bio;
      const { error } = await supabase.from('profiles').update(update).eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      const userId = useAuthStore.getState().userId;
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) });
    },
  });
}

/** Consomme un cœur (mauvaise réponse). Renvoie le nombre de cœurs restant. */
export function useConsumeHeart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('consume_heart');
      if (error) throw error;
      return data as number;
    },
    onSuccess: () => {
      const userId = useAuthStore.getState().userId;
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) });
    },
  });
}

/** Regagne des cœurs (ex. après une révision). */
export function useRefillHearts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      const { error } = await supabase.rpc('refill_hearts', { p_amount: amount });
      if (error) throw error;
    },
    onSuccess: () => {
      const userId = useAuthStore.getState().userId;
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) });
    },
  });
}

/**
 * Bascule premium via une fonction serveur (placeholder).
 * ⚠️ Sera remplacé par le webhook RevenueCat (service_role) ; le client ne pourra
 * alors plus s'octroyer le premium.
 */
export function useSetPremium() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isPremium: boolean) => {
      const { error } = await supabase.rpc('set_premium', { p_value: isPremium });
      if (error) throw error;
    },
    onSuccess: () => {
      const userId = useAuthStore.getState().userId;
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) });
    },
  });
}
