"""Board kit v3 — 'gallery' style: full-bleed hero render, flat warm-white ground, hairline section labels,
almost no cards / shadows / decoration; functional colours only inside diagrams."""
import os, math
from kit import icon, swatch, mini_plan, legend_zone, legend_line, cad_defs, box, card, hd, tape  # noqa
from render import *   # plan_svg, plan_group, wayfinding, circulation, ...
from plans import ZONES

REN = '../renders/final/'
INK = '#3A322B'; SUB = '#7A6C5D'; LINE = '#D9CFBF'; WOOD = '#A9825B'; BG = '#F6F3EC'; ACC = '#B5684A'

def css3():
    fonts = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts.css')).read()
    return fonts + f'''
@page{{size:594mm 841mm;margin:0}}
*{{box-sizing:border-box}}
html,body{{margin:0;padding:0;background:#E9E4DA}}
.board{{position:relative;width:594mm;height:841mm;background:{BG};overflow:hidden;font-family:'Noto Sans SC',sans-serif;color:{INK};-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.sans{{font-family:'Noto Sans SC',sans-serif}}.serif{{font-family:'Noto Serif SC',serif}}
.abs{{position:absolute}}
.sec{{position:absolute;display:flex;align-items:baseline;gap:2.4mm;border-bottom:.25mm solid {LINE};padding-bottom:1.6mm}}
.sec b{{font-family:'Noto Serif SC';font-weight:700;font-size:5.4mm;letter-spacing:.3mm}}
.sec .en{{font-size:2.9mm;letter-spacing:.9mm;color:{SUB};text-transform:uppercase;font-weight:500}}
.sec .r{{margin-left:auto;font-size:3mm;color:{SUB};letter-spacing:.3mm}}
.img{{position:absolute;overflow:hidden;background:#DDD5C7}}
.img img{{display:block;width:100%;height:100%;object-fit:cover}}
.cap{{position:absolute;font-size:3.5mm;line-height:1.25;color:{INK};display:flex;align-items:baseline;gap:2mm;white-space:nowrap}}
.cap b{{font-family:'Noto Serif SC';font-weight:700}}
.cap i{{font-style:normal;font-size:2.7mm;color:{SUB};letter-spacing:.5mm;text-transform:uppercase}}
.tx{{position:absolute;font-size:3.9mm;line-height:1.6;color:{INK}}}
.tx b{{font-weight:700}}
.kw{{position:absolute}}
.kw .z{{font-family:'Noto Serif SC';font-weight:700;font-size:9mm;color:{WOOD};line-height:1}}
.kw .e{{font-size:2.8mm;letter-spacing:.8mm;color:{SUB};margin:.6mm 0 1.4mm}}
.kw .d{{font-size:3.7mm;line-height:1.5}}
.lg{{display:inline-flex;align-items:center;gap:1.6mm;font-size:3.3mm;margin:0 4mm 0 0;white-space:nowrap}}
.lg i{{display:inline-block;width:5mm;height:3mm;border-radius:.6mm;border:.2mm solid rgba(80,60,40,.3)}}
.lg .ln{{display:inline-block;width:7mm;height:0;border-top:.8mm solid}}
table.t{{border-collapse:collapse;width:100%;font-size:3.3mm}}
table.t td,table.t th{{padding:.9mm 1.2mm;border-bottom:.2mm solid {LINE};text-align:left;font-weight:400}}
table.t th{{color:{SUB};font-size:2.9mm;font-weight:500;letter-spacing:.3mm}}
.pinn{{display:inline-flex;width:5mm;height:5mm;border-radius:50%;background:{INK};color:#fff;font-size:3mm;font-weight:700;align-items:center;justify-content:center;flex:none}}
.num{{font-family:'Noto Serif SC';font-weight:700;color:{WOOD}}}
'''

def sec(x, y, w, zh, en, right=''):
    return f'<div class="sec" style="left:{x}mm;top:{y}mm;width:{w}mm"><b>{zh}</b><span class="en">{en}</span><span class="r">{right}</span></div>'

