"""3-D furniture (metres). Local frame: x right, y up-plan (north), z up. Origin = footprint centre at floor level."""
import math
from geo import *
def R(d): return math.radians(d)
def pl(fn,x,ym,rot=0.0,**kw):
    """place at unit-frame coords (x right, ym DOWN like the 2-D plan) with visual clockwise rotation rot (deg)."""
    TT.push(x,-ym,-R(rot)); fn(**kw); TT.pop()

def bed(w=1.0,l=2.0,blanket='sage',z=0):
    box(0,0,z+.22,w,l,.20,'oak_light',bevel=.02,name='bed_frame')
    box(0,-.02,z+.42,w-.04,l-.06,.20,'white',bevel=.06,name='mattress')
    box(0,-l*.18,z+.52,w-.02,l*.62,.07,blanket,bevel=.03,name='blanket')
    box(0,l/2-.30,z+.55,w-.24,.36,.12,'white',bevel=.05,name='pillow')
    box(0,l/2+.03,z+.6,w+.06,.06,.95,'oak',bevel=.02,name='headboard')
    for sx in (-1,1):
        box(sx*(w/2+.03),-.1,z+.7,.03,1.1,.05,'steel',name='rail'); box(sx*(w/2+.03),-.1,z+.55,.03,.03,.3,'steel',name='rail')
    for sx in (-1,1):
        for sy in (-1,1): box(sx*(w/2-.06),sy*(l/2-.08),z+.07,.06,.06,.14,'oak',name='leg')
def night(w=.42,d=.42,z=0):
    box(0,0,z+.28,w,d,.5,'oak',bevel=.015,name='night'); box(0,-d/2+.01,z+.36,w-.06,.012,.14,'black',name='drawer')
    box(0,0,z+.55,w+.02,d+.02,.03,'oak_light',bevel=.01,name='top')
    cyl(0,0,z+.60,.04,.06,'steel',name='lampbase'); cyl(0,0,z+.71,.09,.16,'lamp_shade',seg=20,name='shade',r2=.06)
def wardrobe(w=1.3,d=.55,h=2.0,z=0):
    box(0,0,z+h/2,w,d,h,'oak_light',bevel=.012,name='wardrobe')
    for sx in (-1,1):
        box(sx*w/4,-d/2-.005,z+h/2,w/2-.03,.012,h-.1,'oak',bevel=.004,name='door')
        box(sx*.03,-d/2-.02,z+h*.5,.015,.015,.3,'steel',name='handle')
def armchair(w=.72,d=.72,mat='terra',z=0):
    box(0,-.02,z+.28,w-.02,d-.08,.16,mat,bevel=.05,name='seat')
    box(0,d/2-.06,z+.55,w-.02,.14,.6,mat,bevel=.06,name='back')
    for sx in (-1,1): box(sx*(w/2-.05),0,z+.46,.10,d-.1,.32,mat,bevel=.04,name='arm')
    box(0,-.02,z+.4,w-.24,d-.22,.12,mat+'_l' if mat+'_l' in __import__('geo')._mats else mat,bevel=.05,name='cushion')
    for sx in (-1,1):
        for sy in (-1,1): cyl(sx*(w/2-.07),sy*(d/2-.09),z+.1,.022,.2,'oak',seg=10,name='leg',r2=.014)
def sidetable(r=.25,h=.5,z=0):
    cyl(0,0,z+h,r,.03,'oak_light',seg=28,name='top'); cyl(0,0,z+h/2,.02,h,'oak',seg=8,name='stem'); cyl(0,0,z+.02,r*.6,.03,'oak',seg=20,name='foot')
