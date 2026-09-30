import math
from scene3d import *
import furn3d as F
from furn3d import pl
UW=3.305
def bar_origin(k): return (AX[k+1]/10 if k%2 else AX[k]/10, -Y_UN/10)
def wing_origin(j):
    u=WU[j+1] if j%2 else WU[j]; x,y=W(u,WV0); return P(x,y)
def unit(k,fn,*a,**kw):
    ox,oy=bar_origin(k); TT.push(ox,oy,0,mirror=(k%2==1)); fn(*a,**kw); TT.pop()
def wunit(j,fn,*a,**kw):
    ox,oy=wing_origin(j); TT.push(ox,oy,-math.radians(40),mirror=(j%2==1)); fn(*a,**kw); TT.pop()
def wmerged(j,fn):
    ox,oy=P(*W(WU[j],WV0)); TT.push(ox,oy,-math.radians(40),mirror=False); fn(); TT.pop()
def at(fn,x,ym,rot=0,z=0,**kw): pl(lambda **k: fn(**k),x,ym,rot,**kw)

def bath_room():
    at(F.toilet,0.62,0.6,0); at(F.sink,0.36,1.62,270)
    at(F.shower_seat,1.36,2.6,0)
    at(F.grab,0.14,0.6,0,L=.7,h=.8,axis='y'); at(F.grab,1.08,0.5,0,L=.6,h=.8,axis='y'); at(F.grab,0.7,0.12,0,L=.6,h=.8,axis='x')
    at(F.grab,1.6,2.5,0,L=.9,h=.9,axis='y'); at(F.grab,1.2,2.8,0,L=.7,h=1.0,axis='x')
    # tiled wall cladding (west, north, south inside faces) 2.1 m
    TT.push(0.09,-1.4,0); F.box(0,0,1.05,.02,2.7,2.1,'tile_wall',name='wtile_w'); TT.pop()
    TT.push(0.9,-0.08,0); F.box(0,0,1.05,1.6,.02,2.1,'tile_wall',name='wtile_n'); TT.pop()
    TT.push(0.9,-2.78,0); F.box(0,0,1.05,1.6,.02,2.1,'tile_wall',name='wtile_s'); TT.pop()
    # mirror + LED strip above sink (west wall)
    TT.push(0.11,-1.62,0); F.box(0,0,1.55,.02,.75,.9,'mirror',name='mirror'); F.box(0,0,2.05,.03,.75,.04,'light_emit',name='led'); F.box(0,0,1.55,.025,.78,.93,'steel',name='mframe') if False else None; TT.pop()
    # shower zone: glass screen + shower head + drain
    TT.push(1.6,-2.5,0); F.cyl(0,0,1.3,.012,2.0,'steel',seg=8,name='showerpipe'); F.sphere(-.1,0,2.1,.07,'steel',sz=.4,name='head'); TT.pop()
    # towel + plant + soap shelf
    TT.push(0.13,-0.4,0); F.box(0,0,1.15,.03,.4,.55,'cream',bevel=.01,name='towel'); TT.pop()
    TT.push(1.05,-0.25,0); F.cyl(0,0,.03,.0,.0,'steel',seg=3,name='dummy'); TT.pop()
    # sliding door leaf (half open) in bath side wall
    TT.push(1.70,-1.9,0); F.box(0,0,1.05,.04,.5,2.05,'white',name='slide_door'); TT.pop()
    TT.push(0.85,-1.4,0); F.downlight(); TT.pop(); TT.push(0.95,-2.3,0); F.downlight(); TT.pop()

