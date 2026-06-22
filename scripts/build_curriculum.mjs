/**
 * Génère db/seed.sql — curriculum.
 * Basé sur la méthode « La mine des novices pour la lecture du saint Coran »
 * (RECI, Bamako) — utilisée avec l'autorisation de l'auteur — fusionnée avec
 * la progression Qaïda Nourania.
 *
 * Niveau 1 : les 28 lettres VOCALISÉES avec la fatha (a), dans l'ordre de la
 * méthode, en petites leçons de 4 lettres + un quiz par lettre.
 * Niveaux 2-5 : structure de la méthode (placeholders à détailler ensuite).
 *
 * Usage : node scripts/build_curriculum.mjs
 * ⚠️ Contenu à FAIRE VALIDER par une autorité avant publication.
 */
import { writeFileSync } from 'node:fs';

const esc = (s) => String(s).replace(/'/g, "''");

// [forme vocalisée (fatha), nom, son (translittération), description]
const LETTERS = [
  ['أَ', 'Alif / Hamza', 'a', 'son « a »'],
  ['بَ', 'Bā', 'ba', 'son « b »'],
  ['تَ', 'Tā', 'ta', 'son « t »'],
  ['ثَ', 'Thā', 'tha', '« th » de l’anglais « think »'],
  ['جَ', 'Jīm', 'ja', 'son « dj »'],
  ['حَ', 'Ḥā', 'ḥa', '« h » aspiré, guttural'],
  ['خَ', 'Khā', 'kha', '« kh » raclé'],
  ['دَ', 'Dāl', 'da', 'son « d »'],
  ['ذَ', 'Dhāl', 'dha', '« th » de l’anglais « this »'],
  ['رَ', 'Rā', 'ra', '« r » roulé'],
  ['زَ', 'Zāy', 'za', 'son « z »'],
  ['سَ', 'Sīn', 'sa', 'son « s »'],
  ['شَ', 'Shīn', 'cha', 'son « ch »'],
  ['صَ', 'Ṣād', 'ṣa', '« s » emphatique'],
  ['ضَ', 'Ḍād', 'ḍa', '« d » emphatique'],
  ['طَ', 'Ṭā', 'ṭa', '« t » emphatique'],
  ['ظَ', 'Ẓā', 'ẓa', '« dh » emphatique'],
  ['عَ', 'ʿAyn', 'ʿa', 'son guttural profond'],
  ['غَ', 'Ghayn', 'gha', '« r » grasseyé'],
  ['فَ', 'Fā', 'fa', 'son « f »'],
  ['قَ', 'Qāf', 'qa', '« k » profond'],
  ['كَ', 'Kāf', 'ka', 'son « k »'],
  ['لَ', 'Lām', 'la', 'son « l »'],
  ['مَ', 'Mīm', 'ma', 'son « m »'],
  ['نَ', 'Nūn', 'na', 'son « n »'],
  ['هَ', 'Hā', 'ha', '« h » léger'],
  ['وَ', 'Wāw', 'wa', 'son « w » / « ou »'],
  ['يَ', 'Yā', 'ya', 'son « y » / « i »'],
];

const LESSON_SIZE = 4;

const levels = [];
const lessons = [];
const items = [];
const quizzes = [];
let lessonId = 0;
let itemId = 0;
let quizId = 0;

// ---------- Niveau 1 : l'alphabet avec la fatha ----------
levels.push([1, 1, 'L’alphabet — la voyelle « a »', 'Les 28 lettres lues avec la fatha (a), dans l’ordre de la méthode.', false]);

for (let i = 0; i < LETTERS.length; i += LESSON_SIZE) {
  const group = LETTERS.slice(i, i + LESSON_SIZE);
  lessonId += 1;
  lessons.push([lessonId, 1, lessonId, group.map((l) => l[1].split(' ')[0]).join(' · '), 'learn', false]);

  group.forEach(([voc, name, , desc], idx) => {
    itemId += 1;
    items.push([itemId, lessonId, idx + 1, 'letter', voc, name, `Lettre ${name} — ${desc}`]);
  });

  group.forEach(([voc, , sound], idx) => {
    quizId += 1;
    const correctIndex = i + idx;
    const distractors = [correctIndex + 5, correctIndex + 11, correctIndex + 17]
      .map((n) => LETTERS[n % LETTERS.length][0])
      .filter((d) => d !== voc);
    let k = 1;
    while (distractors.length < 3) {
      const cand = LETTERS[(correctIndex + k) % LETTERS.length][0];
      if (cand !== voc && !distractors.includes(cand)) distractors.push(cand);
      k += 1;
    }
    const options = [voc, ...distractors.slice(0, 3)];
    const rot = correctIndex % 4;
    const rotated = options.slice(rot).concat(options.slice(0, rot));
    quizzes.push([quizId, lessonId, idx + 1, 'recognize_letter', `Quelle lettre se lit « ${sound} » ?`, voc, JSON.stringify(rotated)]);
  });
}

// ---------- Niveaux 2-5 : progression de la méthode (placeholders) ----------
const more = [
  [2, 2, 'Les voyelles brèves', 'La kasra (i), la dhômma (ou) et le soukoûne.', false,
    ['La kasra (i)', 'La dhômma (ou)', 'Le soukoûne', 'Révision des voyelles']],
  [3, 3, 'Les voyelles longues (madd)', 'Allongement par Alif, Yâ et Wâw.', false,
    ['Madd par Alif (â)', 'Madd par Yâ (î)', 'Madd par Wâw (oû)']],
  [4, 4, 'Le tanwîn', 'Les doubles voyelles : -an, -in, -oun.', false,
    ['Tanwîn fatha (-an)', 'Tanwîn kasra (-in)', 'Tanwîn dhômma (-oun)']],
  [5, 5, 'Règles de lecture', 'Chadda, hamzatoul wasl, lettres solaires et lunaires.', true,
    ['La chadda', 'Hamzatoul wasl', 'Lettres solaires et lunaires', 'Lecture de versets']],
];
for (const [id, pos, title, desc, premium, titles] of more) {
  levels.push([id, pos, title, desc, premium]);
  titles.forEach((t, idx) => {
    lessonId += 1;
    lessons.push([lessonId, id, idx + 1, t, 'learn', premium]);
  });
}

const sql = `-- ============================================================
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
${levels.map((l) => `  (${l[0]}, ${l[1]}, '${esc(l[2])}', '${esc(l[3])}', ${l[4]})`).join(',\n')};

insert into lessons (id, level_id, position, title, lesson_type, is_premium) values
${lessons.map((l) => `  (${l[0]}, ${l[1]}, ${l[2]}, '${esc(l[3])}', '${l[4]}', ${l[5]})`).join(',\n')};

insert into lesson_items (id, lesson_id, position, item_type, arabic_text, transliteration, translation_fr, audio_url) values
${items.map((it) => `  (${it[0]}, ${it[1]}, ${it[2]}, '${it[3]}', '${esc(it[4])}', '${esc(it[5])}', '${esc(it[6])}', null)`).join(',\n')};

insert into quiz_questions (id, lesson_id, position, question_type, prompt, arabic_text, audio_url, correct_answer, options) values
${quizzes.map((q) => `  (${q[0]}, ${q[1]}, ${q[2]}, '${q[3]}', '${esc(q[4])}', '${esc(q[5])}', null, '${esc(q[5])}', '${esc(q[6])}')`).join(',\n')};

select setval(pg_get_serial_sequence('levels', 'id'),         (select max(id) from levels));
select setval(pg_get_serial_sequence('lessons', 'id'),        (select max(id) from lessons));
select setval(pg_get_serial_sequence('lesson_items', 'id'),   (select max(id) from lesson_items));
select setval(pg_get_serial_sequence('quiz_questions', 'id'), (select max(id) from quiz_questions));
`;

writeFileSync('db/seed.sql', sql, 'utf8');
console.log(`OK — ${levels.length} niveaux, ${lessons.length} leçons, ${items.length} lettres, ${quizzes.length} quiz → db/seed.sql`);
