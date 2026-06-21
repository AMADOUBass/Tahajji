-- ============================================================
-- Tahajji — Données de départ (contenu pédagogique + Coran).
-- À exécuter APRÈS 0001_init.sql, dans Supabase → SQL Editor.
-- Idempotent : on vide les tables de contenu puis on réinsère.
-- (Ne touche pas aux données utilisateur : profiles / user_progress / ...)
-- ============================================================

truncate table verses, surahs, quiz_questions, lesson_items, lessons, levels restart identity cascade;

-- ========== NIVEAUX ==========
insert into levels (id, position, title, description, is_premium) values
  (1, 1, 'Les lettres de l''alphabet', 'Reconnais et nomme les 28 lettres dans leur forme isolée.', false),
  (2, 2, 'Les lettres connectées', 'Les formes début, milieu et fin de mot.', false),
  (3, 3, 'Les voyelles courtes', 'Fatha, kasra, damma et les premières syllabes.', false),
  (4, 4, 'Voyelles longues & règles', 'Soukoun, chadda, tanwîn et voyelles longues.', true);

-- ========== LEÇONS ==========
insert into lessons (id, level_id, position, title, lesson_type, is_premium) values
  (1, 1, 1, 'Alif & Bā', 'learn', false),
  (2, 1, 2, 'Tā & Thā', 'learn', false),
  (3, 1, 3, 'Jīm & Ḥā', 'learn', false),
  (4, 1, 4, 'Dāl & Rā', 'learn', false),
  (5, 1, 5, 'Révision — Unité 1', 'exam', false),
  (6, 2, 1, 'Début de mot', 'learn', false),
  (7, 2, 2, 'Milieu & fin', 'learn', false),
  (8, 2, 3, 'Mots simples', 'practice', false),
  (9, 3, 1, 'La fatha', 'learn', false),
  (10, 3, 2, 'Kasra & damma', 'learn', false),
  (11, 4, 1, 'Le soukoun', 'learn', true),
  (12, 4, 2, 'La chadda', 'learn', true);

-- ========== ITEMS DE LEÇON ==========
insert into lesson_items (id, lesson_id, position, item_type, arabic_text, transliteration, translation_fr, audio_url) values
  (1, 1, 1, 'letter', 'ا', 'Alif', 'la 1ʳᵉ lettre', null),
  (2, 1, 2, 'letter', 'بـ', 'Bā', 'la 2ᵉ lettre — se prononce « b »', null),
  (3, 2, 1, 'letter', 'تـ', 'Tā', 'se prononce « t »', null),
  (4, 2, 2, 'letter', 'ثـ', 'Thā', 'se prononce « th » (anglais « think »)', null),
  (5, 3, 1, 'letter', 'جـ', 'Jīm', 'se prononce « dj »', null),
  (6, 3, 2, 'letter', 'حـ', 'Ḥā', 'se prononce « h » expiré', null),
  (7, 4, 1, 'letter', 'د', 'Dāl', 'se prononce « d »', null),
  (8, 4, 2, 'letter', 'ر', 'Rā', 'se prononce « r » roulé', null);

