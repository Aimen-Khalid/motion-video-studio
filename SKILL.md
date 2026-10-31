---
name: motion-video-studio
description: >-
  Make a motion-design video with the user from brief to finished MP4: a brand film, product or company video, talk teaser, launch, explainer, lesson or idea turned into motion graphics. Runs in one live review page: a setup form (brief, website, content and files, length, landscape/portrait, how many directions, styles, music, sound effects, voiceover and voice, captions, and the language/script of the words, e.g. English, Urdu script, Roman Urdu or mixed), low-detail draft videos to compare side by side, an editable transcript beside each player, a polished final to iterate on, composed music and effects, a voiceover with word-by-word captions (designed or from a 150+ style gallery), and a Render MP4 button. Use this whenever someone wants a motion graphics, animated, explainer, promo or brand video, storyboards to pick from, or "a video about" a website, company, product, talk or idea, even if they never say "motion design".
---

# Motion Video Studio

You and the user make a short motion-design video together. The user steers by watching real drafts, editing the words on screen, and picking. You do the research, the design, the animation and the sound.

This skill is a **way of working with the user**, plus some tools that make the mechanics easy. It is deliberately not a design template. Every video's look, structure, pacing and motion should be invented fresh for its subject — from the brief, the material and the brand — with the same care you'd give a commissioned piece. The bundled example (Arbisoft) shows how the mechanics fit together; don't reuse its scenes, layouts or styling. If a tool gets in the way of a better result, change the tool.

## Tools this needs

Python 3 with `playwright` (Chromium), `numpy`, `scipy`, `fonttools` and `brotli`; `node`; `ffmpeg`. For a voiceover also `kokoro-onnx` and `soundfile` (`voiceover.py` installs them and downloads the free Kokoro voice model, ~120 MB, on first use). Check once at the start and install what's missing (`pip install --break-system-packages fonttools brotli`, and `python3 -m playwright install chromium` if no browser is present). Script paths below are relative to this skill's folder.

## What the user experiences

1. **A page appears immediately** with a Setup form. They describe the video, optionally give a website, paste text or attach files, and choose length, shape, whether to compare storyboards first or **skip storyboards and get one finished video**, number of directions, styles, music and sound effects. They also choose whether to have a **voiceover** (and which voice — free voices, each with a ▶ sample, or their own paid voice service), whether to show **captions** (designed by you, or picked later from the caption gallery), and the **language of the words**: all English, all in the other language in its own script, in English letters (Roman Urdu), or mixed as people actually speak.
2. **Draft videos to compare** — one per direction, in the shape they chose (16:9, 9:16, or both with a switch), each in its own tab, playing live in the page at real timing, with the on-screen words listed beside the player as editable boxes. Simpler than the final on purpose, but already beautiful: real timing, layout, brand, depth and texture.
3. **They pick one.** You polish only that one into a "Final" tab, carrying their edits over. They iterate there — by editing words directly or by asking you for changes — as many rounds as they like.
4. **Sound** gets added to the final (music in their chosen mood, sound effects tied to what happens on screen), playable in the page with on/off switches and volume sliders for the music and the voiceover. With a voiceover, every draft and the final speak their narration, the music dips under the voice, and captions follow it word by word. A **Captions** button under each player opens the caption gallery (live previews of every style); the choice applies at once, can be moved (Top / Middle / Raised / Bottom, or dragged on the video), saves, and is used by Render.
5. **Render MP4** — a button in the page encodes the finished video in their browser and saves it. Saying "render it" in chat also works; you render it and send the file.

Everything happens in **one artifact at one URL**. Publish updates to that same link every time; never start a second page.

## The quality bar: every video should be stunning

The whole point of this skill is videos people stop scrolling for. Every video you make, from the first draft to the final, should look **absolutely beautiful**: rich, crafted and cinematic, with **depth, dimension and texture**, and at least one moment that makes the viewer say "wow". Flat shapes sliding on a plain background, default fonts, evenly spaced bullet text and linear motion are failures, however correct the words are. Aim for the level of a top motion-design studio's showreel, in whatever style the user chose.

