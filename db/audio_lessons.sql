-- ============================================================
-- Tahajji — Branche l'audio des leçons (lettres / mots) sur lesson_items.
-- 1) Génère/enregistre les clips (TTS : scripts/build_audio_tts.mjs ; manifeste : db/audio_manifest.csv).
-- 2) Chaque fichier est nommé items/{id}.mp3.
-- 3) Upload le dossier dans un bucket Supabase Storage PUBLIC nommé « audio ».
-- 4) Remplace <BASE> ci-dessous par l'URL publique du bucket, puis exécute.
--    Ex : https://<projet>.supabase.co/storage/v1/object/public/audio
-- ============================================================

-- Active les clips disponibles (sauf le ع isolé, à corriger : 18, 46, 74).
update lesson_items
set audio_url = '<BASE>/items/' || id || '.mp3'
where item_type in ('letter', 'word')
  and id not in (18, 46, 74);

-- ⏳ Quand les 3 clips ع corrigés (à la main) sont uploadés, exécute ceci :
-- update lesson_items
-- set audio_url = '<BASE>/items/' || id || '.mp3'
-- where id in (18, 46, 74);
