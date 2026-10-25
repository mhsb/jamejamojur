const CN={Africa:'آفریقا',Asia:'آسیا',Europe:'اروپا','North America':'آمریکای شمالی','South America':'آمریکای جنوبی',Oceania:'اقیانوسیه',Antarctica:'جنوبگان'};
const CC={Africa:'#f6b65b',Asia:'#f08a76',Europe:'#9fd18b','North America':'#c9a2e3','South America':'#f4d96a',Oceania:'#7fd3c8',Antarctica:'#d9e6ec'};
const INC={1:'بسیار بالا',2:'بالا',3:'نسبتاً بالا',4:'متوسط',5:'پایین'};
const fa=(n,m=0)=>n.toLocaleString('fa-IR',{maximumFractionDigits:m});
const pop=n=>n>=1e6?fa(n/1e6,1)+' میلیون نفر':fa(n)+' نفر';
const norm=s=>(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').toLowerCase();
const ln=(a,b)=>`<div class="ln"><span>${a}</span><b>${b}</b></div>`;
let q='',cont='',so='n',adv=false;
const flag=c=>`<div class="fl">${D.fl[c.a2]?`<img loading="lazy" alt="" src="${D.fl[c.a2]}">`:'<span>🏳️</span>'}</div>`;
const card=c=>`<article class="cd" data-i="${c.i}" style="--c:${CC[c.cont]||'#ddd'}">${flag(c)}<h3>${c.fa}</h3><small dir="ltr">${c.en}</small>${ln('پایتخت',c.cap||'—')}${ln('جمعیت',pop(c.pop))}`
 +(adv?ln('مساحت',fa(c.area)+' km²')+ln('تراکم',fa(c.pop/c.area,1)+' نفر/km²')+(c.gdp>0?ln('درآمد سرانه',fa(c.gdp*1e6/c.pop)+' $'):''):'')+`<i class="tag">${CN[c.cont]||c.cont}</i></article>`;
function draw(){
 const a=D.k.filter(c=>(!cont||c.cont===cont)&&(!q||norm(c.fa).includes(q)||c.en.toLowerCase().includes(q)||norm(c.cap).includes(q)));
 a.sort(so==='p'?(x,y)=>y.pop-x.pop:so==='a'?(x,y)=>y.area-x.area:(x,y)=>x.fa.localeCompare(y.fa,'fa'));
 $('#grid').innerHTML=a.map(card).join('');$('#cnt').textContent=fa(a.length)+' کشور';
}
function open(c){
 const cs=c.cs||[];
 $('#box').innerHTML=`<button class="x" id="cl">✕</button>${flag(c)}<h2>${c.fa}</h2><div style="text-align:center;opacity:.6" dir="ltr">${c.en}</div>`
  +ln('قاره',CN[c.cont]||c.cont)+ln('پایتخت',c.cap||'—')+ln('جمعیت',pop(c.pop))
  +'<h4>اطلاعات تکمیلی</h4>'+ln('مساحت تقریبی',fa(c.area)+' کیلومتر مربع')+ln('تراکم جمعیت',fa(c.pop/c.area,1)+' نفر در کیلومتر مربع')
  +(c.gdp>0?ln('تولید ناخالص داخلی',fa(c.gdp/1e3,1)+' میلیارد دلار')+ln('درآمد سرانه',fa(c.gdp*1e6/c.pop)+' دلار'):'')+ln('گروه درآمدی',INC[c.inc]||'—')
  +(cs.length?'<h4>شهرهای بزرگ</h4>'+cs.map(s=>ln(s[0],pop(s[1]))).join(''):'')
  +`<a class="big" href="#" data-go="atlas" data-a3="${c.a3}">🗺️ دیدن روی نقشه</a><a class="big" href="#" data-go="sky" data-a3="${c.a3}" style="background:#25508f">🌌 آسمان پایتخت</a><a class="big" href="#" data-go="solar" data-a3="${c.a3}" style="background:#5a3f9a">🪐 پایتخت روی زمین (منظومه)</a>`+(c.a3==='IRN'?'<a class="big g" href="#" data-go="iran">🇮🇷 اطلس دقیق ایران</a>':'');
 $('#mo').classList.add('on');$('#cl').onclick=()=>$('#mo').classList.remove('on');
}
$('#grid').onclick=e=>{const a=e.target.closest('.cd');if(a)open(D.k[+a.dataset.i])};
$('#mo').onclick=e=>{if(e.target.id==='mo')$('#mo').classList.remove('on')};
$('#q').oninput=e=>{q=norm(e.target.value.trim());draw()};$('#so').onchange=e=>{so=e.target.value;draw()};
$('#lv').onclick=e=>{adv=!adv;e.target.textContent='حالت: '+(adv?'پیشرفته':'ساده');draw()};
$('#rn').onclick=()=>open(D.k[Math.floor(Math.random()*D.k.length)]);
$('#ch').innerHTML=`<button class="chip on" data-c="">همه</button>`+Object.keys(CN).map(c=>`<button class="chip" data-c="${c}"><i style="background:${CC[c]}"></i>${CN[c]}</button>`).join('');
$('#ch').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;cont=b.dataset.c;document.querySelectorAll('#ch .chip').forEach(x=>x.classList.toggle('on',x===b));draw()};
draw();
/* ---- ارتباط با بخش‌های دیگر ---- */
if(window.Bridge)Bridge.on('ctx',m=>{if(m.cause==='sync')return;const a=(m.opt&&m.opt.a3)||(m.place&&m.place.a);
 const c=a&&D.k.find(c=>c.a3===a);if(c)open(c)});
