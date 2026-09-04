/* ============================================================
   components/chrome — 页眉与页脚
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;

  var NAV = [
    ["/tour", "公众导览"],
    ["/chronicle", "文明长卷"],
    ["/lab", "证据实验室"],
    ["/atlas", "开放图鉴"],
  ];
  var NAV_EXTRA = [["/notebook", "我的考古笔记"], ["/sources", "来源与方法"]];

  function header(route) {
    var open = false;
    var nav = h("nav#primary-navigation.primary-nav", { "aria-label": "主要导航" });
    var toggle = h("button.menu-toggle", {
      type: "button",
      "aria-expanded": "false",
      "aria-controls": "primary-navigation",
      "aria-label": "打开或关闭导航",
      onclick: function () { setOpen(!open); },
    }, h("i", { "aria-hidden": "true" }));

    function setOpen(next) {
      open = next;
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    NAV.concat(NAV_EXTRA).forEach(function (item, index) {
      var path = item[0], label = item[1];
      var active = route.name === path.slice(1);
      nav.appendChild(ui.link(path, "nav-item" + (active ? " active" : "") + (index >= NAV.length ? " nav-extra" : ""),
        label, Object.assign({ onclick: function () { setOpen(false); } }, active ? { "aria-current": "page" } : {})));
    });

    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && open) setOpen(false); });

    return h("header.site-header", null,
      ui.link("/", "brand", [
        h("span.brand-seal", { "aria-hidden": "true" }, ui.brandSeal()),
        h("span.brand-name", null, h("b", { text: "曙光坐标·5800" }), h("small", { text: "HONGSHAN · NIUHELIANG" })),
      ], { "aria-label": "曙光坐标·5800 首页", onclick: function () { setOpen(false); } }),
      nav,
      h("div.header-tools", null,
        ui.link("/notebook", "btn btn--ghost notebook-link", "我的考古笔记",
          route.name === "notebook" ? { "aria-current": "page" } : null),
        toggle));
  }

  function footer() {
    var links = NAV.concat(NAV_EXTRA, [["/accessibility", "无障碍声明"]]);
    return h("footer.site-footer.on-night", null,
      h("div.page", null,
        h("div.footer-top", null,
          h("div.footer-mark", null,
            h("span.brand-seal", { "aria-hidden": "true" }, ui.brandSeal()),
            h("div", null, h("b", { text: "曙光坐标·5800" }), h("p", { text: "红山—牛河梁文明交互志" }))),
          h("nav.footer-links", { "aria-label": "页脚导航" },
            links.map(function (item) { return ui.link(item[0], "", item[1]); }))),
        h("hr.rule"),
        h("p.footer-note", null,
          h("b", { text: "独立作品声明：" }),
          "本项目为独立数字文化与竞赛作品，不代表牛河梁遗址、博物馆、考古机构或 UNESCO 官方立场。",
          h("br"),
          "全部图片按各自开放许可使用并逐张署名；AI 辅助视觉均已标注为设计示意，不作为考古证据。",
          h("br"),
          "© 2026 曙光坐标·5800 · Open-license assets credited individually")));
  }

  window.DC = Object.assign(window.DC || {}, { chrome: { header: header, footer: footer } });
})();