def leaf(x0,y0,z0,az,elev,length,width,mat,bend=55,n=7):
    """arched leaf blade: starts at (x0,y0,z0) heading az (rad, local plane), elevation elev deg, bending down by `bend` deg."""
    import random
    pts_c=[];x,y,z=x0,y0,z0
    for i in range(n+1):
        t=i/n; pts_c.append((x,y,z,t))
        e=math.radians(elev-bend*t); ds=length/n
        x+=math.cos(az)*math.cos(e)*ds; y+=math.sin(az)*math.cos(e)*ds; z+=math.sin(e)*ds
    sx,sy=-math.sin(az),math.cos(az)
    verts=[];faces=[]
    for (px,py,pz,t) in pts_c:
        w=width*(math.sin(math.pi*min(1,t*.92+.06))**.8)*0.5
        for sgn in (-1,1):
            X,Y=TT.pt(px+sx*w*sgn,py+sy*w*sgn); verts.append((X,Y,pz+TT.zoff))
    for i in range(n):
        a=2*i;faces.append((a,a+1,a+3,a+2))
    if TT.flip(): faces=[tuple(reversed(f)) for f in faces]
    return mesh_obj('leaf',verts,faces,mat,smooth=True)
def plant(r=.3,h=1.0,z=0,pot=.22):
    cyl(0,0,z+pot/2,pot*.62,pot,'pot',seg=24,name='pot',r2=pot*.5)
    cyl(0,0,z+pot-.005,pot*.5,.02,'walnut',seg=24,name='soil')
    import random; rnd=random.Random(int(abs(TT.stack[-1][0]*100+TT.stack[-1][1]*37)))
    n=int(14+h*10)
    for i in range(n):
        az=rnd.uniform(0,6.283); el=rnd.uniform(48,88); ln=rnd.uniform(.5,1.0)*(h*.75+.15); wd=ln*rnd.uniform(.22,.32)
        d=rnd.uniform(0,r*.25)
        leaf(math.cos(az)*d,math.sin(az)*d,z+pot,az,el,ln,wd,'leaf' if i%3 else 'leaf2',bend=rnd.uniform(35,80))
def floorlamp(h=1.55,z=0):
    cyl(0,0,z+.015,.14,.03,'steel',seg=18,name='base'); cyl(0,0,z+h/2,.012,h,'steel',seg=8,name='pole')
    cyl(0,0,z+h-.1,.2,.28,'lamp_shade',seg=22,name='shade',r2=.15)
def tvcab(w=1.1,d=.4,z=0,tv_w=.95):
    box(0,0,z+.25,w,d,.5,'oak_light',bevel=.012,name='tvcab'); box(0,0,z+.51,w+.02,d+.02,.03,'oak',bevel=.01)
    box(0,.0,z+1.05,tv_w,.04,.55,'tv',bevel=.006,name='tv'); box(0,0,z+.56,.3,.05,.06,'steel',name='tvstand')
def rug(w,d,mat='rug',z=0): box(0,0,z+.008,w,d,.014,mat,bevel=.004,name='rug')
def handrail(L,h=.85,z=0,dirn='x',standoff=.05):
    cyl(0,0,z+h,.022,L,'oak',axis='x' if dirn=='x' else 'y',seg=12,name='rail')
    n=max(2,int(L/1.2)+1)
    for i in range(n):
        t=-L/2+.15+ (L-.3)*i/(n-1)
        if dirn=='x': box(t,0,z+h-.03,.02,standoff+.02,.02,'steel',name='brk')
        else: box(0,t,z+h-.03,standoff+.02,.02,.02,'steel',name='brk')
def toilet(z=0):
    box(0,.2,z+.42,.38,.16,.35,'gloss_white',bevel=.03,name='tank'); box(0,-.03,z+.2,.36,.5,.4,'gloss_white',bevel=.08,name='bowl'); box(0,-.03,z+.42,.34,.46,.04,'gloss_white',bevel=.03,name='seat')
def sink(w=.55,d=.45,z=0):
    box(0,0,z+.8,w,d,.08,'gloss_white',bevel=.03,name='basin'); box(0,d/2-.04,z+.98,.02,.03,.16,'steel',name='tap'); box(0,d/2-.02,z+1.0,.02,.12,.02,'steel',name='tap2')
    box(0,d/2-.04,z+.55,.12,.1,.5,'gloss_white',name='pedestal')
def grab(L=.6,h=.8,z=0,axis='x',mat='door0'):
    cyl(0,0,z+h,.017,L,mat,axis=axis,seg=10,name='grab')
