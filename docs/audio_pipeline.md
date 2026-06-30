# Pipeline audio — comment brancher les clips

L'app est **prête à recevoir l'audio** : le bouton « Écouter » des leçons joue
`lesson_items.audio_url`, avec lecture **locale prioritaire** et mise en cache
hors-ligne automatique. Tant que `audio_url` est `null`, le bouton affiche
« 🎙️ Audio bientôt disponible ».

## Étapes

1. **Enregistrer les clips** listés dans [`db/audio_manifest.csv`](../db/audio_manifest.csv)
   - Colonnes : `id, type, arabe, translitteration, a_dire, unite, fichier`
   - Prononcer ce qui est dans `a_dire` (ex. « son ba »), voix claire, ~1 s, silence net au début/fin.
   - ~180 clips (lettres + mots). Les **versets du Coran ne sont pas ici** (déjà en ligne, voir `db/audio_verses.sql`).

2. **Nommer chaque fichier** exactement comme la colonne `fichier` : `items/{id}.mp3`
   (ex. l'item id 2 → `items/2.mp3`). Format **MP3**, mono, 64–128 kbps suffit.

3. **Uploader** le dossier `items/` dans un bucket **Supabase Storage** :
   - Storage → New bucket → nom **`audio`** → cocher **Public**.
   - Uploader le dossier `items/` à la racine du bucket.

4. **Brancher en base** : ouvrir [`db/audio_lessons.sql`](../db/audio_lessons.sql),
   remplacer `<BASE>` par l'URL publique du bucket
   (`https://<projet>.supabase.co/storage/v1/object/public/audio`), puis l'exécuter
   dans le SQL Editor. Terminé : tous les boutons « Écouter » des leçons fonctionnent.

## Vérifier

- Recharger l'app → ouvrir une leçon → « Écouter » joue le son.
- Couper le réseau après une première écoute → le son rejoue (servi depuis le cache local).

## Régénérer

`node scripts/build_curriculum.mjs` régénère le manifeste **et** `db/audio_lessons.sql`
en cohérence avec le curriculum. À relancer si le contenu change.
