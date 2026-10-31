# The engine and how to write boards

`assets/engine-core.js` + your `<proj>/boards.js` → `build_page.py` splices them into `<proj>/engine.js`, used by the page, the in-browser render, `render.py`, `sheet.py`, `audio.py` and `audit_text.js`.

## The contract (keep this; everything else is yours to change)

1. **A frame is a pure function**: `frame(boardId, t, texts, opts) → SVG string`. No randomness that isn't seeded by `t`, no state between frames. This is what makes the live preview, the browser MP4 and the server MP4 identical.
2. **All on-screen content comes from `fields`.** Any word, number or line the viewer reads is a transcript field. Only interface chrome (window titles, file names, badges, widget numbers, map labels, JSON keys…) may be hard-coded, and only if listed in the board's `chrome` array (strings or regexes). `audit_text.js` enforces this.
3. **Coordinates**: `160×90` units for landscape boards, `90×160` for portrait ones (`aspect:'portrait'`). Text sizes are in those units (≈4–8 for body, 10–34 for big type).

If a look needs something the helpers don't do, add helpers or rewrite them. The core is ~60 lines of convenience, not a framework.

## A board

```js
{ id:'my-board', tab:'Short style name', name:'Working title', bg:'#0b1220',
  fade:true,            // crossfade between shots (false = hard cuts)
  push:false,           // slow 2.5% camera push per shot (nice on finals)
  final:false,          // true for the polished pick (gets Render MP4, audio UI, first tab)
  aspect:'landscape',   // or 'portrait' (9:16)
  variantOf:undefined,  // for 'both': the landscape board this portrait board pairs with
  meta:{style:'…', lands:'how the piece reaches its point', mood:'…', best:'where it works best'},   // Overview table
  pitch:'One or two sentences on the idea.', chips:['…'],
  chrome:['window title', /^\d+ms$/],                 // allowed fixed text
  fields:[ {key:'k_line', shot:0, label:'What the user sees in the transcript', def:'Default text', rows:1} ],
  scenes:[ {d:4, name:'Shot name',
            c:x=>[[0,'whoosh'],[1.2,'pop']],         // optional sound cues (local seconds)
            f:(t,x)=>'…svg…'} ] }                     // t = seconds into this shot, x = texts
```
`boards.js` declares `const boards=[…]` (or pushes into it) and optionally `const ORDER=[ids]` for tab order (finals first). Shot start times, `total` and `defaults` are computed for you.

`shot` on a field is the index of the scene it appears in — keep it right when you insert or remove scenes, because the transcript groups boxes by shot and jumps the player there on focus. Multi-line content (e.g. code) can be one field with `rows`, split on `\n` in the scene.

## Helpers available inside boards.js

`cl` clamp · `pr(t,a,b)` progress 0→1 between a and b · `eo` ease-out cubic · `eio` ease-in-out ·
`T(x,y,size,text,fill,weight,anchor,family,extraAttrs,maxW)` text that shrinks to fit `maxW` so longer edits never overflow ·
`G(opacity,inner,transform)` group · `BG(color)` · `LOGO(x,y,width,inkColor)` the project logo, main colour swappable ·
`typeOn(s,p)` · `countAll/countFirst(str,p)` count up the numbers inside any (edited) string ·
`draw(pathD,p,stroke,width)` draw-on stroke · `iso(...)` isometric block · `P(lon,lat)` map projection · `mapField()` dot world map · `arcD(a,b)` route arc · `pin(...)` · `split(s)` splits on " · ".
Use fields for list-like content written as `A · B · C` and `split()` it, so users can edit lists in one box.

## Sound cues

A scene's `c(x)` returns `[[localSeconds, type], …]`; `cues(boardId,texts)` returns absolute times. Cue types `audio.py` knows: `key softkey enter tick whoosh collapse pop card swell done ping count run pass ok hit sparkle`. The first `hit` cue is treated as the reveal (music builds into it). Cues can depend on texts (e.g. one key click per typed character), which is why audio is regenerated after text edits.

## Finals

Add the polished board as a new `<id>-final` rather than editing the draft, reuse the draft's field keys so saved edits carry over, set `final:true` (usually `push:true`). Keep a single source of truth per board — if you keep the final in its own file, always splice it into boards.js from there; hand edits to generated files get lost on the next rebuild.

## Shape: landscape, portrait, both

Set `aspect:'portrait'` on a board for 9:16. Its frame is **90×160 units** and `BG`, the default text width, the camera push, the viewBox and every render path follow it automatically (1080×1920 output). Compose portrait shots for a tall frame: stack elements, use bigger type relative to width, move things vertically, let lists breathe — don't squeeze a landscape layout in.

For "both", make two boards per direction: the landscape one, and a portrait one with `variantOf:'<landscape id>'` and the **same field keys** (field `shot` indices can differ). The page shows them as one tab with a 16:9 / 9:16 switch, keeps one transcript (`edits/<landscape id>`) in sync across both, and a pick applies to both. Finals work the same way (`<id>-final` and `<id>-final-9x16` with `variantOf:'<id>-final'`). Audio is generated per board, since shot timings may differ.

## Performance notes

Frames are rebuilt as strings ~60×/s in the preview, so avoid thousands of nodes; cache static backgrounds (see `mapField`). In-browser rendering measured ~55 ms/frame at 1080p with embedded fonts.


## Voiceover lines and captions
- A narration line is a field with a `vo` key: `{key:'vo1', label:'Voiceover', shot:2, def:'…', vo:{at:.3}}` (`at` = seconds into the shot; optional `vo.voice`, and `say` for what the voice should pronounce when it differs from the caption, e.g. Devanagari for a Hindi/Urdu voice). Voiceover lines are not drawn by scenes; they're spoken, and shown as captions (which `audit_text.js` counts as covered, since they come from the field).
- `voiceover.py` writes `voice/<board>.json` with each line's spoken span and per-word times; `build_page.py` embeds it as `window.MOTION_VOICE[boardId]`.
- Designed captions: `frame(id,t,texts,{captions:'designed'})` (the default) draws the board's `cap(c,x)` if it has one, else a clean lower caption. `c = {key, words:[[w,s,e]], i, chunk:[[w,s,e]], ci, cs, ce, t0, t1, t}` — `chunk` is the current group of up to 6 words (breaking after punctuation), `ci` the word being said in it. Optional board keys `capAccent`, `capFont`, `capSize` and `capY` (baseline in frame units) restyle and move the default — check the contact sheet for captions covering on-screen text and move them.
- `captions:'none'` skips them (the page passes this when the user chose No captions or a gallery template, which is drawn on a canvas over the frame).
- `captionWords(id, texts)` returns `[{text,s,e}]` for the caption library's `groupWords`. If the user edited a voiced line, its words are re-spread over the line's original span until it's re-voiced.
