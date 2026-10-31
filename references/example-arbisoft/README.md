# Worked example: Arbisoft brand film

A real project made with this workflow, kept to show the **mechanics**: board objects, fields that cover every on-screen word, `chrome` allow-lists, sound cues, a draft → final pair sharing field keys, `push`, `ORDER`.

Do not reuse its look. Its terminal windows, isometric blocks, dot maps and colours belong to that brand and brief; a new project should be designed from its own material.

- `boards.js` — 6 drafts (Kinetic Type, 3D Pillars [dropped from ORDER], Data Cuts, Map Journey, Code to Product, Before / After) and the polished 60 s `code-to-product-final` (9 shots, 22 fields, cues for every shot).
- `logo.js` — an SVG wordmark in MOTION_LOGO format (grey as `__INK__`, so it can turn white on dark frames).

To try it: copy both files into a project folder created with `new_project.py`, add `"fonts":{"display":"Inter","body":"Nunito","mono":"JetBrains Mono"}` to project.json, run `fonts.py` for those three families, then `build_page.py`.
