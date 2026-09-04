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

  /* 图像呈现方式：器物/对象完整显示（contain），景观/方法可裁切填充（cover）。
     判定规则与 V12 一致，保证每张图的呈现身份不发生改变。 */
  function imagePresentation(src) {
    return /maps_environment|environment_methods|generated\/(hero|survey|nine-platforms)|A020_hongshan_culture_museum/i.test(src)
      ? "scene" : "object";
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
    return h((tag || "span") + ".media-boundary", { text: text });
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
    return link(path, "go-link", [label, h("span", { "aria-hidden": "true", text: "→" })]);
  }

  function eyebrow(cn, en) {
    return h("p.eyebrow", null, cn, en ? h("span.en", { text: en }) : null);
  }

  function sectionHead(options) {
    var head = h("div.section-head" + (options.split ? ".section-head--split" : ""));
    var left = h("div", null,
      options.eyebrow ? eyebrow(options.eyebrow, options.eyebrowEn) : null,
      options.title ? h("h2", { id: options.id, text: options.title, style: { marginTop: "12px" } }) : null);
    head.appendChild(left);
    if (options.lede) head.appendChild(h("p", { text: options.lede }));
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
    },
  });
})();
