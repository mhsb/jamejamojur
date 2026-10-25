const RAW=`ایران|تهران,35.69,51.39,Asia/Tehran;تبریز,38.08,46.29,Asia/Tehran;مشهد,36.3,59.6,Asia/Tehran;یزد,31.9,54.37,Asia/Tehran,d;چابهار,25.29,60.64,Asia/Tehran
ترکیه|استانبول,41.01,28.98,Europe/Istanbul;ارزروم,39.9,41.27,Europe/Istanbul
عربستان|ریاض,24.71,46.68,Asia/Riyadh,d
امارات|دبی,25.2,55.27,Asia/Dubai,d
پاکستان|کراچی,24.86,67.0,Asia/Karachi;اسلام‌آباد,33.68,73.05,Asia/Karachi
هند|دهلی نو,28.61,77.21,Asia/Kolkata;چنای,13.08,80.27,Asia/Kolkata;لِه (لداخ),34.16,77.58,Asia/Kolkata
نپال|کاتماندو,27.72,85.32,Asia/Kathmandu
مالدیو|مالـه,4.18,73.51,Indian/Maldives
تایلند|بانکوک,13.76,100.5,Asia/Bangkok
سنگاپور|سنگاپور,1.35,103.82,Asia/Singapore
اندونزی|جاکارتا,-6.2,106.85,Asia/Jakarta
چین|پکن,39.9,116.4,Asia/Shanghai;لهاسا,29.65,91.14,Asia/Shanghai;ارومچی,43.83,87.62,Asia/Urumqi
مغولستان|اولان‌باتور,47.89,106.91,Asia/Ulaanbaatar
ژاپن|توکیو,35.68,139.69,Asia/Tokyo;ساپورو,43.06,141.35,Asia/Tokyo
روسیه|مسکو,55.75,37.62,Europe/Moscow;یاکوتسک,62.03,129.73,Asia/Yakutsk;ولادی‌وستوک,43.12,131.89,Asia/Vladivostok
فنلاند|روواینیمی,66.5,25.72,Europe/Helsinki
نروژ|اسلو,59.91,10.75,Europe/Oslo;ترومسو,69.65,18.96,Europe/Oslo;لونگیربین (سوالبارد),78.22,15.63,Arctic/Longyearbyen
ایسلند|ریکیاویک,64.15,-21.94,Atlantic/Reykjavik
گرینلند|نوک,64.18,-51.72,America/Nuuk
بریتانیا|لندن,51.51,-0.13,Europe/London
فرانسه|پاریس,48.86,2.35,Europe/Paris
آلمان|برلین,52.52,13.4,Europe/Berlin
اسپانیا|مادرید,40.42,-3.7,Europe/Madrid
ایتالیا|رم,41.9,12.5,Europe/Rome
یونان|آتن,37.98,23.73,Europe/Athens
مراکش|مراکش,31.63,-8.0,Africa/Casablanca
الجزایر|تمنراست,22.79,5.52,Africa/Algiers,d
مصر|قاهره,30.04,31.24,Africa/Cairo,d
نیجریه|لاگوس,6.52,3.38,Africa/Lagos
کنیا|نایروبی,-1.29,36.82,Africa/Nairobi
ماداگاسکار|آنتاناناریوو,-18.88,47.51,Indian/Antananarivo
آفریقای جنوبی|کیپ‌تاون,-33.92,18.42,Africa/Johannesburg;ژوهانسبورگ,-26.2,28.05,Africa/Johannesburg
استرالیا|سیدنی,-33.87,151.21,Australia/Sydney;پرت,-31.95,115.86,Australia/Perth;داروین,-12.46,130.84,Australia/Darwin;آلیس‌اسپرینگز,-23.7,133.88,Australia/Darwin,d
نیوزیلند|اوکلند,-36.85,174.76,Pacific/Auckland;ولینگتون,-41.29,174.78,Pacific/Auckland
جنوبگان|ایستگاه مک‌موردو,-77.85,166.67,Antarctica/McMurdo,p
آمریکا|نیویورک,40.71,-74.01,America/New_York;لس‌آنجلس,34.05,-118.24,America/Los_Angeles;فینیکس,33.45,-112.07,America/Phoenix,d;هونولولو,21.31,-157.86,Pacific/Honolulu;آنکوریج,61.22,-149.9,America/Anchorage
کانادا|تورنتو,43.65,-79.38,America/Toronto;ایکالوئیت,63.75,-68.52,America/Iqaluit
مکزیک|مکزیکوسیتی,19.43,-99.13,America/Mexico_City
کلمبیا|بوگوتا,4.71,-74.07,America/Bogota
اکوادور|کیتو,-0.18,-78.47,America/Guayaquil
پرو|کوسکو,-13.53,-71.97,America/Lima
برزیل|ریو دو ژانیرو,-22.91,-43.17,America/Sao_Paulo;مائوس,-3.12,-60.02,America/Manaus
شیلی|سانتیاگو,-33.45,-70.67,America/Santiago;آنتوفاگاستا,-23.65,-70.4,America/Santiago,d;پونتاآرناس,-53.16,-70.91,America/Punta_Arenas
آرژانتین|بوئنوس‌آیرس,-34.6,-58.38,America/Argentina/Buenos_Aires;اوشوآیا,-54.8,-68.3,America/Argentina/Ushuaia`;
const DB={};RAW.trim().split('\n').forEach(l=>{const[a,b]=l.split('|'),ok=[];b.split(';').forEach(x=>{const q=x.split(',');try{new Intl.DateTimeFormat('en',{timeZone:q[3]});ok.push([q[0],+q[1],+q[2],q[3],q[4]||''])}catch(e){}});if(ok.length)DB[a]=ok});
const $=id=>document.getElementById(id),fa=s=>String(s).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]),pad=n=>String(n).padStart(2,'0');
const R=Math.PI/180,YR=new Date().getFullYear(),DAY=864e5,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(A,B,k)=>A.map((v,i)=>v+(B[i]-v)*k),rgb=a=>'rgb('+a.map(Math.round)+')';
const rnd=s=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const cv=$('cv'),ctx=cv.getContext('2d');
let W=1,H=1,f=1,yaw=180,pitch=20,fov=75,cY,sY,cP,sP,city,mins=720,doyF=1,mode=0,wsel='auto',last=0,lastInfo=0,lastSun={az:180,el:30};
function resize(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
new ResizeObserver(resize).observe(cv);

function sun(ms){const n=(ms-Date.UTC(new Date(ms).getUTCFullYear(),0,0))/DAY,B=2*Math.PI*(n-81)/364,
 eot=9.87*Math.sin(2*B)-7.53*Math.cos(B)-1.5*Math.sin(B);return{dec:23.45*Math.sin(B),lon:-15*((ms%DAY)/36e5-12+eot/60)}}
function sunAt(la,lo,ms){const s=sun(ms),h=(lo-s.lon)*R,p=la*R,d=s.dec*R,
 se=Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(h),el=Math.asin(cl(se,-1,1));
 let az=Math.acos(cl((Math.sin(d)-Math.sin(el)*Math.sin(p))/((Math.cos(el)*Math.cos(p))||1e-9),-1,1))/R;
 if(Math.sin(h)>0)az=360-az;return{el:el/R,az}}
const fm={};
function off(z,ms){const q=fm[z]||(fm[z]=new Intl.DateTimeFormat('en-US',{timeZone:z,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}));
 const o={};q.formatToParts(new Date(ms)).forEach(p=>o[p.type]=+p.value);return Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute,o.second)-Math.floor(ms/1000)*1000}
