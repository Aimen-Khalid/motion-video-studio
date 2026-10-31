/* Arbisoft example: 6 drafts + 1 polished final. Uses engine-core helpers. */
const city={Lahore:P(74.3,31.5),Riyadh:P(46.7,24.7),Doha:P(51.5,25.3),Berlin:P(13.4,52.5),Plano:P(-96.7,33)};

const boards=[
{id:'kinetic-type',meta:{style:"Kinetic type on white",lands:"UI blocks built from a sketch fold into the wordmark",mood:"Crisp, witty",best:"Social, site hero loop"},tab:'Kinetic Type',name:'Imagine → Build',bg:'#ffffff',fade:true,
 pitch:'The footer line “If you can imagine it, we can build it” becomes the whole film. A cursor types the promise, a sketch turns into clean UI blocks, and the blocks fold into the wordmark.',
 chips:['Kinetic type','White ground','Plucky electronic, ~110 bpm','Snappy ease-out'],
 fields:[
  {key:'k_line1',shot:1,label:'The promise',def:'If you can imagine it,'},
  {key:'k_line2',shot:3,label:'Build',def:'we can build it.'},
  {key:'k_p1',shot:4,label:'How we work · 1',def:'Design.'},
  {key:'k_p2',shot:4,label:'How we work · 2',def:'Open Source.'},
  {key:'k_p3',shot:4,label:'How we work · 3',def:'AI.'},
  {key:'k_proof',shot:5,label:'Proof strip',def:'SINCE 2007 · 750+ EXPERTS · 500M+ PEOPLE SERVED'},
  {key:'k_url',shot:6,label:'Lockup',def:'arbisoft.com'}],
 scenes:[
  {d:3,name:'Cursor',f:(t,x)=>Math.floor(t*2.2)%2==0?`<rect x="79" y="38" width="2" height="14" fill="#0a76db"/>`:''},
  {d:4,name:'The promise',f:(t,x)=>{const full=String(x.k_line1),W=full.length*4.1,x0=80-W/2,s=typeOn(full,pr(t,.2,2.3));return T(x0,48,8.5,s,'#6b7280',700,'start','Nunito')+`<rect x="${x0+s.length*4.1+.8}" y="40" width="1.4" height="10" fill="#0a76db" opacity="${t<2.6||Math.floor(t*2.2)%2==0?1:0}"/>`+`<line x1="${x0}" y1="51.5" x2="${x0+W*eo(pr(t,2.6,3.4))}" y2="51.5" stroke="#f37224" stroke-width="1.2" stroke-linecap="round"/>`}},
  {d:4,name:'Sketch',f:(t,x)=>{const r=[[38,22,40,26],[84,22,38,12],[84,38,18,10],[38,54,84,12]];return G(1-pr(t,0,.8),T(80,14,5,x.k_line1,'#9aa3af',700,'middle','Nunito'))+r.map(([a,b,w,h],i)=>draw(`M${a},${b}h${w}v${h}h${-w}z`,pr(t,.3+i*.4,1.1+i*.4),'#949698',.7)).join('')+draw('M44 30 q6 -6 12 0 t12 0 t10 2',pr(t,2,3),'#f37224',1)}},
  {d:5,name:'Build',f:(t,x)=>{const r=[[22,18,34,20,'#0a76db'],[22,41,16,10,'#6c98c9'],[41,41,15,10,'#05193b'],[22,54,34,6,'#e1e9ef']];const s=eo(pr(t,1.4,1.9));return r.map(([a,b,w,h,c],i)=>{const p=eo(pr(t,.1+i*.22,.6+i*.22));return G(p,`<rect x="${a}" y="${b+(1-p)*6}" width="${w}" height="${h}" rx="2" fill="${c}"/>`)}).join('')+G(s,T(0,0,10,x.k_line2,'#05193b',900),`translate(110 47) scale(${1.5-.5*s})`)}},
  {d:6,name:'How we work',f:(t,x)=>{const i=Math.min(2,Math.floor(t/2)),w=[x.k_p1,x.k_p2,x.k_p3],bg=['#0a76db','#05193b','#0a76db'][i],q=eo(pr(t%2,0,.3));return BG(bg)+G(q,T(0,0,16,w[i],'#ffffff',900),`translate(80 52) scale(${1.3-.3*q})`)+w.map((s,j)=>T(40+j*40,76,4.2,s,j==i?'#f37224':'#ffffff',800,'middle','Inter',`opacity="${j==i?1:.45}"`)).join('')}},
  {d:5,name:'Proof strip',f:(t,x)=>{const p=eo(pr(t,0,.5));return `<rect x="${-160*(1-p)}" y="38" width="160" height="14" fill="#05193b"/>`+G(pr(t,.4,.8),T(80,47,5,countAll(x.k_proof,pr(t,.5,3)),'#ffffff',800))}},
  {d:3,name:'Lockup',f:(t,x)=>{const p=eo(pr(t,0,.9));return G(p,LOGO(40,33,80),`translate(80 45) scale(${.85+.15*p}) translate(-80 -45)`)+G(pr(t,.9,1.5),T(80,66,4.5,x.k_url,'#949698',600,'middle','Nunito'))}}]},

{id:'3d-pillars',meta:{style:"Isometric 3D on navy",lands:"Design, Open Source and AI pillars lift a platform",mood:"Confident, cinematic",best:"Pitches, events"},tab:'3D Pillars',name:'Three Pillars',bg:'#05193b',fade:true,
 pitch:'Built on the site’s own structure: lead with design, leverage open source, accelerate with AI. Each pillar rises as an isometric block with its proof, and together they lift a platform labelled with the client’s product.',
 chips:['Isometric 3D','Navy night','Cinematic electronic','Slow camera push'],
 fields:[
  {key:'b_head',shot:0,label:'Opening line',def:'Engineering software solutions since 2007'},
  {key:'b_lead',shot:1,label:'The slot',def:'We lead with'},
  {key:'b_p1',shot:2,label:'Pillar 1 name',def:'Design'},
  {key:'b_principles',shot:2,label:'Pillar 1 proof',def:'Timely · Useful · Delightful'},
  {key:'b_p2',shot:3,label:'Pillar 2 name',def:'Open Source'},
  {key:'b_os',shot:3,label:'Pillar 2 proof',def:'3,000+ pull requests to Open edX'},
  {key:'b_p3',shot:4,label:'Pillar 3 name',def:'AI'},
  {key:'b_ai',shot:4,label:'Pillar 3 proof',def:'Stack Modernization · AI Gateways · Enterprise AI'},
  {key:'b_platform',shot:5,label:'The platform',def:'your product'},
  {key:'b_tag',shot:6,label:'Lockup tagline',def:'If you can imagine it, we can build it.'}],
 scenes:[
  {d:4,name:'The line',f:(t,x)=>`<line x1="10" y1="50" x2="${10+140*eo(pr(t,.2,1.4))}" y2="50" stroke="#0a76db" stroke-width="1"/>`+G(pr(t,1.1,1.9),T(80,44,6,x.b_head,'#ffffff',800))},
  {d:4,name:'The slot',f:(t,x)=>{const words=[x.b_p3,x.b_p2,x.b_p1],off=eio(pr(t,.5,2.6))*30;return T(66,49,9,x.b_lead,'#ffffff',800,'end','Inter','',58)+`<rect x="70" y="38.5" width="64" height="15" rx="2" fill="#0a76db"/><clipPath id="slot"><rect x="70" y="38.5" width="64" height="15"/></clipPath><g clip-path="url(#slot)">${words.map((w,i)=>T(102,49+i*15-off,9,w,'#ffffff',900,'middle','Inter','',60)).join('')}</g>`}},
  {d:10,name:'Pillar 1',f:(t,x)=>{const h=26*eo(pr(t,.2,1.6)),sp=eo(pr(t,1.6,2.8)),pr1=split(x.b_principles);return iso(30,70,h)+G(pr(t,.8,1.6),T(42,22,5,x.b_p1,'#87c5ff',800))+G(sp,`<rect x="74" y="${24+(1-sp)*4}" width="56" height="34" rx="2" fill="#0d3f8a"/><rect x="78" y="${28+(1-sp)*4}" width="22" height="12" rx="1" fill="#0a76db"/><rect x="78" y="${43+(1-sp)*4}" width="${48*eo(pr(t,2.4,3.4))}" height="4" rx="1" fill="#87c5ff" opacity=".5"/><rect x="78" y="${50+(1-sp)*4}" width="${30*eo(pr(t,2.7,3.7))}" height="4" rx="1" fill="#87c5ff" opacity=".3"/>`)+pr1.map((w,i)=>G(eo(pr(t,3.8+i*.9,4.5+i*.9)),T(102,68+i*6,4.6,w.toUpperCase(),'#ffffff',700,'middle','Inter','',56))).join('')}},
  {d:10,name:'Pillar 2',f:(t,x)=>{const pts=[[82,58],[92,50],[102,52],[112,40],[122,42],[134,30]],gp=pr(t,1.4,4);return iso(18,72,24)+iso(46,72,30*eo(pr(t,.2,1.4)))+G(pr(t,.8,1.6),T(58,24,5,x.b_p2,'#87c5ff',800))+draw('M'+pts.map(p=>p.join(',')).join(' L'),gp,'#f37224',1)+pts.map((p,i)=>{const k=eo(pr(t,1.4+i*.43,1.7+i*.43));return `<circle cx="${p[0]}" cy="${p[1]}" r="${1.6*k}" fill="#f37224"/>`}).join('')+G(pr(t,3.6,4.2),T(110,72,5,countFirst(x.b_os,pr(t,3.6,6.5)),'#ffffff',800,'middle','Inter','',62))}},
  {d:10,name:'Pillar 3',f:(t,x)=>{const nodes=[[110,30],[130,22],[132,44],[146,36]],edges=[[0,1],[0,2],[1,3],[2,3],[0,3]];return iso(14,72,20)+iso(40,72,26)+iso(66,72,32*eo(pr(t,.2,1.4)))+G(pr(t,.8,1.6),T(78,22,5,x.b_p3,'#87c5ff',800))+edges.map(([a,b],i)=>draw(`M${nodes[a]} L${nodes[b]}`,pr(t,1.8+i*.3,2.4+i*.3),'#87c5ff',.5,'opacity=".7"')).join('')+nodes.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${(2+.6*Math.sin(t*3+i))*eo(pr(t,1.5+i*.2,1.9+i*.2))}" fill="#f37224"/>`).join('')+split(x.b_ai).map((w,i)=>G(eo(pr(t,4+i*.9,4.7+i*.9)),T(128,60+i*6,4.2,w.toUpperCase(),'#ffffff',700,'middle','Inter','',60))).join('')}},
  {d:4,name:'The platform',f:(t,x)=>{const p=eo(pr(t,.2,1.2));return iso(40,74,16)+iso(68,74,16)+iso(96,74,16)+G(p,`<polygon points="34,28 80,6 126,28 80,50" fill="#ffffff" opacity=".93"/>`+T(80,30,6,x.b_platform,'#05193b',900,'middle','Inter','',60),`translate(0 ${-(1-p)*30})`)}},
  {d:3,name:'Lockup',f:(t,x)=>G(eo(pr(t,0,.9)),LOGO(44,30,72,'#ffffff'))+G(pr(t,.9,1.6),T(80,62,4.6,x.b_tag,'#87c5ff',600,'middle','Nunito'))}]},

{id:'data-cuts',meta:{style:"Bold data cuts on blue",lands:"Counters climb, each fact hard-cut on the beat",mood:"Punchy, proof-heavy",best:"LinkedIn, sales decks"},tab:'Data Cuts',name:'By the Numbers',bg:'#0a76db',fade:false,
 pitch:'No metaphors, only proof. Every shot is one number from arbisoft.com, counted up and hard-cut on the beat, each with its own simple graphic. Built to work muted in a feed.',
 chips:['Data motion','Blue + orange','Percussive, 124 bpm','Hard cuts'],
 fields:[
  {key:'c_open',shot:0,label:'Opener',def:'Since 2007'},
  {key:'c1n',shot:1,label:'Stat 1 number',def:'19+'},{key:'c1l',shot:1,label:'Stat 1 label',def:'years of market experience'},
  {key:'c2n',shot:2,label:'Stat 2 number',def:'750+'},{key:'c2l',shot:2,label:'Stat 2 label',def:'experts in engineering, data, AI, design & QA'},
  {key:'c3n',shot:3,label:'Stat 3 number',def:'550+'},{key:'c3l',shot:3,label:'Stat 3 label',def:'collaborations across six verticals'},
  {key:'c4n',shot:4,label:'Stat 4 number',def:'3,000+'},{key:'c4l',shot:4,label:'Stat 4 label',def:'pull requests to Open edX'},
  {key:'c5n',shot:5,label:'Stat 5 number',def:'500M+'},{key:'c5l',shot:5,label:'Stat 5 label',def:'people served by products we helped build'},
  {key:'c6n',shot:6,label:'Stat 6 number',def:'4.9/5'},{key:'c6l',shot:6,label:'Stat 6 label',def:'on Clutch'},
  {key:'c_url',shot:7,label:'Lockup',def:'arbisoft.com'}],
 scenes:[
  {d:3,name:'Opener',f:(t,x)=>{const q=eo(pr(t,0,.35));return G(q,T(0,0,20,x.c_open,'#ffffff',900),`translate(80 52) scale(${1.4-.4*q})`)+`<rect x="40" y="62" width="${80*eo(pr(t,.6,2.6))}" height="1.6" fill="#f37224"/>`}},
  {d:3.5,name:'Years',f:(t,x)=>BG('#0a76db')+T(80,54,30,countFirst(x.c1n,pr(t,0,1.4)),'#ffffff',900)+G(pr(t,.6,1.2),T(80,68,4.8,String(x.c1l).toUpperCase(),'#ffffff',700))},
  {d:4,name:'People',f:(t,x)=>{const n=Math.floor(270*eo(pr(t,0,2.4)));let s=BG('#05193b'),k=0;for(let j=0;j<9;j++)for(let i=0;i<30;i++){s+=`<circle cx="${9+i*4.8}" cy="${10+j*4.6}" r="1.1" fill="${k<n?'#f37224':'#1d3557'}"/>`;k++}return s+T(80,66,14,countFirst(x.c2n,pr(t,0,2.4)),'#ffffff',900)+G(pr(t,.8,1.4),T(80,76,4,String(x.c2l).toUpperCase(),'#87c5ff',700))}},
  {d:4,name:'Collaborations',f:(t,x)=>{let s=BG('#0a76db');for(let i=0;i<6;i++){const p=eo(pr(t,.1+i*.25,.4+i*.25));s+=`<circle cx="80" cy="42" r="24" fill="none" stroke="#ffffff" stroke-opacity="${p}" stroke-width="6" stroke-dasharray="${21*p} 200" stroke-dashoffset="${-i*25.13}" transform="rotate(-90 80 42)"/>`}return s+T(80,46,11,countFirst(x.c3n,pr(t,0,1.8)),'#ffffff',900)+G(pr(t,1,1.6),T(80,80,4.4,String(x.c3l).toUpperCase(),'#ffffff',700))}},
  {d:4,name:'Open source',f:(t,x)=>BG('#05193b')+[8,12,10,16,14,20,18,24,22,30,28,36].map((h,i)=>{const hh=h*eo(pr(t,i*.1,.4+i*.1));return `<rect x="${18+i*6}" y="${66-hh}" width="4" height="${hh}" fill="${i==11?'#f37224':'#0a76db'}"/>`}).join('')+T(124,44,11,countFirst(x.c4n,pr(t,0,1.8)),'#ffffff',900,'middle','Inter','',58)+G(pr(t,.8,1.4),T(124,52,3.8,String(x.c4l).toUpperCase(),'#87c5ff',700,'middle','Inter','',60))},
  {d:5,name:'Scale',f:(t,x)=>{let s=BG('#0a76db');const n=Math.floor(220*eo(pr(t,0,2.6)));for(let i=0;i<n;i++){const a=i*2.399,r=Math.sqrt(i/220)*28;s+=`<circle cx="${48+r*Math.cos(a+t*.2)}" cy="${45+r*Math.sin(a+t*.2)}" r=".9" fill="#ffffff" opacity="${(.35+.65*(1-r/28)).toFixed(2)}"/>`}return s+T(116,48,13,countFirst(x.c5n,pr(t,0,2.6)),'#ffffff',900,'middle','Inter','',72)+G(pr(t,1,1.6),T(116,57,3.6,String(x.c5l).toUpperCase(),'#ffffff',700,'middle','Inter','',76))}},
  {d:3.5,name:'Rating',f:(t,x)=>BG('#05193b')+[0,1,2,3,4].map(i=>{const k=eo(pr(t,.1+i*.25,.35+i*.25));return G(k*(i==4?.75:1),T(0,0,14,'★','#f37224',900),`translate(${48+i*16} 47) scale(${1.6-.6*k})`)}).join('')+G(pr(t,1.4,1.9),T(80,64,7,x.c6n,'#ffffff',900)+T(80,71,3.8,String(x.c6l).toUpperCase(),'#87c5ff',700))},
  {d:3,name:'Lockup',f:(t,x)=>BG('#ffffff')+G(eo(pr(t,0,.7)),LOGO(40,32,80))+G(pr(t,.7,1.2),T(80,64,4.5,x.c_url,'#0a76db',700,'middle','Nunito'))}]},

{id:'map-journey',meta:{style:"Night map, glowing routes",lands:"One dot in Lahore spreads to 7 offices and global clients",mood:"Warm, story-led",best:"Culture, hiring, about page"},tab:'Map Journey',name:'Lahore to the World',bg:'#060e1f',fade:true,
 pitch:'A single glowing dot in Lahore grows into a network: three Pakistani offices, then Riyadh, Doha, Berlin and Plano, then the clients those teams build for. Story first, numbers second.',
 chips:['Night map','Glowing routes','Warm ambient, piano + pads','Long dissolves'],
 fields:[
  {key:'m_origin',shot:0,label:'Origin',def:'Lahore, 2007'},
  {key:'m_home',shot:1,label:'Home network',def:'Lahore · Islamabad · Karachi'},
  {key:'m_global',shot:2,label:'Going global',def:'7 offices · 5 countries'},
  {key:'m_clients',shot:3,label:'Client names',def:'edX · KAYAK · Careem · The World Bank · MIT · Indeed'},
  {key:'m_since',shot:3,label:'Client note',def:'edX partner since 2013'},
  {key:'m_quote',shot:4,label:'Quote',def:'“my most trusted technology partner”'},
  {key:'m_attr',shot:4,label:'Quote attribution',def:'Paul English · KAYAK co-founder · 15+ years'},
  {key:'m_reach',shot:5,label:'The globe',def:'Products serving 500M+ people'},
  {key:'m_cities',shot:6,label:'Lockup cities',def:'Plano · Berlin · Riyadh · Doha · Lahore · Karachi · Islamabad'}],
 scenes:[
  {d:5,name:'Origin',f:(t,x)=>{let s=`<circle cx="80" cy="42" r="${3*eo(pr(t,.2,.8))}" fill="#87c5ff"/>`;for(let i=0;i<3;i++){const ph=((t*.5+i/3)%1);s+=`<circle cx="80" cy="42" r="${4+ph*16}" fill="none" stroke="#87c5ff" stroke-width=".6" stroke-opacity="${(.6*(1-ph)*pr(t,.6,1.2)).toFixed(2)}"/>`}return s+G(pr(t,1.4,2.2),T(80,70,6,x.m_origin,'#ffffff',800))}},
  {d:7,name:'Home network',f:(t,x)=>{const L=[90,40],I=[82,20],K=[58,70],n=split(x.m_home);return draw('M90 40 Q86 28 82 20',pr(t,.5,1.8),'#f37224',.9)+draw('M90 40 Q76 56 58 70',pr(t,1.4,2.8),'#f37224',.9)+pin(L,pr(t,0,.5),n[0]||'',6,1,'start')+pin(I,pr(t,1.7,2.1),n[1]||'',6,1,'start')+pin(K,pr(t,2.7,3.1),n[2]||'',6,1,'start')}},
  {d:10,name:'Going global',f:(t,x)=>{const dest=[['Riyadh',city.Riyadh,''],['Doha',city.Doha,''],['Berlin',city.Berlin,'Berlin'],['Plano',city.Plano,'Plano']];return G(pr(t,0,1.2),mapField())+dest.map(([n,p,l],i)=>draw(arcD(city.Lahore,p),pr(t,1.2+i*.9,2.4+i*.9),'#f37224',.8)+pin(p,pr(t,2.3+i*.9,2.7+i*.9),l)).join('')+pin(city.Lahore,pr(t,.6,1),'Lahore',0,5)+G(pr(t,5.5,6.3),T(80,84,4.6,String(x.m_global).toUpperCase(),'#87c5ff',700))}},
  {d:10,name:'Who we build with',f:(t,x)=>{const pos=[[30,24],[64,16],[104,40],[44,60],[126,22],[100,70],[20,44],[136,58]];return G(.6,mapField())+split(x.m_clients).slice(0,8).map((n,i)=>{const k=eo(pr(t,.4+i*.8,1+i*.8)),[px,py]=pos[i];return G(k,`<circle cx="${px}" cy="${py+3}" r="1" fill="#f37224"/>`+T(px,py,5,n,'#ffffff',800),`translate(${px} ${py}) scale(${.8+.2*k}) translate(${-px} ${-py})`)}).join('')+G(pr(t,6,6.8),T(80,86,4,String(x.m_since).toUpperCase(),'#87c5ff',600))}},
  {d:6,name:'In their words',f:(t,x)=>{const q=String(x.m_quote),mid=q.lastIndexOf(' ',Math.ceil(q.length/2)+3),a=mid>0?q.slice(0,mid):q,b=mid>0?q.slice(mid+1):'',p=pr(t,.3,3);const ta=typeOn(a,cl(p*(q.length)/Math.max(1,a.length))),tb=typeOn(b,cl((p*q.length-a.length)/Math.max(1,b.length)));return T(80,42,7,ta,'#ffffff',800)+T(80,52,7,tb,'#ffffff',800)+G(pr(t,3.2,3.9),T(80,64,4,String(x.m_attr).toUpperCase(),'#87c5ff',600))}},
  {d:4,name:'The globe',f:(t,x)=>{const g=eo(pr(t,0,.8));return G(g,`<circle cx="80" cy="42" r="26" fill="#0d1a2e" stroke="#0a76db" stroke-width=".8"/>`+[0,1,2].map(i=>`<ellipse cx="80" cy="42" rx="${Math.abs(26*Math.cos(t*.8+i*1.05)).toFixed(2)}" ry="26" fill="none" stroke="#0a76db" stroke-width=".35"/>`).join('')+`<ellipse cx="80" cy="42" rx="26" ry="9" fill="none" stroke="#0a76db" stroke-width=".35"/>`+draw('M66 32 Q80 18 96 34',pr(t,.6,1.6),'#f37224',.8)+draw('M70 52 Q86 40 98 50',pr(t,1,2),'#f37224',.8))+G(pr(t,1.4,2),T(80,80,5.6,String(x.m_reach).toUpperCase(),'#ffffff',900))}},
  {d:3,name:'Lockup',f:(t,x)=>G(eo(pr(t,0,.9)),LOGO(44,30,72,'#ffffff'))+G(pr(t,.9,1.6),T(80,62,3.4,String(x.m_cities).toUpperCase(),'#87c5ff',600))}]},{id:'code-to-product',meta:{style:"Terminal and editor UI, dark",lands:"A build log turns into product screens; the cursor becomes the logo",mood:"Smart, engineer-to-engineer",best:"Tech audiences, developer hiring"},tab:'Code to Product',name:'From Terminal to Product',bg:'#0b1220',fade:true,
 pitch:'An engineering story told in an engineer’s language. A terminal types a command, code streams past, and the build turns into real product screens across Arbisoft’s industries. Tests pass as proof points, and the cursor becomes the logo.',
 chips:['Terminal + UI','Dark editor theme','Glitchy electronic, ~120 bpm','Type-on and snap'],
 fields:[
  {key:'t_cmd',shot:0,label:'Command',def:'arbisoft build --idea "your product"'},
  {key:'t_build',shot:1,label:'Build log',def:'Design-led · open source · AI-accelerated'},
  {key:'t_ship',shot:2,label:'Ship line',def:'From idea to product'},
  {key:'t_ind',shot:3,label:'Industries',def:'Education · Travel · Healthcare · Finance'},
  {key:'t_checks',shot:4,label:'Passing checks',def:'3,000+ open-source PRs · 550+ collaborations · ISO 27701 & 9001 certified'},
  {key:'t_tag',shot:5,label:'Lockup tagline',def:'If you can imagine it, we can build it.'}],
 scenes:[
  {d:4,name:'Command',f:(t,x)=>{const w=eo(pr(t,0,.6));return G(w,`<rect x="14" y="16" width="132" height="58" rx="3" fill="#111a2c" stroke="#1f3048" stroke-width=".6"/><rect x="14" y="16" width="132" height="7" rx="3" fill="#18243a"/>`+['#f37224','#87c5ff','#6c98c9'].map((c,i)=>`<circle cx="${19+i*4}" cy="19.5" r="1.1" fill="${c}"/>`).join(''),`translate(80 45) scale(${.92+.08*w}) translate(-80 -45)`)+T(20,34,4.6,'$ '+typeOn(x.t_cmd,pr(t,.7,2.8)),'#e8eef7',600,'start','JetBrains Mono','',120)+(Math.floor(t*2.4)%2==0?`<rect x="${20+(2+typeOn(x.t_cmd,pr(t,.7,2.8)).length)*2.75}" y="30.5" width="2.2" height="4.4" fill="#f37224"/>`:'')}},
  {d:5,name:'Build',f:(t,x)=>{const code=[['import','{ design }','from','"arbisoft"'],['const','team','=','experts(750)'],['await','openSource.contribute()',''],['ai.accelerate(','pipeline',')'],['ship(','product,','{ zeroDowntime: true })']],cols=['#f37224','#87c5ff','#e8eef7','#9ece6a'];let s=`<rect x="14" y="16" width="132" height="58" rx="3" fill="#111a2c" stroke="#1f3048" stroke-width=".6"/>`;code.forEach((ln,i)=>{const k=pr(t,.2+i*.45,.6+i*.45);s+=G(k,T(20,26+i*7,4,typeOn(ln.join(' '),k),cols[i%4],500,'start','JetBrains Mono','',120))});const b=pr(t,2.8,4.6);return s+`<rect x="20" y="64" width="${110*b}" height="2.4" rx="1" fill="#0a76db"/>`+G(pr(t,2.6,3),T(20,61,3.4,'▸ '+String(x.t_build),'#87c5ff',600,'start','JetBrains Mono','',118))}},
  {d:5,name:'Ship',f:(t,x)=>{const m=eio(pr(t,0,1.2));const tw=132-(132-50)*m;let s=`<rect x="14" y="16" width="${tw}" height="58" rx="3" fill="#111a2c" stroke="#1f3048" stroke-width=".6"/>`;s+=G(1-m,T(20,30,4,'✓ build complete','#9ece6a',600,'start','JetBrains Mono'));const ui=[[72,16,74,10,'#0a76db'],[72,30,34,26,'#ffffff'],[110,30,36,12,'#87c5ff'],[110,46,36,10,'#f37224'],[72,60,74,14,'#e1e9ef']];ui.forEach(([a,b,w,h,c],i)=>{const k=eo(pr(t,1+i*.3,1.6+i*.3));s+=G(k,`<rect x="${a}" y="${b+(1-k)*5}" width="${w}" height="${h}" rx="2" fill="${c}"/>`)});s+=G(pr(t,1,1.6),T(39,48,3.6,'npm run ship','#e8eef7',600,'middle','JetBrains Mono'));return s+G(pr(t,2.8,3.4),T(80,84,5.4,x.t_ship,'#ffffff',800))}},
  {d:6,name:'Industries',f:(t,x)=>{const ind=split(x.t_ind).slice(0,4),cols=['#0a76db','#f37224','#6c98c9','#87c5ff'];return ind.map((n,i)=>{const k=eo(pr(t,.2+i*.5,.9+i*.5)),cx=14+i*36;return G(k,`<rect x="${cx}" y="${20+(1-k)*14}" width="30" height="48" rx="3" fill="#111a2c" stroke="${cols[i]}" stroke-width=".7"/><rect x="${cx+3}" y="${24+(1-k)*14}" width="24" height="12" rx="1.5" fill="${cols[i]}"/><rect x="${cx+3}" y="${39+(1-k)*14}" width="24" height="3" rx="1" fill="#1f3048"/><rect x="${cx+3}" y="${44+(1-k)*14}" width="16" height="3" rx="1" fill="#1f3048"/>`+T(cx+15,62+(1-k)*14,3.8,n,'#ffffff',800,'middle','Inter','',28))}).join('')}},
  {d:5,name:'Checks pass',f:(t,x)=>{const c=split(x.t_checks).slice(0,4);return T(20,22,4,'$ arbisoft test --proof','#87c5ff',600,'start','JetBrains Mono','',120)+c.map((n,i)=>{const k=pr(t,.6+i*.7,.9+i*.7);return G(k,T(20,34+i*9,5,'✓','#9ece6a',800,'start','JetBrains Mono')+T(28,34+i*9,5,n,'#e8eef7',700,'start','Inter','',118))}).join('')+G(pr(t,3.6,4),T(20,34+c.length*9+2,3.6,`${c.length} passed`,'#9ece6a',600,'start','JetBrains Mono'))}},
  {d:5,name:'Lockup',f:(t,x)=>{const p=eo(pr(t,.6,1.6));return G(1-pr(t,0,.6),`<rect x="79" y="38" width="2.4" height="12" fill="#f37224" opacity="${Math.floor(t*3)%2?0:1}"/>`)+G(p,LOGO(44,30,72,'#ffffff'),`translate(80 45) scale(${.85+.15*p}) translate(-80 -45)`)+G(pr(t,1.6,2.3),T(80,62,4.6,x.t_tag,'#87c5ff',600,'middle','Nunito'))}}]},

{id:'before-after',meta:{style:"Split screen, legacy grey vs brand blue",lands:"A divider sweeps from legacy to modern until modern fills the frame",mood:"Tension, then release",best:"Stack Modernization sales, enterprise pitches"},tab:'Before / After',name:'Legacy to Modern',bg:'#0d1a2e',fade:true,
 pitch:'The Stack Modernization story as one visual device: a split screen. A tired legacy system on the left, a fast modern product on the right, and an orange divider sweeping between them. Ends with the modern side taking the whole frame.',
 chips:['Split screen','Grey vs brand blue','Tension then release, ~100 bpm','Wipes and slides'],
 fields:[
  {key:'s_old',shot:0,label:'The problem',def:'Legacy systems hold you back.'},
  {key:'s_before',shot:1,label:'Left label',def:'Before'},
  {key:'s_after',shot:1,label:'Right label',def:'After Arbisoft'},
  {key:'s_mod',shot:2,label:'Modernization line',def:'Stack modernization without downtime'},
  {key:'s_pairs',shot:3,label:'Swaps (old → new)',def:'Monolith → Cloud-native · Manual → AI-accelerated · Outdated → Open source'},
  {key:'s_proof',shot:4,label:'Proof',def:'19+ years modernizing for market leaders'},
  {key:'s_tag',shot:5,label:'Lockup tagline',def:'If you can imagine it, we can build it.'}],
 scenes:[
  {d:4,name:'The problem',f:(t,x)=>{const lb=(t*.18)%1;return BG('#c9c4b8')+`<rect x="22" y="14" width="116" height="52" fill="#e6e1d6" stroke="#8a8578" stroke-width=".8"/><rect x="22" y="14" width="116" height="6" fill="#7d7a8c"/>`+T(25,18.6,3.2,'SYSTEM_v2.4.1  [NOT RESPONDING]','#ffffff',600,'start','JetBrains Mono')+`<rect x="34" y="40" width="92" height="5" fill="#ffffff" stroke="#8a8578" stroke-width=".5"/><rect x="34.5" y="40.5" width="${91*Math.min(.38,lb)}" height="4" fill="#7d7a8c"/>`+T(80,36,3.6,'Loading… please wait','#4a4740',600,'middle','JetBrains Mono')+G(pr(t,1.4,2.2),T(80,80,6,x.s_old,'#2b2924',900))}},
  {d:5,name:'The split',f:(t,x)=>{const d=160-80*eio(pr(t,.2,1.6));return BG('#c9c4b8')+`<rect x="10" y="20" width="60" height="44" fill="#e6e1d6" stroke="#8a8578" stroke-width=".7"/><rect x="16" y="28" width="${48*.38}" height="4" fill="#7d7a8c"/><rect x="16" y="36" width="48" height="3" fill="#b5b0a3"/><rect x="16" y="42" width="40" height="3" fill="#b5b0a3"/>`+`<clipPath id="rt"><rect x="${d}" y="0" width="160" height="90"/></clipPath><g clip-path="url(#rt)"><rect width="160" height="90" fill="#0a76db"/><rect x="90" y="20" width="60" height="44" rx="3" fill="#ffffff"/><rect x="95" y="25" width="24" height="12" rx="2" fill="#0a76db"/><rect x="122" y="25" width="23" height="12" rx="2" fill="#f37224"/><rect x="95" y="41" width="50" height="3" rx="1" fill="#e1e9ef"/><rect x="95" y="47" width="36" height="3" rx="1" fill="#e1e9ef"/></g><rect x="${d-.8}" y="0" width="1.6" height="90" fill="#f37224"/>`+G(pr(t,1.6,2.2),T(40,76,5,x.s_before,'#4a4740',800,'middle','Inter','',60)+T(120,76,5,x.s_after,'#ffffff',800,'middle','Inter','',60))}},
  {d:6,name:'Compare',f:(t,x)=>{const d=80+18*Math.sin(t*1.3);const bars=[10,14,9,18,22,27,33];return BG('#c9c4b8')+[0,1,2,3,4,5,6].map(i=>`<rect x="${14+i*8}" y="${62-6-(i%3)*2}" width="5" height="${6+(i%3)*2}" fill="#8a8578"/>`).join('')+T(40,30,4,'Report runs overnight','#4a4740',700,'middle','Inter','',60)+`<clipPath id="rt2"><rect x="${d}" y="0" width="160" height="90"/></clipPath><g clip-path="url(#rt2)"><rect width="160" height="90" fill="#0a76db"/>${bars.map((h,i)=>`<rect x="${92+i*8}" y="${62-h*eo(pr(t,.2+i*.12,.9+i*.12))}" width="5" height="${h*eo(pr(t,.2+i*.12,.9+i*.12))}" rx="1" fill="${i==6?'#f37224':'#ffffff'}"/>`).join('')}${T(120,30,4,'Live in real time','#ffffff',700,'middle','Inter','',60)}</g><rect x="${d-.8}" y="0" width="1.6" height="90" fill="#f37224"/><circle cx="${d}" cy="45" r="3" fill="#f37224"/>`+G(pr(t,1.2,1.8),`<rect x="0" y="72" width="160" height="12" fill="#05193b" opacity=".85"/>`+T(80,80,4.6,x.s_mod,'#ffffff',800))}},
  {d:5,name:'Swaps',f:(t,x)=>{const pairs=split(x.s_pairs).slice(0,3).map(p=>p.split(/\s*→\s*/));return `<rect width="80" height="90" fill="#c9c4b8"/><rect x="80" width="80" height="90" fill="#0a76db"/><rect x="79.2" width="1.6" height="90" fill="#f37224"/>`+pairs.map(([a,b],i)=>{const k=eo(pr(t,.2+i*1.2,.7+i*1.2)),y=26+i*20;return G(k,T(40,y,6,a||'','#4a4740',800,'middle','Inter','',66)+T(120,y,6,b||'','#ffffff',800,'middle','Inter','',66)+T(80,y-.5,5,'→','#f37224',900),`translate(0 ${(1-k)*4})`)}).join('')}},
  {d:5,name:'Modern wins',f:(t,x)=>{const d=80*(1-eio(pr(t,0,1.2)));return `<rect width="${d}" height="90" fill="#c9c4b8"/><rect x="${d}" width="${160-d}" height="90" fill="#0a76db"/><rect x="${d-.8}" width="1.6" height="90" fill="#f37224" opacity="${d>1?1:0}"/>`+G(pr(t,1.2,1.9),T(80,48,8,countFirst(x.s_proof,pr(t,1.2,3)),'#ffffff',900,'middle','Inter','',140))}},
  {d:5,name:'Lockup',f:(t,x)=>BG('#ffffff')+G(eo(pr(t,0,.9)),LOGO(40,32,80))+G(pr(t,.9,1.6),T(80,64,4.6,x.s_tag,'#0a76db',600,'middle','Nunito'))}]}
];

/* ---- polished final (picked: code-to-product) ---- */
// Polished "Code to Product" board. Inserted into engine.js before the ORDER line; uses engine helpers.
const MW=.6; // mono advance per font-size unit
const CODE_COL={c:'#5d6b82',s:'#9ece6a',k:'#f37224',n:'#fa8f21',f:'#87c5ff',i:'#e8eef7',p:'#9aa8bd'};
const tokCode=str=>{const out=[];const re=/(\/\/.*$|'[^']*'?|"[^"]*"?|\b(?:import|from|const|await|export|default|return)\b|\b\d+\b|[A-Za-z_$@][\w$\/-]*(?=\()|[A-Za-z_$@][\w$\/.-]*|\s+|.)/g;let m;while((m=re.exec(str))){const v=m[0];let c='p';if(v.startsWith('//'))c='c';else if(/^['"]/.test(v))c='s';else if(/^(import|from|const|await|export|default|return)$/.test(v))c='k';else if(/^\d+$/.test(v))c='n';else if(/^[A-Za-z_$@]/.test(v))c=str.slice(m.index+v.length).startsWith('(')?'f':'i';else if(/^\s+$/.test(v))c='i';out.push([v,CODE_COL[c]])}return out};
const tokCmd=str=>{const out=[];const re=/("[^"]*"?|--?[\w-]+|\S+|\s+)/g;let m,first=true;while((m=re.exec(str))){const v=m[0];let c='#e8eef7';if(/^"/.test(v))c='#9ece6a';else if(/^-/.test(v))c='#f37224';else if(/\S/.test(v)&&first){c='#87c5ff';first=false}out.push([v,c])}return out};
const hl=(toks,n,x,y,size,w=500)=>{let used=0,sp='';for(const [v,c] of toks){if(used>=n)break;const part=v.slice(0,n-used);used+=part.length;sp+=`<tspan fill="${c}">${esc(part)}</tspan>`}return `<text x="${x}" y="${y}" font-family="JetBrains Mono,ui-monospace,monospace" font-size="${size}" font-weight="${w}" xml:space="preserve">${sp}</text>`};
const glow=(id,cx,cy,r,c,o)=>`<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>`;
const atmos=(t,o=1)=>glow('cpg',.5,.42,.62,'#0a76db',.26*o)+`<rect width="160" height="90" fill="url(#cpg)"/>`+(()=>{let s='';const off=(t*1.2)%6;for(let y=3;y<90;y+=6)for(let x=3;x<166;x+=6)s+=`<circle cx="${x-off}" cy="${y}" r=".22" fill="#87c5ff" opacity=".13"/>`;return s})();
const win=(x,y,w,h,title,op=1)=>G(op,`<rect x="${x+.6}" y="${y+1.2}" width="${w}" height="${h}" rx="3" fill="#000" opacity=".35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#0e1626" stroke="#22324c" stroke-width=".45"/><path d="M${x+3},${y} h${w-6} a3,3 0 0 1 3,3 v4 h${-w} v-4 a3,3 0 0 1 3,-3z" fill="#141f33"/>`+['#f37224','#87c5ff','#6c98c9'].map((c,i)=>`<circle cx="${x+4.5+i*3.6}" cy="${y+3.5}" r="1" fill="${c}"/>`).join('')+(title?T(x+w/2,y+4.7,2.6,title,'#7c8aa3',500,'middle','JetBrains Mono','',w-24):''));
const CL=x=>String(x.t_code??'').split('\n').slice(0,9);
const CODE_UNUSED=["import { design, openSource, ai } from '@arbisoft/core'","","const squad = await assemble({ senior: true })","const app = design.lead(idea)  // timely · useful · delightful","await openSource.contribute(app)","ai.accelerate(app.pipeline)","","export default ship(app, { downtime: 0 })"];

boards.push({chrome:['arbisoft — zsh','product.ts — arbisoft','product.ts','▾ src','design/','ai/','core/','▾ tests','proof.test.ts','● main','package.json','zsh','RUNS','PASS','Lahore','Riyadh','Berlin','Plano','72','98%',/^\d+ms$/,/^Tests: \d+ passed/,/^[⟳✓] (building|built)/,/^\+\d+%$/,/^\d+$/,/^[{}]$|^ *[{}],?$/,'~','›','✓','$',/^ *"(n|na|nam|name|s|si|sin|sinc|since|d|de|dep|depe|depen|depend|depende|dependen|dependenc|dependenci|dependencie|dependencies)"?/],
 id:'code-to-product-final',tab:'Code to Product · Final',name:'From Terminal to Product',bg:'#070c17',fade:true,final:true,push:true,
 pitch:'The polished version of your pick. A real-looking editor, syntax-highlighted code that turns into a live product, four industry screens with their own motion, a test run as proof, and the cursor glowing into the logo.',
 chips:['Polished · v3','60s','Terminal + UI','Glitchy electronic music, 120 bpm','Sound effects','16:9'],
 fields:[
  {key:'t_cmd',shot:0,label:'Command',def:'arbisoft build --idea "your product"'},
  {key:'t_setup',shot:0,label:'Setup steps (up to 3)',def:'Resolving design system · Fetching open-source modules · Warming up AI pipeline'},
  {key:'t_code',shot:1,label:'Code on screen (one line per row, up to 9)',rows:8,def:"import { design, openSource, ai } from '@arbisoft/core'\n\nconst squad = await assemble({ senior: true })\nconst app = design.lead(idea)  // timely · useful · delightful\nawait openSource.contribute(app)\nai.accelerate(app.pipeline)\n\nexport default ship(app, { downtime: 0 })"},
  {key:'t_build',shot:1,label:'Build status',def:'Design-led · open source · AI-accelerated'},
  {key:'t_ship',shot:2,label:'Ship line',def:'From idea to product'},
  {key:'t_url',shot:2,label:'Product address',def:'yourproduct.app'},
  {key:'t_indhead',shot:3,label:'Industries heading',def:'// built across industries'},
  {key:'t_ind',shot:3,label:'Industries',def:'Education · Travel · Healthcare · Finance'},
  {key:'t_pkgname',shot:4,label:'package.json name',def:'arbisoft'},
  {key:'t_pkgsince',shot:4,label:'package.json since',def:'2007'},
  {key:'t_clients',shot:4,label:'Clients',def:'edX · KAYAK · Careem · The World Bank · MIT · Indeed'},
  {key:'t_since',shot:4,label:'First client note',def:'since 2013'},
  {key:'t_trust',shot:4,label:'Clients caption',def:'Trusted by market leaders serving 500M+ people'},
  {key:'t_deploycmd',shot:5,label:'Deploy command',def:'arbisoft deploy --regions all'},
  {key:'t_live',shot:5,label:'Deploy counter label',def:'regions live'},
  {key:'t_deploy',shot:5,label:'Deploy caption',def:'7 offices · 5 countries · one team'},
  {key:'t_statscmd',shot:6,label:'Stats command',def:'git log --since=2007 | arbisoft stats'},
  {key:'t_stats',shot:6,label:'Stats (number then label)',def:'19+ years of engineering · 750+ experts · 3,000+ open-source PRs · 550+ collaborations'},
  {key:'t_testcmd',shot:7,label:'Test command',def:'arbisoft test --proof'},
  {key:'t_checks',shot:7,label:'Passing checks',def:'Rated 4.9/5 on Clutch · ISO 27701 & 9001 certified · AWS, Databricks & Salesforce partner'},
  {key:'t_tag',shot:8,label:'Lockup tagline',def:'If you can imagine it, we can build it.'},
  {key:'t_site',shot:8,label:'Lockup URL',def:'arbisoft.com'}],
 scenes:[
  {d:5,name:'Command',c:x=>{const n=String(x.t_cmd).length,a=[[0,'whoosh']];for(let i=0;i<n;i++)a.push([.9+2*i/n,'key']);a.push([3,'enter'],[3.2,'tick'],[3.55,'tick'],[3.9,'tick']);return a},f:(t,x)=>{const a=eo(pr(t,0,.9)),n=Math.round(String(x.t_cmd).length*pr(t,.9,2.9)),cw=4.2*MW,X0=31;
    let s=atmos(t,a)+G(a,win(18,18,124,54,'arbisoft — zsh'),`translate(80 45) scale(${.93+.07*a}) translate(-80 -45)`);
    s+=G(pr(t,.6,1),T(22,32,4.2,'~','#6c98c9',600,'start','JetBrains Mono')+T(25.5,32,4.2,'›','#f37224',700,'start','JetBrains Mono')+hl(tokCmd(String(x.t_cmd)),n,X0,32,4.2,500));
    const lines=split(x.t_setup).slice(0,3).map((l,i)=>[l,3.2+i*.35]);
    lines.forEach(([l,at],i)=>{s+=G(pr(t,at,at+.15),T(22,40+i*6,3.4,'✓','#9ece6a',700,'start','JetBrains Mono')+T(26,40+i*6,3.4,l,'#9aa8bd',500,'start','JetBrains Mono'))});
    const cy=t<3.1?32:40+Math.min(2,Math.floor((t-3.1)/.35))*6+6, cx=t<3.1?X0+n*cw:22;
    if(Math.floor(t*2.5)%2==0||t<2.9)s+=`<rect x="${cx+.4}" y="${cy-3.6}" width="2.2" height="4.4" fill="#f37224"/>`;return s}},
  {d:7.5,name:'Build',c:x=>{const a=[[0,'whoosh']];for(let t=.9;t<5.6;t+=.085)a.push([t,'key']);a.push([6.4,'done']);return a},f:(t,x)=>{const e=eio(pr(t,0,.7)),X=18-8*e,Y=18-8*e,W=124+16*e,H=54+16*e;let s=atmos(t)+win(X,Y,W,H,'product.ts — arbisoft');
    const io=pr(t,.6,1);
    s+=G(io,`<rect x="10" y="17" width="26" height="58" fill="#0b1322"/>`+[['▾ src','#e8eef7'],['   design/','#9aa8bd'],['   ai/','#9aa8bd'],['   core/','#9aa8bd'],['   product.ts','#87c5ff'],['▾ tests','#e8eef7'],['   proof.test.ts','#9aa8bd']].map(([l,c],i)=>T(12,23+i*5,2.8,l,c,500,'start','JetBrains Mono')).join('')+`<rect x="10" y="${19.6+4*5}" width="26" height="4.6" fill="#0a76db" opacity=".18"/>`+`<rect x="36" y="17" width="28" height="5" fill="#0e1626"/><rect x="36" y="21.6" width="28" height=".5" fill="#f37224"/>`+T(39,20.6,2.7,'product.ts','#e8eef7',600,'start','JetBrains Mono'));
    let used=0;const CODE=CL(x),total=CODE.join('').length,typed=Math.round(total*pr(t,.9,5.6));
    CODE.forEach((ln,i)=>{const y=28+i*5.6,k=Math.max(0,Math.min(ln.length,typed-used));used+=ln.length;s+=G(io,T(41,y,2.9,String(i+1),'#3b4a63',500,'end','JetBrains Mono')+hl(tokCode(ln),k,44,y,2.9,500))});
    s+=G(io,[...CL(x)].map((ln,i)=>`<rect x="143" y="${26+i*2}" width="${Math.min(7,ln.length*.12)}" height=".9" fill="#87c5ff" opacity=".35"/>`).join(''));
    const b=pr(t,1,6.4);s+=G(io,`<rect x="10" y="75" width="140" height="5" fill="#0a76db"/>`+T(12,78.6,2.7,'● main',"#ffffff",600,'start','JetBrains Mono')+T(30,78.6,2.7,(b<1?'⟳ building  ':'✓ built  ')+String(x.t_build),'#ffffff',600,'start','JetBrains Mono','',90)+`<rect x="122" y="76.6" width="24" height="1.8" rx=".9" fill="#05193b"/><rect x="122" y="76.6" width="${24*b}" height="1.8" rx=".9" fill="#f37224"/>`);
    return s}},
  {d:7,name:'Ship',c:x=>[[0,'whoosh'],[1.3,'pop'],[1.7,'pop'],[2.1,'pop'],[2.5,'pop'],[3,'swell']],f:(t,x)=>{const e=eio(pr(t,0,.9)),W=140-76*e;let s=atmos(t)+win(10,10,W,70,'product.ts');
    CL(x).forEach((ln,i)=>{if(!ln)return;s+=G(1-.45*e,hl(tokCode(ln),Math.round(ln.length*(1-.55*e)),14,24+i*5.6,2.9-.5*e,500))});
    const bx=80,by=14,bw=72,bh=60,bo=eo(pr(t,.5,1.2));
    s+=G(bo,`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3" fill="#f6f8fb"/><path d="M${bx+3},${by} h${bw-6} a3,3 0 0 1 3,3 v4 h${-bw} v-4 a3,3 0 0 1 3,-3z" fill="#e1e9ef"/><rect x="${bx+12}" y="${by+1.6}" width="${bw-24}" height="3.8" rx="1.9" fill="#ffffff"/>`+T(bx+bw/2,by+4.4,2.5,x.t_url,'#56637a',500,'middle','JetBrains Mono','',bw-28),`translate(${(1-bo)*14} 0)`);
    const comps=[[1.3,`<rect x="${bx+4}" y="${by+10}" width="${bw-8}" height="5" rx="1" fill="#ffffff"/><circle cx="${bx+7.5}" cy="${by+12.5}" r="1.6" fill="#0a76db"/>`+[0,1,2].map(i=>`<rect x="${bx+bw-26+i*7}" y="${by+11.8}" width="5" height="1.4" rx=".7" fill="#9aa8bd"/>`).join(''),1],[1.7,`<rect x="${bx+6}" y="${by+20}" width="42" height="4" rx="1" fill="#05193b"/><rect x="${bx+6}" y="${by+26}" width="30" height="4" rx="1" fill="#05193b"/><rect x="${bx+6}" y="${by+32.5}" width="18" height="5" rx="2.5" fill="#f37224"/>`,3],[2.1,[0,1,2].map(i=>`<rect x="${bx+4+i*22}" y="${by+42}" width="20" height="14" rx="1.5" fill="#ffffff" stroke="#dde4ee" stroke-width=".4"/><rect x="${bx+6+i*22}" y="${by+44}" width="9" height="4" rx="1" fill="${['#0a76db','#6c98c9','#87c5ff'][i]}"/><rect x="${bx+6+i*22}" y="${by+50}" width="14" height="1.4" rx=".7" fill="#dde4ee"/>`).join(''),5],[2.5,`<rect x="${bx+52}" y="${by+19}" width="16" height="19" rx="2" fill="#e1e9ef"/><polyline points="${bx+54},${by+34} ${bx+58},${by+29} ${bx+61},${by+31} ${bx+66},${by+23}" fill="none" stroke="#0a76db" stroke-width=".8"/>`,4]];
    comps.forEach(([at,svg,li])=>{const k=eo(pr(t,at,at+.5));const ly=24+li*5.6-1,ty=by+12+((li*7)%40);s+=G(Math.min(1,k*1.4)*(1-pr(t,at+1,at+1.6)),draw(`M${10+W},${ly} C${(10+W+bx)/2},${ly} ${(10+W+bx)/2},${ty} ${bx+3},${ty}`,k,'#f37224',.45));s+=G(k,svg,`translate(0 ${(1-k)*3})`)});
    return s+G(pr(t,3,3.6),`<rect x="0" y="78" width="160" height="12" fill="#070c17" opacity=".7"/>`+T(80,86,5.4,x.t_ship,'#ffffff',800))}},
  {d:7,name:'Industries',c:x=>[[0,'whoosh'],...split(x.t_ind).slice(0,4).map((_,i)=>[.15+i*.35,'card'])],f:(t,x)=>{const ind=split(x.t_ind).slice(0,4),cols=['#0a76db','#f37224','#6c98c9','#87c5ff'];let s=atmos(t)+G(pr(t,0,.5),T(14,14,3,x.t_indhead,'#5d6b82',500,'start','JetBrains Mono'));
    const drift=-3*eio(pr(t,0,7));
    ind.forEach((n,i)=>{const k=eo(pr(t,.15+i*.35,.95+i*.35)),cx=12+i*35+drift+(1-k)*24,y=20,lt=t-.6-i*.35,c=cols[i];
      let ui='';const X=cx+3,Y=y+9;
      if(i==0)ui=`<rect x="${X}" y="${Y}" width="24" height="13" rx="1.5" fill="${c}" opacity=".25"/><polygon points="${X+10},${Y+4} ${X+10},${Y+9} ${X+14.5},${Y+6.5}" fill="#ffffff"/>`+[0,1,2].map(j=>`<rect x="${X}" y="${Y+16+j*4}" width="24" height="1.6" rx=".8" fill="#1f3048"/><rect x="${X}" y="${Y+16+j*4}" width="${24*eo(cl((lt-j*.3)/1.2))*[.8,.55,.3][j]}" height="1.6" rx=".8" fill="${c}"/>`).join('');
      if(i==1){const p=cl(lt/2.5),qx=(1-p)*(1-p)*X+2*(1-p)*p*(X+12)+p*p*(X+23),qy=(1-p)*(1-p)*(Y+22)+2*(1-p)*p*(Y-2)+p*p*(Y+10);ui=`<path d="M${X},${Y+22} Q${X+12},${Y-2} ${X+23},${Y+10}" fill="none" stroke="${c}" stroke-width=".5" stroke-dasharray="1 1"/><circle cx="${X}" cy="${Y+22}" r="1.3" fill="#87c5ff"/><circle cx="${X+23}" cy="${Y+10}" r="1.3" fill="#87c5ff"/><circle cx="${qx}" cy="${qy}" r="1.2" fill="${c}"/>`+`<rect x="${X}" y="${Y+26}" width="24" height="3.4" rx="1" fill="${c}"/>`}
      if(i==2){const pts=[[0,8],[5,8],[7,3],[9,13],[11,8],[16,8],[18,5],[20,10],[24,8]].map(([a,b])=>`${X+a},${Y+4+b}`).join(' L');ui=draw('M'+pts,cl(lt/1.4),c,.7)+`<rect x="${X}" y="${Y+21}" width="11" height="8" rx="1" fill="#1f3048"/><rect x="${X+13}" y="${Y+21}" width="11" height="8" rx="1" fill="#1f3048"/>`+T(X+5.5,Y+26.6,3,'72','#ffffff',800)+T(X+18.5,Y+26.6,3,'98%','#ffffff',800)}
      if(i==3){const p=eo(cl(lt/1.6)),pts=[[0,16],[4,13],[8,14],[12,9],[16,10],[20,5],[24,2]];ui=`<path d="M${X},${Y+18} `+pts.map(([a,b])=>`L${X+a},${Y+18-(18-b)*p}`).join(' ')+` L${X+24},${Y+18}z" fill="${c}" opacity=".3"/><polyline points="${pts.map(([a,b])=>`${X+a},${Y+18-(18-b)*p}`).join(' ')}" fill="none" stroke="${c}" stroke-width=".7"/>`+`<rect x="${X}" y="${Y+22}" width="24" height="7" rx="1" fill="#1f3048"/>`+T(X+12,Y+27,3,'+'+Math.round(24*p)+'%','#9ece6a',800)}
      s+=G(k,`<rect x="${cx+.5}" y="${y+1}" width="30" height="50" rx="3" fill="#000" opacity=".35"/><rect x="${cx}" y="${y}" width="30" height="50" rx="3" fill="#0e1626" stroke="${c}" stroke-width=".55"/><rect x="${cx}" y="${y}" width="30" height="5" rx="3" fill="${c}"/><rect x="${cx}" y="${y+3}" width="30" height="2" fill="${c}"/>`+ui+T(cx+15,y+57,3.8,n,'#ffffff',800,'middle','Inter','',32))});
    return s}},
  {d:7.5,name:'Clients',c:x=>{const a=[[0,'whoosh']];split(x.t_clients).slice(0,6).forEach((_,i)=>a.push([1.4+i*.55,'pop']));a.push([5,'swell']);return a},f:(t,x)=>{const deps=split(x.t_clients).slice(0,6);const L=['{',`  "name": "${x.t_pkgname}",`,`  "since": ${x.t_pkgsince},`,'  "dependencies": {',...deps.map((n,i)=>`    "${n}": "${i==0?x.t_since:'trusted partner'}"${i<deps.length-1?',':''}`),'  }','}'];
    let s=atmos(t)+win(22,6,116,66,'package.json');
    L.forEach((ln,i)=>{const isDep=i>=4&&i<4+deps.length,at=isDep?1.4+(i-4)*.55:(i<4?.3+i*.2:1.4+deps.length*.55+(i-4-deps.length)*.2),k=pr(t,at,at+.25),y=17+i*4.7;if(t<at)return;
      if(isDep){const fl=1-pr(t,at,at+.9);s+=`<rect x="26" y="${y-3.6}" width="108" height="4.8" fill="#f37224" opacity="${(.28*fl).toFixed(3)}"/>`}
      s+=T(32,y,2.7,String(i+1),'#3b4a63',500,'end','JetBrains Mono')+hl(tokCode(ln),Math.round(ln.length*k),35,y,3.1,500)});
    return s+G(pr(t,5,5.6),`<rect x="0" y="78" width="160" height="12" fill="#070c17" opacity=".75"/>`+T(80,86,5,countFirst(x.t_trust,pr(t,5,6.6)),'#ffffff',800))}},
  {d:7.5,name:'Deploy worldwide',c:x=>{const n=String(x.t_deploycmd).length,a=[[0,'whoosh']];for(let i=0;i<n;i+=2)a.push([.3+1.2*i/n,'key']);a.push([1.6,'enter']);for(let i=0;i<7;i++)a.push([2.6+i*.45,'ping']);a.push([5.6,'swell']);return a},f:(t,x)=>{const C=[['Lahore',74.3,31.5],['Islamabad',73,33.7],['Karachi',67,24.9],['Riyadh',46.7,24.7],['Doha',51.5,25.3],['Berlin',13.4,52.5],['Plano',-96.7,33]].map(([n,lo,la])=>[n,P(lo,la)]);
    const Z=(p)=>[(p[0]-80)*1.18+80,(p[1]-36)*1.18+40];let s=atmos(t)+G(pr(t,0,1)*.95,mapField(),`translate(80 40) scale(1.18) translate(-80 -36)`);
    const home=Z(C[0][1]);let live=0;
    C.forEach(([n,p],i)=>{const q=Z(p),at=2+i*.45;if(i>0)s+=draw(arcD(home,q),pr(t,at,at+.6),'#f37224',.7);const land=pr(t,at+.6,at+.8);if(land>0)live++;
      const ph=((t-at-.6)*.8)%1;s+=G(land,`<circle cx="${q[0]}" cy="${q[1]}" r="1.3" fill="#87c5ff"/><circle cx="${q[0]}" cy="${q[1]}" r="${1.5+ph*5}" fill="none" stroke="#87c5ff" stroke-width=".4" stroke-opacity="${(.7*(1-ph)).toFixed(2)}"/>`+(['Lahore','Berlin','Plano','Riyadh'].includes(n)?T(q[0]+(n=='Lahore'?4:0),q[1]+(n=='Riyadh'?5.5:-3),3.2,n,'#ffffff',600,n=='Lahore'?'start':'middle'):''))});
    s+=G(eo(pr(t,0,.5)),win(6,6,66,20,'zsh')+T(9,18,3,'$ '+typeOn(x.t_deploycmd,pr(t,.3,1.5)),'#e8eef7',500,'start','JetBrains Mono','',60)+G(pr(t,1.6,1.9),T(9,23,3,`${x.t_live}: ${live}/7`,live==7?'#9ece6a':'#9aa8bd',600,'start','JetBrains Mono')));
    return s+G(pr(t,5.6,6.2),`<rect x="0" y="78" width="160" height="12" fill="#070c17" opacity=".75"/>`+T(80,86,5,x.t_deploy,'#ffffff',800))}},
  {d:6,name:'Stats',c:x=>{const a=[[0,'whoosh']];for(let i=0;i<14;i++)a.push([.2+i*.07,'key']);split(x.t_stats).slice(0,4).forEach((_,i)=>a.push([1.4+i*.6,'count']));return a},f:(t,x)=>{const rows=split(x.t_stats).slice(0,4).map(r=>{const m=String(r).match(/^(\S+)\s+(.*)$/);return m?[m[1],m[2]]:[r,'']});
    let s=atmos(t)+win(18,10,124,68,'zsh');s+=T(22,22,3.2,'$ '+typeOn(String(x.t_statscmd),pr(t,.2,1.2)),'#87c5ff',500,'start','JetBrains Mono','',116);
    rows.forEach(([num,lab],i)=>{const at=1.4+i*.6,k=eo(pr(t,at,at+.4)),y=36+i*11;if(t<at)return;s+=G(k,`<rect x="22" y="${y-6.5}" width="116" height="9" rx="1.5" fill="#0a76db" opacity=".08"/>`+T(26,y,7.5,countFirst(num,pr(t,at,at+1.3)),'#f37224',900,'start','Inter','',40)+T(66,y-.3,4,lab,'#e8eef7',700,'start','Inter','',70),`translate(${(1-k)*-6} 0)`)});
    return s}},
  {d:6,name:'Tests pass',c:x=>{const c=split(x.t_checks).slice(0,4),a=[[0,'whoosh']];c.forEach((_,i)=>a.push([.8+i*.75,'run'],[.8+i*.75+.45,'pass']));a.push([.8+c.length*.75+.3,'ok']);return a},f:(t,x)=>{const c=split(x.t_checks).slice(0,4),a=eo(pr(t,0,.6));let s=atmos(t)+G(a,win(18,14,124,62,String(x.t_testcmd)));
    s+=G(pr(t,.3,.6),T(22,26,3.4,'$','#6c98c9',600,'start','JetBrains Mono')+hl(tokCmd(String(x.t_testcmd)),99,26,26,3.4));
    c.forEach((n,i)=>{const at=.8+i*.75,y=36+i*8,run=t>=at&&t<at+.45,pass=t>=at+.45;if(t<at)return;
      s+=`<rect x="22" y="${y-3.6}" width="10" height="4.6" rx=".8" fill="${pass?'#9ece6a':'#fa8f21'}"/>`+T(27,y-.3,2.8,pass?'PASS':'RUNS','#070c17',800,'middle','JetBrains Mono')+T(35,y,3.8,n,'#e8eef7',700,'start','Inter','',86)+G(pass?1:0,T(138,y,3,`${[12,8,21,15][i]}ms`,'#5d6b82',500,'end','JetBrains Mono'))});
    const sum=pr(t,.8+c.length*.75+.2,.8+c.length*.75+.6);s+=G(sum,`<rect x="22" y="${36+c.length*8}" width="116" height=".4" fill="#22324c"/>`+T(22,40+c.length*8+2,3.4,`Tests: ${c.length} passed, ${c.length} total`,'#9ece6a',700,'start','JetBrains Mono'));
    return s}},
  {d:6.5,name:'Lockup',c:x=>{const a=[[0,'collapse'],[1.2,'hit']];const n=String(x.t_tag).length;for(let i=0;i<n;i+=2)a.push([2.2+1.4*i/n,'softkey']);a.push([3.8,'sparkle']);return a},f:(t,x)=>{const col=eio(pr(t,0,.8)),cur=pr(t,.6,1.1)*(1-pr(t,1.3,1.8)),lp=eo(pr(t,1.2,2.2));let s=atmos(t,.6+.6*lp);
    s+=G(1-col,win(18+62*col,14+31*col,124*(1-col)+.1,62*(1-col)+.1,''));
    s+=glow('cur',.5,.5,.5,'#f37224',.55)+G(cur,`<rect x="68" y="33" width="24" height="24" fill="url(#cur)"/><rect x="78.8" y="38.8" width="2.4" height="12" fill="#f37224"/>`);
    s+=glow('lg',.5,.5,.5,'#87c5ff',.35)+G(lp,`<rect x="30" y="20" width="100" height="40" fill="url(#lg)"/>`+LOGO(44,30,72,'#ffffff'),`translate(80 40) scale(${.86+.14*lp}) translate(-80 -40)`);
    const tag=String(x.t_tag);s+=T(80,62,4.6,typeOn(tag,pr(t,2.2,3.6)),'#87c5ff',600,'middle','Nunito');
    return s+G(pr(t,3.8,4.4),T(80,72,3.4,x.t_site,'#6c98c9',600,'middle','JetBrains Mono'))}}]});

const ORDER=['code-to-product-final','kinetic-type','data-cuts','map-journey','code-to-product','before-after'];
