-- ============================================================
-- Tahajji — Audio des versets (récupéré en ligne, pas d'enregistrement).
-- Source : everyayah.com — récitateur Mishary Alafasy (128 kbps).
-- Remplit verses.audio_url pour les 6236 versets en une requête.
-- À exécuter APRÈS import_quran_*.sql.
-- ⚠️ Vérifier la licence du récitateur avant un usage commercial.
--    (Pour changer de récitateur, remplace le dossier ci-dessous.)
-- ============================================================

update public.verses
set audio_url =
  'https://everyayah.com/data/Alafasy_128kbps/'
  || lpad(surah_id::text, 3, '0')
  || lpad(number::text, 3, '0')
  || '.mp3';
