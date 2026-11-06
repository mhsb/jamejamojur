/* محاسبات نجومی مشترک بین بخش‌ها: خورشید، ماه و سیارات
   (روش‌های ساده‌شده با دقت مناسب نمایش؛ جهت‌ها در حد کسری از درجه درست‌اند) */
(function () {
  var R = Math.PI / 180, DAY = 864e5;
  var rev = function (x) { return ((x % 360) + 360) % 360; };
  var sd = function (x) { return Math.sin(x * R); }, cd = function (x) { return Math.cos(x * R); };
  var cl = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var jd = function (ms) { return ms / DAY + 2440587.5; };
  function kepler(M, e) {
    var E = M + e / R * sd(M) * (1 + e * cd(M));
    for (var j = 0; j < 4; j++) E = E - (E - e / R * sd(E) - M) / (1 - e * cd(E));
    return E;
  }

  /* ---- ماه ---- */
  function moonEq(ms) {
    var d = jd(ms) - 2451543.5,
      N = 125.1228 - .0529538083 * d, i = 5.1454, w = 318.0634 + .1643573223 * d, a = 60.2666, e = .0549, M = rev(115.3654 + 13.0649929509 * d),
      Ms = rev(356.047 + .9856002585 * d), ws = 282.9404 + 4.70935e-5 * d, Ls = rev(Ms + ws), Lm = rev(M + w + N), Dm = rev(Lm - Ls), F = rev(Lm - N),
      E = kepler(M, e),
      xv = a * (cd(E) - e), yv = a * Math.sqrt(1 - e * e) * sd(E), v = Math.atan2(yv, xv) / R, r = Math.hypot(xv, yv), vw = v + w,
      xh = r * (cd(N) * cd(vw) - sd(N) * sd(vw) * cd(i)), yh = r * (sd(N) * cd(vw) + cd(N) * sd(vw) * cd(i)), zh = r * sd(vw) * sd(i),
      lon = Math.atan2(yh, xh) / R, lat = Math.atan2(zh, Math.hypot(xh, yh)) / R, dist = r;
    lon += -1.274 * sd(M - 2 * Dm) + .658 * sd(2 * Dm) - .186 * sd(Ms) - .059 * sd(2 * M - 2 * Dm) - .057 * sd(M - 2 * Dm + Ms) + .053 * sd(M + 2 * Dm) + .046 * sd(2 * Dm - Ms) + .041 * sd(M - Ms) - .035 * sd(Dm) - .031 * sd(M + Ms) - .015 * sd(2 * F - 2 * Dm) + .011 * sd(M - 4 * Dm);
    lat += -.173 * sd(F - 2 * Dm) - .055 * sd(M - F - 2 * Dm) - .046 * sd(M + F - 2 * Dm) + .033 * sd(F + 2 * Dm) + .017 * sd(2 * M + F);
    dist += -.58 * cd(M - 2 * Dm) - .46 * cd(2 * Dm);
    var ec = 23.4393 - 3.563e-7 * d,
      xe = cd(lon) * cd(lat), ye = sd(lon) * cd(lat) * cd(ec) - sd(lat) * sd(ec), ze = sd(lon) * cd(lat) * sd(ec) + sd(lat) * cd(ec),
      psi = Math.acos(cl(cd(lat) * cd(lon - Ls), -1, 1)) / R;
    return { ra: rev(Math.atan2(ye, xe) / R), dec: Math.atan2(ze, Math.hypot(xe, ye)) / R, dist: dist, D: rev(lon - Ls), k: (1 - cd(psi)) / 2, jd: d + 2451543.5, lon: lon, lat: lat };
  }
  function eqHor(ra, dec, la, lo, j) {
    var H = (rev(280.46061837 + 360.98564736629 * (j - 2451545)) + lo - ra) * R, p = la * R, dd = dec * R,
      el = Math.asin(cl(Math.sin(p) * Math.sin(dd) + Math.cos(p) * Math.cos(dd) * Math.cos(H), -1, 1)) / R,
      az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(p) - Math.tan(dd) * Math.cos(p)) / R + 180;
    return { el: el, az: rev(az) };
  }
  function moonAt(la, lo, ms) {
    var m = moonEq(ms), h = eqHor(m.ra, m.dec, la, lo, m.jd);
    m.el = h.el - Math.asin(cd(h.el) / m.dist) / R; m.az = h.az; m.pole = eqHor(270, 66.5607, la, lo, m.jd);
    return m;
  }
  function phaseName(D) {
    var t = [[7, 'محاق'], [83, 'هلال رو به رشد'], [97, 'تربیع اول'], [173, 'کوژ رو به رشد'], [187, 'ماه کامل'], [263, 'کوژ رو به کاهش'], [277, 'تربیع آخر'], [353, 'هلال رو به کاهش']];
    for (var i = 0; i < t.length; i++) if (D < t[i][0]) return t[i][1];
    return 'محاق';
  }

  /* ---- سیارات (مدار کپلری + اختلال‌های مشتری، کیوان، اورانوس) ---- */
  var EL = {
    mercury: { N: [48.3313, 3.24587e-5], i: [7.0047, 5e-8], w: [29.1241, 1.01444e-5], a: [.387098, 0], e: [.205635, 5.59e-10], M: [168.6562, 4.0923344368] },
    venus: { N: [76.6799, 2.4659e-5], i: [3.3946, 2.75e-8], w: [54.891, 1.38374e-5], a: [.72333, 0], e: [.006773, -1.302e-9], M: [48.0052, 1.6021302244] },
    mars: { N: [49.5574, 2.11081e-5], i: [1.8497, -1.78e-8], w: [286.5016, 2.92961e-5], a: [1.523688, 0], e: [.093405, 2.516e-9], M: [18.6021, .5240207766] },
    jupiter: { N: [100.4542, 2.76854e-5], i: [1.303, -1.557e-7], w: [273.8777, 1.64505e-5], a: [5.20256, 0], e: [.048498, 4.469e-9], M: [19.895, .0830853001] },
    saturn: { N: [113.6634, 2.3898e-5], i: [2.4886, -1.081e-7], w: [339.3939, 2.97661e-5], a: [9.55475, 0], e: [.055546, -9.499e-9], M: [316.967, .0334442282] },
    uranus: { N: [74.0005, 1.3978e-5], i: [.7733, 1.9e-8], w: [96.6612, 3.0565e-5], a: [19.18171, -1.55e-8], e: [.047318, 7.45e-9], M: [142.5905, .011725806] },
    neptune: { N: [131.7806, 3.0173e-5], i: [1.77, -2.55e-7], w: [272.8461, -6.027e-6], a: [30.05826, 3.313e-8], e: [.008606, 2.15e-9], M: [260.2471, .005995147] }
  };
  function helio(name, ms) {
    var d = jd(ms) - 2451543.5;
    if (name === 'earth') {
      var w0 = 282.9404 + 4.70935e-5 * d, e0 = .016709 - 1.151e-9 * d, M0 = rev(356.047 + .9856002585 * d), E0 = kepler(M0, e0),
        xv0 = cd(E0) - e0, yv0 = Math.sqrt(1 - e0 * e0) * sd(E0), r0 = Math.hypot(xv0, yv0), L = rev(Math.atan2(yv0, xv0) / R + w0 + 180);
      return { x: r0 * cd(L), y: r0 * sd(L), z: 0, r: r0, L: L };
    }
    var p = EL[name], o = {};
    for (var k in p) o[k] = p[k][0] + p[k][1] * d;
    o.M = rev(o.M);
    var E = kepler(o.M, o.e), xv = o.a * (cd(E) - o.e), yv = o.a * Math.sqrt(1 - o.e * o.e) * sd(E), v = Math.atan2(yv, xv) / R, r = Math.hypot(xv, yv), vw = v + o.w,
      xh = r * (cd(o.N) * cd(vw) - sd(o.N) * sd(vw) * cd(o.i)), yh = r * (sd(o.N) * cd(vw) + cd(o.N) * sd(vw) * cd(o.i)), zh = r * sd(vw) * sd(o.i),
      lon = Math.atan2(yh, xh) / R, lat = Math.atan2(zh, Math.hypot(xh, yh)) / R;
    var Mj = rev(19.895 + .0830853001 * d), Ms = rev(316.967 + .0334442282 * d), Mu = rev(142.5905 + .011725806 * d);
    if (name === 'jupiter') lon += -.332 * sd(2 * Mj - 5 * Ms - 67.6) - .056 * sd(2 * Mj - 2 * Ms + 21) + .042 * sd(3 * Mj - 5 * Ms + 21) - .036 * sd(Mj - 2 * Ms) + .022 * cd(Mj - Ms) + .023 * sd(2 * Mj - 3 * Ms + 52) - .016 * sd(Mj - 5 * Ms - 69);
    if (name === 'saturn') { lon += .812 * sd(2 * Mj - 5 * Ms - 67.6) - .229 * cd(2 * Mj - 4 * Ms - 2) + .119 * sd(Mj - 2 * Ms - 3) + .046 * sd(2 * Mj - 6 * Ms - 69) + .014 * sd(Mj - 3 * Ms + 32); lat += -.02 * cd(2 * Mj - 4 * Ms - 2) + .018 * sd(2 * Mj - 6 * Ms - 49); }
    if (name === 'uranus') lon += .04 * sd(Ms - Mu + 6) + .035 * sd(Ms - 3 * Mu + 33) - .015 * sd(Mj - Mu + 20);
    return { x: r * cd(lat) * cd(lon), y: r * cd(lat) * sd(lon), z: r * sd(lat), r: r, L: rev(lon) };
  }
  /* بردار زمین‌مرکزی (دکارتی دایرةالبروجی، واحد نجومی) */
  function geo(name, ms) {
    var e = helio('earth', ms);
    if (name === 'sun') return { x: -e.x, y: -e.y, z: 0 };
    var p = helio(name, ms);
    return { x: p.x - e.x, y: p.y - e.y, z: p.z };
  }
  /* بردار دایرةالبروجی → دستگاه مختصات صحنهٔ منظومه (x,y,z) */
  function scene(v) { return [-v.y, v.z, -v.x]; }
  function sceneUnit(v) { var s = scene(v), n = Math.hypot(s[0], s[1], s[2]) || 1; return [s[0] / n, s[1] / n, s[2] / n]; }
  /* زاویهٔ مدار در صحنهٔ منظومه (رادیان) */
  function scLon(name, ms) { return (helio(name, ms).L - 270) * R; }
  function moonVec(ms) {
    var m = moonEq(ms), c = cd(m.lat);
    return sceneUnit({ x: c * cd(m.lon), y: c * sd(m.lon), z: sd(m.lat) });
  }
  /* معادلهٔ زمان (ساعت): زمان خورشیدیِ ظاهری منهای زمان خورشیدیِ میانگین */
  function eot(ms) {
    var d = jd(ms) - 2451543.5, L0 = rev(282.9404 + 4.70935e-5 * d + 356.047 + .9856002585 * d),
      g = geo('sun', ms), ec = 23.4393, ra = rev(Math.atan2(g.y * cd(ec), g.x) / R);
    return (((L0 - ra + 540) % 360) - 180) / 15;
  }
  window.Astro = { eot: eot, jd: jd, moonEq: moonEq, moonAt: moonAt, eqHor: eqHor, phaseName: phaseName, helio: helio, geo: geo, scene: scene, sceneUnit: sceneUnit, scLon: scLon, moonVec: moonVec };
})();
