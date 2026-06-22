/**
 * Découpe db/import_quran.sql en plusieurs fichiers plus petits,
 * faciles à coller dans le SQL Editor (à exécuter dans l'ordre 1 → N).
 * Découpe sur les frontières d'instructions (jamais au milieu d'un INSERT).
 *
 * Usage : node scripts/split_quran_sql.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BUDGET = 350_000; // octets visés par fichier
const src = readFileSync('db/import_quran.sql', 'utf8');

// Chaque instruction se termine par ";" suivi d'une ligne vide.
const statements = src
  .split(/;\s*\n\s*\n/)
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => s + ';');

// Regroupe les instructions par budget de taille (sans couper une instruction).
const groups = [];
let current = [];
let size = 0;
for (const stmt of statements) {
  if (size > 0 && size + stmt.length > BUDGET) {
    groups.push(current);
    current = [];
    size = 0;
  }
  current.push(stmt);
  size += stmt.length;
}
if (current.length) groups.push(current);

groups.forEach((slice, i) => {
  const header = `-- Import Coran — partie ${i + 1}/${groups.length} (exécuter dans l'ordre).\n\n`;
  writeFileSync(`db/import_quran_${i + 1}.sql`, header + slice.join('\n\n') + '\n', 'utf8');
});
console.log(`OK — ${statements.length} instructions → ${groups.length} fichiers db/import_quran_N.sql`);
