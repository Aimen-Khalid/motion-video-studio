# Style menu and music moods

These are the options the Setup form offers (the catalog lives in `assets/page.src.html` as `CATALOG` and `MOODS` — add to it freely). They are a shared vocabulary between you and the user, not recipes: a "Map Journey" for a talk on migration should look nothing like one for a software company.

The list is not a boundary. Each Setup slot offers **Let Claude choose** (`"auto"`), **Describe my own style…** (stored as `"custom: <their words>"`), or a style from the list.

- **auto**: complete freedom — choose from the list or go beyond it (invent a style, blend two, borrow from a film, an art movement, a medium, the subject's own world). Pick what fits the material (a statistic-heavy brief might suit Data Cuts; a story of growth, Origin Story; a chemistry lesson, something drawn from lab notebooks that isn't on the list at all) and keep the set varied — different looks *and* different arcs.
- **custom**: the user's description is the brief for that direction. Honour it closely, and fill unstated details in its spirit.
- **listed style**: a starting direction, interpreted for this subject.

Add new styles to the catalog when you find ones worth offering again.

## Styles (48, in 8 groups)

**Typography** — Kinetic Typography · Swiss Grid Minimal · Editorial Magazine · Big Bold Statements · Type Collage · Handwritten Script
**Data & explainers** — Data Cuts · Infographic Explainer · Dashboard Tour · Timeline · Process Flow · Map Journey
**Product & UI** — Code to Product · Device Mockups · Glass UI Showcase · Before / After Split · Feature Walkthrough · Screen Polish
**3D & depth** — Isometric 3D · Soft 3D Clay · Low-poly · Floating Objects · Paper Layers Parallax · Camera Fly-through
**Illustration & hand-made** — Flat Illustration · Whiteboard Doodle · Paper Cut-out · Blueprint / Line Art · Sketchbook · Stop-motion Collage
**Abstract & generative** — Particle Swarm · Liquid Morph · Bauhaus Geometric · Gradient Flow · Noise Field · Shape Grammar
**Retro & pop** — Retro Pixel · Synthwave Neon · 90s Web · Pop Art Halftone · VHS Glitch · Memphis Pattern
**Cinematic & story** — Origin Story · Problem → Solution · Day in the Life · Testimonial Quotes · Countdown / Launch · Character Story

## Music moods (`audio.py --mood`)

| mood | feel | preset |
|---|---|---|
| glitchy | choppy synths, digital stutters | 120 bpm, Am–F–C–G, bitcrushed arp, stutters into cuts |
| pulse | driving four-on-the-floor, building arpeggio | 124 bpm, offbeat bass, open hats |
| lofi | mellow, warm, laid-back | 84 bpm, 7th chords, swung hats, vinyl crackle |
| cinematic | swells to a big moment | 90 bpm, booms, drones, long riser |
| ambient | soft pads, almost no beat | 70 bpm, sparse bells |
| corporate | bright, positive | 112 bpm, plucks, claps |
| synthwave | 80s analog synths, gated snare | 100 bpm, saw arp |
| pluck | bouncy, witty | 108 bpm, marimba plucks |

Like styles, these are not a limit. The Setup form offers **Let Claude decide** (`"auto"`, the default), **Describe my own…** (`"custom: <their words>"`) and the eight moods. For auto, choose freely, on or off the list; for custom, follow the description. Build new moods with `audio.py --custom` (see its header for the settings) or by extending the script. When suggesting moods in chat, recommend two that suit the chosen style and mention they can describe their own.

## Voices (`voiceover.py --voice`)

Free Kokoro v1.0 voices, offered in Setup with a ▶ sample each (`assets/voices/<id>.mp3`). American women: `af_bella`, `af_heart`, `af_nicole` (soft), `af_sarah`, `af_nova`. American men: `am_michael`, `am_adam`, `am_eric`, `am_liam`, `am_onyx` (deep). British women: `bf_emma`, `bf_isabella`, `bf_alice`. British men: `bm_george`, `bm_lewis`, `bm_daniel`. Hindi, also natural for spoken Urdu: `hf_alpha`, `hf_beta`, `hm_omega`, `hm_psi`. "Let Claude choose" (`auto`) means pick what suits the piece and say which. Kokoro has more voices and languages (es, fr, it, pt, ja, zh); use them when the brief calls for it.