function getMs(){const g=Date.UTC(YR,0,1)+(Math.floor(doyF)-1)*DAY+mins*6e4;return g-off(city.z,g-off(city.z,g))}
function P(az,el){const a=az*R,e=el*R,x=Math.cos(e)*Math.sin(a),y=Math.sin(e),z=Math.cos(e)*Math.cos(a),
 x1=x*cY-z*sY,z1=x*sY+z*cY,y2=y*cP-z1*sP,z2=y*sP+z1*cP;return{x:x1,y:y2,z:z2,sx:W/2+f*x1/z2,sy:H/2-f*y2/z2}}

function wx(){const lat=city.la,al=Math.abs(lat),doy=Math.floor(doyF),ph=2*Math.PI*(doy-15-(lat<0?182.6:0))/365,w=-Math.cos(ph),rise=Math.sin(ph)>0,
 temp=27-.4*al+.33*al*w-(city.f==='p'?22:0),trop=al<18,r1=rnd(doy*7+city.i*13),r2=rnd(doy*3+city.i*29+5),mid=Math.abs(w)<.5&&!trop,
 p=(trop?.2+.35*(lat>=0?w+1:1-w)/2:.12+.28*(1-w)/2+(mid?.1:0))*(city.f==='d'?.1:1);
 let wind=.2+.45*r2+(mid?.2:0),type='clear';
 if(r1<p)type=temp<1.5?'snow':'rain';else if(wind>.62)type='wind';
 if(wsel!=='auto')type=wsel;
 if(type==='wind')wind=Math.max(wind,.75);else if(type!=='clear')wind=Math.max(.3,wind);else wind=Math.min(wind,.35);
 return{type,wind,temp,trop,snow:city.f==='p'?1:Math.max(cl((2-temp)/4,0,1),type==='snow'?.35:0),
 leaf:trop?'green':temp<5?'bare':rise&&temp<15?'spring':!rise&&temp<17?'autumn':'green',
 season:trop?'مناطق گرمسیری':w<-.6?'زمستان':w>.6?'تابستان':rise?'بهار':'پاییز',
 cloud:type==='clear'?.12:type==='wind'?.3:.9}}

