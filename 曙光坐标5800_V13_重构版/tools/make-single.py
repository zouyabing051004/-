# -*- coding: utf-8 -*-
"""把整站打成一个自包含的 index.html：样式、脚本、字体、图片全部内嵌。
   目的：放在任何位置（包括压缩包临时目录）双击都能打开。"""
import base64, os, pathlib, re, sys

SRC = pathlib.Path(os.environ['FINAL'])
OUT = pathlib.Path(sys.argv[1])

html = (SRC / 'index.html').read_text(encoding='utf-8')

MIME = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml', '.avif': 'image/avif', '.woff2': 'font/woff2'}

IMG = pathlib.Path(os.environ.get('TMPIMG') or SRC)   # 图片可来自降采样目录

def data_uri(path: pathlib.Path) -> str:
    return 'data:%s;base64,%s' % (MIME[path.suffix.lower()],
                                  base64.b64encode(path.read_bytes()).decode())

def img_uri(rel: str) -> str:
    """图片优先取降采样版本；单文件版是「随处可开」的便携副本，
       长边限 1100px、webp q78，完整分辨率仍在目录版里。"""
    cand = IMG / rel
    return data_uri(cand if cand.exists() else SRC / rel)

# ---------- 1. 样式：合并为一个 <style>，字体转 data URI ----------
css_parts = []
for m in re.finditer(r'<link rel="stylesheet" href="(styles/[^"]+)" />', html):
    rel = m.group(1)
    css = (SRC / rel).read_text(encoding='utf-8')
    css = re.sub(r'url\("\.\./fonts/([^"]+)"\)',
                 lambda mm: 'url(%s)' % data_uri(SRC / 'fonts' / mm.group(1)), css)
    # CSS 里的背景图同样要内嵌，否则单文件版被移到别处后这些底图会静默 404
    css = re.sub(r'url\("(?:\.\./)+((?:assets|)[^"]+)"\)',
                 lambda mm: 'url(%s)' % img_uri(mm.group(1)), css)
    css_parts.append('/* ===== %s ===== */\n%s' % (rel, css))
html = re.sub(r'\n<link rel="stylesheet" href="styles/[^"]+" />', '', html)
html = html.replace('</head>', '<style>\n%s\n</style>\n</head>' % '\n'.join(css_parts))

# 单文件版没有外部字体文件，file:// 下的内嵌字体表也不需要了
html = re.sub(r'<script>\s*/\* 直接双击打开.*?</script>\n', '', html, flags=re.S)
html = re.sub(r'<link rel="preload" as="image" href="[^"]+" />\n', '', html)
html = re.sub(r'<link rel="manifest" href="[^"]+" />\n', '', html)

# ---------- 2. 图片：建立「站内路径 → data URI」映射 ----------
# 只收 webp/png：AVIF 只是同一张图的可选更优编码，单文件版直接去掉以省体积
assets = {}
for p in sorted((SRC / 'assets').rglob('*')):
    if p.is_file() and p.suffix.lower() in ('.webp', '.png'):
        rel = p.relative_to(SRC).as_posix()
        assets[rel] = img_uri(rel)
for name in ('favicon.svg',):
    assets[name] = data_uri(SRC / name)

# 去掉 AVIF <source>：它们指向未内嵌的文件，留着会让浏览器请求不存在的资源
html = re.sub(r'\n\s*<source[^>]*type="image/avif"[^>]*/?>', '', html)

# ---------- 3. 脚本：按 index.html 中的顺序合并 ----------
js_parts = []
for m in re.finditer(r'<script src="(scripts/[^"]+)"></script>', html):
    rel = m.group(1)
    js = (SRC / rel).read_text(encoding='utf-8')
    # 去掉 AVIF 分支（对应文件未内嵌）
    js = re.sub(r'\n\s*h\("source", \{ srcset: "assets/[^"]+\.avif"[^}]*\}\),', '', js)
    js = re.sub(r'\n\s*h\("source", \{ media: "[^"]*", srcset: "assets/[^"]+\.avif"[^}]*\}\),', '', js)
    js = js.replace('if (lab.imageAvif) ', 'if (false) ')
    js_parts.append('/* ===== %s ===== */\n%s' % (rel, js))
html = re.sub(r'\n<script src="scripts/[^"]+"></script>', '', html)
html = re.sub(r'\n<!-- 数据层[^\n]*-->|\n<!-- 核心 -->|\n<!-- 组件 -->|\n<!-- 页面 -->|\n<!-- 启动 -->', '', html)

inline_map = '<script>window.__INLINE_ASSETS__ = {\n' + \
    ',\n'.join('"%s":"%s"' % (k, v) for k, v in assets.items()) + '\n};</script>'

html = html.replace('</body>', inline_map + '\n<script>\n' + '\n'.join(js_parts) + '\n</script>\n</body>')

# ---------- 4. 页面内的直接引用（preload、og:image 等）----------
for rel, uri in assets.items():
    html = html.replace('href="%s"' % rel, 'href="%s"' % uri)
html = html.replace('<link rel="apple-touch-icon" href="icon-192.png" />', '')
html = html.replace('content="og.png"', 'content=""')

# 单文件版说明：下载类外链在没有同级文件时会失效，改为提示
html = html.replace('<title>', '<!-- 单文件版：样式/脚本/字体/图片全部内嵌，可放在任意位置直接打开。\n'
                               '     注意：开放数据（CSV/JSON/XLSX）与文档未内嵌，相关下载链接需使用完整目录版。 -->\n<title>')

OUT.write_text(html, encoding='utf-8')
print('单文件版：%s  %.1f MB  内嵌图片 %d 张' % (OUT.name, OUT.stat().st_size / 1048576, len(assets)))
