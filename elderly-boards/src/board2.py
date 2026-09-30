import math
from kit2 import *
import scenes
from plans import rooms,nb_rooms,area,CELLS
def rot_plan(floor,vb,rot,width='100%',**kw):
    x0,y0,x1,y1=vb
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1-x0} {y1-y0}" width="{width}" style="display:block"><g transform="rotate({rot})">'+plan_group(floor,**kw)+'</g></svg>'
def dimline(x1,y1,x2,y2,label,off=0,rot=0):
    ang=math.atan2(y2-y1,x2-x1);nx,ny=-math.sin(ang)*off,math.cos(ang)*off
    a=(x1+nx,y1+ny);b=(x2+nx,y2+ny);mx,my=(a[0]+b[0])/2,(a[1]+b[1])/2
    t=f'<g stroke="#8C6B4E" stroke-width=".35" fill="none"><line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}"/><line x1="{x1:.1f}" y1="{y1:.1f}" x2="{a[0]:.1f}" y2="{a[1]:.1f}" stroke-dasharray=".8 .8"/><line x1="{x2:.1f}" y1="{y2:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke-dasharray=".8 .8"/></g>'
    t+=f'<circle cx="{a[0]:.1f}" cy="{a[1]:.1f}" r=".7" fill="#8C6B4E"/><circle cx="{b[0]:.1f}" cy="{b[1]:.1f}" r=".7" fill="#8C6B4E"/>'
    tx=txt(mx,my-.9,label,2.6,600,'#8C6B4E',halo=True)
    t+=f'<g transform="rotate({math.degrees(ang) if abs(math.degrees(ang))<90 else 0} {mx:.1f} {my:.1f})">{tx}</g>'
    return t
def north(x,y,s=1):
    return f'<g transform="translate({x} {y}) scale({s})"><circle r="6" fill="#FFFBF4" stroke="#8C6B4E" stroke-width=".5"/><path d="M0 -5 L2.6 3 L0 1.6 L-2.6 3Z" fill="#8C6B4E"/><text y="-7.4" text-anchor="middle" font-size="3.4" fill="#8C6B4E" class="sans" font-weight="700">N</text></g>'
def scalebar(x,y):
    return f'<g transform="translate({x} {y})"><rect width="50" height="1.6" fill="#8C6B4E"/><rect x="10" width="10" height="1.6" fill="#FBF6EC"/><rect x="30" width="10" height="1.6" fill="#FBF6EC"/>'+''.join(f'<text x="{v*10}" y="5.2" font-size="3" text-anchor="middle" fill="#8C6B4E" class="sans">{v}</text>' for v in range(0,6))+'<text x="53" y="1.8" font-size="3" fill="#8C6B4E" class="sans">m</text></g>'
def bigplan_extras():
    o=north(536,552,1.2)+scalebar(492,566)
    o+=txt(351,551,'主入口',4.4,700,'#C4623F')+txt(351,556.5,'MAIN ENTRANCE · 无障碍坡道',2.4,400,'#8C6B4E')
    o+=pline([(351,565.5),(351,540)],'#C4623F',1.4,'',mk='arrT')
    o+=txt(69,402,'后勤入口',3.6,700,'#4E86A6',anchor='start')+txt(69,406,'SERVICE',2.3,400,'#8C6B4E',anchor='start')
    return o

def module2(x,y,w,h,no,zh,en,plan_html,plan_w,photo_name,cap,capen,hand,notes,pos='50% 50%',pins=(),rot=0):
    ph_x=plan_w+8; ph_w=w-plan_w-12; ph_h=h-16
    inner=hd(no,zh,en)
    inner+=f'<div style="position:absolute;left:4mm;top:15.5mm;width:{plan_w}mm"><div style="border-radius:1.4mm;overflow:hidden;background:#FBF6EC;border:.25mm solid #E6D8BF">{plan_html}</div><div style="font-size:3.6mm;line-height:1.45;margin-top:1.6mm">{notes}</div></div>'
    inner+=photo(photo_name,ph_x,14.5,ph_w,ph_h,cap,capen,hand,rot=rot,pos=pos,pins=pins)
    return card(x,y,w,h,inner)
def li(t): return f'<div style="display:flex;gap:1.8mm"><span style="color:#C4623F;font-weight:700">•</span><span>{t}</span></div>'