What that means in practice (SVG gives you all of it: gradients, `filter` with `feTurbulence`, `feGaussianBlur`, `feDropShadow`, `feDisplacementMap`, masks, clip paths, blend modes, transforms):
- **Depth.** Build every shot in layers: background, midground, subject, foreground. Move them at different speeds (parallax) and let foreground elements pass close to the camera, softly blurred. Use soft, layered shadows (contact shadow plus a wide ambient one), atmospheric haze that fades distant layers, and depth-of-field blur on what is not in focus.
- **Dimension.** Objects should feel like they have volume: light from a consistent direction, gradients that model form, rim light and highlights, extruded or bevelled type where it suits, isometric or perspective planes, cards that tilt and turn in 3D, and camera moves (push in, drift, orbit, rack focus) instead of a locked frame.
- **Texture.** Nothing should be a dead flat fill. Add fine film grain or paper fibre (one `feTurbulence` pattern defined once and reused, so the preview stays smooth), subtle noise in gradients to avoid banding, material surfaces (paper, glass, metal, fabric, chalk, halftone, risograph) that match the style, light leaks, glows and a gentle vignette.
- **Beauty.** A deliberate palette with a clear accent, strong typographic hierarchy with fonts that fit the brand, generous negative space, compositions built on a grid and on contrast of scale, and colour grading that ties every shot together.
- **Motion with weight.** Custom easing (anticipation, overshoot, settle), staggered and overlapping action, secondary motion (things that follow through, wobble, catch light), and match cuts or continuous transitions that carry the eye from shot to shot. Nothing pops on or off without a reason.
- **A wow moment.** Plan one signature beat per video, usually the reveal: a camera fly-through, a transformation, a burst of particles, a logo built from the story's own elements. Time the music and sound effects to land on it.

This applies to every style on the menu, including minimal ones: minimal means fewer elements made with more care, never flat or plain. A user's custom style still gets this level of craft inside their direction.

Before publishing, look at the contact sheet and ask honestly: does every frame look like a still from a beautiful film? Is there depth, dimension and texture in each shot? Is there a moment that would make someone say "wow"? If not, it is not ready. Improve it before showing it.

## The workflow

### 1. Open with the Setup page — before any research

The first thing to do, however the request is phrased, is give the user the page. Scaffold a project folder, build, and publish:

```bash
python3 scripts/new_project.py <proj> "<Name>"
python3 scripts/build_page.py <proj>        # writes <proj>/page.html
```

Publish `page.html` with capabilities `{"db":{}, "user":{}, "downloads":true, "assets":{}, "comments":{}}` (db: saved answers/edits/picks; assets: file attachments; downloads: saving the MP4; comments: buttons that message you directly). Tell the user in a line or two: fill in Setup, press **Build storyboards**, then say "build storyboards" here.

Then set up how you'll hear about button presses (next section), so that pressing Build storyboards starts the work without the user typing anything.

If the user already gave everything in chat (brief, length, styles…), don't make them repeat it: seed `intake/current` yourself with ArtifactData and carry on. If the page can't save in their view, ask the same questions in chat instead (the style menu as a message, then a short AskUserQuestion round).

### Handing work to you from the page

**Every button that needs you shows a handoff card** right under it: one line on what you will do, the exact prompt, and a **Copy prompt** button. The user's only job is to paste it into the chat. Keep it that way whenever you add a button or a fallback: never a bare "say X in the chat".

