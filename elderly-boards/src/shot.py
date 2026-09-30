from playwright.sync_api import sync_playwright
CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
def shot_html(html_path, png_path, w, h, scale=1, full=False):
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox','--allow-file-access-from-files'])
        pg=b.new_page(viewport={'width':w,'height':h},device_scale_factor=scale)
        pg.goto('file://'+html_path); pg.wait_for_timeout(500)
        pg.screenshot(path=png_path,full_page=full); b.close()
