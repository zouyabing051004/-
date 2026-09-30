import math
from kit3 import *
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

def li(t): return f'<div style="display:flex;gap:1.8mm"><span style="color:#C4623F;font-weight:700">•</span><span>{t}</span></div>'

def rooms_table(floor_rooms, extra_rows):
    rows=''
    for r in floor_rooms:
        rows+=f'<tr><td style="width:6mm"><span class="pinn" style="width:4.2mm;height:4.2mm;font-size:2.4mm">{r["id"][-2:]}</span></td><td><i style="display:inline-block;width:3mm;height:3mm;border-radius:.5mm;background:{ZONES[r["zone"]][0]};border:.2mm solid #B7A488;vertical-align:-.4mm"></i> {r["name"]}</td><td style="text-align:right">{r["area"]:.1f}</td></tr>'
    return rows
def build():
    o=''
    # ------------------------------------------------ hero
    o+=hero('lobby1',236,'50% 58%','GROUND FLOOR · PUBLIC SERVICE & DAY-CARE HUB · BOARD 02 / 03','一层 · 公共服务层','接待 · 康复 · 医护 · 助餐 · 文娱',
            extra_html=inset_circle('aerial1',508,170,86,'50% 45%')+'<div class="abs serif" style="left:21mm;bottom:12mm;font-size:5.4mm;letter-spacing:1mm;color:rgba(255,255,255,.9)">把社区请进来，让长者走出去</div>',title_size=30)
    # ------------------------------------------------ big plan
    o+=sec(20,245,554,'一层平面图','GROUND FLOOR PLAN','1 : 90 · 示意')
    o+=f'<div class="abs" style="left:20mm;top:254mm;width:554mm">{plan_svg(1,vb=(64,368,556,576),layers=("fill","cad","open","furn","labels"),extra_layers=bigplan_extras(),lscale=1.0)}</div>'
    km=[('进得来','南向坡道 + 感应门，入口即门厅'),('走得稳','双侧扶手、无高差、每 12m 设座'),('愿意留','康复、食堂、活动厅连成一串'),('看得见','服务空间玻璃隔断，视线通透')]
    o+=f'<div class="abs" style="left:26mm;top:418mm;width:250mm;font-size:3.8mm;line-height:1.75">'+''.join(f'<div><span class="num" style="font-size:4.4mm">{i+1}</span>　<b>{a}</b>　<span style="color:{SUB}">{b}</span></div>' for i,(a,b) in enumerate(km))+'</div>'
    # ------------------------------------------------ analysis row
    o+=sec(20,494,554,'策略分析','DESIGN ANALYSIS','')
    colw=(554-16)/3
    def an(i,zh,en,kind,leg):
        x=20+i*(colw+8)
        return (f'<div class="abs" style="left:{x}mm;top:506mm;width:{colw}mm;font-size:3.4mm"><b>{zh}</b> <span style="color:{SUB};font-size:2.7mm;letter-spacing:.7mm">{en}</span></div>'
                f'<div class="abs" style="left:{x}mm;top:511mm;width:{colw}mm">{mini_plan(1,kind)}</div>'
                f'<div class="abs" style="left:{x}mm;top:588mm;width:{colw}mm;line-height:1.7">{leg}</div>')
    o+=an(0,'功能分区','ZONING','zone',zone_legend(['reception','dining','rehab','care','activity','support']))
    o+=an(1,'动线','CIRCULATION','circ',legend_row([('ln','#C4623F','长者 / 访客'),('dash','#4E86A6','后勤服务'),('dash','#5E8C55','垂直交通')]))
    o+=an(2,'无障碍与安全','ACCESSIBILITY','access',legend_row([('ln','#C4623F','双侧扶手'),('dash','#C4623F','回转 Ø1.8m'),('dot','#D9412B','呼叫点')]))
    # ------------------------------------------------ key spaces
    o+=sec(20,602,554,'重点空间','KEY SPACES','')
    tiles=[('rehab1','康复训练室','REHAB GYM','平行杠、落地镜、肋木；两开间约 47㎡，可同时 6–8 人训练','50% 60%'),
           ('canteen1','长者食堂 · 助餐','CANTEEN','圆桌 6 人 ×3 共 18 座；圈椅带扶手，热食备餐间紧邻','50% 60%'),
           ('activity1','多功能活动厅','ACTIVITY HALL','书画、影院、棋牌三室连片，转角翼 40° 斜向成“街角”','50% 60%')]
    tw=(554-16)/3
    for i,(n,zh,en,d,pos) in enumerate(tiles):
        x=20+i*(tw+8)
        o+=img(n,x,614,tw,86,pos)+cap(x,701.5,zh,en)+tx(x,708,tw,d,3.3,f'color:{SUB};line-height:1.5')
    # ------------------------------------------------ schedule + details
    o+=sec(20,722,300,'面积表','SCHEDULE · ㎡','')
    rs=rooms(1); half=(len(rs)+1)//2
    svc=[c for c in nb_rooms(1) if c['key'] not in ('lobby','shaft2','elev_w','stair1','stair2','elev')]
    t1=rooms_table(rs[:half],'')
    t2=rooms_table(rs[half:],'')+''.join(f'<tr><td></td><td><i style="display:inline-block;width:3mm;height:3mm;border-radius:.5mm;background:{ZONES[c["zone"]][0]};border:.2mm solid #B7A488;vertical-align:-.4mm"></i> {c["name"]}</td><td style="text-align:right">{area(c["poly"]):.1f}</td></tr>' for c in svc[:3])
    o+=f'<div class="abs" style="left:20mm;top:732mm;width:300mm;display:grid;grid-template-columns:1fr 1fr;gap:0 6mm;align-items:start"><table class="t"><tbody>{t1}</tbody></table><table class="t"><tbody>{t2}</tbody></table></div>'
    sums={}
    for r in rs: sums[r['zone']]=sums.get(r['zone'],0)+r['area']
    tot=sum(sums.values())
    o+=f'<div class="abs" style="left:20mm;top:806mm;width:300mm"><div style="display:flex;height:4mm;overflow:hidden;border:.2mm solid #B7A488">'+''.join(f'<div style="width:{v/tot*100:.1f}%;background:{ZONES[k][0]}"></div>' for k,v in sums.items())+f'</div><div style="display:flex;flex-wrap:wrap;gap:0 3.6mm;font-size:2.9mm;margin-top:.8mm;color:{SUB}">'+''.join(f'<span>{ZONES[k][1]} {v:.0f}㎡ · {v/tot*100:.0f}%</span>' for k,v in sums.items())+'</div></div>'
    o+=sec(332,722,242,'节点详图','DETAILS','')
    fh=lambda x,h:x.replace('width="100%"','width="100%" height="'+str(h)+'mm" preserveAspectRatio="xMidYMid meet"',1)
    dw=(242-8)/3
    for i,(f,t) in enumerate([(scenes.detail_handrail,'扶手 HANDRAIL'),(scenes.detail_threshold,'零门槛 THRESHOLD'),(scenes.detail_door,'居室门 DOOR')]):
        x=332+i*(dw+4)
        o+=f'<div class="abs" style="left:{x}mm;top:732mm;width:{dw}mm">{fh(f(),52)}<div style="font-size:3mm;text-align:center;color:{SUB};margin-top:.6mm">{t}</div></div>'
    o+=tx(332,796,242,'走廊双侧 <b>650 / 850</b> 连续扶手；所有交接位置<b>无高差</b>，红色对比条提示；公共区 <b>3000K</b> 低眩光照明。',3.4,f'color:{SUB};line-height:1.55')
    o+=footer('暖阳颐养之家 · 3# 楼室内设计方案','BOARD 02 / 03 · 一层公共服务层')
    return page3(o,'暖阳颐养之家 · 展板02 一层')
