"""Programme + plan renderer for the 3# elderly-care centre (two floors)."""
import math
from model import *
import furn as F
from furn import place

ZONES={
 'reception':('#F2CBA0','接待 · 门厅'),
 'dining':('#F3B27A','餐饮 · 备餐'),
 'rehab':('#A8D2BE','康复 · 理疗'),
 'care':('#B5CCDD','医护 · 健康'),
 'activity':('#EFB4A3','文娱 · 活动'),
 'living':('#F7E0A0','起居 · 社交'),
 'bed':('#F0E4CC','居室'),
 'wet':('#D6E5E8','卫浴'),
 'support':('#DDD5C9','后勤 · 辅助'),
 'core':('#C9C1B4','交通核心'),
 'circ':('#FCF8EF','走廊 · 交通'),
}
def area(poly):
    a=0
    for i in range(len(poly)):
        x1,y1=poly[i];x2,y2=poly[(i+1)%len(poly)];a+=x1*y2-x2*y1
    return abs(a)/2/100.0
def cen(poly):
    n=len(poly);return (sum(p[0] for p in poly)/n,sum(p[1] for p in poly)/n)

# ---------- north band cells (both floors) ----------
NB_Y0,NB_Y1=375.5,414.3
def NB(x0,x1,y0=NB_Y0,y1=NB_Y1): return R(x0,y0,x1,y1)
CELLS=dict(
 elev_w=NB(77.5,102.5,376,398.5), room_w=NB(77.5,102.5,400.5,y1=NB_Y1),
 lobby=NB(104,128.5), stair1=NB(129.5,201,376,399.8), wc1=NB(129.5,201,401.3,NB_Y1),
 r_a=NB(202,219.5), r_b=NB(221,249), elev=NB(250.5,271.5), r_e=NB(273,299),
 stair2=NB(302,354.5,376,399.8), shaft2=NB(302,316,401.3,NB_Y1), wc2=NB(317,352,401.3,NB_Y1), r_f=NB(354.5,385.5,377,NB_Y1),
)
# hall (open to corridor) : east end of bar
HALL=[(341.8,434.6),(426.0,434.6),(382.6,486.8),(407.6,508.0),(341.8,508.0)]
def corridor_poly():
    return R(76.8,416.2,386,434.4)
def wing_corr(): return WR(566,37.5,738,52.2)
JUNC=[(386,416.2),(386,434.4),(426,434.4),W(606,52.2),W(566,52.2),W(566,37.5),(399.5,384.5)]

def U(k): return unit_rect(k)
def WU_(j): return wunit(j)

def rooms(floor):
    """returns list of dict(id,name,en,zone,polys,anchor,label_size,note)"""
    R_=[]
    def add(id,name,en,zone,polys,anchor=None,size=3.3,area_=None,bathpolys=()):
        polys=polys if isinstance(polys[0],list) else [polys]
        a=area_ if area_ else sum(area(p) for p in polys)
        R_.append(dict(id=id,name=name,en=en,zone=zone,polys=polys,anchor=anchor or cen(polys[0]),size=size,area=a,bath=list(bathpolys)))
    if floor==1:
        add('101','值班·安防','Duty Desk','care',U(0),bathpolys=[bath_rect(0)])
        add('102','健康小屋 · 医务','Health Clinic','care',U(1),bathpolys=[bath_rect(1)])
        add('103','康复训练室','Rehab Gym','rehab',[U(2),U(3)],anchor=(AX[2]+33.05*.9-8, Y_UN+55),bathpolys=[bath_rect(2),bath_rect(3)])
        add('104','中医理疗室','TCM Therapy','rehab',U(4),bathpolys=[bath_rect(4)])
        add('105','心理 · 谈话室','Counselling','care',U(5),bathpolys=[bath_rect(5)])
        add('106','长者食堂 · 助餐','Community Canteen','dining',[U(6),U(7)],anchor=(AX[6]+33.05*.95+6,Y_UN+50),bathpolys=[bath_rect(6),bath_rect(7)])
        add('107','门厅 · 接待 · 茶座','Lobby & Tea Lounge','reception',HALL,anchor=(376,496),size=3.6)
        add('108','书画 · 手工坊','Art & Craft','activity',WU_(0),anchor=W(WU[0]+16.5,89),bathpolys=[wbath(0)])
        add('109','多功能活动厅','Activity Hall','activity',[WU_(1),WU_(2)],anchor=W(WU[1]+33,89),size=3.6,bathpolys=[wbath(1),wbath(2)])
        add('110','棋牌 · 阅览','Games & Reading','activity',WU_(3),anchor=W(WU[3]+16.5,89),bathpolys=[wbath(3)])
    else:
        for k in range(8):
            add(f'2{k+1:02d}',f'居室 20{k+1}' if k<9 else '', 'Bedroom','bed',U(k),bathpolys=[bath_rect(k)])
        for j in range(4):
            add(f'2{9+j:02d}',f'居室 2{9+j:02d}','Bedroom','bed',WU_(j),anchor=W(WU[j]+16.5,105),bathpolys=[wbath(j)])
        add('213','日光起居 · 共享餐厅','Sunlit Living & Dining','living',HALL,anchor=(376,496),size=3.6)
    return R_