def build():
    o=''
    # ---------------- header
    o+=box(20,13,340,6,'<span class="sans" style="font-size:3.5mm;letter-spacing:1.5mm;color:#9A8A76">GROUND FLOOR · PUBLIC SERVICE &amp; DAY-CARE HUB · BOARD 02 / 03</span>')
    o+=box(19,19,300,34,'<div class="serif" style="font-size:28mm;font-weight:700;line-height:1.1;letter-spacing:1mm;color:#3F3227">一层<span style="font-size:15mm;letter-spacing:.5mm;color:#6B4A33"> · 公共服务层</span></div>')
    o+=box(300,14,60,60,botanic(50,50,10,'#8FAE86','#C4623F'),'opacity:.85')
    o+=box(22,54,330,9,'<div class="serif" style="font-size:7.2mm;font-weight:600;letter-spacing:.8mm;color:#6B4A33">接待 · 康复 · 医护 · 助餐 · 文娱</div>')
    o+=box(22,64,330,16,'<div class="hand" style="font-size:12.5mm;line-height:1.1">把社区请进来，让长者走出去</div>')
    o+=box(22,79,90,4,wavy(72))
    zs=[('reception','接待 · 门厅'),('care','医护 · 健康'),('rehab','康复 · 理疗'),('dining','餐饮 · 备餐'),('activity','文娱 · 活动'),('support','后勤 · 辅助')]
    o+=box(22,84,330,8,'<div style="display:flex;flex-wrap:wrap;gap:0 4mm;font-size:3.6mm">'+''.join(f'<span style="white-space:nowrap"><i style="display:inline-block;width:5mm;height:3mm;border-radius:.6mm;background:{ZONES[k][0]};border:.2mm solid rgba(80,60,40,.3);vertical-align:-.3mm"></i> {t}</span>' for k,t in zs)+'<span class="cap" style="margin-left:2mm">功能用房约 327㎡</span></div>')
    o+=photo('aerial1',372,12,202,80,'一层 · 鸟瞰剖切','GROUND FLOOR · CUTAWAY','',rot=.3,tapes=[(80,-3,26,2,'')])
    # ---------------- big plan
    notes_=''.join(f'<div style="display:flex;gap:2.4mm;margin-bottom:1.3mm"><span class="pin" style="width:5.4mm;height:5.4mm;font-size:3.2mm">{n}</span><span style="font-size:4.1mm;line-height:1.42"><b>{a}</b> {b}</span></div>' for n,a,b in [(1,'进得来','南向坡道 + 感应门，入口即门厅，一眼看清全层'),(2,'走得稳','走廊双侧扶手、无高差、每12m设休息座'),(3,'愿意留','康复、食堂、活动厅连成一串“愿意去的地方”'),(4,'看得见','服务空间玻璃隔断，护理员视线覆盖公共区')])
    o+=card(20,98,554,242,f'<div style="padding:2.4mm 4mm 0;position:relative">{plan_svg(1,vb=(64,368,556,576),layers=("fill","cad","open","furn","labels"),extra_layers=bigplan_extras(),lscale=1.0)}<div style="position:absolute;left:8mm;top:168mm;width:196mm;background:rgba(255,252,246,.92);border:.3mm solid #E4D5BB;border-radius:2.4mm;padding:2.2mm 4mm 1.2mm"><div class="serif" style="font-size:5mm;font-weight:700;margin-bottom:1.2mm">设计要点 <span class="cap" style="letter-spacing:.4mm">KEY MOVES</span></div>{notes_}</div></div>')
    o+=box(30,335,300,4,'<div class="cap" style="font-size:3.1mm">一层平面图 GROUND FLOOR PLAN　1 : 90（示意，随排版比例）</div>')
    # ---------------- analysis row
    y=346;h=92
    def an(x,no,zh,en,kind,legend,w=180):
        inner=hd(no,zh,en)+f'<div style="padding:1.6mm 3mm 0;position:relative">{mini_plan(1,kind)}<div style="position:absolute;left:4mm;top:52mm">{legend}</div></div>'
        return card(x,y,w,h,inner)
    L1=f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 3mm;width:110mm">{legend_zone(["reception","dining","rehab","care","activity","support"])}</div>'
    o+=an(20,'A','功能分区','ZONING','zone',L1)
    L2=f'<div style="width:112mm">{legend_line([("#C4623F","长者 · 访客主动线",0),("#4E86A6","后勤 · 护理服务线",1),("#5E8C55","垂直交通",1)])}</div>'
    o+=an(206,'B','动线分析','CIRCULATION','circ',L2)
    L3=f'<div style="width:112mm"><div class="lg"><span class="ln" style="border-color:#C4623F"></span>连续扶手（双侧）</div><div class="lg"><span style="width:8mm;height:4mm;border:.4mm dashed #C4623F;border-radius:50%;display:inline-block"></span>轮椅回转 Ø1.8m</div><div class="lg"><span style="width:3.2mm;height:3.2mm;border-radius:50%;background:#D9412B;display:inline-block;margin:0 2.4mm"></span>紧急呼叫点</div></div>'
    o+=an(392,'C','无障碍与安全','ACCESSIBILITY','access',L3,182)
    # ---------------- modules (plan + render + notes)
    y=446;h=126
    hallvb=(332,428,432,538); rehvb=(138,428,214,516); canvb=(270,428,346,516)
    hp_=plan_svg(1,vb=hallvb,layers=('fill','cad','open','furn'),extra_layers=dimline(341.8,514,407.8,514,'6600',0)+dimline(336,434.6,336,508,'7400',0),cad_w=.3)
    rp_=plan_svg(1,vb=rehvb,layers=('fill','cad','open','furn'),extra_layers=dimline(142.4,512,208.5,512,'6600',0),cad_w=.3)
    cp_=plan_svg(1,vb=canvb,layers=('fill','cad','open','furn'),extra_layers=dimline(274.6,512,340.7,512,'6600',0),cad_w=.3)
    ap_=rot_plan(1,(598,30,748,134),-40,layers=('fill','cad','open','furn'),cad_w=.3)
    N1=li('<b>低位接待台</b>一半 750mm，轮椅可近，可坐着服务')+li('<b>无高差入口</b>：南向 1:12 缓坡 + 感应门净宽 ≥1200')+li('<b>日光茶座</b>面向廊道，长者“看得见来往的人”')
    N2=li('<b>步行训练区</b>：平行杠 + 落地镜；肋木、PT 训练床')+li('两开间打通，<b>约 47㎡</b>，可同时 6–8 人训练')+li('弹性防滑地胶，墙面 0.9m 起扶手贯通')
    N3=li('圆桌 6 人 ×3 = <b>18 座</b>，圈椅带扶手，桌下净高 ≥700')+li('助餐台 + 保温柜 + 洗消，热食备餐间紧邻')+li('餐时错峰 · 助餐员一对二服务')
    N4=li('<b>书画 / 怀旧影院 / 棋牌</b>三室连片，可整体打开')+li('转角翼 40° 斜向，形成有变化的“街角”感')+li('暖黄灯光 + 岁月留影墙，唤起共同记忆')
    o+=module2(20,y,272,h,'1','门厅 · 接待 · 茶座','LOBBY & TEA LOUNGE',hp_,80,'lobby1','门厅 · 接待','LOBBY','进门就暖',N1)
    o+=module2(302,y,272,h,'2','康复训练室','REHAB GYM',rp_,74,'rehab1','康复训练','REHAB','动一动更好',N2)
    y2=y+h+6
    o+=module2(20,y2,272,h,'3','长者食堂 · 助餐','COMMUNITY CANTEEN',cp_,74,'canteen1','长者食堂','CANTEEN','热乎的一顿饭',N3)
    o+=module2(302,y2,272,h,'4','多功能活动厅群','ACTIVITY WING',ap_,96,'activity1','活动厅','ACTIVITY HALL','热闹的小街角',N4)
    # ---------------- bottom row
    y3=y2+h+6; hh=832-y3
    sums={}
    for r in rooms(1): sums[r['zone']]=sums.get(r['zone'],0)+r['area']
    tot=sum(sums.values())
    zbar='<div style="display:flex;height:5mm;border-radius:1.4mm;overflow:hidden;border:.25mm solid #B7A488">'+''.join(f'<div style="width:{v/tot*100:.1f}%;background:{ZONES[k][0]}"></div>' for k,v in sums.items())+'</div><div style="display:flex;flex-wrap:wrap;gap:0 3mm;font-size:2.9mm;margin-top:.8mm">'+''.join(f'<span>{ZONES[k][1]} <b>{v:.0f}</b>㎡·{v/tot*100:.0f}%</span>' for k,v in sums.items())+'</div>'
    rows=''
    for r in rooms(1):
        rows+=f'<tr><td><span class="pin" style="width:4.2mm;height:4.2mm;font-size:2.5mm;background:#8C6B4E">{r["id"][-2:]}</span></td><td><i style="display:inline-block;width:3.2mm;height:3.2mm;border-radius:.6mm;background:{ZONES[r["zone"]][0]};border:.2mm solid #B7A488;vertical-align:-.5mm"></i> {r["name"]}</td><td style="text-align:right">{r["area"]:.1f}</td></tr>'
    rows2=''.join(f'<tr><td></td><td><i style="display:inline-block;width:3.2mm;height:3.2mm;border-radius:.6mm;background:{ZONES[c["zone"]][0]};border:.2mm solid #B7A488;vertical-align:-.5mm"></i> {c["name"]}</td><td style="text-align:right">{area(c["poly"]):.1f}</td></tr>' for c in nb_rooms(1) if c['key'] not in ('lobby','shaft2','elev_w','stair1','stair2','elev'))
    o+=card(20,y3,190,hh,hd('5','面积表','SCHEDULE · ㎡')+f'<div class="bd" style="padding-top:.2mm;padding-bottom:0;display:grid;grid-template-columns:1.12fr 1fr;gap:0 3mm"><table class="t" style="font-size:3.2mm"><tr><th></th><th>功能用房</th><th style="text-align:right">㎡</th></tr>{rows}</table><table class="t" style="font-size:3.2mm"><tr><th></th><th>服务 · 交通</th><th style="text-align:right">㎡</th></tr>{rows2}</table></div><div style="padding:1.2mm 5mm 0">{zbar}</div>')
    fh=lambda x:x.replace('width="100%"','width="100%" height="46mm" preserveAspectRatio="xMidYMid meet"',1)
    det=f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:3mm;padding:2mm 4mm 0"><div>{fh(scenes.detail_handrail())}<div class="small" style="text-align:center;font-size:3.2mm">扶手详图 HANDRAIL</div></div><div>{fh(scenes.detail_threshold())}<div class="small" style="text-align:center;font-size:3.2mm">零门槛 THRESHOLD</div></div><div>{fh(scenes.detail_door())}<div class="small" style="text-align:center;font-size:3.2mm">居室门 DOOR</div></div></div>'
    fin=''.join(f'<div style="display:flex;gap:2.4mm;align-items:center"><div style="width:11mm;height:11mm;flex:none">{swatch(k,100,100)}</div><div style="font-size:3.4mm;line-height:1.3"><b>{t}</b><br><span class="cap" style="font-size:3mm">{d}</span></div></div>' for k,t,d in [('floor','地面','木纹防滑地胶 · 无接缝'),('paint','墙面','艺术涂料 + 0.9m 橡木墙裙'),('glow','顶面','白色乳胶漆 + 线性灯带')])
    o+=card(220,y3,354,hh,hd('6','节点详图','DETAILS')+det+f'<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:3mm;padding:2mm 5mm 0">{fin}</div><div class="bd" style="padding-top:1mm;font-size:3.5mm;line-height:1.45"><div style="display:grid;grid-template-columns:1fr 1fr;gap:0 6mm">'+li('走廊双侧 <b>650 / 850</b> 两道连续扶手，端部弯头贴墙')+li('所有交接位置 <b>无高差</b>，过渡条 ≤5mm，红色对比条提示')+li('公共区照明 <b>3000K</b>、低眩光；接待台、台阶边缘增设对比色')+li('大厅、走廊设 <b>休息座椅</b> 每 ≤12m 一处，便于老人歇脚')+'</div></div>')
    o+=box(20,833,554,5,'<div class="cap" style="display:flex;justify-content:space-between;font-size:3.1mm"><span>暖阳颐养之家 · 3# 楼室内设计方案</span><span>BOARD 02 / 03 · 一层公共服务层</span></div>')
    return page2(o,'暖阳颐养之家 · 展板02 一层')
