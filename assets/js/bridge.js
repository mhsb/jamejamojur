/* پل ارتباطی بین هر بخش و پوستهٔ برنامه (index.html) */
(function () {
  var PATH = { sky: '../sky/', solar: '../solar/', atlas: '../atlas/', iran: '../iran/', countries: '../countries/' };
  var emb = parent !== self;
  var B = (window.Bridge = {
    embedded: emb, visible: true, h: {},
    on: function (t, f) { (B.h[t] = B.h[t] || []).push(f); },
    send: function (m) { if (emb) parent.postMessage(Object.assign({ __geo: 1 }, m), '*'); },
    /* رفتن به بخشی دیگر؛ place={n,la,lo,a,z?} ، time={ms} ، opt={a3,focusEarth} */
    go: function (to, o) {
      o = o || {};
      if (emb) B.send({ t: 'go', to: to, place: o.place, time: o.time, opt: o.opt });
      else location.href = PATH[to] + (o.opt && o.opt.a3 && to === 'atlas' ? '#' + o.opt.a3 : '');
    },
    place: function (p) { B.send({ t: 'place', place: p }); }
  });
  addEventListener('message', function (e) {
    var m = e.data;
    if (!emb || e.source !== parent || !m || !m.__geo) return;
    if (m.t === 'vis') B.visible = !!m.v;
    (B.h[m.t] || []).forEach(function (f) { f(m); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-go]');
    if (!b) return;
    e.preventDefault();
    var d = b.dataset, o = {};
    if (d.la != null) o.place = { n: d.n, la: +d.la, lo: +d.lo, a: d.a || undefined };
    if (d.a3) o.opt = { a3: d.a3 };
    B.go(d.go, o);
  });
  addEventListener('load', function () { B.send({ t: 'ready' }); });
})();
