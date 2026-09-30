"""Plan renderer: builds SVG fragments of the 3# building in page-pt coordinates."""
import math, os
from model import *
from plans import *
import furn as F
from furn import place

HERE=os.path.dirname(os.path.abspath(__file__))
def _cad(i,kind): return open(os.path.join(HERE,'..','tmp',f'cad{i}_{kind}.txt')).read()

def P(pts): return ' '.join(f'{x:.2f},{y:.2f}' for x,y in pts)
def poly(pts,fill,extra=''): return f'<polygon points="{P(pts)}" fill="{fill}" {extra}/>'

# ---------------------------------------------------------------- shared <defs>
def cad_defs():
    clip_bar=R(72.8,370.6,412,512.6)
    clip_wing=WR(535,32,741,131)
    ramp=R(343,507,358,536)
    o='<svg width="0" height="0" style="position:absolute"><defs>'
    for fl in (1,2):
        cp=f'<polygon points="{P(clip_bar)}"/><polygon points="{P(clip_wing)}"/>'+(f'<polygon points="{P(ramp)}"/>' if fl==1 else '')
        o+=f'<clipPath id="envclip{fl}">{cp}</clipPath>'
        dx,dy=(0,0) if fl==1 else SHIFT2
        o+=f'<g id="cad{fl}s" clip-path="url(#envclip{fl})"><g transform="translate({dx} {dy})"><path d="{_cad(fl,"stroke")}"/></g></g>'
        o+=f'<g id="cad{fl}f" clip-path="url(#envclip{fl})"><g transform="translate({dx} {dy})"><path d="{_cad(fl,"fill")}"/></g></g>'
    # soft patterns
    o+='''<pattern id="hatchW" width="1.4" height="1.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="1.4" stroke="#B9A88F" stroke-width=".35"/></pattern>
<marker id="arrT" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#C4623F"/></marker>
<marker id="arrB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#4E86A6"/></marker>
<marker id="arrG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#5E8C55"/></marker>
<marker id="arrY" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#E0A21B"/></marker>
<radialGradient id="glow"><stop offset="0" stop-color="#FFE9A6" stop-opacity=".95"/><stop offset=".55" stop-color="#FFE9A6" stop-opacity=".35"/><stop offset="1" stop-color="#FFE9A6" stop-opacity="0"/></radialGradient>
<linearGradient id="sunS" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFD873" stop-opacity=".75"/><stop offset="1" stop-color="#FFD873" stop-opacity="0"/></linearGradient>'''
    o+='</defs></svg>'
    return o

# ---------------------------------------------------------------- zone fills
def zone_col(z): return ZONES[z][0]
def fills(floor,alpha=1.0,wet=True):
    o=''
    ex=f'fill-opacity="{alpha}"'
    # corridor / junction
    o+=poly(corridor_poly(),ZONES['circ'][0],ex)+poly(JUNC,ZONES['circ'][0],ex)+poly(wing_corr(),ZONES['circ'][0],ex)
    for r in rooms(floor):
        for p in r['polys']: o+=poly(p,zone_col(r['zone']),ex+f' stroke="{zone_col(r["zone"])}" stroke-width=".4"')
        if wet:
            for b in r['bath']: o+=poly(b,ZONES['wet'][0],ex)
    for c in nb_rooms(floor): o+=poly(c['poly'],zone_col(c['zone']),ex)
    return o

# merged-room openings drawn above CAD (cover partition line)
def openings(floor):
    o=''
    if floor==1:
        for (k,zone) in ((2,'rehab'),(6,'dining')):
            x=AX[k+1];o+=f'<rect x="{x-.7:.2f}" y="{Y_UN+31:.2f}" width="1.4" height="{34:.2f}" fill="{zone_col(zone)}"/>'
        # wing B|C
        c=zone_col('activity')
        o+=f'<g transform="rotate(40)"><rect x="{WU[2]-.7}" y="{WVB+3}" width="1.4" height="{34}" fill="{c}"/></g>'
    return o

