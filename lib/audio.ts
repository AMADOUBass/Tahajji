/**
 * Wrapper audio (expo-av remplacé par expo-audio au SDK 54).
 * Si `audioUrl` est null (clip pas encore enregistré), c'est un no-op.
 * Sinon on joue le fichier LOCAL s'il est déjà en cache, sinon on streame depuis
 * l'URL distante ET on le télécharge en tâche de fond pour la prochaine fois.
 */
import { createAudioPlayer } from 'expo-audio';

import { cacheAudio, cachedAudioUri } from '@/lib/audioCache';

export function playAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const local = cachedAudioUri(url);
    const player = createAudioPlayer({ uri: local ?? url });
    player.play();
    if (!local) void cacheAudio(url); // met en cache pour l'écoute hors-ligne suivante
    return true;
  } catch {
    return false;
  }
}

/** Variantes vocalisées (fatha/kasra/damma) d'une lettre, pour les leçons. */
export function vowelVariants(arabicLetter: string): { ar: string; translit: string }[] {
  // Retire tatweel + harakât existantes pour repartir de la lettre nue
  // (évite de doubler les diacritiques si l'entrée est déjà vocalisée).
  const base = arabicLetter.replace(/[ـً-ْٰ]/g, '');
  return [
    { ar: base + 'َ', translit: 'a' }, // fatha
    { ar: base + 'ِ', translit: 'i' }, // kasra
    { ar: base + 'ُ', translit: 'ou' }, // damma
  ];
}
