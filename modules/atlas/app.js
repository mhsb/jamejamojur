const $=s=>document.querySelector(s),svg=d3.select('#fl');
const CN={Africa:'آفریقا',Asia:'آسیا',Europe:'اروپا','North America':'آمریکای شمالی','South America':'آمریکای جنوبی',Oceania:'اقیانوسیه',Antarctica:'جنوبگان'};
const CC={Africa:'#f6b65b',Asia:'#f08a76',Europe:'#9fd18b','North America':'#c9a2e3','South America':'#f4d96a',Oceania:'#7fd3c8',Antarctica:'#f1f5f7'};
const BOX={Africa:[-18,-35,52,37],Asia:[26,-10,145,55],Europe:[-25,35,45,71],'North America':[-168,7,-52,72],'South America':[-82,-56,-34,13],Oceania:[110,-47,180,-2]};
const INC={1:'بسیار بالا',2:'بالا',3:'نسبتاً بالا',4:'متوسط',5:'پایین'};
const fa=(n,m=0)=>n.toLocaleString('fa-IR',{maximumFractionDigits:m});
const pop=n=>n>=1e6?fa(n/1e6,1)+' میلیون نفر':fa(n)+' نفر';
const norm=s=>(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').toLowerCase();
const BTN=(g,t,a)=>`<a class="big" href="#" data-go="${g}" ${a} style="display:block;text-align:center;text-decoration:none">${t}</a>`,CA=c=>`data-n="${c.n}" data-la="${c.y}" data-lo="${c.x}" data-a="${c.a||''}"`;
const row=(a,b)=>`<div class="r"><span>${a}</span><b>${b}</b></div>`;
const KMAX=24,MAXK=24,cv=$('#gl'),fl=$('#fl'),dpr=Math.min(devicePixelRatio||1,2);let globe=false,gk=1,rot=[-50,-25],gp,gvis=[],HT=60,fdrag=0,fht=0,fr=0,P,PLo,PBX,FCOL,GI,PL,PR,fvis=[];const FL=D.cl.map(g=>({type:'Feature',geometry:g})),FL2=D.cl2.map(g=>({type:'Feature',geometry:g}));let gfast=0;let W,H,proj,path,T=d3.zoomIdentity,level='simple',sel=null,L=[],layers={names:1,cities:1,nature:1,water:1};
const cname=a=>(D.c.features.find(f=>f.properties.a3===a)||{properties:{fa:''}}).properties.fa;
const zoom=d3.zoom().scaleExtent([1,MAXK]).on('start',()=>{fdrag=1;tip()}).on('zoom',e=>{T=e.transform;sched()}).on('end',()=>{fdrag=0;sched()});
svg.call(zoom).on('dblclick.zoom',null);
function tip(e,t){const el=$('#tip');if(!t){el.style.display='none';return}el.textContent=t;el.style.display='block';el.style.left=e.clientX+14+'px';el.style.top=e.clientY+14+'px'}
function render(){
 W=innerWidth;H=innerHeight;HT=$('header').offsetHeight;proj=d3.geoNaturalEarth1().fitExtent([[8,HT+4],[W-8,H-8]],{type:'Sphere'});path=d3.geoPath(proj);
 zoom.translateExtent([[0,0],[W,H]]).extent([[0,0],[W,H]]);
 P=D.c.features.map(f=>new Path2D(path(f)));PLo=D.cl.map(g=>new Path2D(path({type:'Feature',geometry:g})));PBX=D.c.features.map(f=>path.bounds(f));FCOL=D.c.features.map(f=>CC[f.properties.cont]||'#ddd');GI={};FCOL.forEach((c,i)=>(GI[c]=GI[c]||[]).push(i));PL=new Path2D(path(D.lakes));PR=D.rivers.features.map(f=>[new Path2D(path(f)),path.bounds(f)]);
 L=D.c.features.map(f=>{const p=f.properties,[x,y]=p.lx!=null?proj([p.lx,p.ly]):path.centroid(f);return{t:p.fa,x,y,ty:'c',a:path.area(f),sr:d3.geoArea(f),ll:p.lx!=null?[p.lx,p.ly]:d3.geoCentroid(f)}}).sort((a,b)=>b.a-a.a);
 D.m.forEach(m=>{const[x,y]=proj([m.x,m.y]);L.push({t:m.n,x,y,ty:m.ty,mz:m.mz,e:m.e,ll:[m.x,m.y]})});
 D.cities.forEach(c=>{const[x,y]=proj([c.x,c.y]);L.push({t:c.n,x,y,ty:'t',mz:c.mz,c,ll:[c.x,c.y]})});
 csize();svg.call(zoom.transform,d3.zoomIdentity);globe?gdraw():fdraw();
}
function lblOn(l,k,sz){
 if(l.ty==='c')return layers.names&&sz>l.t.length*4+10;
 if(l.ty==='t')return layers.cities&&k>=Math.max(1,2**(l.mz-2.2))&&(level==='adv'||l.mz<=4);
 return (l.ty==='r'||l.ty==='l'?layers.water:layers.nature)&&k>=Math.max(1.2,2**(l.mz-2.2))&&(level==='adv'||l.mz<=3.5)}
function layout(k,pos,sz){
 const bx=[],out=[];
 for(const l of L){if(!l.t)continue;const p=pos(l);if(!p)continue;const[x,y]=p;
  if(x<-60||x>W+60||y<HT+6||y>H+20||!lblOn(l,k,sz(l)))continue;
  const dot=l.ty==='t'||l.ty==='k',w=l.t.length*7.5+(dot?14:0),x0=dot?x-5:x-w/2,y0=y-8;
  if(bx.some(b=>x0<b[2]&&x0+w>b[0]&&y0<b[3]&&y0+16>b[1]))continue;
  bx.push([x0,y0,x0+w,y0+16]);out.push([l,x,y])}
 return out}
function sched(){if(!fr)fr=requestAnimationFrame(()=>{fr=0;globe?gdraw(gfast||fdrag):fdraw()})}
function update(){sched()}
function fdraw(){
 const c=fl.getContext('2d'),k=T.k,si=sel&&sel.f?D.c.features.indexOf(sel.f):-1,vx0=-T.x/k,vy0=-T.y/k,vx1=(W-T.x)/k,vy1=(H-T.y)/k;
 const vis=b=>!(b[1][0]<vx0||b[0][0]>vx1||b[1][1]<vy0||b[0][1]>vy1),PP=k<5?PLo:P,V=[];
 c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#cfe8f1';c.fillRect(0,0,W,H);
 c.setTransform(dpr*k,0,0,dpr*k,dpr*T.x,dpr*T.y);
 PP.forEach((p,i)=>{if(vis(PBX[i])){V.push(p);c.fillStyle=FCOL[i];c.fill(p)}});
 c.lineWidth=.7/k;c.strokeStyle='#fff';V.forEach(p=>c.stroke(p));
 if(layers.water){c.fillStyle='#cfe8f1';c.fill(PL);c.lineWidth=.6/k;c.strokeStyle='#8fc1da';c.stroke(PL);if(!fdrag&&k>=1.6){c.lineWidth=1/k;c.strokeStyle='#62aed6';PR.forEach(([p,b])=>vis(b)&&c.stroke(p))}}
 if(si>=0){c.lineWidth=2.2/k;c.strokeStyle='#1d3557';c.stroke(P[si])}
 c.setTransform(dpr,0,0,dpr,0,0);fvis=layout(k,l=>[l.x*k+T.x,l.y*k+T.y],l=>Math.sqrt(l.a)*k);dlabels(c,fvis,fdrag);
}
function dlabels(ctx,vis,fast){
 ctx.direction='ltr';ctx.lineJoin='round';ctx.textBaseline='middle';
 const COL={c:'#1d3557',t:'#1d3557',m:'#2a7aa6',r:'#2a7aa6',l:'#2a7aa6',p:'#7a4b1e',k:'#6b4423'};
 for(const[l,x,y]of vis){const dot=l.ty==='t'||l.ty==='k';
  if(l.ty==='t'){ctx.beginPath();ctx.arc(x,y,l.c.c?4.5:3.2,0,7);ctx.fillStyle=l.c.c?'#d9502b':'#fff';ctx.fill();ctx.strokeStyle='#1d3557';ctx.lineWidth=1.5;ctx.stroke()}
  if(l.ty==='k'){ctx.beginPath();ctx.moveTo(x,y-4.5);ctx.lineTo(x+4.5,y+3);ctx.lineTo(x-4.5,y+3);ctx.closePath();ctx.fillStyle='#8b5a2b';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke()}
  ctx.font=(/[mrl]/.test(l.ty)?'italic ':'')+(l.ty==='c'?600:500)+' 12px V,Tahoma,sans-serif';ctx.textAlign=dot?'left':'center';
  const tx=dot?x+8:x;if(!fast){ctx.lineWidth=3;ctx.strokeStyle=/[ml]/.test(l.ty)?'#cfe8f1cc':'#ffffffd9';ctx.strokeText(l.t,tx,y)}ctx.fillStyle=COL[l.ty];ctx.fillText(l.t,tx,y)}
}
function fhit(e){const r=fl.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
 for(const[l,x,y]of fvis)if((l.ty==='t'||l.ty==='k')&&Math.abs(px-x)<HR()&&Math.abs(py-y)<HR())return{l};
 const c=fl.getContext('2d');c.setTransform(1,0,0,1,0,0);const qx=(px-T.x)/T.k,qy=(py-T.y)/T.k,i=P.findIndex((p,j)=>{const b=PBX[j];return qx>=b[0][0]&&qx<=b[1][0]&&qy>=b[0][1]&&qy<=b[1][1]&&c.isPointInPath(p,qx,qy)});
 return i<0?{}:{f:D.c.features[i]}}
fl.addEventListener('mousemove',e=>{if(fdrag)return;const n=performance.now();if(n-fht<40)return;fht=n;const h=fhit(e);fl.style.cursor=h.l||h.f?'pointer':'grab';
 tip(e,h.l?h.l.t+(h.l.e?' — '+fa(h.l.e)+' متر':''):h.f?h.f.properties.fa:null)});
fl.addEventListener('mouseleave',()=>tip());
fl.addEventListener('click',e=>{const h=fhit(e);if(h.l&&h.l.ty==='t')pickCity(h.l.c);else if(h.f)pickC(h.f)});
function view(){const m=innerWidth<=760,pb=m&&sel?$('#panel').offsetHeight:0;return{pw:m?0:340,pb}}
const HR=()=>innerWidth<=760?16:9;
function zoomPx([[x0,y0],[x1,y1]],kmax=MAXK){
 const v=view(),aw=W-v.pw,ah=H-HT-v.pb,kk=Math.max(1,Math.min(kmax,.72*Math.min((aw-20)/(x1-x0||1),(ah-20)/(y1-y0||1)))),cx=(x0+x1)/2,cy=(y0+y1)/2;
 svg.transition().duration(900).call(zoom.transform,d3.zoomIdentity.translate(aw/2-cx*kk,HT+ah/2-cy*kk).scale(kk));
}
function mainBounds(f){const g=f.geometry;if(g.type==='Polygon')return path.bounds(f);let best,ba=-1;
 for(const c of g.coordinates){const pf={type:'Polygon',coordinates:c},a=d3.geoArea(pf);if(a>ba){ba=a;best=pf}}return path.bounds(best)}
function pickC(f){sel={f};d3.selectAll('#cG path').classed('sel',d=>d===f).filter(d=>d===f).raise();panel();globe?gFlyF(f):zoomPx(mainBounds(f))}
function pickCity(c){sel={c};d3.selectAll('#cG path').classed('sel',false);panel();if(globe)return gFly(c.x,c.y,9);const[x,y]=proj([c.x,c.y]);zoomPx([[x-30,y-20],[x+30,y+20]],9)}
function panel(){
 const el=$('#panel');el.classList.toggle('empty',!sel);
 if(!sel){el.innerHTML=`<h2>خوش آمدی!</h2><p>روی یک <b>کشور</b> یا <b>شهر</b> کلیک کن تا اطلاعاتش را ببینی. با چرخ ماوس زوم کن و با کشیدن، نقشه را جابه‌جا کن.</p><p>بچه‌های بزرگ‌تر می‌توانند حالت <b>پیشرفته</b> را بزنند تا اطلاعات بیشتری ببینند.</p><button class="big" id="rnd">🎲 یک کشور شانسی!</button>`;$('#rnd').onclick=()=>pickC(D.c.features[Math.floor(Math.random()*D.c.features.length)]);return}
 let h='';
 if(sel.f){const p=sel.f.properties,cap=D.cities.find(c=>c.c===1&&c.a===p.a3),cs=D.cities.filter(c=>c.a===p.a3).slice(0,8),area=d3.geoArea(sel.f)*6371**2;
  h=`<div class="hd">${D.fl[p.a2]?`<span class="fl">${D.fl[p.a2]}</span>`:''}<div><h2>${p.fa}</h2><small dir="ltr">${p.en}</small></div></div>`+row('قاره',CN[p.cont]||p.cont)+row('پایتخت',cap?cap.n:'—')+row('جمعیت',pop(p.pop));
  if(level==='adv')h+='<h3>اطلاعات تکمیلی</h3>'+row('مساحت تقریبی',fa(area)+' کیلومتر مربع')+row('تراکم جمعیت',fa(p.pop/area,1)+' نفر در کیلومتر مربع')
   +(p.gdp>0?row('تولید ناخالص داخلی',fa(p.gdp/1e3,1)+' میلیارد دلار')+row('درآمد سرانه',fa(p.gdp*1e6/p.pop)+' دلار'):'')+row('گروه درآمدی',INC[p.inc]||'—')
   +(cap?row('مختصات پایتخت',fa(Math.abs(cap.y),1)+'° '+(cap.y>=0?'شمالی':'جنوبی')+'، '+fa(Math.abs(cap.x),1)+'° '+(cap.x>=0?'شرقی':'غربی')):'')
   +(cs.length?'<h3>شهرهای بزرگ</h3>'+cs.map(c=>row(c.n,pop(c.p))).join(''):'');
 }else{const c=sel.c;
  h=`<h2>${c.n}</h2><small dir="ltr">${c.e}</small>`+row('کشور',cname(c.a)||'—')+row('نقش',c.c?'پایتخت':'شهر بزرگ')+row('جمعیت',pop(c.p));
  if(level==='adv')h+=row('مختصات',fa(Math.abs(c.y),2)+'° '+(c.y>=0?'شمالی':'جنوبی')+'، '+fa(Math.abs(c.x),2)+'° '+(c.x>=0?'شرقی':'غربی'));
 }
 if(sel.f){const p=sel.f.properties,cp=D.cities.find(c=>c.c===1&&c.a===p.a3);h+=BTN('countries','🃏 کارت این کشور','data-a3="'+p.a3+'"')+(cp?BTN('sky','🌌 آسمان '+cp.n,CA(cp))+BTN('solar','🪐 پایتخت روی زمین (منظومه)',CA(cp)):'')+(p.a3==='IRN'?BTN('iran','🇮🇷 باز کردن اطلس دقیق ایران',''):'')}
 else if(sel.c)h+=BTN('sky','🌌 آسمان این شهر',CA(sel.c))+BTN('solar','🪐 این شهر روی زمین (منظومه)',CA(sel.c));
 el.innerHTML=h;el.insertAdjacentHTML('afterbegin','<button class="x" id="px">✕</button>');$('#px').onclick=()=>{sel=null;panel();sched()};
}
$('#lv').onclick=e=>{const v=e.target.dataset.v;if(!v)return;level=v;[...$('#lv').children].forEach(b=>b.classList.toggle('on',b.dataset.v===v));panel();update()};
document.querySelectorAll('[data-l]').forEach(i=>i.onchange=()=>{layers[i.dataset.l]=i.checked?1:0;if(i.dataset.l==='water')d3.select('#wG').style('display',i.checked?'':'none');update()});
$('#ch').innerHTML=Object.keys(BOX).map(c=>`<button class="chip" data-c="${c}"><i style="background:${CC[c]}"></i>${CN[c]}</button>`).join(' ');
$('#ch').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;const[a,s,c,n]=BOX[b.dataset.c];if(globe)return gFly((a+c)/2,(s+n)/2,Math.max(1,Math.min(8,100/Math.max(c-a,n-s))));const p=proj([a,n]),q=proj([c,s]);zoomPx([[p[0],p[1]],[q[0],q[1]]],8)};
$('#zi').onclick=()=>globe?gFly(-rot[0],-rot[1],Math.min(MAXK,gk*1.6)):svg.transition().call(zoom.scaleBy,1.6);$('#zo').onclick=()=>globe?gFly(-rot[0],-rot[1],Math.max(1,gk/1.6)):svg.transition().call(zoom.scaleBy,1/1.6);
$('#zr').onclick=()=>{sel=null;d3.selectAll('#cG path').classed('sel',false);panel();globe?gFly(50,25,1):svg.transition().duration(700).call(zoom.transform,d3.zoomIdentity)};
$('#q').oninput=e=>{const q=norm(e.target.value.trim()),r=$('#res');if(!q){r.innerHTML='';return}
 const hits=[...D.c.features.filter(f=>norm(f.properties.fa).includes(q)||f.properties.en.toLowerCase().includes(q)).map(f=>({t:f.properties.fa,s:'کشور',f})),
  ...D.cities.filter(c=>norm(c.n).includes(q)||c.e.toLowerCase().includes(q)).map(c=>({t:c.n,s:'شهر',c}))].slice(0,8);
 r.innerHTML='';hits.forEach(h=>{const d=document.createElement('div');d.innerHTML=`${h.t}<small>${h.s}</small>`;d.onclick=()=>{r.innerHTML='';e.target.value='';h.f?pickC(h.f):pickCity(h.c)};r.appendChild(d)})};