# ---------------------------------------------------------------- furniture
def wall_thin(): return ''
def furniture(floor):
    o=''
    # baths for all units
    for k in range(8): o+=bar_frame(k,bath_inner())
    for j in range(4): o+=wing_frame(j,bath_inner())
    if floor==2:
        cols=[F.SAGE,'#E9B8A0','#B7CFDD','#F2D58D']
        for k in range(8): o+=bar_frame(k,bedroom_room(cols[k%4]))
        for j in range(4): o+=wing_frame(j,bedroom_room(cols[(j+1)%4]))
        o+=hall_2f()+nb_furn_2f()
    else:
        o+=rooms_1f()+hall_1f()+nb_furn_1f()
    return o

def bedroom_room(blanket):
    o=bedroom_inner(blanket)
    return o.replace(bath_inner(),'',1)   # bath drawn separately (same colour/z-order)

def hp(xm,ym): return (341.8+xm*10,434.6+ym*10)
def hput(sym,xm,ym,rot=0): x,y=hp(xm,ym);return place(sym,x,y,rot)

def rooms_1f():
    o=''
    # 101 duty
    f=at(F.table_rect(1.5,.7),1.65,3.85)+at(F.chair(),1.65,4.5,180)+at(F.chair(),1.05,3.2)+at(F.chair(),2.25,3.2)+at(F.tv(.6),1.65,3.55)
    f+=at(F.cabinet(1.5,.4),0.25,5.4,90)+at(F.plant(.3),3.0,6.9)+at(F.sofa(1.4,.7),2.55,6.7,180)+at(F.wheel(1.5),1.6,5.4)
    o+=bar_frame(0,f)
    # 102 clinic (odd -> mirrored frame)
    f=at(F.table_rect(1.4,.65),1.35,3.65)+at(F.chair(),1.35,4.25,180)+at(F.chair(),0.75,3.0)+at(F.chair(),1.95,3.0)
    f+=at(F.therapy_bed(.75,1.9),2.7,5.4)+at(F.cabinet(1.5,.4),0.25,5.0,90)+at(F.circ(0,0,.2,F.WHITE),1.4,6.5)+at(F.wheel(1.5),1.45,5.3)
    f+=F.line(2.28,3.9,2.28,6.9,'#7BA6C2',.03,'stroke-dasharray=".1 .08"')
    o+=bar_frame(1,f)
    # 103 rehab (frame k2, width 2 units)
    f=at(F.pbars(3.0,.78),2.6,6.2)+at(F.mirror(3.3),2.6,7.38)+at(F.step_train(1.5,1.0),5.6,6.5)
    f+=at(F.therapy_bed(),5.5,3.45,90)+at(F.therapy_bed(),5.5,4.5,90)
    f+=at(F.bike(),0.75,3.75)+at(F.bike(),1.55,3.75)+at(F.wheel(1.5),3.3,4.6)
    f+=at(F.cabinet(1.6,.4),2.9,0.55)+at(F.plant(.3),4.5,0.5)+at(F.armchair(.7,.7,F.SAGE),1.9,1.4)+at(F.armchair(.7,.7,F.SAGE),3.3,1.4)+at(F.table_round(.5),2.6,1.55)
    o+=bar_frame(2,f)+bar_frame(2,'',False)  # placeholder
    # 104 TCM
    f=at(F.massage(),0.95,5.35)+at(F.massage(),2.55,5.35)+F.line(1.75,4.0,1.75,6.7,'#E2A88A',.04,'stroke-dasharray=".12 .08"')
    f+=at(F.table_rect(1.2,.6),2.4,3.35)+at(F.chair(),2.4,3.95,180)+at(F.chair(),2.4,2.75)+at(F.cabinet(1.3,.4),0.25,6.4,90)+at(F.plant(.28),3.0,7.0)
    o+=bar_frame(4,f)
    # 105 counselling (odd, mirrored)
    f=at(F.rug(2.6,2.0,'#EEDFC4'),1.65,5.0)+at(F.armchair(.8,.8,F.TERRA),0.85,5.05,270)+at(F.armchair(.8,.8,F.SAGE),2.45,5.05,90)+at(F.table_round(.55),1.65,5.05)
    f+=at(F.bookshelf(1.5,.35),0.22,6.2,90)+at(F.plant(.3),2.9,3.3)+at(F.lamp(.2),0.4,3.3)
    o+=bar_frame(5,f)
    # 106 canteen (frame k6, width 2 units)
    f=''.join(at(F.dining_round(1.35,5),x,4.5) for x in (1.15,3.3,5.45))
    f+=at(F.wheel(1.5),3.3,6.55).replace('opacity=".85"','opacity=".0"')
    f+=at(F.counter(2.7,.55,F.WOOD2),3.3,1.55)+at(F.hotbox(.8,.5),2.4,1.55)+at(F.hotbox(.8,.5),3.35,1.55)+at(F.hotbox(.8,.5),4.2,1.55)
    f+=at(F.plant(.3),6.2,0.9)+at(F.cabinet(1.2,.35),6.35,6.9)
    o+=bar_frame(6,f,False)
    # 108 art (j0)
    f=at(F.art_table(2.4,.9),1.65,5.0)+at(F.cabinet(1.6,.4),0.25,6.3,90)+at(F.cabinet(1.2,.4),3.05,3.5,90)+at(F.plant(.28),3.0,6.9)+at(F.sink(.55,.45),2.6,2.0)
    o+=wing_frame(0,f)
    # 109 activity (j1 origin, not mirrored)
    f=''.join(at(F.dining_round(1.25,5),x,4.7) for x in (1.05,3.3,5.55))
    f+=at(F.crect(1.6,.5,'#E6D2B0',.03),3.3,7.1).replace('','')+at(F.tv(1.6),3.3,7.36)+at(F.plant(.3),0.4,7.0)+at(F.plant(.3),6.2,7.0)
    o+=wing_frame(1,f,False)
    # 110 games (j3, mirrored)
    f=at(F.mah(.85),1.65,4.45)+at(F.mah(.85),1.65,6.4)+at(F.armchair(.72,.72,F.TERRA),2.6,1.4)+at(F.lamp(.16),3.1,0.6)+at(F.bookshelf(1.4,.35),0.25,4.6,90)
    o+=wing_frame(3,f)
    return o

