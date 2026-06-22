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

// ---------- Niveau 3 : voyelles longues (madd) ----------
levels.push([3, 3, 'Les voyelles longues (madd)', 'Allongement de la voyelle par Alif, Yâ et Wâw.', false]);

// Sous-ensemble de consonnes claires pour les exercices de madd.
const MADD_SET = [
  ['ب', 'b'], ['ت', 't'], ['ج', 'j'], ['د', 'd'], ['ر', 'r'],
  ['س', 's'], ['ل', 'l'], ['م', 'm'], ['ن', 'n'], ['ك', 'k'],
];

function maddLesson(vowel, maddChar, suffix, title) {
  lessonId += 1;
  const lid = lessonId;
  lessons.push([lid, 3, lessons.filter((l) => l[1] === 3).length + 1, title, 'learn', false]);
  MADD_SET.forEach(([bare, cons], idx) => {
    itemId += 1;
    const form = bare + vowel + maddChar;
    items.push([itemId, lid, idx + 1, 'word', form, cons + suffix, `Allongement : « ${cons}${suffix} »`]);
  });
  MADD_SET.slice(0, 4).forEach(([bare, cons], idx) => {
    const correct = bare + vowel + maddChar;          // long
    const shortForm = bare + vowel;                    // court (même lettre)
    const otherLong = MADD_SET[(idx + 1) % MADD_SET.length][0] + vowel + maddChar;
    const otherShort = MADD_SET[(idx + 2) % MADD_SET.length][0] + vowel;
    const opts = [correct, shortForm, otherLong, otherShort];
    const rot = idx % 4;
    addQuiz(lid, idx + 1, `Quelle case se lit « ${cons}${suffix} » (allongé) ?`, correct, opts.slice(rot).concat(opts.slice(0, rot)));
  });
}

maddLesson(FATHA, 'ا', 'â', 'Madd par Alif (â)');
maddLesson(KASRA, 'ي', 'î', 'Madd par Yâ (î)');
maddLesson(DAMMA, 'و', 'oû', 'Madd par Wâw (oû)');

// Révision madd (mélange â / î / oû).
const MADD_REV = [['بَا', 'bâ'], ['بِي', 'bî'], ['بُو', 'boû'], ['نَا', 'nâ'], ['نِي', 'nî'], ['نُو', 'noû']];
lessonId += 1;
{
  const lid = lessonId;
  lessons.push([lid, 3, lessons.filter((l) => l[1] === 3).length + 1, 'Révision des voyelles longues', 'exam', false]);
  MADD_REV.forEach(([ar, tr], idx) => {
    itemId += 1;
    items.push([itemId, lid, idx + 1, 'word', ar, tr, `Se lit « ${tr} »`]);
  });
  MADD_REV.slice(0, 4).forEach(([ar, tr], idx) => {
    const opts = [ar, MADD_REV[(idx + 1) % MADD_REV.length][0], MADD_REV[(idx + 3) % MADD_REV.length][0], MADD_REV[(idx + 5) % MADD_REV.length][0]];
    addQuiz(lid, idx + 1, `Quelle case se lit « ${tr} » ?`, ar, opts);
  });
}

// ---------- Niveau 4 : le tanwîn ----------
levels.push([4, 4, 'Le tanwîn', 'Les doubles voyelles en fin de mot : -an, -in, -oun.', false]);

const TANWIN = {
  f: { suffix: 'ane', short: 'َ', title: 'Tanwîn fatha (-an)' },
  k: { suffix: 'ine', short: 'ِ', title: 'Tanwîn kasra (-in)' },
  d: { suffix: 'oune', short: 'ُ', title: 'Tanwîn dhômma (-oun)' },
};
// Forme tanwîn (le fatha-tanwîn s'écrit avec un alif neutre).
const tform = (bare, k) => (k === 'f' ? bare + 'ً' + 'ا' : k === 'k' ? bare + 'ٍ' : bare + 'ٌ');

