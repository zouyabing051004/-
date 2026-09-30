"""Shared board kit: CSS, headings, icons, swatches, mini plans."""
import random
from render import *
from illus import *
INK='#4A3B2F'; TERRA='#C4623F'
def css():
    fonts=open('src/fonts.css').read()
    return fonts+'''
@page{size:594mm 841mm;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#EFE6D6}
.board{position:relative;width:594mm;height:841mm;background:#F6EFE2;overflow:hidden;font-family:'Noto Sans SC',sans-serif;color:#4A3B2F;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sans{font-family:'Noto Sans SC',sans-serif}.serif{font-family:'Noto Serif SC',serif}
.abs{position:absolute}
.card{position:absolute;background:#FFFBF4;border:.35mm solid #E6D8BF;border-radius:2.6mm;box-shadow:0 .6mm 1.6mm rgba(120,90,50,.10);padding:0}
.card.plain{background:transparent;border:none;box-shadow:none}
.hd{display:flex;align-items:baseline;gap:2.4mm;padding:3.2mm 4.5mm 2mm;border-bottom:.3mm solid #E6D8BF;margin:0 0 0}
.hd .no{font-family:'Noto Serif SC';font-weight:700;font-size:9mm;color:#C4623F;line-height:1}
.hd .zh{font-family:'Noto Serif SC';font-weight:700;font-size:6.6mm;letter-spacing:.3mm;color:#4A3B2F}
.hd .en{font-size:3.2mm;letter-spacing:.5mm;color:#9A8A76;text-transform:uppercase;font-weight:400;margin-left:auto}
.bd{padding:3mm 5mm 3.5mm;font-size:4.5mm;line-height:1.6;font-weight:400}
.bd p{margin:0 0 1.6mm}
.hand{font-family:'Ma Shan Zheng','Long Cang',cursive;color:#C4623F}
.tape{position:absolute;width:26mm;height:7.5mm;background:rgba(226,190,140,.62);box-shadow:0 .3mm .8mm rgba(0,0,0,.08)}
.chip{display:inline-block;padding:.7mm 3.2mm;border-radius:5mm;background:#F0E1C8;color:#7B5B3A;font-size:3.8mm;margin:0 1.2mm 1.2mm 0;font-weight:500}
.lg{display:flex;align-items:center;gap:2mm;font-size:3.7mm;line-height:1.3;margin:.6mm 0}
.lg i{display:inline-block;width:6mm;height:3.4mm;border-radius:.8mm;flex:none;border:.25mm solid rgba(80,60,40,.35)}
.lg .ln{width:8mm;height:0;border-top:.9mm solid;border-radius:1mm;flex:none}
.small{font-size:3.7mm;line-height:1.5;color:#6B5B4B}
.cap{font-size:3.3mm;color:#8A7A66;letter-spacing:.2mm}
table.t{border-collapse:collapse;width:100%;font-size:4mm}
table.t td,table.t th{padding:1.2mm 1.6mm;border-bottom:.2mm solid #E9DCC6;text-align:left;font-weight:400}
table.t th{color:#9A8A76;font-size:3mm;font-weight:500;letter-spacing:.3mm}
.pin{display:inline-flex;width:5.2mm;height:5.2mm;border-radius:50%;background:#C4623F;color:#fff;font-size:3.1mm;font-weight:700;align-items:center;justify-content:center;flex:none}
.ill{border-radius:1.6mm}
'''
def hd(no,zh,en): return f'<div class="hd"><span class="no">{no}</span><span class="zh">{zh}</span><span class="en">{en}</span></div>'
def card(x,y,w,h,inner,cls='',style=''): return f'<div class="card {cls}" style="left:{x}mm;top:{y}mm;width:{w}mm;height:{h}mm;{style}">{inner}</div>'
def box(x,y,w,h,inner,style='',cls=''): return f'<div class="abs {cls}" style="left:{x}mm;top:{y}mm;width:{w}mm;height:{h}mm;{style}">{inner}</div>'
def tape(x,y,rot=-6,w=26,col=None): return f'<div class="tape" style="left:{x}mm;top:{y}mm;width:{w}mm;transform:rotate({rot}deg);{"background:"+col if col else ""}"></div>'

