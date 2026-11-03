const $=s=>document.querySelector(s),svg=d3.select('#fl');
const PAL=['#f6c6a8','#f4e19b','#b9dfa7','#a9d8de','#c9b8e8','#f3b8c8'];
const fa=(n,m=0)=>n.toLocaleString('fa-IR',{maximumFractionDigits:m});
const pop=n=>n>=1e6?fa(n/1e6,1)+' میلیون نفر':n>0?fa(n)+' نفر':'—';
const norm=s=>(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').toLowerCase();
const row=(a,b)=>`<div class="r"><span>${a}</span><b>${b}</b></div>`;
const KM=(a,b)=>d3.geoDistance([a.x,a.y],[b.x,b.y])*6371;
const KMAX=14,fl=$('#fl'),dpr=Math.min(devicePixelRatio||1,2),IMG=new Image();let HT=60,mode='pol',fdrag=0,fht=0,fr=0,PP,PN,PL,PR,PE,IA,ROUTE=null,fvis=[],W,H,proj,path,T=d3.zoomIdentity,L=[],sel=null,layers={cities:1,roads:1,water:1,labels:1};
const C=D.cities;
const BTNS=c=>`<button class="big" data-go="sky" data-n="${c.n}" data-la="${c.y}" data-lo="${c.x}" data-a="IRN">🌌 آسمان ${c.n}</button><button class="big" data-go="solar" data-n="${c.n}" data-la="${c.y}" data-lo="${c.x}" data-a="IRN">🪐 روی زمین (منظومه)</button>`;
const zoom=d3.zoom().scaleExtent([1,14]).on('start',()=>{fdrag=1;tip()}).on('zoom',e=>{T=e.transform;sched()}).on('end',()=>{fdrag=0;sched()});IMG.src=D.img.u;IMG.onload=()=>sched();
svg.call(zoom).on('dblclick.zoom',null);
D.prov.features.forEach((f,i)=>{f.properties.i=i});
C.forEach(c=>{const f=D.prov.features.find(f=>d3.geoContains(f,[c.x,c.y]));c.pi=f?f.properties.i:-1});
function tip(e,t){const el=$('#tip');if(!t){el.style.display='none';return}el.textContent=t;el.style.display='block';el.style.left=e.clientX+14+'px';el.style.top=e.clientY+14+'px'}
function render(){
 W=innerWidth;H=innerHeight;HT=$('header').offsetHeight;proj=d3.geoMercator().fitExtent([[10,HT+4],[W-view().pw-10,H-10]],{type:'MultiPoint',coordinates:[[43.6,24.4],[63.8,40.2]]});path=d3.geoPath(proj);
 zoom.translateExtent([[0,0],[W,H]]);
 const a=proj(D.img.b[0]),b=proj(D.img.b[1]);IA=[a[0],a[1],b[0]-a[0],b[1]-a[1]];
 PP=D.prov.features.map(f=>new Path2D(path(f)));PN=new Path2D(path(D.nb));PL=new Path2D(path(D.lakes));PR=new Path2D(path(D.rivers));
 const rk=l=>l.ty==='t'&&l.mk<=1?0:l.ty==='t'?1:l.ty==='pr'?2:l.ty==='c'?3:4;
 L=[...D.prov.features.map(f=>({t:f.properties.n,ty:'pr',mk:1,ll:d3.geoCentroid(f)})),...D.lab.map(m=>({t:m.n,ty:m.ty,mk:m.mk,e:m.e,ll:[m.x,m.y]})),...C.map(c=>({t:c.n,ty:'t',mk:c.mk,c,ll:[c.x,c.y]}))]
  .map(l=>{[l.x,l.y]=proj(l.ll);return l}).sort((p,q)=>rk(p)-rk(q)||p.mk-q.mk);
 fl.width=W*dpr;fl.height=H*dpr;svg.call(zoom.transform,d3.zoomIdentity);fdraw();
}
function on(l,k){if(k<l.mk)return 0;
 if(l.ty==='t')return layers.cities;if(l.ty==='pr')return layers.labels&&k<3;if(l.ty==='c')return layers.labels&&k<3;
 if(l.ty==='r'||l.ty==='l')return layers.water;return layers.labels}
function sched(){if(!fr)fr=requestAnimationFrame(()=>{fr=0;fdraw()})}
function update(){sched()}
function layout(k){const bx=[],out=[];
 for(const l of L){if(!l.t)continue;const x=l.x*k+T.x,y=l.y*k+T.y;
  if(x<-60||x>W+60||y<HT+6||y>H+20||!on(l,k))continue;
  const dot=l.ty==='t'||l.ty==='k',w=l.t.length*7.5+(dot?14:0),x0=dot?x-5:x-w/2,y0=y-8;
  if(bx.some(b=>x0<b[2]&&x0+w>b[0]&&y0<b[3]&&y0+16>b[1]))continue;
  bx.push([x0,y0,x0+w,y0+16]);out.push([l,x,y])}
 return out}
function fdraw(){
 const c=fl.getContext('2d'),k=T.k,pol=mode==='pol';
 c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#cfe8f1';c.fillRect(0,0,W,H);
 c.setTransform(dpr*k,0,0,dpr*k,dpr*T.x,dpr*T.y);
 if(IMG.complete&&IA){c.globalAlpha=pol?.5:1;c.imageSmoothingQuality='medium';c.drawImage(IMG,IA[0],IA[1],IA[2],IA[3]);c.globalAlpha=1}
 if(pol){c.globalAlpha=.8;c.fillStyle='#efe9dc';c.fill(PN);c.globalAlpha=1}
 c.lineWidth=.8/k;c.strokeStyle=pol?'#a89f8a':'#a89f8a88';c.stroke(PN);
 PP.forEach((p,i)=>{if(pol){c.globalAlpha=.6;c.fillStyle=PAL[i%6];c.fill(p);c.globalAlpha=1}
  c.lineWidth=(pol?1:1.1)/k;c.strokeStyle=pol?'#fff':'#5b3a1e';c.setLineDash(pol?[]:[5/k,3/k]);c.stroke(p)});c.setLineDash([]);
 if(sel&&sel.p){c.lineWidth=2.4/k;c.strokeStyle='#1d3557';c.stroke(PP[sel.p.properties.i])}
 if(layers.water){c.fillStyle='#a9d4e8';c.fill(PL);c.lineWidth=.7/k;c.strokeStyle='#6fb0cf';c.stroke(PL);if(!fdrag){c.lineWidth=1/k;c.strokeStyle='#4f9cc8';c.stroke(PR)}}
 if(ROUTE){c.lineWidth=3.5/k;c.strokeStyle='#d9502b';c.setLineDash([7/k,5/k]);c.stroke(ROUTE);c.setLineDash([])}
 c.setTransform(dpr,0,0,dpr,0,0);fvis=layout(k);dlabels(c,fvis,fdrag);
}
function dlabels(ctx,vis,fast){
 ctx.direction='ltr';ctx.lineJoin='round';ctx.textBaseline='middle';
 const COL={pr:'#0b5e3a',c:'#8a7f68',t:'#1d3557',m:'#1f6f9c',r:'#1f6f9c',l:'#1f6f9c',p:'#6d3f14',k:'#6b4423'};
 for(const[l,x,y]of vis){const dot=l.ty==='t'||l.ty==='k';
  if(l.ty==='t'){const c=l.c;ctx.beginPath();ctx.arc(x,y,c.cap?5:c.pc?4.2:3,0,7);ctx.fillStyle=c.cap?'#d9502b':c.pc?'#0b7a4b':'#fff';ctx.fill();ctx.strokeStyle='#1d3557';ctx.lineWidth=1.5;ctx.stroke()}
  if(l.ty==='k'){ctx.beginPath();ctx.moveTo(x,y-4.5);ctx.lineTo(x+4.5,y+3);ctx.lineTo(x-4.5,y+3);ctx.closePath();ctx.fillStyle='#8b5a2b';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke()}
  ctx.font=(/[mrl]/.test(l.ty)?'italic ':'')+(l.ty==='pr'?800:l.ty==='c'?600:500)+(l.ty==='pr'?' 14px':l.ty==='c'?' 13px':' 12px')+' V,Tahoma,sans-serif';ctx.textAlign=dot?'left':'center';
  const tx=dot?x+8:x;if(!fast){ctx.lineWidth=3;ctx.strokeStyle='#ffffffd9';ctx.strokeText(l.t,tx,y)}ctx.fillStyle=COL[l.ty];ctx.fillText(l.t,tx,y)}
}
function fhit(e){const r=fl.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;
 for(const[l,x,y]of fvis)if((l.ty==='t'||l.ty==='k')&&Math.abs(px-x)<HR()&&Math.abs(py-y)<HR())return{l};
 const c=fl.getContext('2d');c.setTransform(1,0,0,1,0,0);const qx=(px-T.x)/T.k,qy=(py-T.y)/T.k,i=PP.findIndex(p=>c.isPointInPath(p,qx,qy));
 return i<0?{}:{p:D.prov.features[i]}}
fl.addEventListener('mousemove',e=>{if(fdrag)return;const n=performance.now();if(n-fht<40)return;fht=n;const h=fhit(e);fl.style.cursor=h.l||h.p?'pointer':'grab';
 tip(e,h.l?h.l.t+(h.l.e?' — '+fa(h.l.e)+' متر':''):h.p?'استان '+h.p.properties.n:null)});
fl.addEventListener('mouseleave',()=>tip());
fl.addEventListener('click',e=>{const h=fhit(e);if(h.l&&h.l.ty==='t')pickCity(h.l.c);else if(h.p)pickP(h.p)});
function view(){const m=innerWidth<=760,pb=m&&sel?$('#panel').offsetHeight:0;return{pw:m?0:340,pb}}
const HR=()=>innerWidth<=760?16:9;
function zoomPx([[x0,y0],[x1,y1]],kmax=KMAX){
 const v=view(),aw=W-v.pw,ah=H-HT-v.pb,kk=Math.max(1,Math.min(kmax,.72*Math.min((aw-20)/(x1-x0||1),(ah-20)/(y1-y0||1)))),cx=(x0+x1)/2,cy=(y0+y1)/2;
 svg.transition().duration(900).call(zoom.transform,d3.zoomIdentity.translate(aw/2-cx*kk,HT+ah/2-cy*kk).scale(kk));
}
function mainBounds(f){const g=f.geometry;if(g.type==='Polygon')return path.bounds(f);let best,ba=-1;
 for(const c of g.coordinates){const pf={type:'Polygon',coordinates:c},a=d3.geoArea(pf);if(a>ba){ba=a;best=pf}}return path.bounds(best)}
function mark(){sched()}
function pickP(f){sel={p:f};mark();clearRoute();panel();zoomPx(mainBounds(f))}
function pickCity(c){sel={c};mark();panel();const[x,y]=proj([c.x,c.y]);zoomPx([[x-40,y-25],[x+40,y+25]],10)}
function clearRoute(){ROUTE=null;sched()}
function panel0(){
 const el=$('#panel');
 if(!sel){el.innerHTML=`<h2>اطلس ایران</h2><p>روی یک <b>استان</b> یا <b>شهر</b> کلیک کن. با دکمه‌ی «طبیعی» کوه‌ها و دشت‌ها را ببین و با «فاصله‌ی شهرها» فاصله‌ی دو شهر را حساب کن.</p><button class="big" id="rnd">🎲 یک استان شانسی!</button>`;$('#rnd').onclick=()=>pickP(D.prov.features[Math.floor(Math.random()*31)]);return}
 if(sel.p){const p=sel.p.properties,cs=C.filter(c=>c.pi===p.i),cap=C[p.ci],area=d3.geoArea(sel.p)*6371**2;
  el.innerHTML=`<h2>استان ${p.n}</h2><small dir="ltr">${p.en}</small>`+row('مرکز استان',cap?cap.n:'—')+row('مساحت تقریبی',fa(area)+' کیلومتر مربع')+row('شهرهای ثبت‌شده',fa(cs.length))
   +'<h3>شهرهای بزرگ</h3>'+cs.filter(c=>c.p>0).slice(0,6).map(c=>row(c.n,pop(c.p))).join('')+(cap?BTNS(cap):'');return}
 if(sel.c){const c=sel.c,pv=D.prov.features[c.pi],th=C.find(x=>x.e==='Tehran');
  el.innerHTML=`<h2>${c.n}</h2><small dir="ltr">${c.e}</small>`+row('استان',pv?pv.properties.n:'—')+row('نقش',c.cap?'پایتخت':c.pc?'مرکز استان':'شهر')+row('جمعیت',pop(c.p))+(c===th?'':row('فاصله‌ی هوایی تا تهران',fa(KM(c,th))+' کیلومتر'))
   +`<button class="big" id="go">📏 فاصله تا شهر دیگر</button>${BTNS(c)}`;$('#go').onclick=()=>dpanel(c);return}
}
function closeBtn(el){el.insertAdjacentHTML('afterbegin','<button class="x" id="px">✕</button>');$('#px').onclick=()=>{sel=null;clearRoute();panel();sched()}}
function panel(){panel0();const el=$('#panel');el.classList.toggle('empty',!sel);if(sel)closeBtn(el)}
const opts=()=>C.slice().sort((a,b)=>a.n.localeCompare(b.n,'fa')).map(c=>`<option value="${C.indexOf(c)}">${c.n}</option>`).join('');
function dpanel(a,b){
 const el=$('#panel');sel=null;mark();el.classList.remove('empty');
 el.innerHTML=`<h2>فاصله‌ی دو شهر</h2><label>از</label><select id="sa">${opts()}</select><label>تا</label><select id="sb"><option value="">یک شهر انتخاب کن…</option>${opts()}</select><div id="out"></div>`;
 closeBtn(el);$('#sa').value=a?C.indexOf(a):C.findIndex(c=>c.e==='Tehran');if(b)$('#sb').value=C.indexOf(b);
 const go=()=>calc(C[+$('#sa').value],$('#sb').value===''?null:C[+$('#sb').value]);$('#sa').onchange=go;$('#sb').onchange=go;go();
}
function calc(a,b){
 clearRoute();const o=$('#out');if(!b||a===b){o.innerHTML='';return}
 const air=KM(a,b);
 ROUTE=new Path2D(path({type:'LineString',coordinates:[[a.x,a.y],[b.x,b.y]]}));sched();
 o.innerHTML=`<div class="res">${row('فاصله‌ی هوایی',fa(air)+' کیلومتر')}</div><div class="note">فاصله‌ی هوایی (خط مستقیم روی کره‌ی زمین) است؛ فاصله‌ی جاده‌ای به مسیر راه‌ها بستگی دارد و کمتر یا بیشتر از این عدد است.</div>`;
 const[x0,y0]=proj([Math.min(a.x,b.x),Math.max(a.y,b.y)]),[x1,y1]=proj([Math.max(a.x,b.x),Math.min(a.y,b.y)]);zoomPx([[x0,y0],[x1,y1]],6);
}
$('#md').onclick=e=>{const v=e.target.dataset.v;if(!v)return;mode=v;sched();[...$('#md').children].forEach(b=>b.classList.toggle('on',b.dataset.v===v))};
document.querySelectorAll('[data-l]').forEach(i=>i.onchange=()=>{layers[i.dataset.l]=i.checked?1:0;update()});
$('#dist').onclick=()=>dpanel();
$('#zi').onclick=()=>svg.transition().call(zoom.scaleBy,1.6);$('#zo').onclick=()=>svg.transition().call(zoom.scaleBy,1/1.6);
$('#zr').onclick=()=>{sel=null;mark();clearRoute();panel();svg.transition().duration(700).call(zoom.transform,d3.zoomIdentity)};
$('#q').oninput=e=>{const q=norm(e.target.value.trim()),r=$('#res');if(!q){r.innerHTML='';return}
 const hits=[...D.prov.features.filter(f=>norm(f.properties.n).includes(q)||f.properties.en.toLowerCase().includes(q)).map(f=>({t:'استان '+f.properties.n,s:'استان',f})),
  ...C.filter(c=>norm(c.n).includes(q)||c.e.toLowerCase().includes(q)).map(c=>({t:c.n,s:'شهر',c}))].slice(0,8);
 r.innerHTML='';hits.forEach(h=>{const d=document.createElement('div');d.innerHTML=`${h.t}<small>${h.s}</small>`;d.onclick=()=>{r.innerHTML='';e.target.value='';h.f?pickP(h.f):pickCity(h.c)};r.appendChild(d)})};
$('#gear').onclick=()=>{$('header').classList.toggle('open');HT=$('header').offsetHeight;sched()};
addEventListener('resize',render);render();panel();
/* ---- ارتباط با بخش‌های دیگر ---- */
if(window.Bridge)Bridge.on('ctx',m=>{if(m.cause==='sync')return;const p=m.place;
 if(!p||!(p.lo>43&&p.lo<64&&p.la>24&&p.la<40))return;
 const c=C.find(c=>Math.abs(c.x-p.lo)<.08&&Math.abs(c.y-p.la)<.08);
 if(c)return pickCity(c);const[x,y]=proj([p.lo,p.la]);zoomPx([[x-40,y-25],[x+40,y+25]],10)});
new ResizeObserver(()=>document.documentElement.style.setProperty('--ph',$('#panel').offsetHeight+'px')).observe($('#panel'));
