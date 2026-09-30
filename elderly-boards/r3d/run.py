import sys, os, math, time, json
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
from scene3d import *
import mats, furnish as FU
from mathutils import Vector, Matrix
OUT=os.path.join(HERE,'..','renders'); os.makedirs(OUT,exist_ok=True)

def setup_scene():
    reset(); mats.all_mats()
    sc=bpy.context.scene
    sc.render.engine='CYCLES'; cy=sc.cycles; cy.device='CPU'
    cy.use_denoising=True; cy.use_adaptive_sampling=True; cy.adaptive_threshold=0.02; cy.adaptive_min_samples=16
    try: cy.denoiser='OPENIMAGEDENOISE'
    except Exception: pass
    cy.max_bounces=8; cy.diffuse_bounces=4; cy.glossy_bounces=3; cy.transmission_bounces=6; cy.transparent_max_bounces=6
    cy.sample_clamp_indirect=8; cy.caustics_reflective=False; cy.caustics_refractive=False
    sc.view_settings.view_transform='Khronos PBR Neutral'; sc.view_settings.look='AgX - Medium High Contrast' if False else 'None'
    sc.render.image_settings.file_format='PNG'; sc.render.image_settings.color_depth='16'
    # world
    w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; nt=w.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    sky=nt.nodes.new('ShaderNodeTexSky'); sky.sky_type='MULTIPLE_SCATTERING'; sky.sun_elevation=math.radians(32); sky.sun_rotation=math.radians(200); sky.sun_disc=False
    bg=nt.nodes.new('ShaderNodeBackground'); bg.inputs['Strength'].default_value=2.2; out=nt.nodes.new('ShaderNodeOutputWorld')
    nt.links.new(sky.outputs['Color'],bg.inputs['Color']); nt.links.new(bg.outputs['Background'],out.inputs['Surface'])
    # sun
    sun=bpy.data.lights.new('sun','SUN'); sun.energy=12.0; sun.color=(1,.96,.9); sun.angle=math.radians(1.2)
    so=bpy.data.objects.new('sun',sun); sc.collection.objects.link(so)
    d=Vector((0.45,0.75,-0.55)); so.rotation_euler=d.to_track_quat('-Z','Y').to_euler()
    # ground
    g=bpy.data.objects.new('ground',bpy.data.meshes.new('g')); 
    me=g.data; me.from_pydata([(-600,-600,-.16),(600,-600,-.16),(600,600,-.16),(-600,600,-.16)],[],[(0,1,2,3)]); me.update(); g.data.materials.append(M('ground')); sc.collection.objects.link(g)

def build_all(furnished=True):
    build_floor(1); build_floor(2)
    for info,inw in WINDOWS:
        if info: make_portal(info,inw)
    landscape()
    if furnished:
        FU.rooms_misc_1f(); FU.rehab_1f(); FU.canteen_1f(); FU.hall_frame(FU.hall_1f)
        FU.bedrooms_2f()
        FU.rails_and_lights(1); FU.rails_and_lights(2)

def landscape():
    import random; rnd=random.Random(7)
    # paved terrace + entrance path
    bbox(6.5,-55.5,-.14,42,-50.6,-.06,'paving',name='terrace')
    bbox(33.6,-72,-.14,36.6,-55.4,-.06,'paving',name='path')
    bbox(24,-60,-.13,25,-60,-.1,'paving',name='dummy2') if False else None
    def tree(x,y,s=1.0):
        cyl(x,y,1.3*s,.13*s,2.6*s,'walnut',seg=10,name='trunk')
        for (dx,dy,dz,r) in ((0,0,3.4,1.9),(.9,.4,3.0,1.4),(-.9,-.3,3.1,1.5),(.2,-.8,3.7,1.3),(-.3,.7,3.8,1.2)):
            sphere(x+dx*s,y+dy*s,dz*s,r*s,'leaf' if rnd.random()<.5 else 'leaf2',sz=.9,seg=14,name='canopy')
    for (x,y,s) in ((2,-60,1.2),(9,-66,1.0),(15,-59,.9),(21,-68,1.15),(28,-62,1.0),(40,-66,1.2),(46,-58,1.0),(52,-70,1.3),(58,-52,1.1),(-4,-52,1.2),(4,-73,1.4),(33,-80,1.4),(46,-46,1.0),(56,-40,1.2)):
        tree(x,y,s)
    # low hedges along terrace edge
    for x in range(8,42,3): sphere(x,-55.9,.35,.55,'leaf2',sz=.7,seg=10,name='hedge')
def camera(pos,target,lens=20,sensor=36,name='cam'):
    cd=bpy.data.cameras.new(name); cd.lens=lens; cd.sensor_width=sensor; cd.clip_start=.05; cd.clip_end=300
    co=bpy.data.objects.new(name,cd); bpy.context.scene.collection.objects.link(co)
    co.location=pos; dirv=Vector(target)-Vector(pos); co.rotation_euler=dirv.to_track_quat('-Z','Y').to_euler()
    bpy.context.scene.camera=co; return co
