#!/usr/bin/env python3
"""Voice a board's narration lines and time every word, for the voice track and captions.
usage: voiceover.py PROJECT_DIR BOARD [--voice af_bella] [--speed 1.0] [--texts texts.json] [--lang en-us]
       voiceover.py PROJECT_DIR BOARD --audio-dir DIR [--voice "elevenlabs:Rachel"]
--audio-dir: use audio made elsewhere (the user's paid voice service, or recordings they attach) instead of Kokoro:
  one file per line named <key>.wav/.mp3/.m4a/.ogg (vo1.mp3, vo2.mp3 …). Timing, overlap checks, word timings and
  outputs are exactly as with Kokoro; --voice is only the label shown in the page.

Narration lines are transcript fields with a `vo` key in boards.js, e.g.
  {key:'vo1', label:'Voiceover', shot:0, def:'Start with one sentence.', vo:{at:.3}}
  `at` is seconds into that shot. Optional `say` is what the voice should actually read when it
  differs from the caption (for example Devanagari for a Hindi/Urdu voice while captions show
  Roman Urdu or Urdu script), and `vo.voice` overrides the voice for one line.
Writes PROJECT_DIR/voice/BOARD.mp3 (preview, embedded by build_page.py), BOARD.wav (master, for
render.py --voice) and BOARD.json: {voice, lines:[{key, t0, t1, text, words:[[word, start, end], ...]}]}.
Lines that would overlap the next one are pushed later and reported, so you can retime them.

Voices (Kokoro v1.0, free, runs locally): American women af_bella af_heart af_nicole af_sarah af_nova,
American men am_michael am_adam am_eric am_liam am_onyx, British women bf_emma bf_isabella bf_alice,
British men bm_george bm_lewis bm_daniel, Hindi (also good for spoken Urdu) hf_alpha hf_beta hm_omega hm_psi.
Kokoro also speaks es fr it pt ja zh; pass --lang and a matching voice. Models download once to ~/.cache/kokoro."""
import argparse, json, os, re, subprocess, sys, urllib.request
import numpy as np
import soundfile as sf

ap = argparse.ArgumentParser(); ap.add_argument('project'); ap.add_argument('board')
ap.add_argument('--voice', default='af_bella'); ap.add_argument('--speed', type=float, default=1.0)
ap.add_argument('--texts'); ap.add_argument('--lang'); ap.add_argument('--audio-dir')
o = ap.parse_args(); P = os.path.abspath(o.project)
texts = json.load(open(o.texts)) if o.texts else {}

K = None
if not o.audio_dir:
    CACHE = os.path.expanduser('~/.cache/kokoro'); os.makedirs(CACHE, exist_ok=True)
    REL = 'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'
    for f in ('kokoro-v1.0.int8.onnx', 'voices-v1.0.bin'):
        p = os.path.join(CACHE, f)
        if not os.path.exists(p):
            print('downloading', f, flush=True); urllib.request.urlretrieve(REL + f, p + '.part'); os.replace(p + '.part', p)
    try:
        from kokoro_onnx import Kokoro
    except ImportError:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', '--break-system-packages', 'kokoro-onnx', 'soundfile'], check=True)
        from kokoro_onnx import Kokoro
    K = Kokoro(os.path.join(CACHE, 'kokoro-v1.0.int8.onnx'), os.path.join(CACHE, 'voices-v1.0.bin'))

def load_line(key, sr=24000):
    for ext in ('wav', 'mp3', 'm4a', 'ogg', 'flac'):
        f = os.path.join(o.audio_dir, f'{key}.{ext}')
        if os.path.exists(f):
            raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'])
            return np.frombuffer(raw, np.float32).copy(), sr
    sys.exit(f'no audio file for {key} in {o.audio_dir} (expected {key}.wav/.mp3/…)')

