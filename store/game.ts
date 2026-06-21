/**
 * État de jeu local : profil (XP, série, niveau, premium) + progression des leçons.
 * Réactif et persisté — c'est la « source locale » du modèle offline-first
 * (AGENTS.md §6). Plus tard, les mutations seront aussi synchronisées vers Supabase.
 *
 * Aujourd'hui : initialisé depuis lib/mock. Les écrans lisent/écrivent ici.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mockLessons, mockProfile, mockProgress } from '@/lib/mock';
import type { Profile, ProgressStatus } from '@/types/models';

interface ProgressEntry {
  status: ProgressStatus;
  stars: number;
  completedAt: string | null;
}

interface GameState {
  profile: Profile;
  progress: Record<number, ProgressEntry>;
  setPremium: (isPremium: boolean) => void;
  /** Marque une leçon terminée, débloque la suivante du niveau, ajoute l'XP. */
  completeLesson: (lessonId: number, stars: number, xpGained: number) => void;
}

function seedProgress(): Record<number, ProgressEntry> {
  const map: Record<number, ProgressEntry> = {};
  for (const p of mockProgress) {
    map[p.lessonId] = { status: p.status, stars: p.stars, completedAt: p.completedAt };
  }
  return map;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      profile: mockProfile,
      progress: seedProgress(),
      setPremium: (isPremium) =>
        set((s) => ({ profile: { ...s.profile, isPremium } })),
      completeLesson: (lessonId, stars, xpGained) =>
        set((s) => {
          const progress = { ...s.progress };
          const prev = progress[lessonId];
          // On garde la meilleure note si la leçon est refaite.
          progress[lessonId] = {
            status: 'completed',
            stars: Math.max(stars, prev?.stars ?? 0),
            completedAt: new Date().toISOString(),
          };

          // Débloque la leçon suivante du même niveau.
          const lesson = mockLessons.find((l) => l.id === lessonId);
          if (lesson) {
            const next = mockLessons.find(
              (l) => l.levelId === lesson.levelId && l.position === lesson.position + 1,
            );
            if (next && (progress[next.id]?.status ?? 'locked') === 'locked') {
              progress[next.id] = { status: 'in_progress', stars: 0, completedAt: null };
            }
          }

          // L'XP n'est ajouté qu'à la première complétion.
          const xp = prev?.status === 'completed' ? s.profile.xp : s.profile.xp + xpGained;
          return { progress, profile: { ...s.profile, xp } };
        }),
    }),
    {
      name: 'tahajji-game',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
