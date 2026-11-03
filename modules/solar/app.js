const $=id=>document.getElementById(id);
const TAU=Math.PI*2,D2R=Math.PI/180,ZERO=new THREE.Vector3();
const renderer=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(50,1,.05,1200);
const hs=(a,b,d)=>{const n=Math.sin(a*127.1+b*311.7+d*74.7)*43758.5453;return n-Math.floor(n)};
const vn=(X,Y,Z)=>{const xi=Math.floor(X),yi=Math.floor(Y),zi=Math.floor(Z),fx=X-xi,fy=Y-yi,fz=Z-zi,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz);let r=0;
  for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++)r+=hs(xi+i,yi+j,zi+k)*(i?u:1-u)*(j?v:1-v)*(k?w:1-w);return r};
const fbm=(x,y,z)=>{let n=0,a=1,f=1;for(let o=0;o<4;o++){n+=a*vn(x*f,y*f,z*f);a*=.5;f*=2}return n/1.875};

/* stars + sun */
(function(){const n=1500,a=new Float32Array(n*3);for(let i=0;i<n;i++){const u=Math.random()*2-1,t=Math.random()*TAU,r=Math.sqrt(1-u*u);a.set([r*Math.cos(t)*500,u*500,r*Math.sin(t)*500],i*3)}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:1.4,sizeAttenuation:false})))})();
const sun=new THREE.Mesh(new THREE.SphereGeometry(6,48,32),new THREE.MeshBasicMaterial({color:0xffc247}));scene.add(sun);
(function(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,10,64,64,64);
g.addColorStop(0,'rgba(255,200,90,.9)');g.addColorStop(.35,'rgba(255,150,40,.3)');g.addColorStop(1,'rgba(255,120,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(26,26,1);sun.add(s)})();
scene.add(new THREE.PointLight(0xffffff,1.7,0,0));scene.add(new THREE.AmbientLight(0x6f7fb0,.16));

/* continents: simplified outlines (lon,lat) */
const LAND=[
"-168,66 -156,71 -140,69.5 -125,70 -108,68 -95,72 -85,70 -82,66 -90,63 -94,59 -88,56 -82,53 -79,56 -77,62 -70,60 -64,60 -61,55 -56,52 -60,47 -66,44 -70,43 -74,40 -76,35 -81,31 -80,26 -83,29 -89,30 -94,29 -97,26 -97,21 -94,18 -90,21 -87,21 -88,16 -84,15 -83,10 -79,9 -77,8 -80,7 -85,10 -88,13 -92,14 -96,16 -105,20 -110,24 -113,30 -115,32 -118,34 -121,36 -124,40 -124,46 -125,49 -130,54 -135,58 -145,60 -152,59 -158,57 -164,55 -162,59 -165,62",
"-73,78 -60,82 -30,83 -20,80 -20,72 -24,68 -40,65 -44,60 -50,62 -54,68 -58,75 -70,77",
"-77,8 -72,12 -62,10 -52,5 -50,0 -44,-2 -35,-5 -35,-9 -39,-15 -41,-22 -48,-26 -53,-34 -58,-38 -63,-41 -65,-47 -69,-52 -68,-55 -74,-52 -74,-45 -73,-37 -71,-30 -70,-20 -76,-14 -81,-6 -80,-2 -78,2",
"-17,21 -16,28 -10,31 -6,36 10,37 11,33 20,31 25,32 32,31 34,28 38,20 43,12 51,12 48,5 40,-3 40,-11 35,-20 33,-26 28,-33 20,-35 18,-32 12,-18 13,-8 9,-1 9,4 4,6 -5,5 -8,4 -13,8 -17,14",
"-9,37 -9,43 -2,44 -1,47 -5,48 2,51 5,53 8,54 9,57 11,55 14,54 21,55 24,59 30,60 22,60 22,65 17,62 19,59 16,56 12,56 8,58 5,60 5,63 14,68 22,70 30,71 40,68 44,68 55,68 68,69 75,72 90,76 105,78 113,74 130,72 140,72 160,70 170,70 180,68 180,65 170,60 162,57 156,51 155,58 143,59 135,54 141,52 140,48 135,43 130,42 129,36 126,35 125,39 121,40 122,37 119,35 122,31 120,26 116,23 110,21 108,21 106,17 109,12 105,9 101,13 100,8 103,1 98,8 98,16 94,17 92,22 87,21 80,15 78,8 73,17 72,21 67,24 61,25 57,26 56,27 52,28 48,30 50,26 56,25 59,22 52,17 44,12 43,15 39,21 35,28 34,31 36,36 30,36 27,37 26,40 23,37 21,39 19,41 13,45 12,44 16,41 17,40 16,38 12,41 9,44 3,43 0,39 -1,37 -5,36",
"114,-22 122,-18 130,-12 136,-12 137,-16 142,-11 146,-19 153,-26 151,-34 146,-39 140,-38 135,-34 130,-32 124,-34 115,-34 113,-26",
"-5,50 1,51 2,53 -2,57 -5,58 -6,55 -3,54","-24,65 -18,66 -14,65 -18,63.5","130,31 135,34 140,36 142,40 140,42 144,44 141,45 139,38 132,35",
"44,-25 47,-25 50,-15 49,-12 44,-17","95,5 104,-2 106,-6 100,-1","109,1 117,7 119,1 116,-4 110,-3","131,-1 141,-3 150,-10 143,-9 138,-8",
"172,-34 178,-38 175,-41 173,-41","172,-41 174,-42 171,-46 167,-46","-85,22 -80,23 -74,20 -78,20","-80,73 -68,70 -62,66 -66,62 -75,65 -90,70"
].map(s=>s.split(' ').map(p=>p.split(',').map(Number)));

function earthTexture(){
  const W=1024,H=512,m=document.createElement('canvas');m.width=W;m.height=H;const g=m.getContext('2d');
  g.fillStyle='#000';g.fillRect(0,0,W,H);g.fillStyle='#fff';
  const X=l=>(l+180)/360*W,Y=l=>(90-l)/180*H;
  LAND.forEach(p=>{g.beginPath();p.forEach(([lo,la],i)=>i?g.lineTo(X(lo),Y(la)):g.moveTo(X(lo),Y(la)));g.closePath();g.fill()});
  g.fillRect(0,Y(-68),W,H-Y(-68));
  const md=g.getImageData(0,0,W,H),d=md.data;
  for(let py=0;py<H;py++){const lat=(.5-py/H)*Math.PI,al=Math.abs(lat)/D2R,cl=Math.cos(lat),sl=Math.sin(lat);
    for(let px=0;px<W;px++){const i=(py*W+px)*4,mk=d[i]/255,lon=(px/W-.5)*TAU,lonD=lon/D2R;
      let r=16,gg=58,b=132;
      if(al>76){const k=Math.min(1,(al-76)/6);r+=(235-r)*k;gg+=(240-gg)*k;b+=(250-b)*k}
      if(mk>.02){const x=cl*Math.sin(lon),z=cl*Math.cos(lon),n=fbm(x*3+9,sl*3+9,z*3+9),n2=fbm(x*2+40,sl*2+40,z*2+40);
        let lr=55+n*70,lg=112+n*45,lb=52+n*25;
        if(al>12&&al<38){const k=Math.max(0,Math.min(1,(n2-.45)*5));lr+=(214-lr)*k;lg+=(186-lg)*k;lb+=(122-lb)*k}
        const tk=Math.max(0,Math.min(1,(al-52)/14));lr+=(150-lr)*tk;lg+=(160-lg)*tk;lb+=(150-lb)*tk;
        if(lat<-1.15||(lat>1.04&&lonD>-75&&lonD<-10)||al>72){lr=lg=lb=240}
        r+=(lr-r)*mk;gg+=(lg-gg)*mk;b+=(lb-b)*mk}
      d[i]=r;d[i+1]=gg;d[i+2]=b;d[i+3]=255}}
  g.putImageData(md,0,0);return new THREE.CanvasTexture(m)}
function bands(cols){const c=document.createElement('canvas');c.width=8;c.height=256;const g=c.getContext('2d');let y=0,k=0;
  while(y<256){const h=6+hs(k,1,2)*20;g.fillStyle=cols[Math.floor(hs(k,5,7)*cols.length)];g.fillRect(0,y,8,h+1);y+=h;k++}return new THREE.CanvasTexture(c)}

/* planets and moons */
const defs=[
['عطارد',12,.4,0xb5a79a,88,2.6,[]],['زهره',18,.9,0xe8c27a,225,5,[]],
['زمین',26,1.1,0xffffff,365.25,6,[['ماه',2.8,.3,27.32,0xbdbdbd]]],
['مریخ',34,.6,0xc8603a,687,5,[['فوبوس',1.1,.08,.319,0x8a7f78],['دیموس',1.6,.07,1.263,0x8a7f78]]],
['مشتری',50,3,0xd9b38c,4333,20,[['ایو',5,.28,1.769,0xe6d36a],['اروپا',6.1,.25,3.551,0xd9cfc0],['گانیمد',7.4,.38,7.155,0xa89a8a],['کالیستو',9,.34,16.69,0x6f655c]]],
['کیوان',66,2.5,0xe3cf9a,10759,27,[['انسلادوس',6.4,.12,1.37,0xf2f2f2],['رئا',8,.2,4.52,0xcfcfcf],['تیتان',10.2,.35,15.95,0xe0a840],['یاپتوس',13,.18,79.3,0xb8aea0]]],
['اورانوس',80,1.6,0x9fe0e6,30687,13,[['میراندا',2.6,.1,1.41,0xbfc4c7],['آریل',3.4,.15,2.52,0xc3c8ca],['تیتانیا',4.4,.2,8.71,0xb0b5b8],['اوبرون',5.4,.2,13.46,0xa5a7a8]]],
['نپتون',92,1.5,0x4a6ee0,60190,11,[['تریتون',4,.2,-5.88,0xcfd8de]]]];
function label(t){const d=document.createElement('div');d.className='lbl';d.textContent=t;$('labels').appendChild(d);return d}
const orbitLines=new THREE.Group();scene.add(orbitLines);
const bodies=[],moons=[],F=[];
const sunF={name:'خورشید',pos:()=>ZERO,dist:28,min:9,sp:2};F.push(sunF);const sunL=label('خورشید');
const circ=(R,col,op)=>{const p=[];for(let k=0;k<=160;k++){const a=k/160*TAU;p.push(new THREE.Vector3(Math.cos(a)*R,0,-Math.sin(a)*R))}
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(p),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op}))};
defs.forEach((d,i)=>{
  const [name,R,r,col,per,fd,ms]=d,piv=new THREE.Group();scene.add(piv);
  const mat=new THREE.MeshStandardMaterial({color:col,roughness:.9});
  if(name==='زمین')mat.map=earthTexture();
  if(name==='مشتری'){mat.map=bands(['#d8b894','#b88b66','#e9d5b8','#a8764f','#d9bf9a','#c49a70']);mat.color.set(0xffffff)}
  if(name==='کیوان'){mat.map=bands(['#e3cf9a','#cdb87f','#ead9ab','#d4c08a']);mat.color.set(0xffffff)}
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),mat);
  if(name==='زمین'){const t=new THREE.Group();t.rotation.z=23.5*D2R;piv.add(t);t.add(m)}else piv.add(m);
  if(name==='کیوان'){const ring=new THREE.Mesh(new THREE.RingGeometry(r*1.35,r*2.2,64),new THREE.MeshBasicMaterial({color:0xcdb98a,side:THREE.DoubleSide,transparent:true,opacity:.7}));ring.rotation.x=Math.PI/2;piv.add(ring)}
  orbitLines.add(circ(R,name==='زمین'?0x5ec2ff:0x8aa0d8,name==='زمین'?.6:.28));
  const b={name,R,r,per,a0:name==='زمین'?-TAU*93/365.25:i*1.3,piv,m,lbl:label(name)};bodies.push(b);
  const f={name,pos:()=>piv.position,dist:fd,min:Math.max(r*1.6,.7),b,sp:name==='زمین'?0:(i<4?1:0)};F.push(f);
  ms.forEach((q,k)=>{
    const mm=new THREE.Mesh(new THREE.SphereGeometry(q[2],20,14),new THREE.MeshStandardMaterial({color:q[4],roughness:1}));scene.add(mm);
    const ring=circ(q[1],0x8aa0d8,.3);piv.add(ring);
    const o={name:q[0],a:q[1],per:q[3],ph:k*1.7+i,mesh:mm,pl:b,ring,lbl:label(q[0])};moons.push(o);
    if(name==='زمین')F.push({name:q[0],pos:()=>mm.position,dist:1.7,min:.55,m:o,sp:1})});
});
const earth=bodies[2],earthF=F.find(f=>f.b===earth),spinM=earth.m,tiltG=spinM.parent;
/* Iran marker (Tehran) + axis helpers */
let LON=51.4*D2R,LAT=35.7*D2R,PN='ایران',PZ='Asia/Tehran';
const marker=new THREE.Mesh(new THREE.SphereGeometry(.05,12,8),new THREE.MeshBasicMaterial({color:0xfff2a8}));
function placeMarker(){marker.position.set(Math.cos(LAT)*Math.cos(LON)*1.11,Math.sin(LAT)*1.11,-Math.cos(LAT)*Math.sin(LON)*1.11)}placeMarker();marker.visible=false;spinM.add(marker);
const ax=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2.6,0),new THREE.Vector3(0,2.6,0)]),new THREE.LineBasicMaterial({color:0xff6b6b}));
const np=new THREE.Mesh(new THREE.SphereGeometry(.09,12,8),new THREE.MeshBasicMaterial({color:0xffe34d}));np.position.set(0,2.6,0);
const vl=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-2.6,0),new THREE.Vector3(0,2.6,0)]),new THREE.LineDashedMaterial({color:0xffffff,dashSize:.15,gapSize:.12,transparent:true,opacity:.6}));
vl.computeLineDistances();tiltG.add(ax,np);earth.piv.add(vl);ax.visible=np.visible=vl.visible=false;

