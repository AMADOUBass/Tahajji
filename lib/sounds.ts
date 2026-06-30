/**
 * Sons d'interface du quiz (ding / erreur) — complète le retour haptique.
 *
 * ⚠️ INFRA PRÊTE À BRANCHER : dépose 2 fichiers courts (~0,3 s) dans
 *    assets/sounds/ : `correct.mp3` et `wrong.mp3`, puis décommente les
 *    `require(...)` ci-dessous. Tant qu'ils n'existent pas, c'est un no-op
 *    silencieux (le haptique fonctionne déjà).
 */
import { createAudioPlayer } from 'expo-audio';

// const CORRECT = require('@/assets/sounds/correct.mp3');
// const WRONG = require('@/assets/sounds/wrong.mp3');
const CORRECT: number | null = null;
const WRONG: number | null = null;

let enabled = true;
export function setSoundsEnabled(v: boolean) {
  enabled = v;
}

function play(asset: number | null) {
  if (!enabled || asset == null) return;
  try {
    const player = createAudioPlayer(asset);
    player.play();
  } catch {
    // ignore
  }
}

export function playCorrectSound() {
  play(CORRECT);
}

export function playWrongSound() {
  play(WRONG);
}
