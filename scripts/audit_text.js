// Transcript coverage check. Fills every field with a marker, scans frames every 0.1s, and lists on-screen text that
// is neither from a transcript field nor on the board's `chrome` allow-list. Exit code 1 if anything is uncovered.
// usage: node audit_text.js PROJECT_DIR BOARD
const path=require('path');global.window={};const E=require(path.resolve(process.argv[2],'engine.js'));const id=process.argv[3];
const b=E.boards.find(x=>x.id===id);if(!b){console.error('no board',id);process.exit(2)}
const tx=Object.fromEntries(b.fields.map(f=>[f.key,'§'+f.key]));const seen=new Map();const chrome=b.chrome||[];
const ok=s=>s.includes('§')||chrome.some(c=>c instanceof RegExp?c.test(s):c===s);
for(let t=0;t<b.total;t+=0.1){const svg=E.frame(id,t,tx);
  for(const m of svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)){const s=m[1].replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
    if(s&&!ok(s)){const sc=b.scenes.find(c=>t<c.start+c.d)||b.scenes.at(-1);seen.set(s,sc.name)}}}
const full=[...seen.keys()].filter(s=>![...seen.keys()].some(o=>o!==s&&o.startsWith(s)));
console.log(`${b.id}: ${b.fields.length} transcript fields. Uncovered on-screen text: ${full.length}`);full.forEach(s=>console.log(`  [${seen.get(s)}] ${s}`));process.exit(full.length?1:0);