/* camera + focus */
let yaw=.5,pitch=.55,dist=150,tDist=150,minD=5,blend=1,focus=null;const target=new THREE.Vector3(),fromPos=new THREE.Vector3();
const ptrs=new Map();let pinch=0,down=null;
const zoom=f=>{tDist=Math.max(minD,Math.min(300,tDist*f))};
const cv=$('c');
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);pinch=0;down=ptrs.size===1?[e.clientX,e.clientY]:null});
const up=e=>{ptrs.delete(e.pointerId);if(down&&!ptrs.size&&e.type==='pointerup'&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<6)tap(e.clientX,e.clientY);if(!ptrs.size)down=null};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const p=ptrs.get(e.pointerId);
  if(ptrs.size===1){yaw-=(e.clientX-p[0])*.005;pitch=Math.max(-1.5,Math.min(1.5,pitch+(e.clientY-p[1])*.005))}
  ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===2){down=null;const [a,b]=[...ptrs.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)zoom(pinch/d);pinch=d}});
cv.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(e.deltaY*.0012))},{passive:false});
const v=new THREE.Vector3();
function tap(x,y){let best=null,bd=42;F.forEach(f=>{if(f.m&&!focus)return;v.copy(f.pos()).project(camera);if(v.z>1)return;
  const d=Math.hypot((v.x*.5+.5)*innerWidth-x,(-v.y*.5+.5)*innerHeight-y);if(d<bd){bd=d;best=f}});if(best&&best!==focus)setFocus(best)}
