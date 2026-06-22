/**
 * Génère db/seed.sql — curriculum.
 * Basé sur « La mine des novices pour la lecture du saint Coran » (RECI, Bamako)
 * — utilisé avec l'autorisation de l'auteur — fusionné avec la Qaïda Nourania.
 *
 * Niveau 1 : 28 lettres avec la fatha (a), leçons de 4.
 * Niveau 2 : voyelles brèves — kasra (i), dhômma (ou), soukoûne, révision.
 * Niveaux 3-5 : placeholders (madd, tanwîn, règles).
 *
 * Usage : node scripts/build_curriculum.mjs
 * ⚠️ Contenu à FAIRE VALIDER par une autorité avant publication.
 */
import { writeFileSync } from 'node:fs';

const esc = (s) => String(s).replace(/'/g, "''");
const FATHA = 'َ', KASRA = 'ِ', DAMMA = 'ُ';

// [lettre nue, nom, consonne (pour la translittération)]
const LETTERS = [
  ['ا', 'Alif / Hamza', ''],
  ['ب', 'Bā', 'b'], ['ت', 'Tā', 't'], ['ث', 'Thā', 'th'], ['ج', 'Jīm', 'j'],
  ['ح', 'Ḥā', 'ḥ'], ['خ', 'Khā', 'kh'], ['د', 'Dāl', 'd'], ['ذ', 'Dhāl', 'dh'],
  ['ر', 'Rā', 'r'], ['ز', 'Zāy', 'z'], ['س', 'Sīn', 's'], ['ش', 'Shīn', 'ch'],
  ['ص', 'Ṣād', 'ṣ'], ['ض', 'Ḍād', 'ḍ'], ['ط', 'Ṭā', 'ṭ'], ['ظ', 'Ẓā', 'ẓ'],
  ['ع', 'ʿAyn', 'ʿ'], ['غ', 'Ghayn', 'gh'], ['ف', 'Fā', 'f'], ['ق', 'Qāf', 'q'],
  ['ك', 'Kāf', 'k'], ['ل', 'Lām', 'l'], ['م', 'Mīm', 'm'], ['ن', 'Nūn', 'n'],
  ['ه', 'Hā', 'h'], ['و', 'Wāw', 'w'], ['ي', 'Yā', 'y'],
];

// Forme vocalisée (alif → formes avec hamza).
function vocalize(bare, v) {
  if (bare === 'ا') return v === FATHA ? 'أَ' : v === KASRA ? 'إِ' : 'أُ';
  return bare + v;
}
function sound(consonant, v) {
  const suffix = v === FATHA ? 'a' : v === KASRA ? 'i' : 'ou';
  return consonant + suffix;
}

const levels = [];
const lessons = [];
const items = [];
const quizzes = [];
let lessonId = 0, itemId = 0, quizId = 0;

function addQuiz(lid, pos, prompt, correct, options) {
  quizId += 1;
  quizzes.push([quizId, lid, pos, 'recognize_letter', prompt, correct, JSON.stringify(options)]);
}

// Leçons « une voyelle appliquée aux lettres » (niveaux alphabet/voyelles).
function letterLessons(levelId, vowel, chunk, titler) {
  for (let i = 0; i < LETTERS.length; i += chunk) {
    const group = LETTERS.slice(i, i + chunk);
    lessonId += 1;
    lessons.push([lessonId, levelId, lessons.filter((l) => l[1] === levelId).length + 1, titler(group, i), 'learn', false]);
    const lid = lessonId;

    group.forEach(([bare, name, cons], idx) => {
      itemId += 1;
      const voc = vocalize(bare, vowel);
      const snd = sound(cons, vowel) || (vowel === FATHA ? 'a' : vowel === KASRA ? 'i' : 'ou');
      items.push([itemId, lid, idx + 1, 'letter', voc, snd, `Lettre ${name} — son « ${snd} »`]);
    });

    // Jusqu'à 4 questions par leçon.
    group.slice(0, 4).forEach(([bare, , cons], idx) => {
      const correct = vocalize(bare, vowel);
      const snd = sound(cons, vowel) || 'a';
      const others = [FATHA, KASRA, DAMMA].filter((vv) => vv !== vowel);
      const otherBare = LETTERS[(i + idx + 5) % LETTERS.length][0];
      const opts = [correct, vocalize(bare, others[0]), vocalize(bare, others[1]), vocalize(otherBare, vowel)];
      const rot = (i + idx) % 4;
      addQuiz(lid, idx + 1, `Quelle case se lit « ${snd} » ?`, correct, opts.slice(rot).concat(opts.slice(0, rot)));
    });
  }
}

// ---------- Niveau 1 : la fatha ----------
levels.push([1, 1, 'L’alphabet — la voyelle « a »', 'Les 28 lettres lues avec la fatha (a), dans l’ordre de la méthode.', false]);
letterLessons(1, FATHA, 4, (g) => g.map((l) => l[1].split(' ')[0]).join(' · '));

// ---------- Niveau 2 : voyelles brèves ----------
levels.push([2, 2, 'Les voyelles brèves', 'La kasra (i), la dhômma (ou) et le soukoûne.', false]);
let part = 0;
letterLessons(2, KASRA, 7, () => `La kasra (i) — partie ${++part}`);
part = 0;
letterLessons(2, DAMMA, 7, () => `La dhômma (ou) — partie ${++part}`);

// Soukoûne (mots simples du registre coranique).
const SUKUN = [
  ['مِنْ', 'min', 'soukoûne sur le « n » — « de »'],
  ['قَدْ', 'qad', 'soukoûne sur le « d » — « déjà »'],
  ['هَلْ', 'hal', 'soukoûne sur le « l » — « est-ce que »'],
  ['كَمْ', 'kam', 'soukoûne sur le « m » — « combien »'],
  ['قُلْ', 'qoul', 'soukoûne sur le « l » — « dis »'],
  ['عَنْ', 'ʿan', 'soukoûne sur le « n » — « au sujet de »'],
];
lessonId += 1;
{
  const lid = lessonId;
  lessons.push([lid, 2, lessons.filter((l) => l[1] === 2).length + 1, 'Le soukoûne', 'learn', false]);
  SUKUN.forEach(([ar, tr, desc], idx) => {
    itemId += 1;
    items.push([itemId, lid, idx + 1, 'word', ar, tr, desc]);
  });
  SUKUN.slice(0, 4).forEach(([ar, tr], idx) => {
    const opts = [ar, SUKUN[(idx + 1) % SUKUN.length][0], SUKUN[(idx + 2) % SUKUN.length][0], SUKUN[(idx + 3) % SUKUN.length][0]];
    addQuiz(lid, idx + 1, `Quel mot se lit « ${tr} » ?`, ar, opts);
  });
}

// Révision des voyelles brèves (mélange a/i/ou).
const REV = [['بَ', 'ba'], ['بِ', 'bi'], ['بُ', 'bou'], ['تَ', 'ta'], ['تِ', 'ti'], ['تُ', 'tou']];
lessonId += 1;
{
  const lid = lessonId;
  lessons.push([lid, 2, lessons.filter((l) => l[1] === 2).length + 1, 'Révision des voyelles', 'exam', false]);
  REV.forEach(([ar, tr], idx) => {
    itemId += 1;
    items.push([itemId, lid, idx + 1, 'letter', ar, tr, `Se lit « ${tr} »`]);
  });
  REV.slice(0, 4).forEach(([ar, tr], idx) => {
    const opts = [ar, REV[(idx + 1) % REV.length][0], REV[(idx + 3) % REV.length][0], REV[(idx + 5) % REV.length][0]];
    addQuiz(lid, idx + 1, `Quelle case se lit « ${tr} » ?`, ar, opts);
  });
}

// ---------- Niveaux 3-5 : placeholders ----------
const more = [
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
-- Niveaux 1-2 détaillés ; niveaux 3-5 : placeholders.
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
console.log(`OK — ${levels.length} niveaux, ${lessons.length} leçons, ${items.length} items, ${quizzes.length} quiz → db/seed.sql`);
