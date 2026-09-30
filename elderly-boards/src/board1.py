import math
from kit3 import *
import axo as AXO

def axo_fig():
    svg, scr = AXO.axo(rot=-12, sy=.62, gap=122, W=1200, H=560, thick=10, pad=14)
    pins = [(1, 375, 478, 0), (2, 307.7, 478, 0), (3, 175.5, 478, 0), (4, 110, 472, 0), (5, *W(WU[1] + 33, 106), 0),
            (6, 378, 470, 1), (7, 200, 478, 1), (8, *W(WU[2], 105), 1), (9, 226, 395, 1)]
    c = ''
    for n, x, y, l in pins:
        px, py = scr(x, y, l)
        c += f'<circle cx="{px:.1f}" cy="{py:.1f}" r="10.5" fill="{INK}" stroke="#fff" stroke-width="2"/><text x="{px:.1f}" y="{py+4.6:.1f}" text-anchor="middle" font-size="13.5" fill="#fff" font-weight="700" class="sans">{n}</text>'
    return svg.replace('</svg>', c + '</svg>')

def build():
    o = ''
    # ---------------------------------------------------------------- hero (full-bleed render + title)
    o += hero('hall2', 282, '50% 62%', 'COMMUNITY ELDERLY CARE CENTRE · INTERIOR DESIGN · BOARD 01 / 03',
              '暖阳颐养之家', '社区嵌入式养老服务中心　室内设计方案',
              extra_html='<div class="abs serif" style="right:20mm;bottom:26mm;font-size:6.6mm;letter-spacing:1.6mm;color:rgba(255,255,255,.95);text-align:right;line-height:1.6">让老去，被温柔地接住<div style="font-size:2.9mm;letter-spacing:.8mm;font-family:Noto Sans SC;font-weight:400;opacity:.85">WARM SUN CARE HOME</div></div>')
    # ---------------------------------------------------------------- concept keywords
    o += sec(20, 291, 554, '设计理念', 'CONCEPT', '像家一样熟悉，比家更安心')
    kws = [('温', 'WARM', '暖木、奶油白、陶土与鼠尾草绿，触感柔软'),
           ('安', 'SAFE', '无门槛、双层扶手、防滑地胶、全圆角'),
           ('明', 'BRIGHT', '南向日光与 3000K 暖白光，夜间脚灯'),
           ('忆', 'MEMORY', '色彩门楣、记忆盒、走廊视觉地标'),
           ('伴', 'TOGETHER', '居室 → 廊下座 → 日光厅，三级社交')]
    for i, (z, e, d) in enumerate(kws):
        o += f'<div class="kw" style="left:{20 + i * 112.5}mm;top:305mm;width:100mm"><div class="z">{z}</div><div class="e">{e}</div><div class="d">{d}</div></div>'
    # ---------------------------------------------------------------- axonometric + palette/materials
    o += sec(20, 344, 554, '空间总览', 'EXPLODED AXONOMETRIC', '一层公共服务 · 二层居住照护')
    o += f'<div class="abs" style="left:18mm;top:352mm;width:352mm;height:168mm">{axo_fig()}</div>'
    leg = [(1, '门厅 · 接待'), (2, '长者食堂'), (3, '康复训练'), (4, '医务 · 值班'), (5, '多功能活动厅'), (6, '日光起居 · 共享餐厅'), (7, '居室 ×8'), (8, '转角翼居室 ×4'), (9, '护理站')]
    o += f'<div class="abs" style="left:22mm;top:519mm;width:346mm;display:flex;flex-wrap:wrap;gap:0 4.5mm;font-size:3.3mm;line-height:1.9">' + ''.join(f'<span style="white-space:nowrap"><span class="pinn" style="width:4.4mm;height:4.4mm;font-size:2.6mm">{n}</span> {t}</span>' for n, t in leg) + '</div>'
    # palette + materials (right column)
    pal = [('燕麦白', '#F3EADB'), ('暖橡木', '#C89C6C'), ('陶土', '#DE9B7A'), ('鼠尾草', '#A9BFA0'), ('晨光黄', '#F3CE7B'), ('雾蓝', '#B7CFDD')]
    o += f'<div class="abs" style="left:384mm;top:356mm;width:190mm;display:grid;grid-template-columns:repeat(6,1fr);gap:2mm">' + ''.join(f'<div><div style="height:15mm;background:{c};border:.2mm solid rgba(80,60,40,.22)"></div><div style="font-size:3mm;margin-top:.8mm">{n}</div><div style="font-size:2.5mm;color:{SUB}">{c}</div></div>' for n, c in pal) + '</div>'
    sw = [('oak', '暖橡木饰面'), ('paint', '艺术涂料'), ('floor', '木纹地胶'), ('linen', '亚麻'), ('terra', '陶土仿皮'), ('slate', '岩板')]
    o += f'<div class="abs" style="left:384mm;top:394mm;width:190mm;display:grid;grid-template-columns:repeat(6,1fr);gap:2mm">' + ''.join(f'<div><div style="height:26mm">{swatch(k, 100, 100)}</div><div style="font-size:3mm;margin-top:.8mm">{n}</div></div>' for k, n in sw) + '</div>'
    o += tx(384, 440, 190, '<b>材质原则</b>　哑光、无反光、抗菌易清洁；边角一律圆角收边，触感温润。', 3.5)
    figs = [('2', '层'), ('12', '间居室'), ('≈1160', '㎡ 建筑面积'), ('1.8', 'm 走廊净宽')]
    o += f'<div class="abs" style="left:384mm;top:466mm;width:190mm;display:grid;grid-template-columns:repeat(4,1fr);gap:2mm;border-top:.25mm solid {LINE};padding-top:3mm">' + ''.join(f'<div><div class="num" style="font-size:8mm;line-height:1">{a}</div><div style="font-size:3mm;color:{SUB};margin-top:.6mm">{b}</div></div>' for a, b in figs) + '</div>'
    o += tx(384, 494, 190, '面积按图纸推算（1pt≈0.1m），为约数；JGJ 450 / GB 50763 作参考，数值待深化复核。', 3, f'color:{SUB};')
    # ---------------------------------------------------------------- render strip
    o += sec(20, 537, 554, '空间意象', 'SPACE IMPRESSIONS', '')
    tiles = [('bedroom', '居室', 'ROOM', '50% 60%'), ('corridor2', '记忆走廊', 'CORRIDOR', '50% 50%'), ('canteen1', '长者食堂', 'CANTEEN', '50% 55%'), ('lobby1', '门厅 · 茶座', 'LOBBY', '50% 55%')]
    tw = (554 - 3 * 4) / 4
    for i, (n, zh, en, pos) in enumerate(tiles):
        x = 20 + i * (tw + 4)
        o += img(n, x, 549, tw, 70, pos) + cap(x, 620, zh, en)
    # ---------------------------------------------------------------- analysis
    o += sec(20, 635, 554, '策略分析', 'DESIGN ANALYSIS', '一层 / 二层')
    colw = (554 - 2 * 8) / 3
    def col(i, title_zh, title_en, kind, legend):
        x = 20 + i * (colw + 8)
        s = f'<div class="abs" style="left:{x}mm;top:647mm;width:{colw}mm;font-size:3.4mm"><b>{title_zh}</b> <span style="color:{SUB};font-size:2.7mm;letter-spacing:.7mm">{title_en}</span></div>'
        s += f'<div class="abs" style="left:{x}mm;top:653mm;width:{colw}mm"><div style="position:relative">{mini_plan(1, kind)}<span class="pinn" style="position:absolute;left:0;top:0;width:5mm;height:5mm;font-size:2.7mm">1F</span></div>'
        s += f'<div style="position:relative;margin-top:-1mm">{mini_plan(2, kind)}<span class="pinn" style="position:absolute;left:0;top:0;width:5mm;height:5mm;font-size:2.7mm;background:#5E8C55">2F</span></div></div>'
        s += f'<div class="abs" style="left:{x}mm;top:806mm;width:{colw}mm;line-height:1.7">{legend}</div>'
        return s
    o += col(0, '功能分区', 'ZONING', 'zone', zone_legend(['reception', 'dining', 'rehab', 'care', 'activity', 'living']))
    o += col(1, '动线', 'CIRCULATION', 'circ', legend_row([('ln', '#C4623F', '长者动线'), ('dash', '#4E86A6', '服务动线'), ('dash', '#5E8C55', '疏散')]))
    o += col(2, '光环境', 'LIGHT', 'light', legend_row([('ln', '#E0A21B', '南向自然光'), ('dash', '#E8A317', '3000K 灯光')]))
    o += footer('暖阳颐养之家 · 3# 楼室内设计方案', 'BOARD 01 / 03 · 设计总览')
    return page3(o, '暖阳颐养之家 · 展板01 设计总览')