const SK=[[-18,[4,8,28],[10,18,48]],[-8,[14,24,64],[60,50,100]],[-2,[40,50,110],[240,120,70]],[4,[70,110,180],[250,190,130]],[15,[50,125,210],[170,210,245]],[40,[35,110,200],[150,200,240]]];
function skyCol(e){if(e<=SK[0][0])return[SK[0][1],SK[0][2]];
 for(let i=1;i<SK.length;i++)if(e<=SK[i][0]){const k=(e-SK[i-1][0])/(SK[i][0]-SK[i-1][0]);return[mix(SK[i-1][1],SK[i][1],k),mix(SK[i-1][2],SK[i][2],k)]}
 const l=SK[SK.length-1];return[l[1],l[2]]}

const ST=Array.from({length:260},(_,i)=>({az:rnd(i)*360,el:Math.asin(rnd(i+300))/R,r:.7+rnd(i+600)*1.4}));
const CL=Array.from({length:10},(_,i)=>({az:rnd(i+9)*360,el:14+rnd(i+19)*45,a:14+rnd(i+29)*14}));
const PT=Array.from({length:260},(_,i)=>({x:rnd(i+41)*900,y:rnd(i+77)*700,v:rnd(i+99)}));
const WS=Array.from({length:18},(_,i)=>({x:rnd(i+5)*900,y:40+rnd(i+15)*500,l:40+rnd(i+25)*70}));
const TR=Array.from({length:30},(_,i)=>({az:i*12+rnd(i)*10,d:14+rnd(i+50)*55,h:5+rnd(i+70)*3,p:i*1.7})).sort((a,b)=>b.d-a.d);

function cloud(x,y,s,c){ctx.fillStyle=c;ctx.beginPath();[[0,0,46],[40,-12,38],[78,2,42],[-38,6,34],[28,10,40]].forEach(([a,b,r])=>{ctx.moveTo(x+a*s+r*s*.7,y+b*s);ctx.arc(x+a*s,y+b*s,r*s*.7,0,7)});ctx.fill()}
function hill(amp,fr,p,col){ctx.fillStyle=col;ctx.beginPath();let a=null,b=null;
 for(let k=-110;k<=110;k+=3){const az=yaw+k,q=P(az,amp*(1+.6*Math.sin(az*R*fr+p)+.4*Math.sin(az*R*fr*2.3+p*1.7))/2);
  if(q.z>.02){if(!a){a=q;ctx.moveTo(q.sx,H+50);}ctx.lineTo(q.sx,q.sy);b=q}}
 if(b){ctx.lineTo(b.sx,H+50);ctx.fill()}}