def nb_rooms(floor):
    C=CELLS; o=[]
    def a(key,name,zone,size=2.5,dy=0):
        o.append(dict(key=key,name=name,zone=zone,poly=C[key],size=size,dy=dy))
    a('elev_w','医用电梯','core',2.3)
    a('lobby','前室','circ',2.3)
    a('stair1','楼梯','core',2.6)
    a('elev','电梯 ×2','core',2.3)
    a('stair2','楼梯','core',2.6)
    a('shaft2','管井','support',1.9)
    if floor==1:
        a('room_w','无障碍厕所','wet',2.1)
        a('wc1','公共卫生间','wet',2.4)
        a('r_a','更衣·库房','support',2.1)
        a('r_b','办公·社工站','care',2.6)
        a('r_e','热食备餐间','dining',2.5)
        a('wc2','无障碍卫生间','wet',2.4)
        a('r_f','安防·消控','support',2.5)
    else:
        a('room_w','护理备品','support',2.1)
        a('wc1','公共卫生间','wet',2.4)
        a('r_a','','care',2.1)
        a('r_b','护理站','care',2.8)
        a('r_e','助浴间','care',2.6)
        a('wc2','无障碍卫生间','wet',2.4)
        a('r_f','污洗 · 布草','support',2.4)
    return o

# ------------------------------------------------------------------ furniture
def unit_frame(base_t, mirror, inner):
    """wrap canonical (even-orientation) metres content. base_t: transform string placing origin (page pt);"""
    m=' translate(33.05 0) scale(-1 1)' if mirror else ''
    return f'<g transform="{base_t}{m} scale(10)">{inner}</g>'
def bar_frame(k,inner,mirror=None):
    return unit_frame(f'translate({AX[k]:.2f} {Y_UN:.2f})',(k%2==1) if mirror is None else mirror,inner)
def wing_frame(j,inner,mirror=None):
    return unit_frame(f'rotate(40) translate({WU[j]:.2f} {WV0:.2f})',(j%2==1) if mirror is None else mirror,inner)
def at(sym,x,y,rot=0,sx=1,sy=1):
    t=f'translate({x:.3f} {y:.3f})'
    if rot: t+=f' rotate({rot})'
    if sx!=1 or sy!=1: t+=f' scale({sx} {sy})'
    return f'<g transform="{t}">{sym}</g>'

K=F.K
ACC='#C4623F'
def bath_inner():
    o=at(F.toilet(),0.62,0.55)
    o+=at(F.sink(),0.33,1.55,90)
    o+=at(F.drain(),0.95,2.35)+at(F.shower_seat(),1.38,2.45)
    o+=F.line(0.16,0.12,0.16,1.0,ACC,.05)+F.line(0.98,0.14,0.98,0.85,ACC,.05)+F.line(0.12,2.0,0.12,2.7,ACC,.05)
    o+=F.rect(1.6,0.85,0.14,0.95,'#FBF6EC',0,'stroke="none"')+F.line(1.76,0.85,1.76,1.8,K,.03)
    return o
def bedroom_inner(blanket=F.SAGE):
    o=bath_inner()
    o+=at(F.cabinet(0.9,0.38,F.WOOD),3.03,1.55,90)+F.line(3.24,0.5,3.24,1.0,ACC,.05)
    o+=at(F.wheel(1.5),1.45,5.0)
    o+=at(F.wardrobe(1.3,0.55),0.33,3.75,90)
    o+=at(F.cabinet(1.1,0.4,F.WOOD),0.25,5.35,90)+at(F.crect(0.05,0.85,'#5B5750',.01),0.14,5.35)
    o+=at(F.bed(1.0,2.0,blanket),2.68,4.55)
    o+=at(F.night(),1.9,3.75)+at(F.lamp(.13),1.9,3.75)
    o+=at(F.armchair(.72,.72,F.TERRA),1.55,6.55,180)+at(F.table_round(.5),2.3,6.45)+at(F.plant(.28),.5,6.1)
    return o