def pp(x,y,z): X,Y=P(x,y); return (X,Y,z)
def render(name,res=(1800,1200),samples=64,exposure=0.0):
    sc=bpy.context.scene; sc.render.resolution_x,sc.render.resolution_y=res; sc.render.resolution_percentage=100
    sc.cycles.samples=samples; sc.view_settings.exposure=exposure
    sc.render.filepath=os.path.join(OUT,name+'.png'); t=time.time(); bpy.ops.render.render(write_still=True); print(name,'done %.0fs'%(time.time()-t),flush=True)

def V(f,pos,tgt,lens,exp=1.0):
    z=lvl(f); return dict(pos=(pos[0],pos[1],pos[2]+z),tgt=(tgt[0],tgt[1],tgt[2]+z),lens=lens,exp=exp)
VIEWS={
 'bedroom':V(2,pp(AX[2]+12.5,Y_UN+29,1.42),pp(AX[2]+19,Y_UN+73,1.0),15,0.5),
 'bath':V(2,pp(AX[2]+16.2,Y_UN+14,1.45),pp(AX[2]+2,Y_UN+16,1.0),14,0.2),
 'hall2':V(2,pp(345,437,1.55),pp(398,490,1.0),16,0.55),
 'corridor2':V(2,pp(84,425,1.5),pp(300,425,1.45),22,0.6),
 'nurse2':V(2,pp(226,432,1.5),pp(226,395,1.05),15,1.3),
 'lobby1':V(1,pp(353,503,1.55),pp(392,455,1.15),16,0.6),
 'rehab1':V(1,pp(AX[2]+5,Y_UN+34,1.6),pp(AX[3]+22,Y_UN+70,0.8),16,0.6),
 'canteen1':V(1,pp(AX[6]+5,Y_UN+34,1.6),pp(AX[7]+18,Y_UN+68,0.8),16,0.6),
}
def Vw(f,pos_uv,tgt_uv,zc,zt,lens,exp=1.2):
    a=W(*pos_uv); b=W(*tgt_uv); z=lvl(f)
    return dict(pos=(*P(*a),zc+z),tgt=(*P(*b),zt+z),lens=lens,exp=exp)
VIEWS['activity1']=Vw(1,(641,84),(692,120),1.6,0.8,16,0.6)
VIEWS['aerial1']=dict(pos=(-11,-104,48),tgt=(27,-42,0),lens=55,exp=-1.3,mode='aerial1')
VIEWS['aerial2']=dict(pos=(-11,-104,52),tgt=(27,-42,3.5),lens=55,exp=-1.3,mode='aerial2')
def hide_above(z):
    for ob in bpy.data.objects:
        if ob.type=='MESH':
            zs=[v[2] for v in ob.bound_box]
            ob.hide_render= min(zs)>=z-0.01
def ortho_top(cx,cy,scale,z=80):
    cd=bpy.data.cameras.new('top'); cd.type='ORTHO'; cd.ortho_scale=scale; cd.clip_end=300
    co=bpy.data.objects.new('top',cd); bpy.context.scene.collection.objects.link(co); co.location=(cx,cy,z); co.rotation_euler=(0,0,0)
    bpy.context.scene.camera=co
def set_mode(mode):
    for ob in bpy.data.objects: ob.hide_render=False
    if mode=='aerial1': hide_above(H-.001)
    if mode in ('aerial1','aerial2'):
        for cn in ('ceil1','ceil2'): bpy.data.collections[cn].hide_render=True
    elif mode=='interior':
        for cn in ('ceil1','ceil2'): bpy.data.collections[cn].hide_render=False
    # collections hide flag must be mirrored on their objects
    for cn in ('ceil1','ceil2'):
        for ob in bpy.data.collections[cn].objects: ob.hide_render=bpy.data.collections[cn].hide_render
RES={'bath':(1800,1900),'aerial1':(4400,2800),'aerial2':(4400,2800)}   # >=300 dpi at printed size (aerial ~350 mm, interiors ~240 mm)
def final(names,samples=128):
    setup_scene(); build_all()
    for name in names:
        v=VIEWS[name]; set_mode(v.get('mode','interior')); camera(v['pos'],v['tgt'],v['lens'])
        render('f_'+name,RES.get(name,(3000,1600)),samples,v['exp'])
if __name__=='__main__' and sys.argv[1]=='FINAL':
    final(sys.argv[2].split(','),int(sys.argv[3]))
elif __name__=='__main__':
    which=sys.argv[1].split(',') ; res=(int(sys.argv[2]),int(sys.argv[3])); samples=int(sys.argv[4]); pre=sys.argv[5] if len(sys.argv)>5 else ''
    setup_scene(); build_all()
    for name in which:
        v=VIEWS[name]; set_mode(v.get('mode','interior')); camera(v['pos'],v['tgt'],v['lens'])
        render(pre+name,res,samples,v['exp'])