def shower_seat(z=0): box(0,0,z+.46,.5,.45,.04,'oak_light',bevel=.01,name='seat'); box(0,.2,z+.23,.04,.04,.46,'steel',name='sleg')
def sofa(w=2.0,d=.9,mat='sage',z=0):
    box(0,0,z+.22,w-.03,d-.03,.30,mat,name='sofa_base')
    box(0,d/2-.1,z+.6,w-.03,.2,.55,mat,name='sofa_back')
    for sx in (-1,1): box(sx*(w/2-.085),-.005,z+.45,.19,d-.01,.35,mat,name='sofa_arm')
    n=max(2,round(w/.7))
    for i in range(n): box(-w/2+.18+(w-.36)*(i+.5)/n,-.04,z+.45,(w-.36)/n-.02,d-.28,.14,mat+'_l' if mat+'_l' in __import__('geo')._mats else mat,bevel=.05,name='cushion')
    for sx in (-1,1): box(sx*(w/2-.09),-d/2+.02,z+.06,.05,.05,.1,'oak',name='sofa_leg')
    box(-w*.3,d/2-.22,z+.62,.42,.14,.4,'terra_l',yaw=.12,bevel=.06,name='pillow'); box(w*.3,d/2-.22,z+.62,.42,.14,.4,'cream',yaw=-.1,bevel=.06,name='pillow')
def pillow(mat='terra_l'): box(0,0,0,.4,.12,.4,mat,bevel=.05,name='pillow',yaw=0)
def chair(z=0,mat='terra'):
    box(0,0,z+.44,.44,.42,.05,mat,bevel=.02,name='chair_seat'); box(0,.2,z+.7,.44,.04,.42,'oak',bevel=.015,name='chair_back')
    for sx in (-1,1):
        for sy in (-1,1): box(sx*.19,sy*.18,z+.21,.035,.035,.42,'oak',name='chair_leg')
def table_round(d=1.2,h=.75,z=0,mat='oak_light',n=0,chair_mat='terra'):
    cyl(0,0,z+h,d/2,.04,mat,seg=36,name='table_top'); cyl(0,0,z+h/2,.05,h,'oak',seg=10,name='ped'); cyl(0,0,z+.02,.28,.03,'oak',seg=18,name='foot')
    if d>.8:
        cyl(0,0,z+h+.13,.05,.22,'white',seg=16,name='vase',r2=.035)
        for k in range(6):
            a=k*1.05; sphere(math.cos(a)*.05,math.sin(a)*.05,z+h+.3+.02*(k%3),.05,'yellow' if k%2 else 'cream',seg=8,name='flower')
        sphere(0,0,z+h+.28,.09,'leaf2',sz=.7,seg=8,name='foliage')
    for i in range(n):
        a=2*math.pi*i/n; TT.push(math.sin(a)*(d/2+.24),math.cos(a)*(d/2+.24),-a+math.pi); chair(z,chair_mat); TT.pop()
def table_rect(w=1.4,d=.8,h=.75,z=0,mat='oak_light'):
    box(0,0,z+h,w,d,.04,mat,bevel=.01,name='table_top')
    for sx in (-1,1):
        for sy in (-1,1): box(sx*(w/2-.05),sy*(d/2-.05),z+h/2,.05,.05,h,'oak',name='tleg')
def counter(w=2.0,d=.6,h=.9,z=0,front='oak',top='white'):
    box(0,0,z+h/2,w,d,h,front,bevel=.01,name='counter'); box(0,0,z+h+.02,w+.04,d+.04,.04,top,bevel=.008,name='counter_top')
def reception(w=3.0,d=.7,z=0):
    counter(w,d,1.05,z,'slat','white')
    box(-w/2+.6,-.9,z+.75,1.2,.7,.04,'oak_light',bevel=.01,name='low_top'); box(-w/2+.6,-.9,z+.37,1.16,.66,.72,'slat',bevel=.01,name='low_body')