def hall_1f():
    o=hput(F.rect(-.6,-.45,1.2,.9,'#EDE3D0',.03,'stroke-dasharray=".1 .06" fill-opacity=".7"'),1.0,6.85)
    o+=hput(F.reception(2.8,.7),3.1,5.0)+hput(F.chair(),3.1,4.4,180)+hput(F.chair(),2.3,4.4,180)+hput(F.wheel(1.5),3.2,6.3)
    for (x,y) in ((3.4,1.7),(5.6,2.1)): o+=hput(F.dining_round(1.0,3),x,y)
    o+=hput(F.bookshelf(1.7,.35),0.25,2.9,90)+hput(F.armchair(.75,.75,F.SAGE),1.1,2.9,270)+hput(F.lamp(.18),.5,4.4)
    o+=hput(F.sofa(2.0,.8,F.TERRA),5.6,6.65,180)+hput(F.table_round(.7),5.6,5.6)
    o+=hput(F.plant(.35),0.5,6.2)+hput(F.plant(.4),7.4,1.2)
    return o
def hall_2f():
    o=hput(F.rug(3.2,2.6,'#EDDDBB'),3.0,4.7)
    o+=hput(F.sofa(2.4,.85,F.SAGE),2.7,4.6,270).replace('','')
    o+=hput(F.table_round(.9),3.9,4.6)+hput(F.armchair(.8,.8,F.TERRA),4.9,3.7,90)+hput(F.armchair(.8,.8,F.TERRA),4.9,5.5,90)
    o+=hput(F.tv(1.6),0.2,4.6,90)+hput(F.cabinet(1.8,.4),0.4,4.6,90)
    for (x,y) in ((3.2,1.6),(5.6,2.0)): o+=hput(F.dining_round(1.4,5),x,y)
    o+=hput(F.counter(2.0,.6,F.WOOD2),5.4,7.0)+hput(F.plant(.35),0.5,6.6)+hput(F.plant(.4),7.4,1.0)+hput(F.plant(.3),1.0,0.9)
    o+=hput(F.bookshelf(1.5,.35),1.2,7.1,0)
    return o
