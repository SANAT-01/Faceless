// Rich Room kit: round-headed cartoon people in heavy ink, standing in warm, ornate, flat rooms.
import { ctx, C, W, H, TAU, circle, ell, rr, line, inked, inkCircle, inkRR, inkEll, pool, bigText, clamp, lerp } from './lib.js';
export const P = C;
export const GROUND = 1500;          // where feet land in a 1080x1920 frame
export const CAPLOOK = { y: 1700 };  // caption band

// ---------------------------------------------------------------- faces
// Eyes and mouth do all the acting. Everything is ink on a pale head.
const EYE = {
  happy:   (x, y, r) => { [-1, 1].forEach((s) => { ctx.beginPath(); ctx.arc(x + s * r * 0.42, y, r * 0.17, Math.PI * 1.15, Math.PI * 1.85); ctx.strokeStyle = C.ink; ctx.lineWidth = r * 0.075; ctx.lineCap = 'round'; ctx.stroke(); }); },
  calm:    (x, y, r) => { [-1, 1].forEach((s) => circle(x + s * r * 0.42, y, r * 0.085, C.ink)); },
  shock:   (x, y, r) => { [-1, 1].forEach((s) => { inkCircle(x + s * r * 0.42, y, r * 0.155, C.white, r * 0.05); circle(x + s * r * 0.42, y, r * 0.075, C.ink); }); },
  smug:    (x, y, r) => { [-1, 1].forEach((s) => { ctx.beginPath(); ctx.arc(x + s * r * 0.42, y + r * 0.04, r * 0.16, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = C.ink; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round'; ctx.stroke(); line([[x + s * r * 0.26, y - r * 0.2], [x + s * r * 0.6, y - r * 0.26]], C.ink, r * 0.055); }); },
  worried: (x, y, r) => { [-1, 1].forEach((s) => { circle(x + s * r * 0.42, y + r * 0.02, r * 0.085, C.ink); line([[x + s * r * 0.24, y - r * 0.24], [x + s * r * 0.6, y - r * 0.14]], C.ink, r * 0.055); }); },
  angry:   (x, y, r) => { [-1, 1].forEach((s) => { circle(x + s * r * 0.42, y + r * 0.04, r * 0.09, C.ink); line([[x + s * r * 0.22, y - r * 0.12], [x + s * r * 0.62, y - r * 0.26]], C.ink, r * 0.07); }); },
};
const MOUTH = {
  happy:   (x, y, r) => { ctx.beginPath(); ctx.arc(x, y - r * 0.06, r * 0.26, Math.PI * 0.18, Math.PI * 0.82); ctx.strokeStyle = C.ink; ctx.lineWidth = r * 0.06; ctx.lineCap = 'round'; ctx.stroke(); },
  calm:    (x, y, r) => { ctx.beginPath(); ctx.arc(x, y - r * 0.1, r * 0.22, Math.PI * 0.22, Math.PI * 0.78); ctx.strokeStyle = C.ink; ctx.lineWidth = r * 0.055; ctx.lineCap = 'round'; ctx.stroke(); },
  shock:   (x, y, r) => inkEll(x, y + r * 0.04, r * 0.11, r * 0.15, '#7A3B32', r * 0.045),
  smug:    (x, y, r) => { ctx.beginPath(); ctx.moveTo(x - r * 0.2, y); ctx.quadraticCurveTo(x + r * 0.02, y + r * 0.14, x + r * 0.24, y - r * 0.05); ctx.strokeStyle = C.ink; ctx.lineWidth = r * 0.058; ctx.lineCap = 'round'; ctx.stroke(); },
  worried: (x, y, r) => { ctx.beginPath(); ctx.arc(x, y + r * 0.2, r * 0.2, Math.PI * 1.2, Math.PI * 1.8); ctx.strokeStyle = C.ink; ctx.lineWidth = r * 0.055; ctx.lineCap = 'round'; ctx.stroke(); },
  angry:   (x, y, r) => { ctx.beginPath(); ctx.arc(x, y + r * 0.22, r * 0.22, Math.PI * 1.18, Math.PI * 1.82); ctx.strokeStyle = C.ink; ctx.lineWidth = r * 0.065; ctx.lineCap = 'round'; ctx.stroke(); },
};

/** hats sit on the head; each is drawn for a head of radius r centred at (x, y) */
const HAT = {
  cap:     (x, y, r) => { inked(() => { ctx.beginPath(); ctx.arc(x, y - r * 0.18, r * 0.95, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); }, C.ink, 8);
                          inked(() => { ctx.beginPath(); ctx.ellipse(x - r * 0.1, y - r * 0.82, r * 0.5, r * 0.16, -0.08, 0, TAU); }, C.ink, 8); },
  pillbox: (x, y, r) => { inked(() => { ctx.beginPath(); ctx.roundRect(x - r * 0.62, y - r * 1.16, r * 1.24, r * 0.5, [r * 0.2, r * 0.2, r * 0.06, r * 0.06]); }, C.red, 8);
                          inked(() => { ctx.beginPath(); ctx.roundRect(x - r * 0.68, y - r * 0.72, r * 1.36, r * 0.16, r * 0.08); }, C.goldD, 6); },
  tophat:  (x, y, r) => { inked(() => { ctx.beginPath(); ctx.roundRect(x - r * 0.52, y - r * 1.62, r * 1.04, r * 0.95, r * 0.06); }, C.ink, 8);
                          inked(() => { ctx.beginPath(); ctx.ellipse(x, y - r * 0.68, r * 0.92, r * 0.17, 0, 0, TAU); }, C.ink, 8);
                          inked(() => { ctx.beginPath(); ctx.roundRect(x - r * 0.52, y - r * 0.92, r * 1.04, r * 0.2, 2); }, C.red, 0); },
  visor:   (x, y, r) => { inked(() => { ctx.beginPath(); ctx.roundRect(x - r * 0.66, y - r * 0.86, r * 1.32, r * 0.26, r * 0.12); }, C.green, 7);
                          inked(() => { ctx.beginPath(); ctx.ellipse(x - r * 0.08, y - r * 0.58, r * 0.62, r * 0.2, 0.05, Math.PI, TAU); }, C.greenD, 7); },
};

/** the head on its own — used for close-ups and the expression grid */
export function head(x, y, r, { skin = C.skin, hat = null, glasses = false, mood = 'calm', blush = true, monocle = false } = {}) {
  inkCircle(x, y, r, skin, r * 0.145);
  if (blush) { ell(x - r * 0.66, y + r * 0.26, r * 0.19, r * 0.12, C.blush); ell(x + r * 0.66, y + r * 0.26, r * 0.19, r * 0.12, C.blush); }
  (EYE[mood] || EYE.calm)(x, y - r * 0.12, r);
  if (glasses) {
    [-1, 1].forEach((s) => inkCircle(x + s * r * 0.42, y - r * 0.12, r * 0.3, 'rgba(255,255,255,0.14)', r * 0.085));
    line([[x - r * 0.12, y - r * 0.12], [x + r * 0.12, y - r * 0.12]], C.ink, r * 0.07);
  }
  if (monocle) { inkCircle(x + r * 0.42, y - r * 0.12, r * 0.3, 'rgba(255,255,255,0.14)', r * 0.085); line([[x + r * 0.7, y + r * 0.06], [x + r * 0.78, y + r * 0.5]], C.ink, r * 0.045); }
  (MOUTH[mood] || MOUTH.calm)(x, y + r * 0.42, r);
  if (hat) (HAT[hat] || (() => {}))(x, y, r);
}

// ---------------------------------------------------------------- people
const OUTFIT = {
  suit:    { body: C.navy, trim: C.navyD, collar: C.cloth, tie: C.tie, skin: C.skinT, hat: 'cap', glasses: true },
  bellhop: { body: C.red, trim: C.redD, collar: C.cloth, buttons: C.gold, skin: C.skin, hat: 'pillbox' },
  tycoon:  { body: '#2E2A3A', trim: '#1E1B28', collar: C.cloth, tie: C.gold, skin: C.skin, hat: 'tophat' },
  clerk:   { body: '#5B7F9E', trim: '#46657F', collar: C.cloth, tie: C.wine, skin: C.skinT, hat: 'visor' },
  maid:    { body: '#3C4A63', trim: '#2C3849', collar: C.cloth, apron: C.cloth, skin: C.skin, hat: null },
  guest:   { body: '#6B4A86', trim: '#523769', collar: C.cloth, tie: C.gold, skin: C.skinT, hat: null },
};

/**
 * A Rich Room person. h = full height, feet at y.
 * arms: {L:[deg,len], R:[deg,len]} measured from the shoulder, 0 = straight down.
 * hold(x, y) draws a prop in the right hand.
 */
export function person({ x, y = GROUND, h = 760, outfit = 'suit', mood = 'calm', dir = 1, glasses = null, hat = undefined, arms = null, hold = null, lean = 0 } = {}) {
  const o = OUTFIT[outfit] || OUTFIT.suit;
  const r = h * 0.19, hy = y - h + r;                    // head radius / head centre
  const by = hy + r * 0.9, legY = y - h * 0.155;         // body top / body bottom (legs below)
  const bh = legY - by, bw = r * 1.58;
  const sh = by + bh * 0.16;                             // shoulder line, inside the body

  ctx.save(); ctx.translate(x, 0); ctx.rotate(lean); ctx.translate(-x, 0);
  ell(x, y + 8, bw * 0.78, 18, C.shadow);               // contact shadow

  // legs first, so the body overlaps their tops
  [-1, 1].forEach((s) => {
    const lx = x + s * bw * 0.3;
    line([[lx, legY - bh * 0.1], [lx, y - h * 0.028]], C.ink, h * 0.026);
    inked(() => { ctx.beginPath(); ctx.roundRect(lx - h * 0.032 + s * dir * h * 0.012, y - h * 0.036, h * 0.064, h * 0.036, [3, 3, 2, 2]); }, C.ink, 0);
  });

  // body
  inked(() => {
    ctx.beginPath();
    ctx.moveTo(x - bw * 0.52, by + bh);
    ctx.lineTo(x - bw * 0.44, by + bh * 0.22);
    ctx.quadraticCurveTo(x - bw * 0.42, by, x - bw * 0.16, by);
    ctx.lineTo(x + bw * 0.16, by);
    ctx.quadraticCurveTo(x + bw * 0.42, by, x + bw * 0.44, by + bh * 0.22);
    ctx.lineTo(x + bw * 0.52, by + bh);
    ctx.closePath();
  }, o.body, h * 0.0125);

  // collar + tie / buttons / apron
  inked(() => { ctx.beginPath(); ctx.moveTo(x - bw * 0.2, by); ctx.lineTo(x, by + bh * 0.3); ctx.lineTo(x + bw * 0.2, by); ctx.closePath(); }, o.collar, h * 0.009);
  if (o.tie) inked(() => { ctx.beginPath(); ctx.moveTo(x - bw * 0.055, by + bh * 0.16); ctx.lineTo(x + bw * 0.055, by + bh * 0.16); ctx.lineTo(x + bw * 0.035, by + bh * 0.62); ctx.lineTo(x - bw * 0.035, by + bh * 0.62); ctx.closePath(); }, o.tie, h * 0.008);
  if (o.buttons) [0.34, 0.52, 0.7].forEach((f) => inkCircle(x, by + bh * f, h * 0.0145, o.buttons, h * 0.006));
  if (o.apron) inked(() => { ctx.beginPath(); ctx.roundRect(x - bw * 0.3, by + bh * 0.34, bw * 0.6, bh * 0.66, [6, 6, 2, 2]); }, o.apron, h * 0.008);

  // arms: a sleeve in the body colour with a round mitt hand
  // arms: ink-outlined sleeves that start inside the shoulder, hands as mitts at the end
  const A = arms || { L: [-16, 0.9], R: [16, 0.9] };
  const handAt = {};
  [['L', -1], ['R', 1]].forEach(([k, s]) => {
    const [deg, lenF] = A[k] || [s * 16, 0.9];
    const a = (deg * Math.PI) / 180, len = bh * 0.82 * lenF;
    const ox = x + s * bw * 0.38, oy = sh;                      // origin sits inside the body
    const ex = ox + Math.sin(a) * len, ey = oy + Math.cos(a) * len;
    line([[ox, oy], [ex, ey]], C.ink, h * 0.052 + h * 0.019);   // ink first
    line([[ox, oy], [ex, ey]], o.body, h * 0.052);              // sleeve over it, leaving an outline
    inkCircle(ex, ey, h * 0.042, o.skin ?? C.skin, h * 0.011);
    handAt[k] = [ex, ey];
  });

  head(x, hy, r, { skin: o.skin, hat: hat === undefined ? o.hat : hat, glasses: glasses ?? !!o.glasses, mood });
  if (hold) { const [hx, hy2] = handAt.R; ctx.save(); hold(hx, hy2); ctx.restore(); }
  ctx.restore();
  return { headY: hy, r, handR: handAt.R, handL: handAt.L };
}

// ---------------------------------------------------------------- money props
export function coin(x, y, s = 1) { inkEll(x, y, 34 * s, 12 * s, C.gold, 5 * s); ell(x, y - 2 * s, 22 * s, 6 * s, C.goldD); }
export function coinStack(x, y, n = 5, s = 1) { for (let i = n - 1; i >= 0; i--) coin(x, y - i * 19 * s, s); }
export function coinBag(x, y, s = 1) {
  inked(() => { ctx.beginPath(); ctx.moveTo(x - 60 * s, y); ctx.quadraticCurveTo(x - 78 * s, y - 70 * s, x - 22 * s, y - 92 * s); ctx.lineTo(x + 22 * s, y - 92 * s); ctx.quadraticCurveTo(x + 78 * s, y - 70 * s, x + 60 * s, y); ctx.closePath(); }, '#D8C9A8', 7 * s);
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 26 * s, y - 104 * s, 52 * s, 18 * s, 6 * s); }, C.woodD, 6 * s);
  bigText('$', x, y - 44 * s, 54 * s, C.goldD, null);
}
export function ledger(x, y, s = 1) {
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 78 * s, y - 24 * s, 156 * s, 24 * s, 4 * s); }, C.wine, 6 * s);
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 72 * s, y - 34 * s, 144 * s, 12 * s, 3 * s); }, C.cloth, 5 * s);
}
export function bankerLamp(x, y, s = 1) {
  line([[x, y], [x, y - 78 * s]], C.brassD, 11 * s);
  inked(() => { ctx.beginPath(); ctx.ellipse(x, y, 40 * s, 13 * s, 0, 0, TAU); }, C.brass, 6 * s);
  inked(() => { ctx.beginPath(); ctx.moveTo(x - 62 * s, y - 78 * s); ctx.quadraticCurveTo(x, y - 116 * s, x + 62 * s, y - 78 * s); ctx.closePath(); }, C.green, 7 * s);
  pool(x, y - 50 * s, 150 * s);
}
export function vaultDoor(x, y, r, { open = 0 } = {}) {
  inkCircle(x, y, r, C.steelD, 10);
  inkCircle(x, y, r * 0.88, C.steel, 8);
  inkCircle(x, y, r * 0.62, '#B9A982', 7);
  inkCircle(x, y, r * 0.3, C.brass, 7);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + open; circle(x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76, r * 0.055, C.brassD); }
  for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + open * 2; line([[x + Math.cos(a) * r * 0.1, y + Math.sin(a) * r * 0.1], [x + Math.cos(a) * r * 0.27, y + Math.sin(a) * r * 0.27]], C.brassD, r * 0.07); }
  inkCircle(x, y, r * 0.1, C.brassD, 5);
}
export function coinShelf(x, y, w, s = 1) {
  inked(() => { ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, 16 * s, 3); }, C.woodD, 6);
  const n = Math.max(2, Math.floor(w / (86 * s)));
  for (let i = 0; i < n; i++) coinStack(x - w / 2 + (i + 0.5) * (w / n), y - 6 * s, 3 + ((i * 7) % 3), 0.74 * s);
}