function draw(T,dt){
 const ms=getMs(),s=sunAt(city.la,city.lo,ms),e=s.el,k=wx();lastSun=s;
 cY=Math.cos(yaw*R);sY=Math.sin(yaw*R);cP=Math.cos(pitch*R);sP=Math.sin(pitch*R);f=(H/2)/Math.tan(fov*R/2);
 const L=cl((e+6)/22,.07,1),[top,hor]=skyCol(e),grey=[126,134,146].map(v=>v*(.25+.75*L)),ov=k.cloud*(k.type==='rain'||k.type==='snow'?.8:.35);
 const yh=H/2+f*Math.tan(pitch*R);
 let g=ctx.createLinearGradient(0,0,0,H);
 for(let i=0;i<=10;i++){const th=pitch+Math.atan((H/2-H*i/10)/f)/R,t=Math.pow(cl(th/65,0,1),.7);
  g.addColorStop(i/10,rgb(mix(mix(hor,top,t),grey,ov*(.6+.3*t))))}
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const sa=cl((-e-5)/10,0,1)*(1-k.cloud*.9),sv=1-k.cloud*.75;
 if(sa>0)ST.forEach((q,i)=>{const p=P(q.az,q.el);if(p.z>.02){ctx.fillStyle=`rgba(255,255,255,${sa*(.6+.4*Math.sin(T*2+i))})`;ctx.fillRect(p.sx,p.sy,q.r,q.r)}});
 const h0=P(s.az,0);
 if(Math.abs(e)<14&&h0.z>.02){g=ctx.createRadialGradient(h0.sx,h0.sy,10,h0.sx,h0.sy,f*.9);g.addColorStop(0,`rgba(255,140,60,${.4*(1-Math.abs(e)/14)*sv})`);g.addColorStop(1,'rgba(255,140,60,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 const sp=P(s.az,e);
 if(sp.z>.02&&e>-4){const c=mix([255,110,40],[255,244,200],cl(e/18,0,1)),gr=f*.32,r=Math.max(9,f*Math.tan(2.6*R));
  g=ctx.createRadialGradient(sp.sx,sp.sy,r*.5,sp.sx,sp.sy,gr);g.addColorStop(0,`rgba(${c.map(Math.round)},${.55*sv})`);g.addColorStop(1,`rgba(${c.map(Math.round)},0)`);
  ctx.fillStyle=g;ctx.fillRect(sp.sx-gr,sp.sy-gr,gr*2,gr*2);ctx.globalAlpha=.4+.6*sv;ctx.fillStyle=rgb(c);ctx.beginPath();ctx.arc(sp.sx,sp.sy,r,0,7);ctx.fill();ctx.globalAlpha=1}
 const mp=P((s.az+180)%360,-e);
 if(mp.z>.02&&-e>-2){ctx.globalAlpha=(1-k.cloud*.7)*cl((-e+2)/8,0,1);ctx.fillStyle='#eef2ff';ctx.beginPath();ctx.arc(mp.sx,mp.sy,Math.max(8,f*Math.tan(2.2*R)),0,7);ctx.fill();ctx.globalAlpha=1}
 const lm=ms-mins*6e4;ctx.fillStyle='rgba(255,255,255,.45)';
 for(let i=0;i<=48;i++){const q=sunAt(city.la,city.lo,lm+i*18e5);if(q.el>-1){const p=P(q.az,q.el);if(p.z>.02){ctx.beginPath();ctx.arc(p.sx,p.sy,2,0,7);ctx.fill()}}}
 const warm=cl(1-Math.abs(e-2)/10,0,1)*.35,cc=mix(mix([255,255,255],[92,100,114],k.cloud>.6?.7:.1),[255,170,120],warm).map(v=>v*(.22+.78*L)),n=Math.round(2+k.cloud*8);
 CL.forEach((c,i)=>{c.az=(c.az+(.6+5*k.wind)*dt)%360;if(i<n){const p=P(c.az,c.el);if(p.z>.02)cloud(p.sx,p.sy,f*c.a*R/160,rgb(cc))}});
 const base=city.f==='d'?[196,166,112]:k.trop?[70,140,70]:mix([150,125,80],[88,155,72],cl((k.temp-2)/12,0,1));
 let gc=k.leaf==='autumn'?mix(base,[168,128,58],.45):base;gc=mix(gc,[238,243,250],k.snow);
 const dim=c=>mix(c.map(v=>v*(.22+.78*L)),[8,14,40],(1-L)*.5);
 hill(10,3,1,rgb(dim(mix([100,118,140],[238,243,250],k.snow*.8))));
 hill(4.5,5,4,rgb(dim(mix(gc,[70,90,100],.35))));
 const y0=Math.max(yh,-1);g=ctx.createLinearGradient(0,y0,0,y0+Math.max(60,f*.6));g.addColorStop(0,rgb(dim(mix(gc,[70,90,100],.3))));g.addColorStop(1,rgb(dim(gc)));
 ctx.fillStyle=g;ctx.fillRect(0,y0,W,H-y0+1);
 ctx.fillStyle='rgba(255,255,255,.65)';ctx.font='600 15px Vazirmatn,Tahoma,sans-serif';ctx.textAlign='center';
 [['شمال',0],['شرق',90],['جنوب',180],['غرب',270]].forEach(([t,a])=>{const p=P(a,-3);if(p.z>.02)ctx.fillText(t,p.sx,p.sy)});
 const sw0=T*(1.5+k.wind*2);
 (city.f==='d'?TR.slice(-5):city.f==='p'?[]:TR).forEach(t=>{const b=P(t.az,-Math.atan(1.7/t.d)/R),tp=P(t.az,Math.atan((t.h-1.7)/t.d)/R);if(b.z<=.02||tp.z<=.02)return;
  const hp=b.sy-tp.sy;if(hp<4||b.sx<-hp||b.sx>W+hp)return;const sw=Math.sin(sw0+t.p)*(.02+k.wind*.1)*hp,tx=b.sx+sw,ty=b.sy-hp*.75;
  ctx.strokeStyle=rgb(dim([85,60,40]));ctx.lineWidth=Math.max(2,hp*.06);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.sx,b.sy);ctx.quadraticCurveTo(b.sx,b.sy-hp*.4,tx,ty);ctx.stroke();
  if(k.leaf==='bare'){ctx.lineWidth=Math.max(1,hp*.03);ctx.beginPath();[[-.2,-.22],[0,-.3],[.2,-.22]].forEach(([a,c])=>{ctx.moveTo(tx,ty+hp*.05);ctx.lineTo(tx+a*hp+sw*.5,ty+c*hp)});ctx.stroke()}
  else{const lc=k.leaf==='autumn'?[208,116,40]:k.leaf==='spring'?mix([232,176,196],[130,180,100],.25):[56,125,58],r=hp*.22;ctx.fillStyle=rgb(dim(lc));
   ctx.beginPath();[[0,-.04],[-.16,.06],[.16,.06]].forEach(([a,c])=>{ctx.moveTo(tx+a*hp+r,ty+c*hp);ctx.arc(tx+a*hp,ty+c*hp,r,0,7)});ctx.fill()}});
 if(k.type==='wind'||k.wind>.6){ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=1.5;WS.forEach(q=>{q.x+=(160+420*k.wind)*dt;if(q.x>W+100)q.x=-120;
  ctx.beginPath();ctx.moveTo(q.x,q.y%H);ctx.bezierCurveTo(q.x+q.l*.3,q.y%H-8,q.x+q.l*.6,q.y%H+8,q.x+q.l,q.y%H);ctx.stroke()})}
 if(k.type==='rain'){ctx.strokeStyle='rgba(190,205,225,.55)';ctx.lineWidth=1.2;ctx.beginPath();const vx=k.wind*260;
  PT.forEach(p=>{p.y+=(560+p.v*300)*dt;p.x+=vx*dt;if(p.y>H){p.y=-12;p.x=Math.random()*W}if(p.x>W)p.x-=W;ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-vx*.03,p.y-16)});ctx.stroke()}
 if(k.type==='snow'){ctx.fillStyle='rgba(255,255,255,.9)';
  PT.forEach(p=>{p.y+=(40+p.v*50)*dt;p.x+=(Math.sin(T+p.v*10)*20+k.wind*120)*dt;if(p.y>H){p.y=-6;p.x=Math.random()*W}if(p.x>W)p.x-=W;ctx.beginPath();ctx.arc(p.x,p.y,1.4+p.v*1.8,0,7);ctx.fill()})}
 if(!(sp.z>.02&&sp.sx>-10&&sp.sx<W+10&&sp.sy>-10&&sp.sy<H+10)){const a=Math.atan2(-sp.y,sp.x),r=Math.min(W,H)/2-24;
  ctx.save();ctx.translate(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r);ctx.rotate(a);ctx.fillStyle='rgba(255,205,80,.95)';ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-8,-9);ctx.lineTo(-8,9);ctx.fill();ctx.restore();
  ctx.fillStyle='#fff';ctx.font='600 13px Vazirmatn,Tahoma,sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.5)';
  const tx=W/2+Math.cos(a)*(r-28),ty=H/2+Math.sin(a)*(r-28),tt=e<0?'خورشید (زیر افق)':'خورشید';ctx.strokeText(tt,tx,ty);ctx.fillText(tt,tx,ty)}
 return{ms,s,k,lm}}

