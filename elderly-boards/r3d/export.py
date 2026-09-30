"""Convert finished full-res renders (renders/f_*.png) to print JPGs (renders/final/*.jpg, q=94, 300 dpi tag)
with a gentle grade: exposure lift to a common white point, shadow lift, neutralised warm cast, +saturation."""
import glob, os, sys
import numpy as np
from PIL import Image
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','renders')
def grade(im):
    a=np.asarray(im.convert('RGB'),dtype=np.float32)/255.0
    lum=a.mean(axis=2)
    hi=np.percentile(lum,99.3)
    a=a*min(1.9,0.93/max(hi,1e-3))                   # bring highlights to a common white point
    a=np.clip(a,0,1)
    a=a**0.86                                        # lift mid-tones / shadows
    a=a*np.array([0.975,1.0,1.05],dtype=np.float32)  # neutralise yellow cast
    g=a.mean(axis=2,keepdims=True); a=g+(a-g)*1.07   # slight saturation
    return Image.fromarray((np.clip(a,0,1)*255+.5).astype('uint8'))
force='--force' in sys.argv
for f in sorted(glob.glob(os.path.join(R,'f_*.png'))):
    name=os.path.basename(f)[2:-4]; out=os.path.join(R,'final',name+'.jpg')
    if not force and os.path.exists(out) and os.path.getmtime(out)>=os.path.getmtime(f): continue
    grade(Image.open(f)).save(out,quality=94,subsampling=0,dpi=(300,300)); print('exported',name)