| Button | Saves | Prompt (pasted by the user) | What you do |
|---|---|---|---|
| Make the video (Setup with "Skip storyboards") | `intake/current` with `skipDrafts: true` | "Make my motion video, skipping the storyboards. Everything is saved in the Setup tab of my page “…”: one final video, 30 seconds, landscape 16:9." | Go straight to the final (see "Skipping storyboards") |
| Build storyboards | `intake/current` | "Build the storyboards for my motion video. Everything is saved in the Setup tab of my page “…”: 5 directions, 30 seconds, landscape 16:9." | Read the intake, research, build the drafts |
| Pick this direction | `choice/current` | "I picked “Data Cuts” (By the Numbers) on my motion video page “…”. Make the final version." | Read the pick + its `edits`, make the final |
| Ask Claude for changes (final) | a `requests` doc | "Please change the final of “…” on my motion video page “…”:" + their words | Read it + the final's `edits`, make the next version |
| Captions gallery | `captions/<board>` | (no prompt — saved choice, used by renders) | Read it before rendering on your side |
| Music / voiceover volume sliders | `mix/<board>` | (no prompt — saved levels, used by renders) | Read it before rendering on your side |
| Render fallbacks (no WebCodecs/H.264, frame error, saving blocked) | – | "Render the final MP4 of “…” from my motion video page “…”, using my latest transcript edits and the sound." | Render server-side with `render.py`, send the MP4 |

When the page can't save (no database in that view), the prompt carries everything itself: the Build prompt includes all their Setup answers, the Pick prompt names the direction. When a pasted prompt arrives, treat it as the go-ahead, read what's saved, and start. Don't ask again.