const allBtn=document.createElement('button');allBtn.textContent='کل منظومه';allBtn.onclick=()=>setFocus(null);$('chips').appendChild(allBtn);
F.forEach(f=>{f.btn=document.createElement('button');f.btn.textContent=f.name;f.btn.onclick=()=>setFocus(f);$('chips').appendChild(f.btn)});
let speed=365.25/20,paused=false,dir=1,days=93.5;
const SPD=[1/8,30/8,365.25/20];
function setSpeed(i){speed=SPD[i];paused=false;$('sp').setAttribute('aria-pressed','false');[0,1,2].forEach(k=>$('s'+k).classList.toggle('on',k===i))}
function setFocus(f,keep){fromPos.copy(target);blend=0;focus=f;tDist=f?f.dist:150;minD=f?f.min:5;if(!f)pitch=.55;
  allBtn.classList.toggle('on',!f);F.forEach(x=>x.btn.classList.toggle('on',x===f));if(!keep)setSpeed(f?f.sp:2)}
setFocus(null);blend=1;
$('sp').onclick=()=>{paused=!paused;$('sp').setAttribute('aria-pressed',paused)};
[0,1,2].forEach(i=>$('s'+i).onclick=()=>setSpeed(i));
$('rev').onclick=e=>{dir=-dir;e.currentTarget.setAttribute('aria-pressed',dir<0)};
const idxOf=()=>((Math.floor(days)%365)+365)%365;
const QS=[0,93,186,276];
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const fr=days-Math.floor(days);days=days-idxOf()+QS[b.dataset.q]+fr;if(focus!==earthF){setFocus(earthF);tDist=14}});
const tog=(id,fn)=>$(id).onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',on);fn(on)};
const setAxis=on=>{ax.visible=np.visible=vl.visible=on;$('tAxis').setAttribute('aria-pressed',on)};
let orbOn=true;tog('tAxis',setAxis);tog('tOrb',on=>orbOn=on);tog('tIran',on=>marker.visible=on);
tog('tg',on=>$('bar').style.display=on?'flex':'none');
$('vSide').onclick=()=>{if(focus!==earthF)setFocus(earthF);yaw=0;pitch=.05;tDist=Math.max(tDist,9);setAxis(true)};
const pause=()=>{paused=true;$('sp').setAttribute('aria-pressed','true')};
$('hr').oninput=()=>{pause();days=Math.floor(days)+$('hr').value/24};
$('dy').oninput=()=>{pause();days=days-idxOf()+(+$('dy').value)};

