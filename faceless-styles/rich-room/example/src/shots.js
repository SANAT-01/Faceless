// HOW THE BIOHAZARD SIGN WAS BORN : the shot list (Rich Room example).
// Round-headed people in heavy ink, warm 1966 rooms, cream title slips, one gold caption word.
import { ctx, W, H, TAU, C, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line, inked, inkRR, inkCircle, pool } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const { P } = K;

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const SIX = ['skull', 'star', 'trefoil', 'bolt', 'eye', 'cross'];
  const sixPos = (i) => [540 + ((i % 3) - 1) * 300, 660 + ((i / 3) | 0) * 400];

  // 1 · before 1966: the lab, no agreed warning on the wall
  { const rib = Wd('sixty', 0);
    add({ id: 'S01', at: 0, cam: [540, 820], zoom: 0.08, note: 'the 1966 lab under its lamp; BEFORE 1966 slip', draw(lt, d, t) {
      K.labRoom({});
      K.slip('BEFORE 1966', 540, 560, eob(seg(lt, rib - 0.2, rib + 0.3)), 0.02, 62);
    } });
    cue(0.1, 'whoosh'); cue(rib, 'pop'); }

  // 2 · three blank signs: it could be anything
  { const st = cut_(1);
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'three blank sign cards with question marks', draw(lt, d, t) {
      K.labRoom({});
      [0, 1, 2].forEach((i) => {
        const p = eob(clamp((lt - 0.1 - i * 0.15) / 0.38)); if (p <= 0) return;
        ctx.save(); ctx.translate(540 + (i - 1) * 310, 620); ctx.scale(p, p); ctx.rotate((i - 1) * 0.05);
        inkRR(-116, -140, 232, 280, 10, C.cream, 9);
        ctx.font = '900 170px Inter'; ctx.fillStyle = '#8A7A62'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 6); ctx.restore();
      });
    } });
    cue(st, 'whoosh'); [0, 1, 2].forEach((i) => cue(st + 0.1 + i * 0.15, 'pop', { gain: 0.55 })); }

  // 3 · a skull, a bug, or an empty card
  { const st = cut_(2), tSk = Wd('skull', 2) - st, tBug = Wd('bug', 2) - st, tNil = Wd('nothing', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.07, note: 'skull / star / blank cards land on their words', draw(lt, d, t) {
      K.labRoom({});
      [['skull', tSk, -1], ['star', tBug, 0], ['blank', tNil, 1]].forEach(([k, tw, i]) => {
        const p = eob(clamp((lt - tw) / 0.3)); if (p <= 0) return;
        K.designCard(540 + i * 310, 640, 0.92 * p, k, { rot: i * 0.05 });
      });
      if (lt > tNil) K.slip('OR NOTHING AT ALL', 540, 1060, eob(clamp((lt - tNil - 0.15) / 0.3)), -0.02, 48);
    } });
    cue(st, 'whoosh'); cue(st + tSk, 'pop'); cue(st + tBug, 'pop'); cue(st + tNil, 'plop'); }

  // 4 · Dow Chemical put an engineer on it
  { const st = cut_(3), tName = Wd('baldwin', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 900], zoom: 0.09, note: 'the engineer at the bench; name slip on "Baldwin"', draw(lt, d, t) {
      K.labRoom({});
      K.person({ x: 560, y: K.GROUND - 56, h: 700, outfit: 'clerk', mood: 'calm', arms: { L: [-22, 0.8], R: [26, 0.8] } });
      K.slip('DOW CHEMICAL', 540, 470, eob(seg(lt, 0.15, 0.45)), 0.02, 52);
      K.slip('CHARLES BALDWIN', 540, 620, eob(clamp((lt - tName) / 0.3)), -0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop', { gain: 0.5 }); cue(st + tName, 'pop'); }

  // 5 · he wanted a mark nobody had ever seen
  { const st = cut_(4), tSeen = Wd('seen', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.12, note: 'a blank card on the bench, rings sketched in search of a shape', draw(lt, d, t) {
      K.labRoom({});
      ctx.save(); ctx.translate(540, 660); ctx.scale(1.5, 1.5);
      inkRR(-130, -170, 260, 340, 10, C.cream, 9);
      const p = clamp(lt / Math.max(0.1, tSeen + 0.4));
      ctx.strokeStyle = 'rgba(28,21,17,0.38)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const q = clamp((p - i * 0.13) / 0.2); if (q <= 0) continue;
        ctx.beginPath(); ctx.arc(-60 + rnd(i) * 120, -70 + rnd(i + 9) * 150, 26 + rnd(i + 3) * 34, 0, TAU * q); ctx.stroke();
      }
      ctx.restore();
      if (lt > tSeen) K.slip('NOTHING LIKE IT', 540, 1120, eob(clamp((lt - tSeen) / 0.3)), 0.02, 48);
    } });
    cue(st, 'whoosh'); cue(st + tSeen, 'pop'); }

  // 6 · six designs on the table
  { const st = cut_(5), tSix = Wd('six', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 820], zoom: 0.06, note: 'six candidate cards deal out; accent on "six"', draw(lt, d, t) {
      K.labRoom({});
      SIX.forEach((k, i) => {
        const p = eob(clamp((lt - 0.1 - i * 0.09) / 0.3)); if (p <= 0) return;
        const [x, y] = sixPos(i); K.designCard(x, y, 0.62 * p, k, { rot: (rnd(i) - 0.5) * 0.1 });
      });
    } });
    cue(st, 'whoosh'); SIX.forEach((_, i) => cue(st + 0.1 + i * 0.09, 'pop', { gain: 0.45 })); cue(st + tSix, 'tock', { gain: 0.5 }); }

  // 7 · hundreds of people, dozens of cities
  { const st = cut_(6), tCity = Wd('cities', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 820], zoom: 0.1, note: 'a crowd of round heads fills the frame as the cities add up', draw(lt, d, t) {
      ctx.fillStyle = '#C9B48C'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#6E5C44'; ctx.fillRect(0, K.GROUND - 120, W, H);
      line([[0, K.GROUND - 120], [W, K.GROUND - 120]], C.ink, 9);
      const p = clamp((lt - 0.2) / Math.max(0.6, tCity));
      for (let i = 0; i < 28; i++) {
        const q = clamp((p - rnd(i) * 0.7) / 0.16); if (q <= 0) continue;
        const col = i % 7, row = (i / 7) | 0;
        ctx.save(); ctx.translate(120 + col * 140, 560 + row * 205); ctx.scale(0.56 * eob(q), 0.56 * eob(q));
        K.head(0, 0, 110, { skin: i % 3 ? C.skin : C.skinT, mood: ['calm', 'happy', 'shock'][i % 3], hat: i % 4 === 0 ? 'cap' : null });
        ctx.restore();
      }
      K.slip('HUNDREDS ASKED', 540, 370, eob(seg(lt, 0.2, 0.5)), -0.02, 50);
    } });
    cue(st, 'whoosh'); cue(st + tCity, 'slide'); }

  // 8 · the two questions
  { const st = cut_(7);
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'two slips: the memory test and the meaning test', draw(lt, d, t) {
      K.labRoom({});
      K.slip('TEST ONE: MEMORY', 540, 560, eob(seg(lt, 0.15, 0.5)), -0.025, 58);
      K.slip('TEST TWO: MEANING', 540, 800, eob(clamp((lt - 0.75) / 0.35)), 0.02, 58);
    } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop'); cue(st + 0.75, 'pop'); }

  // 9 · five fade, one is remembered and means nothing
  { const st = cut_(8), tRem = Wd('remember', 8) - st, tMeans = Wd('means', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 820], zoom: 0.07, note: 'five cards dim, the trefoil card lifts', draw(lt, d, t) {
      K.labRoom({});
      SIX.forEach((k, i) => {
        const [x, y] = sixPos(i), win = k === 'trefoil';
        const dim = win ? 0 : clamp((lt - tRem) / 0.5);
        const lift = win ? 46 * eob(clamp((lt - tMeans) / 0.4)) : 0;
        K.designCard(x, y, 0.62 + (win ? 0.12 * eob(clamp((lt - tMeans) / 0.4)) : 0), k, { dim, lift, rot: (rnd(i) - 0.5) * 0.1 });
      });
    } });
    cue(st, 'whoosh'); cue(st + tRem, 'slide', { gain: 0.5 }); cue(st + tMeans, 'sparkle'); }

  // 10 · highest on memory, lowest on meaning
  { const st = cut_(9), tHigh = Wd('highest', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 800], zoom: 0.08, note: 'two bars: memory tall, meaning short, the mark above', draw(lt, d, t) {
      K.labRoom({});
      K.trefoil(540, 520, 0.5, eob(seg(lt, 0.1, 0.5)));
      K.scoreBars(540, 1150, clamp((lt - tHigh + 0.25) / 1.0), ['MEMORY', 'MEANING']);
    } });
    cue(st, 'whoosh'); cue(st + tHigh, 'tock'); cue(st + tHigh + 0.5, 'tock', { gain: 0.6 }); }

  // 11 · no story, no nation: the mark assembles
  { const st = cut_(10), tPoint = Wd('point', 10) - st, tNation = Wd('nation', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.1, note: 'the trefoil assembles from three rings', draw(lt, d, t) {
      K.labRoom({});
      K.trefoil(540, 700, 1.15, eob(clamp(lt / Math.max(0.9, tPoint + 0.5))));
      if (lt > tNation) K.slip('NO STORY. NO NATION.', 540, 1140, eob(clamp((lt - tNation) / 0.35)), -0.02, 48);
    } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide'); cue(st + tPoint * 0.6, 'pop', { gain: 0.6 }); cue(st + tPoint, 'sparkle'); }

  // 12 · one lesson, every lab on Earth
  { const st = cut_(11), tEarth = Wd('earth', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.09, note: 'the finished mark on the lab wall, the engineer beneath it', draw(lt, d, t) {
      K.labRoom({ mark: eob(seg(lt, 0.1, 0.6)), markY: 500, markS: 0.74 });
      K.person({ x: 560, y: K.GROUND - 56, h: 660, outfit: 'clerk', mood: 'smug', arms: { L: [-20, 0.78], R: [24, 0.78] } });
      if (lt > tEarth) K.slip('EVERY LAB ON EARTH', 540, 170, eob(clamp((lt - tEarth) / 0.35)), 0.02, 48);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'sparkle'); cue(st + tEarth, 'pop'); }

  return { shots: S, cues: CUES };
}