function info(r){const{s,k,lm}=r,thr=-.833,pts=[];
 for(let i=0;i<=96;i++)pts.push(sunAt(city.la,city.lo,lm+i*9e5).el-thr);
 let ri=null,se=null;for(let i=0;i<96;i++){const a=pts[i],b=pts[i+1];if(a<0&&b>=0&&ri===null)ri=i+(-a)/(b-a);if(a>=0&&b<0&&se===null)se=i+a/(a-b)}
 const hm=q=>{if(q===null)return'—';const m=Math.round(q*15);return fa(pad(Math.floor(m/60)%24)+':'+pad(m%60))};
 const len=ri===null&&se===null?(pts[0]>=0?'۲۴ ساعت':'۰ ساعت'):ri!==null&&se!==null?(m=>fa(Math.floor(m/60))+'س '+fa(m%60)+'د')(Math.round((se-ri+(se<ri?96:0))*15)):'—';
 const WN={clear:'آفتابی',wind:'باد',rain:'باران',snow:'برف'};
 $('inf').innerHTML=`<div>خورشید ${fa(Math.round(Math.abs(s.el)))}° ${s.el>=0?'بالای افق':'زیر افق'}</div><div>طلوع <bdi>${hm(ri)}</bdi> · غروب <bdi>${hm(se)}</bdi></div><div>طول روز ${len}</div><div>${k.season} · ${WN[k.type]} · <bdi>${fa(Math.round(k.temp))}°C</bdi></div>`;
 $('loc').textContent=fa(Math.abs(city.la).toFixed(1))+(city.la>=0?'° شمالی، ':'° جنوبی، ')+fa(Math.abs(city.lo).toFixed(1))+(city.lo>=0?'° شرقی':'° غربی')}
