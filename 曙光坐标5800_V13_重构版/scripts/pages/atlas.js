/* ============================================================
   开放图鉴 — 现代数字馆藏界面
   浅色、文物原色、卡片不加遮罩、不裁掉关键形态；
   来源 / 许可 / 哈希下沉到「资料档案」，公众层先回答「这是什么 / 为什么重要 / 不能误读什么」。
   检索、筛选、排序状态继续写回 URL，可分享、可回退。
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;

  /* AX035 与 AX036 是同一件器物的正反两面：列表按对象去重，详情互为比较 */
  function objectKey(id) { return id === "AX036" ? "AX035" : id; }

  function index(route, assets) {
    var query = route.query.get("q") || "";
    var group = route.query.get("group") || "all";
    var sort = route.query.get("sort") || "id";
    var visible = 36;

    var groups = [];
    assets.forEach(function (asset) {
      if (!groups.some(function (g) { return g[0] === asset.group; })) groups.push([asset.group, asset.groupLabel]);
    });

    var resultHead = h("div.atlas-result-head", { "aria-live": "polite" });
    var grid = h("div.atlas-grid");
    var moreWrap = h("div");
    var filters = h("div.atlas-filters", { "aria-label": "按图像身份筛选" });

    function syncUrl() {
      var params = new URLSearchParams();
      if (query) params.set("q", query);
      if (group !== "all") params.set("group", group);
      if (sort !== "id") params.set("sort", sort);
      var str = params.toString();
      D.router.replaceQuery("/atlas" + (str ? "?" + str : ""));
    }

    function compute() {
      var needle = query.toLowerCase();
      var results = assets.filter(function (asset) {
        if (group !== "all" && asset.group !== group) return false;
        if (!needle) return true;
        return (asset.id + asset.title + asset.source.institution + asset.editorial.factBoundary).toLowerCase().indexOf(needle) !== -1;
      }).sort(function (a, b) {
        if (sort === "title") return a.title.localeCompare(b.title, "zh-CN");
        if (sort === "quality") return a.quality.grade.localeCompare(b.quality.grade);
        return a.id.localeCompare(b.id);
      });
      var seen = {};
      var objects = results.filter(function (asset) {
        var key = objectKey(asset.id);
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
      return { results: results, objects: objects };
    }

    function card(asset) {
      var kind = ui.imagePresentation(asset.file.url);
      return ui.link("/atlas/" + asset.id, "atlas-card is-" + kind + " hover-lift", [
        h("span.media.media--" + kind, { "aria-hidden": "false" },
          h("img", { src: asset.file.url, alt: asset.alt, width: asset.file.width, height: asset.file.height, loading: "lazy", decoding: "async" }),
          h("span.atlas-card__grade", { title: "展示等级 " + asset.quality.grade, text: asset.quality.grade }),
          asset.id === "AX035" ? h("em.atlas-card__views", { text: "正反两面" }) : null),
        h("span.atlas-card__copy", null,
          h("small", { text: asset.id + " · " + asset.groupLabel }),
          h("b", { text: asset.title.replace("（芝加哥艺术博物馆·正面）", "（芝加哥艺术博物馆）") }),
          h("em", { text: asset.source.institution || "来源机构资料未载" })),
      ]);
    }

    function paint() {
      var data = compute();
      D.clear(resultHead);
      resultHead.appendChild(h("p", { style: { margin: 0 } },
        h("b", { text: String(data.objects.length) }), " 项对象",
        h("span", { text: "　·　共 " + data.results.length + " 张图像" })));
      resultHead.appendChild(h("span", { text: "点击对象进入公众解读与完整档案" }));

      D.clear(grid);
      D.clear(moreWrap);
      if (!assets.length) {
        grid.appendChild(h("p.empty-state", { text: "图片主数据未能载入，请确认 scripts/data/assets.js 与 assets/ 目录同时存在。" }));
      } else if (!data.objects.length) {
        grid.appendChild(h("p.empty-state", { text: "没有符合条件的对象。请清除关键词或切换分类。" }));
      } else {
        data.objects.slice(0, visible).forEach(function (asset) { grid.appendChild(card(asset)); });
        if (visible < data.objects.length) {
          moreWrap.appendChild(h("button.atlas-more", {
            type: "button",
            text: "继续显示 " + Math.min(24, data.objects.length - visible) + " 项",
            onclick: function () { visible += 24; paint(); },
          }));
        }
      }
      Array.prototype.forEach.call(filters.children, function (btn) {
        var on = btn.dataset.group === group;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      syncUrl();
    }

    filters.appendChild(h("button", { type: "button", dataset: { group: "all" }, text: "全部 " + assets.length, onclick: function () { group = "all"; visible = 36; paint(); } }));
    groups.forEach(function (item) {
      var count = assets.filter(function (a) { return a.group === item[0]; }).length;
      filters.appendChild(h("button", { type: "button", dataset: { group: item[0] }, text: item[1] + " " + count, onclick: function () { group = item[0]; visible = 36; paint(); } }));
    });

    var section = h("section.page", null,
      h("header.page-intro", null,
        ui.eyebrow("开放图鉴", "OPEN COLLECTION"),
        h("h1", { text: "开放图鉴" }),
        h("p", { text: "全部 " + assets.length + " 张图片按开放许可使用，逐张保留身份、来源、许可与事实边界。第一次来可以先按问题进入；需要核验时再用关键词与分类检索。" })),

      h("nav.preview-grid", { "aria-label": "按公众问题进入", style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px", marginBottom: "32px" } },
        [["/chronicle/ritual-architecture", "工程如何被看见", "从台、庙、坛与冢开始"],
         ["/chronicle/jade-and-belief", "玉如何进入秩序", "比较器形、墓序与语境"],
         ["/chronicle/discovery-and-redrawing", "认识为何仍在改变", "进入调查与方法图像"]].map(function (item) {
          return ui.link(item[0], "card hover-lift", [h("small", { text: item[1], style: { color: "var(--muted)" } }), h("b", { text: item[2] }), h("span.go-link", { "aria-hidden": "true", text: "→" })]);
        })),

      h("div.atlas-tools", null,
        h("label.atlas-search", null,
          h("span", { text: "检索对象、材料或来源机构" }),
          h("input", {
            type: "search", name: "atlas-search", autocomplete: "off", value: query,
            placeholder: "例如：玉龙、陶器、实验考古…",
            oninput: function (event) { query = event.target.value; visible = 36; paint(); },
          })),
        filters,
        h("label.atlas-sort", null,
          h("span", { text: "排序" }),
          h("select", {
            onchange: function (event) { sort = event.target.value; visible = 36; paint(); },
          },
            h("option", { value: "id", text: "资产编号", selected: sort === "id" }),
            h("option", { value: "title", text: "对象名称", selected: sort === "title" }),
            h("option", { value: "quality", text: "展示等级", selected: sort === "quality" })))),

      resultHead, grid, moreWrap);

    paint();
    return section;
  }

  /* ---------- 对象详情 ---------- */
  function record(asset, assets) {
    var reading = D.atlasGroupGuides[asset.group] || D.atlasGroupGuides["artifact-atlas"];
    var paired = asset.id === "AX035" ? assets.find(function (a) { return a.id === "AX036"; })
      : asset.id === "AX036" ? assets.find(function (a) { return a.id === "AX035"; }) : undefined;
    var related = assets.filter(function (a) {
      return a.id !== asset.id && (!paired || a.id !== paired.id) && a.group === asset.group;
    }).slice(0, 4);
    var compareAsset = paired || related[0];

    var kind = ui.imagePresentation(asset.file.url);
    var frame = h("div.record__frame" + (kind === "scene" ? ".is-scene" : ""));
    var caption = h("p.media-boundary");
    var tools = h("div.segmented", { "aria-label": "对象查看模式" });
    var mode = "whole";

    function paintMedia() {
      D.clear(frame);
      frame.classList.remove("zoom");
      if (mode === "compare" && compareAsset) {
        frame.appendChild(h("div.record__compare", null,
          h("figure", null, ui.media({ src: asset.file.url, alt: asset.alt }), h("figcaption", { text: asset.id + " · 当前对象" })),
          h("figure", null, ui.media({ src: compareAsset.file.url, alt: compareAsset.alt }), h("figcaption", { text: compareAsset.id + " · 同组比较" }))));
        caption.textContent = "同组并置不代表同一遗址或同一年代";
      } else {
        var img = h("img", { src: asset.file.url, alt: asset.alt, width: asset.file.width, height: asset.file.height, decoding: "async" });
        frame.appendChild(img);
        if (mode === "detail") {
          frame.classList.add("zoom");
          caption.textContent = "放大模式只放大原图，不补纹、不补缺、不改变器形";
        } else {
          caption.textContent = "按原图比例完整显示，色彩为原图原色";
        }
      }
      Array.prototype.forEach.call(tools.children, function (btn) {
        var on = btn.dataset.mode === mode;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    [["whole", "整体"], ["detail", "放大"], ["compare", "比较"]].forEach(function (item) {
      tools.appendChild(h("button", {
        type: "button", dataset: { mode: item[0] }, text: item[1],
        disabled: item[0] === "compare" && !compareAsset,
        onclick: function () { mode = item[0]; paintMedia(); },
      }));
    });
    paintMedia();

    return h("section.page.record", null,
      h("div.record__media", null, tools, frame, caption),
      h("div.record__copy", null,
        ui.link("/atlas", "go-link", [h("span", { "aria-hidden": "true", text: "←" }), "返回完整图鉴"]),
        h("p.eyebrow", null, "对象档案", h("span.en", { text: asset.id })),
        h("h1", { text: asset.title, tabindex: "-1" }),

        h("section.public-reading", { "aria-label": "公众阅读提示" },
          h("article", null, h("small", { text: "这是什么" }), h("p", { text: asset.groupLabel + "中的一项开放图像记录，来源于" + (asset.source.institution || "已登记来源机构") + "。" })),
          h("article", null, h("small", { text: "先看哪里" }), h("p", { text: reading.firstLook })),
          h("article", null, h("small", { text: "为什么重要" }), h("p", { text: reading.significance })),
          h("article", null, h("small", { text: "它不能证明" }), h("p", { text: reading.boundary }))),

        h("p.note-strip", null, h("span", null, h("b", { text: "本图边界：" }), asset.editorial.factBoundary)),
        ui.goLink(reading.related, "把对象放回文明长卷继续阅读"),

        h("details.disclosure", null,
          h("summary", { text: "资料档案：技术、版权与核验记录" }),
          h("div.disclosure__body", null,
            h("dl.spec-list", null,
              h("div", null, h("dt", { text: "身份状态" }), h("dd", { text: asset.groupLabel })),
              h("div", null, h("dt", { text: "来源机构" }), h("dd", { text: asset.source.institution || "资料未载" })),
              h("div", null, h("dt", { text: "摄影／作者" }), h("dd", { text: asset.source.creator || "资料未载" })),
              h("div", null, h("dt", { text: "原始尺寸" }), h("dd", { text: asset.source.originalDimensions || "资料未载" })),
              h("div", null, h("dt", { text: "网页图像" }), h("dd", { text: asset.file.width + " × " + asset.file.height + "px · " + asset.quality.grade + " 级" })),
              h("div", null, h("dt", { text: "开放许可" }), h("dd", null, asset.rights.licenseUrl
                ? h("a.text-link", { href: asset.rights.licenseUrl, target: "_blank", rel: "noreferrer", text: asset.rights.license + " ↗" })
                : asset.rights.license || "资料未载")),
              h("div", null, h("dt", { text: "资产哈希" }), h("dd.hash", { text: asset.file.sha256 }))),
            h("blockquote", { text: asset.rights.attribution, style: { color: "var(--ink-soft)", fontSize: "var(--fs-meta)" } }),
            asset.source.landingPage ? h("a.text-link", { href: asset.source.landingPage, target: "_blank", rel: "noreferrer", text: "打开原始来源页 ↗" }) : null)),

        h("p", { style: { color: "var(--muted)", fontSize: "var(--fs-meta)" }, text: "网站只作响应式缩放，不加统一滤镜、不补纹、不补缺、不改变器形。馆藏红山器物不自动等于牛河梁出土。" }),

        related.length ? h("section.record__related", null,
          h("header", null, ui.eyebrow("继续比较"), h("p", { text: "同组对象", style: { margin: "6px 0 0", color: "var(--muted)", fontSize: "var(--fs-meta)" } })),
          h("div.record__related-grid", null, related.map(function (item) {
            return ui.link("/atlas/" + item.id, "hover-lift", [
              ui.media({ src: item.file.url, alt: "" }),
              h("small", { text: item.id }),
              h("b", { text: item.title }),
            ]);
          }))) : null));
  }

  function render(route, assets) {
    if (route.slug) {
      var asset = assets.find(function (a) { return a.id === route.slug; });
      if (asset) return record(asset, assets);
    }
    return index(route, assets);
  }

  window.DC = Object.assign(window.DC || {}, { pages: Object.assign(window.DC.pages || {}, { atlas: render }) });
})();