def bedroom(blanket='sage',door_mat='door0'):
    """canonical (even) 2-F bedroom"""
    at(F.cabinet if hasattr(F,'cabinet') else F.tvcab,3.0,1.55,270) if False else None
    at(F.bookshelf,3.03,1.55,270,w=.9,d=.35,h=1.0)
    at(F.wardrobe,0.33,3.85,270)
    at(F.bed,2.66,4.55,0,blanket=blanket)
    at(F.night,1.88,3.75,0)
    at(F.tvcab,0.24,5.5,270,w=1.1,d=.4)
    at(F.rug,1.7,4.9,0,w=1.9,d=2.6)
    at(F.armchair,1.55,6.6,180)
    at(F.sidetable,2.3,6.5,0)
    at(F.plant,2.9,6.95,0,h=1.1)
    at(F.floorlamp,0.4,3.1,0)
    at(F.art_frame,3.20,4.55,90,w=1.0,h=.65,z=1.55,mat='cream')
    # curtains at south window (x centre 1.65, width 1.8)
    for x in (.62,2.68): TT.push(x,-7.42,0); F.box(0,0,1.3,.34,.05,2.5,'curtain',bevel=.015,name='curtain'); TT.pop()
    TT.push(1.65,-7.44,0); F.box(0,0,2.6,2.6,.03,.03,'steel',name='rod'); TT.pop()
    # door (closed, corridor side) + lintel + memory box
    TT.push(2.5,0.05,0); F.door_leaf(.95,2.05,door_mat); TT.pop()
    TT.push(2.5,0.09,0); F.box(0,0,2.14,1.05,.03,.1,door_mat,name='lintel'); TT.pop()
    TT.push(1.5,0.09,0); F.memory_box(door_mat); TT.pop()
    # lights
    for (x,y) in ((1.65,-4.4),(1.65,-6.2),(0.9,-1.4),(2.5,-1.4)): TT.push(x,y,0); F.downlight(); TT.pop()
    bath_room()

def hall_frame(fn,*a,**k):
    TT.push(341.8/10,-434.6/10,0); fn(*a,**k); TT.pop()
def hall_2f():
    pl(F.rug,3.0,4.7,0,w=3.4,d=2.8) if False else None
    at(F.rug,3.0,4.7,0,w=3.6,d=2.9)
    at(F.sofa,2.2,4.6,270,w=2.4,d=.9,mat='sage')
    at(F.table_round,3.7,4.6,0,d=.9,h=.45,n=0)
    at(F.armchair,4.9,3.6,90,mat='terra'); at(F.armchair,4.9,5.6,90,mat='terra')
    at(F.tvcab,0.35,4.6,270,w=1.8,d=.4,tv_w=1.5)
    for (x,y) in ((3.4,1.5),(5.8,1.9)): at(F.table_round,x,y,0,d=1.5,n=5)
    at(F.counter,5.4,7.0,0,w=2.0,d=.6)
    at(F.plant,0.5,6.6,0,h=1.5); at(F.plant,7.4,1.0,0,h=1.6)
    at(F.bookshelf,1.2,7.15,0,w=1.5)
    at(F.floorlamp,1.2,3.0,0)
    for (x,y) in ((3.4,1.5),(5.8,1.9),(3.0,4.6)): at(F.pendant,x,y,0,z=2.05)
    for (x,y) in ((1.5,2.5),(4.5,3.4),(2.2,6.0),(6.0,4.2),(1.5,4.6),(4.0,6.2)): at(F.downlight,x,y,0)
def hall_1f():
    at(F.rect if False else F.rug,1.0,6.85,0,w=1.2,d=.9) if False else None
    at(F.reception,3.1,5.0,0,w=2.8,d=.7)
    at(F.chair,3.1,4.3,180); at(F.chair,2.3,4.3,180)
    for (x,y) in ((3.4,1.7),(5.6,2.1)): at(F.table_round,x,y,0,d=1.0,n=3)
    at(F.bookshelf,0.25,2.9,270,w=1.7)
    at(F.armchair,1.1,2.9,270,mat='sage')
    at(F.sofa,5.6,6.65,180,w=2.0,mat='terra'); at(F.table_round,5.6,5.6,0,d=.7,h=.45)
    at(F.plant,7.4,1.2,0,h=1.6)
    for (x,y) in ((3.4,1.7),(5.6,2.1),(3.1,5.0)): at(F.pendant,x,y,0,z=2.05)
    for (x,y) in ((1.5,2.5),(4.5,3.4),(2.2,6.0),(6.0,4.2),(1.5,4.6)): at(F.downlight,x,y,0)
    # reception backdrop slat wall (south of counter) not needed