Where a Claude session can **watch** the page (`ArtifactComments` `action:"watch"` succeeds; remote sessions can't), the page also sends the same prompt directly (`comments.sendToClaude`) and the card says "Sent to Claude", keeping Copy as a backup. On such a wake, read the thread, reply in one line that you're on it, do the work, then resolve the thread with a short note of what changed. Never poll the page on a timer; it was tried and felt chaotic.

### 2. Read the brief and gather material

`ArtifactData get intake/current` gives: `brief`, `url` (optional), `content` (pasted text), `files[]` (`{name,type,id,url}`; read each with `Artifact read` + `path: <id>`), `duration`, `aspect` (landscape/portrait/both), `count` (1–5), `styles[]` and `sound[]` (one entry per storyboard; `sound[i] = {music:{on, mood}, sfx}`), `voiceover:{on, voice}` (a Kokoro voice id or `"auto"`), `captions:{on, style:"designed"|"gallery"}`, `textLang` (`english` | `native` | `roman` | `mixed-roman` | `mixed-native`) with `lang2` (the other language, Urdu by default), `skipDrafts` (true when they chose "Skip storyboards, make the video"; then `count` is 1 and `styles`/`sound` have one entry), `notes`, `buildRequestedAt`. Older briefs may lack the voice and language fields: treat them as no voiceover, English. Older briefs may have a single `music`/`sfx` instead of `sound[]`; apply it to every storyboard.

The video can be about anything — not only a company. Work from what you were given:
- **Brief and pasted/attached content** are the primary source for a talk, idea, lesson or presentation. Pull out the message, the audience, the beats, the memorable lines and numbers.
- **A website, if given**: `scripts/extract_brand.py <url> <proj>` pulls logo candidates (and writes `logo.js` when the logo is an SVG), colours ranked by use, CSS colour/font variables and font families. Read the important pages with WebFetch for facts, taglines and proof points. Look at the logo you pick before using it.
- **No website and no brand**: design a look that suits the subject; ask only if a brand constraint obviously matters.
- Fetch fonts for rendering with `scripts/fonts.py <proj> "<Family>" ...` (Google Fonts families; it writes `fonts.js` with subsets embedded into frames).

Never invent facts. When sources disagree (e.g. two different headcounts), use one, put the other in the page's flags, and tell the user — the editable transcript lets them settle it.

### 3. Build the draft directions

Make `count` drafts at the chosen `duration` (any number of seconds, not just the presets), in the chosen `aspect` — from the very first draft:
- `landscape`: boards as normal (16:9, 160×90 units).
- `portrait`: boards with `aspect:'portrait'` (9:16, 90×160 units), composed for a tall frame — stack, scale and pace for vertical viewing; never a crop of a landscape layout.
- `both`: each direction is a landscape board plus a portrait board with `variantOf:'<landscape id>'` and the same field keys. The page shows them as one tab with a 16:9 / 9:16 switch and one shared transcript; the pick covers both; the final is a pair too and each shape renders separately.
 Each slot in `styles[]` is one of three things:
- **A style from the menu** — use it as the user's direction, interpreted for this subject (the menu is a vocabulary, not a set of recipes).
- **`"custom: …"`** — the user described their own style in words. Follow it faithfully; it outranks your own taste. Fill gaps sensibly, and ask only if it's genuinely ambiguous or conflicts with the brief.
- **`"auto"`** — you have complete freedom. Pick whatever will serve this material best, inside or outside the menu: invent a style, combine styles, borrow from a medium or a reference. Say in one line why it fits.

Directions should differ in **style and in how the video gets to its point** (its arc and ending), not just in colour.

Drafts are lighter than the final: real timing, layout, brand colours, fonts, logo and words, with fewer details and simpler motion. They still meet the quality bar above: layered depth, light, texture and a beautiful look, so the user is choosing between directions that already look stunning. A plain, flat draft undersells the direction and makes picking harder. They live **only in the page** — don't render or send MP4s of drafts (it costs minutes and confuses the review).

How boards work is in `references/engine.md`. The essentials:
- A frame is a pure function of (time, transcript texts). That's what lets the page preview, the browser render and the server render match exactly.
- **Every piece of on-screen content comes from a transcript field.** Only interface chrome may be fixed, listed in the board's `chrome` allow-list.

Before publishing any version, look at it and check it:
```bash
python3 scripts/build_page.py <proj>
python3 scripts/sheet.py <proj> <board> /tmp/sheet.png     # one frame per shot — then actually look at it
node scripts/audit_text.js <proj> <board>                   # must report 0 uncovered on-screen text
```
Contact sheets catch most problems: frames that look flat or plain (no depth, light or texture), text running off frame, labels colliding, a logo in the wrong colour on a dark ground, glyphs missing from a font. Fix and re-check before publishing.

Then tell the user briefly what each direction is, and how to use the page: watch, edit any line (the video updates instantly and the edit saves), press **Pick this direction** or tell you. If they ask whether thumbnails/frames are "real", be straight: drafts are the real animation at draft quality; the final is the same engine, polished.

### Voiceover, language and captions

**Language of the words** (`textLang`) applies to every word on screen and in the voiceover, in drafts and final alike:
- `english`: all English; anything in `lang2` is translated.
- `native`: all in `lang2`, in its own script (Urdu script reads right to left); English parts translated.
- `roman`: all in `lang2`, written in English letters (Roman Urdu). Keep one consistent spelling across the video.
- `mixed-roman` / `mixed-native`: mixed as people actually speak (English stays English, Urdu stays Urdu), written all in English letters, or each in its own script.
For Urdu script on screen, add `Noto Nastaliq Urdu` to `fonts.py` so frames embed it (an SVG drawn to a canvas can't use page fonts), and check the contact sheet for joined, right-to-left text. Avoid styles that cut words into separate letters for Urdu script. Tell the user when text is a translation.

**Voiceover** (`voiceover.on`): write narration that fits the video — short spoken lines that add to what's on screen rather than reading it out, timed to the shots, in `textLang`. Each line is a transcript field with a `vo` key, so the user can edit it like any other words:
```js
{key:'vo1', label:'Voiceover', shot:0, def:'It starts with one sentence.', vo:{at:.4}}   // at = seconds into the shot
```
Leave breathing room: about 2.5 words a second, and lines shouldn't overlap (the script warns and pushes them). Then voice each board:
```bash
python3 scripts/voiceover.py <proj> <board> --voice af_bella [--texts edits.json]   # writes voice/<board>.{mp3,wav,json}
```
Use the chosen voice, or pick one that fits when it's `"auto"` (say which in a line).

**The user's own voice service** (`voiceover.voice` is `"own"`, `voiceover.service` names it, e.g. "ElevenLabs, voice Rachel"): the free voices cost nothing, but some people have a paid service with voices they prefer, or other ways to get a voice (their own recordings, a cloned voice, a company account). Ask in chat how they want to connect it, and work with what they give you:
- **An API key**: ask them to paste it in the chat (or set it as an environment variable if they're running locally). Use it only in a short script that writes one audio file per narration line (`voice-in/vo1.mp3`, `vo2.mp3`, …); never put the key into the page, project files, database or anything published, and don't echo it back. The shell's network is allowlisted, so test one short request first; if the service is blocked, say so and offer the next option.
- **Audio they make themselves** (from the service's website, or recordings): give them the narration lines with their keys, ask them to attach one file per line named by key, then import them.
- Either way, finish with `python3 scripts/voiceover.py <proj> <board> --audio-dir voice-in --voice "<service>: <voice name>"`. Timing, captions, the player switch, volume and renders work exactly as with the free voices, and the page shows the service and voice name.
If it can't be connected, tell them plainly and offer a free voice in the meantime. Kokoro speaks English (US/UK voices) and Hindi; for an Urdu or Hindi voiceover use a Hindi voice (`hf_alpha`, `hf_beta`, `hm_omega`, `hm_psi`) and give each line a `say` field in Devanagari with what to pronounce, while `def` holds the caption text in the chosen script (Urdu script or Roman Urdu). Kokoro can't speak Urdu script directly. Voice the drafts too, so the user judges each direction with its narration. Re-run `voiceover.py` whenever narration text or timing changes (edited lines re-record when you next update; until then the captions follow the edited words over the old timing).

**Captions** (`captions.on`): they follow the voiceover word by word. Two kinds:
- **Designed** (default, and when `captions.style` is `"designed"`): part of the video's look. Without anything extra the engine draws a clean lower caption with the spoken word lit; design your own per board with `cap:(c,x)=>svg` (`c` gives the current chunk, the word being said, timings) so captions belong to the style. Set `captions:'off'` in project.json when the user chose no captions.
- **From the gallery**: the Captions button opens 150+ templates ported from the user's Animora project (`assets/captions/`: word-by-word highlight, key words, stacked rows, glow, boxes, one word at a time, fun backdrops). When `captions.style` is `"gallery"`, point the user to the button once the drafts are up. A template choice is saved in `captions/<board>` and replaces the designed captions.
Before rendering on your side, read `captions/<board>` and pass it to `render.py --captions`.

### Skipping storyboards

When `skipDrafts` is true, the user wants one finished video, not a choice of directions. Skip step 3's drafts entirely and build the polished final straight away, as in step 4: one board `<id>-final` with `final: true` (a portrait or "both" pair if they chose that shape), in the style from `styles[0]` (listed, custom or auto, as in step 3), at their length, with the sound from `sound[0]` (step 5), the voiceover and captions if they asked, and the language they chose, all before you publish. The page then shows Setup and the Final tab only (no Overview, no draft tabs), and everything from step 4 on works the same: live transcript edits, Ask Claude for changes, volume, captions gallery, Render MP4.

Since they won't see alternatives, take extra care that the one direction fits the brief. When the style is `"auto"`, say in a line which style you chose and why, and offer to try a different direction if it isn't what they pictured. Run the same checks (contact sheet, text audit, audio check) before publishing.

### 4. Polish the pick, then iterate

Read the pick (`choice/current`) and edits (`edits/<board>` → `{texts:{key:value}}`, changed keys only). Build the polished version as a new board `<id>-final` with `final: true`, reusing the draft's field keys so the user's edits carry straight over. It becomes the first tab and opens by default; the drafts stay for reference. Set `finalVersion` in `project.json` and bump it every iteration.

"Polished" means the full quality bar above, pushed as far as this piece can go: richer detail, more depth layers, real lighting and materials, texture everywhere, continuity between shots, motion with weight, atmosphere and a wow moment that lands. The final should look clearly more stunning than the draft it came from. If the requested length is longer than the draft, add beats from the material rather than stretching shots.

Each iteration — whether from transcript edits or a request in chat:
1. Read the latest `edits/<board>-final` first so you don't overwrite their words.
2. Change the board. When you add, remove or rename on-screen text, update `fields` (and their `shot` indices) so the transcript always matches the latest video exactly.
3. Re-run audit + contact sheet, regenerate audio if timing or typed text changed, re-run `voiceover.py` if narration changed (using the latest edits), rebuild, publish to the same URL.
4. Tell the user what changed in a few lines.

### 5. Sound

Each storyboard has its own sound settings (`sound[i]`). Use the entry for the storyboard that was picked (if both shapes were made, they share it); if not (e.g. the project started in chat), ask once the final is polished: music yes/no and which mood (list the moods), sound effects yes/no/subtle.

`music.mood` is one of three things, like styles:
- **a listed mood** — use it as the starting point.
- **`"custom: …"`** — the user described the music they want. Follow it as closely as the tools allow.
- **`"auto"`** — you decide, with complete freedom: whatever suits this video, listed or not. Tell the user in a line what you chose and why.

`scripts/audio.py <proj> <board> --mood <preset> [--custom '<json>'] --sfx yes|subtle|no --music yes|no [--texts edits.json]` composes music arranged around the shots (intro, groove, breakdown, riser into the reveal, hit) and sound effects from the board's cue points. The eight presets are starting points: `--custom` overrides tempo, chords, drums, bass, lead, filter and texture to build a new mood, and you can extend the script with new instruments when a piece needs them. If the user asks for something synthesis can't honestly deliver (real strings, vocals, a specific song), say so and offer to fit the video to a licensed track they supply. Set `musicLabel` in project.json to a short name for what you made. Then rebuild — the page embeds the audio and syncs it to the player.

You can't listen to audio. Check it by plotting loudness per 100 ms for music and effects against shot boundaries, plus a spectrogram: quiet intro, entries on cue, the hit as the peak, effects landing on their cues. Tell the user honestly that the music is composed in code (not stock) and that their ears are the real test; offer to fit the video to a licensed track they supply.

### 6. Render — only when asked

- **Render MP4 button** (final tab): encodes 1080p/30fps H.264 (1920×1080 or 1080×1920, following the tab's shape) in the browser with WebCodecs, mixes in whichever audio tracks are switched on (voice, music ducked under it, effects), draws the chosen captions, shows progress, previews the file, and saves it via `downloads`. If it reports no audio, it says why. About 1–2 minutes for 60 s. Needs Chrome/Edge; the page explains fallbacks.
- **"render it" in chat**: read the latest edits, regenerate audio with them, then
  `python3 scripts/render.py <proj> <board> <out.mp4> --texts edits.json --audio <proj>/audio/mix.wav [--voice <proj>/voice/<board>.wav] [--captions '<captions/<board> doc>'] [--music-vol M --voice-vol V from mix/<board>]` (size follows the board) and send the file — both files when the user chose both shapes.

Never render the final until the user explicitly asks.

## Talking with the user

- Keep updates short: what you made, what to look at, what you need from them. One question at a time when you must ask.
- Say what's real and what isn't: draft vs polished, what the page can and can't do, that you can't hear audio, which facts conflict.
- Don't decide things that are theirs: facts in doubt, client names on screen, the pick. Do decide craft things yourself and mention them briefly.
- Every change the user asks for is a signal about their taste — apply it to the rest of the piece too, not just the spot they pointed at.

## Reference files

- `references/engine.md` — the board contract, helpers, fields/chrome/cues, portrait, and how to extend the engine. Read before writing boards.
- `references/page-and-data.md` — project.json, building and publishing, the page's database documents, attachments, render internals.
- `references/styles-and-moods.md` — the 48-style menu shown in Setup, the 8 music moods, and the voices.
- `assets/captions/` — the caption-style library (`captions.js`, `templates.json`, fonts), embedded in the page when a board has a voiceover.
- `references/lessons.md` — pitfalls already hit (fonts in canvas, id collisions, shell network limits, …). Skim before building.
- `references/example-arbisoft/` — a complete worked example (5 drafts + a polished 60 s final with cues). Read it to see the mechanics; invent your own visuals.
