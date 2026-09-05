/* ============================================================
   文明长卷 — 目录（纵向章节序列）与章节详情（数字展览画册）
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;

  function index() {
    return h("section.page", null,
      h("header.page-intro", null,
        h("h1", { text: "文明长卷" }),
        h("p", { text: "从环境、生活和工艺进入礼仪、墓序与当代保护。每一章都把「已知／推断／未知」放在同一视野里。" })),
      h("div.chapter-list", null, D.chapters.map(function (chapter) {
        var guide = D.chapterGuides[chapter.slug];
        return ui.link("/chronicle/" + chapter.slug, "chapter-row", [
          h("span.chapter-row__no", { text: chapter.no }),
          h("span.chapter-row__copy", null,
            /* 眉标本身就用「·」分隔词组，再用「·」接阅读时长会出现四个点。
               改成两段文本＋间距，分隔靠留白，不靠又一个符号。 */
            h("small", null,
              h("span", { text: chapter.eyebrow }),
              guide ? h("em", { text: guide.readingTime }) : null),
            h("b", { text: chapter.title }),
            h("p", { text: guide ? guide.summary : chapter.thesis })),
          h("span.media.media--scene.chapter-row__media", { "aria-hidden": "true" },
            h("img", { src: ui.mediaUrl(chapter.image), alt: "", loading: "lazy", decoding: "async" })),
          h("span.chapter-row__go", { "aria-hidden": "true", text: "→" }),
        ]);
      })));
  }

  /* 本章图像证据比较 */
  function gallery(items) {
    if (!items || !items.length) return null;
    var active = 0;
    var focus = h("div.gallery__focus");
    var rail = h("div.gallery__rail", null,
      h("header", null,
        h("p.eyebrow", null, "切换比较视角"),
        h("p", { text: "图片用于建立对象、方法或环境参照；展签同时说明它不能替代什么。" })));
    var buttons = [];

    function paint() {
      var current = items[active];
      D.clear(focus);
      focus.appendChild(ui.media({ src: current.src, alt: current.alt, kind: ui.imagePresentation(current.src) }));
      focus.appendChild(h("div", null,
        h("p.eyebrow", null, "图像证据 " + String(active + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0")),
        ui.boundary(current.label, "p")));
      buttons.forEach(function (btn, i) {
        btn.classList.toggle("active", i === active);
        btn.setAttribute("aria-pressed", i === active ? "true" : "false");
      });
    }

    items.forEach(function (item, i) {
      var kind = ui.imagePresentation(item.src);
      var btn = h("button", {
        type: "button", onclick: function () { active = i; paint(); },
      },
        h("span.media.media--" + kind + ".thumb", { "aria-hidden": "true" }, h("img", { src: ui.mediaUrl(item.src), alt: "", loading: "lazy" })),
        h("span", null,
          h("b", { text: item.label }),
          h("em", { text: kind === "scene" ? "场景／方法参照" : "对象／器形参照" })));
      buttons.push(btn);
      rail.appendChild(btn);
    });
    rail.appendChild(h("p.note-strip", null, h("span", null, h("b", { text: "阅读规则：" }), "先辨认图像身份，再阅读它支持的判断。比较标本、方法照片与设计示意都不等于遗址原位记录。")));
    paint();

    return h("section.page.gallery", { "aria-label": "本章图像证据比较" }, focus, rail);
  }

  function detail(chapter) {
    var guide = D.chapterGuides[chapter.slug];
    var next = D.chapters[(D.chapters.indexOf(chapter) + 1) % D.chapters.length];

    var essay = h("div.chapter-essay", null,
      guide ? h("div.chapter-brief", null, h("small", { text: "一分钟先懂" }), h("p", { text: D.stop(guide.summary) })) : null,
      h("p.chapter-lead", { text: chapter.body }),
      chapter.slug === "land-and-people" ? h("figure.schematic-figure", null,
        ui.liaoxiSchematic(),
        h("figcaption", null,
          h("b", { text: "辽西相对位置示意" }),
          "牛河梁位于朝阳西南、凌源与建平之间，处在努鲁儿虎山地与大凌河上游河谷之中。",
          h("span.media-boundary", { text: "本图由本站自绘，只表示相对方位关系，不表示真实距离、边界或比例，不可作为测绘或定位依据。" }))) : null,
      chapter.slug === "discovery-and-redrawing" ? ui.strataFigure() : null,
      h("section.evidence-triad", null,
        h("article", null, ui.evidenceBadge("known"), h("h2", { text: "我们知道什么" }),
          h("ul", null, chapter.known.map(function (item) { return h("li", { text: item }); }))),
        h("article", null, ui.evidenceBadge("inferred"), h("h2", { text: "研究如何解释" }), h("p", { text: chapter.inferred })),
        h("article", null, ui.evidenceBadge("unknown"), h("h2", { text: "仍然不知道什么" }), h("p", { text: chapter.unknown }))));

    if (guide) {
      essay.appendChild(h("section.deep-reading", { "aria-label": "本章深度阅读" },
        h("header", null, ui.eyebrow("深度阅读"), h("h2", { text: "把一句结论，放回证据与上下文", style: { marginTop: "12px" } })),
        h("div.deep-context", null, guide.context.map(function (paragraph, i) {
          return h("article", null, h("span", { text: "0" + (i + 1) }), h("p", { text: paragraph }));
        })),
        h("div.deep-pair", null,
          h("article", null, h("small", { text: "我们如何知道" }), h("h3", { text: guide.method.title }), h("p", { text: guide.method.body })),
          h("article", null, h("small", { text: "为什么与今天有关" }), h("h3", { text: guide.today.title }), h("p", { text: guide.today.body }))),
        h("div", null,
          h("header", { style: { marginBottom: "16px" } }, ui.eyebrow("本章术语"), h("p", { text: "术语是阅读工具，不是需要背诵的答案", style: { margin: "8px 0 0", color: "var(--muted)", fontSize: "var(--fs-meta)" } })),
          h("div.term-list", null, guide.terms.map(function (item) {
            return h("article", null, h("b", { text: item.term }), h("p", { text: D.stop(item.definition) }));
          }))),
        h("nav.deep-pair", { "aria-label": "本章相关内容" },
          ui.link("/lab/" + guide.relatedLab.slug, "card hover-lift", [
            h("small", { text: "相关互动实验" }), h("b", { text: guide.relatedLab.label }), h("span.go-link", { "aria-hidden": "true", text: "→" })]),
          ui.link("/atlas?q=" + encodeURIComponent(guide.relatedAtlas.query), "card hover-lift", [
            h("small", { text: "相关图鉴对象" }), h("b", { text: guide.relatedAtlas.label }), h("span.go-link", { "aria-hidden": "true", text: "→" })]))));
    }

    var aside = h("aside.chapter-aside", null,
      ui.link("/chronicle", "go-link", [h("span", { "aria-hidden": "true", text: "←" }), "返回九章目录"]),
      h("p.label", { text: "本章事实编号" }),
      h("div.claims", null, chapter.claimIds.map(function (id) { return h("span", { text: id }); })),
      ui.sourceLinks(chapter.sourceIds));

    return h("article", null,
      h("header.chapter-hero.is-" + ui.imagePresentation(chapter.image), null,
        h("img", { src: ui.mediaUrl(chapter.image), alt: chapter.imageAlt, decoding: "async", fetchpriority: "high" }),
        h("div.chapter-hero__scrim", { "aria-hidden": "true" }),
        h("div.page.chapter-hero__copy.on-dark", null,
          h("p.no", { text: chapter.no + "　" + chapter.eyebrow }),
          h("h1", { text: chapter.title, tabindex: "-1" }),
          h("blockquote", { text: D.stop(chapter.thesis) }),
          ui.boundary(chapter.imageLabel))),
      h("div.page.chapter-body", null, essay, aside),
      gallery(chapter.secondaryImages),
      h("nav.page.next-nav", { "aria-label": "章节导航" },
        h("div", null, h("small", { text: "下一章" }), h("b", { text: next.no + "　" + next.title })),
        ui.link("/chronicle/" + next.slug, "btn btn--ghost", "继续阅读 →")));
  }

  function render(route) {
    var chapter = route.slug && D.chapters.find(function (c) { return c.slug === route.slug; });
    return chapter ? detail(chapter) : index();
  }

  window.DC = Object.assign(window.DC || {}, { pages: Object.assign(window.DC.pages || {}, { chronicle: render }) });
})();
