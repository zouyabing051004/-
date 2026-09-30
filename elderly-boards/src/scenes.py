from illus import *

def bed_side(e,x,w=200,blanket=SAGE,headboard='left'):
    e.rect(x+4,10,8,20,WOODD,2,.6);e.rect(x+w-12,10,8,20,WOODD,2,.6)
    e.rect(x,26,w,26,WOODL,4,.9)                          # frame
    e.rect(x+2,52,w-4,13,'#FBF6EC',6,.9)                  # mattress
    e.rect(x+w*.28,58,w*.72-2,10,blanket,5,.8)            # blanket
    e.ell(x+w*.13,72,w*.1,7,'#FFFDF8',.8)                 # pillow
    e.rect(x-4,26,8,88,WOODD,3,.9)                        # headboard
    return e

def scene_bedroom_side():
    e=E(460,242);wall_floor(e,0,460)
    footlight(e,0,460,20)
    handrail(e,0,460,85)
    e.rect(120,135,110,62,'#EFE1CB',3,.9);e.path('M132 150 Q155 190 178 160 T222 172 L222 145 L132 145Z',TERRA,0,False,op=.55);e.circ(190,178,14,'#F3CE7B',0,False,.9)   # art
    # sconces
    for sx in (108,):
        e.rect(sx-4,108,8,4,GREY,1,.5);e.path(f'M{sx-8} 110 Q{sx} 132 {sx+8} 110Z',SUN,.7)
    e.ell(108,105,22,10,SUN,0,False,.35)
    e.rect(28,8,52,50,WOODD,3,.9);e.rect(32,32,44,2,INK,0,.4,False);e.rect(48,16,12,3,SUN,1,.4)   # night table
    e.circ(52,60,0,'none',0,False);e.rect(44,58,16,4,GREY,2,.5);e.path('M52 62 Q46 84 52 92 Q58 84 52 62Z',SUN,.6)
    bed_side(e,86,200,'#B9CBA6')
    e.rect(340,8,86,44,WOODL,3,.9);e.line(383,8,383,52,INK,.5);e.rect(342,110,84,50,'#4A4540',3,.9);e.rect(346,114,76,42,'#6E6A63',2,0,False)
    e.rect(360,52,50,6,GREY,2,.6)
    leaf_pot(e,445,8,.9)
    e.rect(2,8,16,200,'#E7D3B3',0,.8);                     # door frame hint
    e.dim(86,286,214,'2000 护理床');e.vdim(300,8,85,'850',8,False);e.text(383,168,'壁挂电视',8,INK)
    e.text(40,214,'呼叫器',8,TERRAD);e.circ(44,196,4,'#D9412B',.5);e.line(44,196,44,112,'#D9412B',.6,'2 2')
    e.text(230,16,'夜灯 0.25m',8,'#B98618')
    return e.svg()

def scene_bedroom_window():
    e=E(330,280);wall_floor(e,0,330)
    handrail(e,0,60,85);handrail(e,270,330,85)
    window(e,55,60,170,155)
    e.rect(232,60,60,120,WOODL,2,.9)                       # AC louvre cover
    for yy in range(66,178,9): e.line(234,yy,290,yy,INK,.4,op=.6)
    e.text(262,50,'空调格栅',8,INK)
    # armchair + side table
    e.rect(90,8,92,36,TERRA,10,.9);e.rect(84,8,14,58,'#C4623F',7,.9);e.rect(174,8,14,58,'#C4623F',7,.9);e.rect(90,40,92,66,'#E5A98B',10,.9);e.rect(104,44,64,18,'#F2C2A5',7,.6)
    e.rect(200,8,4,44,WOODD,1,.5);e.ell(202,52,22,5,WOODL,.8);e.rect(192,54,18,14,'#F3E6CE',2,.6)
    lamp_floor(e,30,8,140);leaf_pot(e,300,8,.8)
    e.line(70,60,210,60,INK,.8);e.text(140,236,'低窗台 0.6m · 坐姿即可观景',8,INK)
    e.vdim(48,8,60,'600',8);e.dim(55,225,232+22,'1700 · 落地帘 + 纱帘双层')
    return e.svg()

