// The Rich Room style sheet, drawn with the style's own kit.
import { ctx, setCtx, C, W, H } from './core/lib.js';
import { startBoard, panel, frame, cell, small, swatches, rules } from './core/board.js';
import * as K from './core/kit.js';
const { P } = K;

const cv = document.getElementById('cv');
await document.fonts.load('900 40px Inter'); await document.fonts.load('800 40px Inter');
startBoard(cv, { title: 'RICH ROOM: VIDEO STYLE SHEET', accent: P.gold });

// a private 1080x1920 scratch canvas, for the split thumbnail
const off = document.createElement('canvas'); off.width = W; off.height = H;
const offc = off.getContext('2d');
function render(drawFn) {
  const keep = ctx; setCtx(offc);
  offc.setTransform(1, 0, 0, 1, 0, 0); offc.clearRect(0, 0, W, H); offc.save(); drawFn(); offc.restore();
  setCtx(keep);
  const c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').drawImage(off, 0, 0);
  return c;
}

const R1 = { y: 78, h: 500 }, R2 = { y: 588, h: 478 };

// ---------------------------------------------------------- 1 · hero frame
let b = panel(20, R1.y, 548, R1.h, 1, 'HERO FRAME');
frame(b.x + 2, b.y, 232, () => {
  K.vaultRoom({});
  K.person({ x: 420, y: K.GROUND, h: 840, outfit: 'suit', mood: 'smug', arms: { L: [-26, 0.9], R: [30, 0.85] } });
  K.coinStack(660, K.GROUND - 62, 5, 1.05);
  K.titleBar('HE COUNTED IT TWICE');
  K.captionBar([{ txt: 'every' }, { txt: 'single' }, { txt: 'coin', hi: 1 }]);
});
[['ROUND HEADS,\nHEAVY INK LINES', 30], ['WARM, ORNATE\nFLAT ROOMS', 108], ['CREAM TITLE BAR\nACROSS THE TOP', 186],
 ['ONE GOLD WORD\nPER CAPTION', 264], ['MONEY, SERVICE,\nSTATUS STORIES', 342]]
  .forEach(([t, dy]) => small(t, b.x + 258, b.y + dy, 'left', 16));

// ---------------------------------------------------------- 2 · the cast
b = panel(578, R1.y, 690, R1.h, 2, 'THE CAST');
ctx.save();
ctx.fillStyle = '#5A3620'; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, 256, 12); ctx.fill();
ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, 256, 12); ctx.clip();
ctx.fillStyle = '#6B4425'; ctx.fillRect(b.x, b.y + 196, b.w, 60);
[['suit', 'smug'], ['bellhop', 'happy'], ['tycoon', 'calm'], ['clerk', 'worried'], ['maid', 'happy'], ['guest', 'shock']]
  .forEach(([o, m], i) => {
    ctx.save(); ctx.translate(b.x + 54 + i * 108, b.y + 232); ctx.scale(0.265, 0.265);
    K.person({ x: 0, y: 0, h: 790, outfit: o, mood: m });
    ctx.restore();
  });
ctx.restore();                       // close the clip, or every later panel is clipped away
['BANKER', 'BELLHOP', 'TYCOON', 'CLERK', 'MAID', 'GUEST'].forEach((t, i) => small(t, b.x + 54 + i * 108, b.y + 278, 'center', 13, '#C9BCA8'));
small('RECIPE: BIG ROUND HEAD · BEAN BODY · MITT HANDS · ONE UNIFORM, ONE HAT', b.x, b.y + 302, 'left', 14, '#9A8F7A');
swatches({ x: b.x + 76, y: b.y + 310, w: 500, h: 90 },
  [['CREAM', P.cream], ['INK', P.ink], ['GOLD', P.gold], ['NAVY', P.navy], ['RED', P.red], ['WOOD', P.wood]]);

// ---------------------------------------------------------- 3 · faces
b = panel(1278, R1.y, 622, R1.h, 3, 'FACES DO THE ACTING');
[['calm', 'CALM'], ['happy', 'HAPPY'], ['smug', 'SMUG'], ['shock', 'SHOCK'], ['worried', 'WORRIED'], ['angry', 'ANGRY']]
  .forEach(([m, label], i) => {
    const x = b.x + 100 + (i % 3) * 196, y = b.y + 84 + ((i / 3) | 0) * 188;
    ctx.fillStyle = '#241B15'; ctx.beginPath(); ctx.roundRect(x - 84, y - 84, 168, 168, 12); ctx.fill();
    ctx.save(); ctx.translate(x, y - 6); ctx.scale(0.55, 0.55); K.head(0, 0, 110, { skin: P.skin, mood: m, hat: i % 2 ? 'pillbox' : 'cap', glasses: i === 0 }); ctx.restore();
    small(label, x, y + 66, 'center', 14, '#D7C9B2');
  });