const DF=new Intl.DateTimeFormat('fa-IR',{timeZone:'UTC',day:'numeric',month:'long'});
function labels(){$('chip').textContent=city.n+' · '+fa(pad(Math.floor(mins/60))+':'+pad(Math.floor(mins%60)))+' · '+DF.format(new Date(Date.UTC(YR,0,Math.floor(doyF))))}
function now(){const n=Date.now(),of=off(city.z,n),d=new Date(n+of);
 doyF=Math.floor((Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-Date.UTC(d.getUTCFullYear(),0,0))/DAY);mins=d.getUTCHours()*60+d.getUTCMinutes();labels()}
let nx=0,ny=0,auto=false,follow=false;
function frame(ts){if(window.Bridge&&!Bridge.visible){last=ts;requestAnimationFrame(frame);return}const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
 const vx=Math.sign(nx)*nx*nx*8+(auto?1.5:0),vy=Math.sign(ny)*ny*ny*60;
 if(vx||vy){mins=((mins+vx*60*dt)%1440+1440)%1440;doyF+=vy*dt;if(doyF>=366)doyF-=365;if(doyF<1)doyF+=365;labels()}
 if(follow&&!gyroOn){const dy=((lastSun.az-yaw+540)%360)-180;yaw=(yaw+dy*.12+360)%360;pitch+=(cl(lastSun.el,-8,80)-pitch)*.12}
 if(gyroOn&&got){const dy=((gt.y-yaw+540)%360)-180;yaw=(yaw+dy*.25+360)%360;pitch+=(gt.p-pitch)*.25}
 const r=draw(ts/1000,dt);if(ts-lastInfo>200){lastInfo=ts;info(r)}
 requestAnimationFrame(frame)}
function pickCity(){const c=DB[$('co').value][+$('ci').value];city={n:c[0],la:c[1],lo:c[2],z:c[3],f:c[4],i:Object.keys(DB).indexOf($('co').value)*7+(+$('ci').value)};if(!gyroOn&&!follow){yaw=c[1]>=0?180:0;pitch=20}}
function fillCities(){$('ci').innerHTML=DB[$('co').value].map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('');pickCity()}
$('co').innerHTML=Object.keys(DB).map(k=>`<option>${k}</option>`).join('');
$('co').onchange=()=>{fillCities();labels();syncP()};$('ci').onchange=()=>{pickCity();labels();syncP()};$('wx').onchange=e=>wsel=e.target.value;
$('pl').onclick=()=>{auto=!auto;$('pl').textContent=auto?'❚❚':'▶';$('pl').setAttribute('aria-pressed',auto)};
$('nw').onclick=now;
/* relative time pad */
const pad_=$('pad'),kn=$('kn');let pid=null;
function padMove(e){const r=pad_.getBoundingClientRect(),R0=r.width/2-10;let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const d=Math.hypot(dx,dy);if(d>R0){dx*=R0/d;dy*=R0/d}
 nx=dx/R0;ny=-dy/R0;kn.style.transform=`translate(${dx}px,${dy}px)`}
pad_.onpointerdown=e=>{pid=e.pointerId;pad_.setPointerCapture(pid);kn.classList.add('drag');padMove(e);hideHint()};
pad_.onpointermove=e=>{if(e.pointerId===pid)padMove(e)};
pad_.onpointerup=pad_.onpointercancel=e=>{if(e.pointerId!==pid)return;pid=null;nx=ny=0;kn.classList.remove('drag');kn.style.transform=''};
pad_.onkeydown=e=>{const m={ArrowRight:[15,0],ArrowLeft:[-15,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(m){e.preventDefault();mins=((mins+m[0])%1440+1440)%1440;doyF=cl(doyF+m[1],1,365.99);labels()}};
/* touch, mouse, wheel on the dome */
const ptr=new Map();let pd=0,tap=null;const dist=()=>{const a=[...ptr.values()];return Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])};
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size===2)pd=dist();tap=ptr.size===1?{x:e.clientX,y:e.clientY,t:performance.now()}:null;hideHint()};
cv.onpointermove=e=>{const o=ptr.get(e.pointerId);if(!o)return;ptr.set(e.pointerId,[e.clientX,e.clientY]);
 if(ptr.size===1&&!gyroOn){const q=fov/H;if(follow&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6)setF(false);yaw=(yaw-(e.clientX-o[0])*q+360)%360;pitch=cl(pitch+(e.clientY-o[1])*q,-89,89)}
 else if(ptr.size===2){const d=dist();fov=cl(fov*pd/d,30,110);pd=d}};
