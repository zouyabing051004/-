import re,os
NM=os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','node_modules','@fontsource'))+'/'
want={'noto-sans-sc':[300,400,500,700],'noto-serif-sc':[400,600,700],'ma-shan-zheng':[400],'long-cang':[400]}
out=''
for pkg,ws in want.items():
    for w in ws:
        css=open(f'{NM}{pkg}/{w}.css').read()
        css=re.sub(r'url\(\./files/',f'url(file://{NM}{pkg}/files/',css)
        # keep only woff2 sources
        css=re.sub(r',\s*url\([^)]*\.woff\) format\("woff"\)','',css)
        out+=css+'\n'
open('src/fonts.css','w').write(out)
print(len(out))