-- ========== QUIZ ==========
insert into quiz_questions (id, lesson_id, position, question_type, prompt, arabic_text, audio_url, correct_answer, options) values
  (1, 1, 1, 'recognize_letter', 'Quelle lettre se prononce « Bā » ?', null, null, 'بـ', '["تـ","بـ","نـ","ثـ"]'),
  (2, 1, 2, 'recognize_letter', 'Quelle est la première lettre de l''alphabet ?', null, null, 'ا', '["ر","د","ا","بـ"]'),
  (3, 2, 1, 'recognize_letter', 'Quelle lettre se prononce « Thā » ?', null, null, 'ثـ', '["تـ","ثـ","بـ","نـ"]'),
  (4, 3, 1, 'recognize_letter', 'Quelle lettre se prononce « Jīm » ?', null, null, 'جـ', '["حـ","جـ","خـ","هـ"]'),
  (5, 3, 2, 'recognize_letter', 'Quelle lettre se prononce « Ḥā » ?', null, null, 'حـ', '["جـ","حـ","خـ","عـ"]'),
  (6, 4, 1, 'recognize_letter', 'Quelle lettre se prononce « Dāl » ?', null, null, 'د', '["ر","د","ذ","ز"]'),
  (7, 4, 2, 'recognize_letter', 'Quelle lettre se prononce « Rā » ?', null, null, 'ر', '["د","ر","ز","و"]'),
  (8, 5, 1, 'recognize_letter', 'Quelle est la première lettre de l''alphabet ?', null, null, 'ا', '["بـ","ا","تـ","د"]'),
  (9, 5, 2, 'recognize_letter', 'Quelle lettre se prononce « Tā » ?', null, null, 'تـ', '["ثـ","بـ","تـ","نـ"]'),
  (10, 5, 3, 'recognize_letter', 'Quelle lettre se prononce « Bā » ?', null, null, 'بـ', '["تـ","بـ","نـ","ثـ"]');

-- ========== SOURATES ==========
insert into surahs (id, number, name_ar, name_fr, revelation_type, verse_count) values
  (1, 1, 'الفاتحة', 'L''Ouverture', 'meccan', 7),
  (2, 2, 'البقرة', 'La Vache', 'medinan', 286),
  (3, 3, 'آل عمران', 'La Famille d''Imran', 'medinan', 200),
  (112, 112, 'الإخلاص', 'Le Monothéisme pur', 'meccan', 4),
  (113, 113, 'الفلق', 'L''Aube naissante', 'meccan', 5),
  (114, 114, 'الناس', 'Les Hommes', 'meccan', 6);

-- ========== VERSETS ==========
insert into verses (id, surah_id, number, arabic_text, translation_fr, translation_en, audio_url) values
  (1, 1, 1, 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 'Au nom d''Allah, le Tout Miséricordieux, le Très Miséricordieux.', null, null),
  (2, 1, 2, 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ', 'Louange à Allah, Seigneur de l''univers.', null, null),
  (3, 1, 3, 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', 'Le Tout Miséricordieux, le Très Miséricordieux.', null, null),
  (4, 1, 4, 'مَٰلِكِ يَوْمِ ٱلدِّينِ', 'Maître du Jour de la rétribution.', null, null),
  (5, 1, 5, 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', 'C''est Toi que nous adorons, et c''est Toi dont nous implorons secours.', null, null),
  (6, 1, 6, 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', 'Guide-nous dans le droit chemin.', null, null),
  (7, 1, 7, 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', 'Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.', null, null),
  (8, 112, 1, 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', 'Dis : « Il est Allah, Unique.', null, null),
  (9, 112, 2, 'ٱللَّهُ ٱلصَّمَدُ', 'Allah, Le Seul à être imploré pour ce que nous désirons.', null, null),
  (10, 112, 3, 'لَمْ يَلِدْ وَلَمْ يُولَدْ', 'Il n''a jamais engendré, n''a pas été engendré non plus.', null, null),
  (11, 112, 4, 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', 'Et nul n''est égal à Lui. »', null, null);

-- ========== RÉINITIALISER LES SÉQUENCES (ids explicites ci-dessus) ==========
select setval(pg_get_serial_sequence('levels', 'id'),         (select max(id) from levels));
select setval(pg_get_serial_sequence('lessons', 'id'),        (select max(id) from lessons));
select setval(pg_get_serial_sequence('lesson_items', 'id'),   (select max(id) from lesson_items));
select setval(pg_get_serial_sequence('quiz_questions', 'id'), (select max(id) from quiz_questions));
select setval(pg_get_serial_sequence('surahs', 'id'),         (select max(id) from surahs));
select setval(pg_get_serial_sequence('verses', 'id'),         (select max(id) from verses));
