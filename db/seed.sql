-- ============================================================
-- Tahajji — Curriculum (généré par scripts/build_curriculum.mjs).
-- Méthode : « La mine des novices pour la lecture du saint Coran » (RECI, Bamako),
-- utilisée avec l'autorisation de l'auteur, fusionnée avec la Qaïda Nourania.
-- Niveau 1 : 28 lettres vocalisées (fatha) + quiz. Niveaux 2-5 : placeholders.
-- À exécuter APRÈS 0001_init.sql. (Le Coran : voir import_quran.sql.)
-- ⚠️ Re-truncate : réinitialise la progression utilisateur (dev).
-- ⚠️ Contenu à FAIRE VALIDER par une autorité avant publication.
-- ============================================================

truncate table quiz_questions, lesson_items, lessons, levels restart identity cascade;

insert into levels (id, position, title, description, is_premium) values
  (1, 1, 'L’alphabet — la voyelle « a »', 'Les 28 lettres lues avec la fatha (a), dans l’ordre de la méthode.', false),
  (2, 2, 'Les voyelles brèves', 'La kasra (i), la dhômma (ou) et le soukoûne.', false),
  (3, 3, 'Les voyelles longues (madd)', 'Allongement par Alif, Yâ et Wâw.', false),
  (4, 4, 'Le tanwîn', 'Les doubles voyelles : -an, -in, -oun.', false),
  (5, 5, 'Règles de lecture', 'Chadda, hamzatoul wasl, lettres solaires et lunaires.', true);

insert into lessons (id, level_id, position, title, lesson_type, is_premium) values
  (1, 1, 1, 'Alif · Bā · Tā · Thā', 'learn', false),
  (2, 1, 2, 'Jīm · Ḥā · Khā · Dāl', 'learn', false),
  (3, 1, 3, 'Dhāl · Rā · Zāy · Sīn', 'learn', false),
  (4, 1, 4, 'Shīn · Ṣād · Ḍād · Ṭā', 'learn', false),
  (5, 1, 5, 'Ẓā · ʿAyn · Ghayn · Fā', 'learn', false),
  (6, 1, 6, 'Qāf · Kāf · Lām · Mīm', 'learn', false),
  (7, 1, 7, 'Nūn · Hā · Wāw · Yā', 'learn', false),
  (8, 2, 1, 'La kasra (i)', 'learn', false),
  (9, 2, 2, 'La dhômma (ou)', 'learn', false),
  (10, 2, 3, 'Le soukoûne', 'learn', false),
  (11, 2, 4, 'Révision des voyelles', 'learn', false),
  (12, 3, 1, 'Madd par Alif (â)', 'learn', false),
  (13, 3, 2, 'Madd par Yâ (î)', 'learn', false),
  (14, 3, 3, 'Madd par Wâw (oû)', 'learn', false),
  (15, 4, 1, 'Tanwîn fatha (-an)', 'learn', false),
  (16, 4, 2, 'Tanwîn kasra (-in)', 'learn', false),
  (17, 4, 3, 'Tanwîn dhômma (-oun)', 'learn', false),
  (18, 5, 1, 'La chadda', 'learn', true),
  (19, 5, 2, 'Hamzatoul wasl', 'learn', true),
  (20, 5, 3, 'Lettres solaires et lunaires', 'learn', true),
  (21, 5, 4, 'Lecture de versets', 'learn', true);