info = json.loads(subprocess.check_output(['node', '-e', f"""global.window={{}};const E=require({json.dumps(os.path.join(P,'engine.js'))});
const b=E.boards.find(x=>x.id=={json.dumps(o.board)});if(!b){{console.error('no board');process.exit(1)}}const tx={json.dumps(texts)};
console.log(JSON.stringify({{total:b.total,lines:b.fields.filter(f=>f.vo).map(f=>({{key:f.key,t:b.scenes[f.shot].start+(f.vo.at||0),text:(f.key in tx?tx[f.key]:f.def),say:f.say||null,voice:f.vo.voice||null}}))}}))"""]))
lines = sorted(info['lines'], key=lambda l: l['t'])
if not lines: sys.exit(f'{o.board} has no voiceover lines (fields with a vo key)')

def lang_of(v):
    if o.lang: return o.lang
    return {'b': 'en-gb', 'h': 'hi', 'e': 'es', 'f': 'fr-fr', 'i': 'it', 'p': 'pt-br', 'j': 'ja', 'z': 'cmn'}.get(v[0], 'en-us')

def speech_span(x, sr):
    a = np.abs(x); thr = max(1e-3, a.max() * .04); idx = np.where(a > thr)[0]
    return (idx[0] / sr, idx[-1] / sr) if len(idx) else (0, len(x) / sr)

def time_words(text, s0, s1):
    # spread the words over the spoken span, weighted by length, with small pauses at punctuation
    ws = text.split()
    if not ws: return []
    wt = [len(re.sub(r'\W', '', w)) + 1.5 for w in ws]
    gap = [3 if re.search(r'[.!?…]["”’)]*$', w) else 1.6 if re.search(r'[,;:—–]$', w) else 0 for w in ws]
    tot = sum(wt) + sum(gap[:-1]); t = s0; out = []
    for i, w in enumerate(ws):
        d = (s1 - s0) * wt[i] / tot; out.append([w, round(t, 3), round(t + d, 3)]); t += d + (s1 - s0) * (gap[i] / tot if i < len(ws) - 1 else 0)
    return out

SR = 24000; N = int((info['total'] + 1) * SR); track = np.zeros(N, np.float32); out = []; cursor = 0.0
for i, l in enumerate(lines):
    v = l['voice'] or o.voice
    x, sr = load_line(l['key']) if o.audio_dir else K.create(l['say'] or l['text'], voice=v, speed=o.speed, lang=lang_of(v)); x = np.asarray(x, np.float32); SR = sr
    a, b = speech_span(x, sr); t0 = l['t']
    if t0 + a < cursor + .15:
        print(f"  {l['key']}: would overlap the line before; moved from {t0:.2f}s to {cursor + .15 - a:.2f}s. Retime it in boards.js.")
        t0 = cursor + .15 - a
    o0 = int(t0 * sr); seg = x[:max(0, min(len(x), N - o0))]; track[o0:o0 + len(seg)] += seg
    cursor = t0 + b
    if cursor > info['total']: print(f"  {l['key']}: runs past the end of the video ({cursor:.2f}s > {info['total']:.2f}s).")
    out.append({'key': l['key'], 't0': round(t0 + a, 3), 't1': round(t0 + b, 3), 'text': l['text'], 'words': time_words(l['text'], t0 + a, t0 + b)})

track = track[:int(info['total'] * SR)]; pk = np.abs(track).max() or 1; track *= .89 / pk
d = os.path.join(P, 'voice'); os.makedirs(d, exist_ok=True)
sf.write(os.path.join(d, o.board + '.wav'), track, SR)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(d, o.board + '.wav'), '-ac', '1', '-b:a', '64k', os.path.join(d, o.board + '.mp3')], check=True)
json.dump({'voice': o.voice, 'speed': o.speed, 'lines': out}, open(os.path.join(d, o.board + '.json'), 'w'), ensure_ascii=False, indent=1)
for l in out: print(f"  {l['key']:6s} {l['t0']:6.2f}–{l['t1']:6.2f}s  {l['text'][:60]}")
print('wrote voice/' + o.board + '.{mp3,wav,json}')
