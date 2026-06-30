import { deriveLessonStatuses } from '@/lib/progress';

describe('deriveLessonStatuses', () => {
  it('la 1re leçon est in_progress, les autres locked (rien de terminé)', () => {
    const s = deriveLessonStatuses([1, 2, 3], new Map());
    expect(s.get(1)?.status).toBe('in_progress');
    expect(s.get(2)?.status).toBe('locked');
    expect(s.get(3)?.status).toBe('locked');
  });

  it('débloque la suivante quand la précédente est terminée', () => {
    const s = deriveLessonStatuses([1, 2, 3], new Map([[1, 3]]));
    expect(s.get(1)).toEqual({ status: 'completed', stars: 3 });
    expect(s.get(2)?.status).toBe('in_progress');
    expect(s.get(3)?.status).toBe('locked');
  });

  it('conserve les étoiles des leçons terminées', () => {
    const s = deriveLessonStatuses([10, 20], new Map([[10, 2]]));
    expect(s.get(10)?.stars).toBe(2);
  });

  it('toutes terminées → aucune verrouillée', () => {
    const s = deriveLessonStatuses([1, 2], new Map([[1, 1], [2, 3]]));
    expect(s.get(1)?.status).toBe('completed');
    expect(s.get(2)?.status).toBe('completed');
  });

  it('une leçon terminée rend toujours la suivante accessible', () => {
    // 1 et 3 terminées (2 non) : chaque leçon terminée rouvre la suivante.
    const s = deriveLessonStatuses([1, 2, 3, 4], new Map([[1, 1], [3, 1]]));
    expect(s.get(1)?.status).toBe('completed');
    expect(s.get(2)?.status).toBe('in_progress'); // 1 terminée → 2 ouverte
    expect(s.get(3)?.status).toBe('completed');
    expect(s.get(4)?.status).toBe('in_progress'); // 3 terminée → 4 ouverte
  });

  it('liste vide → map vide', () => {
    expect(deriveLessonStatuses([], new Map()).size).toBe(0);
  });
});
