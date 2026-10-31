#!/usr/bin/env python3
"""Compose background music + sound effects for one board, arranged around its shots.
usage: audio.py PROJECT_DIR BOARD [--mood glitchy] [--custom JSON] [--music yes|no] [--sfx yes|subtle|no] [--texts texts.json]
Preset moods: glitchy pulse lofi cinematic ambient corporate synthwave pluck. These are starting points, not a limit:
--custom overrides any preset setting to build a new mood, e.g. --mood lofi --custom '{"bpm":76,"ch":[[57,60,64],[53,57,60]],"lead":"sparse","kick":"none"}'
Settings: bpm, ch (chords as lists of MIDI notes), kick four|half|lofi|boom|none, clap 0-1, hat 0-1,
bass eighth|offbeat|soft|drone|staccato|none, lead square|saw|pluck|pluck8|marimba|sparse|none, pad (filter Hz),
stutter true|false, crush true|false, vinyl true|false. For sounds these instruments can't make, extend this file.
Writes PROJECT_DIR/audio/{music,sfx,mix}.wav and mono .mp3 previews (the page embeds the mp3s).
Arrangement: quiet intro until shot 2 starts, groove in from shot 2, full from shot 3, a one-bar breakdown about 2/3 in,
a riser into the reveal and a hit on it. The reveal is the first 'hit' cue if the board has one, else last shot start + 1s.
Sound effects come from the board's cue points (scene `c:` functions): key softkey enter tick whoosh collapse pop card
swell done ping count run pass ok hit sparkle."""
import argparse, json, os, subprocess, numpy as np
from scipy.signal import butter, sosfilt
import scipy.io.wavfile as W
ap = argparse.ArgumentParser(); ap.add_argument('project'); ap.add_argument('board')
ap.add_argument('--mood', default='glitchy'); ap.add_argument('--custom'); ap.add_argument('--music', default='yes'); ap.add_argument('--sfx', default='yes'); ap.add_argument('--texts')
o = ap.parse_args(); P = os.path.abspath(o.project); SR = 44100
texts = json.load(open(o.texts)) if o.texts else {}
info = json.loads(subprocess.check_output(['node', '-e', f"""global.window={{}};const E=require({json.dumps(os.path.join(P,'engine.js'))});const b=E.boards.find(x=>x.id=={json.dumps(o.board)});
console.log(JSON.stringify({{total:b.total,scenes:b.scenes.map(s=>s.start),cues:E.cues(b.id,{json.dumps(texts)})}}))"""]))
TOTAL = info['total']; N = int(TOTAL * SR); rng = np.random.default_rng(7)
A, D, C, G, F, E_, Dm7 = [57, 60, 64], [62, 66, 69], [60, 64, 67], [55, 59, 62], [53, 57, 60], [52, 55, 59], [50, 53, 57, 60]
PRESETS = {  # bpm, chords, kick, clap, hat density, bass, lead, pad cutoff, stutter, crush
 'glitchy':   dict(bpm=120, ch=[A, F, C, G], kick='four', clap=.55, hat=.85, bass='eighth', lead='square', pad=1800, stutter=True, crush=True),
 'pulse':     dict(bpm=124, ch=[E_, C, G, D], kick='four', clap=.5, hat=.95, bass='offbeat', lead='saw', pad=2200, stutter=False, crush=False),
 'lofi':      dict(bpm=84, ch=[Dm7, [55, 59, 62, 65], [48, 52, 55, 59], [57, 60, 64, 67]], kick='lofi', clap=.35, hat=.5, bass='soft', lead='pluck8', pad=900, stutter=False, crush=False, vinyl=True),
 'cinematic': dict(bpm=90, ch=[A, F, C, G], kick='boom', clap=0, hat=.0, bass='drone', lead='none', pad=2600, stutter=False, crush=False),
 'ambient':   dict(bpm=70, ch=[[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]], kick='none', clap=0, hat=0, bass='drone', lead='sparse', pad=1400, stutter=False, crush=False),
 'corporate': dict(bpm=112, ch=[C, G, A, F], kick='four', clap=.5, hat=.8, bass='eighth', lead='pluck', pad=2400, stutter=False, crush=False),
 'synthwave': dict(bpm=100, ch=[A, F, C, G], kick='four', clap=.8, hat=.7, bass='eighth', lead='saw', pad=2000, stutter=False, crush=False),
 'pluck':     dict(bpm=108, ch=[C, F, G, C], kick='half', clap=.35, hat=.6, bass='staccato', lead='marimba', pad=1600, stutter=False, crush=False)}
