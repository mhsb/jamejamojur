#!/usr/bin/env python3
"""sw.js را از روی فهرست فایل‌های مخزن می‌سازد. بعد از هر تغییر در فایل‌ها اجرا کنید:
    python3 tools/build_sw.py
(نسخهٔ کش خودکار از روی محتوای فایل‌ها ساخته می‌شود تا کاربران نسخهٔ جدید را بگیرند.)"""
import hashlib, json, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
skip = {'sw.js', 'README.md', '.gitignore', '.nojekyll'}
files = []
for d, ds, fs in os.walk(root):
    ds[:] = [x for x in ds if not x.startswith('.') and x != 'tools']
    for f in fs:
        p = os.path.relpath(os.path.join(d, f), root).replace(os.sep, '/')
        if p not in skip: files.append(p)
files.sort()
h = hashlib.sha1()
for p in files:
    h.update(p.encode()); h.update(open(os.path.join(root, p), 'rb').read())
ver = h.hexdigest()[:10]
tpl = open(os.path.join(root, 'tools', 'sw.template.js'), encoding='utf-8').read()
out = tpl.replace('__VERSION__', ver).replace('__ASSETS__', json.dumps(['./'] + files, ensure_ascii=False, indent=1))
open(os.path.join(root, 'sw.js'), 'w', encoding='utf-8').write(out)
print('sw.js:', len(files), 'فایل، نسخه', ver)