cv.onpointerup=cv.onpointercancel=e=>{if(e.type==='pointerup'&&tap&&ptr.size===1&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<8&&performance.now()-tap.t<400)toggleMenu(false);ptr.delete(e.pointerId);pd=0;tap=null};
cv.addEventListener('wheel',e=>{e.preventDefault();fov=cl(fov*(1+e.deltaY*.001),30,110)},{passive:false});
cv.onkeydown=e=>{const q=5,m={ArrowLeft:[-q,0],ArrowRight:[q,0],ArrowUp:[0,q],ArrowDown:[0,-q]}[e.key];if(m){e.preventDefault();setF(false);yaw=(yaw+m[0]+360)%360;pitch=cl(pitch+m[1],-89,89)}};
/* on-screen buttons */
function setF(on){follow=on;$('fw').setAttribute('aria-pressed',on)}
function setG(on){gyroOn=on;$('gy').setAttribute('aria-pressed',on)}
$('fw').onclick=()=>{if(!follow&&gyroOn)offG();setF(!follow)};
let gyroOn=false,got=false,absSeen=false,ev=0,hasW=false,gt={y:0,p:0},tt=0;const inFrame=top!==self;
function say(m,btn){clearTimeout(tt);$('toast').hidden=!m;$('nt').textContent=m||'';$('ot').hidden=!(m&&btn);if(m&&!btn)tt=setTimeout(()=>say(''),9000)}
function stopG(){removeEventListener('deviceorientationabsolute',onO,true);removeEventListener('deviceorientation',onO,true)}
function offG(){setG(false);got=false;stopG()}
function fail(m,btn){offG();say(m,btn)}
function onO(e){ev++;if(e.alpha==null)return;if(e.type==='deviceorientation'&&absSeen)return;if(e.type==='deviceorientationabsolute')absSeen=true;
 const A=e.alpha*R,B=e.beta*R,G=e.gamma*R,x=-Math.cos(A)*Math.sin(G)-Math.sin(A)*Math.sin(B)*Math.cos(G),y=-Math.sin(A)*Math.sin(G)+Math.cos(A)*Math.sin(B)*Math.cos(G),z=-Math.cos(B)*Math.cos(G);
 let yw=Math.atan2(x,y)/R;if(e.webkitCompassHeading!=null){yw=e.webkitCompassHeading;hasW=true}
 gt={y:(yw+360)%360,p:cl(Math.asin(cl(z,-1,1))/R,-89,89)};
 if(!got){got=true;yaw=gt.y;pitch=gt.p;say('');setTimeout(()=>{if(gyroOn&&!absSeen&&!hasW)say('این دستگاه فقط جهت نسبی می‌دهد؛ شمال دقیق نیست.')},1500)}}
$('gy').onclick=async()=>{if(gyroOn){offG();say('');return}
 try{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission&&(await DeviceOrientationEvent.requestPermission())!=='granted')return fail('اجازه‌ی حس‌گر داده نشد. در آیفون: تنظیمات Safari ← Motion & Orientation Access را بررسی کنید.')}catch(x){return fail('دسترسی به حس‌گر ممکن نشد.')}
 setF(false);setG(true);got=false;absSeen=false;hasW=false;ev=0;addEventListener('deviceorientationabsolute',onO,true);addEventListener('deviceorientation',onO,true);
 say('گوشی را بالا بگیرید و به اطراف نگاه کنید…');
 setTimeout(()=>{if(!gyroOn||got)return;
  if(ev>0)fail('Chrome حس‌گر را مسدود کرده: روی قفل کنار آدرس بزنید ← Permissions ← Motion sensors را روی Allow بگذارید.');
  else if(inFrame)fail('مرورگر در این قاب حس‌گر را مسدود می‌کند. صفحه را در تب مستقل باز کنید.',true);
  else fail('هیچ داده‌ای از حس‌گر نرسید. «تست حسگر» در منو دلیلش را نشان می‌دهد.')},3000)};
