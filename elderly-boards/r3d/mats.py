import bpy, math, random
from geo import register, M
def _bsdf(n):
    nt=n.node_tree if hasattr(n,'node_tree') else n
    return nt.nodes['Principled BSDF']
def base(name,color,rough=.6,metal=0,spec=.5,emit=None,es=0,sheen=0,alpha=None,coat=0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    b=_bsdf(m.node_tree); b.inputs['Base Color'].default_value=(*color,1)
    b.inputs['Roughness'].default_value=rough; b.inputs['Metallic'].default_value=metal
    for k,v in (('Specular IOR Level',spec),('Sheen Weight',sheen),('Coat Weight',coat)):
        if k in b.inputs: b.inputs[k].default_value=v
    if emit:
        b.inputs['Emission Color'].default_value=(*emit,1); b.inputs['Emission Strength'].default_value=es
    if alpha is not None: b.inputs['Alpha'].default_value=alpha
    return register(name,m)
def wood(name,c1,c2,scale=3.0,rough=.42,planks=False,plank_w=.16,plank_l=1.2,coat=.15):
    m=bpy.data.materials.new(name); m.use_nodes=True; nt=m.node_tree; b=_bsdf(m)
    tc=nt.nodes.new('ShaderNodeTexCoord'); mp=nt.nodes.new('ShaderNodeMapping')
    nt.links.new(tc.outputs['Object'],mp.inputs['Vector'])
    mp.inputs['Scale'].default_value=(1,1,1)
    wv=nt.nodes.new('ShaderNodeTexWave'); wv.wave_type='BANDS'; wv.bands_direction='X'
    wv.inputs['Scale'].default_value=scale*9; wv.inputs['Distortion'].default_value=5; wv.inputs['Detail'].default_value=4; wv.inputs['Detail Scale'].default_value=2
    nt.links.new(mp.outputs['Vector'],wv.inputs['Vector'])
    ns=nt.nodes.new('ShaderNodeTexNoise'); ns.inputs['Scale'].default_value=scale*30; nt.links.new(mp.outputs['Vector'],ns.inputs['Vector'])
    mix=nt.nodes.new('ShaderNodeMixRGB'); mix.blend_type='MULTIPLY'; mix.inputs['Fac'].default_value=.08
    nt.links.new(wv.outputs['Color'],mix.inputs['Color1']); nt.links.new(ns.outputs['Color'],mix.inputs['Color2'])
    cr=nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color=(*c1,1); cr.color_ramp.elements[1].color=(*c2,1)
    cr.color_ramp.elements[0].position=.35; cr.color_ramp.elements[1].position=.75
    nt.links.new(mix.outputs['Color'],cr.inputs['Fac'])
    col=cr.outputs['Color']
    if planks:
        br=nt.nodes.new('ShaderNodeTexBrick'); br.inputs['Scale'].default_value=1.0
        br.inputs['Mortar Size'].default_value=.0015; br.inputs['Brick Width'].default_value=plank_l; br.inputs['Row Height'].default_value=plank_w
        br.inputs['Color1'].default_value=(1,1,1,1); br.inputs['Color2'].default_value=(.95,.93,.9,1); br.inputs['Mortar'].default_value=(.55,.45,.35,1)
        br.offset=.5; br.offset_frequency=2
        nt.links.new(mp.outputs['Vector'],br.inputs['Vector'])
        mm=nt.nodes.new('ShaderNodeMixRGB'); mm.blend_type='MULTIPLY'; mm.inputs['Fac'].default_value=1
        nt.links.new(col,mm.inputs['Color1']); nt.links.new(br.outputs['Color'],mm.inputs['Color2']); col=mm.outputs['Color']
    nt.links.new(col,b.inputs['Base Color']); b.inputs['Roughness'].default_value=rough
    if 'Coat Weight' in b.inputs: b.inputs['Coat Weight'].default_value=coat
    return register(name,m)
def tile(name,c=(.86,.9,.88),w=.3,h=.6,rough=.28):
    m=bpy.data.materials.new(name); m.use_nodes=True; nt=m.node_tree; b=_bsdf(m)
    tc=nt.nodes.new('ShaderNodeTexCoord'); br=nt.nodes.new('ShaderNodeTexBrick')
    br.inputs['Scale'].default_value=1; br.inputs['Brick Width'].default_value=w; br.inputs['Row Height'].default_value=h
    br.inputs['Mortar Size'].default_value=.004; br.inputs['Color1'].default_value=(*c,1); br.inputs['Color2'].default_value=(c[0]*.94,c[1]*.94,c[2]*.94,1); br.inputs['Mortar'].default_value=(.7,.72,.7,1)
    nt.links.new(tc.outputs['Object'],br.inputs['Vector']); nt.links.new(br.outputs['Color'],b.inputs['Base Color']); b.inputs['Roughness'].default_value=rough
    return register(name,m)
def glass(name='glass'):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=_bsdf(m)
    b.inputs['Base Color'].default_value=(.95,.98,1,1); b.inputs['Roughness'].default_value=0.02
    if 'Transmission Weight' in b.inputs: b.inputs['Transmission Weight'].default_value=1
    b.inputs['IOR'].default_value=1.45
    return register(name,m)
def fabric(name,color,rough=.95): return base(name,color,rough,spec=.2,sheen=.5)
def all_mats():
    base('paint',(.95,.94,.91),.92,spec=.2)
    base('paint_warm',(.93,.88,.8),.92,spec=.2)
    base('paint_sage',(.72,.79,.66),.9,spec=.2)
    base('paint_terra',(.85,.58,.45),.9,spec=.2)
    base('ceiling',(.98,.98,.96),.95,spec=.1)
    base('white',(.95,.95,.94),.5)
    base('gloss_white',(.95,.95,.95),.15,spec=.6)
    base('concrete',(.62,.6,.57),.9)
    base('ground',(.34,.5,.24),1)
    base('paving',(.7,.66,.6),.85)
    wood('oak_floor',(.74,.58,.42),(.82,.67,.5),scale=4,planks=True,rough=.34)
    wood('oak',(.6,.44,.28),(.72,.55,.36),scale=5,rough=.4)
    wood('oak_light',(.84,.7,.53),(.9,.78,.6),scale=5,rough=.45)
    wood('walnut',(.3,.18,.1),(.4,.25,.14),scale=5,rough=.4)
    wood('slat',(.7,.5,.3),(.82,.62,.4),scale=10,rough=.5)
    tile('tile_bath',c=(.66,.64,.58),w=.3,h=.3,rough=.35); tile('tile_floor',c=(.8,.8,.76),w=.6,h=.6,rough=.3)
    glass()
    fabric('sage',(.47,.58,.42)); fabric('sage_l',(.68,.76,.6)); fabric('terra',(.78,.42,.29)); fabric('terra_l',(.9,.66,.55))
    fabric('cream',(.93,.88,.78)); fabric('yellow',(.93,.75,.35)); fabric('blue',(.55,.68,.78)); fabric('linen',(.85,.8,.68))
    fabric('curtain',(.9,.84,.72),.98); fabric('rug',(.85,.76,.6),1)
    base('leaf',(.18,.4,.14),.7,spec=.3); base('leaf2',(.28,.5,.2),.7); base('pot',(.75,.62,.48),.6)
    base('steel',(.75,.75,.75),.25,metal=1)
    base('mirror',(.92,.94,.95),.02,metal=1,spec=1)
    tile('tile_wall',c=(.82,.86,.78),w=.3,h=.6,rough=.18)
    base('black',(.03,.03,.03),.4); base('tv',(.02,.02,.025),.15,spec=.8)
    base('lamp_shade',(.98,.95,.85),.9,emit=(1,.9,.72),es=1.6)
    base('light_emit',(1,.92,.8),.5,emit=(1,.86,.66),es=90)
    base('cove_emit',(1,.92,.8),.5,emit=(1,.86,.66),es=14)
    base('sun_emit',(1,.85,.5),.5,emit=(1,.8,.5),es=60)
    for i,c in enumerate([(.89,.6,.47),(.56,.7,.6),(.56,.7,.79),(.92,.75,.4),(.78,.62,.75),(.66,.73,.54)]): base(f'door{i}',c,.55,spec=.3)
    base('sign',(.98,.95,.9),.6)
