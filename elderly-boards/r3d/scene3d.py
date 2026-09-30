import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src'))
import bpy
from mathutils import Vector
import model as MD
from geo import *
import furn3d as F
from furn3d import pl

H=3.3; SL=.15; WH=H-SL; CEIL=2.85
def lvl(f): return (f-1)*H
def P(x,y): return (x/10.0,-y/10.0)                  # plan pt -> world m
def dist(a,b): return math.hypot(a[0]-b[0],a[1]-b[1])
W=MD.W; AX=MD.AX; Y_UN,Y_US,Y_BATH=MD.Y_UN,MD.Y_US,MD.Y_BATH; WU=MD.WU; WV0=MD.WV0; WV1=MD.WV1
DX=[AX[1],AX[3],AX[5],AX[7]]
CO={}   # collections
def coll(name):
    if name not in CO:
        c=bpy.data.collections.new(name); bpy.context.scene.collection.children.link(c); CO[name]=c
    return CO[name]

# ---- envelope (plan pt)
A_=(76.3,373.5); B_=W(541,35.3); B_=(391.7,373.5)
E_=(B_[0]+197*math.cos(math.radians(40)),B_[1]+197*math.sin(math.radians(40)))
F_=(E_[0]+92.1*(-math.sin(math.radians(40))),E_[1]+92.1*math.cos(math.radians(40)))
G_=(F_[0]-((F_[1]-508.6)/math.sin(math.radians(40)))*math.cos(math.radians(40)),508.6)
H_=(76.3,508.6)
ENV=[A_,B_,E_,F_,G_,H_]
def ln(a,b): return dist(P(*a),P(*b))

def add_wall(a_pt,b_pt,thk,f,mat,openings=(),c=None,h=None):
    z0=lvl(f)
    a=P(*a_pt); b=P(*b_pt)
    return wall(a,b,thk,z0,z0+(h or WH),mat,openings,coll=c)

def window(a_pt,b_pt,center_along,width,sill,head,f,c,portal=True,frame=True):
    """window glass+frame inside an already-cut opening. center_along in metres from a."""
    a=P(*a_pt);b=P(*b_pt);L=dist(a,b);ux,uy=(b[0]-a[0])/L,(b[1]-a[1])/L
    ang=math.atan2(uy,ux); cx=a[0]+ux*center_along; cy=a[1]+uy*center_along; z0=lvl(f)
    hh=head-sill
    box(cx,cy,z0+sill+hh/2,width-.02,.012,hh-.02,'glass',ang,name='glass',coll=c)
    if frame:
        for (dx,dz,sx,sz) in ((0,hh/2,width,.05),(0,-hh/2,width,.05),(-width/2,0,.05,hh),(width/2,0,.05,hh),(0,0,.035,hh)):
            X=cx+ux*dx; Y=cy+uy*dx
            box(X,Y,z0+sill+hh/2+dz,sx,.09,sz,'white',ang,name='wframe',coll=c)
    if portal:
        # inward normal: pointing to building interior handled by caller through light_dir
        return (cx,cy,z0+sill+hh/2,ang,width,hh)
def make_portal(info,inward):
    cx,cy,cz,ang,w,h=info
    from mathutils import Matrix
    lt=bpy.data.lights.new('portal','AREA'); lt.shape='RECTANGLE'; lt.size=w; lt.size_y=h; lt.energy=1
    try: lt.cycles.is_portal=True
    except Exception: pass
    ob=bpy.data.objects.new('portal',lt); bpy.context.scene.collection.objects.link(ob)
    ob.location=(cx+inward[0]*.05,cy+inward[1]*.05,cz)
    X=Vector((math.cos(ang),math.sin(ang),0)); Z=Vector((-inward[0],-inward[1],0)); Y=Z.cross(X)
    ob.rotation_euler=Matrix((X,Y,Z)).transposed().to_euler()
    return ob

WINDOWS=[]   # collected for portals