$('ot').onclick=()=>{const w=open(location.href,'_blank');if(!w){try{navigator.clipboard.writeText(location.href)}catch(x){}say('آدرس کپی شد؛ آن را مستقیم در Chrome باز کنید.')}};
/* top menu, hint, fullscreen */
function toggleMenu(o){const m=$('menu');o=o===undefined?!m.classList.contains('open'):o;m.classList.toggle('open',o);m.inert=!o;$('mb').setAttribute('aria-expanded',o)}
let hid=false;function hideHint(){if(hid)return;hid=true;$('hint').style.opacity=0}
$('mb').onclick=()=>toggleMenu();$('chip').onclick=()=>toggleMenu();
addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
toggleMenu(false);setTimeout(hideHint,10000);
if(!document.fullscreenEnabled)$('fl').hidden=true;
$('fl').onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}};
/* sensor test */
$('ts').onclick=async()=>{const o=$('dg');o.hidden=false;o.textContent='در حال بررسی…';
 const hasAPI='DeviceOrientationEvent' in window,needP=hasAPI&&typeof DeviceOrientationEvent.requestPermission==='function';let perm='لازم نیست';
 if(needP){try{perm=await DeviceOrientationEvent.requestPermission()}catch(x){perm='خطا'}}
 let n=0,nn=0,moved=0,ab=false,hd=null,pv=null,v=[0,0,0];
 const fn=e=>{n++;if(e.type==='deviceorientationabsolute'||e.absolute)ab=true;if(e.webkitCompassHeading!=null)hd=e.webkitCompassHeading;
  if(e.alpha!=null){nn++;v=[e.alpha,e.beta,e.gamma];if(pv)moved+=Math.abs(((e.alpha-pv[0]+540)%360)-180)+Math.abs(e.beta-pv[1])+Math.abs(e.gamma-pv[2]);pv=v}};
 addEventListener('deviceorientationabsolute',fn,true);addEventListener('deviceorientation',fn,true);
 const hdr=`اتصال امن: ${isSecureContext?'بله':'خیر'}\nحس‌گر در مرورگر: ${hasAPI?'هست':'نیست'}\nداخل قاب: ${inFrame?'بله (ممکن است مسدود شود)':'خیر'}\nاجازه: ${perm}\n`;
 let t=0;const iv=setInterval(()=>{t++;o.textContent=hdr+`\nگوشی را بچرخانید… ${fa(5-Math.floor(t/5))}\nرویداد: ${fa(n)}  زاویه‌ها: ${nn?v.map(x=>fa(Math.round(x))).join(' / '):'—'}`+(hd!==null?`\nقطب‌نمای iOS: ${fa(Math.round(hd))}°`:'');
  if(t>=25){clearInterval(iv);removeEventListener('deviceorientationabsolute',fn,true);removeEventListener('deviceorientation',fn,true);
   const r=n===0?'نتیجه: هیچ رویدادی نرسید.'+(inFrame?' صفحه داخل قاب است و Chrome در قاب حس‌گر را مسدود می‌کند؛ در تب مستقل باز کنید.':' اجازه‌ی Motion sensors سایت را در مرورگر بررسی کنید.')
   :nn===0?'نتیجه: رویداد می‌رسد ولی مقدار ندارد؛ مرورگر دسترسی ندارد. در Chrome: قفل کنار آدرس ← Permissions ← Motion sensors.'
   :moved<4?'نتیجه: مقدارها تغییر نکردند. گوشی را بچرخانید و دوباره تست کنید.'
   :'نتیجه: حس‌گر سالم است ✓'+(ab||hd!==null?'\nجهت مطلق (شمال) در دسترس است.':'\nفقط جهت نسبی می‌دهد؛ شمال دقیق نیست.');
   o.textContent=hdr+'\n'+r;if(n===0&&inFrame)say('صفحه داخل قاب است؛ حس‌گر مسدود می‌شود.',true)}},200)};
resize();fillCities();now();requestAnimationFrame(frame);
/* ---- ارتباط با بخش‌های دیگر ---- */
const EXT='📍 مکان انتخابی';
const curPlace=()=>({n:city.n,la:city.la,lo:city.lo,z:city.z});
function syncP(){if(window.Bridge)Bridge.place(curPlace())}
function setPlace(p){let hit=null;
 for(const k in DB){if(k!==EXT)DB[k].forEach((c,i)=>{if(Math.abs(c[1]-p.la)<.3&&Math.abs(c[2]-p.lo)<.3)hit=[k,i]})}
 if(!hit){DB[EXT]=[[p.n,p.la,p.lo,p.z,Math.abs(p.la)>66.5?'p':'']];hit=[EXT,0];
  if(![...$('co').options].some(o=>o.value===EXT)){const o=document.createElement('option');o.textContent=EXT;$('co').insertBefore(o,$('co').firstChild)}}
 $('co').value=hit[0];fillCities();$('ci').value=hit[1];pickCity();labels();say('📍 '+p.n)}
function setTime(ms){const d=new Date(ms+off(city.z,ms));
 doyF=Math.floor((Date.UTC(YR,d.getUTCMonth(),d.getUTCDate())-Date.UTC(YR,0,0))/DAY);mins=d.getUTCHours()*60+d.getUTCMinutes();labels()}
$('gs').onclick=()=>Bridge.go('solar',{place:curPlace(),time:{ms:getMs()},opt:{focusEarth:1}});
$('gm').onclick=()=>Bridge.go('atlas',{place:curPlace()});
if(window.Bridge)Bridge.on('ctx',m=>{if(m.place)setPlace(m.place);if(m.time)setTime(m.time.ms);toggleMenu(false)});
