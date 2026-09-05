/* ============================================================
   components/shared — 全站共用的小组件与图像规则
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, svg = D.svg;

  /* 站内相对路径：使成品既能直接打开，也能放到任意子目录托管 */
  function mediaUrl(src) {
    return String(src || "").replace(/^\/?media\//, "").replace(/^\//, "");
  }

  /* 图像呈现方式由 scripts/data/presentation.js 显式声明，不再用正则猜测。
     object → 陈列台（contain，完整器形）；scene → 画框（cover）；diagram → 完整可读。 */
  function imagePresentation(src) {
    var kind = D.presentationOf ? D.presentationOf(src) : "scene";
    return kind === "object" ? "object" : kind === "diagram" ? "diagram" : "scene";
  }

  /* 图像容器。真实文物与馆藏图一律原色，无任何统一滤镜。 */
  function media(options) {
    var kind = options.kind || imagePresentation(options.src);
    var img = h("img", {
      src: mediaUrl(options.src),
      alt: options.alt === undefined ? "" : options.alt,
      loading: options.eager ? "eager" : "lazy",
      decoding: "async",
      fetchpriority: options.eager ? "high" : undefined,
      width: options.width || undefined,
      height: options.height || undefined,
      style: options.objectPosition ? { objectPosition: options.objectPosition } : undefined,
    });
    if (options.eager) img.removeAttribute("loading");
    return h("span.media.media--" + kind + (options.class ? " " + options.class : ""), null, img, options.overlay || null);
  }

  /* 图片身份边界：说明「这是什么 / 不能代表什么」 */
  function boundary(text, tag) {
    if (!text) return null;
    return h((tag || "span") + ".media-boundary", { text: D.stop(text) });
  }

  var EV_COPY = {
    known:    ["记录事实", "DOCUMENTED"],
    inferred: ["研究解释", "INTERPRETATION"],
    unknown:  ["尚未确认", "NOT YET ESTABLISHED"],
  };

  function evidenceBadge(level) {
    var copy = EV_COPY[level] || EV_COPY.known;
    return h("span.ev-badge." + level, null, copy[0], h("span.en", { text: copy[1] }));
  }

  /* 来源链接：ID 与外链原样保留，可回查 */
  function sourceLinks(ids, label) {
    var wrap = h("div.source-links");
    wrap.appendChild(h("span.label", { text: label || "来源" }));
    (ids || []).forEach(function (id) {
      var source = D.sources.find(function (item) { return item.id === id; });
      wrap.appendChild(source
        ? h("a", { href: source.url, target: "_blank", rel: "noreferrer", title: source.title + "｜" + source.publisher },
            id, h("span", { "aria-hidden": "true", text: "↗" }))
        : h("span.plain", { text: id }));
    });
    return wrap;
  }

  /* 「现有证据支持 / 现有证据还不能说明」——实验与章节共用 */
  function boundaryPair(supports, limits) {
    return h("div.boundary-pair", null,
      h("div.supports", null, h("b", { text: "现有证据支持" }), h("p", { text: supports })),
      h("div.limits", null, h("b", { text: "现有证据还不能说明" }), h("p", { text: limits })));
  }

  function link(path, className, children, attrs) {
    return h("a" + (className ? "." + className.split(" ").join(".") : ""),
      Object.assign({ href: D.router.href(path) }, attrs || {}), children);
  }

  function goLink(path, label) {
    return link(path, "go-link", label);
  }

  /* 眉标：可带序号。首页六段依次编号，读者随时知道自己走到叙事的第几站——
     与素材板上「01 / 02 / 03」那种编号栏目条是同一套语言。 */
  function eyebrow(cn, en, no) {
    return h("p.eyebrow" + (no ? ".has-no" : ""), null,
      no ? h("span.no", { text: no }) : null,
      h("span.cn", { text: cn }),
      en ? h("span.en", { text: en }) : null);
  }

  function sectionHead(options) {
    var head = h("div.section-head" + (options.split ? ".section-head--split" : ""));
    var left = h("div", null,
      options.eyebrow ? eyebrow(options.eyebrow, options.eyebrowEn, options.no) : null,
      options.title ? h("h2", { id: options.id, text: options.title, style: { marginTop: "12px" } }) : null);
    head.appendChild(left);
    if (options.lede) head.appendChild(h("p", { text: D.stop(options.lede) }));
    return head;
  }

  /* ---------- 品牌标识 ----------
     外双环＝玉璧与圆形礼制秩序；水平线＝考古地层；
     升起的半弧＝曙光；地层线上的点＝牛河梁坐标。几何抽象，不描摹任何馆藏器物。 */
  function brandSeal() {
    return svg(
      '<svg viewBox="0 0 40 40" width="40" height="40" fill="none" aria-hidden="true" focusable="false">' +
      '<circle cx="20" cy="20" r="17.1" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="20" cy="20" r="10.6" stroke="currentColor" stroke-width="1" opacity=".42"/>' +
      '<path d="M11.7 24.7a8.3 8.3 0 0 1 16.6 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M4.6 24.7h30.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M9.2 29.2h21.6" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity=".4"/>' +
      '<circle cx="20" cy="24.7" r="2.1" fill="currentColor"/>' +
      "</svg>");
  }

  /* 序厅的地层与曙光母题（纯装饰） */
  function strataMotif() {
    return svg(
      '<svg viewBox="0 0 420 240" fill="none" aria-hidden="true" focusable="false">' +
      '<path d="M40 176a170 170 0 0 1 340 0" stroke="currentColor" stroke-width="1.6" opacity=".9"/>' +
      '<path d="M92 176a118 118 0 0 1 236 0" stroke="currentColor" stroke-width="1" opacity=".55"/>' +
      '<path d="M148 176a62 62 0 0 1 124 0" stroke="currentColor" stroke-width="1" opacity=".35"/>' +
      '<path d="M0 176h420M24 196h372M62 214h296M108 230h204" stroke="currentColor" stroke-width="1" opacity=".38" stroke-linecap="round"/>' +
      '<circle cx="210" cy="176" r="3.4" fill="currentColor"/>' +
      "</svg>");
  }

  /* 辽西相对位置示意（自绘 SVG）
     只表达「谁在谁的哪一侧」这一层关系，不画省界、不标距离、不设比例尺——
     因此它无法被误读成测绘地图。上传素材中的 AI 辽宁地图把牛河梁画在朝阳东北、
     且落在「红山文化区」之外，与事实不符，故不采用。 */
  function liaoxiSchematic() {
    return svg(
      '<svg viewBox="0 0 460 260" role="img" aria-labelledby="lx-t lx-d" class="schematic">' +
      '<title id="lx-t">辽西相对位置示意</title>' +
      '<desc id="lx-d">示意图：牛河梁位于朝阳西南方向的凌源与建平之间，处在努鲁儿虎山地与大凌河上游河谷之中；' +
      '图中只表示相对方位关系，不表示真实距离、边界或比例。</desc>' +
      '<defs><marker id="lx-a" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">' +
      '<path d="M0 0 L8 4 L0 8 z" fill="currentColor" opacity=".5"/></marker></defs>' +
      /* 山地带 */
      '<path d="M28 150 q46-34 92 0 t92 0 t92 0 t92 0" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".28"/>' +
      '<path d="M28 168 q46-34 92 0 t92 0 t92 0 t92 0" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".18"/>' +
      '<text x="30" y="196" font-size="11" fill="currentColor" opacity=".6">努鲁儿虎山地</text>' +
      /* 河谷 */
      '<path d="M60 214 C150 200 250 226 420 206" fill="none" stroke="#44786B" stroke-width="1.6" opacity=".7"/>' +
      '<text x="330" y="228" font-size="11" fill="#2F5A4E">大凌河上游</text>' +
      /* 方位罗盘 */
      '<g transform="translate(408 42)" opacity=".55">' +
      '<circle r="15" fill="none" stroke="currentColor" stroke-width="1"/>' +
      '<path d="M0-15 V15 M-15 0 H15" stroke="currentColor" stroke-width=".8"/>' +
      '<text x="0" y="-19" font-size="9" text-anchor="middle" fill="currentColor">N</text></g>' +
      /* 城镇与遗址：只表达相对方位 */
      '<g font-size="12">' +
      '<circle cx="300" cy="72" r="4" fill="currentColor" opacity=".6"/><text x="312" y="76" fill="currentColor">朝阳</text>' +
      '<circle cx="196" cy="112" r="4" fill="currentColor" opacity=".6"/><text x="150" y="104" fill="currentColor">建平</text>' +
      '<circle cx="128" cy="176" r="4" fill="currentColor" opacity=".6"/><text x="78" y="180" fill="currentColor">凌源</text>' +
      '<circle cx="176" cy="150" r="8" fill="none" stroke="#A44A35" stroke-width="2"/>' +
      '<circle cx="176" cy="150" r="3" fill="#A44A35"/>' +
      '<text x="190" y="146" fill="#A44A35" font-weight="700">牛河梁</text>' +
      '</g>' +
      '<path d="M292 80 L188 142" stroke="currentColor" stroke-width="1" opacity=".35" marker-end="url(#lx-a)"/>' +
      '<text x="214" y="104" font-size="10" fill="currentColor" opacity=".55">朝阳西南方向</text>' +
      '</svg>');
  }


  /* 地层与测年教学示意（自绘 HTML，非位图）
     上传素材里的 AI《考古地层剖面示意图》把彩陶罐、人像、玉璧画进了层位里，
     放在牛河梁语境中会被读成"这些是牛河梁出土物"；其标注文字在移动端也小到不可读。
     因此这里改为自绘：只讲两条方法规则，不描绘任何器物，文字是真文本、可缩放可朗读。 */
  var STRATA = [
    { key: "top",     name: "表土与扰动层", note: "现代耕作、植被与后期活动形成，年代最晚。" },
    { key: "late",    name: "晚期堆积",     note: "遗物较少，常被后期活动打乱，边界不一定清晰。" },
    { key: "main",    name: "主要文化层",   note: "遗物与活动遗迹集中，是判断这一阶段人类活动的主要依据。", sample: true },
    { key: "early",   name: "早期堆积",     note: "位于主要文化层之下，因此年代更早。" },
    { key: "sterile", name: "生土",         note: "未受人类活动影响的原生堆积，其上才开始出现文化层。" },
  ];

  function strataFigure() {
    return h("figure.strata-figure", null,
      h("div.strata-figure__head", null,
        eyebrow("方法示意", "HOW DATING WORKS"),
        h("b", { text: "年代是怎样被读出来的" })),
      h("div.strata-figure__body", null,
        h("div.strata-axis", { "aria-hidden": "true" },
          h("span.strata-axis__late", { text: "晚" }),
          h("span.strata-axis__line"),
          h("span.strata-axis__early", { text: "早" })),
        h("ol.strata-stack", null, STRATA.map(function (layer) {
          return h("li.strata-layer.is-" + layer.key, null,
            h("span.strata-layer__band", { "aria-hidden": "true" }),
            h("span.strata-layer__copy", null,
              h("b", { text: layer.name }),
              h("span", { text: D.stop(layer.note) }),
              layer.sample ? h("span.strata-layer__sample", null,
                h("em", { text: "取样点" }),
                "自这一层位取出炭样或骨样送测，得到的是这一层的年代范围。") : null));
        }))),
      h("div.strata-rules", null,
        h("p", null, h("b", { text: "规则一 · 叠压" }), "在没有被扰动的堆积里，下层早于上层。层位关系先于任何数字。"),
        h("p", null, h("b", { text: "规则二 · 范围" }), "一次测年得到的是一段年代范围，不是某一年；不同层位的范围还可能互相重叠。")),
      h("figcaption", null,
        "读懂一处遗址的年代，靠的是层位关系加上测年，而不是单独一个数字。",
        boundary("本图由本站自绘，为通用教学示意：层数、厚度、颜色均为示意，不是牛河梁任一地点的实测剖面，也不描绘任何具体出土器物。")));
  }

  /* 札记页的朱砂坐标戳 */
  function noteStamp() {
    return svg(
      '<svg viewBox="0 0 74 74" fill="none" aria-hidden="true" focusable="false" class="note-stamp">' +
      '<rect x="1.5" y="1.5" width="71" height="71" rx="3" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="37" cy="37" r="21" stroke="currentColor" stroke-width="1.4" opacity=".55"/>' +
      '<path d="M13 44h48" stroke="currentColor" stroke-width="1.4"/>' +
      '<path d="M23 44a14 14 0 0 1 28 0" stroke="currentColor" stroke-width="1.6"/>' +
      '<circle cx="37" cy="44" r="2.6" fill="currentColor"/>' +
      "</svg>");
  }

  window.DC = Object.assign(window.DC || {}, {
    ui: {
      mediaUrl: mediaUrl, imagePresentation: imagePresentation, media: media, boundary: boundary,
      evidenceBadge: evidenceBadge, sourceLinks: sourceLinks, boundaryPair: boundaryPair,
      link: link, goLink: goLink, eyebrow: eyebrow, sectionHead: sectionHead,
      brandSeal: brandSeal, strataMotif: strataMotif, noteStamp: noteStamp,
      liaoxiSchematic: liaoxiSchematic, strataFigure: strataFigure,
    },
  });
})();
