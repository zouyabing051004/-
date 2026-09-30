"""Geometric + programme model of 3# building (all coordinates: 1F page-pt, 1 pt = 0.1 m).
   2F CAD is shifted by (SHIFT2) so both floors share one coordinate system."""
import math
SHIFT2=(6.4,39.1)
C40,S40=math.cos(math.radians(40)),math.sin(math.radians(40))
def W(u,v):            # wing local (u,v) -> page (x,y)
    return (u*C40-v*S40, u*S40+v*C40)
def Wp(pts): return [W(*p) for p in pts]
AX=[76.3+33.05*k for k in range(9)]      # axes 1,3,5,6,8,10,13,15,16
AXN=['1','3','5','6','8','10','13','15','16']
Y_CN, Y_CS = 416.0, 434.0                # corridor north / south wall
Y_UN, Y_US = 434.0, 508.6                # unit north / south
Y_BATH = 462.6                           # bath south edge
Y_TOP, Y_TS = 374.0, 415.5               # north band top / bottom
def R(x0,y0,x1,y1): return [(x0,y0),(x1,y0),(x1,y1),(x0,y1)]
def WR(u0,v0,u1,v1): return Wp(R(u0,v0,u1,v1))
def unit_rect(k): return R(AX[k]+.5,Y_UN+.5,AX[k+1]-.5,Y_US-.5)
def bath_rect(k):
    if k%2==0: return R(AX[k]+.6,Y_UN+.6,AX[k]+17,Y_BATH)
    return R(AX[k+1]-17,Y_UN+.6,AX[k+1]-.6,Y_BATH)
def entry_rect(k):
    if k%2==0: return R(AX[k]+17,Y_UN+.6,AX[k+1]-.6,Y_BATH)
    return R(AX[k]+.6,Y_UN+.6,AX[k+1]-17,Y_BATH)
def room_rect(k): return R(AX[k]+.6,Y_BATH,AX[k+1]-.6,Y_US-.5)
# wing units A..D
WU=[606,639,672,705,738]; WV0,WV1,WVB,WVE=52.5,127.3,82.0,34
def wunit(j): return WR(WU[j]+.5,WV0+.5,WU[j+1]-.5,WV1-.5)
def wbath(j):
    if j%2==0: return WR(WU[j]+.6,WV0+.6,WU[j]+17,WVB)
    return WR(WU[j+1]-17,WV0+.6,WU[j+1]-.6,WVB)
def wentry(j):
    if j%2==0: return WR(WU[j]+17,WV0+.6,WU[j+1]-.6,WVB)
    return WR(WU[j]+.6,WV0+.6,WU[j+1]-17,WVB)
def wroom(j): return WR(WU[j]+.6,WVB,WU[j+1]-.6,WV1-.5)
