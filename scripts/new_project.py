#!/usr/bin/env python3
"""Scaffold a project folder so build_page.py can publish the Setup-only page straight away.
usage: new_project.py PROJECT_DIR "Project name" """
import json, os, re, sys
P = os.path.abspath(sys.argv[1]); name = sys.argv[2] if len(sys.argv) > 2 else 'Motion video'
os.makedirs(P, exist_ok=True); slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
pj = {'name': name, 'slug': slug, 'title': f'{name} Motion Video', 'phase': 'setup', 'finalVersion': 0, 'musicLabel': '',
      'header': {'eyebrow': 'Motion video · start here', 'h1': 'Set up your motion video', 'lede': 'Fill in the Setup tab, press Build storyboards, then say “build storyboards” in the chat.'},
      'fonts': {'display': 'Inter', 'body': 'Inter', 'mono': 'JetBrains Mono'}, 'theme': {'accent': '#2563eb', 'accent2': '#f97316', 'ink': '#0f172a'}, 'brand': None}
if not os.path.exists(os.path.join(P, 'project.json')): json.dump(pj, open(os.path.join(P, 'project.json'), 'w'), indent=1, ensure_ascii=False)
if not os.path.exists(os.path.join(P, 'boards.js')): open(os.path.join(P, 'boards.js'), 'w').write('const boards=[];\nconst ORDER=[];\n')
print('project at', P)