def nb_2f():
    TT.push(226/10,-404/10,0)
    F.counter(3.6,.7,1.05,0,'slat','white')
    for x in (-1.2,0,1.2):
        TT.push(x,.55,0); F.chair(0,'blue'); TT.pop()
    TT.push(0,-.05,0); F.box(0,0,1.16,.6,.02,.34,'tv',name='monitor'); TT.pop()
    TT.push(-1.0,.72,0); F.box(0,0,1.16,.02,.5,.34,'tv',name='monitor'); TT.pop()
    TT.pop()
    for x in (214,238):
        TT.push(x/10,-378.5/10,0); F.bookshelf(1.6,.4,2.1); TT.pop()
    TT.push(226/10,-390/10,0); F.downlight(); TT.pop()
    TT.push(214/10,-398/10,0); F.downlight(); TT.pop(); TT.push(238/10,-398/10,0); F.downlight(); TT.pop()
def rehab_1f():
    ox,oy=bar_origin(2); TT.push(ox,oy,0,mirror=False)
    at(F.pbars,2.6,6.2,0); at(F.mirror,2.6,7.35,0,w=3.2) if False else None
    TT.push(2.6,-7.38,0); F.mirror(3.2,1.7,0.6); TT.pop()
    at(F.stairs_train,5.6,6.5,0)
    at(F.therapy_bed,5.5,3.45,270); at(F.therapy_bed,5.5,4.5,270)
    at(F.bike,0.75,3.75,0); at(F.bike,1.55,3.75,0)
    at(F.plant,4.5,0.5,0,h=1.2); at(F.armchair,1.9,1.4,0,mat='sage'); at(F.armchair,3.3,1.4,0,mat='sage'); at(F.sidetable,2.6,1.55,0)
    at(F.wall_bars,6.35,5.2,90) if False else None
    for (x,y) in ((1.6,3.6),(3.3,3.6),(5.0,3.6),(1.6,5.8),(3.3,5.8),(5.0,5.8),(3.3,1.4)): at(F.downlight,x,y,0)
    TT.pop()
    unit(2,bath_room); unit(3,bath_room)
def canteen_1f():
    ox,oy=bar_origin(6); TT.push(ox,oy,0)
    for x in (1.15,3.3,5.45): at(F.table_round,x,4.5,0,d=1.35,n=5)
    at(F.counter,3.3,1.55,0,w=2.7,d=.55,h=.95,front='slat')
    for x in (2.4,3.35,4.2): at(F.hotbox,x,1.55,0,z=.95)
    at(F.plant,6.2,.9,0,h=1.3)
    for x in (1.15,3.3,5.45): at(F.pendant,x,4.5,0,z=2.0)
    for (x,y) in ((1.6,2.4),(3.3,2.4),(5.0,2.4),(1.2,6.2),(3.3,6.2),(5.4,6.2)): at(F.downlight,x,y,0)
    TT.pop()
    unit(6,bath_room); unit(7,bath_room)
def rooms_misc_1f():
    ox,oy=bar_origin(0); 
    unit(0,lambda: (at(F.table_rect,1.65,3.85,0,w=1.5,d=.7), at(F.chair,1.65,4.5,180), at(F.bookshelf,.25,5.4,270,w=1.5), at(F.plant,3.0,6.9,0)))
    unit(0,bath_room)
    unit(1,lambda: (at(F.table_rect,1.35,3.65,0,w=1.4,d=.65), at(F.chair,1.35,4.3,180), at(F.therapy_bed,2.7,5.4,0), at(F.bookshelf,.25,5.0,270,w=1.5)))
    unit(1,bath_room)
    unit(4,lambda: (at(F.massage,.95,5.35,0), at(F.massage,2.55,5.35,0), at(F.table_rect,2.4,3.35,0,w=1.2,d=.6), at(F.plant,3.0,7.0,0)))
    unit(4,bath_room)
    unit(5,lambda: (at(F.rug,1.65,5.0,0,w=2.6,d=2.0), at(F.armchair,.85,5.05,270,mat='terra'), at(F.armchair,2.45,5.05,90,mat='sage'), at(F.table_round,1.65,5.05,0,d=.55,h=.45), at(F.plant,2.9,3.3,0)))
    unit(5,bath_room)
    for j in range(4): wunit(j,bath_room)
    wunit(0,lambda: (at(F.table_rect,1.65,5.0,0,w=2.4,d=.9), at(F.plant,3.0,6.9,0)))
    wmerged(1,lambda: [at(F.table_round,x,4.7,0,d=1.25,n=5) for x in (1.05,3.3,5.55)]+[at(F.plant,0.4,7.0,0,h=1.3),at(F.plant,6.2,7.0,0,h=1.3)]+[at(F.pendant,x,4.7,0,z=2.05) for x in (1.05,3.3,5.55)]+[at(F.downlight,x,y,0) for x in (1.2,3.3,5.4) for y in (3.4,6.2)])
    wunit(3,lambda: (at(F.table_rect,1.65,4.45,0,w=.85,d=.85), at(F.table_rect,1.65,6.4,0,w=.85,d=.85), at(F.armchair,2.6,1.4,0,mat='terra')))