const fa=s=>String(s).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'],ml=[31,31,31,31,31,31,30,30,30,30,30,29];
const seas=['بهار','تابستان','پاییز','زمستان'];
const why=['قطب شمال کم‌کم به سمت خورشید می‌چرخد؛ روزها بلندتر و هوا گرم‌تر می‌شود.','قطب شمال به سمت خورشید کج شده؛ نور مستقیم‌تر می‌تابد و روزهای نیم‌کرهٔ شمالی بلندتر است.','قطب شمال کم‌کم از خورشید دور می‌شود؛ نور مایل‌تر می‌شود و روزها کوتاه‌تر.','قطب شمال از خورشید دور شده؛ نور مایل می‌تابد و روزها کوتاه است. در نیم‌کرهٔ جنوبی برعکس است.'];
const hm=h=>{h=((h%24)+24)%24;return fa(String(Math.floor(h)).padStart(2,'0')+':'+String(Math.floor((h%1)*60)).padStart(2,'0'))};
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
function place(l,pos,show){v.copy(pos).project(camera);if(!show||v.z>1){l.style.display='none';return}
  l.style.display='block';l.style.transform=`translate(${(v.x*.5+.5)*innerWidth}px,${(-v.y*.5+.5)*innerHeight}px) translate(-50%,-140%)`}

