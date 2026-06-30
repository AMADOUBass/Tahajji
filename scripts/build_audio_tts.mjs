/**
 * Génère l'audio des leçons par synthèse vocale (TTS).
 *
 * But : éviter d'enregistrer 180 clips à la main. Lit db/audio_manifest.csv et
 * synthétise la forme ARABE de chaque item → audio_out/items/{id}.mp3.
 *
 * Deux services au choix (détecté automatiquement selon la clé fournie) :
 *   • ElevenLabs  → inscription e-mail SANS carte (le plus simple). elevenlabs.io
 *   • Azure Speech → tier F0 gratuit (mais restrictions de région sur les nouveaux comptes)
 *
 * ⚠️ Le TTS est bon pour les mots ; pour les LETTRES isolées (surtout les
 *    emphatiques ص ض ط ظ ع ح ق غ), écoute d'abord l'ÉCHANTILLON et fais valider la
 *    prononciation. Pour le Coran (versets), on n'utilise JAMAIS le TTS.
 *
 * ---- ElevenLabs (recommandé) ----
 *   $env:ELEVEN_API_KEY="sk_..."
 *   # optionnel : une voix arabe de la Voice Library (sinon voix par défaut)
 *   $env:ELEVEN_VOICE_ID="..."
 *   node scripts/build_audio_tts.mjs --sample
 *
 * ---- Azure ----
 *   $env:AZURE_TTS_KEY="..."; $env:AZURE_TTS_REGION="eastus2"
 *   node scripts/build_audio_tts.mjs --sample
 *
 * Sans --sample : génère les 180 clips.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const SAMPLE = process.argv.includes('--sample');

// --- Choix du service selon la clé présente ---
const ELEVEN_KEY = process.env.ELEVEN_API_KEY;
const AZURE_KEY = process.env.AZURE_TTS_KEY;
const PROVIDER = process.env.TTS_PROVIDER || (ELEVEN_KEY ? 'elevenlabs' : AZURE_KEY ? 'azure' : null);

if (!PROVIDER) {
  console.error('❌ Aucune clé trouvée. Définis ELEVEN_API_KEY (ElevenLabs) ou AZURE_TTS_KEY + AZURE_TTS_REGION (Azure).');
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

// Échantillon : PAIRES emphatique↔plain (pour comparer à l'oreille) + quelques mots.
// Écoute chaque paire à la suite : l'emphatique doit être plus « lourde/sombre ».
if (SAMPLE) {
  const sample = [
    'سَ', 'صَ', // sa  ↔ ṣa
    'تَ', 'طَ', // ta  ↔ ṭa
    'دَ', 'ضَ', // da  ↔ ḍa
    'ذَ', 'ظَ', // dha ↔ ẓa
    'كَ', 'قَ', // ka  ↔ qa
    'حَ', 'عَ', // ḥa  ↔ ʿa
  ];
  const letters = sample
    .map((ar) => rows.find((r) => r.arabe === ar))
    .filter(Boolean);
  const words = rows.filter((r) => r.type === 'word').slice(0, 3);
  rows = [...letters, ...words];
}

// --- Synthèse selon le service ---
const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function synthAzure(text) {
  const region = process.env.AZURE_TTS_REGION;
  const voice = process.env.AZURE_TTS_VOICE || 'ar-SA-HamedNeural';
  if (!region) throw new Error('AZURE_TTS_REGION manquant');
  const ssml = `<speak version='1.0' xml:lang='ar-SA'><voice name='${voice}'>${xmlEscape(text)}</voice></speak>`;
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'tahajji-tts',
    },
    body: ssml,
  });
  if (!res.ok) throw new Error(`${res.status} — ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function synthEleven(text) {
  // Voix par défaut (multilingue). Pour un meilleur accent, mets une voix arabe
  // de la Voice Library dans ELEVEN_VOICE_ID.
  const voice = process.env.ELEVEN_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': ELEVEN_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      // Ralenti + stable pour bien entendre les syllabes courtes (lettres isolées).
      voice_settings: { stability: 0.6, similarity_boost: 0.85, speed: Number(process.env.ELEVEN_SPEED || 0.8) },
    }),
  });
  if (!res.ok) throw new Error(`${res.status} — ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

const synth = PROVIDER === 'azure' ? synthAzure : synthEleven;

const OUT = SAMPLE ? 'audio_out/sample' : 'audio_out';
console.log(`Service : ${PROVIDER} · ${rows.length} clip(s)${SAMPLE ? ' (ÉCHANTILLON)' : ''} → ${OUT}/`);

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
    await new Promise((res) => setTimeout(res, 150)); // respire (quotas)
  } catch (e) {
    failed++;
    console.error(`\n⚠️  ${r.id} (${r.arabe}) : ${e.message}`);
  }
}
console.log(`\nTerminé : ${done} clip(s)${failed ? `, ${failed} échec(s)` : ''}. Dossier : ${OUT}/`);
if (SAMPLE) console.log('👉 Écoute audio_out/sample/items/ et fais valider la prononciation.');
