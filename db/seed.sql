-- ============================================================
-- Tahajji — Curriculum (généré par scripts/build_curriculum.mjs).
-- Niveau 1 : 28 lettres (14 leçons) + quiz. Niveaux 2-4 : placeholders.
-- À exécuter APRÈS 0001_init.sql. (Le Coran est géré par import_quran.sql.)
-- ⚠️ Re-truncate : réinitialise la progression utilisateur (dev).
-- ⚠️ Contenu à FAIRE VALIDER par une autorité avant publication.
-- ============================================================

truncate table quiz_questions, lesson_items, lessons, levels restart identity cascade;

insert into levels (id, position, title, description, is_premium) values
  (1, 1, 'Les lettres de l’alphabet', 'Reconnais et nomme les 28 lettres dans leur forme isolée.', false),
  (2, 2, 'Les lettres connectées', 'Formes début, milieu et fin de mot.', false),
  (3, 3, 'Les voyelles courtes', 'Fatha, kasra, damma et premières syllabes.', false),
  (4, 4, 'Voyelles longues & règles', 'Soukoun, chadda, tanwîn, voyelles longues.', true);

insert into lessons (id, level_id, position, title, lesson_type, is_premium) values
  (1, 1, 1, 'Alif & Bā', 'learn', false),
  (2, 1, 2, 'Tā & Thā', 'learn', false),
  (3, 1, 3, 'Jīm & Ḥā', 'learn', false),
  (4, 1, 4, 'Khā & Dāl', 'learn', false),
  (5, 1, 5, 'Dhāl & Rā', 'learn', false),
  (6, 1, 6, 'Zāy & Sīn', 'learn', false),
  (7, 1, 7, 'Shīn & Ṣād', 'learn', false),
  (8, 1, 8, 'Ḍād & Ṭā', 'learn', false),
  (9, 1, 9, 'Ẓā & ʿAyn', 'learn', false),
  (10, 1, 10, 'Ghayn & Fā', 'learn', false),
  (11, 1, 11, 'Qāf & Kāf', 'learn', false),
  (12, 1, 12, 'Lām & Mīm', 'learn', false),
  (13, 1, 13, 'Nūn & Hā', 'learn', false),
  (14, 1, 14, 'Wāw & Yā', 'learn', false),
  (15, 2, 1, 'Début de mot', 'learn', false),
  (16, 2, 2, 'Milieu de mot', 'learn', false),
  (17, 2, 3, 'Fin de mot', 'learn', false),
  (18, 3, 1, 'La fatha', 'learn', false),
  (19, 3, 2, 'La kasra', 'learn', false),
  (20, 3, 3, 'La damma', 'learn', false),
  (21, 3, 4, 'Premières syllabes', 'learn', false),
  (22, 4, 1, 'Le soukoun', 'learn', true),
  (23, 4, 2, 'La chadda', 'learn', true),
  (24, 4, 3, 'Le tanwîn', 'learn', true),
  (25, 4, 4, 'Voyelles longues', 'learn', true);

insert into lesson_items (id, lesson_id, position, item_type, arabic_text, transliteration, translation_fr, audio_url) values
  (1, 1, 1, 'letter', 'ا', 'Alif', 'voyelle longue « a »', null),
  (2, 1, 2, 'letter', 'ب', 'Bā', 'se prononce « b »', null),
  (3, 2, 1, 'letter', 'ت', 'Tā', 'se prononce « t »', null),
  (4, 2, 2, 'letter', 'ث', 'Thā', '« th » de l’anglais « think »', null),
  (5, 3, 1, 'letter', 'ج', 'Jīm', 'se prononce « dj »', null),
  (6, 3, 2, 'letter', 'ح', 'Ḥā', '« h » aspiré, guttural', null),
  (7, 4, 1, 'letter', 'خ', 'Khā', '« kh » raclé (jota espagnole)', null),
  (8, 4, 2, 'letter', 'د', 'Dāl', 'se prononce « d »', null),
  (9, 5, 1, 'letter', 'ذ', 'Dhāl', '« th » de l’anglais « this »', null),
  (10, 5, 2, 'letter', 'ر', 'Rā', '« r » roulé', null),
  (11, 6, 1, 'letter', 'ز', 'Zāy', 'se prononce « z »', null),
  (12, 6, 2, 'letter', 'س', 'Sīn', 'se prononce « s »', null),
  (13, 7, 1, 'letter', 'ش', 'Shīn', 'se prononce « ch »', null),
  (14, 7, 2, 'letter', 'ص', 'Ṣād', '« s » emphatique', null),
  (15, 8, 1, 'letter', 'ض', 'Ḍād', '« d » emphatique', null),
  (16, 8, 2, 'letter', 'ط', 'Ṭā', '« t » emphatique', null),
  (17, 9, 1, 'letter', 'ظ', 'Ẓā', '« dh » emphatique', null),
  (18, 9, 2, 'letter', 'ع', 'ʿAyn', 'son guttural profond', null),
  (19, 10, 1, 'letter', 'غ', 'Ghayn', '« r » grasseyé (gh)', null),
  (20, 10, 2, 'letter', 'ف', 'Fā', 'se prononce « f »', null),
  (21, 11, 1, 'letter', 'ق', 'Qāf', '« k » profond (q)', null),
  (22, 11, 2, 'letter', 'ك', 'Kāf', 'se prononce « k »', null),
  (23, 12, 1, 'letter', 'ل', 'Lām', 'se prononce « l »', null),
  (24, 12, 2, 'letter', 'م', 'Mīm', 'se prononce « m »', null),
  (25, 13, 1, 'letter', 'ن', 'Nūn', 'se prononce « n »', null),
  (26, 13, 2, 'letter', 'ه', 'Hā', '« h » léger', null),
  (27, 14, 1, 'letter', 'و', 'Wāw', 'semi-voyelle « w » / « ou »', null),
  (28, 14, 2, 'letter', 'ي', 'Yā', 'semi-voyelle « y » / « i »', null);

