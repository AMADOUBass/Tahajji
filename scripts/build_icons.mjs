/**
 * Génère les assets d'icône/splash à partir de assets/brand/logo-source.png :
 * - remplit les coins blancs par l'espresso (icône pleine, opaque)
 * - couvre le petit filigrane (coin bas-droite)
 * - produit : icon.png, favicon.png, adaptive-icon-foreground.png, splash-icon.png
 */
import sharp from 'sharp';

const SRC = 'assets/brand/logo-source.png';
const OUT = 'assets/images';
const ESP = { r: 68, g: 47, b: 30 }; // #442F1E — fond du logo

const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;
const raw = await sharp(SRC).ensureAlpha().raw().toBuffer(); // RGBA

const isWatermark = (x, y) => x >= 850 && y >= 850; // coin bas-droite (filigrane)

// 1) ICÔNE PLEINE : coins blancs + filigrane → espresso, opaque.
const full = Buffer.from(raw);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const nearWhite = full[i] > 240 && full[i + 1] > 240 && full[i + 2] > 240;
    if (nearWhite || isWatermark(x, y)) {
      full[i] = ESP.r; full[i + 1] = ESP.g; full[i + 2] = ESP.b; full[i + 3] = 255;
    }
  }
}
await sharp(full, { raw: { width: W, height: H, channels: 4 } }).png().toFile(`${OUT}/icon.png`);
await sharp(full, { raw: { width: W, height: H, channels: 4 } }).resize(196, 196).png().toFile(`${OUT}/favicon.png`);

// 2) MARQUE SUR TRANSPARENT : espresso → transparent (garde l'or), pour adaptive + splash.
const mark = Buffer.from(raw);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const r = mark[i], g = mark[i + 1], b = mark[i + 2];
    const dEsp = Math.abs(r - ESP.r) + Math.abs(g - ESP.g) + Math.abs(b - ESP.b);
    const nearWhite = r > 240 && g > 240 && b > 240;
    if (dEsp < 45 || nearWhite || isWatermark(x, y)) mark[i + 3] = 0; // fond → transparent
  }
}
const trimmed = await sharp(mark, { raw: { width: W, height: H, channels: 4 } }).png().trim().toBuffer();

const centered = async (markSize, canvas = 1024) => {
  const m = await sharp(trimmed).resize(markSize, markSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: m, gravity: 'center' }]).png();
};

// Android adaptatif : marque dans la zone sûre (~62 %) sur fond transparent.
await (await centered(640)).toFile(`${OUT}/adaptive-icon-foreground.png`);
// Splash : marque seule (cadrée serré), affichée petite via imageWidth.
await sharp(trimmed).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${OUT}/splash-icon.png`);

console.log('Icônes générées → assets/images/ (icon, favicon, adaptive-icon-foreground, splash-icon)');
