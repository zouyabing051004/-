"""Top-view furniture symbols. All dimensions in METRES, origin = centre. Return SVG snippets.
   Wrap with place() to put them on a plan whose unit is 1pt = 0.1 m."""
K='#7B6350'       # outline
SW=0.028          # stroke width (m)
WOOD='#E4C9A0'; WOOD2='#C99B68'; LINEN='#FBF6EC'; SAGE='#B9CBA6'; SAGE2='#8FAE86'; TERRA='#DE9B7A'
CREAM='#F3E6CE'; BLUE='#B7CFDD'; GREY='#D9D3CA'; YEL='#F6D98A'; WHITE='#FFFDF8'; GREEN='#7FA672'
def _s(fill,extra=''): return f'fill="{fill}" stroke="{K}" stroke-width="{SW}" stroke-linejoin="round" {extra}'
def rect(x,y,w,h,fill=WOOD,rx=0.03,extra=''):
    return f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" rx="{rx}" {_s(fill,extra)}/>'
def crect(w,h,fill=WOOD,rx=0.03,extra=''): return rect(-w/2,-h/2,w,h,fill,rx,extra)
def circ(cx,cy,r,fill=WOOD,extra=''): return f'<circle cx="{cx:.3f}" cy="{cy:.3f}" r="{r:.3f}" {_s(fill,extra)}/>'
def line(x1,y1,x2,y2,col=K,w=SW,extra=''): return f'<line x1="{x1:.3f}" y1="{y1:.3f}" x2="{x2:.3f}" y2="{y2:.3f}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" {extra}/>'
def ell(cx,cy,rx,ry,fill=WOOD,extra=''): return f'<ellipse cx="{cx:.3f}" cy="{cy:.3f}" rx="{rx:.3f}" ry="{ry:.3f}" {_s(fill,extra)}/>'

def bed(w=1.0,l=2.0,blanket=SAGE,rail=True):
    o=crect(w,l,LINEN,0.06)
    o+=rect(-w/2+0.04,-l/2+0.42,w-0.08,l-0.46,blanket,0.05)
    o+=rect(-w/2+0.1,-l/2+0.06,w-0.2,0.32,WHITE,0.08)
    o+=line(-w/2+0.04,-l/2+0.42,w/2-0.04,-l/2+0.42,K,0.02)
    if rail:
        o+=line(-w/2-0.03,-l/2+0.5,-w/2-0.03,l/2-0.35,'#9A9188',0.035)
        o+=line(w/2+0.03,-l/2+0.5,w/2+0.03,l/2-0.35,'#9A9188',0.035)
    return o
def therapy_bed(w=.75,l=1.95): return crect(w,l,BLUE,0.05)+rect(-w/2+.08,-l/2+.05,w-.16,.3,WHITE,.08)+line(-w/2,l/2-.6,w/2,l/2-.6,K,.02)
def night(w=.42,d=.42): return crect(w,d,WOOD,.03)+circ(0,0,min(w,d)*.18,YEL)
def wardrobe(w=1.3,d=.55): return crect(w,d,WOOD2,.02)+line(0,-d/2,0,d/2,K,.02)+line(-w/2+.05,d/2-.08,w/2-.05,d/2-.08,LINEN,.03)
def cabinet(w=1.2,d=.4,fill=WOOD): return crect(w,d,fill,.02)+''.join(line(-w/2+w*i/3,-d/2,-w/2+w*i/3,d/2,K,.015) for i in (1,2))
def tv(w=1.0): return crect(w,.06,'#5B5750',.01)
def armchair(w=.8,d=.8,fill=TERRA):
    return crect(w,d,fill,.1)+rect(-w/2,-d/2,w,.2,darker(fill),.08)+rect(-w/2,-d/2+.1,.16,d-.1,darker(fill),.06)+rect(w/2-.16,-d/2+.1,.16,d-.1,darker(fill),.06)+crect(w-.36,d-.34,fill,.06).replace('<rect','<rect transform="translate(0 .1)"')
def darker(c):
    c=c.lstrip('#');r,g,b=[int(c[i:i+2],16) for i in (0,2,4)]
    return '#%02x%02x%02x'%(int(r*.86),int(g*.86),int(b*.86))
def sofa(w=2.0,d=.9,fill=SAGE):
    o=crect(w,d,fill,.1)+rect(-w/2,-d/2,w,.24,darker(fill),.08)
    o+=rect(-w/2,-d/2+.12,.2,d-.12,darker(fill),.06)+rect(w/2-.2,-d/2+.12,.2,d-.12,darker(fill),.06)
    n=max(2,round(w/.7))
    for i in range(n): o+=rect(-w/2+.2+(w-.4)*i/n+.02,-d/2+.28,(w-.4)/n-.04,d-.4,fill,.05)
    return o
def sofaL(w=2.6,d=.9,arm=1.6,fill=SAGE):
    return sofa(w,d,fill)+f'<g transform="translate({w/2-d/2:.2f} {d/2+arm/2-.02:.2f})">'+crect(d,arm,fill,.08)+'</g>'
def table_round(d=1.0,fill=WOOD): return circ(0,0,d/2,fill)+circ(0,0,d/2-.08,fill,'fill-opacity=".6"')
def table_rect(w=1.2,d=.8,fill=WOOD): return crect(w,d,fill,.04)
def chair(w=.44,fill=WOOD2,back=True):
    o=crect(w,w,fill,.06)
    if back: o+=rect(-w/2,-w/2-.02,w,.1,darker(fill),.04)
    return o
