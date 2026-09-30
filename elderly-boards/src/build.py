import sys,os,importlib
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright
CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
def render(names,png=True,pdf=True,scale=1.0):
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox','--allow-file-access-from-files'])
        for n in names:
            html=os.path.abspath(f'out/{n}.html')
            pg=b.new_page(viewport={'width':2245,'height':3179},device_scale_factor=1.5)
            pg.goto('file://'+html); pg.wait_for_timeout(1500); pg.evaluate('document.fonts.ready')
            pg.wait_for_timeout(500)
            if png: pg.screenshot(path=f'out/{n}.png',clip={'x':0,'y':0,'width':2245,'height':3179})
            if pdf: pg.pdf(path=f'out/{n}.pdf',width='594mm',height='841mm',print_background=True,page_ranges='1')
            pg.close()
        b.close()
if __name__=='__main__':
    which=sys.argv[1:] or ['board1']
    for n in which:
        m=importlib.import_module(n); open(f'out/{n}.html','w').write(m.build())
    render(which,pdf='--nopdf' not in os.environ.get('FLAGS',''))
