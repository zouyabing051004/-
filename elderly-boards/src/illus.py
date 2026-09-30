"""Flat vector illustrations (elevations / sections) — units: 1 = 1 cm, y measured UP from floor."""
import math
WALL='#F5ECDD'; WALL2='#EADCC4'; WOODF='#C89C6C'; WOODL='#DDBB8E'; WOODD='#A97B50'; SAGE='#B9CBA6'; SAGED='#8FAE86'
TERRA='#DE9B7A'; TERRAD='#C4623F'; CREAM='#FBF6EC'; GLASS='#D9EAF0'; INK='#7B6350'; SUN='#F6D98A'; BLUE='#B7CFDD'; GREY='#CFC8BC'
def _st(sw=.8): return f'stroke="{INK}" stroke-width="{sw}" stroke-linejoin="round"'
class E:
    def __init__(s,w,h): s.w=w;s.h=h;s.o=[]
    def add(s,x): s.o.append(x); return s
    def Y(s,y,h=0): return s.h-y-h
    def rect(s,x,y,w,h,fill,rx=0,sw=.8,stroke=True,op=1):
        st=_st(sw) if stroke else 'stroke="none"'
        return s.add(f'<rect x="{x:.1f}" y="{s.Y(y,h):.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" fill-opacity="{op}" {st}/>')
    def circ(s,cx,cy,r,fill,sw=.8,stroke=True,op=1):
        st=_st(sw) if stroke else 'stroke="none"'
        return s.add(f'<circle cx="{cx:.1f}" cy="{s.Y(cy):.1f}" r="{r:.1f}" fill="{fill}" fill-opacity="{op}" {st}/>')
    def ell(s,cx,cy,rx,ry,fill,sw=.8,stroke=True,op=1):
        st=_st(sw) if stroke else 'stroke="none"'
        return s.add(f'<ellipse cx="{cx:.1f}" cy="{s.Y(cy):.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{fill}" fill-opacity="{op}" {st}/>')
    def line(s,x1,y1,x2,y2,col=INK,sw=.8,dash='',op=1):
        return s.add(f'<line x1="{x1:.1f}" y1="{s.Y(y1):.1f}" x2="{x2:.1f}" y2="{s.Y(y2):.1f}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" '+(f'stroke-dasharray="{dash}" ' if dash else '')+f'opacity="{op}"/>')
    def path(s,d,fill='none',sw=.8,stroke=True,col=INK,op=1):
        # d uses y-up coords: pairs converted
        import re
        toks=re.findall(r'[MLCQZ]|-?\d+\.?\d*',d);out=[];i=0;nums=[]
        cmd=None;res=''
        while i<len(toks):
            t=toks[i]
            if t in 'MLCQZ': res+=t;i+=1;continue
            x=float(toks[i]);y=float(toks[i+1]);res+=f'{x:.1f} {s.Y(y):.1f} ';i+=2
        st=f'stroke="{col}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"' if stroke else 'stroke="none"'
        return s.add(f'<path d="{res}" fill="{fill}" fill-opacity="{op}" {st}/>')
    def text(s,x,y,t,size=10,col=INK,anchor='middle',w=500,fam='sans'):
        return s.add(f'<text x="{x:.1f}" y="{s.Y(y):.1f}" text-anchor="{anchor}" font-size="{size}" fill="{col}" font-weight="{w}" class="{fam}">{t}</text>')
    def dim(s,x1,x2,y,label,size=9):
        s.line(x1,y,x2,y,INK,.6);s.line(x1,y-3,x1,y+3,INK,.6);s.line(x2,y-3,x2,y+3,INK,.6)
        return s.text((x1+x2)/2,y+4,label,size,INK)
    def vdim(s,x,y1,y2,label,size=9,left=True):
        s.line(x,y1,x,y2,INK,.6);s.line(x-3,y1,x+3,y1,INK,.6);s.line(x-3,y2,x+3,y2,INK,.6)
        return s.add(f'<text x="{x+(-4 if left else 4):.1f}" y="{s.Y((y1+y2)/2):.1f}" text-anchor="{"end" if left else "start"}" font-size="{size}" fill="{INK}" class="sans">{label}</text>')
    def svg(s,width='100%',cls=''):
        return f'<svg xmlns="http://www.w3.org/2000/svg" class="ill {cls}" viewBox="0 0 {s.w} {s.h}" width="{width}" style="display:block">'+''.join(s.o)+'</svg>'

# ---------------------------------------------------------------- shared props
def wall_floor(e,x0,x1,floor_h=8,dado=90,dado_col=WALL2,ceil=None):
    e.rect(x0,0,x1-x0,e.h,WALL,0,.0,False)
    e.rect(x0,floor_h,x1-x0,dado-floor_h,dado_col,0,.0,False)
    e.line(x0,dado,x1,dado,INK,.5,op=.6)
    e.rect(x0,0,x1-x0,floor_h,WOODF,0,.8)
    for xx in range(int(x0),int(x1),40): e.line(xx,0,xx,floor_h,INK,.3,op=.5)
    e.rect(x0,e.h-10,x1-x0,10,CREAM,0,.6)      # ceiling cove