for (const kind of ['f', 'k', 'd']) {
  const cfg = TANWIN[kind];
  const otherKind = kind === 'f' ? 'k' : kind === 'k' ? 'd' : 'f';
  lessonId += 1;
  const lid = lessonId;
  lessons.push([lid, 4, lessons.filter((l) => l[1] === 4).length + 1, cfg.title, 'learn', false]);
  MADD_SET.forEach(([bare, cons], idx) => {
    itemId += 1;
    items.push([itemId, lid, idx + 1, 'word', tform(bare, kind), cons + cfg.suffix, `Tanwîn : « ${cons}${cfg.suffix} »`]);
  });
  MADD_SET.slice(0, 4).forEach(([bare, cons], idx) => {
    const correct = tform(bare, kind);
    const short = bare + cfg.short;
    const otherLetter = tform(MADD_SET[(idx + 1) % MADD_SET.length][0], kind);
    const otherTanwin = tform(bare, otherKind);
    const opts = [correct, short, otherLetter, otherTanwin];
    const rot = idx % 4;
    addQuiz(lid, idx + 1, `Quelle case se lit « ${cons}${cfg.suffix} » ?`, correct, opts.slice(rot).concat(opts.slice(0, rot)));
  });
}

// Révision tanwîn.
const TAN_REV = [['بًا', 'bane'], ['بٍ', 'bine'], ['بٌ', 'boune'], ['نًا', 'nane'], ['نٍ', 'nine'], ['نٌ', 'noune']];
lessonId += 1;
{
  const lid = lessonId;
  lessons.push([lid, 4, lessons.filter((l) => l[1] === 4).length + 1, 'Révision du tanwîn', 'exam', false]);
  TAN_REV.forEach(([ar, tr], idx) => {
    itemId += 1;
    items.push([itemId, lid, idx + 1, 'word', ar, tr, `Se lit « ${tr} »`]);
  });
  TAN_REV.slice(0, 4).forEach(([ar, tr], idx) => {
    const opts = [ar, TAN_REV[(idx + 1) % TAN_REV.length][0], TAN_REV[(idx + 3) % TAN_REV.length][0], TAN_REV[(idx + 5) % TAN_REV.length][0]];
    addQuiz(lid, idx + 1, `Quelle case se lit « ${tr} » ?`, ar, opts);
  });
}

// ---------- Niveau 5 : règles de lecture (premium) ----------
levels.push([5, 5, 'Règles de lecture', 'Chadda, alif maqsoura, hamzatoul wasl, lettres solaires/lunaires, chiffres et versets.', true]);

// Crée une leçon « contenu » : items + (jusqu'à 4) quiz « Quel … se lit … ? ».
function contentLesson(title, lessonType, itemType, entries, promptFn) {
  lessonId += 1;
  const lid = lessonId;
  lessons.push([lid, 5, lessons.filter((l) => l[1] === 5).length + 1, title, lessonType, true]);
  entries.forEach(([ar, tr, desc], idx) => {
    itemId += 1;
    items.push([itemId, lid, idx + 1, itemType, ar, tr, desc ?? `Se lit « ${tr} »`]);
  });
  entries.slice(0, 4).forEach((entry, idx) => {
    const ar = entry[0];
    const opts = [ar, entries[(idx + 1) % entries.length][0], entries[(idx + 2) % entries.length][0], entries[(idx + 3) % entries.length][0]];
    addQuiz(lid, idx + 1, promptFn(entry), ar, opts);
  });
}

// 1. La chadda
contentLesson('La chadda', 'learn', 'word', [
  ['إِنَّ', 'inna', 'chadda sur le « n » — prolongé'],
  ['ثُمَّ', 'thumma', 'chadda sur le « m » — prolongé'],
  ['حَقَّ', 'ḥaqqa', 'chadda sur le « q »'],
  ['خَرَّ', 'kharra', 'chadda sur le « r »'],
  ['مَدَّ', 'madda', 'chadda sur le « d »'],
  ['ضَلَّ', 'ḍalla', 'chadda sur le « l »'],
], (e) => `Quel mot se lit « ${e[1]} » ?`);