def nbp(x,y,sym,rot=0): return place(sym,x,y,rot)
def nb_furn_1f():
    o=nbp(90,408,F.table_rect(1.2,.5))+nbp(90,404.5,F.chair(.4),180)      # room_w wc? (leave clean)
    o=''
    o+=nbp(234,391,F.table_rect(1.9,.7))+nbp(234,398,F.chair(.4),180)+nbp(226,382,F.cabinet(1.5,.4))+nbp(242,404,F.plant(.28))   # 办公
    o+=nbp(286,383,F.counter(2.0,.6,F.GREY))+nbp(281,402,F.hotbox(.8,.6))+nbp(291,402,F.hotbox(.8,.6))
    o+=nbp(370,388,F.table_rect(1.9,.7))+nbp(370,396,F.chair(.4),180)+nbp(361,404,F.cabinet(1.2,.4))
    return o
def nb_furn_2f():
    o=nbp(226,405,F.counter(3.6,.7,F.WOOD2))+nbp(214,394,F.chair(.42),180)+nbp(227,394,F.chair(.42),180)+nbp(240,394,F.chair(.42),180)+nbp(215,381,F.cabinet(1.5,.4))+nbp(238,381,F.cabinet(1.5,.4))
    o+=nbp(281,388,F.crect(.9,1.9,'#CFE3EA',.08))+nbp(293,381,F.stool(.2,F.SAGE))+nbp(292,394,F.therapy_bed(.7,1.5))+nbp(290,405,F.sink())
    o+=nbp(370,386,F.cabinet(1.4,.4))+nbp(370,402,F.cabinet(1.6,.4))
    return o

# ---------------------------------------------------------------- labels
def txt(x,y,s,size=3.2,w=500,fill='#4A3B2F',anchor='middle',extra='',halo=True,fam='sans'):
    st=f'font-size:{size}px;font-weight:{w};' 
    h=f'stroke="#FFFCF5" stroke-width="{size*.22:.2f}" stroke-linejoin="round" paint-order="stroke" ' if halo else ''
    return f'<text x="{x:.2f}" y="{y:.2f}" text-anchor="{anchor}" fill="{fill}" {h}style="{st}" class="{fam}" {extra}>{s}</text>'
def rot_txt(x,y,s,rot,**k): return f'<g transform="rotate({rot} {x:.2f} {y:.2f})">{txt(x,y,s,**k)}</g>'
def labels(floor,en=False,area=True,scale=1.0,small=False):
    o=''
    def lab(x,y,name,en_,ar,size,rot=0):
        t=''
        t+=txt(x,y,name,size*scale,600)
        yy=y+size*scale*1.05
        if en and en_: t+=txt(x,yy,en_,size*scale*.62,400,'#7B6B5C'); yy+=size*scale*.75
        if area and ar: t+=txt(x,yy,f'{ar:.1f} ㎡',size*scale*.72,400,'#7B6B5C')
        return f'<g transform="rotate({rot} {x:.2f} {y:.2f})">{t}</g>' if rot else t
    for r in rooms(floor):
        a=r['anchor']; sz=r['size']
        if floor==2 and r['id']!='213': continue
        if r['id'] in ('107','213'): o+=lab(a[0],a[1],r['name'],r['en'],r['area'],sz)
        elif r['polys'][0] in [wunit(j) for j in range(4)] or r['id'] in('108','109','110') or (floor==2 and r['id'] in ('209','210','211','212')):
            o+=lab(a[0],a[1],r['name'],r['en'],r['area'],sz,rot=40)
        else: o+=lab(a[0],a[1]-(0 if floor==2 else 6),r['name'],r['en'],r['area'],sz)
    for c in nb_rooms(floor):
        if not c['name']: continue
        x,y=cen(c['poly']);
        w=max(p[0] for p in c['poly'])-min(p[0] for p in c['poly'])
        if c['key'] in ('stair1','stair2'): y+=2
        s=c['name']
        if w<21 and len(s)>3: # two-line
            h=len(s)//2+len(s)%2; o+=txt(x,y-.4,s[:h],c['size']*scale*.95,500)+txt(x,y+c['size']*scale*.95,s[h:],c['size']*scale*.95,500)
        else: o+=txt(x,y+c['size']*.35,s,c['size']*scale,500)
    return o

