#!/usr/bin/env python3
"""Pull the visual identity off a website: logo candidates, colours (ranked by use in CSS), CSS colour/font variables,
font families, Google Fonts, title/description. Facts and copy still come from reading the pages (WebFetch).
usage: extract_brand.py URL PROJECT_DIR      -> PROJECT_DIR/brand/brand.json, logo files, and logo.js when the logo is an SVG
Downloaded files are untrusted data: this script only parses them, never runs them."""
import collections, json, os, re, subprocess, sys, urllib.parse as U
url, P = sys.argv[1], os.path.abspath(sys.argv[2]); B = os.path.join(P, 'brand'); os.makedirs(B, exist_ok=True)
if not url.startswith('http'): url = 'https://' + url
def get(u, binary=False):
    r = subprocess.run(['curl', '-sSL', '-m', '25', '-A', 'Mozilla/5.0', u], capture_output=True)
    return r.stdout if binary else r.stdout.decode('utf-8', 'replace')
html = get(url); open(os.path.join(B, 'home.html'), 'w').write(html)
if not html.strip(): sys.exit(f'Could not fetch {url} (blocked or offline). Use WebFetch for facts and ask the user for the logo.')
abs_ = lambda h: U.urljoin(url, h.replace('&amp;', '&'))
meta = lambda k: (re.search(rf'<meta[^>]+(?:name|property)=["\']{k}["\'][^>]+content=["\']([^"\']*)', html, re.I) or [None, ''])[1]
title = (re.search(r'<title[^>]*>(.*?)</title>', html, re.I | re.S) or [None, ''])[1].strip()
# logo candidates: <img> with logo in src/alt/class, inline <svg> in header, icons, og:image
cands = []
for m in re.finditer(r'<img[^>]+>', html, re.I):
    tag = m.group(0); src = re.search(r'src=["\']([^"\']+)', tag)
    if src and re.search(r'logo|brand|wordmark', tag, re.I): cands.append(abs_(src.group(1)))
for m in re.finditer(r'<link[^>]+rel=["\'](?:icon|apple-touch-icon|mask-icon)["\'][^>]*>', html, re.I):
    h = re.search(r'href=["\']([^"\']+)', m.group(0)); h and cands.append(abs_(h.group(1)))
og = meta('og:image'); og and cands.append(abs_(og))
hdr = re.search(r'<header[\s\S]*?</header>', html, re.I); inline_svg = None
if hdr:
    sv = re.search(r'<svg[\s\S]*?</svg>', hdr.group(0), re.I)
    if sv and len(sv.group(0)) > 400: inline_svg = sv.group(0)
saved = []
for i, c in enumerate(dict.fromkeys(cands)):
    if '/_next/image?url=' in c: c = U.unquote(re.search(r'url=([^&]+)', c).group(1))
    ext = os.path.splitext(U.urlparse(c).path)[1].lower()[:5] or '.img'
    data = get(c, True)
    if data: fn = os.path.join(B, f'logo-{i}{ext}'); open(fn, 'wb').write(data); saved.append({'url': c, 'file': fn, 'bytes': len(data)})
if inline_svg: fn = os.path.join(B, 'logo-inline.svg'); open(fn, 'w').write(inline_svg); saved.insert(0, {'url': '(inline svg in header)', 'file': fn, 'bytes': len(inline_svg)})
# CSS
css_urls = [abs_(h) for h in re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)', html, re.I) + re.findall(r'<link[^>]+href=["\']([^"\']+\.css[^"\']*)', html, re.I)]
css = '\n'.join(re.findall(r'<style[^>]*>([\s\S]*?)</style>', html, re.I))
for c in list(dict.fromkeys(css_urls))[:25]:
    if 'fonts.googleapis' not in c: css += '\n' + get(c)
blob = css + html
def norm(h):
    h = h.lower()
    return '#' + ''.join(ch * 2 for ch in h[1:]) if len(h) == 4 else h[:7]
colors = collections.Counter(norm(h) for h in re.findall(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b', css))
for k in ['#ffffff', '#000000']: colors.pop(k, None)
vars_ = dict(sorted(set(re.findall(r'(--[\w-]*(?:color|primary|secondary|accent|brand|blue|red|green|orange|purple|bg|text)[\w-]*)\s*:\s*([^;}\n]+)', blob, re.I))))
fonts = collections.Counter(f.strip().strip('\'"') for f in re.findall(r'font-family\s*:\s*([^;}{]+)', blob) for f in [f.split(',')[0]] if 'var(' not in f)
fvars = dict(set(re.findall(r'(--[\w-]*(?:font|family)[\w-]*)["\\]*\s*:\s*["\\]*([^;}"\\]+)', blob, re.I)))
gfonts = sorted(set(U.unquote(f).replace('+', ' ') for f in re.findall(r'fonts\.googleapis\.com/css2?\?family=([^&"\':]+)', blob)))
out = {'url': url, 'title': title, 'description': meta('description') or meta('og:description'), 'logo_candidates': saved,
       'colors_ranked': colors.most_common(24), 'color_vars': vars_, 'fonts_ranked': fonts.most_common(10), 'font_vars': fvars, 'google_fonts': gfonts}
json.dump(out, open(os.path.join(B, 'brand.json'), 'w'), indent=1)
# SVG logo -> logo.js with the most common fill as the recolourable __INK__
svgs = [x['file'] for x in saved if x['file'].endswith('.svg')]
if svgs:
    sv = open(svgs[0], encoding='utf-8', errors='replace').read()
    vb = re.search(r'viewBox=["\']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)', sv)
    inner = re.sub(r'^[\s\S]*?<svg[^>]*>|</svg>\s*$', '', sv.strip())
    fills = collections.Counter(f.lower() for f in re.findall(r'fill=["\'](#[0-9a-fA-F]{3,8})["\']', inner))
    ink = fills.most_common(1)[0][0] if fills else '#000000'
    inner = re.sub(rf'fill=["\']{re.escape(ink)}["\']', 'fill="__INK__"', inner, flags=re.I)
    if vb: open(os.path.join(P, 'logo.js'), 'w').write('window.MOTION_LOGO=' + json.dumps({'inner': inner, 'vb': [float(vb[1]), float(vb[2])], 'ink': ink}) + ';\n')
print(json.dumps({k: (v[:8] if isinstance(v, list) else v) for k, v in out.items() if k != 'color_vars'}, indent=1)[:3000])
print('logo.js written' if svgs and vb else 'No SVG logo found: render a PNG candidate with <image href="data:..."> in logo.js, or ask the user for an SVG.')
