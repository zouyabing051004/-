import math
from kit import *
import axo as AXO
import scenes
from plans import rooms,area

PINS1=[(1,'门厅 · 接待 · 茶座',375,478,0),(2,'长者食堂 · 助餐',307.7,478,0),(3,'康复训练室',175.5,478,0),(4,'医务 · 值班',110,472,0),(5,'多功能活动厅',None,None,0)]
def hero():
    svg,scr=AXO.axo(rot=-12,sy=.62,gap=122,W=1200,H=560,thick=10,pad=18)
    pins=[(1,375,478,0),(2,307.7,478,0),(3,175.5,478,0),(4,110,472,0),(5,*W(WU[1]+33,106),0),
          (6,378,470,1),(7,200,478,1),(8,*W(WU[2],105),1),(9,226,395,1)]
    c=''
    for n,x,y,l in pins:
        px,py=scr(x,y,l)
        c+=f'<circle cx="{px:.1f}" cy="{py:.1f}" r="11.5" fill="#C4623F" stroke="#fff" stroke-width="2.2"/><text x="{px:.1f}" y="{py+5:.1f}" text-anchor="middle" font-size="15" fill="#fff" font-weight="700" class="sans">{n}</text>'
    c+='<g transform="translate(84 78)"><circle r="30" fill="#F6D98A" opacity=".95"/>'+''.join(f'<line x1="{42*math.cos(a*math.pi/6):.1f}" y1="{42*math.sin(a*math.pi/6):.1f}" x2="{56*math.cos(a*math.pi/6):.1f}" y2="{56*math.sin(a*math.pi/6):.1f}" stroke="#E9B94E" stroke-width="3.4" stroke-linecap="round"/>' for a in range(12))+'</g>'
    c+='<text x="150" y="70" font-size="34" class="hand">南向日光，整日相伴</text>'
    c+='<text x="1150" y="72" font-size="30" class="hand" text-anchor="end">二层 · 居住照护</text><text x="60" y="545" font-size="30" class="hand">一层 · 公共服务</text>'
    return svg.replace('</svg>',c+'</svg>')

