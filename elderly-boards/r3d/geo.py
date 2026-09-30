"""Blender geometry helpers. World = metres, X east, Y north (page-y flipped), Z up."""
import bpy, bmesh, math
from mathutils import Vector, Matrix

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for c in list(bpy.data.collections): bpy.data.collections.remove(c)

_mats={}
def M(name): return _mats[name]
def register(name,m): _mats[name]=m; return m

class T:
    """2-D transform stack applied to local (x,y) -> world (X,Y): mirror, rotate(yaw rad), translate"""
    def __init__(s): s.stack=[(0.0,0.0,0.0,1)]; s.zoff=0.0
    def push(s,x,y,yaw=0.0,mirror=False):
        # compose: new = parent ∘ local
        px,py,pyaw,pm=s.stack[-1]
        lx,ly=x*pm,y                     # parent's mirror flips local x
        c,si=math.cos(pyaw),math.sin(pyaw)
        wx=px+lx*c-ly*si; wy=py+lx*si+ly*c
        s.stack.append((wx,wy,pyaw+(yaw*pm),pm*(-1 if mirror else 1)))
    def pop(s): s.stack.pop()
    def pt(s,x,y):
        px,py,pyaw,pm=s.stack[-1]
        lx=x*pm; c,si=math.cos(pyaw),math.sin(pyaw)
        return (px+lx*c-y*si, py+lx*si+y*c)
    def yaw(s): return s.stack[-1][2]
    def flip(s): return s.stack[-1][3]<0
TT=T()

def link(obj,coll=None):
    (coll or bpy.context.scene.collection).objects.link(obj); return obj

def mesh_obj(name,verts,faces,mat=None,smooth=False,bevel=0.0,coll=None):
    me=bpy.data.meshes.new(name); me.from_pydata(verts,[],faces); me.update()
    ob=bpy.data.objects.new(name,me); link(ob,coll)
    if mat: ob.data.materials.append(M(mat) if isinstance(mat,str) else mat)
    if smooth:
        for p in me.polygons: p.use_smooth=True
    if bevel>0:
        m=ob.modifiers.new('bv','BEVEL'); m.width=bevel; m.segments=2; m.limit_method='ANGLE'
    return ob

def box(cx,cy,cz,sx,sy,sz,mat,yaw=0.0,bevel=0.0,name='box',coll=None,uselocal=True):
    """box centred (cx,cy,cz) local; sizes sx (along local x), sy, sz; yaw local. Transformed by TT stack."""
    hx,hy,hz=sx/2,sy/2,sz/2
    c,s=math.cos(yaw),math.sin(yaw)
    pts=[]
    for dx in (-hx,hx):
        for dy in (-hy,hy):
            for dz in (-hz,hz):
                lx=cx+dx*c-dy*s; ly=cy+dx*s+dy*c
                X,Y=TT.pt(lx,ly); pts.append((X,Y,cz+dz+TT.zoff))
    # vertex order: (dx,dy,dz) 000..111
    f=[(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6),(0,2,6,4),(1,5,7,3)]
    if TT.flip(): f=[tuple(reversed(q)) for q in f]
    return mesh_obj(name,pts,f,mat,bevel=bevel,coll=coll)

def bbox(x0,y0,z0,x1,y1,z1,mat,bevel=0.0,name='bb',coll=None):
    return box((x0+x1)/2,(y0+y1)/2,(z0+z1)/2,x1-x0,y1-y0,z1-z0,mat,0,bevel,name,coll)

def cyl(cx,cy,cz,r,h,mat,axis='z',seg=24,bevel=0.0,name='cyl',coll=None,r2=None):
    """cylinder/cone; axis 'z' (vertical) or 'x'/'y' (local horizontal) centred."""
    r2=r if r2 is None else r2
    pts=[];faces=[]
    for i in range(seg):
        a=2*math.pi*i/seg
        for k,(rr,zz) in enumerate(((r,-h/2),(r2,h/2))):
            u,v=math.cos(a)*rr,math.sin(a)*rr
            if axis=='z': lx,ly,lz=cx+u,cy+v,cz+zz
            elif axis=='x': lx,ly,lz=cx+zz,cy+u,cz+v
            else: lx,ly,lz=cx+u,cy+zz,cz+v
            X,Y=TT.pt(lx,ly); pts.append((X,Y,lz+TT.zoff))
    for i in range(seg):
        j=(i+1)%seg
        faces.append((2*i,2*j,2*j+1,2*i+1))
    faces.append(tuple(2*i for i in range(seg))); faces.append(tuple(2*i+1 for i in reversed(range(seg))))
    if TT.flip(): faces=[tuple(reversed(f)) for f in faces]
    return mesh_obj(name,pts,faces,mat,smooth=True,bevel=bevel,coll=coll)

def sphere(cx,cy,cz,r,mat,sx=1,sy=1,sz=1,seg=16,name='sph',coll=None):
    bm=bmesh.new(); bmesh.ops.create_uvsphere(bm,u_segments=seg,v_segments=max(6,seg//2),radius=1.0)
    for v in bm.verts:
        lx=cx+v.co.x*r*sx; ly=cy+v.co.y*r*sy; lz=cz+v.co.z*r*sz
        X,Y=TT.pt(lx,ly); v.co=Vector((X,Y,lz+TT.zoff))
    if TT.flip(): bmesh.ops.reverse_faces(bm,faces=bm.faces[:])
    me=bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob=bpy.data.objects.new(name,me); link(ob,coll); ob.data.materials.append(M(mat) if isinstance(mat,str) else mat)
    for p in me.polygons: p.use_smooth=True
    return ob

def poly_prism(pts,z0,z1,mat,name='prism',coll=None):
    """extrude a polygon (world XY list) between z0,z1"""
    n=len(pts); v=[(x,y,z0) for x,y in pts]+[(x,y,z1) for x,y in pts]
    faces=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]
    for i in range(n):
        j=(i+1)%n; faces.append((i,j,n+j,n+i))
    return mesh_obj(name,v,faces,mat,coll=coll)

def wall(p0,p1,thk,z0,z1,mat,openings=(),name='wall',coll=None):
    """wall centre-line p0->p1 (world XY). openings: [(t0,t1,sill,head)] distances along wall in metres."""
    (x0,y0),(x1,y1)=p0,p1
    L=math.hypot(x1-x0,y1-y0); ang=math.atan2(y1-y0,x1-x0)
    ux,uy=(x1-x0)/L,(y1-y0)/L
    out=[]
    def seg(t0,t1,za,zb):
        if t1-t0<1e-4 or zb-za<1e-4: return
        cx=x0+ux*(t0+t1)/2; cy=y0+uy*(t0+t1)/2
        out.append(box(cx,cy,(za+zb)/2,t1-t0,thk,zb-za,mat,ang,name=name,coll=coll))
    ops=sorted(openings); t=0
    for (a,b,sill,head) in ops:
        a=max(a,0);b=min(b,L)
        seg(t,a,z0,z1); seg(a,b,z0,z0+sill) if sill>0 else None; seg(a,b,z0+head,z1); t=b
    seg(t,L,z0,z1)
    return out