# ---------------------------------------------------------------- icons (48 box)
def icon(kind,size=12,col='#C4623F',fill='#F6DCC8'):
    p={
     'safe':f'<path d="M24 5 L40 11 V24 C40 33 33 40 24 43 C15 40 8 33 8 24 V11Z" fill="{fill}" stroke="{col}" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 24 L22 30 L33 18" fill="none" stroke="{col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
     'warm':f'<path d="M24 41 C8 30 6 20 10 14 C14 9 21 10 24 16 C27 10 34 9 38 14 C42 20 40 30 24 41Z" fill="{fill}" stroke="{col}" stroke-width="2.4" stroke-linejoin="round"/>',
     'bright':f'<circle cx="24" cy="24" r="8.5" fill="{fill}" stroke="{col}" stroke-width="2.4"/>'+''.join(f'<line x1="{24+13*math.cos(a*math.pi/4):.1f}" y1="{24+13*math.sin(a*math.pi/4):.1f}" x2="{24+18.5*math.cos(a*math.pi/4):.1f}" y2="{24+18.5*math.sin(a*math.pi/4):.1f}" stroke="{col}" stroke-width="2.6" stroke-linecap="round"/>' for a in range(8)),
     'memory':f'<path d="M8 22 L24 8 L40 22 V40 H8Z" fill="{fill}" stroke="{col}" stroke-width="2.4" stroke-linejoin="round"/><rect x="19" y="27" width="10" height="13" rx="1.5" fill="#fff" stroke="{col}" stroke-width="2"/><circle cx="24" cy="19" r="3" fill="{col}"/>',
     'together':f'<circle cx="18" cy="19" r="7" fill="{fill}" stroke="{col}" stroke-width="2.4"/><circle cx="31" cy="19" r="7" fill="#fff" fill-opacity=".7" stroke="{col}" stroke-width="2.4"/><path d="M6 39 C6 31 12 28 18 28 C24 28 30 31 30 39Z" fill="{fill}" stroke="{col}" stroke-width="2.4" stroke-linejoin="round"/><path d="M28 30 C34 28 42 31 42 39 H32" fill="none" stroke="{col}" stroke-width="2.4" stroke-linecap="round"/>',
     'sun':f'<circle cx="24" cy="24" r="9" fill="#F3CE7B" stroke="#E0A21B" stroke-width="2.4"/>'+''.join(f'<line x1="{24+13*math.cos(a*math.pi/4):.1f}" y1="{24+13*math.sin(a*math.pi/4):.1f}" x2="{24+19*math.cos(a*math.pi/4):.1f}" y2="{24+19*math.sin(a*math.pi/4):.1f}" stroke="#E0A21B" stroke-width="2.6" stroke-linecap="round"/>' for a in range(8)),
    }[kind]
    return f'<svg viewBox="0 0 48 48" width="{size}mm" height="{size}mm" style="flex:none">{p}</svg>'