// ---------------------------------------------------------------- dining props
export function cloche(x, y, s = 1) {
  inked(() => { ctx.beginPath(); ctx.ellipse(x, y, 96 * s, 20 * s, 0, 0, TAU); }, '#D9D9DD', 7 * s);
  inked(() => { ctx.beginPath(); ctx.arc(x, y, 84 * s, Math.PI, TAU); ctx.closePath(); }, '#E8E8EC', 8 * s);
  ell(x - 26 * s, y - 42 * s, 20 * s, 30 * s, 'rgba(255,255,255,0.75)', -0.5);
  inkCircle(x, y - 90 * s, 13 * s, '#C9C9CF', 6 * s);
}
export function tray(x, y, s = 1) { inked(() => { ctx.beginPath(); ctx.ellipse(x, y, 130 * s, 22 * s, 0, 0, TAU); }, '#CFCFD6', 7 * s); ell(x, y - 5 * s, 104 * s, 13 * s, '#E6E6EB'); }
export function wineGlass(x, y, s = 1, filled = true) {
  line([[x, y], [x, y - 34 * s]], C.ink, 5 * s);
  inked(() => { ctx.beginPath(); ctx.ellipse(x, y, 16 * s, 5 * s, 0, 0, TAU); }, C.cloth, 4 * s);
  inked(() => { ctx.beginPath(); ctx.moveTo(x - 20 * s, y - 34 * s); ctx.quadraticCurveTo(x, y - 86 * s, x + 20 * s, y - 34 * s); ctx.closePath(); }, 'rgba(255,255,255,0.5)', 4.5 * s);
  if (filled) inked(() => { ctx.beginPath(); ctx.moveTo(x - 15 * s, y - 44 * s); ctx.quadraticCurveTo(x, y - 72 * s, x + 15 * s, y - 44 * s); ctx.closePath(); }, C.wine, 0);
}
export function roses(x, y, s = 1) {
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 16 * s, y - 42 * s, 32 * s, 42 * s, [4, 4, 8, 8]); }, C.cloth, 5 * s);
  [[-18, -70], [0, -84], [18, -68]].forEach(([dx, dy]) => { line([[x, y - 40 * s], [x + dx * s, y + dy * s]], C.green, 5 * s); inkCircle(x + dx * s, y + dy * s, 14 * s, C.red, 5 * s); });
}
export function sconce(x, y, s = 1) {
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 7 * s, y, 14 * s, 44 * s, 4 * s); }, C.brass, 5 * s);
  [-1, 1].forEach((d) => { line([[x, y + 10 * s], [x + d * 34 * s, y - 16 * s]], C.brass, 6 * s); inked(() => { ctx.beginPath(); ctx.moveTo(x + d * 34 * s - 17 * s, y - 16 * s); ctx.lineTo(x + d * 34 * s + 17 * s, y - 16 * s); ctx.lineTo(x + d * 34 * s + 11 * s, y - 50 * s); ctx.lineTo(x + d * 34 * s - 11 * s, y - 50 * s); ctx.closePath(); }, '#F6E6BE', 5 * s); pool(x + d * 34 * s, y - 34 * s, 120 * s); });
}
export function framedArt(x, y, w, h, s = 1) {
  inked(() => { ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 4); }, C.brass, 8 * s);
  inked(() => { ctx.beginPath(); ctx.roundRect(x - w / 2 + 12 * s, y - h / 2 + 12 * s, w - 24 * s, h - 24 * s, 2); }, '#5C6B4F', 4 * s);
  ell(x, y + h * 0.16, w * 0.3, h * 0.14, '#7E8C66');
  circle(x + w * 0.2, y - h * 0.2, w * 0.08, '#D8C98E');
}
export function chair(x, y, s = 1, back = true) {
  if (back) inked(() => { ctx.beginPath(); ctx.roundRect(x - 34 * s, y - 150 * s, 68 * s, 110 * s, [26 * s, 26 * s, 6, 6]); }, C.wine, 7 * s);
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 40 * s, y - 56 * s, 80 * s, 22 * s, 6 * s); }, C.brass, 6 * s);
  [-1, 1].forEach((d) => line([[x + d * 30 * s, y - 36 * s], [x + d * 30 * s, y]], C.woodD, 8 * s));
}
export function roundTable(x, y, s = 1, dress = true) {
  inked(() => { ctx.beginPath(); ctx.moveTo(x - 110 * s, y - 96 * s); ctx.lineTo(x + 110 * s, y - 96 * s); ctx.lineTo(x + 86 * s, y); ctx.lineTo(x - 86 * s, y); ctx.closePath(); }, C.cloth, 7 * s);
  inked(() => { ctx.beginPath(); ctx.ellipse(x, y - 96 * s, 110 * s, 26 * s, 0, 0, TAU); }, C.cloth, 7 * s);
  if (dress) { wineGlass(x - 54 * s, y - 100 * s, 0.9 * s); wineGlass(x + 54 * s, y - 100 * s, 0.9 * s); roses(x, y - 104 * s, 0.8 * s); }
}
export function carpetRunner(x, y, w, h) {
  inked(() => { ctx.beginPath(); ctx.moveTo(x - w * 0.5, y + h); ctx.lineTo(x + w * 0.5, y + h); ctx.lineTo(x + w * 0.22, y); ctx.lineTo(x - w * 0.22, y); ctx.closePath(); }, C.carpet, 8);
  ctx.save(); ctx.beginPath(); ctx.moveTo(x - w * 0.5, y + h); ctx.lineTo(x + w * 0.5, y + h); ctx.lineTo(x + w * 0.22, y); ctx.lineTo(x - w * 0.22, y); ctx.closePath(); ctx.clip();
  for (let i = 0; i < 9; i++) { const t = i / 8, yy = y + h * t * t; line([[x - w * 0.5, yy], [x + w * 0.5, yy]], C.carpetD, 5); }
  for (let i = -3; i <= 3; i++) line([[x + i * w * 0.07, y], [x + i * w * 0.16, y + h]], C.carpetD, 5);
  ctx.restore();
}