small('THE HEAD IS THE PERFORMANCE:\nEYES FIRST, THEN THE MOUTH.', b.x, b.y + 390, 'left', 15, '#9A8F7A');

// ---------------------------------------------------------- 4 · worlds
b = panel(20, R2.y, 760, R2.h, 4, 'WORLDS');
const sw = 196, sx = (i) => b.x + 22 + i * (sw + 42);
frame(sx(0), b.y, sw, () => { K.vaultRoom({}); K.person({ x: 420, y: K.GROUND, h: 800, outfit: 'suit', mood: 'calm' }); });
frame(sx(1), b.y, sw, () => { K.diningRoom({ wide: true }); K.person({ x: 520, y: K.GROUND, h: 800, outfit: 'bellhop', mood: 'happy', arms: { L: [-24, 0.72], R: [66, 0.95] }, hold: (hx, hy) => { K.tray(hx + 8, hy, 0.9); K.cloche(hx + 8, hy - 6, 0.78); } }); });
frame(sx(2), b.y, sw, () => { K.officeRoom(); K.person({ x: 560, y: K.GROUND, h: 800, outfit: 'tycoon', mood: 'smug' }); });
['(A) THE VAULT', '(B) THE DINING ROOM', '(C) THE OFFICE, NIGHT'].forEach((t, i) => small(t, sx(i) + sw / 2, b.y + sw * 16 / 9 + 24, 'center', 14));

// ---------------------------------------------------------- 5 · thumbnail + captions
b = panel(790, R2.y, 560, R2.h, 5, 'THUMBNAIL & CAPTIONS');
const imgL = render(() => { K.vaultRoom({}); K.person({ x: 450, y: K.GROUND, h: 860, outfit: 'suit', mood: 'smug', arms: { L: [-28, 0.85], R: [32, 0.8] } }); K.coinStack(700, K.GROUND - 62, 4, 1.05); });
const imgR = render(() => { K.diningRoom({}); K.person({ x: 470, y: K.GROUND, h: 860, outfit: 'bellhop', mood: 'happy', arms: { L: [-26, 0.74], R: [68, 1.0] }, hold: (hx, hy) => { K.tray(hx, hy, 1.0); K.cloche(hx, hy - 8, 0.85); } }); });
const tw = 462, th = tw * 9 / 16;
K.splitThumb('ONE OF THEM IS LYING', imgL, imgR, { x: b.x + (b.w - tw) / 2, y: b.y, w: tw, h: th });
const capY = b.y + th + 22;
ctx.fillStyle = '#241B15'; ctx.beginPath(); ctx.roundRect(b.x, capY, b.w, 92, 12); ctx.fill();
[[[{ txt: 'he' }, { txt: 'paid' }, { txt: 'nothing', hi: 1 }], 30], [[{ txt: 'the' }, { txt: 'bill', hi: 1 }], 70]]
  .forEach(([wds, dy]) => { ctx.save(); ctx.translate(b.x + b.w / 2, capY + dy); ctx.scale(0.34, 0.34); K.captionBar(wds, 0, 0, 1); ctx.restore(); });
small('LOWERCASE · 2-3 WORDS · ONE GOLD WORD · INK OUTLINE', b.x, capY + 116, 'left', 13, '#9A8F7A');

// ---------------------------------------------------------- 6 · rules
b = panel(1360, R2.y, 540, R2.h, 6, 'RULES');
rules(b, [
  'OPEN ON THE MONEY: SHOW THE PRIZE.',
  'ONE ROOM PER BEAT; CUT EVERY 1.5-3 S.',
  'PEOPLE NEVER LEAVE THE INK OUTLINE.',
  'GOLD IS MONEY AND THE KEY WORD ONLY.',
  'EVERY ROOM HAS ONE WARM LIGHT.',
  'FACES REACT BEFORE THE LINE LANDS.',
  'END ON THE COST NOBODY SAW COMING.',
], b.y + 26, 15, 54);

window.SHEET_READY = true;
