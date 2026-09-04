/* ============================================================
   首页 — Hero → 三个文明坐标 → 证据实验室 → 三章预览 → 对象之证 → 结语
   六个模块，一条主线：我是谁 → 为什么值得看 → 我能怎么玩 → 最精彩的功能 → 下一步。
   所有结论文本均直接取自事实主数据（tourScenes / labs / chapters），不另行改写。
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;

  function scene(id) { return D.tourScenes.find(function (s) { return s.id === id; }); }
  function lab(slug) { return D.labs.find(function (l) { return l.slug === slug; }); }
  function chapter(slug) { return D.chapters.find(function (c) { return c.slug === slug; }); }

  /* ---------- A. 序厅 ----------
     左 45% 文字 / 右 55% 地景，文字不再全部压在图上的左下角。
     文化层级：曙光坐标5800 → 红山—牛河梁 → 一句主张 → 两个入口 → 素材身份。 */
  function hero() {
    var art = h("picture.hero__picture", null,
      h("source", { media: "(max-width: 900px)", srcset: "assets/scene/hero-dawn-portrait.webp" }),
      h("img", { src: "assets/scene/hero-dawn-valley.webp", alt: "",
        width: 2400, height: 1351, decoding: "async", fetchpriority: "high" }));

    return h("section.hero", { "aria-labelledby": "home-title" },
      h("div.hero__art.media.media--ambient", { "aria-hidden": "true" }, art,
        h("div.hero__scrim", { "aria-hidden": "true" })),
      h("div.hero__inner", null,
        h("div.hero__copy", null,
          h("p.hero__eyebrow", null,
            h("span.seal", { "aria-hidden": "true" }, ui.brandSeal()),
            h("span", { text: "红山—牛河梁　数字文明志" })),
          h("h1#home-title.hero__title", null,
            h("span.tw", { text: "曙光坐标" }),
            h("span.tw", null, h("span.dot", { text: "·" }), h("span.num", { text: "5800" }))),
          h("p.hero__claim", { text: "不是看一个答案，而是进入一条证据链。" }),
          h("p.hero__lede", { text: "从牛河梁出发，看见中华文明曙光如何被证据一层层重新确认。" }),
          h("div.hero__actions", null,
            ui.link("/tour?mode=quick", "btn btn--primary", ["开始 3 分钟导览", h("span.btn__arrow", { "aria-hidden": "true", text: "→" })]),
            ui.link("/chronicle", "btn btn--ghost", "进入九章文明长卷")),
          h("p.hero__disclosure", { text: "序厅图为 AI 生成的晨光山谷意象，用于建立地景尺度；非牛河梁实景、非遗址复原。" }))));
  }

  /* ---------- B. 三个文明坐标 ---------- */
  function coordinates() {
    var items = [
      { num: "5800", label: "时间坐标", en: "TIME", text: scene("T01").conclusion, to: "/lab/coordinate", cta: "校准时间口径" },
      { num: "09",   label: "九台营造", en: "SCALE", text: scene("T03").conclusion, to: "/lab/nine-platforms", cta: "查看工程证据" },
      { num: "2026", label: "调查重绘", en: "REDRAW", text: lab("survey-redraw").conclusion, to: "/lab/survey-redraw", cta: "打开调查网格" },
    ];
    return h("section.section.section--lg.coordinates", { "aria-labelledby": "coord-title" },
      h("div.page", null,
        ui.sectionHead({
          split: true, id: "coord-title", eyebrow: "三个文明坐标",
          title: "先记住三个数字",
          lede: "它们分别回答「什么时候」「有多大」「我们的认识为什么还在变」。每个坐标都可以点开，亲手核对它成立的条件。",
        }),
        h("ol.coordinate-grid", null, items.map(function (item, index) {
          return h("li.coordinate", null,
            h("span.coordinate__num", { text: item.num }),
            h("span.coordinate__label", null, h("b", { text: item.label }), h("span", { text: item.en })),
            h("p", { text: item.text }),
            ui.goLink(item.to, item.cta));
        }))));
  }

  /* ---------- C. 证据实验室（首页内嵌真实互动） ---------- */
  function labShowcase() {
    var tomb = lab("tomb-matrix");
    var filter = "all";
    var matrix = h("div.mini-lab__matrix", { role: "img" });
    var cells = [];
    for (var i = 0; i < 66; i++) {
      var cell = h("i", { "aria-hidden": "true" });
      cells.push(cell);
      matrix.appendChild(cell);
    }
    var readNum = h("strong", { text: "66" });
    var readText = h("p");
    var read = h("div.mini-lab__read", { "aria-live": "polite" }, readNum, readText);

    var SETS = {
      all:  ["66", "限定研究样本 · 其中 37 座有玉、29 座无玉"],
      jade: ["37", "有玉墓 · 样本记录，合计记录 145 件玉器"],
      none: ["29", "无玉墓 · 由 66 − 37 计算得到的衍生值"],
    };

    function render() {
      cells.forEach(function (cell, index) {
        var hasJade = index < 37;
        var focused = filter === "all" || (filter === "jade" && hasJade) || (filter === "none" && !hasJade);
        cell.className = (hasJade ? "jade" : "plain") + (focused ? "" : " dim");
      });
      readNum.textContent = SETS[filter][0];
      readText.textContent = SETS[filter][1];
      matrix.setAttribute("aria-label", "66 座限定研究样本，其中 37 座有玉、29 座无玉；当前查看 " + SETS[filter][1]);
      Array.prototype.forEach.call(seg.children, function (btn) {
        var on = btn.dataset.filter === filter;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    var seg = h("div.segmented", { "aria-label": "墓葬样本分类" },
      [["all", "全部样本 66"], ["jade", "有玉 37"], ["none", "无玉 29"]].map(function (item) {
        return h("button", {
          type: "button", dataset: { filter: item[0] }, text: item[1],
          onclick: function () { filter = item[0]; render(); },
        });
      }));

    var miniLab = h("div.mini-lab", null,
      h("div.mini-lab__head", null,
        h("b", { text: "66 座墓葬样本：玉器数量与墓葬规格" }),
        h("span", { text: "LAB 04 · 现在就能操作" })),
      seg,
      matrix,
      read,
      h("p.mini-lab__foot", { text: "66 个方格只用于计数，不代表墓葬的真实位置、年代或大小。这组样本是为回答特定问题整理的专题研究样本，不是牛河梁已经发现的全部墓葬。" }));

    render();

    var picks = [
      { slug: "nine-platforms", no: "LAB 02" },
      { slug: "tomb-matrix", no: "LAB 04" },
      { slug: "survey-redraw", no: "LAB 05" },
    ];

    return h("section.lab-showcase.on-night", { "aria-labelledby": "lab-showcase-title" },
      h("div.page.lab-showcase__inner", null,
        miniLab,
        h("div.lab-showcase__copy", null,
          ui.eyebrow("证据实验室", "EVIDENCE LAB"),
          h("h2#lab-showcase-title", { text: "证据可以被亲手操作", style: { marginTop: "12px" } }),
          h("p", { text: "五个实验把考古结论拆回它的材料：你先动手比较，再读到「现有证据支持什么」和「现有证据还不能说明什么」。左侧就是其中之一，不需要先读说明书。" }),
          h("div.lab-picks", null, picks.map(function (pick) {
            var item = lab(pick.slug);
            var guide = D.labGuides[item.id];
            return ui.link("/lab/" + item.slug, "", [
              h("span.no", { text: pick.no }),
              h("span", null, h("b", { text: item.title.split("：")[0] }), h("small", { text: guide.duration + " · " + guide.interaction })),
              h("span.arrow", { "aria-hidden": "true", text: "→" }),
            ]);
          })),
          ui.goLink("/lab", "查看全部五个证据实验"))));
  }

  /* ---------- D. 九章预览（只展示 3 章） ---------- */
  function chroniclePreview() {
    var picks = ["jade-and-belief", "ritual-architecture", "discovery-and-redrawing"];
    return h("section.section.section--lg.chronicle-preview", { "aria-labelledby": "chron-title" },
      h("div.page", null,
        ui.sectionHead({
          split: true, id: "chron-title", eyebrow: "九章文明长卷",
          title: "九章，不是九个展柜",
          lede: "每章只有一个策展命题、2—4 项真实证据，以及一个尚未被回答的问题。这里先看三章。",
        }),
        h("div.preview-grid", null, picks.map(function (slug) {
          var item = chapter(slug);
          var guide = D.chapterGuides[slug];
          return ui.link("/chronicle/" + slug, "preview-card plate-hover", [
            ui.media({ src: item.image, alt: "" }),
            h("span.no", { text: item.no + " · " + guide.readingTime }),
            h("h3", { text: item.title }),
            h("p", { text: guide.summary }),
            ui.boundary(item.imageLabel),
          ]);
        })),
        h("div", { style: { marginTop: "40px" } }, ui.goLink("/chronicle", "查看全部九章"))));
  }

  /* ---------- E. 对象之证 ---------- */
  function objectSpotlight(assets) {
    var preferred = ["A002", "A001", "A003", "AX035", "A013"];
    var picks = preferred
      .map(function (id) { return assets.find(function (a) { return a.id === id; }); })
      .filter(Boolean);
    if (picks.length < 5) {
      assets.filter(function (a) { return a.group === "featured-artifacts" && a.quality.grade === "A"; })
        .forEach(function (a) { if (picks.length < 5 && picks.indexOf(a) === -1) picks.push(a); });
    }
    if (!picks.length) return null;

    function item(asset, lead) {
      return ui.link("/atlas/" + asset.id, "spotlight-item plate-hover", [
        ui.media({ src: asset.file.url, alt: asset.alt, width: asset.file.width, height: asset.file.height, class: "hover-zoom" }),
        h("span", null,
          h("span.id", { text: asset.id + " · " + asset.groupLabel }),
          h("b", { text: asset.title }),
          h("small", { text: lead ? asset.editorial.factBoundary : (asset.source.institution || "来源机构资料未载") })),
      ]);
    }

    return h("section.section.object-spotlight", { "aria-labelledby": "object-title" },
      h("div.page", null,
        ui.sectionHead({
          split: true, id: "object-title", eyebrow: "对象之证",
          title: "让器物自己占据画面",
          lede: "全部 " + assets.length + " 张图片按原色显示，不做统一滤镜、不补纹、不补缺。每一张都写明它是什么，以及它不能证明什么。",
        }),
        h("div.spotlight-grid", null,
          h("div.spotlight-lead", null, item(picks[0], true)),
          h("div.spotlight-rest", null, picks.slice(1, 5).map(function (a) { return item(a); }))),
        h("div", { style: { marginTop: "40px" } }, ui.goLink("/atlas", "打开完整开放图鉴（" + assets.length + " 张）"))));
  }

  /* ---------- F. 结语 ---------- */
  function closing() {
    return h("section.section.section--lg.closing", null,
      h("div.page", null,
        ui.eyebrow("下一站"),
        h("h2", { text: "不只记住一个答案，带走一条你亲自确认过的证据。", style: { marginTop: "16px" } }),
        h("p", { text: "三分钟建立坐标，五个实验建立方法，九章长卷建立脉络。你的每一步都会留在「我的考古笔记」里，并且只保存在这台设备上。" }),
        h("div.actions", null,
          ui.link("/tour?mode=quick", "btn btn--primary", ["开始 3 分钟导览", h("span.btn__arrow", { "aria-hidden": "true", text: "→" })]),
          ui.link("/notebook", "btn btn--ghost", "打开我的考古笔记"))));
  }

  function render(route, assets) {
    return D.frag(hero(), coordinates(), labShowcase(), chroniclePreview(), objectSpotlight(assets), closing());
  }

  window.DC = Object.assign(window.DC || {}, { pages: Object.assign(window.DC.pages || {}, { home: render }) });
})();