def img(name, x, y, w, h, pos='50% 50%', extra=''):
    return f'<div class="img" style="left:{x}mm;top:{y}mm;width:{w}mm;height:{h}mm;{extra}"><img src="{REN}{name}.jpg" style="object-position:{pos}"></div>'

def cap(x, y, zh, en=''):
    return f'<div class="cap" style="left:{x}mm;top:{y}mm"><b>{zh}</b><i>{en}</i></div>'

def tx(x, y, w, html, size=None, extra=''):
    s = f'font-size:{size}mm;' if size else ''
    return f'<div class="tx" style="left:{x}mm;top:{y}mm;width:{w}mm;{s}{extra}">{html}</div>'

def hero(name, h, pos='50% 50%', eyebrow='', title='', sub='', extra_html='', title_size=34):
    o = f'<div class="abs" style="left:0;top:0;width:594mm;height:{h}mm;overflow:hidden">'
    o += f'<div class="img" style="left:0;top:0;width:594mm;height:{h}mm"><img src="{REN}{name}.jpg" style="object-position:{pos}"></div>'
    o += f'<div class="abs" style="left:0;top:0;width:594mm;height:{h}mm;background:linear-gradient(90deg,rgba(28,20,12,.58) 0%,rgba(28,20,12,.18) 46%,rgba(28,20,12,0) 68%),linear-gradient(0deg,rgba(28,20,12,.42) 0%,rgba(28,20,12,0) 34%)"></div>'
    o += f'<div class="abs" style="left:20mm;top:16mm;font-size:3.3mm;letter-spacing:1.4mm;color:rgba(255,255,255,.85)">{eyebrow}</div>'
    o += f'<div class="abs serif" style="left:19mm;bottom:38mm;font-size:{title_size}mm;font-weight:700;letter-spacing:1.4mm;color:#fff;line-height:1.1;text-shadow:0 .6mm 3mm rgba(0,0,0,.25)">{title}</div>'
    o += f'<div class="abs serif" style="left:21mm;bottom:24mm;font-size:7.4mm;font-weight:600;letter-spacing:1mm;color:rgba(255,255,255,.95)">{sub}</div>'
    return o + extra_html + '</div>'

def inset_circle(name, cx, cy, d, pos='50% 50%'):
    return (f'<div class="abs" style="left:{cx-d/2}mm;top:{cy-d/2}mm;width:{d}mm;height:{d}mm;border-radius:50%;overflow:hidden;border:1.4mm solid #fff;box-shadow:0 1mm 4mm rgba(0,0,0,.28)">'
            f'<img src="{REN}{name}.jpg" style="width:100%;height:100%;object-fit:cover;object-position:{pos}"></div>')

def legend_row(items):
    o = ''
    for kind, col, t in items:
        if kind == 'box': o += f'<span class="lg"><i style="background:{col}"></i>{t}</span>'
        elif kind == 'ln': o += f'<span class="lg"><span class="ln" style="border-color:{col}"></span>{t}</span>'
        elif kind == 'dash': o += f'<span class="lg"><span class="ln" style="border-color:{col};border-top-style:dashed"></span>{t}</span>'
        elif kind == 'dot': o += f'<span class="lg"><i style="background:{col};width:3.2mm;border-radius:50%"></i>{t}</span>'
    return o

def zone_legend(keys): return legend_row([('box', ZONES[k][0], ZONES[k][1]) for k in keys])

def page3(inner, title):
    return f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>{title}</title><style>{css3()}</style></head><body>{cad_defs()}<div class="board">{inner}</div></body></html>'

def footer(left, right):
    return f'<div class="abs" style="left:20mm;top:833mm;width:554mm;display:flex;justify-content:space-between;font-size:3mm;color:{SUB};letter-spacing:.3mm"><span>{left}</span><span>{right}</span></div>'
