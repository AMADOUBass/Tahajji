-- ============================================================
-- Tahajji — Quiz supplémentaires pour les leçons 3, 4 et 5 (unité 1).
-- Script ADDITIF (pas de truncate) : à exécuter une fois dans le SQL Editor.
-- Ne touche pas à la progression utilisateur.
-- ============================================================

insert into quiz_questions (id, lesson_id, position, question_type, prompt, arabic_text, audio_url, correct_answer, options) values
  -- Leçon 3 — Jīm & Ḥā
  (4, 3, 1, 'recognize_letter', 'Quelle lettre se prononce « Jīm » ?', null, null, 'جـ', '["حـ","جـ","خـ","هـ"]'),
  (5, 3, 2, 'recognize_letter', 'Quelle lettre se prononce « Ḥā » ?', null, null, 'حـ', '["جـ","حـ","خـ","عـ"]'),
  -- Leçon 4 — Dāl & Rā
  (6, 4, 1, 'recognize_letter', 'Quelle lettre se prononce « Dāl » ?', null, null, 'د', '["ر","د","ذ","ز"]'),
  (7, 4, 2, 'recognize_letter', 'Quelle lettre se prononce « Rā » ?', null, null, 'ر', '["د","ر","ز","و"]'),
  -- Leçon 5 — Révision de l'unité 1
  (8, 5, 1, 'recognize_letter', 'Quelle est la première lettre de l''alphabet ?', null, null, 'ا', '["بـ","ا","تـ","د"]'),
  (9, 5, 2, 'recognize_letter', 'Quelle lettre se prononce « Tā » ?', null, null, 'تـ', '["ثـ","بـ","تـ","نـ"]'),
  (10, 5, 3, 'recognize_letter', 'Quelle lettre se prononce « Bā » ?', null, null, 'بـ', '["تـ","بـ","نـ","ثـ"]')
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('quiz_questions', 'id'), (select max(id) from quiz_questions));