def scene_bath():
    e=E(200,270);
    e.rect(0,0,200,270,'#EDF2EF',0,0,False);e.rect(0,0,200,90,'#DDE7E2',0,0,False)
    e.rect(0,0,200,8,'#C7BFB2',0,.8)
    for xx in range(0,200,14): e.line(xx,0,xx,8,INK,.3,op=.5)
    for yy in range(8,90,14): e.line(0,yy,200,yy,'#C9D6CF',.4)
    e.rect(0,250,200,20,CREAM,0,.6)
    # toilet
    e.rect(24,45,44,44,'#FFFFFF',5,.9);e.rect(20,8,52,42,'#FFFFFF',14,.9);e.rect(26,40,40,6,'#E4EEF0',3,.5)
    e.path('M14 88 L14 108 L14 108',col=TERRAD,sw=2)
    e.rect(8,80,7,2,TERRAD,1,.4,False)
    e.rect(10,76,4,4,GREY,1,.4);e.line(12,78,12,130,TERRAD,3.4);e.line(12,78,12,78,TERRAD,3.4);e.line(12,78,-2,78,TERRAD,3.4)
    e.line(76,72,76,118,TERRAD,3.4);e.line(76,72,76,72,TERRAD,3.4)
    e.line(76,118,76,150,TERRAD,3.4);e.rect(72,150,8,3,GREY,1,.4)
    # sink + mirror
    e.rect(100,72,58,8,'#FFFFFF',3,.9);e.rect(112,8,34,64,'#E9E4DA',3,.7);e.rect(96,140,66,68,'#DCE9EE',3,.8);e.rect(100,144,58,60,'#EFF6F8',2,.5,False);e.path('M110 190 L130 160 L150 160 L130 190Z','#FFFFFF',0,False,op=.5)
    e.rect(100,205,58,6,SUN,3,.5);e.rect(100,201,58,14,SUN,3,0,False,.35)
    # shower seat + head
    e.rect(166,42,30,6,WOODL,2,.8);e.line(168,42,196,42,INK,.5);e.line(170,42,170,20,INK,.8);e.line(192,42,192,20,INK,.8)
    e.line(190,80,190,200,'#9AA8AD',3);e.rect(180,196,18,10,'#9AA8AD',4,.6);
    e.line(178,90,178,138,TERRAD,3.4)
    # emergency cord
    e.line(60,240,60,42,'#D9412B',1,'3 2');e.circ(60,40,4,'#D9412B',.6);e.text(60,20,'拉绳呼叫',8,'#D9412B')
    e.vdim(4,8,80,'',8)
    e.text(44,112,'L形扶手',8,TERRAD);e.text(128,232,'防眩镜面灯',8,INK);e.text(180,58,'折叠座椅',8,INK)
    e.text(100,254,'防滑地砖 · 无门槛 · 推拉门',8,INK)
    return e.svg()

def figure_at(e,x,kind,**k):
    return figure(e,x,**k)

def scene_living():
    e=E(800,252);wall_floor(e,0,800)
    for x in (60,300,540): window(e,x,58,150,170,True,True)
    e.rect(0,e.h-38,800,4,WOODD,0,.6)
    # beams
    for x in range(0,800,160): e.rect(x,e.h-10,6,10,WOODD,0,.4,False)
    for x in (120,260,540,680): pendant(e,x,e.h-10,30 if x<400 else 34,15,CREAM)
    # sofa group
    e.rect(80,8,240,38,SAGE,12,.9);e.rect(74,8,22,78,SAGED,9,.9);e.rect(304,8,22,78,SAGED,9,.9);e.rect(96,42,208,54,'#C7D6B5',12,.9)
    for i in range(3): e.rect(100+i*68,46,64,40,SAGE,8,.6)
    e.rect(120,60,32,26,TERRA,6,.6);e.rect(250,60,32,26,'#E9C36F',6,.6)
    e.rect(140,8,120,5,WOODD,1,.6);e.ell(200,30,52,10,WOODL,.9);e.rect(196,8,8,22,WOODD,1,.6)
    e.ell(200,44,14,4,'#FFFFFF',.5)
    # armchair
    e.rect(345,8,68,32,TERRA,9,.9);e.rect(340,8,12,54,TERRAD,6,.9);e.rect(406,8,12,54,TERRAD,6,.9);e.rect(352,36,54,52,'#E5A98B',9,.9)
    # bookshelf
    e.rect(440,8,90,170,WOODL,3,.9)
    for yy in (52,96,140): e.line(440,yy,530,yy,INK,.7)
    for i,(c,h) in enumerate([(TERRA,30),(SAGE,34),('#F3CE7B',28),(BLUE,32),(TERRA,26),(SAGE,30)]):
        e.rect(446+i*13,52,10,h,c,1,.4)
    for i,(c,h) in enumerate([('#F3CE7B',30),(BLUE,26),(SAGE,34),(TERRA,28)]): e.rect(450+i*16,96,12,h,c,1,.4)
    e.rect(462,140,26,26,'#EFE1CB',2,.6);e.ell(500,152,10,12,SAGED,.5)
    # dining tables front
    for tx in (610,740):
        e.rect(tx-3,8,6,66,WOODD,1,.6);e.ell(tx,76,52,7,WOODL,.9);e.rect(tx-40,76,80,2,'#F3E6CE',0,0,False)
        e.rect(tx-42,8,24,32,WOODL,7,.7);e.rect(tx+18,8,24,32,WOODL,7,.7)
    e.rect(590,78,16,5,'#fff',2,.5);e.ell(740,82,10,2,'#fff',.4)
    figure(e,575,8,128,TERRA,'#CFCBC4',True);figure(e,650,8,124,BLUE,'#F0EDE7',False);figure(e,715,8,126,'#E9C36F','#B8B3AB',True)
    wheelchair(e,340,8,.95,SAGE)
    plant(e,20,8,1.4);plant(e,790,8,1.2)
    
    return e.svg()

