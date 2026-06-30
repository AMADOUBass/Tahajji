/**
 * Types domaine de l'app (camelCase, orientés UI).
 * Ils reflètent le schéma SQL d'AGENTS.md §5 ; les hooks de données
 * (lib/queries.ts) renverront ces types, qu'ils proviennent du mock
 * aujourd'hui ou de Supabase plus tard (mapping snake_case → camelCase).
 */

export type LessonType = 'learn' | 'practice' | 'exam';
export type LessonItemType = 'letter' | 'word' | 'verse';
export type QuestionType = 'recognize_letter' | 'match_audio' | 'choose_word';
export type ProgressStatus = 'locked' | 'in_progress' | 'completed';
export type RevelationType = 'meccan' | 'medinan';

export interface Profile {
  id: string;
  displayName: string;
  locale: string;
  currentLevel: number;
  xp: number;
  streakCount: number;
  lastActiveDate: string | null;
  isPremium: boolean;
  avatarUrl: string | null;
  bio: string | null;
  hearts: number;
  heartsUpdatedAt: string;
}

export interface Level {
  id: number;
  position: number;
  title: string;
  description: string | null;
  isPremium: boolean;
}

export interface Lesson {
  id: number;
  levelId: number;
  position: number;
  title: string;
  lessonType: LessonType;
  isPremium: boolean;
}

export interface LessonItem {
  id: number;
  lessonId: number;
  position: number;
  itemType: LessonItemType;
  arabicText: string;
  transliteration: string | null;
  translationFr: string | null;
  audioUrl: string | null;
}

export interface QuizQuestion {
  id: number;
  lessonId: number;
  position: number;
  questionType: QuestionType;
  prompt: string | null;
  arabicText: string | null;
  audioUrl: string | null;
  correctAnswer: string;
  options: string[] | null;
}

export interface Surah {
  id: number;
  number: number;
  nameAr: string;
  nameFr: string;
  revelationType: RevelationType | null;
  verseCount: number;
}

export interface Verse {
  id: number;
  surahId: number;
  number: number;
  arabicText: string;
  translationFr: string | null;
  translationEn: string | null;
  audioUrl: string | null;
}

export interface Story {
  id: number;
  category: string;
  title: string;
  summary: string | null;
  content: string;
  icon: string | null;
  position: number;
  isValidated: boolean;
}

export interface UserProgress {
  lessonId: number;
  status: ProgressStatus;
  stars: number;
  completedAt: string | null;
}

/* ---------- Types dérivés (vues UI) ---------- */

export interface LessonWithProgress extends Lesson {
  status: ProgressStatus;
  stars: number;
}

export interface LevelWithLessons extends Level {
  lessons: LessonWithProgress[];
}
