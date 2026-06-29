/**
 * Cache des fichiers audio pour l'écoute hors-ligne.
 *
 * Les récitations sont téléchargées dans le dossier `document/audio` (expo-file-
 * system, nouvelle API SDK 54). À la lecture, on préfère le fichier local s'il
 * existe, sinon on streame depuis l'URL distante.
 */
import { Directory, File, Paths } from 'expo-file-system';

const AUDIO_DIR = new Directory(Paths.document, 'audio');

function ensureDir() {
  if (!AUDIO_DIR.exists) AUDIO_DIR.create({ intermediates: true });
}

function fileName(url: string): string {
  const last = url.split('/').pop();
  return last && last.length ? last : encodeURIComponent(url);
}

function fileFor(url: string): File {
  return new File(AUDIO_DIR, fileName(url));
}

/** URI locale si le clip est déjà en cache, sinon `null`. */
export function cachedAudioUri(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const f = fileFor(url);
    return f.exists ? f.uri : null;
  } catch {
    return null;
  }
}

/** Télécharge un clip s'il n'est pas déjà en cache (silencieux si erreur réseau). */
export async function cacheAudio(url: string): Promise<void> {
  try {
    ensureDir();
    const f = fileFor(url);
    if (f.exists) return;
    await File.downloadFileAsync(url, f);
  } catch {
    // hors-ligne ou erreur : on ignore (la lecture streamera sinon).
  }
}

/** Télécharge une liste de clips en signalant la progression. */
export async function cacheAudioBatch(
  urls: (string | null | undefined)[],
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const list = urls.filter((u): u is string => !!u);
  let done = 0;
  for (const url of list) {
    await cacheAudio(url);
    done += 1;
    onProgress?.(done, list.length);
  }
}

/** Nombre de clips de la liste déjà disponibles hors-ligne. */
export function cachedCount(urls: (string | null | undefined)[]): number {
  return urls.reduce((n, u) => (cachedAudioUri(u) ? n + 1 : n), 0);
}
