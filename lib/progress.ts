/**
 * Déblocage des leçons (logique pure, testable).
 */
import type { ProgressStatus } from '@/types/models';

export interface LessonStatus {
  status: ProgressStatus;
  stars: number;
}

/**
 * Statut dérivé des leçons. On parcourt les leçons DANS L'ORDRE du parcours :
 * - une leçon terminée → « completed »,
 * - la PREMIÈRE non terminée → « in_progress »,
 * - toutes les suivantes → « locked ».
 *
 * @param orderedLessonIds ids des leçons, déjà triés dans l'ordre du parcours
 * @param completedStars   map lessonId → étoiles, pour les leçons TERMINÉES
 */
export function deriveLessonStatuses(
  orderedLessonIds: number[],
  completedStars: Map<number, number>,
): Map<number, LessonStatus> {
  const out = new Map<number, LessonStatus>();
  let prevCompleted = true;
  for (const id of orderedLessonIds) {
    if (completedStars.has(id)) {
      out.set(id, { status: 'completed', stars: completedStars.get(id) ?? 0 });
      prevCompleted = true;
    } else if (prevCompleted) {
      out.set(id, { status: 'in_progress', stars: 0 });
      prevCompleted = false;
    } else {
      out.set(id, { status: 'locked', stars: 0 });
    }
  }
  return out;
}
