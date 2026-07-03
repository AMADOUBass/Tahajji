/**
 * Génère les assets d'icône/splash à partir de assets/brand/logo-source.png.
 * - icon.png : icône d'app (coins → espresso, plein, opaque)
 * - logo-badge.png : le logo COMPLET (carré arrondi + étoile), coins transparents,
 *   symétrique → affiché dans l'app (accueil).
 * - adaptive-icon-foreground.png / splash-icon.png : l'étoile seule (recadrée).
 */
import sharp from 'sharp';

const SRC = 'assets/brand/logo-source.png';
const OUT = 'assets/images';
const ESP = { r: 68, g: 47, b: 30 }; // #442F1E — fond du logo

const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;
const raw = await sharp(SRC).ensureAlpha().raw().toBuffer(); // RGBA

const isWatermark = (x, y) => x >= 850 && y >= 850; // filigrane (coin bas-droite)
const nearWhite = (r, g, b) => r > 240 && g > 240 && b > 240;

// 1) ICÔNE D'APP : coins blancs + filigrane → espresso, opaque.
const icon = Buffer.from(raw);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    if (nearWhite(icon[i], icon[i + 1], icon[i + 2]) || isWatermark(x, y)) {
      icon[i] = ESP.r; icon[i + 1] = ESP.g; icon[i + 2] = ESP.b; icon[i + 3] = 255;
    }
  }
}
await sharp(icon, { raw: { width: W, height: H, channels: 4 } }).png().toFile(`${OUT}/icon.png`);
await sharp(icon, { raw: { width: W, height: H, channels: 4 } }).resize(196, 196).png().toFile(`${OUT}/favicon.png`);

// 2) BADGE (logo complet affiché dans l'app) : les 4 coins blancs → TRANSPARENTS
//    (symétrique), le filigrane (dans l'espresso) → espresso. Le carré arrondi reste.
const badge = Buffer.from(raw);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    if (nearWhite(badge[i], badge[i + 1], badge[i + 2])) {
      badge[i + 3] = 0; // coin → transparent (les 4)
    } else if (isWatermark(x, y)) {
      badge[i] = ESP.r; badge[i + 1] = ESP.g; badge[i + 2] = ESP.b; // couvre le filigrane
    }
  }
}
await sharp(badge, { raw: { width: W, height: H, channels: 4 } }).png().trim().toFile(`${OUT}/logo-badge.png`);

// 3) ÉTOILE SEULE : recadrée sur l'or (bbox 184→839), fond espresso → transparent.
const PAD = 8;
const L = 184 - PAD, T = 184 - PAD, SIZE = (839 - 184) + 1 + 2 * PAD;
const markRaw = await sharp(SRC).ensureAlpha().extract({ left: L, top: T, width: SIZE, height: SIZE }).raw().toBuffer();
const mark = Buffer.from(markRaw);
for (let p = 0; p < SIZE * SIZE; p++) {
  const i = p * 4;
  const r = mark[i], g = mark[i + 1], b = mark[i + 2];
  const dEsp = Math.abs(r - ESP.r) + Math.abs(g - ESP.g) + Math.abs(b - ESP.b);
  if (dEsp < 55 || nearWhite(r, g, b)) mark[i + 3] = 0;
}
const star = await sharp(mark, { raw: { width: SIZE, height: SIZE, channels: 4 } }).png().trim().toBuffer();
const centered = async (markSize, canvas = 1024) => {
  const m = await sharp(star).resize(markSize, markSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: m, gravity: 'center' }]).png();
};
await (await centered(640)).toFile(`${OUT}/adaptive-icon-foreground.png`); // Android adaptatif
await sharp(star).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/splash-icon.png`); // splash

console.log('Icônes générées → icon, favicon, logo-badge, adaptive-icon-foreground, splash-icon');
