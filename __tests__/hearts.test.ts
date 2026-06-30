import { MAX_HEARTS, REGEN_MS, effectiveHearts, formatCountdown } from '@/lib/hearts';
import type { Profile } from '@/types/models';

const NOW = new Date('2026-06-30T12:00:00Z').getTime();

function profile(over: Partial<Profile>): Profile {
  return {
    id: 'u1',
    displayName: 'Test',
    locale: 'fr',
    currentLevel: 1,
    xp: 0,
    streakCount: 0,
    lastActiveDate: null,
    isPremium: false,
    avatarUrl: null,
    bio: null,
    hearts: MAX_HEARTS,
    heartsUpdatedAt: new Date(NOW).toISOString(),
    ...over,
  };
}

const minutesAgo = (m: number) => new Date(NOW - m * 60_000).toISOString();

describe('effectiveHearts', () => {
  it('renvoie le maximum par défaut quand le profil est absent', () => {
    const h = effectiveHearts(null, NOW);
    expect(h).toEqual({ unlimited: false, count: MAX_HEARTS, full: true, secondsToNext: 0 });
  });

  it('donne des cœurs illimités au premium', () => {
    const h = effectiveHearts(profile({ isPremium: true, hearts: 0 }), NOW);
    expect(h.unlimited).toBe(true);
    expect(h.full).toBe(true);
    expect(h.count).toBe(MAX_HEARTS);
  });

  it('est plein quand hearts = max', () => {
    const h = effectiveHearts(profile({ hearts: MAX_HEARTS, heartsUpdatedAt: minutesAgo(60) }), NOW);
    expect(h.full).toBe(true);
    expect(h.count).toBe(MAX_HEARTS);
    expect(h.secondsToNext).toBe(0);
  });

  it('recharge un cœur toutes les REGEN_MS et plafonne au max', () => {
    // 3 cœurs, dernière maj il y a 100 min → +10 → plafonné à 5
    const h = effectiveHearts(profile({ hearts: 3, heartsUpdatedAt: minutesAgo(100) }), NOW);
    expect(h.count).toBe(MAX_HEARTS);
    expect(h.full).toBe(true);
  });

  it('calcule la recharge partielle et le temps jusqu’au prochain cœur', () => {
    // 2 cœurs, il y a 25 min → +2 → 4 ; reste 5 min avant le prochain
    const h = effectiveHearts(profile({ hearts: 2, heartsUpdatedAt: minutesAgo(25) }), NOW);
    expect(h.count).toBe(4);
    expect(h.full).toBe(false);
    expect(h.secondsToNext).toBe(300);
  });

  it('à 0 cœur récent, compte 0 et donne le compte à rebours', () => {
    const h = effectiveHearts(profile({ hearts: 0, heartsUpdatedAt: minutesAgo(5) }), NOW);
    expect(h.count).toBe(0);
    expect(h.secondsToNext).toBe(300);
  });

  it('REGEN_MS vaut 10 minutes', () => {
    expect(REGEN_MS).toBe(10 * 60 * 1000);
  });
});

describe('formatCountdown', () => {
  it('formate m:ss', () => {
    expect(formatCountdown(0)).toBe('0:00');
    expect(formatCountdown(65)).toBe('1:05');
    expect(formatCountdown(300)).toBe('5:00');
    expect(formatCountdown(600)).toBe('10:00');
  });
});