# ---------------------------------------------------------------- assembling
def plan_group(floor,layers=('fill','cad','open','furn','labels'),cad_col='#6E5F51',cad_w=.26,en=False,area=True,lscale=1.0,extra_layers=None,fill_alpha=1.0):
    o=''
    if 'fill' in layers: o+=fills(floor,fill_alpha)
    if 'furn' in layers and 'furn_below' in layers: o+=furniture(floor)
    if 'cad' in layers:
        o+=f'<use href="#cad{floor}s" fill="none" stroke="{cad_col}" stroke-width="{cad_w}" stroke-linejoin="round"/><use href="#cad{floor}f" fill="{cad_col}" fill-opacity=".85"/>'
    if 'open' in layers: o+=openings(floor)
    if 'furn' in layers and 'furn_below' not in layers: o+=furniture(floor)
    if extra_layers: o+=extra_layers
    if 'labels' in layers: o+=labels(floor,en,area,lscale)
    if 'badges' in layers: o+=badges(floor)
    return o
def plan_svg(floor,vb=(60,366,560,580),width='100%',style_extra='',cls='',**kw):
    x0,y0,x1,y1=vb
    return f'<svg xmlns="http://www.w3.org/2000/svg" class="plan {cls}" viewBox="{x0} {y0} {x1-x0} {y1-y0}" width="{width}" style="display:block;{style_extra}" preserveAspectRatio="xMidYMid meet">'+plan_group(floor,**kw)+'</svg>'

def badges(floor):
    """door-number pills in the corridor at each unit door"""
    o=''
    def pill(x,y,t,col='#C4623F',rot=0):
        g=f'<rect x="{x-4.6:.2f}" y="{y-2.5:.2f}" width="9.2" height="5" rx="2.5" fill="{col}"/>'+txt(x,y+1.35,t,3.1,700,'#fff',halo=False)
        return f'<g transform="rotate({rot} {x:.2f} {y:.2f})">{g}</g>' if rot else g
    if floor==2:
        for k in range(8):
            x=AX[k]+ (24 if k%2==0 else 9); o+=pill(x,Y_CS-3.4,f'20{k+1}')
        for j in range(4):
            u=WU[j]+(24 if j%2==0 else 9); x,y=W(u,WV0-3.4); o+=pill(x,y,f'2{9+j:02d}',rot=40)
    return o