# ---------------------------------------------------------------- material swatches
def swatch(kind,w=100,h=100,uid=''):
    r=random.Random(hash(kind)&0xffff)
    o=f'<svg viewBox="0 0 {w} {h}" width="100%" height="100%" preserveAspectRatio="none" style="display:block;border-radius:1.4mm">'
    if kind=='oak':
        o+=f'<rect width="{w}" height="{h}" fill="#C99E6D"/>'
        for i in range(26):
            y=r.uniform(0,h);a=r.uniform(3,10);ph=r.uniform(0,6)
            d=f'M0 {y:.1f} '+' '.join(f'L{x} {y+a*math.sin(x/16+ph):.1f}' for x in range(6,w+6,6))
            o+=f'<path d="{d}" fill="none" stroke="{"#A97B50" if i%3 else "#E2BE90"}" stroke-width="{r.uniform(.4,1.3):.2f}" opacity=".7"/>'
    elif kind=='paint':
        o+=f'<rect width="{w}" height="{h}" fill="#F2E8D6"/>'
        for i in range(260): o+=f'<circle cx="{r.uniform(0,w):.1f}" cy="{r.uniform(0,h):.1f}" r="{r.uniform(.4,1.6):.1f}" fill="{r.choice(["#E4D6BD","#FAF3E6","#DDCBAE"])}" opacity=".7"/>'
    elif kind=='floor':
        o+=f'<rect width="{w}" height="{h}" fill="#D6B48A"/>'
        for j in range(0,h,20):
            o+=f'<line x1="0" y1="{j}" x2="{w}" y2="{j}" stroke="#B48A5C" stroke-width="1"/>'
            off=r.choice([0,30,55,80])
            for x in range(off,w,90): o+=f'<line x1="{x}" y1="{j}" x2="{x}" y2="{j+20}" stroke="#B48A5C" stroke-width="1"/>'
            for i in range(3): o+=f'<path d="M{r.uniform(0,w):.0f} {j+r.uniform(3,17):.0f} q10 -2 22 0" stroke="#C39A6C" fill="none" stroke-width=".8"/>'
        for x in range(0,w,6):
            for y in range(0,h,6):
                if r.random()<.12: o+=f'<circle cx="{x}" cy="{y}" r=".9" fill="#fff" opacity=".35"/>'
    elif kind=='linen':
        o+=f'<rect width="{w}" height="{h}" fill="#B9CBA6"/>'
        for x in range(0,w,4): o+=f'<line x1="{x}" y1="0" x2="{x}" y2="{h}" stroke="#9DB58C" stroke-width=".8" opacity=".8"/>'
        for y in range(0,h,4): o+=f'<line x1="0" y1="{y}" x2="{w}" y2="{y}" stroke="#DDE7D2" stroke-width=".8" opacity=".8"/>'
    elif kind=='terra':
        o+=f'<rect width="{w}" height="{h}" fill="#DE9B7A"/>'
        for i in range(340): o+=f'<circle cx="{r.uniform(0,w):.1f}" cy="{r.uniform(0,h):.1f}" r="{r.uniform(.3,1.1):.1f}" fill="{r.choice(["#C4805E","#EDB397","#D28866"])}" opacity=".65"/>'
    elif kind=='slate':
        o+=f'<rect width="{w}" height="{h}" fill="#EDE7DC"/>'
        for i in range(7):
            x=r.uniform(0,w);d=f'M{x:.0f} 0 '+' '.join(f'L{x+r.uniform(-14,14):.0f} {y}' for y in range(12,h+12,12))
            o+=f'<path d="{d}" fill="none" stroke="#C9C0B0" stroke-width="{r.uniform(.5,1.6):.1f}" opacity=".8"/>'
    elif kind=='rail':
        o+=f'<rect width="{w}" height="{h}" fill="#F1E6D2"/><rect x="0" y="{h*.36}" width="{w}" height="{h*.28}" rx="{h*.14}" fill="#B98456"/><rect x="0" y="{h*.40}" width="{w}" height="{h*.07}" fill="#DDB283" opacity=".8"/>'
        for x in (18,w-18): o+=f'<rect x="{x-4}" y="{h*.62}" width="8" height="{h*.28}" fill="#A79D91"/>'
    elif kind=='glow':
        o+=f'<rect width="{w}" height="{h}" fill="#F1E6D2"/><ellipse cx="{w/2}" cy="{h/2}" rx="{w*.42}" ry="{h*.3}" fill="#F6D98A" opacity=".55"/><rect x="{w*.12}" y="{h*.45}" width="{w*.76}" height="{h*.1}" rx="{h*.05}" fill="#FFF6D7" stroke="#E0A21B" stroke-width="1"/>'
    o+='</svg>'
    return o

# ---------------------------------------------------------------- mini plans
def mini_plan(floor,kind,vb=(66,368,552,578),width='100%'):
    cw=.2; ccol='#8F8172'
    if kind=='zone':
        return plan_svg(floor,vb=vb,width=width,layers=('fill','cad','open'),cad_col=ccol,cad_w=cw)
    if kind=='circ':
        return plan_svg(floor,vb=vb,width=width,layers=('fill','cad','open'),cad_col=ccol,cad_w=cw,fill_alpha=.32,extra_layers=circulation(floor))
    if kind=='light':
        return plan_svg(floor,vb=vb,width=width,layers=('fill','cad','open'),cad_col=ccol,cad_w=cw,fill_alpha=.28,extra_layers=lighting(floor))
    if kind=='access':
        return plan_svg(floor,vb=vb,width=width,layers=('fill','cad','open'),cad_col=ccol,cad_w=cw,fill_alpha=.3,extra_layers=access(floor))
    if kind=='way':
        return plan_svg(floor,vb=vb,width=width,layers=('fill','cad','open','badges'),cad_col=ccol,cad_w=cw,fill_alpha=.3,extra_layers=wayfinding(floor))
    if kind=='full':
        return plan_svg(floor,vb=vb,width=width,layers=('fill','cad','open','furn','labels','badges'))
    raise ValueError(kind)

def legend_zone(keys):
    return ''.join(f'<div class="lg"><i style="background:{ZONES[k][0]}"></i>{ZONES[k][1]}</div>' for k in keys)
def legend_line(items):
    return ''.join(f'<div class="lg"><span class="ln" style="border-color:{c};{"border-top-style:dashed;" if d else ""}"></span>{t}</div>' for c,t,d in items)

def page(inner,title):
    return f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>{title}</title><style>{css()}</style></head><body>{cad_defs()}<div class="board">{inner}</div></body></html>'