insert into quiz_questions (id, lesson_id, position, question_type, prompt, arabic_text, audio_url, correct_answer, options) values
  (1, 1, 1, 'recognize_letter', 'Quelle lettre se prononce « Alif » ?', 'ا', null, 'ا', '["ا","ث","د","ش"]'),
  (2, 1, 2, 'recognize_letter', 'Quelle lettre se prononce « Bā » ?', 'ب', null, 'ب', '["ج","ذ","ص","ب"]'),
  (3, 2, 1, 'recognize_letter', 'Quelle lettre se prononce « Tā » ?', 'ت', null, 'ت', '["ر","ض","ت","ح"]'),
  (4, 2, 2, 'recognize_letter', 'Quelle lettre se prononce « Thā » ?', 'ث', null, 'ث', '["ط","ث","خ","ز"]'),
  (5, 3, 1, 'recognize_letter', 'Quelle lettre se prononce « Jīm » ?', 'ج', null, 'ج', '["ج","د","س","ظ"]'),
  (6, 3, 2, 'recognize_letter', 'Quelle lettre se prononce « Ḥā » ?', 'ح', null, 'ح', '["ذ","ش","ع","ح"]'),
  (7, 4, 1, 'recognize_letter', 'Quelle lettre se prononce « Khā » ?', 'خ', null, 'خ', '["ص","غ","خ","ر"]'),
  (8, 4, 2, 'recognize_letter', 'Quelle lettre se prononce « Dāl » ?', 'د', null, 'د', '["ف","د","ز","ض"]'),
  (9, 5, 1, 'recognize_letter', 'Quelle lettre se prononce « Dhāl » ?', 'ذ', null, 'ذ', '["ذ","س","ط","ق"]'),
  (10, 5, 2, 'recognize_letter', 'Quelle lettre se prononce « Rā » ?', 'ر', null, 'ر', '["ش","ظ","ك","ر"]'),
  (11, 6, 1, 'recognize_letter', 'Quelle lettre se prononce « Zāy » ?', 'ز', null, 'ز', '["ع","ل","ز","ص"]'),
  (12, 6, 2, 'recognize_letter', 'Quelle lettre se prononce « Sīn » ?', 'س', null, 'س', '["م","س","ض","غ"]'),
  (13, 7, 1, 'recognize_letter', 'Quelle lettre se prononce « Shīn » ?', 'ش', null, 'ش', '["ش","ط","ف","ن"]'),
  (14, 7, 2, 'recognize_letter', 'Quelle lettre se prononce « Ṣād » ?', 'ص', null, 'ص', '["ظ","ق","ه","ص"]'),
  (15, 8, 1, 'recognize_letter', 'Quelle lettre se prononce « Ḍād » ?', 'ض', null, 'ض', '["ك","و","ض","ع"]'),
  (16, 8, 2, 'recognize_letter', 'Quelle lettre se prononce « Ṭā » ?', 'ط', null, 'ط', '["ي","ط","غ","ل"]'),
  (17, 9, 1, 'recognize_letter', 'Quelle lettre se prononce « Ẓā » ?', 'ظ', null, 'ظ', '["ظ","ف","م","ا"]'),
  (18, 9, 2, 'recognize_letter', 'Quelle lettre se prononce « ʿAyn » ?', 'ع', null, 'ع', '["ق","ن","ب","ع"]'),
  (19, 10, 1, 'recognize_letter', 'Quelle lettre se prononce « Ghayn » ?', 'غ', null, 'غ', '["ه","ت","غ","ك"]'),
  (20, 10, 2, 'recognize_letter', 'Quelle lettre se prononce « Fā » ?', 'ف', null, 'ف', '["ث","ف","ل","و"]'),
  (21, 11, 1, 'recognize_letter', 'Quelle lettre se prononce « Qāf » ?', 'ق', null, 'ق', '["ق","م","ي","ج"]'),
  (22, 11, 2, 'recognize_letter', 'Quelle lettre se prononce « Kāf » ?', 'ك', null, 'ك', '["ن","ا","ح","ك"]'),
  (23, 12, 1, 'recognize_letter', 'Quelle lettre se prononce « Lām » ?', 'ل', null, 'ل', '["ب","خ","ل","ه"]'),
  (24, 12, 2, 'recognize_letter', 'Quelle lettre se prononce « Mīm » ?', 'م', null, 'م', '["د","م","و","ت"]'),
  (25, 13, 1, 'recognize_letter', 'Quelle lettre se prononce « Nūn » ?', 'ن', null, 'ن', '["ن","ي","ث","ذ"]'),
  (26, 13, 2, 'recognize_letter', 'Quelle lettre se prononce « Hā » ?', 'ه', null, 'ه', '["ا","ج","ر","ه"]'),
  (27, 14, 1, 'recognize_letter', 'Quelle lettre se prononce « Wāw » ?', 'و', null, 'و', '["ح","ز","و","ب"]'),
  (28, 14, 2, 'recognize_letter', 'Quelle lettre se prononce « Yā » ?', 'ي', null, 'ي', '["س","ي","ت","خ"]');

select setval(pg_get_serial_sequence('levels', 'id'),         (select max(id) from levels));
select setval(pg_get_serial_sequence('lessons', 'id'),        (select max(id) from lessons));
select setval(pg_get_serial_sequence('lesson_items', 'id'),   (select max(id) from lesson_items));
select setval(pg_get_serial_sequence('quiz_questions', 'id'), (select max(id) from quiz_questions));
