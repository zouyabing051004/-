"""Convert finished full-res renders (renders/f_*.png) to print JPGs (renders/final/*.jpg, q=94, 300 dpi tag)."""
import glob, os
from PIL import Image
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','renders')
for f in sorted(glob.glob(os.path.join(R,'f_*.png'))):
    name=os.path.basename(f)[2:-4]; out=os.path.join(R,'final',name+'.jpg')
    if os.path.exists(out) and os.path.getmtime(out)>=os.path.getmtime(f): continue
    Image.open(f).convert('RGB').save(out,quality=94,subsampling=0,dpi=(300,300)); print('exported',name)
