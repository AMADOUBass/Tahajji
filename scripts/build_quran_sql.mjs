/**
 * Génère db/import_quran.sql à partir d'une source ouverte (alquran.cloud).
 * - Texte arabe : édition Uthmani (quran-uthmani)
 * - Traduction FR : Hamidullah (fr.hamidullah)
 *
 * Usage : node scripts/build_quran_sql.mjs
 * Puis exécuter db/import_quran.sql dans Supabase → SQL Editor.
 */
import { writeFileSync } from 'node:fs';

const ARA = 'https://api.alquran.cloud/v1/quran/quran-uthmani';
const FR = 'https://api.alquran.cloud/v1/quran/fr.hamidullah';

const esc = (s) => String(s).replace(/'/g, "''");
const cleanArName = (s) => String(s).replace(/^سُورَةُ?\s+/, '').trim();

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

const [araRes, frRes] = await Promise.all([
  fetch(ARA).then((r) => r.json()),
  fetch(FR).then((r) => r.json()),
]);

const araSurahs = araRes.data.surahs;
const frSurahs = frRes.data.surahs;

// Map traduction FR par numéro de verset global.
const frByGlobal = new Map();
for (const s of frSurahs) for (const a of s.ayahs) frByGlobal.set(a.number, a.text);

const surahRows = [];
const verseRows = [];

for (const s of araSurahs) {
  surahRows.push(
    `(${s.number}, ${s.number}, '${esc(cleanArName(s.name))}', '${esc(s.englishName)}', '${s.revelationType.toLowerCase()}', ${s.ayahs.length})`,
  );
  for (const a of s.ayahs) {
    const fr = frByGlobal.get(a.number) ?? null;
    verseRows.push(
      `(${a.number}, ${s.number}, ${a.numberInSurah}, '${esc(a.text)}', ${fr === null ? 'null' : `'${esc(fr)}'`}, null, null)`,
    );
  }
}

let sql = `-- ============================================================
-- Tahajji — Import du Coran complet (114 sourates / ${verseRows.length} versets).
-- Source : alquran.cloud — arabe Uthmani + traduction FR Hamidullah.
-- À exécuter dans Supabase → SQL Editor (APRÈS 0001_init.sql).
-- L'audio (audio_url) sera ajouté plus tard.
-- ⚠️ Vérifier la licence de la traduction avant usage commercial.
-- ============================================================

truncate table verses, surahs restart identity cascade;

insert into surahs (id, number, name_ar, name_fr, revelation_type, verse_count) values
${surahRows.join(',\n')};

`;

for (const part of chunk(verseRows, 500)) {
  sql += `insert into verses (id, surah_id, number, arabic_text, translation_fr, translation_en, audio_url) values\n${part.join(',\n')};\n\n`;
}

sql += `select setval(pg_get_serial_sequence('surahs', 'id'), (select max(id) from surahs));
select setval(pg_get_serial_sequence('verses', 'id'), (select max(id) from verses));
`;

writeFileSync('db/import_quran.sql', sql, 'utf8');
console.log(`OK — ${surahRows.length} sourates, ${verseRows.length} versets → db/import_quran.sql`);
