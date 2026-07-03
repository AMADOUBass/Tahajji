/**
 * Gamification : niveau de l'apprenant (basé sur l'XP) et badges.
 * Le « niveau » monte avec l'XP (100 XP par niveau) — distinct des unités du parcours.
 */
import { Ionicons } from '@expo/vector-icons';

const XP_PER_LEVEL = 100;

export function levelFromXp(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  return { level, xpInLevel, xpForLevel: XP_PER_LEVEL, progress: xpInLevel / XP_PER_LEVEL };
}

export interface Badge {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  earned: boolean;
}

/**
 * Badges générés dynamiquement à partir de PALIERS. Ajouter un palier = une ligne.
 * Affichés en défilement horizontal (ne prend qu'une ligne à l'écran).
 */
export function computeBadges(opts: {
  xp: number;
  streak: number;
  completedCount: number;
  level: number;
}): Badge[] {
  const { xp, streak, completedCount, level } = opts;
  const badges: Badge[] = [];

  const tiers = [
    { key: 'lessons', icon: 'school' as const, value: completedCount, steps: [1, 5, 10, 25, 50], label: (n: number) => `${n} leçon${n > 1 ? 's' : ''}` },
    { key: 'streak', icon: 'flame' as const, value: streak, steps: [3, 7, 30, 100], label: (n: number) => `Série ${n} j` },
    { key: 'xp', icon: 'star' as const, value: xp, steps: [100, 500, 1000, 5000], label: (n: number) => `${n} XP` },
    { key: 'level', icon: 'trophy' as const, value: level, steps: [5, 10, 20], label: (n: number) => `Niveau ${n}` },
  ];

  for (const t of tiers) {
    for (const step of t.steps) {
      badges.push({ id: `${t.key}-${step}`, label: t.label(step), icon: t.icon, earned: t.value >= step });
    }
  }
  return badges;
}
