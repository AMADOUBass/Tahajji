/**
 * Génère db/seed.sql — curriculum complet.
 * Niveau 1 = les 28 lettres (formes isolées) en 14 leçons de 2 lettres,
 * chaque leçon a ses 2 lettres (lesson_items) + 2 questions de quiz.
 * Niveaux 2-4 = leçons placeholder (à remplir depuis le document pédagogique).
 *
 * Usage : node scripts/build_curriculum.mjs
 * ⚠️ Contenu à FAIRE VALIDER par une autorité avant publication.
 */
import { writeFileSync } from 'node:fs';

const esc = (s) => String(s).replace(/'/g, "''");

// Les 28 lettres (forme isolée, nom, son court, description).
const LETTERS = [
  ['ا', 'Alif', 'â', 'voyelle longue « a »'],
  ['ب', 'Bā', 'b', 'se prononce « b »'],
  ['ت', 'Tā', 't', 'se prononce « t »'],
  ['ث', 'Thā', 'th', '« th » de l’anglais « think »'],
  ['ج', 'Jīm', 'dj', 'se prononce « dj »'],
  ['ح', 'Ḥā', 'ḥ', '« h » aspiré, guttural'],
  ['خ', 'Khā', 'kh', '« kh » raclé (jota espagnole)'],
  ['د', 'Dāl', 'd', 'se prononce « d »'],
  ['ذ', 'Dhāl', 'dh', '« th » de l’anglais « this »'],
  ['ر', 'Rā', 'r', '« r » roulé'],
  ['ز', 'Zāy', 'z', 'se prononce « z »'],
  ['س', 'Sīn', 's', 'se prononce « s »'],
  ['ش', 'Shīn', 'ch', 'se prononce « ch »'],
  ['ص', 'Ṣād', 'ṣ', '« s » emphatique'],
  ['ض', 'Ḍād', 'ḍ', '« d » emphatique'],
  ['ط', 'Ṭā', 'ṭ', '« t » emphatique'],
  ['ظ', 'Ẓā', 'ẓ', '« dh » emphatique'],
  ['ع', 'ʿAyn', 'ʿ', 'son guttural profond'],
  ['غ', 'Ghayn', 'gh', '« r » grasseyé (gh)'],
  ['ف', 'Fā', 'f', 'se prononce « f »'],
  ['ق', 'Qāf', 'q', '« k » profond (q)'],
  ['ك', 'Kāf', 'k', 'se prononce « k »'],
  ['ل', 'Lām', 'l', 'se prononce « l »'],
  ['م', 'Mīm', 'm', 'se prononce « m »'],
  ['ن', 'Nūn', 'n', 'se prononce « n »'],
  ['ه', 'Hā', 'h', '« h » léger'],
  ['و', 'Wāw', 'w / ou', 'semi-voyelle « w » / « ou »'],
  ['ي', 'Yā', 'y / i', 'semi-voyelle « y » / « i »'],
];

const levels = [];
const lessons = [];
const items = [];
const quizzes = [];

let lessonId = 0;
let itemId = 0;
let quizId = 0;

// ---------- Niveau 1 : alphabet ----------
levels.push([1, 1, 'Les lettres de l’alphabet', 'Reconnais et nomme les 28 lettres dans leur forme isolée.', false]);

for (let i = 0; i < LETTERS.length; i += 2) {
  const pair = LETTERS.slice(i, i + 2);
  lessonId += 1;
  const position = lessonId;
  const title = pair.map((l) => l[1]).join(' & ');
  lessons.push([lessonId, 1, position, title, 'learn', false]);

  for (const [ar, name, , desc] of pair) {
    itemId += 1;
    items.push([itemId, lessonId, items.filter((x) => x[1] === lessonId).length + 1, 'letter', ar, name, desc]);
  }

  // Une question par lettre de la leçon.
  pair.forEach(([ar, name], idx) => {
    quizId += 1;
    // 3 distracteurs déterministes pris ailleurs dans l'alphabet.
    const correctIndex = i + idx;
    const distractors = [correctIndex + 3, correctIndex + 7, correctIndex + 12]
      .map((n) => LETTERS[n % LETTERS.length][0])
      .filter((d) => d !== ar);
    while (distractors.length < 3) {
      const cand = LETTERS[(correctIndex + distractors.length + 1) % LETTERS.length][0];
      if (cand !== ar && !distractors.includes(cand)) distractors.push(cand);
    }
    const options = [ar, ...distractors.slice(0, 3)];
    // Mélange déterministe (rotation).
    const rot = correctIndex % 4;
    const rotated = options.slice(rot).concat(options.slice(0, rot));
    quizzes.push([quizId, lessonId, idx + 1, 'recognize_letter', `Quelle lettre se prononce « ${name} » ?`, ar, JSON.stringify(rotated)]);
  });
}

// ---------- Niveaux 2-4 : placeholders (à remplir depuis le document) ----------
const placeholders = [
  [2, 2, 'Les lettres connectées', 'Formes début, milieu et fin de mot.', false, ['Début de mot', 'Milieu de mot', 'Fin de mot']],
  [3, 3, 'Les voyelles courtes', 'Fatha, kasra, damma et premières syllabes.', false, ['La fatha', 'La kasra', 'La damma', 'Premières syllabes']],
  [4, 4, 'Voyelles longues & règles', 'Soukoun, chadda, tanwîn, voyelles longues.', true, ['Le soukoun', 'La chadda', 'Le tanwîn', 'Voyelles longues']],
];
for (const [id, pos, title, desc, premium, lessonTitles] of placeholders) {
  levels.push([id, pos, title, desc, premium]);
  lessonTitles.forEach((t, idx) => {
    lessonId += 1;
    lessons.push([lessonId, id, idx + 1, t, 'learn', premium]);
  });
}

// ---------- Génération SQL ----------
const sql = `-- ============================================================
-- Tahajji — Curriculum (généré par scripts/build_curriculum.mjs).
-- Niveau 1 : 28 lettres (14 leçons) + quiz. Niveaux 2-4 : placeholders.
-- À exécuter APRÈS 0001_init.sql. (Le Coran est géré par import_quran.sql.)
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