def build():
    o=''
    o+='<div class="abs" style="left:-60mm;top:-60mm;width:200mm;height:200mm;border-radius:50%;background:radial-gradient(circle,#F7E3B8 0%,rgba(247,227,184,0) 70%)"></div>'
    o+='<div class="abs" style="right:-70mm;top:330mm;width:220mm;height:220mm;border-radius:50%;background:radial-gradient(circle,#E3ECD6 0%,rgba(227,236,214,0) 70%)"></div>'
    o+='<div class="abs" style="left:-50mm;bottom:-40mm;width:220mm;height:220mm;border-radius:50%;background:radial-gradient(circle,#F3D5C2 0%,rgba(243,213,194,0) 70%)"></div>'
    # ---------------- header
    o+=box(20,14,340,6,'<span class="sans" style="font-size:3.6mm;letter-spacing:1.4mm;color:#9A8A76">COMMUNITY ELDERLY CARE CENTRE · INTERIOR DESIGN · BOARD 01 / 03</span>')
    o+=box(20,21,340,44,'<div class="serif" style="font-size:36mm;font-weight:700;line-height:1.1;letter-spacing:1.5mm;color:#3F3227">暖阳颐养之家</div>')
    o+=box(22,65,335,10,'<div class="serif" style="font-size:8.4mm;font-weight:600;letter-spacing:.9mm;color:#6B4A33">社区嵌入式养老服务中心 · 室内设计方案</div>')
    o+=box(22,77,335,7,'<div class="sans" style="font-size:3.7mm;letter-spacing:.35mm;color:#8A7A66">WARM SUN CARE HOME — An age-friendly interior for a two-storey community centre (3# Building)</div>')
    o+=box(22,88,335,22,'<div class="hand" style="font-size:16mm;line-height:1.1">让老去，被温柔地接住</div>')
    o+=tape(300,17,4,30)
    o+=card(372,14,202,94,f'''<div style="padding:4mm 5.5mm">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="serif" style="font-size:6mm;font-weight:700">设计方向</span><span class="cap" style="letter-spacing:.6mm">DESIGN DIRECTION</span></div>
      <div class="hand" style="font-size:10mm;margin:1.6mm 0 1.4mm;line-height:1.2">像家一样熟悉，比家更安心。</div>
      <div style="display:flex;gap:1.6mm;margin:2.2mm 0 2.6mm">
        {''.join(f'<div style="flex:1;height:8mm;border-radius:1.6mm;background:{c}"></div>' for c in ['#F3EADB','#E9D5B5','#C89C6C','#DE9B7A','#A9BFA0','#F3CE7B'])}
      </div>
      <div style="font-size:4.1mm;line-height:1.55;color:#5B4B3B">以<b>暖木 · 奶油白 · 陶土 · 鼠尾草绿</b>构成“家”的底色，用<b>无感的适老细节</b>守护尊严；让一栋规整的两层楼，成为有阳光、有邻里、有记忆的颐养之家。</div>
      <div style="margin-top:2.2mm">{''.join(f'<span class="chip">{t}</span>' for t in ['温 Warm','安 Safe','明 Bright','忆 Memory','伴 Together'])}</div>
      <div style="margin-top:1.4mm;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.6mm;font-size:3.3mm;line-height:1.35;color:#6B5B4B"><div><b style="color:#C4623F">图纸解读</b><br>3.3m 柱距 ×8 + 6.6m 大厅</div><div><b style="color:#C4623F">进深</b><br>居室 7.5m · 走廊 1.8m</div><div><b style="color:#C4623F">转角翼</b><br>4 间 · 40° 折角</div></div>
    </div>''')
    # ---------------- hero
    o+=card(20,116,554,268,'<div style="position:absolute;inset:0;border-radius:2.6mm;background:linear-gradient(180deg,#FBF2DE 0%,#F6EFE2 55%,#F1E7D3 100%)"></div>'+f'<div style="position:absolute;left:1mm;right:1mm;top:1mm">{hero()}</div>'
        +'''<div style="position:absolute;left:4mm;right:4mm;bottom:2.6mm;background:rgba(255,251,244,.92);border-radius:2mm;padding:1.6mm 3mm;display:flex;flex-wrap:wrap;gap:0 4.6mm;font-size:3.8mm;line-height:1.7;border:.25mm solid #E6D8BF">'''
        +''.join(f'<span style="white-space:nowrap"><span class="pin" style="width:4.8mm;height:4.8mm;font-size:3mm;{"background:#5E8C55" if n>5 else ""}">{n}</span> {t}</span>' for n,t in [(1,'门厅·接待·茶座'),(2,'长者食堂'),(3,'康复训练室'),(4,'医务·值班'),(5,'多功能活动厅'),(6,'日光起居·共享餐厅'),(7,'居室×8（朝南）'),(8,'转角翼居室×4'),(9,'护理站')])
        +'</div>')
    o+=tape(30,118,-4);o+=tape(534,118,5)
    o+=box(300,385,274,6,'<div class="cap" style="text-align:right">分解轴测 EXPLODED AXONOMETRIC · 依据 3# 楼一、二层平面 1:100</div>')
    # ---------------- row C
    y=393;h=92
    o+=card(20,y,172,h,hd('01','设计理念','CONCEPT')+'''<div class="bd">
      <p>图纸是一栋规整的两层楼：南侧 <b>8 间 3.3m 开间</b>单元、1.8m 中廊，东端 6.6m 大厅，再折出 <b>4 间 40° 转角翼</b>。</p>
      <p><b>化整为零</b>　一个开间即一间居室，保持“家”的尺度。</p>
      <p><b>阳光向南</b>　居室与日光厅全部朝南，整日有光。</p>
      <p><b>公共在下，私密在上</b>　一层接纳社区与康复，二层留给睡眠与陪伴。</p>
      <p><b>去机构化</b>　医疗设备隐入柜体，以家具、织物、灯具营造居家氛围。</p></div>''')
    pr=[('safe','安','SAFE','走廊净宽约1.8m，双层连续扶手，无门槛、防滑地胶、家具全圆角'),
        ('warm','暖','WARM','暖木 · 奶油白 · 陶土 · 鼠尾草绿；触感柔软，避免冷金属与强反光'),
        ('bright','明','BRIGHT','南向自然光 + 3000K 暖白光；低眩光，夜间 0.25m 脚灯'),
        ('memory','忆','MEMORY','门框色彩记忆条、“记忆盒”、廊内视觉地标，降低迷路焦虑'),
        ('together','伴','TOGETHER','居室 — 廊下座 — 日光厅 / 食堂，三级社交梯度')]
    rows=''.join(f'<div style="display:flex;gap:3mm;align-items:flex-start;margin-bottom:1.4mm">{icon(k,11)}<div style="font-size:3.95mm;line-height:1.42"><b class="serif" style="font-size:5.2mm;color:#C4623F">{z}</b> <span class="cap">{e}</span><br>{t}</div></div>' for k,z,e,t in pr)
    o+=card(202,y,206,h,hd('02','适老五原则','FIVE PRINCIPLES')+f'<div class="bd" style="padding-top:2.2mm;padding-bottom:0">{rows}</div>')
    pal=[('燕麦白','#F3EADB'),('暖橡木','#C89C6C'),('陶土','#DE9B7A'),('鼠尾草','#A9BFA0'),('晨光黄','#F3CE7B'),('雾蓝','#B7CFDD')]
    sw=''.join(f'<div style="text-align:center"><div style="height:17mm;border-radius:1.8mm;background:{c};border:.25mm solid rgba(80,60,40,.25)"></div><div style="font-size:3.7mm;margin-top:.8mm;font-weight:500;line-height:1.2">{n}</div><div class="cap" style="font-size:3mm;line-height:1.1">{c}</div></div>' for n,c in pal)
    o+=card(418,y,156,h,hd('03','色彩与氛围','COLOUR & MOOD')+f'''<div class="bd" style="padding-top:2.6mm"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2mm">{sw}</div>
      <div class="small" style="margin-top:2mm">暖色亲近，雾蓝静谧；晨光黄与陶土用作视觉地标。</div></div>''')
    # ---------------- row D
    y=491;h=168
    def ov(html,left=3,top=36): return f'<div style="position:absolute;left:{left}mm;top:{top}mm">{html}</div>'
    def col(x,no,zh,en,kind,legend,note,w=182):
        inner=hd(no,zh,en)+'<div style="padding:2mm 3mm 0">'
        inner+=f'<div style="position:relative">{mini_plan(1,kind)}<span class="pin" style="position:absolute;left:0;top:0;width:6mm;height:6mm;font-size:3.2mm">1F</span>{ov(legend,1,53)}</div>'
        inner+=f'<div style="position:relative;margin-top:0mm">{mini_plan(2,kind)}<span class="pin" style="position:absolute;left:0;top:0;width:6mm;height:6mm;font-size:3.2mm;background:#5E8C55">2F</span>{ov(note,1,53)}</div></div>'
        return card(x,y,w,h,inner)
    L1=f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 3mm;width:112mm">{legend_zone(["reception","dining","rehab","care","activity","living","bed","support"])}</div>'
    o+=col(20,'04','功能分区','FUNCTION ZONING','zone',L1,'<div class="small" style="width:110mm">一层承接社区服务、康复与助餐；二层 12 间居室围绕日光起居厅，形成小家庭式照护单元。</div>')
    L2=f'<div style="width:112mm">{legend_line([("#C4623F","长者 · 访客主动线",0),("#4E86A6","后勤 · 护理服务线",1),("#5E8C55","垂直交通 · 疏散",1)])}</div>'
    o+=col(212,'05','动线分析','CIRCULATION','circ',L2,'<div class="small" style="width:110mm">服务动线与长者动线两道分离；二层由电梯直达居住走廊。</div>')
    L3=f'<div style="width:112mm">{legend_line([("#E0A21B","自然采光（南向）",0),("#E8A317","3000K 暖白筒灯",1),("#F3CE7B","线性灯带 · 夜灯",1)])}</div>'
    o+=col(404,'06','光环境','LIGHT','light',L3,'<div class="small" style="width:110mm">居室、大厅全部朝南；走廊线性灯带匀光，夜间脚灯 0.25m。</div>',170)
    # ---------------- row E
    y=667;h=66
    sw=[('oak','暖橡木饰面','墙裙·扶手'),('paint','奶油艺术涂料','墙面·无反光'),('floor','木纹防滑地胶','居室·走廊'),('linen','鼠尾草亚麻','窗帘·沙发'),('terra','陶土仿皮','座椅·软包'),('slate','浅色岩板','护理台')]
    cells=''.join(f'<div><div style="height:24mm">{swatch(k,100,100)}</div><div style="font-size:3.8mm;font-weight:500;margin-top:1mm;line-height:1.25">{n}</div><div class="cap" style="font-size:3.1mm">{u}</div></div>' for k,n,u in sw)
    o+=card(20,y,236,h,hd('07','材质板','MATERIAL BOARD')+f'<div class="bd" style="padding-top:3.4mm"><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:2.6mm">{cells}</div></div>')
    dims=[('走廊净宽','≥ 1800','约1.8m'),('居室门净宽','1000','含推拉门'),('连续扶手','650 / 850','双层'),('护理床面高','500','可调'),('轮椅回转','Ø1500','居室·卫生间'),('坐姿窗台','≤ 600','低窗台')]
    tr=''.join(f'<tr><td>{a}</td><td style="text-align:right;font-weight:700;color:#C4623F">{b}</td><td class="cap">{c}</td></tr>' for a,b,c in dims)
    o+=card(266,y,172,h,hd('08','适老关键尺度','DIMENSIONS · MM')+f'<div class="bd" style="padding-top:.4mm"><table class="t" style="font-size:3.6mm">{tr}</table></div>')
    stats=[('2','层'),('12','间单人居室'),('≈1160','㎡ 总建筑面积'),('≈23.6','㎡/间（含卫）'),('1.8','m 走廊净宽'),('3.3','m 居室开间')]
    st=''.join(f'<div style="text-align:center"><div class="serif" style="font-size:8mm;font-weight:700;color:#C4623F;line-height:1.0">{a}</div><div class="small" style="font-size:3.2mm;line-height:1.2">{b}</div></div>' for a,b in stats)
    o+=card(448,y,126,h,hd('09','项目指标','KEY FIGURES')+f'<div class="bd" style="padding-top:1.4mm;padding-bottom:1mm"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6mm 1mm">{st}</div></div>')
    g=[(scenes.scene_bedroom_side,111,'居室 · 床头立面','夜灯 · 扶手 · 呼叫器'),(scenes.scene_living,186,'日光起居 · 共享餐厅','低窗台 · 三级社交'),(scenes.scene_lobby,172,'门厅 · 接待','低位台面 · 轮椅友好'),(scenes.scene_corridor,44.5,'走廊断面','双层扶手 · 记忆条')]
    cells=''.join(f'<div style="width:{w}mm"><div style="border-radius:1.6mm;overflow:hidden;border:.25mm solid #E6D8BF">{f()}</div><div style="font-size:3.5mm;margin-top:.8mm;line-height:1.2"><b>{t}</b> <span class="cap">{c}</span></div></div>' for f,w,t,c in g)
    o+=card(20,741,554,86,hd('10','空间意象','SPACE IMPRESSIONS · 示意插画')+f'<div style="padding:2.4mm 5mm 0;display:flex;justify-content:space-between">{cells}</div>')
    o+=box(20,832,554,5,'<div class="cap" style="display:flex;justify-content:space-between;font-size:3.1mm"><span>暖阳颐养之家 · 3# 楼室内设计方案　｜　面积与尺度按图纸推算（1pt≈0.1m），为约数；JGJ 450 / GB 50763 作参考，数值待深化复核</span><span>BOARD 01 / 03 · 设计总览　→　02 一层公共服务　03 二层居住照护</span></div>')
    return page(o,'暖阳颐养之家 · 展板01 设计总览')
