-- ============================================================
-- Tahajji — Branche l'audio des leçons (lettres / mots) sur lesson_items.
-- 1) Enregistre les clips listés dans db/audio_manifest.csv.
-- 2) Nomme chaque fichier items/{id}.mp3 (la colonne « fichier » du manifeste).
-- 3) Upload le dossier dans un bucket Supabase Storage PUBLIC nommé « audio ».
-- 4) Remplace <BASE> ci-dessous par l'URL publique du bucket, puis exécute.
--    Ex : https://<projet>.supabase.co/storage/v1/object/public/audio
-- ============================================================

update lesson_items
set audio_url = '<BASE>/items/' || id || '.mp3'
where item_type in ('letter', 'word');
