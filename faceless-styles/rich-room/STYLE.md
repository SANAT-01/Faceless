# Rich Room: round-headed people in warm, ornate rooms, 9:16

Flat 2D cartoon people — big round heads, heavy ink outlines, mitt hands — standing in warm, richly
furnished flat rooms. Money, service and status stories, and anything where one object in a room is the
whole point. Cream title slips, captions with exactly one gold word.
Example: `example/` = **HOW THE BIOHAZARD SIGN WAS BORN** (1966; 45 s, 12 shots). Sheet: `style-sheet.png`.

## 1. Rules
- Every person and prop is filled, then stroked in heavy ink: `inked(pathFn, fill, lw)`, or the
  `inkRR` / `inkCircle` / `inkEll` shortcuts. Nothing in this style is un-outlined.
- **Gold** only for money, the key caption word and lamplight. **Red** only for danger and the biohazard
  mark. Everything else is cream, wood, wine or navy.
- Every room is lit by exactly one warm source (`pool(x, y, r)`), so the frame has a centre.
- Faces do the acting: `head(x, y, r, { mood })` with `calm · happy · smug · shock · worried · angry`.
  Eyes change first, then the mouth. Bodies barely move.
- One room per beat; cut every 1.5-3 s. The camera punches in on each cut (`main.js` handles it).
- Captions: Inter Black, cream with a heavy ink outline, ONE gold word, y 1700 — **below the bench
  edge**, on dark wood. Put nothing else below y 1560.
- Title slips (`slip`) go at the top or over a blank wall, never over a face or a card.
- Facts checked against reliable sources and listed in `script.json` "sources". Where sources conflict on
  a number or a date, say it vaguely rather than picking one.

## 2. Kit (`example/src/core/kit.js`, `import * as K`)
- Paint: `inked`, `inkRR`, `inkCircle`, `inkEll`, `pool`, `bigText` (all from `core/lib.js`).
- People: `person({ x, y, h, outfit, mood, dir, arms: {L:[deg,len], R:[deg,len]}, hold, lean })` with
  outfits `suit · bellhop · tycoon · clerk · maid · guest`; `head(x, y, r, { skin, hat, glasses, mood })`;
  hats `cap · pillbox · tophat · visor`.
- Rooms: `vaultRoom()`, `diningRoom({ wide })`, `officeRoom()`, `labRoom({ mark })`.
- Money: `coin`, `coinStack`, `coinBag`, `coinShelf`, `ledger`, `bankerLamp`, `vaultDoor({ open })`.
- Dining: `cloche`, `tray`, `wineGlass`, `roses`, `sconce`, `framedArt`, `chair`, `roundTable`,
  `carpetRunner`.
- Lab: `labRoom`, `flask`, `jar`, `trefoil(x, y, s, b, col)` (b 0..1 assembles the biohazard mark).
- Graphics: `slip(text, x, y, sc, rot, size)`, `designCard(x, y, s, kind, { dim, lift, rot })` with kinds
  `skull · star · trefoil · bolt · eye · cross · blank`, `scoreBars(x, y, p, labels)`, `titleBar`,
  `captionBar`, `splitThumb` (for the 16:9 thumbnail).
- `GROUND` = 1500, where feet land. Benches sit at `GROUND - 56`.

## 3. Shot anatomy
One shot per script line, placed with `cut_(i)` = `L(i) - 0.08`. Reveals land on their word with
`Wd('word', line)`. Start every shot with something already on screen — never open on an empty room
waiting for a word that arrives a second later.

## 4. Cue types
`whoosh` on every cut · `pop` / `plop` for a card or slip landing · `slide` for a group change ·
`tock` for a score or count · `sparkle` for the reveal · `thud` / `slam` sparingly. Music: `"tension"`
for an investigation, `"bed"` for lighter stories.

## 5. QA pitfalls we've hit
- Captions at y 1560 collide with bench glassware → keep them at 1700, on the dark wood.
- A crowd built from fewer than ~24 heads reads as scattered dots, not a crowd.
- Slips above a grid of heads or cards collide with the top row → keep slips at y ≤ 400.
- `person` with a body that reaches the floor hides the legs; the body must stop at `y - h*0.155`.
- Drawing a clipped panel without `ctx.restore()` silently blanks everything drawn afterwards.
