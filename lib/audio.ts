/**
 * Wrapper audio (expo-av remplacé par expo-audio au SDK 54).
 * Aujourd'hui le contenu mock n'a pas de fichiers audio (audioUrl = null) :
 * playAudioUrl ne fait rien dans ce cas. À l'intégration, les URLs viendront
 * de Supabase Storage et le cache hors-ligne fournira un chemin local.
 */
import { createAudioPlayer } from 'expo-audio';

export function playAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const player = createAudioPlayer({ uri: url });
    player.play();
    return true;
  } catch {
    return false;
  }
}

/** Variantes vocalisées (fatha/kasra/damma) d'une lettre, pour les leçons. */
export function vowelVariants(arabicLetter: string): { ar: string; translit: string }[] {
  const base = arabicLetter.replace(/ـ/g, ''); // retire le tatweel de liaison
  return [
    { ar: base + 'َ', translit: 'a' }, // fatha
    { ar: base + 'ِ', translit: 'i' }, // kasra
    { ar: base + 'ُ', translit: 'ou' }, // damma
  ];
}
