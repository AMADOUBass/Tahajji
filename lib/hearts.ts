/**
 * Cœurs (vies) — calcul d'affichage côté client.
 * Le serveur reste la source de vérité (consume_heart / refill_hearts).
 * Recharge : 1 cœur toutes les 30 min, max 5. Premium = illimité.
 */
import type { Profile } from '@/types/models';

export const MAX_HEARTS = 5;
export const REGEN_MS = 10 * 60 * 1000;

export interface HeartsState {
  unlimited: boolean;
  count: number;
  full: boolean;
  /** Secondes avant le prochain cœur (0 si plein ou illimité). */
  secondsToNext: number;
}

export function effectiveHearts(profile: Profile | null | undefined, now = Date.now()): HeartsState {
  if (!profile) return { unlimited: false, count: MAX_HEARTS, full: true, secondsToNext: 0 };
  if (profile.isPremium) return { unlimited: true, count: MAX_HEARTS, full: true, secondsToNext: 0 };

  const ts = new Date(profile.heartsUpdatedAt).getTime();
  const elapsed = Math.max(0, now - ts);
  const regen = Math.floor(elapsed / REGEN_MS);
  const count = Math.min(MAX_HEARTS, profile.hearts + regen);

  if (count >= MAX_HEARTS) {
    return { unlimited: false, count: MAX_HEARTS, full: true, secondsToNext: 0 };
  }
  const secondsToNext = Math.ceil((REGEN_MS - (elapsed % REGEN_MS)) / 1000);
  return { unlimited: false, count, full: false, secondsToNext };
}

/** « 12:34 » à partir d'un nombre de secondes. */
export function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
