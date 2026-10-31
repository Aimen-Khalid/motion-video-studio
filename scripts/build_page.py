#!/usr/bin/env python3
"""Assemble a project's review page and engine.
usage: build_page.py PROJECT_DIR
Reads  PROJECT_DIR/project.json, boards.js, and optionally logo.js, fonts.js, audio/music.mp3, audio/sfx.mp3,
       voice/<board>.mp3 + voice/<board>.json (from voiceover.py)
Writes PROJECT_DIR/engine.js (for node + renderers), PROJECT_DIR/render.html, PROJECT_DIR/page.html (publish this).
The caption-style library (assets/captions) is embedded when any board has a voiceover."""
import base64, glob, json, os, re, sys
SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *a: os.path.join(SKILL, 'assets', *a)
P = os.path.abspath(sys.argv[1]); j = lambda *a: os.path.join(P, *a)
rd = lambda f, d='': open(f, encoding='utf-8').read() if os.path.exists(f) else d
pj = json.load(open(j('project.json')))
boards = rd(j('boards.js'), 'const boards=[];')
engine = rd(A('engine-core.js')).split('/*BOARDS*/')
engine = engine[0] + boards + engine[1]
open(j('engine.js'), 'w').write(engine)
logo, fonts = rd(j('logo.js')), rd(j('fonts.js'))
fam = pj.get('fonts', {}); fd, fb, fm = fam.get('display', 'Inter'), fam.get('body', 'Inter'), fam.get('mono', 'JetBrains Mono')
link = 'https://fonts.googleapis.com/css2?' + '&'.join(f"family={f.replace(' ', '+')}:wght@400;600;700;800;900" for f in dict.fromkeys([fd, fb]) ) + f"&family={fm.replace(' ', '+')}:wght@400;600&display=swap"
th = pj.get('theme', {})
def data(f, mime='audio/mpeg'): return f'data:{mime};base64,' + base64.b64encode(open(f, 'rb').read()).decode() if os.path.exists(f) else ''
js = lambda o: json.dumps(o, ensure_ascii=False).replace('</', '<\\/')

# voiceover per board: {board: {voice, lines, src}}
voice = {}
for f in sorted(glob.glob(j('voice', '*.json'))):
    bid = os.path.basename(f)[:-5]; v = json.load(open(f)); v['src'] = data(f[:-5] + '.mp3'); voice[bid] = v
samples = {os.path.basename(f)[:-4]: data(f) for f in sorted(glob.glob(A('voices', '*.mp3')))}
has_cap = bool(voice)
cap_js = rd(A('captions', 'captions.js')) if has_cap else ''
cap_tpl = rd(A('captions', 'templates.json'), 'null') if has_cap else 'null'
cap_fonts = next((x for x in rd(A('captions', 'fonts-google.txt')).split() if x.startswith('https://')), '') if has_cap else ''

s = rd(A('page.src.html'))
for k, v in {'{{TITLE}}': pj.get('title', 'Motion Video'), '{{FONT_LINK}}': link, '{{ACCENT}}': th.get('accent', '#2563eb'), '{{ACCENT2}}': th.get('accent2', '#f97316'),
             '{{INK}}': th.get('ink', '#0f172a'), '{{FONT_DISPLAY}}': fd, '{{FONT_BODY}}': fb, '{{FONT_MONO}}': fm,
             '{{PROJECT}}': js(pj), '{{LOGO_JS}}': logo, '{{FONTS}}': fonts, '{{ENGINE}}': engine,
             '{{MUSIC}}': data(j('audio', 'music.mp3')), '{{SFX}}': data(j('audio', 'sfx.mp3')),
             '{{VOICE}}': js(voice), '{{VOICE_SAMPLES}}': js(samples), '{{CAPTIONS_JS}}': cap_js,
             '{{CAPTION_TEMPLATES}}': cap_tpl, '{{CAPTION_FONTS_URL}}': js(cap_fonts)}.items():
    s = s.replace(k, v)
open(j('page.html'), 'w').write(s)

# render.html: same frames for render.py; caption fonts come from the skill's local woff2 files (the shell can't reach Google Fonts)
face = ''
if has_cap:
    for fam_, slug, codes in re.findall(r'\["([^"]+)", "([^"]+)", "([^"]+)"\]', cap_js):
        for c in codes.split():
            it = c.endswith('i'); w = int(c.rstrip('i')); fn = A('captions', 'fonts', f"{slug}-latin-{w}-{'italic' if it else 'normal'}.woff2")
            if os.path.exists(fn): face += f"@font-face{{font-family:'{fam_}';font-weight:{w};font-style:{'italic' if it else 'normal'};src:url('file://{fn}')}}"
vmeta = {k: {kk: vv for kk, vv in v.items() if kk != 'src'} for k, v in voice.items()}
open(j('render.html'), 'w').write('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#000}#s{position:relative}#s svg{display:block}#c{position:absolute;left:0;top:0}' + face + '</style></head>'
    '<body><div id="s"><div id="v"></div><canvas id="c"></canvas></div>'
    f'<script>{logo}</script><script>{fonts}</script><script>window.MOTION_VOICE={js(vmeta)};</script>'
    f'<script>{cap_js}</script><script>window.CAPTION_TEMPLATES={cap_tpl};</script><script src="engine.js"></script>'
    '<script>const CAP=window.CAPTIONS&&window.CAPTION_TEMPLATES?CAPTIONS.load(CAPTION_TEMPLATES):null;let CS=null;'
    'window.fontsReady=()=>CAP?Promise.all(CAP.fonts.map(f=>document.fonts.load(f).catch(()=>{}))):Promise.resolve();'
    'window.r=(id,t,tx,w,h,cap)=>{cap=cap||{mode:"designed"};document.getElementById("v").innerHTML=MOTION_ENGINE.frame(id,t,tx,{w,h,fonts:!!window.MOTION_FONTCSS,captions:cap.mode==="designed"?"designed":"none"});'
    'const c=document.getElementById("c");if(c.width!==w)c.width=w;if(c.height!==h)c.height=h;const g=c.getContext("2d");g.clearRect(0,0,w,h);'
    'if(cap.mode==="template"&&CAP&&cap.preset){const k=cap.preset+JSON.stringify(cap.overrides||{})+JSON.stringify(tx);if(!CS||CS.k!==k){const v=CAP.resolve(cap.preset,cap.overrides||{});CS={k,v,g:CAP.groupWords(MOTION_ENGINE.captionWords(id,tx),v)}}'
    'CAP.draw(g,{W:w,H:h,t,groups:CS.g,values:CS.v,motion:"smooth"})}}</script></body></html>')
print(f"page.html {len(s)//1024} KB · boards: {boards.count('{id:') + boards.count('boards.push(')} · audio: {'yes' if os.path.exists(j('audio','music.mp3')) else 'no'} · voice: {', '.join(voice) or 'none'}")