const ep=new THREE.Vector3(),sD=new THREE.Vector3(),tmp=new THREE.Vector3(),cur=new THREE.Vector3();
let last=performance.now(),fc=0;
function frame(t){
  if(window.Bridge&&!Bridge.visible){last=t;requestAnimationFrame(frame);return}
  const dt=Math.min(.05,(t-last)/1000);last=t;
  if(!paused)days+=dt*speed*dir;
  bodies.forEach(b=>{const a=b.a0+TAU*days/b.per;b.piv.position.set(Math.cos(a)*b.R,0,-Math.sin(a)*b.R)});
  moons.forEach(m=>{const a=m.ph+TAU*days/m.per,p=m.pl.piv.position;m.mesh.position.set(p.x+Math.cos(a)*m.a,0,p.z-Math.sin(a)*m.a);
    m.mesh.visible=!!focus;m.ring.visible=!!focus&&orbOn});
  orbitLines.visible=orbOn;
  /* earth spin tied to local solar time in Iran */
  const fr=days-Math.floor(days),fast=!paused&&Math.abs(speed)>4;
  ep.copy(earth.piv.position);sD.copy(ep).negate().normalize();
  const sig=Math.atan2(-sD.z,sD.x*Math.cos(23.5*D2R));
  spinM.rotation.y=sig+((fast?12:fr*24)-12)/24*TAU-LON;
  /* camera */
  blend+=(1-blend)*(1-Math.exp(-dt*3));if(blend>.998)blend=1;const e=blend*blend*(3-2*blend);
  cur.copy(focus?focus.pos():ZERO);target.lerpVectors(fromPos,cur,e);
  dist+=(tDist-dist)*(1-Math.exp(-dt*4));
  camera.position.set(target.x+dist*Math.cos(pitch)*Math.sin(yaw),target.y+dist*Math.sin(pitch),target.z+dist*Math.cos(pitch)*Math.cos(yaw));
  camera.lookAt(target);
  /* labels */
  place(sunL,ZERO,!(focus===sunF&&dist<40));
  bodies.forEach(b=>place(b.lbl,b.piv.position,!(focus&&focus.b===b&&dist<b.r*7)));
  moons.forEach(m=>place(m.lbl,m.mesh.position,!!focus&&(focus.b===m.pl||focus.m===m)&&dist<m.a*10+10));
  /* info + sliders */
  if(++fc%5===0){
    const idx=idxOf();let r=idx,mo=0;while(r>=ml[mo]){r-=ml[mo];mo++}
    const q=Math.floor(mo/3);
    $('date').textContent=fa(r+1)+' '+months[mo];$('clock').textContent=hm(fr*24);
    $('sN').textContent=seas[q];$('sS').textContent=seas[(q+2)%4];$('why').textContent=why[q]+' (فصل‌ها از کجی محور می‌آیند، نه از فاصله با خورشید.)';
    marker.updateWorldMatrix(true,false);marker.getWorldPosition(tmp);tmp.sub(ep).normalize();
    const dd=tmp.dot(sD),el=Math.asin(Math.max(-1,Math.min(1,dd)))/D2R;$('dn').textContent=(dd>.03?'روز ☀️':'شب 🌙')+' · '+(el>=0?'خورشید ':'زیر افق ')+fa(Math.round(Math.abs(el)))+'°';$('pn').textContent=$('pn2').textContent=PN;
    $('hl').textContent=hm(fr*24);$('dl').textContent=fa(r+1)+' '+months[mo];
    if(document.activeElement!==$('hr'))$('hr').value=fr*24;
    if(document.activeElement!==$('dy'))$('dy').value=idx}
  renderer.render(scene,camera);requestAnimationFrame(frame)}