// ---------------------------------------------------------------- rooms (1080x1920 frames)
export function vaultRoom({ lamp = true } = {}) {
  ctx.fillStyle = C.woodD; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#4A2C1A'; ctx.fillRect(0, 0, W, GROUND - 120);
  // back wall panelling
  for (let i = 0; i < 6; i++) { inked(() => { ctx.beginPath(); ctx.roundRect(40 + i * 172, 300, 150, 420, 6); }, '#53311E', 5); }
  vaultDoor(300, 620, 290);
  coinShelf(820, 520, 360);
  coinShelf(820, 760, 360);
  coinShelf(820, 1000, 360);
  // floor
  inked(() => { ctx.beginPath(); ctx.rect(-10, GROUND - 120, W + 20, H - GROUND + 140); }, '#6B4425', 0);
  line([[0, GROUND - 120], [W, GROUND - 120]], C.ink, 9);
  // desk
  inked(() => { ctx.beginPath(); ctx.roundRect(120, GROUND - 60, 840, 120, 10); }, C.wood, 9);
  inked(() => { ctx.beginPath(); ctx.roundRect(150, GROUND + 60, 60, 210, 6); }, C.woodD, 8);
  inked(() => { ctx.beginPath(); ctx.roundRect(870, GROUND + 60, 60, 210, 6); }, C.woodD, 8);
  if (lamp) bankerLamp(830, GROUND - 60, 1.25);
  ledger(240, GROUND - 60, 1.1);
}
export function diningRoom({ wide = false } = {}) {
  ctx.fillStyle = C.redD; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#A8302C'; ctx.fillRect(0, 0, W, GROUND - 80);
  // damask dots
  for (let r0 = 0; r0 < 9; r0++) for (let c0 = 0; c0 < 7; c0++) circle(70 + c0 * 160 + (r0 % 2 ? 80 : 0), 140 + r0 * 150, 9, '#B8403A');
  inked(() => { ctx.beginPath(); ctx.rect(-10, 980, W + 20, 140); }, '#C9B392', 0);   // chair rail
  line([[0, 980], [W, 980]], C.ink, 8); line([[0, 1120], [W, 1120]], C.ink, 8);
  framedArt(190, 560, 260, 320, 1);
  sconce(640, 480, 1.25); sconce(960, 480, 1.25);
  // floor
  inked(() => { ctx.beginPath(); ctx.rect(-10, GROUND - 80, W + 20, H - GROUND + 100); }, '#C9A97C', 0);
  line([[0, GROUND - 80], [W, GROUND - 80]], C.ink, 9);
  carpetRunner(540, GROUND - 80, 980, H - GROUND + 100);
  if (wide) { roundTable(170, GROUND - 40, 0.9); chair(170, GROUND - 30, 0.8, false); }
  roundTable(900, GROUND - 30, 1.0); chair(980, GROUND - 20, 0.85);
}
export function officeRoom() {
  ctx.fillStyle = '#2A3A4A'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#35485C'; ctx.fillRect(0, 0, W, GROUND - 100);
  inked(() => { ctx.beginPath(); ctx.roundRect(120, 300, 840, 520, 10); }, '#17212C', 9);   // night window
  for (let i = 0; i < 40; i++) { const gx = 150 + (i % 8) * 102, gy = 340 + Math.floor(i / 8) * 96; if ((i * 7) % 3) circle(gx + 20, gy + 20, 13, C.gold); }
  line([[540, 300], [540, 820]], C.ink, 8); line([[120, 560], [960, 560]], C.ink, 8);
  inked(() => { ctx.beginPath(); ctx.rect(-10, GROUND - 100, W + 20, H - GROUND + 120); }, '#4A3C2E', 0);
  line([[0, GROUND - 100], [W, GROUND - 100]], C.ink, 9);
  inked(() => { ctx.beginPath(); ctx.roundRect(180, GROUND - 50, 720, 110, 10); }, C.wood, 9);
  bankerLamp(790, GROUND - 50, 1.15);
  coinStack(300, GROUND - 56, 4, 0.9);
}

