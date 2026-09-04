/* ============================================================
   site-config — 全站唯一的地址与版本配置
   分享链接、二维码、PNG 报告、canonical、OpenGraph 都只读这里，
   换部署地址时改这一个值即可，不会出现「分享是新址、二维码是旧址」。
   改完地址后运行 tools/make-qr.py 重新生成二维码，二者不会脱钩。
   ============================================================ */
(function () {
  "use strict";
  window.DC = Object.assign(window.DC || {}, {
    site: {
      canonicalUrl: "https://shuguang-5800.modymarylou7.chatgpt.site",
      name: "曙光坐标·5800",
      subtitle: "红山—牛河梁文明交互志",
      shareText: "我正在用证据重新认识牛河梁文明。",
      version: "V13.1",
      lastVerified: "2026-07-16",
    },
  });
})();