function csize(){fl.width=W*dpr;fl.height=H*dpr;if(globe){cv.width=W*dpr;cv.height=H*dpr}else cv.width=cv.height=1}
function gFly(lon,lat,kk){let tl=-lon;while(tl-rot[0]>180)tl-=360;while(tl-rot[0]<-180)tl+=360;
 const ir=d3.interpolate(rot,[tl,Math.max(-90,Math.min(90,-lat))]),ik=d3.interpolate(gk,kk);
 d3.select(cv).transition().duration(900).tween('g',()=>t=>{rot=ir(t);gk=ik(t);gdraw(t<1)})}
function gFlyF(f){const g=f.geometry;let best=f;
 if(g.type==='MultiPolygon'){let ba=-1;for(const c of g.coordinates){const pf={type:'Polygon',coordinates:c},a=d3.geoArea(pf);if(a>ba){ba=a;best=pf}}}
 const[lo,la]=d3.geoCentroid(best),b=d3.geoBounds(best);let w=b[1][0]-b[0][0];if(w<0)w+=360;
 gFly(lo,la,Math.max(1,Math.min(MAXK,90/Math.max(w*Math.cos(la*Math.PI/180),b[1][1]-b[0][1],1))))}
function gdraw(fast){
 const v=view(),ctx=cv.getContext('2d'),aw=W-v.pw,ah=H-HT-v.pb,R=Math.min(aw,ah)/2*.96*gk,cx=aw/2,cy=HT+ah/2,S={type:'Sphere'};
 gp=d3.geoOrthographic().translate([cx,cy]).scale(R).rotate([rot[0],rot[1],0]).clipAngle(90);
 const gpath=d3.geoPath(gp,ctx),F=fast?FL2:gk<3?FL:D.c.features;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
 ctx.beginPath();gpath(S);ctx.fillStyle='#bfe1ef';ctx.fill();
 if(!fast){ctx.beginPath();gpath(d3.geoGraticule10());ctx.strokeStyle='#ffffff88';ctx.lineWidth=.5;ctx.stroke()}
 for(const col in GI){ctx.beginPath();GI[col].forEach(i=>gpath(F[i]));ctx.fillStyle=col;ctx.fill()}
 ctx.beginPath();F.forEach(f=>gpath(f));ctx.strokeStyle='#fff';ctx.lineWidth=.7;ctx.stroke();
 if(layers.water&&!fast){ctx.beginPath();D.lakes.features.forEach(f=>gpath(f));ctx.fillStyle='#bfe1ef';ctx.fill();ctx.strokeStyle='#8fc1da';ctx.lineWidth=.6;ctx.stroke();
  if(!fast){ctx.beginPath();D.rivers.features.forEach(f=>gpath(f));ctx.strokeStyle='#62aed6';ctx.lineWidth=1;ctx.stroke()}}
 if(sel&&sel.f){ctx.beginPath();gpath(sel.f);ctx.strokeStyle='#1d3557';ctx.lineWidth=2.2;ctx.stroke()}
 ctx.beginPath();gpath(S);const gr=ctx.createRadialGradient(cx-.3*R,cy-.3*R,R*.25,cx,cy,R);gr.addColorStop(0,'#ffffff00');gr.addColorStop(1,'#0a2a5a55');ctx.fillStyle=gr;ctx.fill();
 const c=[-rot[0],-rot[1]];
 if(fast){gvis=[];return}
 gvis=layout(gk,l=>d3.geoDistance(l.ll,c)<1.42?gp(l.ll):null,l=>Math.sqrt(l.sr||0)*R);
 dlabels(ctx,gvis,fast);
}
function gHit(e){const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
 for(const[l,x,y]of gvis)if((l.ty==='t'||l.ty==='k')&&Math.abs(px-x)<HR()&&Math.abs(py-y)<HR())return{l};
 const ll=gp.invert([px,py]);if(!ll||d3.geoDistance(ll,[-rot[0],-rot[1]])>1.5)return{};
 return{f:F_find(ll)}}