// ---------------------------------------------------------------- type
/** the cream title bar across the top of a frame — the thumbnail look */
export function titleBar(text, { y = 150, size = 118, w = W - 40 } = {}) {
  inked(() => { ctx.beginPath(); ctx.roundRect(20, y - size * 0.72, w, size * 1.34, 14); }, C.cream, 10);
  ctx.font = `900 ${size}px Inter`; let s = 1;
  const tw = ctx.measureText(text).width; if (tw > w - 60) s = (w - 60) / tw;
  bigText(text, 20 + w / 2, y, size, C.ink, null, s);
}
/** caption chunk: 1-3 words, exactly one gold word */
export function captionBar(words, x = W / 2, y = CAPLOOK.y, s = 1) {
  ctx.font = `900 ${84 * s}px Inter`;
  const gap = 22 * s, parts = words.map((w) => ({ ...w, w: ctx.measureText(w.txt).width }));
  const tot = parts.reduce((a, p) => a + p.w, 0) + gap * (parts.length - 1);
  let cx = x - tot / 2;
  parts.forEach((p) => {
    ctx.save(); ctx.translate(cx + p.w / 2, y);
    ctx.font = `900 ${84 * s}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.lineWidth = 84 * s * 0.26; ctx.strokeStyle = C.ink; ctx.strokeText(p.txt, 0, 0);
    ctx.fillStyle = p.hi ? C.gold : C.cream; ctx.fillText(p.txt, 0, 0);
    ctx.restore(); cx += p.w + gap;
  });
}
/**
 * The split-screen thumbnail: two already-rendered 1080x1920 canvases, centre-cropped side
 * by side under one cream title bar, inside a 16:9 box.
 */
export function splitThumb(title, imgL, imgR, box) {
  const { x, y, w, h } = box;
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.clip();
  ctx.fillStyle = C.cream; ctx.fillRect(x, y, w, h);
  const barH = h * 0.17, half = (w - 10) / 2, ph = h - barH;
  // crop the tallest centre strip of the source that matches the half's aspect
  const srcW = Math.min(W, H * (half / ph)), srcH = srcW * (ph / half), sx = (W - srcW) / 2, sy = 520;
  [[x, imgL], [x + half + 10, imgR]].forEach(([hx, img]) => {
    ctx.drawImage(img, sx, Math.min(sy, H - srcH), srcW, srcH, hx, y + barH, half, ph);
  });
  ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.strokeRect(x + half + 1, y + barH, 8, ph);
  ctx.font = `900 ${barH * 0.62}px Inter`; let s = 1;
  const tw = ctx.measureText(title).width; if (tw > w - 40) s = (w - 40) / tw;
  bigText(title, x + w / 2, y + barH * 0.52, barH * 0.62, C.ink, null, s);
  ctx.restore();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.stroke();
}

// ---------------------------------------------------------------- laboratory (1966)
/** the biohazard trefoil: three rings overlapping a punched centre. b 0..1 assembles it. */
export function trefoil(x, y, s, b = 1, col = C.red) {
  if (b <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const R = 124, D = 122;
  for (let i = 0; i < 3; i++) {
    const p = Math.max(0, Math.min(1, (b - 0.18 - i * 0.14) / 0.42)); if (p <= 0) continue;
    const a = -Math.PI / 2 + (i * TAU) / 3, dd = D * p;
    ctx.save(); ctx.translate(Math.cos(a) * dd, Math.sin(a) * dd); ctx.rotate(a + Math.PI / 2 + (1 - p) * 1.1); ctx.scale(p, p);
    inked(() => { ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.arc(0, 0, R * 0.47, 0, TAU, true); }, col, 9);
    ctx.restore();
  }
  const c = Math.max(0, Math.min(1, b / 0.3));
  if (c > 0) {
    inked(() => { ctx.beginPath(); ctx.arc(0, 0, 76 * c, 0, TAU); }, C.cream, 0);
    inked(() => { ctx.beginPath(); ctx.arc(0, 0, 76 * c, 0, TAU); ctx.arc(0, 0, 34 * c, 0, TAU, true); }, col, 9);
  }
  ctx.restore();
}

/** a warm 1966 laboratory: tiled wall, wood bench, glassware, one hanging lamp */
export function labRoom({ mark = 0 } = {}) {
  ctx.fillStyle = '#6E5C44'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#C9B48C'; ctx.fillRect(0, 0, W, GROUND - 120);
  for (let r0 = 0; r0 < 7; r0++) for (let c0 = 0; c0 < 6; c0++) {
    inked(() => { ctx.beginPath(); ctx.roundRect(20 + c0 * 178, 120 + r0 * 150, 168, 140, 4); }, '#D3C09B', 4);
  }
  // hanging lamp
  line([[540, 0], [540, 210]], C.ink, 10);
  inked(() => { ctx.beginPath(); ctx.moveTo(400, 300); ctx.quadraticCurveTo(540, 170, 680, 300); ctx.closePath(); }, C.green, 9);
  pool(540, 340, 330);
  if (mark > 0) trefoil(540, 620, 0.86 * mark, 1);
  // bench
  inked(() => { ctx.beginPath(); ctx.rect(-10, GROUND - 120, W + 20, H - GROUND + 140); }, '#6E5C44', 0);
  line([[0, GROUND - 120], [W, GROUND - 120]], C.ink, 9);
  inked(() => { ctx.beginPath(); ctx.roundRect(60, GROUND - 56, 960, 112, 10); }, C.wood, 9);
  inked(() => { ctx.beginPath(); ctx.roundRect(100, GROUND + 56, 56, 200, 6); }, C.woodD, 8);
  inked(() => { ctx.beginPath(); ctx.roundRect(924, GROUND + 56, 56, 200, 6); }, C.woodD, 8);
  flask(220, GROUND - 56, 1.0); jar(330, GROUND - 56, 0.9); flask(880, GROUND - 56, 0.8);
}
export function flask(x, y, s = 1) {
  inked(() => { ctx.beginPath(); ctx.moveTo(x - 20 * s, y - 120 * s); ctx.lineTo(x - 12 * s, y - 64 * s); ctx.lineTo(x - 50 * s, y); ctx.lineTo(x + 50 * s, y); ctx.lineTo(x + 12 * s, y - 64 * s); ctx.lineTo(x + 20 * s, y - 120 * s); ctx.closePath(); }, '#CFE0D6', 7 * s);
  inked(() => { ctx.beginPath(); ctx.moveTo(x - 38 * s, y - 24 * s); ctx.lineTo(x + 38 * s, y - 24 * s); ctx.lineTo(x + 50 * s, y); ctx.lineTo(x - 50 * s, y); ctx.closePath(); }, C.green, 0);
}
export function jar(x, y, s = 1) {
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 34 * s, y - 96 * s, 68 * s, 96 * s, 8 * s); }, '#CFE0D6', 7 * s);
  inked(() => { ctx.beginPath(); ctx.roundRect(x - 40 * s, y - 112 * s, 80 * s, 22 * s, 5 * s); }, C.brassD, 6 * s);
}

/** a candidate design card from the 1966 test; kind draws the mark on it */
export function designCard(x, y, s, kind, { dim = 0, lift = 0, rot = 0 } = {}) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y - lift); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = 1 - dim * 0.68;
  inkRR(-130, -170, 260, 340, 10, C.cream, 9);
  const ink = dim > 0.5 ? '#8A7A62' : C.ink;
  if (kind === 'skull') {
    inked(() => { ctx.beginPath(); ctx.arc(0, -30, 74, Math.PI, TAU); ctx.lineTo(74, 2); ctx.quadraticCurveTo(74, 36, 38, 40); ctx.lineTo(38, 70); ctx.lineTo(-38, 70); ctx.lineTo(-38, 40); ctx.quadraticCurveTo(-74, 36, -74, 2); ctx.closePath(); }, ink, 7);
    circle(-30, -28, 20, C.cream); circle(30, -28, 20, C.cream);
  } else if (kind === 'trefoil') trefoil(0, -10, 0.4, 1, dim > 0.5 ? '#8A7A62' : C.red);
  else if (kind === 'star') inked(() => { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * TAU) / 10, r = i % 2 ? 38 : 92; ctx.lineTo(Math.cos(a) * r, -10 + Math.sin(a) * r); } ctx.closePath(); }, ink, 7);
  else if (kind === 'cross') { inkRR(-24, -98, 48, 176, 6, ink, 7); inkRR(-98, -24, 176, 48, 6, ink, 7); }
  else if (kind === 'bolt') inked(() => { ctx.beginPath(); ctx.moveTo(18, -102); ctx.lineTo(-52, -4); ctx.lineTo(-6, -4); ctx.lineTo(-28, 90); ctx.lineTo(52, -20); ctx.lineTo(4, -20); ctx.closePath(); }, ink, 7);
  else if (kind === 'eye') { inkEll(0, -10, 92, 54, ink, 7); circle(0, -10, 28, C.cream); }
  ctx.restore();
}

/** a cream label slip with heavy ink type, pinned on the wall */
export function slip(text, x, y, sc = 1, rot = -0.02, size = 54) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`;
  const w = ctx.measureText(text).width + 76;
  inkRR(-w / 2, -size * 0.86, w, size * 1.72, 8, C.cream, 8);
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4);
  ctx.restore();
}

/** two bars for the memory / meaning result */
export function scoreBars(x, y, p, labels) {
  const hs = [330, 96];
  [-1, 1].forEach((s, i) => {
    const bx = x + s * 200, h = hs[i] * Math.max(0, Math.min(1, (p - i * 0.18) / 0.6));
    if (h <= 1) return;
    inkRR(bx - 82, y - h, 164, h, 6, i ? C.woodD : C.gold, 9);
    ctx.font = '900 40px Inter'; ctx.fillStyle = C.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(labels[i], bx, y + 54);
  });
}
