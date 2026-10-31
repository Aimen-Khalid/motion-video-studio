#!/usr/bin/env python3
"""Contact sheet: one frame per shot (at 80% of each shot), or at given times. Check this BEFORE publishing.
usage: sheet.py PROJECT_DIR BOARD OUT.png [t1 t2 ...]"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright
P, board, out = sys.argv[1:4]; ts = [float(x) for x in sys.argv[4:]]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720})
        await pg.goto('file://' + os.path.abspath(os.path.join(P, 'render.html'))); await pg.evaluate('document.fonts.ready')
        times = ts or await pg.evaluate(f'MOTION_ENGINE.boards.find(b=>b.id=={json.dumps(board)}).scenes.map(s=>s.start+s.d*.8)')
        html = await pg.evaluate('([id,ts])=>ts.map(t=>MOTION_ENGINE.frame(id,t,{},{fonts:!!window.MOTION_FONTCSS})).join("")', [board, times])
        cols = 3 if await pg.evaluate(f'MOTION_ENGINE.boards.find(b=>b.id=={json.dumps(board)}).aspect')=='landscape' else 6
        await pg.evaluate('([h,c])=>{const s=document.getElementById("s");s.style.cssText=`width:1280px;display:grid;grid-template-columns:repeat(${c},1fr);gap:4px`;s.innerHTML=h;s.querySelectorAll("svg").forEach(x=>x.style.cssText="width:100%;height:auto;display:block")}', [html, cols])
        await pg.locator('#s').screenshot(path=out); await b.close(); print('wrote', out)
asyncio.run(main())
