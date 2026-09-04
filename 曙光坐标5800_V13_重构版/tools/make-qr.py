# -*- coding: utf-8 -*-
"""从 scripts/site-config.js 读取 canonicalUrl，重新生成 assets/generated/site-qr.png。
   用法：python3 tools/make-qr.py
   目的：换部署地址后，二维码不会和分享链接脱钩。"""
import pathlib, re, sys
try:
    import qrcode
except ImportError:
    sys.exit("请先安装：pip install qrcode pillow")

root = pathlib.Path(__file__).resolve().parent.parent
cfg = (root / "scripts" / "site-config.js").read_text(encoding="utf-8")
m = re.search(r'canonicalUrl:\s*"([^"]+)"', cfg)
if not m:
    sys.exit("未能在 site-config.js 中找到 canonicalUrl")
url = m.group(1)

qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M,
                   box_size=16, border=2)
qr.add_data(url)
qr.make(fit=True)
img = qr.make_image(fill_color="#171A17", back_color="white").convert("RGB").resize((512, 512))
out = root / "assets" / "generated" / "site-qr.png"
img.save(out)
print("二维码已按 %s 重新生成 → %s" % (url, out.relative_to(root)))
