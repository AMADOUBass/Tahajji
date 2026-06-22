-- ============================================================
-- Tahajji — Données de départ (curriculum + Coran).
-- À exécuter APRÈS 0001_init.sql, dans Supabase → SQL Editor.
-- Idempotent : vide les tables de contenu puis réinsère.
-- ⚠️ Le truncate (cascade) réinitialise aussi la progression de test.
-- (Ne concerne pas la prod ; en dev c'est attendu.)
--
-- NB : translittération = nom de la lettre avec diacritiques ;
--      translation_fr = aide à la prononciation en français.
--      Contenu généré — À FAIRE VALIDER par une autorité avant publication.
-- ============================================================

truncate table verses, surahs, quiz_questions, lesson_items, lessons, levels restart identity cascade;

-- ========== NIVEAUX ==========
insert into levels (id, position, title, description, is_premium) values
  (1, 1, 'L''alphabet arabe', 'Les 28 lettres : forme, nom et prononciation.', false),
  (2, 2, 'Les lettres connectées', 'Les formes début, milieu et fin de mot.', false),
  (3, 3, 'Les voyelles courtes', 'Fatha, kasra, damma et les premières syllabes.', false),
  (4, 4, 'Voyelles longues & règles', 'Soukoun, chadda, tanwîn et voyelles longues.', true);

-- ========== LEÇONS ==========
insert into lessons (id, level_id, position, title, lesson_type, is_premium) values
  -- Niveau 1 : l'alphabet, 2 lettres par leçon
  (1, 1, 1, 'Alif & Bāʾ', 'learn', false),
  (2, 1, 2, 'Tāʾ & Thāʾ', 'learn', false),
  (3, 1, 3, 'Jīm & Ḥāʾ', 'learn', false),
  (4, 1, 4, 'Khāʾ & Dāl', 'learn', false),
  (5, 1, 5, 'Dhāl & Rāʾ', 'learn', false),
  (6, 1, 6, 'Zāy & Sīn', 'learn', false),
  (7, 1, 7, 'Shīn & Ṣād', 'learn', false),
  (8, 1, 8, 'Ḍād & Ṭāʾ', 'learn', false),
  (9, 1, 9, 'Ẓāʾ & ʿAyn', 'learn', false),
  (10, 1, 10, 'Ghayn & Fāʾ', 'learn', false),
  (11, 1, 11, 'Qāf & Kāf', 'learn', false),
  (12, 1, 12, 'Lām & Mīm', 'learn', false),
  (13, 1, 13, 'Nūn & Hāʾ', 'learn', false),
  (14, 1, 14, 'Wāw & Yāʾ', 'learn', false),
  (15, 1, 15, 'Révision de l''alphabet', 'exam', false),
  -- Niveau 2 (contenu à compléter depuis le document)
  (16, 2, 1, 'Début de mot', 'learn', false),
  (17, 2, 2, 'Milieu & fin', 'learn', false),
  (18, 2, 3, 'Mots simples', 'practice', false),
  -- Niveau 3
  (19, 3, 1, 'La fatha', 'learn', false),
  (20, 3, 2, 'Kasra & damma', 'learn', false),
  -- Niveau 4 (premium)
  (21, 4, 1, 'Le soukoun', 'learn', true),
  (22, 4, 2, 'La chadda', 'learn', true);

-- ========== ITEMS DE LEÇON (les 28 lettres) ==========
insert into lesson_items (id, lesson_id, position, item_type, arabic_text, transliteration, translation_fr, audio_url) values
  (1, 1, 1, 'letter', 'ا', 'Alif', 'son « a / â » (sert aussi d''allongement)', null),
  (2, 1, 2, 'letter', 'ب', 'Bāʾ', 'son « b » comme dans bateau', null),
  (3, 2, 1, 'letter', 'ت', 'Tāʾ', 'son « t » comme dans table', null),
  (4, 2, 2, 'letter', 'ث', 'Thāʾ', '« th » doux, langue entre les dents (anglais think)', null),
  (5, 3, 1, 'letter', 'ج', 'Jīm', 'son « dj » comme dans Djamel', null),
  (6, 3, 2, 'letter', 'ح', 'Ḥāʾ', '« h » fortement expiré, du fond de la gorge', null),
  (7, 4, 1, 'letter', 'خ', 'Khāʾ', '« kh » râclé (comme la jota espagnole)', null),
  (8, 4, 2, 'letter', 'د', 'Dāl', 'son « d » comme dans dattes', null),
  (9, 5, 1, 'letter', 'ذ', 'Dhāl', '« dh » sonore (anglais this)', null),
  (10, 5, 2, 'letter', 'ر', 'Rāʾ', 'son « r » roulé', null),
  (11, 6, 1, 'letter', 'ز', 'Zāy', 'son « z » comme dans zéro', null),
  (12, 6, 2, 'letter', 'س', 'Sīn', 'son « s » comme dans salam', null),
  (13, 7, 1, 'letter', 'ش', 'Shīn', 'son « ch » comme dans chat', null),
  (14, 7, 2, 'letter', 'ص', 'Ṣād', '« s » emphatique (lourd, sourd)', null),
  (15, 8, 1, 'letter', 'ض', 'Ḍād', '« d » emphatique (lourd)', null),
  (16, 8, 2, 'letter', 'ط', 'Ṭāʾ', '« t » emphatique (lourd)', null),
  (17, 9, 1, 'letter', 'ظ', 'Ẓāʾ', '« dh » emphatique (lourd)', null),
  (18, 9, 2, 'letter', 'ع', 'ʿAyn', 'son guttural « ʿ » (constriction de la gorge)', null),
  (19, 10, 1, 'letter', 'غ', 'Ghayn', '« gh » grasseyé (proche du r français)', null),
  (20, 10, 2, 'letter', 'ف', 'Fāʾ', 'son « f » comme dans fleur', null),
  (21, 11, 1, 'letter', 'ق', 'Qāf', '« q » profond, du fond de la gorge', null),
  (22, 11, 2, 'letter', 'ك', 'Kāf', 'son « k » comme dans kilo', null),
  (23, 12, 1, 'letter', 'ل', 'Lām', 'son « l » comme dans lune', null),
  (24, 12, 2, 'letter', 'م', 'Mīm', 'son « m » comme dans maman', null),
  (25, 13, 1, 'letter', 'ن', 'Nūn', 'son « n » comme dans non', null),
  (26, 13, 2, 'letter', 'ه', 'Hāʾ', '« h » léger (souffle doux)', null),
  (27, 14, 1, 'letter', 'و', 'Wāw', 'son « w / ou » (sert aussi d''allongement)', null),
  (28, 14, 2, 'letter', 'ي', 'Yāʾ', 'son « y / î » (sert aussi d''allongement)', null);

-- ========== QUIZ (reconnaissance de lettre par son nom) ==========
insert into quiz_questions (id, lesson_id, position, question_type, prompt, arabic_text, audio_url, correct_answer, options) values
  (1, 1, 1, 'recognize_letter', 'Quelle lettre se nomme « Alif » ?', null, null, 'ا', '["ل","ا","ر","و"]'),
  (2, 1, 2, 'recognize_letter', 'Quelle lettre se nomme « Bāʾ » ?', null, null, 'ب', '["ب","ت","ث","ن"]'),
  (3, 2, 1, 'recognize_letter', 'Quelle lettre se nomme « Tāʾ » ?', null, null, 'ت', '["ث","ت","ب","ن"]'),
  (4, 2, 2, 'recognize_letter', 'Quelle lettre se nomme « Thāʾ » ?', null, null, 'ث', '["ت","ب","ث","ش"]'),
  (5, 3, 1, 'recognize_letter', 'Quelle lettre se nomme « Jīm » ?', null, null, 'ج', '["ج","ح","خ","ه"]'),
  (6, 3, 2, 'recognize_letter', 'Quelle lettre se nomme « Ḥāʾ » ?', null, null, 'ح', '["خ","ج","ح","ع"]'),
  (7, 4, 1, 'recognize_letter', 'Quelle lettre se nomme « Khāʾ » ?', null, null, 'خ', '["ح","خ","ج","غ"]'),
  (8, 4, 2, 'recognize_letter', 'Quelle lettre se nomme « Dāl » ?', null, null, 'د', '["ذ","ر","د","ز"]'),
  (9, 5, 1, 'recognize_letter', 'Quelle lettre se nomme « Dhāl » ?', null, null, 'ذ', '["د","ذ","ر","ز"]'),
  (10, 5, 2, 'recognize_letter', 'Quelle lettre se nomme « Rāʾ » ?', null, null, 'ر', '["ز","ر","د","و"]'),
  (11, 6, 1, 'recognize_letter', 'Quelle lettre se nomme « Zāy » ?', null, null, 'ز', '["ر","د","ز","ذ"]'),
  (12, 6, 2, 'recognize_letter', 'Quelle lettre se nomme « Sīn » ?', null, null, 'س', '["ش","س","ص","ض"]'),
  (13, 7, 1, 'recognize_letter', 'Quelle lettre se nomme « Shīn » ?', null, null, 'ش', '["س","ش","ص","ث"]'),
  (14, 7, 2, 'recognize_letter', 'Quelle lettre se nomme « Ṣād » ?', null, null, 'ص', '["ض","س","ص","ش"]'),
  (15, 8, 1, 'recognize_letter', 'Quelle lettre se nomme « Ḍād » ?', null, null, 'ض', '["ص","ض","ط","ظ"]'),
  (16, 8, 2, 'recognize_letter', 'Quelle lettre se nomme « Ṭāʾ » ?', null, null, 'ط', '["ظ","ص","ط","ض"]'),
  (17, 9, 1, 'recognize_letter', 'Quelle lettre se nomme « Ẓāʾ » ?', null, null, 'ظ', '["ط","ض","ظ","ص"]'),
  (18, 9, 2, 'recognize_letter', 'Quelle lettre se nomme « ʿAyn » ?', null, null, 'ع', '["غ","ع","ح","خ"]'),
  (19, 10, 1, 'recognize_letter', 'Quelle lettre se nomme « Ghayn » ?', null, null, 'غ', '["ع","غ","خ","ح"]'),
  (20, 10, 2, 'recognize_letter', 'Quelle lettre se nomme « Fāʾ » ?', null, null, 'ف', '["ق","ف","و","ث"]'),
  (21, 11, 1, 'recognize_letter', 'Quelle lettre se nomme « Qāf » ?', null, null, 'ق', '["ف","ق","ك","و"]'),
  (22, 11, 2, 'recognize_letter', 'Quelle lettre se nomme « Kāf » ?', null, null, 'ك', '["ك","ل","ق","م"]'),
  (23, 12, 1, 'recognize_letter', 'Quelle lettre se nomme « Lām » ?', null, null, 'ل', '["ك","ا","ل","م"]'),
  (24, 12, 2, 'recognize_letter', 'Quelle lettre se nomme « Mīm » ?', null, null, 'م', '["ن","م","ل","ه"]'),
  (25, 13, 1, 'recognize_letter', 'Quelle lettre se nomme « Nūn » ?', null, null, 'ن', '["ت","ن","ب","ي"]'),
  (26, 13, 2, 'recognize_letter', 'Quelle lettre se nomme « Hāʾ » ?', null, null, 'ه', '["م","ه","ع","و"]'),
  (27, 14, 1, 'recognize_letter', 'Quelle lettre se nomme « Wāw » ?', null, null, 'و', '["ر","و","ز","ف"]'),
  (28, 14, 2, 'recognize_letter', 'Quelle lettre se nomme « Yāʾ » ?', null, null, 'ي', '["ن","ب","ي","ت"]'),
  -- Révision (mélange)
  (29, 15, 1, 'recognize_letter', 'Quelle lettre se nomme « Alif » ?', null, null, 'ا', '["ع","ا","ل","ي"]'),
  (30, 15, 2, 'recognize_letter', 'Quelle lettre se nomme « Mīm » ?', null, null, 'م', '["م","ن","ه","ل"]'),
  (31, 15, 3, 'recognize_letter', 'Quelle lettre se nomme « Ṣād » ?', null, null, 'ص', '["ض","س","ص","ط"]'),
  (32, 15, 4, 'recognize_letter', 'Quelle lettre se nomme « Qāf » ?', null, null, 'ق', '["ف","ك","ق","ع"]');

-- ========== SOURATES (échantillon du Juz ''Amma + ouverture) ==========
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

-- ========== RÉINITIALISER LES SÉQUENCES ==========
select setval(pg_get_serial_sequence('levels', 'id'),         (select max(id) from levels));
select setval(pg_get_serial_sequence('lessons', 'id'),        (select max(id) from lessons));
select setval(pg_get_serial_sequence('lesson_items', 'id'),   (select max(id) from lesson_items));
select setval(pg_get_serial_sequence('quiz_questions', 'id'), (select max(id) from quiz_questions));
select setval(pg_get_serial_sequence('surahs', 'id'),         (select max(id) from surahs));
select setval(pg_get_serial_sequence('verses', 'id'),         (select max(id) from verses));
