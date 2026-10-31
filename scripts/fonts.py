#!/usr/bin/env python3
"""Fetch brand fonts from github.com/google/fonts, install them for server renders, and write PROJECT_DIR/fonts.js:
subset woff2 @font-face rules embedded into every frame (an SVG drawn to canvas ignores the page's web fonts).
usage: fonts.py PROJECT_DIR "Family One" "Family Two" ...   (fonts.googleapis.com is often unreachable from the shell)"""
import base64, json, os, re, subprocess, sys, urllib.request
P = os.path.abspath(sys.argv[1]); fams = sys.argv[2:]; home = os.path.expanduser('~/.fonts'); os.makedirs(home, exist_ok=True)
FD = os.path.join(P, 'brand', 'fonts'); os.makedirs(FD, exist_ok=True)
extra = ''
for f in ('boards.js', 'project.json'):
    if os.path.exists(os.path.join(P, f)): extra += open(os.path.join(P, f), encoding='utf-8').read()
chars = sorted({c for c in extra if ord(c) > 0xFF})
U = 'U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2192' + ''.join(f',U+{ord(c):04X}' for c in chars)
RAW = 'https://raw.githubusercontent.com/google/fonts/main/'
def meta(path):  # METADATA.pb lists the family's files; the GitHub API is often blocked, raw files are not
    txt = urllib.request.urlopen(RAW + path + '/METADATA.pb', timeout=20).read().decode()
    return [{'name': n, 'download_url': RAW + path + '/' + urllib.request.quote(n)} for n in re.findall(r'filename:\s*"([^"]+)"', txt)]
css = ''
for fam in fams:
    slug = re.sub(r'[^a-z0-9]', '', fam.lower()); files = None
    for lic in ('ofl', 'apache', 'ufl'):
        try: files = meta(f'{lic}/{slug}'); break
        except Exception: pass
    if not files: print('NOT FOUND on google/fonts:', fam); continue
    ttf = [x for x in files if x['name'].endswith('.ttf') and 'Italic' not in x['name']]
    ttf.sort(key=lambda x: ('[' not in x['name'], 'Regular' not in x['name'], len(x['name'])))
    if not ttf: print('no ttf for', fam); continue
    src = os.path.join(home, ttf[0]['name']); urllib.request.urlretrieve(ttf[0]['download_url'], src)
    out = os.path.join(FD, slug + '.woff2')
    subprocess.run(['pyftsubset', src, f'--unicodes={U}', '--flavor=woff2', '--layout-features=*', f'--output-file={out}'], check=True)
    css += f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{base64.b64encode(open(out,'rb').read()).decode()}) format('woff2');font-weight:100 900}}"
    print(f'{fam}: {ttf[0]["name"]} -> {os.path.getsize(out)//1024} KB subset')
subprocess.run(['fc-cache', '-f'], capture_output=True)
open(os.path.join(P, 'fonts.js'), 'w').write('window.MOTION_FONTCSS=' + json.dumps(css) + ';\n')
print('fonts.js', len(css) // 1024, 'KB')