def scene_lobby():
    e=E(800,264);wall_floor(e,0,800)
    # slat wall
    e.rect(230,8,330,240,WOODL,0,.8)
    for x in range(232,560,12): e.line(x,8,x,248,INK,.35,op=.55)
    e.rect(300,150,190,60,CREAM,4,.9)
    e.circ(330,180,18,'#F3CE7B',.8)
    for a in range(0,360,45):
        r=math.radians(a);e.line(330+math.cos(r)*22,180+math.sin(r)*22,330+math.cos(r)*30,180+math.sin(r)*30,'#E0A21B',1.4)
    e.text(420,178,'暖阳颐养之家',22,INK,'middle',700,'serif');e.text(420,158,'WARM SUN · CARE HOME',8,'#8E7A66','middle',500)
    # reception desk
    e.rect(285,8,230,72,WOODD,4,.9);e.rect(285,80,150,8,WOODL,3,.9);e.rect(435,80,80,8,'#F3E6CE',3,.9)
    e.rect(435,64,80,4,SUN,0,0,False,.5)
    e.rect(300,88,44,26,'#4A4540',3,.8);e.rect(305,92,34,18,'#8FB6C9',1,0,False)
    figure(e,470,8,150,'#8FB39A','#5B4A3B',False)
    # pendants
    for x in (300,400,500): pendant(e,x,e.h-4,36,17,CREAM)
    # entrance door
    e.rect(600,8,170,226,GLASS,3,.9)
    for x in (685,):e.line(x,8,x,234,INK,1)
    e.path('M600 8 L770 8 L770 130 L600 40Z','#FFFFFF',0,False,op=.25)
    e.rect(600,232,170,8,WOODD,0,.8)
    e.rect(560,0,40,8,'#E3D5BC',0,.6);
    figure(e,650,8,140,TERRA,'#CFCBC4',True);wheelchair(e,730,8,.9,BLUE)
    # bench + plants
    e.rect(40,8,160,30,TERRA,9,.9);e.rect(44,38,152,46,'#E5A98B',9,.9);e.rect(56,10,6,0,INK,0)
    for i in range(3): e.rect(52+i*46,40,42,38,'#F1C0A2',7,.5)
    e.rect(48,8,4,10,WOODD,1,.5);e.rect(188,8,4,10,WOODD,1,.5)
    plant(e,210,8,1.7,'#D9C7AE');plant(e,585,8,1.3);handrail(e,0,230,85);
    lamp_floor(e,20,8,150)
    e.text(120,112,'等候 · 茶座',9,INK);e.text(400,226,'',9)
    e.dim(285,515,236,'低位接待台 · 轮椅可近',8)
    return e.svg()