def stool(r=.19,fill=TERRA): return circ(0,0,r,fill)
def plant(r=.32,fill=GREEN):
    o=circ(0,0,r,fill)+circ(-r*.35,-r*.25,r*.5,SAGE2)+circ(r*.3,r*.2,r*.55,'#9DBC8E')+circ(0,-r*.05,r*.22,'#5E8C55')
    return o
def pot(r=.2): return circ(0,0,r,'#C9A07A')+plant(r*.9)
def lamp(r=.18): return circ(0,0,r,YEL)+circ(0,0,r*.4,WHITE)
def rug(w,d,fill='#EFD9B6'): return crect(w,d,fill,.12,'stroke-dasharray=".08 .05"')
def wheel(d=1.5,col='#C4623F'): return f'<circle cx="0" cy="0" r="{d/2}" fill="none" stroke="{col}" stroke-width="0.035" stroke-dasharray=".12 .08" opacity=".85"/>'
def toilet(): return rect(-.2,-.36,.4,.16,WHITE,.03)+ell(0,-.04,.19,.26,WHITE)+ell(0,-.04,.11,.16,'#EAF1F3')
def sink(w=.55,d=.45): return crect(w,d,WHITE,.05)+ell(0,.02,w*.32,d*.32,'#EAF1F3')+circ(0,-d*.3,.025,K)
def shower_seat(w=.5,d=.45): return crect(w,d,WOOD,.03)+''.join(line(-w/2+.05,-d/2+.08+i*.09,w/2-.05,-d/2+.08+i*.09,K,.012) for i in range(4))
def drain(): return circ(0,0,.07,'#E8EEF0')+line(-.05,0,.05,0,K,.012)+line(0,-.05,0,.05,K,.012)
def grab(l=.6,col='#C4623F'): return line(-l/2,0,l/2,0,col,.06)
def counter(w=2,d=.6,fill=WOOD2): return crect(w,d,fill,.03)
def pbars(l=3.0,w=.75):
    return line(-l/2,-w/2,l/2,-w/2,'#8A7F73',.06)+line(-l/2,w/2,l/2,w/2,'#8A7F73',.06)+''.join(rect(x-.03,-w/2-.03,.06,w+.06,'#8A7F73',.01) for x in (-l/2+.05,l/2-.05))
def bike(): return crect(.5,1.0,GREY,.08)+circ(0,-.15,.16,'#FFF')+crect(.3,.25,'#7A6E62',.04).replace('<rect','<rect transform="translate(0 .32)"')
def step_train(w=1.6,d=1.0):
    o=''
    for i in range(4): o+=rect(-w/2,-d/2+i*d/4,w,d/4,['#E9DCC5','#DFCFB3','#D4C3A2','#C9B791'][i],.01)
    return o
def mirror(w=2.4): return crect(w,.05,'#CFE3EA',.01)
def bookshelf(w=1.6,d=.35): return crect(w,d,WOOD2,.02)+''.join(line(-w/2+w*i/5,-d/2,-w/2+w*i/5,d/2,K,.012) for i in range(1,5))
def kitchen(w=2.4,d=.65):
    o=crect(w,d,GREY,.02)
    for i in range(3): o+=circ(-w/2+.4+i*.35,0,.11,'#FFF')
    o+=ell(w/2-.55,0,.32,.22,'#EAF1F3')
    return o
def hotbox(w=.9,d=.7): return crect(w,d,'#C9C1B6',.03)+line(0,-d/2,0,d/2,K,.015)
def reception(w=3.0,d=.7): 
    return f'<path d="M{-w/2:.2f} {-d/2:.2f} H{w/2:.2f} V{d/2:.2f} H{-w/2+.9:.2f} V{d*.1:.2f} H{-w/2:.2f}Z" {_s(WOOD2)}/>'+rect(-w/2+.4,-d/2+.1,.5,.02,YEL,.01)
def massage(w=.7,l=1.9): return crect(w,l,'#E9C7B3',.06)+ell(0,-l/2+.18,.11,.07,'#FFF')
def art_table(w=2.4,d=.9): return crect(w,d,WOOD,.03)+''.join(circ(-w/2+.3+i*(w-.6)/3,-d/2-.28,.16,TERRA) for i in range(4))+''.join(circ(-w/2+.3+i*(w-.6)/3,d/2+.28,.16,TERRA) for i in range(4))
def mah(d=.85):  # square game table with 4 chairs
    return crect(d,d,'#C7D6B8',.03)+''.join(f'<g transform="rotate({a}) translate(0 {-d/2-.26})">'+chair(.4,TERRA)+'</g>' for a in (0,90,180,270))
def dining4(w=1.4,d=.8,nl=2):
    o=table_rect(w,d)
    for i in range(nl):
        x=-w/2+w*(i+.5)/nl
        o+=f'<g transform="translate({x:.2f} {-d/2-.27:.2f})">'+chair()+'</g>'
        o+=f'<g transform="translate({x:.2f} {d/2+.27:.2f}) rotate(180)">'+chair()+'</g>'
    return o
def dining_round(d=1.5,n=6,fill=WOOD):
    o=table_round(d,fill)
    for i in range(n): o+=f'<g transform="rotate({i*360/n}) translate(0 {-d/2-.27:.2f})">'+chair(.42)+'</g>'
    return o
def sym(name,*a,**k): return globals()[name](*a,**k)
def place(svg,x,y,rot=0,sx=1,sy=1):
    """place symbol (metres) at page pt (x,y)"""
    t=f'translate({x:.2f} {y:.2f})'
    if rot: t+=f' rotate({rot})'
    t+=f' scale({10*sx:.3f} {10*sy:.3f})'
    return f'<g transform="{t}">{svg}</g>'
