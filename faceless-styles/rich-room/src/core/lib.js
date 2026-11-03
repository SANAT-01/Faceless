// Rich Room engine: canvas, palette, math and drawing primitives.
// Every drawing function in the kit uses the shared `ctx` exported here.
export const W = 1080, H = 1920, FPS = 30;
export let ctx = null;
export function setCtx(c) { ctx = c; }

// The Rich Room palette. Warm, moneyed interiors; people are flat shapes in heavy ink.
export const C = {
  ink: '#1C1511', inkSoft: '#3A2B21',
  cream: '#F4E7D3', wall: '#E9D7B8', cloth: '#F8F3E8', white: '#FFFFFF',
  skin: '#F7E7D2', skinT: '#E89A43', skinShade: '#DFC7A9', blush: '#EE9B8C',
  navy: '#22406E', navyD: '#1A3156', tie: '#C33027',
  red: '#C42B29', redD: '#8E2220', wine: '#7A1F22',
  gold: '#E9B53E', goldD: '#BE8A1E', brass: '#C9A24A', brassD: '#8F7128',
  steel: '#A79878', steelD: '#7D7058',
  wood: '#5A3620', woodD: '#3E2415', woodHi: '#7C5030',
  green: '#2F8A63', greenD: '#1F6446',
  carpet: '#A6382F', carpetD: '#7E2A23',
  shadow: 'rgba(28,21,17,0.18)', glow: 'rgba(233,181,62,0.26)',
};

// ---------- math ----------
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
export const eo = (t) => 1 - Math.pow(1 - t, 3);
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const TAU = Math.PI * 2;

// ---------- primitives ----------
export function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function ell(x, y, rx, ry, fill, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function line(pts, color, w, cap = 'round') {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = cap; ctx.lineJoin = 'round'; ctx.stroke();
}
export function fillAll(color) { ctx.fillStyle = color; ctx.fillRect(-300, -300, W + 600, H + 600); }

/** the signature move: fill a shape, then stroke it in heavy ink. pathFn only builds the path. */
export function inked(pathFn, fill, lw = 9, stroke = C.ink) {
  pathFn(); if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); }
}
export function inkCircle(x, y, r, fill, lw = 9) { inked(() => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); }, fill, lw); }
export function inkRR(x, y, w, h, r, fill, lw = 9) { inked(() => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }, fill, lw); }
export function inkEll(x, y, rx, ry, fill, lw = 9, rot = 0) { inked(() => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); }, fill, lw); }

/** a soft warm pool of light (lamps, sconces, the vault glow) */
export function pool(x, y, r, color = C.glow) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'rgba(233,181,62,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
}

/** heavy black display text with a cream outline — the thumbnail/caption look */
export function bigText(text, x, y, size, fill = C.ink, outline = C.cream, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  if (outline) { ctx.lineWidth = size * 0.22; ctx.strokeStyle = outline; ctx.strokeText(text, 0, 0); }
  ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
  ctx.restore();
}