def scene_rehab():
    e=E(660,252);wall_floor(e,0,660,dado=90)
    # mirror
    e.rect(40,90,320,140,'#DCEBF0',3,.9)
    e.path('M60 220 L130 100 L150 100 L80 220Z','#FFFFFF',0,False,op=.55);e.path('M200 220 L250 100 L262 100 L212 220Z','#FFFFFF',0,False,op=.4)
    e.line(40,90,360,90,WOODD,3)
    # parallel bars
    for x in (70,340): e.rect(x-3,8,6,86,'#9A9188',1,.6)
    e.rect(64,88,282,6,'#B9925F',3,.8);e.rect(64,60,282,4,'#B9925F',2,.6)
    figure(e,160,8,150,'#E9C36F','#CFCBC4',False);figure(e,230,8,160,BLUE,'#6B5B4D',False,)
    # wall bars
    e.rect(430,8,86,220,WOODL,2,.9)
    for yy in range(22,225,14): e.rect(432,yy,82,4,WOODD,2,.5)
    figure(e,472,20,120,TERRA,'#CFCBC4',False)
    # therapy bed
    e.rect(548,8,8,40,GREY,2,.6);e.rect(620,8,8,40,GREY,2,.6);e.rect(540,44,96,16,BLUE,6,.9);e.rect(544,60,88,7,'#fff',3,.6)
    plant(e,655,8,1.2)
    for x in (120,300,500): pendant(e,x,e.h-10,26,14,CREAM)
    handrail(e,370,430,85)
    e.text(205,240,'落地镜 · 步态观察',9,INK);e.text(475,240,'肋木 · 平衡训练',9,INK);e.text(588,96,'PT 训练床',9,INK)
    e.vdim(60,8,90,'900',8)
    return e.svg()

def scene_canteen():
    e=E(660,254);wall_floor(e,0,660,dado=90)
    # serving counter
    e.rect(30,8,240,88,WOODD,4,.9);e.rect(30,96,240,7,WOODL,3,.9)
    e.path('M40 103 L40 148 L260 148 L260 103',GLASS,.9,True,op=.55)
    for x in (70,130,190):
        e.rect(x,103,46,22,'#C9C1B6',3,.8);e.ell(x+23,128,19,7,'#DAD3C8',.7);e.ell(x+23,131,13,4,'#F6D98A',.4,True,.9)
    e.rect(50,190,200,42,'#4A4540',4,.9);e.text(150,206,'今日食谱',12,'#F3E6CE','middle',700);e.text(150,190,'软烂 · 低盐 · 少油 · 分餐',7.5,'#E0D3BC')
    figure(e,300,8,150,'#8FB39A','#5B4A3B',False)
    for x in (110,220): pendant(e,x,e.h-10,40,13,SUN)
    # tables
    for tx in (390,520,620):
        e.rect(tx-3,8,6,64,WOODD,1,.6);e.ell(tx,74,44,6,WOODL,.9)
        e.rect(tx-36,8,20,30,WOODL,6,.7);e.rect(tx+16,8,20,30,WOODL,6,.7)
        e.circ(tx-14,86,7,'#fff',.6);e.ell(tx+14,80,9,3,'#F6D98A',.5)
        pendant(e,tx,e.h-10,32,15,CREAM)
    figure(e,368,8,118,TERRA,'#CFCBC4',True);figure(e,415,8,124,BLUE,'#B8B3AB',False);wheelchair(e,520,8,.85,SAGE);figure(e,600,8,122,'#E9C36F','#F0EDE7',False)
    plant(e,650,8,1.1)
    return e.svg()

def scene_corridor():
    e=E(230,300);
    e.rect(0,0,230,300,'#F5ECDD',0,0,False)
    e.rect(0,0,30,300,WALL2,0,.8);e.rect(200,0,30,300,WALL2,0,.8)      # walls thick
    e.rect(30,0,170,10,WOODF,0,.8);e.rect(30,280,170,20,CREAM,0,.6)
    e.rect(30,10,0,0,WALL,0,0,False)
    e.rect(30,10,6,90,WOODL,0,.4,False);e.rect(194,10,6,90,WOODL,0,.4,False)
    # walls surface bands
    e.rect(30,10,5,270,'#E9D6BA',0,.0,False);e.rect(195,10,5,270,'#E9D6BA',0,.0,False)
    for x0,sgn in ((30,1),(195,-1)):
        e.rect(x0-(0 if sgn>0 else 0),10,5,90,WOODL,0,.6,False)
        e.rect(x0+(5 if sgn>0 else -14),82,14,6,WOODD,3,.7);e.rect(x0+(5 if sgn>0 else -14),60,14,5,WOODD,2,.6)
    e.rect(30,214,5,20,SAGE,0,.4,False)
    # ceiling light
    e.rect(80,286,70,5,'#fff',2,.8);e.ell(115,278,55,12,SUN,0,False,.4)
    # people
    wheelchair(e,68,10,.85,SAGE);figure(e,158,10,140,'#E9C36F','#CFCBC4',True)
    e.dim(35,195,266,'≥ 1800 净宽 · 双向通行',8)
    e.vdim(22,10,82,'850',8);e.vdim(22,10,60,'',8)
    e.text(206,72,'650',7,INK,'start');e.text(206,90,'850',7,INK,'start')
    e.text(115,240,'色彩记忆条 (眼高)',8,INK);e.rect(38,224,154,8,'#E39A78',4,.5)
    return e.svg()