// 2. Alif maqsoura (ى se lit â)
contentLesson('Alif maqsoura (ى)', 'learn', 'word', [
  ['عَلَى', 'ʿalâ', 'le ى final se lit « â »'],
  ['إِلَى', 'ilâ', 'le ى final se lit « â »'],
  ['مُوسَى', 'mûsâ', 'le ى final se lit « â »'],
  ['رَمَى', 'ramâ', 'le ى final se lit « â »'],
], (e) => `Quel mot se lit « ${e[1]} » ?`);

// 3. Hamzatoul wasl (ٱ)
contentLesson('Hamzatoul wasl (ٱ)', 'learn', 'word', [
  ['ٱلْحَمْدُ', 'al-ḥamdu', 'lue « a » devant un lâm'],
  ['ٱهْدِنَا', 'ihdinâ', 'lue « i » (3ᵉ lettre kasra/fatha)'],
  ['ٱنْظُرْ', 'ounẓur', 'lue « ou » (3ᵉ lettre dhômma)'],
  ['ٱمْشُوا', 'imchoû', 'exception : lue « i » malgré la dhômma'],
], (e) => `Quel mot se lit « ${e[1]} » ?`);

// 4. Lettres solaires et lunaires
contentLesson('Lettres solaires et lunaires', 'learn', 'word', [
  ['ٱلْقَمَر', 'al-qamar', 'lunaire : on entend le « l »'],
  ['ٱلْأَمْر', 'al-amr', 'lunaire : on entend le « l »'],
  ['ٱلشَّمْس', 'ach-chams', 'solaire : le « l » disparaît, lettre redoublée'],
  ['ٱلرَّحْمَٰن', 'ar-raḥmân', 'solaire : le « l » disparaît'],
  ['ٱلصِّرَاط', 'aṣ-ṣirâṭ', 'solaire'],
  ['ٱلطَّيْر', 'aṭ-ṭayr', 'solaire'],
], (e) => `Quel mot se lit « ${e[1]} » ?`);

// 5. Les chiffres arabes
contentLesson('Les chiffres (٠-٩)', 'learn', 'word', [
  ['٠', 'sifr', '0 — صِفْر'], ['١', 'wâḥid', '1 — وَاحِد'], ['٢', 'ithnân', '2 — اثْنَان'],
  ['٣', 'thalâtha', '3 — ثَلَاثَة'], ['٤', 'arbaʿa', '4 — أَرْبَعَة'], ['٥', 'khamsa', '5 — خَمْسَة'],
  ['٦', 'sitta', '6 — سِتَّة'], ['٧', 'sabʿa', '7 — سَبْعَة'], ['٨', 'thamâniya', '8 — ثَمَانِيَة'],
  ['٩', 'tisʿa', '9 — تِسْعَة'],
], (e) => `Quel chiffre est « ${e[1]} » ?`);

// 6. Lecture de versets (sourate Al-Ikhlas)
contentLesson('Lecture de versets', 'exam', 'verse', [
  ['قُلْ هُوَ ٱللَّهُ أَحَدٌ', 'Al-Ikhlas 1', 'Dis : « Il est Allah, Unique.'],
  ['ٱللَّهُ ٱلصَّمَدُ', 'Al-Ikhlas 2', 'Allah, Le Seul imploré.'],
  ['لَمْ يَلِدْ وَلَمْ يُولَدْ', 'Al-Ikhlas 3', 'Il n’a pas engendré et n’a pas été engendré.'],
  ['وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', 'Al-Ikhlas 4', 'Et nul n’est égal à Lui. »'],
], (e) => `Quel verset signifie « ${e[2]} » ?`);

const sql = `-- ============================================================
-- Tahajji — Curriculum (généré par scripts/build_curriculum.mjs).
-- Méthode : « La mine des novices pour la lecture du saint Coran » (RECI, Bamako),
-- utilisée avec l'autorisation de l'auteur, fusionnée avec la Qaïda Nourania.
-- Niveaux 1-5 détaillés (curriculum complet).
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
