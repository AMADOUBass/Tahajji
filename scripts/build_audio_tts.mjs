/**
 * Génère l'audio des leçons par synthèse vocale (Azure TTS — voix arabe neuronale).
 *
 * But : éviter d'enregistrer 180 clips à la main. Lit db/audio_manifest.csv et
 * synthétise la forme ARABE de chaque item → audio_out/items/{id}.mp3.
 *
 * ⚠️ Le TTS est bon pour les mots ; pour les LETTRES isolées (surtout les
 *    emphatiques ص ض ط ظ ع ح ق غ), écoute d'abord l'ÉCHANTILLON et fais valider la
 *    prononciation. Pour le Coran (versets) on n'utilise JAMAIS le TTS.
 *
 * Pré-requis :
 *   - Node 18+ (fetch global).
 *   - Un service Azure « Speech » (gratuit : tier F0). Récupère KEY + REGION.
 *
 * Utilisation (PowerShell) :
 *   $env:AZURE_TTS_KEY="..."; $env:AZURE_TTS_REGION="francecentral"
 *   node scripts/build_audio_tts.mjs --sample     # ~12 clips de test
 *   node scripts/build_audio_tts.mjs              # les 180
 *
 * Variables optionnelles :
 *   AZURE_TTS_VOICE  (def. ar-SA-HamedNeural ; alt. ar-SA-ZariyahNeural, ar-EG-ShakirNeural…)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const KEY = process.env.AZURE_TTS_KEY;
const REGION = process.env.AZURE_TTS_REGION;
const VOICE = process.env.AZURE_TTS_VOICE || 'ar-SA-HamedNeural';
const SAMPLE = process.argv.includes('--sample');

if (!KEY || !REGION) {
  console.error('❌ Définis AZURE_TTS_KEY et AZURE_TTS_REGION (voir l\'en-tête du script).');
  process.exit(1);
}

// --- Lecture du manifeste (CSV avec champs entre guillemets, "" = guillemet) ---
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const raw = readFileSync('db/audio_manifest.csv', 'utf8').trim().split(/\r?\n/);
const header = parseCsvLine(raw[0]);
const col = Object.fromEntries(header.map((h, i) => [h, i]));
let rows = raw.slice(1).map((l) => {
  const f = parseCsvLine(l);
  return { id: f[col.id], type: f[col.type], arabe: f[col.arabe], translit: f[col.translitteration], fichier: f[col.fichier] };
});

// Échantillon représentatif : 3 lettres faciles + 6 difficiles + 3 mots.
if (SAMPLE) {
  const easy = ['بَ', 'تَ', 'مَ'];
  const hard = ['صَ', 'ضَ', 'طَ', 'ظَ', 'عَ', 'قَ'];
  const letters = rows.filter((r) => easy.includes(r.arabe) || hard.includes(r.arabe));
  const words = rows.filter((r) => r.type === 'word').slice(0, 3);
  rows = [...letters, ...words];
}

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENDPOINT = `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

async function synth(text) {
  const ssml =
    `<speak version='1.0' xml:lang='ar-SA'><voice name='${VOICE}'>${xmlEscape(text)}</voice></speak>`;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'tahajji-tts',
    },
    body: ssml,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

const OUT = SAMPLE ? 'audio_out/sample' : 'audio_out';
console.log(`Voix : ${VOICE} · ${rows.length} clip(s)${SAMPLE ? ' (ÉCHANTILLON)' : ''} → ${OUT}/`);

let done = 0;
let failed = 0;
for (const r of rows) {
  const path = `${OUT}/${r.fichier}`;
  mkdirSync(dirname(path), { recursive: true });
  if (existsSync(path)) { done++; continue; }
  try {
    const buf = await synth(r.arabe);
    writeFileSync(path, buf);
    done++;
    process.stdout.write(`\r✓ ${done}/${rows.length}  (${r.arabe} ${r.translit})        `);
    await new Promise((res) => setTimeout(res, 120)); // respire (quotas)
  } catch (e) {
    failed++;
    console.error(`\n⚠️  ${r.id} (${r.arabe}) : ${e.message}`);
  }
}
console.log(`\nTerminé : ${done} clip(s)${failed ? `, ${failed} échec(s)` : ''}. Dossier : ${OUT}/`);
if (SAMPLE) console.log('👉 Écoute les fichiers de audio_out/sample/items/ et fais valider la prononciation.');
