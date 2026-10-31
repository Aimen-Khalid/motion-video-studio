#!/usr/bin/env python3
"""Server-side render of one board to MP4 (same frames as the page). Size follows the board: 1920×1080 landscape, 1080×1920 portrait.
usage: render.py PROJECT_DIR BOARD OUT.mp4 [--fps 30] [--size 1920] [--texts texts.json] [--audio mix.wav] [--voice voice/BOARD.wav]
                 [--captions '{"mode":"template","preset":"karaoke","overrides":{"position":"raised"}}'] [--music-vol 1.0] [--voice-vol 1.0]
--captions: the user's choice from db captions/<board> ({mode: designed|off|template, preset, overrides}); default designed.
--voice: mixed over --audio with the music dipping under the voice (sidechain), or used alone.
--music-vol / --voice-vol: the user's volume sliders from db mix/<board> ({music, voice}; 1 = 100%). --music-vol scales --audio, --voice-vol scales --voice.
  For the music slider to leave effects alone, pass audio/music.wav as --audio and mix sfx.wav in yourself, or accept that mix.wav scales as a whole.
Run build_page.py first (it writes engine.js and render.html). Needs playwright + ffmpeg."""
import argparse, asyncio, json, os, subprocess
from playwright.async_api import async_playwright
a = argparse.ArgumentParser(); a.add_argument('project'); a.add_argument('board'); a.add_argument('out')
a.add_argument('--fps', type=int, default=30); a.add_argument('--size', type=int, default=1920, help='long side in px (1920 = 1080p)'); a.add_argument('--texts'); a.add_argument('--audio')
a.add_argument('--voice'); a.add_argument('--captions'); a.add_argument('--music-vol', type=float, default=1.0); a.add_argument('--voice-vol', type=float, default=1.0)
o = a.parse_args()
texts = json.load(open(o.texts)) if o.texts else {}
cap = json.loads(o.captions) if o.captions else {'mode': 'designed'}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--allow-file-access-from-files']); pg = await b.new_page(viewport={'width': 1920, 'height': 1920})
        await pg.goto('file://' + os.path.abspath(os.path.join(o.project, 'render.html'))); await pg.evaluate('document.fonts.ready'); await pg.evaluate('fontsReady()')
        total, vw, vh = await pg.evaluate(f'(b=>[b.total,b.vw,b.vh])(MOTION_ENGINE.boards.find(b=>b.id=={json.dumps(o.board)}))')
        W, H = (o.size, o.size * vh // vw) if vw >= vh else (o.size * vw // vh, o.size)
        W, H = W - W % 2, H - H % 2; await pg.set_viewport_size({'width': W, 'height': H})
        n = int(round(total * o.fps)); sound = o.audio or o.voice; vid = o.out + '.video.mp4' if sound else o.out
        ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(o.fps), '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
                               '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', vid], stdin=subprocess.PIPE)
        for i in range(n):
            await pg.evaluate('([id,t,tx,w,h,c])=>r(id,t,tx,w,h,c)', [o.board, i / o.fps, texts, W, H, cap])
            ff.stdin.write(await pg.screenshot(type='jpeg', quality=94))
            if i % (o.fps * 5) == 0: print(f'frame {i}/{n}', flush=True)
        ff.stdin.close(); ff.wait(); await b.close()
    if sound:
        if o.audio and o.voice:
            ins = ['-i', vid, '-i', o.audio, '-i', o.voice]
            fc = f'[2:a]aresample=44100,volume={o.voice_vol},asplit=2[vo][sc];[1:a]aresample=44100,volume={o.music_vol}[mu];[mu][sc]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=400[duck];[duck][vo]amix=inputs=2:normalize=0[a]'
            mp = ['-filter_complex', fc, '-map', '0:v', '-map', '[a]']
        else:
            ins = ['-i', vid, '-i', sound]; mp = ['-filter_complex', f'[1:a]volume={o.voice_vol if o.voice and not o.audio else o.music_vol}[a]', '-map', '0:v', '-map', '[a]']
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, *mp, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', o.out], check=True)
        os.remove(vid)
    print('wrote', o.out, f'{total}s')
asyncio.run(main())
