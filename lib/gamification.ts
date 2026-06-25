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

export function computeBadges(opts: {
  xp: number;
  streak: number;
  completedCount: number;
  level: number;
}): Badge[] {
  const { xp, streak, completedCount, level } = opts;
  return [
    { id: 'first', label: '1ʳᵉ leçon', icon: 'footsteps', earned: completedCount >= 1 },
    { id: 'five', label: '5 leçons', icon: 'ribbon', earned: completedCount >= 5 },
    { id: 'streak3', label: 'Série 3 j', icon: 'flame', earned: streak >= 3 },
    { id: 'xp200', label: '200 XP', icon: 'star', earned: xp >= 200 },
    { id: 'ten', label: '10 leçons', icon: 'school', earned: completedCount >= 10 },
    { id: 'level5', label: 'Niveau 5', icon: 'trophy', earned: level >= 5 },
  ];
}
