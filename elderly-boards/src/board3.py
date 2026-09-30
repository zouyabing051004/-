import math
from kit3 import *
import scenes
from plans import rooms,nb_rooms,area,CELLS
from board2 import rot_plan,dimline,north,scalebar,li

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
    o+=hero('bedroom',236,'50% 60%','SECOND FLOOR · RESIDENTIAL CARE · BOARD 03 / 03','二层 · 居住照护层','12 间朝南居室 · 日光起居厅 · 护理站 · 助浴',
            extra_html=inset_circle('aerial2',508,170,86,'50% 45%')+'<div class="abs serif" style="left:21mm;bottom:12mm;font-size:5.4mm;letter-spacing:1mm;color:rgba(255,255,255,.9)">回到家，回到自己的房间</div>',title_size=30)
    o+=sec(20,245,554,'二层平面图','SECOND FLOOR PLAN','1 : 90 · 示意 · 黄色箭头为南向自然光')
    o+=f'<div class="abs" style="left:20mm;top:254mm;width:554mm">{plan_svg(2,vb=(64,368,556,576),layers=("fill","cad","open","furn","labels","badges"),extra_layers=big_extras(),lscale=1.0)}</div>'
    km=[('朝南居室','每间南窗 + 0.6m 低窗台，坐着也能看院景'),('廊下有座','每 12m 一处，门旁设“记忆盒”'),('护理居中','护理站居走廊中部，转角翼设护理小站'),('日光起居','东端大厅朝南，是全层的客厅与餐厅')]
    o+=f'<div class="abs" style="left:26mm;top:418mm;width:260mm;font-size:3.8mm;line-height:1.75">'+''.join(f'<div><span class="num" style="font-size:4.4mm">{i+1}</span>　<b>{a}</b>　<span style="color:{SUB}">{b}</span></div>' for i,(a,b) in enumerate(km))+'</div>'
    o+=sec(20,494,554,'策略分析','DESIGN ANALYSIS','')
    colw=(554-16)/3
    def an(i,zh,en,kind,leg):
        x=20+i*(colw+8)
        return (f'<div class="abs" style="left:{x}mm;top:506mm;width:{colw}mm;font-size:3.4mm"><b>{zh}</b> <span style="color:{SUB};font-size:2.7mm;letter-spacing:.7mm">{en}</span></div>'
                f'<div class="abs" style="left:{x}mm;top:511mm;width:{colw}mm">{mini_plan(2,kind)}</div>'
                f'<div class="abs" style="left:{x}mm;top:588mm;width:{colw}mm;line-height:1.7">{leg}</div>')
    sw=lambda c:f'<span style="display:inline-block;width:5mm;height:2.2mm;border-radius:1.1mm;background:{c};margin-right:.8mm"></span>'
    o+=an(0,'寻路与记忆','WAYFINDING','way',f'<span class="lg">{"".join(sw(c) for c in WAY[:4])}门楣色彩记忆条</span>'+legend_row([('dash','#E39A78','色彩引导线')]))
    o+=an(1,'护理与疏散','CARE ROUNDS','circ',legend_row([('ln','#C4623F','居室 ↔ 走廊'),('dash','#4E86A6','护理巡视'),('dash','#5E8C55','疏散')]))
    o+=an(2,'安全与呼叫','SAFETY','access',legend_row([('ln','#C4623F','双侧扶手'),('dot','#D9412B','呼叫：床头 + 卫生间')]))
    # ---------------- key spaces
    o+=sec(20,602,554,'重点空间','KEY SPACES','')
    tw=(554-3*5)/4; th=80
    bp=plan_svg(2,vb=(106,430,180,512),layers=('fill','cad','open','furn'),extra_layers=dimline(109.4,514.5,175.5,514.5,'6600')+dimline(103.5,434.6,103.5,509,'7450'),cad_w=.3)
    o+=f'<div class="abs" style="left:20mm;top:614mm;width:{tw}mm;height:{th}mm;background:#EFE9DC;display:flex;align-items:center;justify-content:center"><div style="height:{th-6}mm;aspect-ratio:74/82">{bp}</div></div>'+cap(20,695.5,'标准居室平面','TYPICAL ROOM 23.6㎡')
    o+=tx(20,702,tw,'床边留 ≥1200 供轮椅转移；床→卫生间 ≤3m，脚灯连通。',3.3,f'color:{SUB};line-height:1.5')
    items=[('hall2','日光起居 · 共享餐厅','LIVING & DINING','居室 → 廊下 → 日光厅，三级社交','50% 62%'),('corridor2','记忆走廊','CORRIDOR','门楣色彩 + 记忆盒，认得出自己的门','50% 50%'),('bath','无障碍卫生间','ACCESSIBLE BATH','L 形扶手、折叠座椅、零门槛推拉门','50% 50%')]
    for i,(n,zh,en,d,pos) in enumerate(items):
        x=20+(i+1)*(tw+5)
        o+=img(n,x,614,tw,th,pos)+cap(x,695.5,zh,en)+tx(x,702,tw,d,3.3,f'color:{SUB};line-height:1.5')
    # ---------------- bottom
    o+=sec(20,722,300,'居室家具清单','FURNITURE · PER ROOM','')
    fr=[('电动护理床','1000×2000×500','带护栏 · 呼叫器'),('床头柜','450×450×550','圆角 · 夜灯'),('衣柜（推拉门）','1300×550×2000','把手 0.9–1.1m'),('高座扶手椅','720×720×900','座高 450'),('圆边几','Ø500×500','软包边'),('电视柜 + 电视','1100×400','壁挂'),('落地灯','Ø300×1500','3000K'),('折叠淋浴座椅','450×450','座高 450'),('L 形 / 竖向扶手','Ø40','3–4 根'),('呼叫器 + 拉绳','床头 + 卫生间','双回路'),('床头壁灯','Ø120','3000K 防眩'),('记忆盒（门旁）','300×350×120','壁龛 · 可换')]
    def tb(rows): return '<table class="t"><tbody>'+''.join(f'<tr><td><b style="font-weight:500">{a}</b></td><td>{b}</td><td style="color:{SUB}">{c}</td></tr>' for a,b,c in rows)+'</tbody></table>'
    o+=f'<div class="abs" style="left:20mm;top:732mm;width:300mm;display:grid;grid-template-columns:1fr 1fr;gap:0 6mm;align-items:start">{tb(fr[:6])}{tb(fr[6:])}</div>'
    o+=tx(20,790,300,'四色被面对应四种门楣色；床头墙立面与窗前扶手椅，是老人“看世界”的位置。',3.4,f'color:{SUB}')
    o+=sec(332,722,242,'走廊墙面','CORRIDOR ELEVATION','')
    o+=f'<div class="abs" style="left:332mm;top:732mm;width:242mm">{fh(scenes.scene_doors(),58)}</div>'
    o+=tx(332,793,242,'走廊净宽约 <b>1.8m</b>，双侧连续扶手 <b>650 / 850</b>；地面哑光，避免暗色块（易被误认为台阶）；走廊端景为窗 / 绿植。',3.4,f'color:{SUB};line-height:1.55')
    o+=footer('暖阳颐养之家 · 3# 楼室内设计方案','BOARD 03 / 03 · 二层居住照护层')
    return page3(o,'暖阳颐养之家 · 展板03 二层')