requestAnimationFrame(frame);
/* ---- ارتباط با بخش‌های دیگر ---- */
const YR0=new Date().getFullYear();
function curPlace(){return{n:PN,la:LAT/D2R,lo:LON/D2R,z:PZ}}
function setPlace(p){LAT=p.la*D2R;LON=p.lo*D2R;PN=p.n;PZ=p.z||PZ;placeMarker();marker.visible=true;$('tIran').setAttribute('aria-pressed','true')}
function setTime(ms){const S=ms+LON/D2R/15*36e5,Y=new Date(S).getUTCFullYear();let d=(S-Date.UTC(Y,2,21))/864e5;if(d<0)d=(S-Date.UTC(Y-1,2,21))/864e5;days=d%365;pause()}
function curMs(){const fr=days-Math.floor(days);return Date.UTC(YR0,2,21)+(idxOf()+fr)*864e5-LON/D2R/15*36e5}
$('toSky').onclick=()=>Bridge.go('sky',{place:curPlace(),time:{ms:curMs()}});
$('toMap').onclick=()=>Bridge.go('atlas',{place:curPlace()});
if(window.Bridge)Bridge.on('ctx',m=>{if(m.place)setPlace(m.place);
 if(m.cause!=='sync'&&(m.place||m.time)){setFocus(earthF);tDist=7}
 if(m.time)setTime(m.time.ms)});
$('mt').onclick=()=>{const o=$('bar').classList.toggle('open');$('mt').textContent=o?'⚙️ کنترل‌ها ▾':'⚙️ کنترل‌ها ▴'};
