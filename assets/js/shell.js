/* پوستهٔ برنامه: ناوبری بین بخش‌ها، مکان مشترک، جستجو، درباره و آفلاین */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var APP = 'زمین و آسمان';
  var MODS = {
    sky: ['گنبد آسمان', 'modules/sky/index.html'],
    solar: ['منظومهٔ شمسی', 'modules/solar/index.html'],
    atlas: ['اطلس جهان', 'modules/atlas/index.html'],
    iran: ['اطلس ایران', 'modules/iran/index.html'],
    countries: ['کارت کشورها', 'modules/countries/index.html']
  };
  var KEYS = Object.keys(MODS), MAXLIVE = 3;
  var TEHRAN = { n: 'تهران', la: 35.69, lo: 51.39, z: 'Asia/Tehran', a: 'IRN' };
  var LS = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var fa = function (s) { return String(s).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }); };
  var saved = LS.get('geo.place');
  var S = { mod: null, v: saved ? 1 : 0, place: saved || TEHRAN };
  var frames = {}, tick = 0, DB = null, IDX = null, KN = {};
  var stage = $('#stage');

  /* ---------- مکان ---------- */
  function validTz(z) { try { new Intl.DateTimeFormat('en', { timeZone: z }); return true; } catch (e) { return false; } }
  function tzNear(p) {
    if (p.a === 'IRN') return 'Asia/Tehran';
    if (DB) {
      var best = null, bd = 1e9, k = Math.cos(p.la * Math.PI / 180);
      for (var i = 0; i < DB.c.length; i++) {
        var c = DB.c[i];
        if (p.a && c[4] !== p.a) continue;
        var d = Math.pow(c[2] - p.la, 2) + Math.pow((c[3] - p.lo) * k, 2);
        if (d < bd) { bd = d; best = c; }
      }
      if (best && bd < 9) return DB.z[best[5]];
    }
    var h = Math.round(p.lo / 15);
    return h ? 'Etc/GMT' + (h > 0 ? '-' : '+') + Math.abs(h) : 'Etc/GMT';
  }
  function norm(p) {
    p = { n: p.n || 'مکان', la: +p.la, lo: +p.lo, a: p.a || undefined, z: p.z };
    if (!(p.z && validTz(p.z))) p.z = tzNear(p);
    return p;
  }
  function setPlace(p, from) {
    p = norm(p);
    var q = S.place, same = Math.abs(q.la - p.la) < 1e-3 && Math.abs(q.lo - p.lo) < 1e-3 && q.n === p.n;
    S.place = p;
    if (!same) { S.v++; LS.set('geo.place', p); }
    if (from && frames[from]) frames[from].seen = S.v;
    renderPlace();
    return p;
  }
  function capOf(a3) {
    if (!DB) return null;
    var c = DB.c.filter(function (c) { return c[4] === a3 && c[6] === 1; })[0];
    if (c) return norm({ n: c[0], la: c[2], lo: c[3], a: a3, z: DB.z[c[5]] });
    var k = DB.k.filter(function (k) { return k[2] === a3; })[0];
    return k ? norm({ n: k[0], la: k[3], lo: k[4], a: a3, z: DB.z[k[5]] }) : null;
  }

  /* ---------- فریم‌ها ---------- */
  function mk(k) {
    if (frames[k]) return frames[k];
    var el = document.createElement('iframe');
    el.src = MODS[k][1]; el.title = MODS[k][0];
    el.allow = 'fullscreen; accelerometer; gyroscope; magnetometer; geolocation';
    el.setAttribute('allowfullscreen', '');
    stage.appendChild(el);
    return (frames[k] = { el: el, ready: false, q: [], seen: 0, use: 0 });
  }
  function raw(f, m) { f.el.contentWindow.postMessage(Object.assign({ __geo: 1 }, m), '*'); }
  function post(k, m) {
    var f = frames[k]; if (!f) return;
    if (!f.ready) { f.q = f.q.filter(function (x) { return x.t !== m.t; }); f.q.push(m); } else raw(f, m);
  }
  function gc() {
    var live = Object.keys(frames);
    while (live.length > MAXLIVE) {
      var old = live.filter(function (k) { return k !== S.mod; }).sort(function (a, b) { return frames[a].use - frames[b].use; })[0];
      frames[old].el.remove(); delete frames[old]; live = Object.keys(frames);
    }
  }
  function show(k, o, noPush) {
    o = o || {};
    if (!MODS[k]) k = 'sky';
    var prev = S.mod;
    if (prev && prev !== k && frames[prev]) {
      frames[prev].el.classList.remove('on'); frames[prev].el.inert = true; post(prev, { t: 'vis', v: false });
    }
    S.mod = k;
    var f = mk(k); f.use = ++tick; f.el.classList.add('on'); f.el.inert = false;
    post(k, { t: 'vis', v: true });
    document.querySelectorAll('#nav [data-m]').forEach(function (b) {
      b.setAttribute('aria-current', b.dataset.m === k ? 'page' : 'false');
    });
    document.title = MODS[k][0] + ' · ' + APP;
    LS.set('geo.mod', k);
    if (!noPush && prev !== k) {
      try { history[prev ? 'pushState' : 'replaceState']({ m: k }, '', '#/' + k); } catch (e) {}
    }
    var explicit = o.place || o.time || o.opt;
    var cause = explicit ? 'go' : 'sync';
    if (cause === 'go' || f.seen !== S.v) {
      post(k, { t: 'ctx', cause: cause, place: S.place, time: o.time, opt: o.opt });
      f.seen = S.v;
    }
    gc(); closeSheet(); renderPlace();
  }
  addEventListener('message', function (e) {
    var m = e.data; if (!m || !m.__geo) return;
    var k = Object.keys(frames).filter(function (k) { return frames[k].el.contentWindow === e.source; })[0];
    if (!k) return;
    if (m.t === 'ready') {
      var f = frames[k]; f.ready = true;
      f.q.forEach(function (x) { raw(f, x); }); f.q = [];
      var b = $('#boot'); if (b) b.remove();
    } else if (m.t === 'place') {
      setPlace(m.place, k);
    } else if (m.t === 'go') {
      var place = m.place ? norm(m.place) : null, opt = m.opt;
      if (opt && opt.a3 && !place) place = capOf(opt.a3);
      if (place) setPlace(place, k);
      show(m.to, { place: place, time: m.time, opt: opt });
    }
  });

  /* ---------- رابط مکان ---------- */
  function coord(p) {
    return fa(Math.abs(p.la).toFixed(2)) + '° ' + (p.la >= 0 ? 'شمالی' : 'جنوبی') + '، ' +
           fa(Math.abs(p.lo).toFixed(2)) + '° ' + (p.lo >= 0 ? 'شرقی' : 'غربی');
  }
  function renderPlace() {
    var p = S.place;
    $('#pName').textContent = p.n.length > 9 ? p.n.slice(0, 8) + '…' : p.n;
    $('#bPlace').title = 'مکان فعلی: ' + p.n;
    var t = '';
    try { t = new Intl.DateTimeFormat('fa-IR', { timeZone: p.z, hour: '2-digit', minute: '2-digit' }).format(new Date()); } catch (e) {}
    $('#cur').innerHTML = '<b>' + p.n + '</b><small>' + coord(p) + '</small><small>منطقهٔ زمانی: <bdi>' + p.z + '</bdi>' + (t ? ' · ساعت اکنون ' + t : '') + '</small>';
  }
  function openSheet() { renderPlace(); $('#sheet').classList.add('on'); $('#q').value = ''; $('#res').innerHTML = ''; }
  function closeSheet() { $('#sheet').classList.remove('on'); }
  function toast(m) {
    var t = $('#toast'); t.textContent = m; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 3500);
  }
  function target(p) { return S.mod === 'iran' && p.a !== 'IRN' ? 'atlas' : S.mod; }
  function N(s) { return (s || '').replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u064b-\u0652]/g, '').toLowerCase().trim(); }
  function buildIdx() {
    DB.k.forEach(function (k) { KN[k[2]] = k[0]; });
    IDX = DB.k.map(function (k, i) { return { t: k[0], s: 'کشور', n: N(k[0]), e: k[1].toLowerCase(), k: i, p: k[6] * 4 }; })
      .concat(DB.c.map(function (c, i) { return { t: c[0], s: (KN[c[4]] || '') + (c[6] ? ' · پایتخت' : ''), n: N(c[0]), e: c[1].toLowerCase(), c: i, p: c[7] + (c[6] ? 5e7 : 0) }; }));
  }
  function search(q) {
    q = N(q); var box = $('#res'); box.innerHTML = '';
    if (!q || !IDX) return;
    var hits = IDX.filter(function (x) { return x.n.indexOf(q) >= 0 || x.e.indexOf(q) >= 0; })
      .map(function (x) { return [x, x.n.indexOf(q) === 0 || x.e.indexOf(q) === 0 ? 0 : 1]; })
      .sort(function (a, b) { return a[1] - b[1] || b[0].p - a[0].p; }).slice(0, 10);
    if (!hits.length) { box.innerHTML = '<p>نتیجه‌ای پیدا نشد</p>'; return; }
    hits.forEach(function (h) {
      var x = h[0], b = document.createElement('button');
      b.innerHTML = '<span>' + x.t + '</span><small>' + x.s + '</small>';
      b.onclick = function () { pick(x); }; box.appendChild(b);
    });
  }
  function pick(x) {
    var p, opt;
    if (x.k != null) { var k = DB.k[x.k]; p = capOf(k[2]) || norm({ n: k[0], la: k[3], lo: k[4], a: k[2], z: DB.z[k[5]] }); opt = { a3: k[2] }; }
    else { var c = DB.c[x.c]; p = norm({ n: c[0], la: c[2], lo: c[3], a: c[4], z: DB.z[c[5]] }); if (S.mod === 'countries') opt = { a3: c[4] }; }
    setPlace(p); show(target(p), { place: p, opt: opt });
  }
  $('#q').addEventListener('input', function (e) { search(e.target.value); });
  $('#q').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var b = $('#res button'); if (b) b.click(); } });
  $('#bPlace').onclick = function () { $('#sheet').classList.contains('on') ? closeSheet() : openSheet(); };
  $('#sheet .bd').onclick = closeSheet;
  document.querySelectorAll('#goRow [data-g]').forEach(function (b) {
    b.onclick = function () { show(b.dataset.g, { place: S.place }); };
  });
  $('#gps').onclick = function () {
    if (!navigator.geolocation) return toast('مرورگر شما موقعیت‌یابی را پشتیبانی نمی‌کند');
    toast('در حال یافتن موقعیت شما…');
    navigator.geolocation.getCurrentPosition(function (r) {
      var p = setPlace({ n: 'موقعیت من', la: +r.coords.latitude.toFixed(3), lo: +r.coords.longitude.toFixed(3), z: Intl.DateTimeFormat().resolvedOptions().timeZone });
      show(target(p), { place: p });
    }, function () { toast('دسترسی به موقعیت داده نشد'); }, { timeout: 10000 });
  };
  document.querySelectorAll('#nav [data-m]').forEach(function (b) { b.onclick = function () { show(b.dataset.m); }; });

  /* ---------- درباره / نصب / آفلاین ---------- */
  var about = $('#about'), dip = null;
  $('#bAbout').onclick = function () {
    closeSheet(); offlineStatus();
    $('#iosNote').hidden = !(/iphone|ipad|ipod/i.test(navigator.userAgent) && !navigator.standalone);
    about.showModal();
  };
  about.addEventListener('click', function (e) { if (e.target === about) about.close(); });
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); dip = e; $('#install').hidden = false; });
  $('#install').onclick = function () { if (dip) { dip.prompt(); dip = null; $('#install').hidden = true; } };
  addEventListener('appinstalled', function () { $('#install').hidden = true; });
  function offlineStatus() {
    var el = $('#offSt');
    if (!('serviceWorker' in navigator)) { el.textContent = '⚠️ این مرورگر از حالت آفلاین پشتیبانی نمی‌کند'; return; }
    navigator.serviceWorker.getRegistration().then(function (r) {
      el.textContent = r && r.active ? '✅ آمادهٔ استفادهٔ آفلاین است؛ بدون اینترنت هم کار می‌کند' : '⏳ در حال آماده‌سازی حالت آفلاین… (یک بار باز بماند)';
    });
  }
  if ('serviceWorker' in navigator) {
    addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  /* ---------- مسیر، کلیدها، شروع ---------- */
  addEventListener('popstate', function (e) {
    var k = (e.state && e.state.m) || (location.hash.match(/^#\/(\w+)/) || [])[1] || KEYS[0];
    show(k, null, true);
  });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
    if (e.altKey || e.ctrlKey || e.metaKey || /input|textarea|select/i.test((e.target.tagName || ''))) return;
    var i = '12345'.indexOf(e.key);
    if (i >= 0) show(KEYS[i]);
  });
  fetch('data/places.json').then(function (r) { return r.json(); }).then(function (j) {
    DB = j; buildIdx();
    if (!saved) S.place = norm(S.place);
  }).catch(function () {});
  renderPlace();
  var h = (location.hash.match(/^#\/(\w+)/) || [])[1];
  show(MODS[h] ? h : (MODS[LS.get('geo.mod')] ? LS.get('geo.mod') : 'sky'));
})();
