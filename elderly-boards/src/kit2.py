"""Second-generation board kit: paper texture, photo frames, botanical line art, refined section headers."""
import math, os
from kit import *   # noqa  (css, hd, card, box, tape, icon, swatch, mini_plan, legend_*, page ...)

HERE = os.path.dirname(os.path.abspath(__file__))
REN = '../renders/final/'

def css2():
    return css() + '''
.board{background:#F5EDDF}
.paper{position:absolute;inset:0;background-image:url(../renders/paper.png);background-size:120mm 120mm;opacity:.55;pointer-events:none}
.frame{position:absolute;inset:6mm;border:.3mm solid rgba(150,120,80,.45);border-radius:1.2mm;pointer-events:none}
.frame2{position:absolute;inset:8mm;border:.15mm solid rgba(150,120,80,.30);border-radius:.8mm;pointer-events:none}
.card{background:#FFFCF6;border:.3mm solid #E4D5BB;border-radius:2mm;box-shadow:0 .8mm 2.4mm rgba(110,80,40,.12), inset 0 0 0 .6mm rgba(255,255,255,.7)}
.hd{border-bottom:.25mm solid #E4D5BB;padding:3.4mm 5mm 2mm}
.hd .no{font-size:9.6mm;color:#C4623F}
.hd .zh{font-size:6.6mm}
.ph{position:absolute;background:#fff;padding:2mm 2mm 0 2mm;box-shadow:0 1.2mm 3.6mm rgba(70,45,20,.26),0 .2mm .6mm rgba(70,45,20,.2);border-radius:.6mm}
.ph .im{position:relative;overflow:hidden;background:#d8cdbb}
.ph .im img{display:block;width:100%;height:100%;object-fit:cover}
.ph .cp{display:flex;align-items:baseline;gap:2mm;padding:1.4mm 1mm 1.6mm;font-size:3.7mm;line-height:1.2;color:#4A3B2F}
.ph .cp b{font-weight:700;font-family:'Noto Serif SC'}
.ph .cp span{color:#9A8A76;font-size:2.9mm;letter-spacing:.3mm}
.ph .cp .hw{margin-left:auto;font-family:'Ma Shan Zheng';color:#C4623F;font-size:4.6mm}
.pin2{position:absolute;width:5.6mm;height:5.6mm;border-radius:50%;background:#C4623F;border:.5mm solid #fff;color:#fff;font-size:3.2mm;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 .4mm 1mm rgba(0,0,0,.3)}
.note{position:absolute;background:rgba(255,252,244,.92);border-radius:1.4mm;padding:1mm 2.4mm;font-size:3.3mm;line-height:1.3;color:#4A3B2F;border:.2mm solid rgba(196,98,63,.5);box-shadow:0 .4mm 1mm rgba(0,0,0,.15)}
.tape2{position:absolute;height:6.5mm;background:rgba(232,196,140,.72);box-shadow:0 .2mm .6mm rgba(0,0,0,.12)}
.tape2.g{background:rgba(160,190,150,.62)} .tape2.p{background:rgba(232,170,150,.62)}
.chipx{display:inline-block;padding:.6mm 3mm;border:.25mm solid #C4623F;color:#C4623F;border-radius:5mm;font-size:3.4mm;margin:0 1.2mm 1.2mm 0;background:rgba(255,255,255,.7)}
.serifn{font-family:'Noto Serif SC';font-weight:700}
.rule{height:0;border-top:.3mm solid #C4623F;width:24mm}
'''

def botanic(w=60,h=60,rot=0,col='#8FAE86',col2='#C4623F',flip=False):
    """olive-branch line art"""
    leaves=''
    pts=[(10,52,-40),(16,44,30),(20,37,-45),(26,30,25),(31,23,-40),(37,17,30),(43,11,-35),(48,7,25)]
    for i,(x,y,a) in enumerate(pts):
        leaves+=f'<ellipse cx="{x}" cy="{y}" rx="4.2" ry="1.7" transform="rotate({a} {x} {y})" fill="{col}" fill-opacity=".55" stroke="{col}" stroke-width=".5"/>'
    leaves+=f'<circle cx="24" cy="44" r="1.6" fill="{col2}" fill-opacity=".8"/><circle cx="35" cy="30" r="1.5" fill="{col2}" fill-opacity=".8"/>'
    stem=f'<path d="M6 58 C20 44 30 30 52 4" fill="none" stroke="{col}" stroke-width=".9" stroke-linecap="round"/>'
    t=f'scale(-1 1) translate(-60 0)' if flip else ''
    return f'<svg viewBox="0 0 60 60" width="{w}mm" height="{h}mm" style="transform:rotate({rot}deg)"><g transform="{t}">{stem}{leaves}</g></svg>'

