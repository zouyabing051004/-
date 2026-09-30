import math
from kit2 import *

def build():
    o = ''
    # ------------------------------------------------ header
    o += box(20, 13, 340, 6, '<span class="sans" style="font-size:3.5mm;letter-spacing:1.5mm;color:#9A8A76">3# BUILDING · COMMUNITY ELDERLY CARE CENTRE · INTERIOR DESIGN · BOARD 01 / 03</span>')
    o += box(19, 19, 300, 46, '<div class="serif" style="font-size:40mm;font-weight:700;line-height:1.12;letter-spacing:1.6mm;color:#3F3227">暖阳颐养之家</div>')
    o += box(272, 26, 30, 30, sunmark(24))
    o += box(300, 14, 70, 70, botanic(64, 64, 8, '#8FAE86', '#C4623F'), 'opacity:.9')
    o += box(22, 66, 340, 11, '<div class="serif" style="font-size:8.8mm;font-weight:600;letter-spacing:1mm;color:#6B4A33">社区嵌入式养老服务中心 · 室内设计方案</div>')
    o += box(22, 78, 340, 6, '<div class="sans" style="font-size:3.6mm;letter-spacing:.4mm;color:#8A7A66">WARM SUN CARE HOME — an age-friendly interior for a two-storey community centre</div>')
    o += box(22, 87, 340, 20, '<div class="hand" style="font-size:16.5mm;line-height:1.1">让老去，被温柔地接住</div>')
    o += box(22, 104, 100, 4, wavy(88))
    o += tape(255, 15, 5, 26)
    pal = ['#F3EADB', '#E9D5B5', '#C89C6C', '#DE9B7A', '#A9BFA0', '#F3CE7B']
    o += card(372, 13, 202, 96, f'''<div style="padding:4mm 5.5mm;position:relative">
      <div style="position:absolute;right:3mm;top:1mm;opacity:.9">{botanic(22, 22, -20, '#8FAE86', '#C4623F', True)}</div>
      <div style="display:flex;align-items:baseline;gap:3mm"><span class="serif" style="font-size:6mm;font-weight:700">设计方向</span><span class="cap" style="letter-spacing:.6mm">DESIGN DIRECTION</span></div>
      <div class="hand" style="font-size:10.5mm;margin:1.4mm 0 1.4mm;line-height:1.2">像家一样熟悉，比家更安心。</div>
      <div style="display:flex;gap:1.6mm;margin:1.6mm 0 2.2mm">{''.join(f'<div style="flex:1;height:7.5mm;border-radius:1.6mm;background:{c};border:.2mm solid rgba(80,60,40,.25)"></div>' for c in pal)}</div>
      <div style="font-size:4mm;line-height:1.55;color:#5B4B3B">以<b>暖木 · 奶油白 · 陶土 · 鼠尾草绿</b>构成“家”的底色，用<b>无感的适老细节</b>守护尊严；让一栋规整的两层楼，成为有阳光、有邻里、有记忆的颐养之家。</div>
      <div style="margin-top:2mm">{''.join(f'<span class="chipx">{t}</span>' for t in ['温 Warm', '安 Safe', '明 Bright', '忆 Memory', '伴 Together'])}</div>
      <div style="margin-top:.8mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.6mm;font-size:3.3mm;line-height:1.35;color:#6B5B4B"><div><b style="color:#C4623F">图纸解读</b><br>3.3m 柱距 ×8 + 6.6m 大厅</div><div><b style="color:#C4623F">进深</b><br>居室 7.5m · 走廊 1.8m</div><div><b style="color:#C4623F">转角翼</b><br>4 间 · 40° 折角</div></div>
    </div>''')
    # ------------------------------------------------ row A : hero renders
    o += photo('aerial2', 20, 114, 350, 224, '二层 · 居住照护层', 'FIRST-PERSON AERIAL · UPPER FLOOR', '整层朝南', pos='50% 60%',
               tapes=[(-6, 6, 26, -35, ''), (326, 4, 26, 40, 'p')], zi=3)
    o += photo('hall2', 378, 114, 196, 111, '日光起居 · 共享餐厅', 'SUNLIT LIVING & DINING', '全天有光', rot=.5, tapes=[(80, -3, 26, 2, 'g')], zi=2)
    o += photo('bedroom', 378, 229, 196, 111, '标准居室', 'TYPICAL ROOM', '我的小家', rot=-.4, tapes=[(70, -3, 26, -2, '')], zi=2)
    # ------------------------------------------------ row B : three renders
    o += photo('lobby1', 20, 346, 178, 118, '门厅 · 接待 · 茶座', 'LOBBY & TEA LOUNGE', '进门就暖', rot=-.3, tapes=[(70, -3, 26, 1, '')])
    o += photo('corridor2', 208, 346, 178, 118, '记忆走廊', 'MEMORY CORRIDOR', '认得出自己的门', rot=.3, tapes=[(70, -3, 26, -1, 'p')])
    o += photo('canteen1', 396, 346, 178, 118, '长者食堂 · 助餐', 'COMMUNITY CANTEEN', '热乎的一顿饭', rot=-.3, tapes=[(70, -3, 26, 1, 'g')])
    # ------------------------------------------------ row C
    y = 472; h = 98
    o += card(20, y, 172, h, hd('01', '设计理念', 'CONCEPT') + '''<div class="bd" style="padding-top:2mm;font-size:4.2mm;line-height:1.5">
      <p style="margin-bottom:1mm">图纸是一栋规整的两层楼：南侧 <b>8 间 3.3m 开间</b>单元、1.8m 中廊，东端 6.6m 大厅，再折出 <b>4 间 40° 转角翼</b>。</p>
      <p style="margin-bottom:1mm"><b>化整为零</b>　一个开间即一间居室，保持“家”的尺度。</p>
      <p style="margin-bottom:1mm"><b>阳光向南</b>　居室与日光厅朝南，整日有光。</p>
      <p style="margin-bottom:1mm"><b>公共在下，私密在上</b>　一层接纳社区与康复，二层留给睡眠与陪伴。</p>
      <p style="margin:0"><b>去机构化</b>　医疗设备隐入柜体，以织物、灯具营造居家氛围。</p></div>''')
    pr = [('safe', '安', 'SAFE', '走廊净宽约1.8m，双层连续扶手，无门槛、防滑地胶、家具全圆角'),
          ('warm', '暖', 'WARM', '暖木 · 奶油白 · 陶土 · 鼠尾草绿；触感柔软，避免冷金属与强反光'),
          ('bright', '明', 'BRIGHT', '南向自然光 + 3000K 暖白光；低眩光，夜间 0.25m 脚灯'),
          ('memory', '忆', 'MEMORY', '门框色彩记忆条、“记忆盒”、廊内视觉地标，降低迷路焦虑'),
          ('together', '伴', 'TOGETHER', '居室 — 廊下座 — 日光厅 / 食堂，三级社交梯度')]
    rows = ''.join(f'<div style="display:flex;gap:3mm;align-items:flex-start;margin-bottom:1.2mm">{icon(k, 10.5)}<div style="font-size:3.9mm;line-height:1.4"><b class="serif" style="font-size:5mm;color:#C4623F">{z}</b> <span class="cap">{e}</span><br>{t}</div></div>' for k, z, e, t in pr)
    o += card(202, y, 206, h, hd('02', '适老五原则', 'FIVE PRINCIPLES') + f'<div class="bd" style="padding-top:1.8mm;padding-bottom:0">{rows}</div>')
    swp = [('燕麦白', '#F3EADB'), ('暖橡木', '#C89C6C'), ('陶土', '#DE9B7A'), ('鼠尾草', '#A9BFA0'), ('晨光黄', '#F3CE7B'), ('雾蓝', '#B7CFDD')]
    sw = ''.join(f'<div style="text-align:center"><div style="height:16mm;border-radius:1.8mm;background:{c};border:.25mm solid rgba(80,60,40,.25)"></div><div style="font-size:3.6mm;margin-top:.6mm;font-weight:500;line-height:1.2">{n}</div><div class="cap" style="font-size:2.9mm;line-height:1.1">{c}</div></div>' for n, c in swp)
    o += card(418, y, 156, h, hd('03', '色彩与氛围', 'COLOUR & MOOD') + f'<div class="bd" style="padding-top:2.4mm"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.8mm">{sw}</div><div class="small" style="margin-top:1.4mm;font-size:3.5mm">暖色亲近，雾蓝静谧；晨光黄与陶土作视觉地标。</div></div>')
    # ------------------------------------------------ row D : analysis
    y = 578; h = 170
    def ov(html, left=3, top=36): return f'<div style="position:absolute;left:{left}mm;top:{top}mm">{html}</div>'
    def col(x, no, zh, en, kind, legend, note, w=182):
        inner = hd(no, zh, en) + '<div style="padding:2mm 3mm 0">'
        inner += f'<div style="position:relative">{mini_plan(1, kind)}<span class="pin" style="position:absolute;left:0;top:0;width:6mm;height:6mm;font-size:3.2mm">1F</span>{ov(legend, 1, 53)}</div>'
        inner += f'<div style="position:relative">{mini_plan(2, kind)}<span class="pin" style="position:absolute;left:0;top:0;width:6mm;height:6mm;font-size:3.2mm;background:#5E8C55">2F</span>{ov(note, 1, 53)}</div></div>'
        return card(x, y, w, h, inner)
    L1 = f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 3mm;width:112mm">{legend_zone(["reception", "dining", "rehab", "care", "activity", "living", "bed", "support"])}</div>'
    o += col(20, '04', '功能分区', 'FUNCTION ZONING', 'zone', L1, '<div class="small" style="width:110mm">一层承接社区服务、康复与助餐；二层 12 间居室围绕日光起居厅，形成小家庭式照护单元。</div>')
    L2 = f'<div style="width:112mm">{legend_line([("#C4623F", "长者 · 访客主动线", 0), ("#4E86A6", "后勤 · 护理服务线", 1), ("#5E8C55", "垂直交通 · 疏散", 1)])}</div>'
    o += col(212, '05', '动线分析', 'CIRCULATION', 'circ', L2, '<div class="small" style="width:110mm">服务动线与长者动线两道分离；二层由电梯直达居住走廊。</div>')
    L3 = f'<div style="width:112mm">{legend_line([("#E0A21B", "自然采光（南向）", 0), ("#E8A317", "3000K 暖白筒灯", 1), ("#F3CE7B", "线性灯带 · 夜灯", 1)])}</div>'
    o += col(404, '06', '光环境', 'LIGHT', 'light', L3, '<div class="small" style="width:110mm">居室、大厅全部朝南；走廊线性灯带匀光，夜间脚灯 0.25m。</div>', 170)
    # ------------------------------------------------ row E
    y = 756; h = 74
    sw = [('oak', '暖橡木饰面', '墙裙·扶手'), ('paint', '奶油艺术涂料', '墙面·无反光'), ('floor', '木纹防滑地胶', '居室·走廊'), ('linen', '鼠尾草亚麻', '窗帘·沙发'), ('terra', '陶土仿皮', '座椅·软包'), ('slate', '浅色岩板', '护理台')]
    cells = ''.join(f'<div><div style="height:23mm">{swatch(k, 100, 100)}</div><div style="font-size:3.7mm;font-weight:500;margin-top:.8mm;line-height:1.2">{n}</div><div class="cap" style="font-size:3mm">{u}</div></div>' for k, n, u in sw)
    o += card(20, y, 236, h, hd('07', '材质板', 'MATERIAL BOARD') + f'<div class="bd" style="padding-top:2.4mm"><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:2.6mm">{cells}</div></div>')
    dims = [('走廊净宽', '≥ 1800', '约1.8m'), ('居室门净宽', '1000', '含推拉门'), ('连续扶手', '650 / 850', '双层'), ('护理床面高', '500', '可调'), ('轮椅回转', 'Ø1500', '居室·卫生间'), ('坐姿窗台', '≤ 600', '低窗台')]
    tr = ''.join(f'<tr><td>{a}</td><td style="text-align:right;font-weight:700;color:#C4623F">{b}</td><td class="cap">{c}</td></tr>' for a, b, c in dims)
    o += card(266, y, 172, h, hd('08', '适老关键尺度', 'DIMENSIONS · MM') + f'<div class="bd" style="padding-top:.2mm"><table class="t" style="font-size:3.5mm"><tbody>{tr}</tbody></table></div>')
    stats = [('2', '层'), ('12', '间单人居室'), ('≈1160', '㎡ 总建筑面积'), ('≈23.6', '㎡/间（含卫）'), ('1.8', 'm 走廊净宽'), ('3.3', 'm 居室开间')]
    st = ''.join(f'<div style="text-align:center"><div class="serif" style="font-size:8mm;font-weight:700;color:#C4623F;line-height:1.0">{a}</div><div class="small" style="font-size:3.1mm;line-height:1.2">{b}</div></div>' for a, b in stats)
    o += card(448, y, 126, h, hd('09', '项目指标', 'KEY FIGURES') + f'<div class="bd" style="padding-top:1.4mm;padding-bottom:1mm"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6mm 1mm">{st}</div></div>')
    o += box(20, 833, 554, 5, '<div class="cap" style="display:flex;justify-content:space-between;font-size:3.1mm"><span>暖阳颐养之家 · 3# 楼室内设计方案　｜　面积与尺度按图纸推算（1pt≈0.1m），为约数；JGJ 450 / GB 50763 作参考，数值待深化复核</span><span>BOARD 01 / 03 · 设计总览</span></div>')
    return page2(o, '暖阳颐养之家 · 展板01 设计总览')
