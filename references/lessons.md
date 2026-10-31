# Lessons already learned

Things that went wrong once, and what to do instead.

## Working with the user
- **Give them the page first.** People expect to see something immediately; research comes after the Setup form is in front of them.
- **Ask everything up front** (length, shape, number of directions, styles, music, effects) — asking about duration after polishing forced a 32 s → 60 s rebuild.
- **Default to 5 directions**, but always offer "just make one".
- **Name directions by what makes them different** ("Kinetic Type", "Map Journey"), never A/B/C/D.
- **Tabs, not one long scroll.** Users compare by switching tabs.
- **Drafts are videos, not storyboards.** Static thumbnails made users ask "are these real frames?". Live drafts answer that.
- **No draft MP4s.** Rendering drafts cost ~10 minutes and the user didn't understand why the files existed.
- **Same artifact, same URL, every version.** Iterations are versions of one page.
- **Render only on an explicit request**, and put the Render button in the page — users expect the button they press to produce the file.
- When the page can't reach Claude, say so plainly next to the button, with the exact words to type in chat.

- **Follow the shape from Setup from the first draft.** The first version of this tool only built 16:9 and treated portrait as "extra work" — the user rightly asked why drafts ignored the 9:16 choice. Portrait is a board property, and every path follows it.

- **Every choice in Setup has a way out of the list.** Users asked for this one field at a time: styles, then music, then length. Styles and music offer "Let Claude decide" plus "Describe my own…"; length offers "Custom length…". Lists are suggestions, never limits. Give any new Setup question the same escape hatch from the start.

- **Sound is a per-storyboard choice**, like style: different directions often want different music. One global sound setting was too coarse.
- **Buttons that need Claude should just work.** Telling users to press a button and then also type in chat felt broken. The fix is `comments.sendToClaude` (found in the user's clip-review page): it posts a comment that wakes Claude sessions watching the artifact, instantly. Remote sessions can't watch. Polling the database every minute with the scheduler was tried there and the user found it chaotic, so now the page saves the choice and tells the user the exact words to say in chat.

- Every new page control needs its own scope: transcript handlers bound to `sec.querySelectorAll('textarea')` also grabbed the new Ask box and threw errors. Bind to `.fld textarea`.
- Don't rely on the host's `[hidden]` rule. A component with its own `display` showed while hidden in a bare test page, so the template carries `[hidden]{display:none!important}` itself.

- **Audit every handoff to Claude.** Each button or fallback that needs Claude shows the same card: what Claude will do, the exact prompt, Copy prompt. One-line "say X in chat" hints were easy to miss and inconsistent across eight places (Build, Pick, Ask, three render fallbacks, save failure, no-database fallbacks). Pick even failed silently when the page couldn't save.

## Transcript fidelity
- A first final had 14 fields while the video showed setup lines, code, JSON and commands that couldn't be edited. Users assume the transcript is the whole script. Run `audit_text.js` on every version.
- Transcript box ids must include the board id: a draft and its final share field keys, and `id="f-<key>"` made Undo/Reset on the final change the draft's boxes.
- When inserting scenes, update fields' `shot` indices.

## Visual checks
- Always look at a contact sheet before publishing. It has caught: text overflowing a window, a label colliding with a 3D block, a slab overlapping pillars, a 500M+ label running off frame, a ❯ glyph missing from JetBrains Mono, a logo staying grey on navy.
- `<use href>` into an SVG `<symbol>` didn't pick up CSS custom-property recolours in headless Chrome — inline the logo paths and swap the fill as a string.
- Make text auto-fit (`T(..., maxW)`), because users will type longer lines.
- Editing a generated file directly (engine.js) got overwritten by the next splice and silently lost three fixes. Keep one source per board.

## Rendering
- An SVG drawn into a canvas ignores web fonts → embed subset woff2 fonts inside each frame (`fonts.py`, ~160 KB for three families).
- Headless Chromium had H.264 but no AAC encoder → Opus fallback; desktop Chrome/Edge usually have AAC.
- JS `String.replace` treats `$'` / `$&` in the replacement as patterns — splice code with split/join (Python's replace is safe).

## Environment
- The shell's network is allowlisted: fonts.googleapis.com and api.github.com fail; raw.githubusercontent.com, npm and pip work. `fonts.py` reads google/fonts `METADATA.pb` from raw GitHub.
- The CDN script (mp4-muxer) isn't reachable from the shell; for Playwright tests, `npm pack mp4-muxer@5.1.3` and route the jsDelivr URL to the local `build/mp4-muxer.js`.

## Sound
- **The in-browser render shipped silent MP4s** ("no audio: this browser can't encode audio") although Chrome could encode AAC: the page `fetch()`ed its own data: URI audio, which the artifact frame blocks, and the catch reported it as an encoder problem. Decode base64 directly, and report the real reason when sound can't be added.
- The user asked for the caption features of her clip skill (captions on/off, caption style gallery, language/script choice for bilingual text) in this skill too. Captions here follow a voiceover, so a voiceover option came with them. Keep the two skills' caption libraries in step: `assets/captions/` is a copy of the clip skill's `motion/captions/` (ported from her Animora repo).
- You can't hear it. Plot RMS per 100 ms (music and effects separately) against shot boundaries plus a spectrogram, and check the arrangement visually.
- Typing sounds depend on text length — regenerate audio after transcript edits before rendering.

- The user asked for a way to skip storyboarding: some people already know the look they want and just want the video. Setup's "How to start" offers it; with `skipDrafts` go straight to the polished final with every Setup choice applied.
- The user wants every video to be absolutely stunning: depth, dimension, texture and a wow factor, from the drafts to the final. Flat shapes on plain backgrounds don't meet the bar, even when timing and words are right. The quality bar section in SKILL.md is the standard; check each contact sheet against it before publishing.