# ================================================================= analysis overlays
DX=[AX[1],AX[3],AX[5],AX[7]]                  # door-pair axes
CY=(Y_CN+Y_CS)/2
def wc(u,v=44.8): return W(u,v)
def pline(pts,col='#C4623F',w=1.5,dash='',mk='arrT',op=1,end=True):
    d='M'+' L'.join(f'{x:.2f} {y:.2f}' for x,y in pts)
    return f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" '+(f'stroke-dasharray="{dash}" ' if dash else '')+(f'marker-end="url(#{mk})" ' if end else '')+f'opacity="{op}"/>'
def dot(x,y,r,fill,extra=''): return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{fill}" {extra}/>'

def circulation(floor):
    T,B,G='#C4623F','#4E86A6','#5E8C55'
    o=''
    if floor==1:
        o+=pline([(351,512),(351,478),(358,440),(358,426),(322,426),(312,437),(312,470)],T,1.7,'',)
        o+=pline([(358,426),(392,426),(410,392)],T,1.7,'',end=False)
        o+=pline([(392,426),W(600,44.8),W(660,44.8)],T,1.7,'')
        for u in (639,705): x,y=W(u-8,44.8); x2,y2=W(u-8,66); o+=pline([(x,y),(x2,y2)],T,1.5)
        o+=pline([(358,426),(245,426),(245,440),(245,466)],T,1.7,'',end=False)
        o+=pline([(178,426),(178,440),(178,470)],T,1.5)
        o+=pline([(112,426),(112,440),(112,470)],T,1.5)
        # service
        o+=pline([(75,421),(285,421),(285,403)],B,1.4,'3 2')
        o+=pline([(285,421),(305,421),(305,436),(305,470)],B,1.4,'3 2')
        # vertical
        o+=pline([(258,428),(258,414)],G,1.5,'',mk='arrG')+pline([(150,428),(150,405)],G,1.5,'',mk='arrG')+pline([(330,428),(330,405)],G,1.5,'',mk='arrG')
        o+=pline([(75,428),(93,428),(93,408)],G,1.5,'',mk='arrG')
        o+=dot(351,512,3.2,T)+dot(74,425,2.6,B)
    else:
        for dx in DX:
            for s in (-8,8):
                o+=pline([(dx+s,CY+3),(dx+s,Y_UN+14)],T,1.2)
        for j,u in enumerate((639,705)):
            for s in (-8,8):
                (x1,y1),(x2,y2)=W(u+s,44.8+3),W(u+s,WV0+14); o+=pline([(x1,y1),(x2,y2)],T,1.2)
        o+=pline([(262,428),(262,417)],G,1.6,'',mk='arrG')
        o+=pline([(262,428),(340,428)],T,1.8,'',end=False)+pline([(262,428),(90,428)],T,1.8,'',end=False)
        o+=pline([(340,428),(352,445),(360,470)],T,1.8)+pline([(340,428),W(620,44.8),W(700,44.8)],T,1.8,end=False)
        o+=pline([(226,417),(226,422),(140,422)],B,1.4,'3 2')+pline([(226,422),(285,422),(285,417)],B,1.4,'3 2')+pline([(226,422),(370,422),(386,440)],B,1.4,'3 2')
        # evacuation to stairs
        o+=pline([(90,432),(150,432),(150,406)],G,1.4,'1.5 1.5',mk='arrG')+pline([(395,430),(330,432),(330,406)],G,1.4,'1.5 1.5',mk='arrG')
        o+=pline([W(735,44.8),W(680,44.8),W(600,44.8),(398,428),(340,432)],G,1.4,'1.5 1.5',mk='arrG',end=False)
        o+=dot(262,428,3,G)
    return o

def lighting(floor):
    o=''
    # natural light – south glass of bar units + hall + wing SW wall
    for k in range(8):
        cx=(AX[k]+AX[k+1])/2
        o+=f'<rect x="{AX[k]+1:.1f}" y="{Y_US-24:.1f}" width="{AX[k+1]-AX[k]-2:.1f}" height="24" fill="url(#sunS)"/>'
        o+=pline([(cx,Y_US+11),(cx,Y_US-14)],'#E0A21B',1.4,'',mk='arrY')
    o+=f'<rect x="342" y="{Y_US-26:.1f}" width="60" height="26" fill="url(#sunS)"/>'
    for x in (355,375,395): o+=pline([(x,Y_US+11),(x,Y_US-16)],'#E0A21B',1.4,'',mk='arrY')
    for j in range(4):
        uc=WU[j]+16.5
        x1,y1=W(uc,WV1-24);x2,y2=W(uc,WV1+11);x3,y3=W(uc,WV1)
        o+=f'<g transform="rotate(40)"><rect x="{WU[j]+1}" y="{WV1-24}" width="{31}" height="24" fill="url(#sunS)" transform="translate(0 0) rotate(180 {WU[j]+16.5} {WV1-12})"/></g>'.replace('rotate(180','rotate(0') if False else ''
        o+=pline([W(uc,WV1+11),W(uc,WV1-14)],'#E0A21B',1.4,'',mk='arrY')
    # artificial – downlights & corridor linear light
    def glow(x,y,r=9): return dot(x,y,r,'url(#glow)')
    for k in range(8):
        cx=(AX[k]+AX[k+1])/2
        o+=glow(cx,Y_UN+45,10)+dot(cx,Y_UN+45,1.1,'#E8A317')+dot(cx,Y_UN+62,1.0,'#E8A317')
        # night light path bed->bath
    for j in range(4):
        x,y=W(WU[j]+16.5,WV0+45); o+=glow(x,y,10)+dot(x,y,1.1,'#E8A317')
    for x in range(88,384,15): o+=glow(x,CY,7)+dot(x,CY,.9,'#E8A317')
    o+=pline([(78,CY),(388,CY)],'#E8A317',.6,'2 1.2',end=False)
    for u in range(580,736,15):
        x,y=W(u,44.8);o+=glow(x,y,7)+dot(x,y,.9,'#E8A317')
    hx,hy=(378,470); 
    for dx,dy in ((-12,-14),(8,-16),(-8,10),(14,4)): o+=glow(hx+dx,hy+dy,12)+dot(hx+dx,hy+dy,1.5,'#E8A317')
    # niches lights on north band
    for x in (115,225,262,285,368): o+=dot(x,395,1.0,'#E8A317')
    return o

def access(floor):
    T='#C4623F'
    o=''
    # continuous handrails along corridor
    o+=pline([(76.8,Y_CN+1.2),(386,Y_CN+1.2)],T,.9,'',end=False)+pline([(76.8,Y_CS-1.2),(386,Y_CS-1.2)],T,.9,'',end=False)
    o+=pline([W(566,38.7),W(738,38.7)],T,.9,'',end=False)+pline([W(566,51),W(738,51)],T,.9,'',end=False)
    # turning circles Ø1.8
    for x,y in ((86,CY),(378,428),(W(730,44.8))): o+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="9" fill="#fff" fill-opacity=".35" stroke="{T}" stroke-width=".6" stroke-dasharray="1.6 1.2"/>'
    # ramp at main entrance (1F)
    if floor==1:
        o+=f'<rect x="344" y="509" width="12" height="26" fill="#F2CBA0" stroke="{T}" stroke-width=".5" stroke-dasharray="1 .8"/>'
        for i in range(1,6): o+=f'<line x1="344" y1="{509+i*4.3:.1f}" x2="356" y2="{509+i*4.3:.1f}" stroke="{T}" stroke-width=".3"/>'
        o+=pline([(350,536),(350,512)],T,1.2,'',mk='arrT')
    # emergency call points
    for k in range(8):
        bx=AX[k]+9 if k%2==0 else AX[k+1]-9
        o+=dot(bx,Y_UN+16,1.4,'#D9412B','stroke="#fff" stroke-width=".4"')
        if floor==2: o+=dot(AX[k]+(30 if k%2==0 else 3),Y_UN+40,1.2,'#D9412B','stroke="#fff" stroke-width=".4"')
    for j in range(4):
        u=WU[j]+9 if j%2==0 else WU[j+1]-9; x,y=W(u,WV0+16); o+=dot(x,y,1.4,'#D9412B','stroke="#fff" stroke-width=".4"')
    return o

WAY=['#E39A78','#8FB39A','#8EB2C8','#EBC067','#C99FBF','#A9B98A']
def wayfinding(floor):
    o=''
    if floor==2:
        # door lintel colour tabs + wall memory boxes
        cols=[WAY[0],WAY[1],WAY[2],WAY[3],WAY[4],WAY[5],WAY[0],WAY[2]]
        for k in range(8):
            x=AX[k]+(24 if k%2==0 else 9)
            o+=f'<rect x="{x-6:.1f}" y="{Y_UN-1.2:.1f}" width="12" height="2.4" rx="1.1" fill="{cols[k]}" stroke="#fff" stroke-width=".3"/>'
            o+=f'<rect x="{x-3:.1f}" y="{Y_CS-8:.1f}" width="6" height="4.5" rx=".5" fill="{cols[k]}" fill-opacity=".9" stroke="#7B6350" stroke-width=".25"/>'
        for j in range(4):
            u=WU[j]+(24 if j%2==0 else 9);x,y=W(u,WV0)
            o+=f'<g transform="rotate(40 {x:.1f} {y:.1f})"><rect x="{x-6:.1f}" y="{y-1.2:.1f}" width="12" height="2.4" rx="1.1" fill="{cols[(j+4)%8]}" stroke="#fff" stroke-width=".3"/></g>'
            x,y=W(u,WV0-8);o+=f'<g transform="rotate(40 {x:.1f} {y:.1f})"><rect x="{x-3:.1f}" y="{y-2:.1f}" width="6" height="4.5" rx=".5" fill="{cols[(j+4)%8]}" fill-opacity=".9" stroke="#7B6350" stroke-width=".25"/></g>'
        # floor stripes in corridor as colour-coded guide line
        o+=pline([(80,CY),(384,CY)],'#E39A78',1.2,'0.1 2.6',end=False)+pline([W(566,44.8),W(736,44.8)],'#E39A78',1.2,'0.1 2.6',end=False)
    return o
