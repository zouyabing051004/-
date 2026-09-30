import math
from model import *
from render import plan_group, P, cad_defs, rooms, nb_rooms, cen, ZONES
SIL=[R(72.8,370.6,412,511.5), WR(535,32,741,131)]
def axo(rot=-28,sy=.55,gap=150,W=1200,H=620,thick=9,pad=40,callouts=True,labels_on=True):
    a=math.radians(rot);ca,sa=math.cos(a),math.sin(a)
    A,B,C,D=ca,sy*sa,-sa,sy*ca
    def proj(x,y,lvl=0):
        return (A*x+C*y, B*x+D*y-lvl*gap)
    # bounding box
    pts=[proj(x,y,l) for p in SIL for (x,y) in p for l in (0,1)]
    x0=min(p[0] for p in pts);x1=max(p[0] for p in pts);y0=min(p[1] for p in pts)-thick;y1=max(p[1] for p in pts)+thick
    S=min((W-2*pad)/(x1-x0),(H-2*pad)/(y1-y0))
    tx=pad+(W-2*pad-(x1-x0)*S)/2-x0*S; ty=pad+(H-2*pad-(y1-y0)*S)/2-y0*S
    def scr(x,y,l=0): px,py=proj(x,y,l);return (px*S+tx,py*S+ty)
    o=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="100%" style="display:block" class="axo">'
    # ground shadow
    gx,gy=scr(240,440,0)
    o+=f'<ellipse cx="{gx:.0f}" cy="{gy+70:.0f}" rx="{(x1-x0)*S*.46:.0f}" ry="{(y1-y0)*S*.13:.0f}" fill="#B8A98F" fill-opacity=".22"/>'
    def sil_polys(dy=0,fill='#E3D6BF',stroke='#B7A488'):
        s=''
        for p in SIL:
            pp=' '.join(f'{scr(x,y)[0]:.1f},{scr(x,y)[1]+dy:.1f}' for x,y in p)
            s+=f'<polygon points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width=".8" stroke-linejoin="round"/>'
        return s
    def floor(fl,lvl):
        g=''
        # slab thickness
        for t in range(int(thick*S),-1,-1):
            g+=sil_polys(-lvl*gap*S+t,'#D9CCB4' if t else '#E9DFCC','#B7A488' if t==0 or t==int(thick*S) else 'none')
        g+=f'<g transform="translate({tx:.2f} {ty-lvl*gap*S:.2f}) scale({S:.4f}) matrix({A:.5f} {B:.5f} {C:.5f} {D:.5f} 0 0)">'
        g+=plan_group(fl,layers=('fill','cad','open','furn'),cad_w=.32)
        g+='</g>'
        return g
    o+=floor(1,0)
    # dashed vertical links between floors at cores
    for (x,y) in ((150,388),(262,395),(330,388),(78,378),(395,500)):
        (ax_,ay_),(bx_,by_)=scr(x,y,0),scr(x,y,1)
        o+=f'<line x1="{ax_:.1f}" y1="{ay_:.1f}" x2="{bx_:.1f}" y2="{by_+thick*S:.1f}" stroke="#8C7B6C" stroke-width="1" stroke-dasharray="2 4" opacity=".7"/>'
    o+=floor(2,1)
    o+='</svg>'
    return o,scr
if __name__=='__main__':
    import os,sys
    from shot import shot_html
    html='<html><head><meta charset="utf-8"><link rel="stylesheet" href="fonts.css"><style>body{margin:0;background:#F6EFE2;font-family:"Noto Sans SC"}.sans{font-family:"Noto Sans SC"}</style></head><body>'+cad_defs()
    for rot in (-28,-12,12):
        html+='<div style="width:1000px">'+axo(rot,.55,150,1200,640)[0]+'</div>'
    open('tmp/axo.html','w').write(html+'</body></html>')
    shot_html(os.path.abspath('tmp/axo.html'),os.path.abspath('tmp/axo.png'),1000,1700,full=True)
