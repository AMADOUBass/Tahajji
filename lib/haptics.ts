/**
 * Retour haptique (vibration) — rend l'app « vivante » façon Duolingo.
 * No-op silencieux si indisponible (web, simulateur, erreur).
 */
import * as Haptics from 'expo-haptics';

/** Bonne réponse / réussite. */
export function hapticSuccess() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

/** Mauvaise réponse / échec / perte de cœur. */
export function hapticError() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}

/** Petit retour léger (tap, sélection). */
export function hapticLight() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
