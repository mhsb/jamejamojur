# جام جمع و جور

مجموعهٔ آفلاین و فارسی شامل پنج بخش که با هم در ارتباطند:
**گنبد آسمان**، **منظومهٔ شمسی سه‌بعدی**، **اطلس جهان**، **اطلس ایران** و **کارت کشورها**.

سازنده: **حسین شیبه** — [sheibah.ir](https://sheibah.ir)

## اجرا

برنامه فقط فایل‌های استاتیک است (بدون بیلد و بدون وابستگی به اینترنت).

- **محلی:** در پوشهٔ پروژه `python3 -m http.server 8000` و باز کردن `http://localhost:8000`
  (سرویس‌ورکر روی `file://` کار نمی‌کند؛ حتماً از یک سرور استفاده کنید.)
- **GitHub Pages:** مخزن را آپلود کنید، سپس *Settings ← Pages ← Deploy from a branch ← main / (root)*.
  همهٔ آدرس‌ها نسبی‌اند، پس زیرمسیر مخزن مشکلی ایجاد نمی‌کند.
- **نصب روی موبایل/دسکتاپ:** از منوی مرورگر «Install / Add to Home Screen» (یا دکمهٔ نصب در بخش «درباره»).
  بعد از اولین بازشدن، همهٔ فایل‌ها کش می‌شوند و برنامه بدون اینترنت کار می‌کند.

## ساختار

```
index.html              پوسته: ناوبری، مکان مشترک، جستجو، درباره
sw.js                   سرویس‌ورکر (خودکار ساخته می‌شود)
manifest.webmanifest    تعریف برنامهٔ قابل نصب
assets/
  css/shell.css  js/shell.js  js/bridge.js
  lib/d3.min.js  lib/three.min.js
  fonts/vazirmatn-subset.woff2
  icons/
data/places.json        ~۲٬۵۰۰ شهر + ۲۴۱ کشور با مختصات و منطقهٔ زمانی (برای جستجو و هماهنگی)
modules/
  sky/  solar/  atlas/  iran/  countries/     هر بخش: index.html + app.js (+ data.js)
tools/build_sw.py       ساخت دوبارهٔ sw.js
```

## بعد از هر تغییر

فایل‌ها را ویرایش کنید و این را اجرا کنید تا کاربران نسخهٔ جدید را بگیرند:

```
python3 tools/build_sw.py
```

## ارتباط بین بخش‌ها

هر بخش داخل یک `iframe` اجرا می‌شود و با پوسته از طریق `postMessage` حرف می‌زند
(`assets/js/bridge.js`). پوسته «مکان فعلی» را نگه می‌دارد و بین بخش‌ها همگام می‌کند.

```js
// رفتن به بخش دیگر با مکان و زمان
Bridge.go('solar', { place: {n:'یزد', la:31.9, lo:54.37, z:'Asia/Tehran'},
                     time: {ms: Date.now()}, opt: {focusEarth: 1} });
// دریافت مکان/زمان
Bridge.on('ctx', m => { /* m.place, m.time, m.opt, m.cause */ });
// هر عنصر HTML با data-go هم کار می‌کند:
// <a href="#" data-go="sky" data-n="تهران" data-la="35.69" data-lo="51.39">آسمان</a>
```

بخش‌ها: `sky`، `solar`، `atlas`، `iran`، `countries`. هر بخش به‌تنهایی هم قابل اجراست
(مثلاً `modules/sky/index.html`)؛ فقط پیوندهای بین‌بخشی در آن حالت به صفحهٔ همان بخش می‌روند.

## اعتبار

Three.js (MIT)، D3.js (ISC)، فونت وزیرمتن (OFL). داده‌ها و مدل‌ها آموزشی و تقریبی‌اند.