def scene_activity():
    e=E(700,250);wall_floor(e,0,700)
    # photo wall
    for i,(c,w,h) in enumerate([('#E9C9A8',48,60),('#C9D8C0',60,44),('#EBD6A5',44,56),('#C4D5DE',56,60),('#E7BBA7',46,44),('#D9C7AE',52,58)]):
        x=40+i*62;e.rect(x,132+(i%2)*10,w,h,'#FFFDF8',2,.8);e.rect(x+4,136+(i%2)*10,w-8,h-8,c,1,.4)
    e.text(215,205,'岁月留影墙',8,INK)
    # screen
    e.rect(450,96,190,110,'#3F3B36',4,.9);e.rect(456,102,178,98,'#F7E6B8',2,0,False)
    e.circ(500,160,20,'#F3CE7B',.6);e.path('M456 102 L634 102 L634 130 Q560 110 456 140Z','#FFFFFF',0,False,op=.3)
    e.text(575,168,'老歌 · 老电影',13,'#7B5B3A','middle',700)
    e.rect(430,8,230,14,WOODL,3,.8)
    # seated rows
    for row,y0 in ((0,8),(1,8)):
        for i in range(6):
            x=110+i*68+row*20
            e.rect(x-16,y0,32,26,WOODL,5,.7);e.rect(x-16,y0+22,32,34,WOODL,5,.7)
            figure(e,x,y0+8,86,[TERRA,BLUE,'#E9C36F',SAGE,'#DDB49B','#B9A6CC'][i],'#CFCBC4',False)
    for x in (140,260,380,520): pendant(e,x,e.h-6,32,14,CREAM)
    plant(e,20,8,1.3);plant(e,690,8,1.2)
    return e.svg()
def detail_handrail():
    e=E(230,190)
    e.rect(0,0,230,190,'#F5ECDD',0,0,False)
    e.rect(0,0,60,190,'#E4D2B4',0,.8)
    for yy in range(10,190,14): e.line(0,yy,60,yy+8,INK,.3,op=.3)
    e.rect(60,90,18,22,GREY,2,.7);e.rect(76,94,62,14,GREY,2,.7)
    e.circ(160,101,22,WOODD,1.2);e.circ(160,101,17,'#C7965F',.6,False);e.circ(150,108,5,'#E2BE90',0,False,.8)
    e.dim(60,138,60,'',7);e.text(100,44,'40 净距',9)
    e.vdim(200,0,101,'850',10,False);e.text(160,140,'Ø40 圆形实木扶手',10,INK)
    e.text(160,152,'两端弯头贴墙 · 连续不断',8,'#8A7A66')
    e.rect(60,0,170,8,'#C8AF8C',0,.8)
    return e.svg()
def detail_threshold():
    e=E(230,170)
    e.rect(0,0,230,170,'#F5ECDD',0,0,False)
    e.rect(0,0,230,40,'#D8CDB8',0,.8);e.text(115,18,'结构楼板',9)
    e.rect(0,40,230,16,'#E7DCC6',0,.7);e.text(40,45,'找平层',8)
    e.rect(0,56,108,7,'#D6B48A',0,.9);e.rect(122,56,108,7,'#DDB89A',0,.9)
    e.rect(104,56,22,8,'#B9A88A',2,.9)
    e.text(54,80,'木纹地胶（居室）',9);e.text(176,80,'防滑地砖（卫生间）',9)
    e.line(115,64,115,110,'#C4623F',.8);e.text(115,120,'无高差过渡条 ≤5',10,'#C4623F')
    e.text(115,104,'门口零门槛',10,'#8A7A66')
    return e.svg()