const F_find=ll=>D.c.features.find(f=>d3.geoContains(f,ll));
let dr=null,ht=0,pt=new Map(),pd=0;
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);pt.set(e.pointerId,[e.clientX,e.clientY]);d3.select(cv).interrupt();
 if(pt.size===2){const[a,b]=[...pt.values()];pd=Math.hypot(a[0]-b[0],a[1]-b[1]);dr=null}else dr={x:e.clientX,y:e.clientY,m:0}};
cv.onpointermove=e=>{
 if(pt.has(e.pointerId))pt.set(e.pointerId,[e.clientX,e.clientY]);
 if(pt.size===2){const[a,b]=[...pt.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pd){gk=Math.max(1,Math.min(MAXK,gk*d/pd));gfast=1;sched()}pd=d;return}
 if(dr){const dx=e.clientX-dr.x,dy=e.clientY-dr.y,s=57.3/gp.scale();dr.x=e.clientX;dr.y=e.clientY;dr.m+=Math.abs(dx)+Math.abs(dy);
  if(dr.m>(e.pointerType==='mouse'?4:10)){tip();rot=[rot[0]+dx*s,Math.max(-90,Math.min(90,rot[1]-dy*s))];gfast=1;sched()}return}
 if(e.pointerType!=='mouse')return;
 const n=performance.now();if(n-ht<50)return;ht=n;const h=gHit(e);cv.style.cursor=h.l||h.f?'pointer':'grab';
 tip(e,h.l?h.l.t+(h.l.e?' — '+fa(h.l.e)+' متر':''):h.f?h.f.properties.fa:null)};