insert into lesson_items (id, lesson_id, position, item_type, arabic_text, transliteration, translation_fr, audio_url) values
  (1, 1, 1, 'letter', 'أَ', 'Alif / Hamza', 'Lettre Alif / Hamza — son « a »', null),
  (2, 1, 2, 'letter', 'بَ', 'Bā', 'Lettre Bā — son « b »', null),
  (3, 1, 3, 'letter', 'تَ', 'Tā', 'Lettre Tā — son « t »', null),
  (4, 1, 4, 'letter', 'ثَ', 'Thā', 'Lettre Thā — « th » de l’anglais « think »', null),
  (5, 2, 1, 'letter', 'جَ', 'Jīm', 'Lettre Jīm — son « dj »', null),
  (6, 2, 2, 'letter', 'حَ', 'Ḥā', 'Lettre Ḥā — « h » aspiré, guttural', null),
  (7, 2, 3, 'letter', 'خَ', 'Khā', 'Lettre Khā — « kh » raclé', null),
  (8, 2, 4, 'letter', 'دَ', 'Dāl', 'Lettre Dāl — son « d »', null),
  (9, 3, 1, 'letter', 'ذَ', 'Dhāl', 'Lettre Dhāl — « th » de l’anglais « this »', null),
  (10, 3, 2, 'letter', 'رَ', 'Rā', 'Lettre Rā — « r » roulé', null),
  (11, 3, 3, 'letter', 'زَ', 'Zāy', 'Lettre Zāy — son « z »', null),
  (12, 3, 4, 'letter', 'سَ', 'Sīn', 'Lettre Sīn — son « s »', null),
  (13, 4, 1, 'letter', 'شَ', 'Shīn', 'Lettre Shīn — son « ch »', null),
  (14, 4, 2, 'letter', 'صَ', 'Ṣād', 'Lettre Ṣād — « s » emphatique', null),
  (15, 4, 3, 'letter', 'ضَ', 'Ḍād', 'Lettre Ḍād — « d » emphatique', null),
  (16, 4, 4, 'letter', 'طَ', 'Ṭā', 'Lettre Ṭā — « t » emphatique', null),
  (17, 5, 1, 'letter', 'ظَ', 'Ẓā', 'Lettre Ẓā — « dh » emphatique', null),
  (18, 5, 2, 'letter', 'عَ', 'ʿAyn', 'Lettre ʿAyn — son guttural profond', null),
  (19, 5, 3, 'letter', 'غَ', 'Ghayn', 'Lettre Ghayn — « r » grasseyé', null),
  (20, 5, 4, 'letter', 'فَ', 'Fā', 'Lettre Fā — son « f »', null),
  (21, 6, 1, 'letter', 'قَ', 'Qāf', 'Lettre Qāf — « k » profond', null),
  (22, 6, 2, 'letter', 'كَ', 'Kāf', 'Lettre Kāf — son « k »', null),
  (23, 6, 3, 'letter', 'لَ', 'Lām', 'Lettre Lām — son « l »', null),
  (24, 6, 4, 'letter', 'مَ', 'Mīm', 'Lettre Mīm — son « m »', null),
  (25, 7, 1, 'letter', 'نَ', 'Nūn', 'Lettre Nūn — son « n »', null),
  (26, 7, 2, 'letter', 'هَ', 'Hā', 'Lettre Hā — « h » léger', null),
  (27, 7, 3, 'letter', 'وَ', 'Wāw', 'Lettre Wāw — son « w » / « ou »', null),
  (28, 7, 4, 'letter', 'يَ', 'Yā', 'Lettre Yā — son « y » / « i »', null);

