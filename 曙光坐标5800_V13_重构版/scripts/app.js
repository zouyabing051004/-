/* ============================================================
   app — 启动、路由分发、标题与焦点管理
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h;

  var PAGE_TITLES = {
    home: "曙光坐标·5800", tour: "公众导览", chronicle: "文明长卷", lab: "证据实验室",
    atlas: "开放图鉴", notebook: "我的考古笔记", sources: "来源与方法", accessibility: "无障碍声明",
  };

  var shell, headerSlot, main, footerSlot, firstPaint = true;

  function documentTitle(route) {
    var title = PAGE_TITLES[route.name];
    if (route.name === "chronicle" && route.slug) {
      var chapter = D.chapters.find(function (c) { return c.slug === route.slug; });
      if (chapter) title = chapter.title;
    }
    if (route.name === "lab" && route.slug) {
      var lab = D.labs.find(function (l) { return l.slug === route.slug; });
      if (lab) title = lab.title;
    }
    if (route.name === "atlas" && route.slug) {
      var asset = D.assets.find(function (a) { return a.id === route.slug; });
      if (asset) title = asset.title;
    }
    return route.name === "home" ? "曙光坐标·5800｜红山—牛河梁文明交互志" : title + "｜曙光坐标·5800";
  }

  function viewFor(route) {
    var pages = D.pages;
    if (route.name === "tour") return pages.tour(route);
    if (route.name === "chronicle") return pages.chronicle(route);
    if (route.name === "lab") return pages.lab(route);
    if (route.name === "atlas") return pages.atlas(route, D.assets);
    if (route.name === "notebook") return pages.notebook(route);
    if (route.name === "sources") return pages.sources(route);
    if (route.name === "accessibility") return pages.accessibility(route);
    return pages.home(route, D.assets);
  }

  function paint(route) {
    D.clear(headerSlot).appendChild(D.chrome.header(route));
    D.clear(main).appendChild(viewFor(route));
    document.title = documentTitle(route);
    if (!firstPaint) {
      window.scrollTo({ top: 0, behavior: "instant" });
      /* 把焦点交给新页面的主标题，键盘与读屏用户不会停留在上一页 */
      var heading = main.querySelector("h1[tabindex], h1");
      if (heading) {
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      } else {
        main.focus();
      }
    }
    firstPaint = false;
  }

  function boot() {
    D.store.load();
    shell = document.getElementById("app");
    headerSlot = h("div");
    main = h("main#main-content", { tabindex: "-1" });
    footerSlot = h("div");
    D.clear(shell);
    /* 跳转链接直接把焦点交给主内容区，不改动地址栏，避免影响当前路由 */
    shell.appendChild(h("a.skip-link", {
      href: "#main-content", text: "跳到主要内容",
      onclick: function (event) {
        event.preventDefault();
        main.focus();
        main.scrollIntoView({ block: "start", behavior: "auto" });
      },
    }));
    shell.appendChild(headerSlot);
    shell.appendChild(main);
    shell.appendChild(footerSlot);
    footerSlot.appendChild(D.chrome.footer());

    D.router.onChange(paint);
    paint(D.router.parse());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