cv.onpointerup=cv.onpointercancel=e=>{pt.delete(e.pointerId);if(pt.size)return;if(pd){pd=0;gfast=0;sched();return}if(!dr)return;const click=dr.m<=(e.pointerType==='mouse'?4:10);dr=null;
 if(click&&e.type==='pointerup'){const h=gHit(e);if(h.l&&h.l.ty==='t')pickCity(h.l.c);else if(h.f)pickC(h.f)}else{gfast=0;sched()}};
cv.addEventListener('wheel',e=>{e.preventDefault();gk=Math.max(1,Math.min(MAXK,gk*(e.deltaY<0?1.15:1/1.15)));gdraw()},{passive:false});
$('#mode').onclick=()=>{globe=!globe;csize();tip();$('#mode').textContent=globe?'🗺️ نقشه تخت':'🌐 نمایش کره';cv.style.display=globe?'block':'none';svg.style('display',globe?'none':'block');globe?gdraw():update()};
$('#gear').onclick=()=>{$('header').classList.toggle('open');HT=$('header').offsetHeight;sched()};
addEventListener('resize',render);render();panel();
if(location.hash.length>1){const f=D.c.features.find(f=>f.properties.a3===location.hash.slice(1));if(f)setTimeout(()=>pickC(f),500)}
/* ---- ارتباط با بخش‌های دیگر ---- */
if(window.Bridge)Bridge.on('ctx',m=>{if(m.cause==='sync')return;
 if(m.opt&&m.opt.a3){const f=D.c.features.find(f=>f.properties.a3===m.opt.a3);if(f)return pickC(f)}
 const p=m.place;if(!p)return;
 const c=D.cities.find(c=>Math.abs(c.x-p.lo)<.06&&Math.abs(c.y-p.la)<.06);
 if(c)return pickCity(c);
 sel=null;panel();sched();
 if(globe)gFly(p.lo,p.la,6);else{const[x,y]=proj([p.lo,p.la]);zoomPx([[x-30,y-20],[x+30,y+20]],9)}});
new ResizeObserver(()=>document.documentElement.style.setProperty('--ph',$('#panel').offsetHeight+'px')).observe($('#panel'));