def plant(e,x,y=8,s=1.0,pot=TERRA):
    e.rect(x-9*s,y,18*s,20*s,pot,3*s)
    for a,l in ((-30,42),(0,55),(30,42),(-58,30),(58,30),(15,48),(-15,48)):
        r=math.radians(a);e.path(f'M{x} {y+20*s} Q{x+math.sin(r)*l*.6*s} {y+20*s+math.cos(r)*l*.7*s} {x+math.sin(r)*l*s} {y+20*s+math.cos(r)*l*s}',SAGED if a%2 else '#7FA672',1.2,True,'#5E8C55')
    return e
def leaf_pot(e,x,y=8,s=1.0):
    e.rect(x-10*s,y,20*s,22*s,'#D9C7AE',4*s)
    for a,l in ((-40,48),(-15,62),(10,70),(35,55),(55,36),(-62,32)):
        r=math.radians(a);ex=x+math.sin(r)*l*s;ey=y+22*s+math.cos(r)*l*s
        e.ell(ex,ey,9*s,16*s,SAGED if a>0 else '#7FA672',.6)
    return e
def window(e,x,y,w,h,curtain=True,sun=True):
    e.rect(x-4,y-4,w+8,h+8,CREAM,2,.9)
    e.rect(x,y,w,h,GLASS,0,.8)
    e.line(x+w/2,y,x+w/2,y+h,INK,.8)
    if sun:
        e.path(f'M{x} {y+h} L{x+w*.5} {y+h*.15} L{x+w*.8} {y+h*.15} L{x+w*.3} {y}Z',SUN,0,False,op=.25)
    e.line(x-4,y-4,x+w+4,y-4,WOODD,3)
    if curtain:
        for cx,cw in ((x-14,26),(x+w-12,26)):
            e.rect(cx,y-8,cw,h+22,'#EAD3BC',3,.6)
            for k in range(1,4): e.line(cx+cw*k/4,y-6,cx+cw*k/4,y+h+12,INK,.3,op=.5)
        e.line(x-24,y+h+16,x+w+24,y+h+16,WOODD,2.5)
def handrail(e,x0,x1,y=85,col=WOODD):
    e.rect(x0,y-2.5,x1-x0,5,col,2.5,.6)
    for xx in range(int(x0)+15,int(x1),80): e.rect(xx-1.2,y-9,2.4,7,GREY,0,.4)
def footlight(e,x0,x1,y=22):
    e.rect(x0,y,x1-x0,3,SUN,1.5,.5);e.rect(x0,y-4,x1-x0,11,SUN,5,0,False,.35)
def lamp_floor(e,x,y=8,h=150):
    e.line(x,y,x,y+h,INK,1.6);e.ell(x,y+1,11,2.5,GREY,.6)
    e.path(f'M{x-13} {y+h-14} L{x+13} {y+h-14} L{x+9} {y+h+6} L{x-9} {y+h+6}Z',SUN,.8)
def pendant(e,x,top,drop,r=16,col=CREAM):
    e.line(x,top,x,top-drop+r*.6,INK,.5)
    e.path(f'M{x-r} {top-drop} Q{x} {top-drop+r*1.4} {x+r} {top-drop}Z',col,.8)
    e.ell(x,top-drop-r*.4,r*.8,r*.3,SUN,0,False,.55)
def figure(e,x,y=8,h=150,body=TERRA,hair='#CFCBC4',cane=True,face=True):
    hh=h*.14
    e.rect(x-h*.11,y+h*.42,h*.22,h*.36,body,h*.06,.8)              # torso
    e.rect(x-h*.085,y,h*.07,h*.44,'#8C7B6C',2,.6);e.rect(x+h*.015,y,h*.07,h*.44,'#8C7B6C',2,.6)   # legs
    e.circ(x,y+h*.86,hh*.62,'#F1D5B8',.8)
    e.path(f'M{x-hh*.62} {y+h*.88} Q{x} {y+h*1.0} {x+hh*.62} {y+h*.88} Q{x} {y+h*.93} {x-hh*.62} {y+h*.88}Z',hair,.6)
    if cane: e.line(x+h*.2,y,x+h*.17,y+h*.5,WOODD,1.6)
    return e
def wheelchair(e,x,y=8,s=1.0,body=SAGE):
    e.circ(x,y+30*s,30*s,'none',1.8);e.circ(x,y+30*s,3,INK,0)
    e.rect(x-24*s,y+52*s,52*s,8*s,body,3,.7);e.rect(x-26*s,y+52*s,7*s,52*s,body,3,.7)
    e.circ(x+30*s,y+11*s,11*s,'none',1.4)
    e.rect(x-14*s,y+60*s,26*s,30*s,TERRA,6,.7)
    e.circ(x-2*s,y+112*s,10*s,'#F1D5B8',.7)
    e.rect(x-14*s,y+86*s,26*s,32*s,'#E9C9A9',6,.7)
    return e