M = {**PRESETS.get(o.mood, PRESETS['glitchy']), **(json.loads(o.custom) if o.custom else {})}; BEAT = 60 / M['bpm']; S16 = BEAT / 4; BAR = BEAT * 4
def at(t): return int(t * SR)
def env(n, a=.002, d=.2):
    t = np.arange(n) / SR; e = np.exp(-t / max(d, 1e-4)); k = int(a * SR)
    if k: e[:k] *= np.linspace(0, 1, k)
    return e
def flt(x, kind, f, order=2):
    f = np.clip(np.atleast_1d(f) / (SR / 2), 1e-4, .999)
    return sosfilt(butter(order, f if len(f) > 1 else f[0], btype=kind, output='sos'), x)
def add(buf, t, sig, g=1.0):
    i = at(t)
    if i >= len(buf) or i + len(sig) <= 0: return
    j = min(len(buf), i + len(sig)); buf[max(i, 0):j] += g * sig[max(0, -i):j - i]
def sine(f, n): return np.sin(2 * np.pi * f * np.arange(n) / SR)
def saw(f, n): return 2 * ((np.arange(n) / SR * f) % 1) - 1
def sq(f, n): return np.sign(sine(f, n))
def noise(n): return rng.uniform(-1, 1, n)
def sweep(f0, f1, n): return np.sin(2 * np.pi * np.cumsum(np.geomspace(f0, f1, n)) / SR)
def crush(x, bits=5, hold=4): q = 2 ** bits; return np.repeat((np.round(x * q) / q)[::hold], hold)[:len(x)]
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def kick(big=False): n = int((.9 if big else .38) * SR); return sweep(110 if big else 130, 38, n) * env(n, .001, .35 if big else .12) * (1.3 if big else 1)
def clap(): n = int(.22 * SR); return flt(noise(n), 'bandpass', [900, 2600]) * env(n, .001, .06) * 2.2
def hat(op=False): n = int((.16 if op else .05) * SR); return flt(noise(n), 'highpass', 7000) * env(n, .001, .05 if op else .012)
chord_at = lambda t: M['ch'][int(t // BAR) % len(M['ch'])]
s = info['scenes'] + [TOTAL]
INTRO_END = s[1] if len(s) > 2 else 0; FULL = s[2] if len(s) > 3 else INTRO_END
hits = [t for t, k in info['cues'] if k == 'hit']; HIT = hits[0] if hits else (s[-2] + 1.0 if len(s) > 2 else TOTAL - 2)
RISE0 = max(FULL, HIT - 2.2)
bi = int(len(s) * 2 / 3) - 1; BREAK = (s[bi], s[bi] + BAR) if len(s) > 6 else (None, None)
pad = np.zeros(N); bass = np.zeros(N); lead = np.zeros(N); drums = np.zeros(N); fx = np.zeros(N)
music = np.zeros(N); sfx = np.zeros(N)
if o.music == 'yes':
    for k in range(int(TOTAL / BAR) + 1):
        t0 = k * BAR
        if t0 >= HIT: break
        n = int(BAR * SR) + int(.5 * SR); ch = chord_at(t0)
        x = sum(saw(midi(m) * (1 + d), n) for m in ch for d in (-.004, .004)) / (2 * len(ch))
        a = np.minimum(1, np.arange(n) / (SR * .6)) * np.exp(-np.arange(n) / (SR * 6))
        add(pad, t0, flt(x, 'lowpass', M['pad'] * (.5 if t0 < INTRO_END else 1)) * a, .5)
    for k, t in enumerate(np.arange(0, TOTAL, S16)):
        step = k % 16; on = step % 4 == 0; brk = BREAK[0] is not None and BREAK[0] <= t < BREAK[1]
        if t >= RISE0: continue
        kk = M['kick']
        if t >= INTRO_END and not brk:
            if (kk == 'four' and on) or (kk == 'half' and step in (0, 8)) or (kk == 'lofi' and step in (0, 7, 10)): add(drums, t, kick(), .9 if kk != 'lofi' else .6)
            if kk == 'boom' and step == 0 and (k // 16) % 2 == 0: add(drums, t, kick(True), .8)
        if M['clap'] and t >= FULL and step in (4, 12) and not brk: add(drums, t, clap(), M['clap'])
        if M['hat'] and t >= INTRO_END * .4 and rng.random() < M['hat'] * (.65 if t < FULL else 1):
            sw = S16 * .33 if o.mood == 'lofi' and step % 2 else 0
            add(drums, t + sw, hat(step % 8 == 6 or (o.mood == 'pulse' and step % 4 == 2)), .35 if step % 2 else .22)
        if M['crush'] and t < INTRO_END and rng.random() < .25:
            n = int(.03 * SR); add(drums, t, crush(sine(rng.choice([1800, 2400, 3200]), n) * env(n, .0005, .01), 3, 6), .25)
        ch = chord_at(t); root = ch[0] - 24
        if t >= INTRO_END and not brk:
            b = M['bass']
            if b == 'drone' and step == 0: n = int(BAR * SR); add(bass, t, flt(saw(midi(root), n), 'lowpass', 220) * np.minimum(1, np.arange(n) / (SR * .4)) * env(n, .001, 3), .5)
            elif b in ('eighth', 'staccato') and step % 2 == 0:
                r = root + (12 if step in (6, 14) else 0); n = int(S16 * 2 * SR * (.5 if b == 'staccato' else .9))
                add(bass, t, flt(saw(midi(r), n) + .5 * sq(midi(r) / 2, n), 'lowpass', 520) * env(n, .003, .16), .55)
            elif b == 'offbeat' and step % 4 == 2: n = int(S16 * 2 * SR); add(bass, t, flt(saw(midi(root), n), 'lowpass', 600) * env(n, .003, .12), .6)
            elif b == 'soft' and step in (0, 6, 10): n = int(BEAT * SR); add(bass, t, sine(midi(root), n) * env(n, .01, .4), .7)
        if t >= FULL and M['lead'] != 'none':
            L = M['lead']; pat = [0, 1, 2, 1, 0, 2, 1, 2]; m = ch[pat[step % 8] % len(ch)] + (12 if (k // 16) % 2 else 0)
            if L == 'square': n = int(S16 * SR * .85); x = crush(sq(midi(m), n) * env(n, .001, .07), 4, 3); add(lead, t, flt(x, 'lowpass', 3800), .16)
            elif L == 'saw': n = int(S16 * SR * .9); add(lead, t, flt(saw(midi(m), n), 'lowpass', 3000) * env(n, .002, .09), .14)
            elif L in ('pluck', 'pluck8') and (L == 'pluck' or step % 2 == 0): n = int(.4 * SR); add(lead, t, (sine(midi(m + 12), n) + .3 * sine(midi(m + 24), n)) * env(n, .001, .12), .2)
            elif L == 'marimba' and step % 2 == 0 and rng.random() < .8: n = int(.35 * SR); add(lead, t, (sine(midi(m + 12), n) + .5 * sine(midi(m + 12) * 4, n) * env(n, .001, .02)) * env(n, .001, .1), .25)
            elif L == 'sparse' and step % 4 == 0 and rng.random() < .35: n = int(1.2 * SR); add(lead, t, sine(midi(m + 12), n) * env(n, .01, .5), .18)
    pump = np.ones(N)
    if M['kick'] == 'four':
        for t in np.arange(INTRO_END, RISE0, BEAT):
            i = at(t); n = min(int(BEAT * SR), N - i)
            if n > 0: pump[i:i + n] = np.minimum(pump[i:i + n], (1 - .55 * np.exp(-np.arange(n) / (SR * .09))))
    music = pad * pump + bass * pump + lead + drums
    if M.get('vinyl'): music += flt(noise(N), 'bandpass', [1000, 5000]) * .012 + (rng.random(N) < .0004) * rng.uniform(-.3, .3, N)
    if M['stutter']:
        for c in s[2:-2]:
            i = at(c - S16); seg = music[i:i + int(S16 / 2 * SR)].copy()
            for r in range(2): j = i + r * len(seg); music[j:j + len(seg)] = crush(seg, 5, 2 + r * 2)
    n = at(HIT) - at(RISE0)
    if n > 0:
        add(fx, RISE0, flt(noise(n), 'highpass', 400) * np.linspace(0, 1, n) ** 2 * .35 + sweep(180, 1400, n) * np.linspace(0, 1, n) ** 3 * .18)
        if M['clap']:
            for k, t in enumerate(np.arange(RISE0 + 1.0, HIT, S16 / 2)): add(fx, t, clap(), .15 + .02 * k)
    nh = int(min(5.5, TOTAL - HIT + .5) * SR)
    if nh > 0:
        stab = flt(sum(saw(midi(m), nh) for m in [chord_at(0)[0] - 12] + chord_at(0)) / 5, 'lowpass', 2400) * env(nh, .003, 1.8) * .6
        add(fx, HIT, sweep(90, 32, nh) * env(nh, .001, .9) * 1.2 + flt(noise(nh), 'highpass', 3000) * env(nh, .001, 1.2) * .35 + stab)
    music = music + fx
    fn = int(1.2 * SR); music[-fn:] *= np.linspace(1, 0, fn); fi = int(.05 * SR); music[:fi] *= np.linspace(0, 1, fi)
if o.sfx != 'no':
    def click(soft=False):
        n = int(.018 * SR); x = flt(noise(n), 'bandpass', [1800, 6000]) * env(n, .0003, .004) + sine(rng.uniform(1900, 2600), n) * env(n, .0003, .003) * .3
        return x * (.35 if soft else .6)
    def tone(f, d, g=1.0): n = int(d * SR); return sine(f, n) * env(n, .002, d / 4) * g
    def whoosh(up=False, d=.45):
        n = int(d * SR); x = noise(n); fq = np.geomspace(400, 5000, n) if up else np.geomspace(5000, 400, n); y = np.zeros(n)
        for i in range(0, n, 2048): y[i:i + 2048] = flt(x[i:i + 2048], 'bandpass', [fq[i] * .7, fq[i] * 1.4], 1)
        return y * np.sin(np.linspace(0, np.pi, n)) ** 2 * .5
    for t, typ in info['cues']:
        if typ == 'key': add(sfx, t, click())
        elif typ == 'softkey': add(sfx, t, click(True), .7)
        elif typ == 'enter': n = int(.05 * SR); add(sfx, t, flt(noise(n), 'lowpass', 900) * env(n, .001, .02), 1.4)
        elif typ == 'tick': add(sfx, t, tone(1760, .06), .25)
        elif typ == 'whoosh': add(sfx, t - .2, whoosh(), .55)
        elif typ == 'collapse': add(sfx, t, whoosh(True, .9), .7)
        elif typ == 'pop': n = int(.09 * SR); add(sfx, t, sweep(500, 1100, n) * env(n, .001, .03), .4)
        elif typ == 'card': add(sfx, t - .1, whoosh(d=.25), .35); n = int(.08 * SR); add(sfx, t + .15, sweep(700, 1000, n) * env(n, .001, .025), .3)
        elif typ == 'swell': n = int(.7 * SR); add(sfx, t, flt(noise(n), 'bandpass', [2000, 6000]) * np.sin(np.linspace(0, np.pi, n)) * .25)
        elif typ == 'done': add(sfx, t, tone(midi(76), .35, .35)); add(sfx, t + .1, tone(midi(81), .45, .35))
        elif typ == 'ping': add(sfx, t, tone(1318, .5, .3)); add(sfx, t + .18, tone(1318, .4, .1))
        elif typ == 'count':
            for i in range(10): add(sfx, t + i * .06, tone(2200 + i * 40, .025, .12))
        elif typ == 'run': add(sfx, t, tone(660, .07, .2))
        elif typ == 'pass': add(sfx, t, tone(midi(81), .3, .3)); add(sfx, t + .06, tone(midi(88), .35, .25))
        elif typ == 'ok':
            for i, m in enumerate([84, 88, 91]): add(sfx, t + i * .08, tone(midi(m), .4, .22))
        elif typ == 'hit': n = int(1.5 * SR); add(sfx, t, flt(noise(n), 'highpass', 6000) * env(n, .001, .5), .25)
        elif typ == 'sparkle':
            for i in range(6): add(sfx, t + i * .05, tone(rng.uniform(2500, 4200), .2, .12))
def norm(x, pk): m = np.max(np.abs(x)) or 1; return x / m * pk
music = np.tanh(norm(music, .95) * 1.3) * .7 if music.any() else music
sfx = norm(sfx, .6 if o.sfx == 'yes' else .35) if sfx.any() else sfx
mix = np.tanh((music * .8 + sfx * .9) * 1.05) * .89
out = os.path.join(P, 'audio'); os.makedirs(out, exist_ok=True)
for name, x in [('music', music), ('sfx', sfx), ('mix', mix)]:
    path = f'{out}/{name}'
    if not x.any():
        for ext in ('.wav', '.mp3'):
            if os.path.exists(path + ext): os.remove(path + ext)
        continue
    W.write(path + '.wav', SR, (np.stack([x, x], 1) * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path + '.wav', '-ac', '1', '-b:a', '80k', path + '.mp3'], check=True)
print(f"audio: {o.mood}{' + custom' if o.custom else ''} {M['bpm']}bpm, {TOTAL}s, {len(info['cues'])} cues, music={o.music}, sfx={o.sfx}, hit at {HIT:.2f}s")