def wavy(w=60,col='#C4623F'):
    return f'<svg viewBox="0 0 120 8" width="{w}mm" height="{w*8/120}mm"><path d="M2 5 Q12 0 22 4 T42 4 T62 4 T82 4 T102 4 T118 3" fill="none" stroke="{col}" stroke-width="1.4" stroke-linecap="round"/></svg>'

def sunmark(size=14):
    rays=''.join(f'<line x1="{24+15*math.cos(a*math.pi/6):.1f}" y1="{24+15*math.sin(a*math.pi/6):.1f}" x2="{24+21*math.cos(a*math.pi/6):.1f}" y2="{24+21*math.sin(a*math.pi/6):.1f}" stroke="#E0A21B" stroke-width="2.4" stroke-linecap="round"/>' for a in range(12))
    return f'<svg viewBox="0 0 48 48" width="{size}mm" height="{size}mm"><circle cx="24" cy="24" r="10" fill="#F6D98A" stroke="#E0A21B" stroke-width="2"/>{rays}</svg>'

def photo(name,x,y,w,h,cap='',en='',hand='',rot=0,tapes=(),pos='50% 50%',pins=(),notes=(),zi=1,fit='cover'):
    """framed photo (render). x,y,w,h in mm = outer size of the frame incl. border+caption."""
    capH=9.2 if (cap or en or hand) else 0
    iw=w-4; ih=h-2-capH-(0 if capH else 2)
    src=REN+name+'.jpg'
    pin_html=''.join(f'<div class="pin2" style="left:calc({px}% - 2.8mm);top:calc({py}% - 2.8mm)">{n}</div>' for n,px,py in pins)
    note_html=''.join(f'<div class="note" style="left:{nx}%;top:{ny}%">{t}</div>' for t,nx,ny in notes)
    cp=f'<div class="cp"><b>{cap}</b><span>{en}</span><span class="hw">{hand}</span></div>' if capH else '<div style="height:2mm"></div>'
    tp=''.join(f'<div class="tape2 {c}" style="left:{tx}mm;top:{ty}mm;width:{tw}mm;transform:rotate({tr}deg)"></div>' for (tx,ty,tw,tr,c) in tapes)
    return (f'<div class="ph" style="left:{x}mm;top:{y}mm;width:{w}mm;height:{h}mm;transform:rotate({rot}deg);z-index:{zi}">'
            f'<div class="im" style="width:{iw}mm;height:{ih}mm"><img src="{src}" style="object-fit:{fit};object-position:{pos}">{pin_html}{note_html}</div>{cp}{tp}</div>')

def deco_bg(seed=0):
    return ('<div class="paper"></div><div class="frame"></div><div class="frame2"></div>'
            '<div class="abs" style="left:-60mm;top:-60mm;width:200mm;height:200mm;border-radius:50%;background:radial-gradient(circle,rgba(247,220,160,.55) 0%,rgba(247,227,184,0) 70%)"></div>'
            '<div class="abs" style="right:-70mm;top:380mm;width:220mm;height:220mm;border-radius:50%;background:radial-gradient(circle,rgba(200,222,188,.45) 0%,rgba(227,236,214,0) 70%)"></div>'
            '<div class="abs" style="left:-50mm;bottom:-50mm;width:240mm;height:240mm;border-radius:50%;background:radial-gradient(circle,rgba(238,190,165,.45) 0%,rgba(243,213,194,0) 70%)"></div>')

def page2(inner,title):
    return f'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>{title}</title><style>{css2()}</style></head><body>{cad_defs()}<div class="board">{deco_bg()}{inner}</div></body></html>'