def detail_door():
    e=E(230,225)
    e.rect(0,0,230,225,'#F5ECDD',0,0,False)
    e.rect(20,0,10,225,'#E4D2B4',0,.8);e.rect(190,0,10,225,'#E4D2B4',0,.8)
    e.rect(30,0,160,205,'#FBF6EC',0,.8)
    e.rect(52,10,116,164,WOODL,3,.9)
    e.rect(64,30,92,20,'#F3E6CE',2,.5);e.rect(64,60,92,90,'#EEDDC0',2,.5)
    e.rect(150,88,4,16,INK,1,.5);e.rect(132,92,26,7,'#B7B0A7',3,.7)
    e.circ(105,150,7,'#EBC067',.6);e.text(105,158,'',6)
    e.rect(52,148,116,8,'#F6D98A',2,.4)
    e.dim(52,168,184,'净宽 1000',10);e.vdim(178,0,100,'1000',9,False)
    e.text(110,212,'门楣色彩记忆条 + 大字门牌',10,'#C4623F')
    return e.svg()

def scene_nurse():
    e=E(700,250);wall_floor(e,0,700)
    # back wall: med cabinet + memory boxes
    e.rect(40,8,150,190,WOODL,3,.9)
    for i in range(3):
        for j in range(4):
            e.rect(48+i*47,16+j*44,42,38,'#FBF6EC',2,.6)
            e.rect(56+i*47,24+j*44,26,22,[TERRA,SAGE,BLUE,'#F3CE7B'][(i+j)%4],1,.4)
    e.text(115,206,'药品 · 耗材 嵌入柜体',9)
    # counter two levels
    e.rect(240,8,320,74,WOODD,4,.9);e.rect(240,82,320,8,WOODL,3,.9);e.rect(420,82,140,8,'#F3E6CE',3,.9)
    e.rect(240,90,190,34,WOODD,3,.9);e.rect(250,96,170,22,'#F3E6CE',2,.5,)
    e.text(335,104,'护理站',14,INK,'middle',700,'serif')
    # monitor call board
    e.rect(270,138,110,60,'#3F3B36',4,.9)
    for i in range(3):
        for j in range(2): e.circ(292+i*32,178-j*24,8,['#8FB39A','#8FB39A','#E9C36F','#8FB39A','#D9412B','#8FB39A'][i+3*j],.5)
    e.text(325,206,'呼叫 · 巡视看板',9)
    figure(e,470,8,152,'#8FB39A','#5B4A3B',False);figure(e,600,8,130,TERRA,'#CFCBC4',True)
    wheelchair(e,650,8,.8,BLUE)
    plant(e,700-18,8,1.1)
    for x in (300,480): pendant(e,x,e.h-6,30,15,CREAM)
    handrail(e,0,40,85);
    return e.svg()

def scene_doors():
    e=E(720,215);wall_floor(e,0,720)
    handrail(e,0,720,85);footlight(e,0,720,20)
    cols=['#E39A78','#8FB39A','#8EB2C8','#EBC067']
    items=['photo','cup','heart','plant']
    for i,c in enumerate(cols):
        x=30+i*175
        # door
        e.rect(x+40,8,88,168,'#EBD8B8',3,.9);e.rect(x+52,30,64,60,'#F1E3C8',2,.5);e.rect(x+52,100,64,60,'#F1E3C8',2,.5)
        e.rect(x+36,176,96,10,c,3,.9)                               # lintel colour bar
        e.rect(x+112,90,4,14,INK,1,.4);e.rect(x+96,94,22,6,'#B7B0A7',3,.6)
        e.rect(x+62,186,44,16,CREAM,3,.7);e.text(x+84,190,f'20{i+1}',11,c if c!='#EBC067' else '#B98618','middle',700)
        # memory box
        e.rect(x-8,96,42,52,WOODL,3,.9);e.rect(x-4,100,34,44,'#FBF6EC',2,.6)
        if items[i]=='photo': e.rect(x+2,110,22,26,c,2,.5);e.circ(x+13,124,6,'#FBF6EC',.4)
        if items[i]=='cup': e.rect(x+6,108,16,14,'#FFFDF8',3,.7);e.rect(x+22,111,6,8,'none',3,.7) if False else None;e.ell(x+14,126,14,3,'#DDD1BF',.5)
        if items[i]=='heart': e.path(f'M{x+13} 108 C{x-2} 120 {x+2} 136 {x+13} 132 C{x+24} 136 {x+28} 120 {x+13} 108Z',c,.7)
        if items[i]=='plant': e.rect(x+5,106,16,14,'#D9C7AE',3,.6);e.ell(x+13,128,10,12,SAGED,.5)
        e.text(x+13,152,'记忆盒',7,INK)
    # bench
    e.rect(692,8,24,6,WOODD,1,.6)
    return e.svg()
