/* motion-video-studio engine core.
   Every frame is a pure function of (board, time, texts), so the live preview, the in-browser
   MP4 render and the server render (render.py) produce identical frames.
   Coordinate space: 160×90 viewBox for landscape boards, 90×160 for portrait (board.aspect:'portrait'). Boards are spliced in at the BOARDS marker by build_page.py. */
(function(){
const cl=x=>Math.max(0,Math.min(1,x)), pr=(t,a,b)=>cl((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3), eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let VW=160,VH=90; // current board's frame: 160×90 landscape or 90×160 portrait (set per frame)
const T=(x,y,s,txt,fill,w=800,anchor='middle',fam='Inter',extra='',maxW=VW-12)=>{s=Math.min(s,maxW/(Math.max(1,String(txt??'').length)*(w>=800?.62:.55)));return `<text x="${x}" y="${y}" font-family="${fam},system-ui,sans-serif" font-size="${s.toFixed(2)}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(txt)}</text>`};
const G=(op,inner,tr='')=>`<g opacity="${op.toFixed(3)}" ${tr?`transform="${tr}"`:''}>${inner}</g>`;
const BG=c=>`<rect x="-10" y="-10" width="${VW+20}" height="${VH+20}" fill="${c}"/>`;
const typeOn=(s,p)=>String(s??'').slice(0,Math.round(String(s??'').length*p));
const fmtNum=(v,src)=>{const dec=(src.split('.')[1]||'').length;let o=v.toFixed(dec);if(src.includes(',')){const [a,b]=o.split('.');o=a.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(b?'.'+b:'')}return o};
const countAll=(str,p)=>String(str??'').replace(/\d[\d,]*(\.\d+)?/g,m=>fmtNum(parseFloat(m.replace(/,/g,''))*eo(p),m));
const countFirst=(str,p)=>{let done=false;return String(str??'').replace(/\d[\d,]*(\.\d+)?/,m=>fmtNum(parseFloat(m.replace(/,/g,''))*eo(p),m))};
const draw=(d,p,stroke,w=.8,extra='')=>`<path d="${d}" pathLength="1" stroke-dasharray="${cl(p).toFixed(3)} 1" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const iso=(x,ground,h,c1='#87c5ff',c2='#0a76db',c3='#0960c1')=>{const y=ground-6-h;return `<polygon points="${x},${y} ${x+12},${y-6} ${x+24},${y} ${x+12},${y+6}" fill="${c1}"/><polygon points="${x},${y} ${x+12},${y+6} ${x+12},${y+6+h} ${x},${y+h}" fill="${c2}"/><polygon points="${x+24},${y} ${x+12},${y+6} ${x+12},${y+6+h} ${x+24},${y+h}" fill="${c3}"/>`};
const P=(lon,lat)=>[(lon+180)/360*160,(90-lat)/180*90];
let MAP=null;const mapField=()=>{if(MAP)return MAP;let s='';for(let y=8;y<86;y+=3)for(let x=3;x<160;x+=3){const lon=x/160*360-180,lat=90-y/90*180;const land=(lon>-125&&lon<-65&&lat>15&&lat<55)||(lon>-80&&lon<-35&&lat<12&&lat>-50)||(lon>-10&&lon<40&&lat>36&&lat<62)||(lon>-17&&lon<50&&lat<35&&lat>-33)||(lon>40&&lon<140&&lat>8&&lat<60)||(lon>113&&lon<153&&lat<-12&&lat>-38);if(land)s+=`<circle cx="${x}" cy="${y}" r=".55" fill="#1d3557"/>`}return MAP=s};
const arcD=(a,b)=>{const mx=(a[0]+b[0])/2,my=Math.min(a[1],b[1])-Math.abs(a[0]-b[0])*.35;return `M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`};
const pin=(p,k,label,dx=0,dy=-3.2,anchor='middle')=>{const s=eo(k);return G(s,`<circle cx="${p[0]}" cy="${p[1]}" r="${1.4*s}" fill="#87c5ff"/><circle cx="${p[0]}" cy="${p[1]}" r="${3*s}" fill="none" stroke="#87c5ff" stroke-opacity=".4" stroke-width=".5"/>`+(label?T(p[0]+dx,p[1]+dy,3.6,label,'#ffffff',600,anchor):''))};
const split=s=>String(s??'').split(/\s*·\s*/).filter(Boolean);
// Logo: window.MOTION_LOGO = {inner, vb:[w,h], ink}; '__INK__' in inner is the recolourable main colour.
const LOGO=(x,y,w,ink)=>{const L=(typeof window!=='undefined'&&window.MOTION_LOGO)||{inner:'',vb:[4,1],ink:'#000'};const h=w*L.vb[1]/L.vb[0];return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${L.vb[0]} ${L.vb[1]}" overflow="visible">${L.inner.split('__INK__').join(ink||L.ink)}</svg>`};

/*BOARDS*/

if(typeof ORDER!=='undefined'){const _all=boards.splice(0);ORDER.forEach(id=>{const b=_all.find(x=>x.id===id);if(b)boards.push(b)})}
boards.forEach(b=>{b.aspect=b.aspect==='portrait'?'portrait':'landscape';[b.vw,b.vh]=b.aspect==='portrait'?[90,160]:[160,90];let a=0;b.scenes.forEach(s=>{s.start=a;a+=s.d});b.total=a;b.defaults=Object.fromEntries(b.fields.map(f=>[f.key,f.def]))});
// ---- voiceover + captions ----
// Voice data per board: window.MOTION_VOICE[boardId] = {lines:[{key,t0,t1,text,words:[[w,s,e]]}]} (from voiceover.py, embedded by build_page.py).
// Captions follow the voice word by word. If a line's text was edited after it was voiced, its words are re-spread over the same span.
const spread=(text,s0,s1)=>{const ws=String(text??'').split(/\s+/).filter(Boolean);if(!ws.length)return [];const wt=ws.map(w=>w.replace(/\W/g,'').length+1.5),tot=wt.reduce((a,b)=>a+b,0);let t=s0;return ws.map((w,i)=>{const d=(s1-s0)*wt[i]/tot,o=[w,t,t+d];t+=d;return o})};
const voiceOf=b=>(typeof window!=='undefined'&&window.MOTION_VOICE&&(window.MOTION_VOICE[b.id]||(b.variantOf&&window.MOTION_VOICE[b.variantOf])))||null;
const lineWords=(L,x)=>{const tx=L.key in x?x[L.key]:L.text;return tx===L.text?L.words:spread(tx,L.t0,L.t1)};
function voiceAt(b,V,t,x){if(!V||!V.lines)return null;const L=V.lines.find(l=>t>=l.t0-.12&&t<=l.t1+.4);if(!L)return null;const words=lineWords(L,x);if(!words.length)return null;
  let i=0;words.forEach((w,j)=>{if(w[1]<=t)i=j});
  // chunks of up to 6 words, breaking after punctuation, so a caption never gets too long
  const chunks=[];let cur=[];words.forEach((w,j)=>{cur.push(j);if(cur.length>=6||/[.!?,;:…—]["”’)]*$/.test(w[0])){chunks.push(cur);cur=[]}});if(cur.length)chunks.push(cur);
  const ch=chunks.find(c=>c.includes(i))||chunks[0];return {key:L.key,words,i,chunk:ch.map(j=>words[j]),ci:ch.indexOf(i),t0:L.t0,t1:L.t1,cs:words[ch[0]][1],ce:words[ch[ch.length-1]][2],t}}
// Default designed caption: a clean lower caption with the spoken word lit. A board can design its own with cap:(c,x)=>svg.
const CAPTION=(b,c)=>{const pt=VH>VW,s=b.capSize||(pt?4.6:4.2),y=b.capY!=null?b.capY:(pt?VH-30:VH-8.5),acc=b.capAccent||'#FFD84D',fam=b.capFont||'Inter';
  const txt=c.chunk.map(w=>w[0]).join(' ');let fs=Math.min(s,(VW-18)/(Math.max(1,txt.length)*.55));const w=txt.length*fs*.55+fs*1.6,h=fs*1.75;
  const op=Math.min(pr(c.t,c.cs-.12,c.cs+.05),1-pr(c.t,c.ce+.25,c.ce+.4));
  return G(op,`<rect x="${(VW-w)/2}" y="${y-h*.72}" width="${w}" height="${h}" rx="${h*.3}" fill="#000" fill-opacity=".62"/><text x="${VW/2}" y="${y}" font-family="${fam},'Noto Nastaliq Urdu',system-ui,sans-serif" font-size="${fs.toFixed(2)}" font-weight="800" text-anchor="middle">${c.chunk.map((wd,j)=>`<tspan fill="${j===c.ci&&c.t<=wd[2]+.3?acc:'#fff'}">${esc(wd[0])}</tspan>`).join(' ')}</text>`)};
function captionWords(id,texts){const b=boards.find(x=>x.id===id),V=voiceOf(b);if(!V)return [];const x={...b.defaults,...(texts||{})};return V.lines.flatMap(L=>lineWords(L,x).map(w=>({text:w[0],s:w[1],e:w[2]})))}
function frame(id,t,texts,opts){const b=boards.find(x=>x.id===id);VW=b.vw;VH=b.vh;const x={...b.defaults,...(texts||{})};t=Math.max(0,Math.min(b.total-1e-4,t));
  let i=b.scenes.findIndex(s=>t<s.start+s.d);if(i<0)i=b.scenes.length-1;const s=b.scenes[i],lt=t-s.start;
  let op=1;if(b.fade){if(i>0)op=Math.min(op,pr(lt,0,.35));if(i<b.scenes.length-1)op=Math.min(op,1-pr(lt,s.d-.35,s.d))}
  const size=opts&&opts.w?` width="${opts.w}" height="${opts.h}"`:'',fonts=opts&&opts.fonts&&typeof window!=='undefined'&&window.MOTION_FONTCSS?`<defs><style>${window.MOTION_FONTCSS}</style></defs>`:'';
  const mode=opts&&opts.captions!=null?opts.captions:'designed';let cap='';if(mode==='designed'){const c=voiceAt(b,voiceOf(b),t,x);if(c)cap=b.cap?b.cap(c,x):CAPTION(b,c)}
  return `<svg viewBox="0 0 ${VW} ${VH}"${size} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${fonts}${BG(b.bg)}${G(op,s.f(lt,x),b.push?`translate(${VW/2} ${VH/2}) scale(${(1+.025*lt/s.d).toFixed(4)}) translate(${-VW/2} ${-VH/2})`:'')}${cap}</svg>`}
function cues(id,texts){const b=boards.find(x=>x.id===id),x={...b.defaults,...(texts||{})},out=[];b.scenes.forEach(s=>{if(s.c)s.c(x).forEach(([t,type])=>out.push([+(s.start+t).toFixed(3),type]))});return out.sort((a,b)=>a[0]-b[0])}
const api={boards,frame,cues,captionWords,voiceOf};
if(typeof window!=='undefined')window.MOTION_ENGINE=api;if(typeof module!=='undefined')module.exports=api;
})();