insert into quiz_questions (id, lesson_id, position, question_type, prompt, arabic_text, audio_url, correct_answer, options) values
  (1, 1, 1, 'recognize_letter', 'Quelle lettre se lit « a » ?', 'أَ', null, 'أَ', '["أَ","حَ","سَ","عَ"]'),
  (2, 1, 2, 'recognize_letter', 'Quelle lettre se lit « ba » ?', 'بَ', null, 'بَ', '["خَ","شَ","غَ","بَ"]'),
  (3, 1, 3, 'recognize_letter', 'Quelle lettre se lit « ta » ?', 'تَ', null, 'تَ', '["صَ","فَ","تَ","دَ"]'),
  (4, 1, 4, 'recognize_letter', 'Quelle lettre se lit « tha » ?', 'ثَ', null, 'ثَ', '["قَ","ثَ","ذَ","ضَ"]'),
  (5, 2, 1, 'recognize_letter', 'Quelle lettre se lit « ja » ?', 'جَ', null, 'جَ', '["جَ","رَ","طَ","كَ"]'),
  (6, 2, 2, 'recognize_letter', 'Quelle lettre se lit « ḥa » ?', 'حَ', null, 'حَ', '["زَ","ظَ","لَ","حَ"]'),
  (7, 2, 3, 'recognize_letter', 'Quelle lettre se lit « kha » ?', 'خَ', null, 'خَ', '["عَ","مَ","خَ","سَ"]'),
  (8, 2, 4, 'recognize_letter', 'Quelle lettre se lit « da » ?', 'دَ', null, 'دَ', '["نَ","دَ","شَ","غَ"]'),
  (9, 3, 1, 'recognize_letter', 'Quelle lettre se lit « dha » ?', 'ذَ', null, 'ذَ', '["ذَ","صَ","فَ","هَ"]'),
  (10, 3, 2, 'recognize_letter', 'Quelle lettre se lit « ra » ?', 'رَ', null, 'رَ', '["ضَ","قَ","وَ","رَ"]'),
  (11, 3, 3, 'recognize_letter', 'Quelle lettre se lit « za » ?', 'زَ', null, 'زَ', '["كَ","يَ","زَ","طَ"]'),
  (12, 3, 4, 'recognize_letter', 'Quelle lettre se lit « sa » ?', 'سَ', null, 'سَ', '["أَ","سَ","ظَ","لَ"]'),
  (13, 4, 1, 'recognize_letter', 'Quelle lettre se lit « cha » ?', 'شَ', null, 'شَ', '["شَ","عَ","مَ","بَ"]'),
  (14, 4, 2, 'recognize_letter', 'Quelle lettre se lit « ṣa » ?', 'صَ', null, 'صَ', '["غَ","نَ","تَ","صَ"]'),
  (15, 4, 3, 'recognize_letter', 'Quelle lettre se lit « ḍa » ?', 'ضَ', null, 'ضَ', '["هَ","ثَ","ضَ","فَ"]'),
  (16, 4, 4, 'recognize_letter', 'Quelle lettre se lit « ṭa » ?', 'طَ', null, 'طَ', '["جَ","طَ","قَ","وَ"]'),
  (17, 5, 1, 'recognize_letter', 'Quelle lettre se lit « ẓa » ?', 'ظَ', null, 'ظَ', '["ظَ","كَ","يَ","حَ"]'),
  (18, 5, 2, 'recognize_letter', 'Quelle lettre se lit « ʿa » ?', 'عَ', null, 'عَ', '["لَ","أَ","خَ","عَ"]'),
  (19, 5, 3, 'recognize_letter', 'Quelle lettre se lit « gha » ?', 'غَ', null, 'غَ', '["بَ","دَ","غَ","مَ"]'),
  (20, 5, 4, 'recognize_letter', 'Quelle lettre se lit « fa » ?', 'فَ', null, 'فَ', '["ذَ","فَ","نَ","تَ"]'),
  (21, 6, 1, 'recognize_letter', 'Quelle lettre se lit « qa » ?', 'قَ', null, 'قَ', '["قَ","هَ","ثَ","رَ"]'),
  (22, 6, 2, 'recognize_letter', 'Quelle lettre se lit « ka » ?', 'كَ', null, 'كَ', '["وَ","جَ","زَ","كَ"]'),
  (23, 6, 3, 'recognize_letter', 'Quelle lettre se lit « la » ?', 'لَ', null, 'لَ', '["حَ","سَ","لَ","يَ"]'),
  (24, 6, 4, 'recognize_letter', 'Quelle lettre se lit « ma » ?', 'مَ', null, 'مَ', '["شَ","مَ","أَ","خَ"]'),
  (25, 7, 1, 'recognize_letter', 'Quelle lettre se lit « na » ?', 'نَ', null, 'نَ', '["نَ","بَ","دَ","صَ"]'),
  (26, 7, 2, 'recognize_letter', 'Quelle lettre se lit « ha » ?', 'هَ', null, 'هَ', '["تَ","ذَ","ضَ","هَ"]'),
  (27, 7, 3, 'recognize_letter', 'Quelle lettre se lit « wa » ?', 'وَ', null, 'وَ', '["رَ","طَ","وَ","ثَ"]'),
  (28, 7, 4, 'recognize_letter', 'Quelle lettre se lit « ya » ?', 'يَ', null, 'يَ', '["ظَ","يَ","جَ","زَ"]');

select setval(pg_get_serial_sequence('levels', 'id'),         (select max(id) from levels));
select setval(pg_get_serial_sequence('lessons', 'id'),        (select max(id) from lessons));
select setval(pg_get_serial_sequence('lesson_items', 'id'),   (select max(id) from lesson_items));
select setval(pg_get_serial_sequence('quiz_questions', 'id'), (select max(id) from quiz_questions));