def bedrooms_2f():
    TT.zoff=lvl(2)
    for k in range(8): unit(k,bedroom,['sage','terra_l','blue','yellow'][k%4],f'door{k%6}')
    for j in range(4): wunit(j,bedroom,['sage','terra_l','blue','yellow'][(j+1)%4],f'door{(j+4)%6}')
    hall_frame(hall_2f); nb_2f()
    TT.zoff=0.0

def rails_and_lights(f):
    TT.zoff=lvl(f); z0=0
    # bar corridor
    xs=[(x+s) for x in DX for s in (-8,8)]
    def segs(x0,x1,gaps,gw=1.15):
        cuts=[]; a=x0
        for g in sorted(gaps):
            if g-gw*5>a: cuts.append((a,g-gw*5))
            a=g+gw*5
        cuts.append((a,x1)); return cuts
    for (a,b) in segs(AX[0]+4,AX[8]-4,xs):
        L=(b-a)/10; 
        if L<.5: continue
        for h in (.85,.65):
            TT.push((a+b)/20,-(Y_UN)/10+.075+.05,0); F.handrail(L,h,z0); TT.pop()
        TT.push((a+b)/20,-(Y_UN)/10+.075+.012,0); F.box(0,0,z0+.45,L,.02,.9,'oak_light',name='dado'); TT.pop()
    for (a,b) in segs(AX[0]+4,385,[226,286]):
        L=(b-a)/10
        if L<.5: continue
        for h in (.85,.65):
            TT.push((a+b)/20,-415.5/10-.075-.05,0); F.handrail(L,h,z0); TT.pop()
        TT.push((a+b)/20,-415.5/10-.075-.012,0); F.box(0,0,z0+.45,L,.02,.9,'oak_light',name='dado'); TT.pop()
    TT.push((AX[0]+385)/20,-425/10,0); F.cove((385-AX[0])/10-.4,'x',z0+2.83,.10); TT.pop()
    for x in range(int(AX[0]+16),385,33):
        TT.push(x/10,-425/10,0); F.downlight(z0+2.845); TT.pop()
    # wing corridor
    ox,oy=P(*W(606,WV0)); TT.push(ox,oy,-math.radians(40))
    L=13.2
    for h in (.85,.65): TT.push(L/2,.075+.05,0); F.handrail(L-3,h,z0); TT.pop()
    TT.pop()
    ox,oy=P(*W(560,44.5)); TT.push(ox,oy,-math.radians(40)); TT.push(8.5,0,0); F.cove(17.,'x',z0+2.83,.10); TT.pop(); TT.pop()
    TT.zoff=0.0


def south_curtains(f,units=range(8),extra=((372,1.6),(393,1.4))):
    TT.zoff=lvl(f); yy=-(Y_US/10)+.20
    wins=[((AX[k]+AX[k+1])/20,1.8) for k in units]+[(x/10,w) for x,w in extra]
    for wi,(cx,w) in enumerate(wins):
        yy=-(Y_US/10)+.20+.03*(wi%2)
        for sgn in (-1,1):
            TT.push(cx+sgn*(w/2+.22),yy,0); F.box(0,0,1.4,.42,.07,2.75,'curtain',bevel=.02,name='curtain'); TT.pop()
        TT.push(cx,yy,0); F.box(0,0,2.78,w+.9,.03,.03,'steel',name='rod'); TT.pop()
    TT.zoff=0.0