def build_floor(f,first_floor_entrance=True):
    z0=lvl(f); c=coll(f'floor{f}'); cc=coll(f'ceil{f}')
    env=[P(*p) for p in ENV]
    poly_prism(env,z0-SL,z0,'concrete',name=f'slab{f}',coll=c)
    poly_prism(env,z0,z0+.02,'oak_floor',name=f'floor_finish{f}',coll=c)
    poly_prism(env,z0+CEIL,z0+CEIL+.04,'ceiling',name=f'ceiling{f}',coll=cc)
    if f==2: poly_prism(env,z0+WH,z0+WH+SL,'concrete',name='roof',coll=cc)
    ET=.26; PT=.15; BT=.10
    # ---- exterior walls with windows
    def ext(a,b,thk,wins,doors=()):
        L=ln(a,b); ops=[]
        for (cen,w,sill,head) in wins: ops.append((cen-w/2,cen+w/2,sill,head))
        add_wall(a,b,thk,f,'paint',ops,c)
        inward=None
        return L
    # south wall H_->G_
    a,b=H_,G_; ops=[]; win=[]
    for k in range(8):
        cx=(AX[k]+AX[k+1])/2; win.append((( cx-a[0])/10,1.8,.6,2.4))
    hall_w=[(372,1.6),(393,1.4)]
    for x,w in hall_w: win.append(((x-a[0])/10,w,.6,2.4))
    ent=(351-a[0])/10
    if f==1: win.append((ent,1.5,0,2.4))
    else: win.append((ent,1.4,.6,2.4))
    for cen,w,sill,head in win: ops.append((cen-w/2,cen+w/2,sill,head))
    add_wall(a,b,ET,f,'paint',ops,c)
    for cen,w,sill,head in win:
        info=window(a,b,cen,w,sill,head,f,c,frame=True); WINDOWS.append((info,(0,1)))   # inward = +Y (north)
    # west wall
    a,b=H_,A_; win=[((508.6-425)/10,1.2,.5,2.4)]
    add_wall(a,b,ET,f,'paint',[(win[0][0]-.6,win[0][0]+.6,.5,2.4)],c); info=window(a,b,win[0][0],1.2,.5,2.4,f,c); WINDOWS.append((info,(1,0)))
    # north wall
    add_wall(A_,B_,ET,f,'paint',[],c)
    # wing NE wall (windows at corridor)
    a,b=B_,E_; ops=[];wins=[]
    for j in range(4):
        u=WU[j]+16.5; wins.append(((u-541)/10,1.6,.9,2.4))
    for cen,w,sill,head in wins: ops.append((cen-w/2,cen+w/2,sill,head))
    add_wall(a,b,ET,f,'paint',ops,c)
    inw=(-math.sin(math.radians(40)),-math.cos(math.radians(40)))
    for cen,w,sill,head in wins: info=window(a,b,cen,w,sill,head,f,c); WINDOWS.append((info,inw))
    # SE end wall (window at corridor end)
    a,b=E_,F_; add_wall(a,b,ET,f,'paint',[(.4,1.9,.3,2.4)],c); info=window(a,b,1.15,1.5,.3,2.4,f,c); WINDOWS.append((info,(-math.cos(math.radians(40)),math.sin(math.radians(40)))))
    # SW wing wall F->G  (windows per unit)
    a,b=F_,G_; wins=[]
    for j in range(4):
        u=WU[j]+16.5; wins.append(((738-u)/10,1.8,.6,2.4))
    add_wall(a,b,ET,f,'paint',[(cen-w/2,cen+w/2,sill,head) for cen,w,sill,head in wins],c)
    for cen,w,sill,head in wins:
        info=window(a,b,cen,w,sill,head,f,c); WINDOWS.append((info,(math.sin(math.radians(40)),math.cos(math.radians(40)))))
    # ---- interior
    # corridor south wall (unit fronts) with doors
    dops=[]
    for x in DX:
        for s in (-8,8): cen=(x+s-AX[0])/10; dops.append((cen-.5,cen+.5,0,2.1))
    add_wall((AX[0],Y_UN),(AX[8],Y_UN),PT,f,'paint',dops,c)
    # unit partitions
    for k in range(1,9):
        ops=[]
        if f==1 and k in (3,7): ops=[(3.2,6.7,0,2.5)]
        add_wall((AX[k],Y_UN),(AX[k],Y_US),PT,f,'paint',ops,c)
    # bath walls
    for k in range(8):
        if k%2==0: xl,xr,xin=AX[k],AX[k]+17,AX[k]+17
        else: xl,xr,xin=AX[k+1]-17,AX[k+1],AX[k+1]-17
        add_wall((xl,Y_BATH),(xr,Y_BATH),BT,f,'paint',[],c)
        add_wall((xin,Y_UN),(xin,Y_BATH),BT,f,'paint',[(.95,1.85,0,2.1)],c)
        box((xl+xr)/20,-(Y_UN+Y_BATH)/20,z0+.03,(xr-xl)/10-.15,(Y_BATH-Y_UN)/10-.15,.03,'tile_bath',name='bath_floor',coll=c)
    # north-band: corridor north wall + partitions
    add_wall((AX[0],415.5),(385.5,415.5),PT,f,'paint',[((113-AX[0])/10-.45,(113-AX[0])/10+.45,0,2.1),((331-AX[0])/10-.45,(331-AX[0])/10+.45,0,2.1),((366-AX[0])/10-.45,(366-AX[0])/10+.45,0,2.1)] if f==1 else [((226-AX[0])/10-1.6,(226-AX[0])/10+1.6,0,2.1),((286-AX[0])/10-.5,(286-AX[0])/10+.5,0,2.1)],c)
    for x in (102.5,128.5,201,220,250,272,300,353.5,385.5):
        if f==2 and x==220: continue
        add_wall((x,373.5),(x,415.5),BT,f,'paint',[],c)
    # wing walls (local frame)
    def wl(u0,v0,u1,v1,thk,ops=(),mat='paint'): add_wall(W(u0,v0),W(u1,v1),thk,f,mat,ops,c)
    wl(606,WV0,606,WV1,PT)
    dops=[]
    for u in (639,705):
        for s in (-8,8): cen=(u+s-606)/10; dops.append((cen-.5,cen+.5,0,2.1))
    wl(606,WV0,738,WV0,PT,dops)
    for u in (639,672,705):
        ops=[(3.2,6.7,0,2.5)] if (f==1 and u==672) else []
        wl(u,WV0,u,WV1,PT,ops)
    for j in range(4):
        if j%2==0: xl,xr,xin=WU[j],WU[j]+17,WU[j]+17
        else: xl,xr,xin=WU[j+1]-17,WU[j+1],WU[j+1]-17
        wl(xl,MD.WVB,xr,MD.WVB,BT)
        wl(xin,WV0,xin,MD.WVB,BT,[(.95,1.85,0,2.1)])
    # wing bath floors
    for j in range(4):
        if j%2==0: xl,xr=WU[j],WU[j]+17
        else: xl,xr=WU[j+1]-17,WU[j+1]
        p=[W(xl+.8,WV0+.8),W(xr-.8,WV0+.8),W(xr-.8,MD.WVB-.8),W(xl+.8,MD.WVB-.8)]
        poly_prism([P(*q) for q in p],z0+.02,z0+.05,'tile_bath',name='bath_floor_w',coll=c)
