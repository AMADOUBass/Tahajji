import { computeBadges, levelFromXp } from '@/lib/gamification';

describe('levelFromXp', () => {
  it('commence au niveau 1 à 0 XP', () => {
    expect(levelFromXp(0)).toEqual({ level: 1, xpInLevel: 0, xpForLevel: 100, progress: 0 });
  });

  it('passe au niveau 2 à 100 XP', () => {
    const r = levelFromXp(100);
    expect(r.level).toBe(2);
    expect(r.xpInLevel).toBe(0);
  });

  it('calcule la progression dans le niveau', () => {
    const r = levelFromXp(150);
    expect(r.level).toBe(2);
    expect(r.xpInLevel).toBe(50);
    expect(r.progress).toBeCloseTo(0.5);
  });

  it('monte d’un niveau tous les 100 XP', () => {
    expect(levelFromXp(450).level).toBe(5);
  });
});

describe('computeBadges', () => {
  it('aucun badge gagné pour un nouveau compte', () => {
    const badges = computeBadges({ xp: 0, streak: 0, completedCount: 0, level: 1 });
    expect(badges.every((b) => !b.earned)).toBe(true);
    expect(badges).toHaveLength(6);
  });

  it('débloque la 1ʳᵉ leçon dès une leçon terminée', () => {
    const badges = computeBadges({ xp: 50, streak: 1, completedCount: 1, level: 1 });
    expect(badges.find((b) => b.id === 'first')?.earned).toBe(true);
    expect(badges.find((b) => b.id === 'five')?.earned).toBe(false);
  });

  it('débloque les paliers selon les seuils', () => {
    const badges = computeBadges({ xp: 200, streak: 3, completedCount: 10, level: 5 });
    const earned = Object.fromEntries(badges.map((b) => [b.id, b.earned]));
    expect(earned.first).toBe(true);
    expect(earned.five).toBe(true);
    expect(earned.streak3).toBe(true);
    expect(earned.xp200).toBe(true);
    expect(earned.ten).toBe(true);
    expect(earned.level5).toBe(true);
  });
});
