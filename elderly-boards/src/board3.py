import math
from kit2 import *
import scenes
from plans import rooms,nb_rooms,area,CELLS
from board2 import module2,rot_plan,dimline,north,scalebar,li

def big_extras():
    o=north(536,552,1.2)+scalebar(492,566)
    for k in range(8):
        cx=(AX[k]+AX[k+1])/2; o+=pline([(cx,522),(cx,511.5)],'#E0A21B',1.3,'',mk='arrY')
    for j in range(4):
        uc=WU[j]+16.5; o+=pline([W(uc,141),W(uc,128.5)],'#E0A21B',1.3,'',mk='arrY')
    o+=wayfinding(2)
    return o

def fh(sv,hh,par='xMidYMid meet'):
    return sv.replace('width="100%"','width="100%" height="'+str(hh)+'mm" preserveAspectRatio="'+par+'"',1)

def build():
    o=''
    o+=box(20,13,340,6,'<span class="sans" style="font-size:3.5mm;letter-spacing:1.5mm;color:#9A8A76">SECOND FLOOR · RESIDENTIAL CARE · BOARD 03 / 03</span>')
    o+=box(19,19,300,34,'<div class="serif" style="font-size:28mm;font-weight:700;line-height:1.1;letter-spacing:1mm;color:#3F3227">二层<span style="font-size:15mm;letter-spacing:.5mm;color:#6B4A33"> · 居住照护层</span></div>')
    o+=box(300,14,60,60,botanic(50,50,10,'#8FAE86','#C4623F'),'opacity:.85')
    o+=box(22,54,330,9,'<div class="serif" style="font-size:7.2mm;font-weight:600;letter-spacing:.8mm;color:#6B4A33">12 间朝南居室 · 日光起居厅 · 护理站 · 助浴</div>')
    o+=box(22,64,330,16,'<div class="hand" style="font-size:12.5mm;line-height:1.1">回到家，回到自己的房间</div>')
    o+=box(22,79,90,4,wavy(72))
    stats=[('12','间单人居室'),('23.6','㎡/间'),('43.9','㎡ 日光厅'),('1.8','m 中廊')]
    st=''.join(f'<div style="text-align:center"><div class="serif" style="font-size:9mm;font-weight:700;color:#C4623F;line-height:1.05">{a}</div><div class="small" style="font-size:3.2mm">{b}</div></div>' for a,b in stats)
    o+=box(22,84,330,9,f'<div style="display:flex;gap:9mm;align-items:baseline">{"".join(f"<span style=white-space:nowrap><b class=serif style=color:#C4623F;font-size:5.4mm>{a}</b> <span style=font-size:3.4mm>{b}</span></span>" for a,b in stats)}</div>')
    o+=photo('aerial2',372,12,202,80,'二层 · 鸟瞰剖切','UPPER FLOOR · CUTAWAY','',rot=-.3,tapes=[(80,-3,26,-2,'g')])
    notes_=''.join(f'<div style="display:flex;gap:2.4mm;margin-bottom:1.3mm"><span class="pin" style="width:5.4mm;height:5.4mm;font-size:3.2mm">{n}</span><span style="font-size:4.1mm;line-height:1.42"><b>{a}</b> {b}</span></div>' for n,a,b in [(1,'朝南居室','每间都有南窗与 0.6m 低窗台，坐着也能看院景'),(2,'廊下有座','走廊每 12m 设一处廊下座，门旁有“记忆盒”'),(3,'护理居中','护理站居走廊中部，转角翼另设护理小站与呼叫中继'),(4,'日光起居','东端大厅朝南，是全层的客厅与餐厅')])
    o+=card(20,98,554,242,f'<div style="padding:2.4mm 4mm 0;position:relative">{plan_svg(2,vb=(64,368,556,576),layers=("fill","cad","open","furn","labels","badges"),extra_layers=big_extras(),lscale=1.0)}<div style="position:absolute;left:8mm;top:168mm;width:196mm;background:rgba(255,252,246,.92);border:.3mm solid #E4D5BB;border-radius:2.4mm;padding:2.2mm 4mm 1.2mm"><div class="serif" style="font-size:5mm;font-weight:700;margin-bottom:1.2mm">设计要点 <span class="cap" style="letter-spacing:.4mm">KEY MOVES</span></div>{notes_}</div></div>')
    o+=box(30,335,340,4,'<div class="cap" style="font-size:3.1mm">二层平面图 SECOND FLOOR PLAN　1 : 90（示意，随排版比例）　·　黄色箭头：南向自然光</div>')
    # ---------------- analysis
    y=346;h=92
    def an(x,no,zh,en,kind,legend,w=180):
        return card(x,y,w,h,hd(no,zh,en)+f'<div style="padding:1.6mm 3mm 0;position:relative">{mini_plan(2,kind)}<div style="position:absolute;left:4mm;top:52mm">{legend}</div></div>')
    sw=lambda c:f'<span style="display:inline-block;width:6mm;height:2.4mm;border-radius:1.2mm;background:{c};margin-right:2mm"></span>'
    L1=f'<div style="width:112mm"><div class="lg">{"".join(sw(c) for c in WAY[:4])}门楣色彩记忆条（每间不同）</div><div class="lg"><i style="width:3.6mm;height:3.4mm;background:#DE9B7A"></i>门旁记忆盒</div><div class="lg"><span class="ln" style="border-color:#E39A78;border-top-style:dotted"></span>走廊色彩引导线</div></div>'
    o+=an(20,'A','寻路与记忆','WAYFINDING','way',L1)
    L2=f'<div style="width:112mm">{legend_line([("#C4623F","居室 ↔ 走廊",0),("#4E86A6","护理巡视线",1),("#5E8C55","疏散至楼梯",1)])}</div>'
    o+=an(206,'B','护理与疏散','CARE ROUNDS','circ',L2)
    L3=f'<div style="width:112mm"><div class="lg"><span class="ln" style="border-color:#C4623F"></span>连续扶手 · 双侧</div><div class="lg"><span style="width:3.2mm;height:3.2mm;border-radius:50%;background:#D9412B;display:inline-block;margin:0 2.4mm"></span>呼叫点：床头 + 卫生间</div></div>'
    o+=an(392,'C','安全与呼叫','SAFETY','access',L3,182)
    # ---------------- module 1: typical bedroom
    y=446;h=120
    bp=plan_svg(2,vb=(106,430,180,512),layers=('fill','cad','open','furn'),extra_layers=dimline(109.4,514.5,175.5,514.5,'6600')+dimline(103.5,434.6,103.5,509,'7450')+dimline(142.4,428,159.4,428,'1700',0),cad_w=.3)
    notes1=''.join([li('<b>床</b>：电动护理床 1000×2000，床头靠实墙，<b>一侧留 ≥1200</b> 供轮椅转移'),li('<b>床头</b>：壁灯 + 拉绳呼叫 + 夜灯；床头柜圆角、抽屉带扶把'),li('<b>床→卫生间</b>：脚灯（0.25m）连通，推拉门零门槛，<b>路径 ≤3m</b>'),li('<b>卫生间</b> 1.7×2.9m：折叠淋浴座椅、L 形 + 竖向扶手、地漏中置、防眩镜灯'),li('<b>窗前</b>：低窗台 0.6m + 扶手椅 + 边几，是老人“看世界”的位置'),li('<b>收纳</b>：衣柜推拉门，把手在 0.9–1.1m')])
    inner=hd('1','标准居室（镜像成对）','TYPICAL ROOM · 23.6㎡')
    inner+=f'<div style="position:absolute;left:4mm;top:15.5mm;width:80mm"><div style="border-radius:1.4mm;overflow:hidden;background:#FBF6EC;border:.25mm solid #E6D8BF">{bp}</div><div class="cap" style="margin-top:1mm">标准居室平面（201–202 镜像）</div></div>'
    inner+=photo('bedroom',88,14.5,200,h-16,'居室 · 我的小家','TYPICAL ROOM','窗前晒太阳',rot=-.3,pos='50% 55%',tapes=[(70,-3,26,2,'')])
    inner+=photo('bath',292,14.5,96,h-16,'无障碍卫生间','ACCESSIBLE BATH','',rot=.4,pos='50% 50%',tapes=[(30,-3,24,-3,'p')])
    inner+=f'<div style="position:absolute;left:394mm;top:16mm;width:156mm;font-size:3.85mm;line-height:1.5">{notes1}</div>'
    lin=''.join(f'<div style="text-align:center"><div style="height:11mm;border-radius:1.4mm;background:{c};border:.25mm solid rgba(80,60,40,.25)"></div><div style="font-size:3mm;margin-top:.6mm">{n}</div></div>' for c,n in [('#B9CBA6','201 鼠尾草'),('#E9B8A0','202 陶粉'),('#B7CFDD','203 雾蓝'),('#F2D58D','204 晨光黄')])
    inner+=f'<div style="position:absolute;left:394mm;top:{h-40}mm;width:156mm"><div class="hand" style="font-size:6.4mm;margin-bottom:1mm">四色被面 · 对应门楣色</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2mm">{lin}</div></div>'
    o+=card(20,y,554,h,inner)
    # ---------------- modules: hall + corridor
    y2=y+h+6; h=122
    lp=plan_svg(2,vb=(332,428,432,514),layers=('fill','cad','open','furn'),extra_layers=dimline(341.8,514,407.8,514,'6600')+dimline(336,434.6,336,508,'7400'),cad_w=.3)
    N2=li('<b>三级社交梯度</b>：居室 → 廊下座 → 日光厅')+li('<b>南向大窗 + 低窗台</b>，整日晒太阳、看街景')+li('沙发座高 450、带扶手，<b>起身不费力</b>')+li('茶水台兼<b>护理小站</b>，视线覆盖大厅')
    o+=module2(20,y2,272,h,'2','日光起居 · 共享餐厅','SUNLIT LIVING & DINING',lp,72,'hall2','日光厅','LIVING & DINING','全天有光',N2)
    cp=fh(scenes.scene_corridor(),74)
    NC=li('<b>记忆条</b>：门楣 6 色循环')+li('<b>记忆盒</b>：门旁壁龛放老照片')+li('<b>廊下座</b>：每 ≤12m 一处')
    o+=module2(302,y2,272,h,'3','记忆走廊','MEMORY CORRIDOR',cp,54,'corridor2','走廊 · 望得到尽头','CORRIDOR','认得出自己的门',NC)
    # ---------------- bottom row
    y3=y2+h+6;hh=832-y3
    frows=[('电动护理床','1000×2000×500 可调','1','带护栏 · 呼叫器'),('床头柜','450×450×550','1','圆角 · 夜灯'),('衣柜（推拉门）','1300×550×2000','1','把手 0.9–1.1m'),('高座扶手椅','720×720×900','1','座高 450'),('圆边几','Ø500×500','1','软包边'),('电视柜 + 电视','1100×400','1','壁挂 · 遥控'),('落地灯（暖光）','Ø300×1500','1','3000K'),('折叠淋浴座椅','450×450','1','座高 450'),('L 形 / 竖向扶手','Ø40','3–4','卫生间 · 床边'),('呼叫器 + 拉绳','床头 + 卫生间','2','双回路 · 应急'),('记忆盒（门旁）','300×350×120','1','壁龛 · 可换')]
    tr=''.join(f'<tr><td><b style="font-weight:500">{a}</b></td><td>{b}</td><td style="text-align:center;color:#C4623F;font-weight:700">{c}</td><td class="cap">{d}</td></tr>' for a,b,c,d in frows)
    o+=card(20,y3,204,hh,hd('4','居室家具设备清单','FURNITURE · PER ROOM')+f'<div class="bd" style="padding-top:.2mm"><table class="t" style="font-size:3.35mm"><tr><th>名称</th><th>规格 mm</th><th style="text-align:center">数量</th><th>备注</th></tr>{tr}</table></div>')
    o+=card(234,y3,196,hh,hd('5','走廊墙面','CORRIDOR ELEVATION')+f'<div style="padding:2mm 4mm 0"><div style="border-radius:1.6mm;overflow:hidden;border:.25mm solid #E6D8BF">{scenes.scene_doors()}</div><div class="cap" style="margin-top:.8mm">门楣色彩 + 记忆盒 + 大字门牌</div></div><div class="bd" style="padding-top:1.4mm;font-size:3.5mm;line-height:1.45">'+li('走廊净宽约 <b>1.8m</b>，双侧连续扶手 <b>650 / 850</b>')+li('地面无反光哑光地胶，避免暗色块（易被误认为台阶）')+li('走廊端景为窗 / 绿植 / 挂画，形成路径节点')+'</div>')
    wp=rot_plan(2,(598,30,748,134),-40,layers=('fill','cad','open','furn'),cad_w=.3)
    NW=li('<b>转角翼</b>4 间居室，自成“小街区”，适合认知症长者')+li('走廊尽端设<b>景观窗与休憩座</b>，避免“死胡同”')+li('每间门楣异色，<b>红色引导线</b>直达日光厅')
    o+=card(440,y3,134,hh,hd('6','转角翼','CORNER WING')+f'<div style="padding:2mm 4mm 0"><div style="border-radius:1.6mm;overflow:hidden;background:#FBF6EC;border:.25mm solid #E6D8BF">{wp}</div><div style="font-size:3.4mm;line-height:1.4;margin-top:1.4mm">{NW}</div></div>')
    o+=box(20,833,554,5,'<div class="cap" style="display:flex;justify-content:space-between;font-size:3.1mm"><span>暖阳颐养之家 · 3# 楼室内设计方案</span><span>BOARD 03 / 03 · 二层居住照护层</span></div>')
    return page2(o,'暖阳颐养之家 · 展板03 二层')
