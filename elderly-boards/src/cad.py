"""Extract CAD vector linework from the two floor-plan PDFs into SVG path data
   in *render* coordinates (pt, page rotated upright, 1 pt = 0.1 m at building scale)."""
import pymupdf, glob, os, math
UP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','input')
FS=sorted(glob.glob(os.path.join(UP,'floor*.pdf')))   # [0]=1F  [1]=2F

def _f(v): return f"{v:.2f}".rstrip('0').rstrip('.')

def extract(i):
    p=pymupdf.open(FS[i])[0]; M=p.rotation_matrix
    stroke=[];fill=[]
    for d in p.get_drawings():
        segs=[]
        if len(d['items'])==1 and d['items'][0][0]=='l':      # drop grid dash-dot pieces and stray leaders
            a=d['items'][0][1]*M;b=d['items'][0][2]*M
            L=math.hypot(b.x-a.x,b.y-a.y)
            if 10.4<L<10.7 or 2.1<L<2.3: continue
            if L>14:
                t=math.degrees(math.atan2(b.y-a.y,b.x-a.x))%180
                if min(abs(t-x) for x in (0,90,40,130,180))>0.8: continue
        if len(d['items'])>1 and all(it[0]=='l' for it in d['items']) and d.get('fill') is None:   # polyline leaders
            bad=False
            for it in d['items']:
                a=it[1]*M;b=it[2]*M;L=math.hypot(b.x-a.x,b.y-a.y)
                if L>14:
                    t=math.degrees(math.atan2(b.y-a.y,b.x-a.x))%180
                    if min(abs(t-x) for x in (0,90,40,130,180))>0.8: bad=True
            if bad: continue
        for it in d['items']:
            if it[0]=='l':
                a=it[1]*M;b=it[2]*M
                segs.append(f"M{_f(a.x)} {_f(a.y)}L{_f(b.x)} {_f(b.y)}")
            elif it[0]=='c':
                q=[z*M for z in it[1:5]]
                segs.append(f"M{_f(q[0].x)} {_f(q[0].y)}C{_f(q[1].x)} {_f(q[1].y)} {_f(q[2].x)} {_f(q[2].y)} {_f(q[3].x)} {_f(q[3].y)}")
            elif it[0]=='qu':
                q=it[1]; z=[q.ul*M,q.ur*M,q.lr*M,q.ll*M]
                segs.append("M"+"L".join(f"{_f(t.x)} {_f(t.y)}" for t in z)+"Z")
            elif it[0]=='re':
                r=it[1]; z=[pymupdf.Point(r.x0,r.y0)*M,pymupdf.Point(r.x1,r.y0)*M,pymupdf.Point(r.x1,r.y1)*M,pymupdf.Point(r.x0,r.y1)*M]
                segs.append("M"+"L".join(f"{_f(t.x)} {_f(t.y)}" for t in z)+"Z")
        if not segs: continue
        s=''.join(segs)
        if d['type'] in ('f','fs') and d.get('fill') is not None: fill.append(s)
        if d['type'] in ('s','fs'): stroke.append(s)
    return ''.join(stroke),''.join(fill)

if __name__=='__main__':
    os.makedirs('tmp',exist_ok=True)
    for i in (0,1):
        s,f=extract(i)
        open(f'tmp/cad{i+1}_stroke.txt','w').write(s); open(f'tmp/cad{i+1}_fill.txt','w').write(f)
        print(i,len(s),len(f))