def bookshelf(w=1.6,d=.35,h=2.0,z=0):
    box(0,0,z+h/2,w,d,h,'oak_light',bevel=.008,name='shelf_body')
    import random; rnd=random.Random(3)
    cols=['terra','sage','yellow','blue','terra_l','cream']
    for i in range(1,5):
        zz=z+h*i/5; box(0,0,zz,w,d-.01,.02,'oak',name='shelf_plank')
        x=-w/2+.06
        while x<w/2-.1:
            ww=rnd.uniform(.03,.06);hh=rnd.uniform(.18,.3); box(x+ww/2,-.02,zz+.01+hh/2,ww,d-.12,hh,rnd.choice(cols),name='book'); x+=ww+.005
def mirror(w=2.4,h=1.6,z=0.7): box(0,0,z+h/2,w,.03,h,'glass',name='mirror')
def pbars(l=3.0,w=.75,h=.9,z=0):
    for sy in (-1,1): cyl(0,sy*w/2,z+h,.022,l,'oak',axis='x',seg=12,name='pbar')
    for sx in (-1,1):
        for sy in (-1,1): cyl(sx*(l/2-.05),sy*w/2,z+h/2,.02,h,'steel',seg=10,name='ppost')
def therapy_bed(w=.75,l=1.95,z=0):
    box(0,0,z+.25,w,l,.1,'blue',bevel=.04,name='tbed'); box(0,0,z+.15,w-.1,l-.15,.3,'steel',name='tbase'); box(0,l/2-.25,z+.32,w-.15,.32,.06,'white',bevel=.03,name='tpillow')
def wall_bars(w=.9,h=2.3,z=0):
    box(0,0,z+h/2,w,.06,h,'oak_light',bevel=.01,name='wb_frame')
    for i in range(1,int(h/.15)): cyl(0,-.05,z+i*.15,.015,w-.06,'oak',axis='x',seg=8,name='wb_rung')
def stairs_train(w=1.5,d=.9,z=0):
    for i in range(4): box(0,-d/2+ (i+.5)*d/4,z+.06+i*.12,w,d/4,.12*(i+1),'oak_light',bevel=.01,name='step')
def bike(z=0):
    box(0,0,z+.45,.5,.9,.1,'gloss_white',bevel=.03,name='bike_body'); cyl(0,.15,z+.55,.16,.06,'steel',axis='x',seg=18,name='flywheel'); box(0,-.25,z+.7,.28,.1,.3,'black',name='bike_seat'); box(0,.3,z+.85,.4,.04,.04,'steel',name='bike_bar')
def massage(w=.7,l=1.9,z=0):
    box(0,0,z+.38,w,l,.16,'terra_l',bevel=.06,name='mbed'); box(0,0,z+.18,w-.1,l-.1,.35,'oak',name='mbase')
def hotbox(w=.8,d=.5,z=0): box(0,0,z+.1,w,d,.2,'steel',bevel=.02,name='hotbox'); box(0,0,z+.22,w-.06,d-.06,.04,'glass',name='hotlid')
def art_frame(w=.9,h=.6,z=1.4,mat='terra'):
    box(0,0,z,w+.06,.03,h+.06,'walnut',bevel=.006,name='frame'); box(0,.006,z,w,.03,h,mat,name='canvas')
def memory_box(mat='door0'):
    box(0,0,1.45,.32,.1,.36,'walnut',bevel=.008,name='mbox'); box(0,.02,1.45,.26,.08,.3,'cream',name='minner'); box(0,.03,1.47,.13,.06,.16,mat,bevel=.01,name='mitem')
def door_leaf(w=.9,h=2.05,mat='door0',z=0,open_deg=0):
    box(0,0,z+h/2,w,.045,h,mat,bevel=.006,name='door'); box(w/2-.1,-.04,z+1.0,.14,.03,.03,'steel',name='dhandle')
def pendant(z=2.2,r=.22,top=2.85):
    cyl(0,0,(z+top)/2,.004,top-z,'steel',seg=6,name='cord'); sphere(0,0,z,r,'lamp_shade',sz=.9,seg=32,name='pend')
def downlight(z=2.845,r=.07): cyl(0,0,z,r,.01,'light_emit',seg=16,name='dl')
def cove(L,axis='x',z=2.84,w=.08): 
    box(0,0,z,L if axis=='x' else w,w if axis=='x' else L,.012,'cove_emit',name='cove')
