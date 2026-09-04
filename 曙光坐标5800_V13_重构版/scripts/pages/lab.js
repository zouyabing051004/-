/* ============================================================
   证据实验室 — 五个实验（全站唯一的深色沉浸模式）
   交互逻辑、数值与边界文案全部沿用 V12，未作任何事实层改写。
   统一布局：左 65% 交互画布 / 右 35% 实时读数 → 操作后进入浅色结论区。
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;

  function stateRow(label, value) {
    var cls = value === "直接记录" ? "direct" : value === "多证据支持" || value === "多证据并置" ? "supported"
      : value === "尚未确认" || value === "尚未进入" ? "open" : "limited";
    return h("div", null, h("span", { text: label }), h("em", { class: cls, text: value }));
  }

  /* ---------- LAB 01 · 时间坐标 ---------- */
  function coordinateVisual() {
    var bands = [
      { id: "framework", range: "约 5800—5200 年前", title: "阶段框架", body: "“5800”帮助公众进入古国时代第一阶段的讨论；它是一段时间框架，不是单一事件的纪年。", known: "可用来定位研究问题与文化进程。", boundary: "不能把阶段起点写成所有遗迹的统一建成年份。" },
      { id: "centre", range: "约 5800—5300 cal BP", title: "礼仪中心时间窗", body: "测年研究把牛河梁大型礼仪中心的主要活动放入一个有上下界的时间窗。不同对象仍需回到各自样本与测年语境。", known: "可比较不同遗迹和材料进入研究叙事的先后。", boundary: "不能从区间中任取一个年份，替代具体样本的测年结果。" },
      { id: "change", range: "约 5300 cal BP 以后", title: "变化与延续", body: "礼仪中心式微并不等于区域生活立即停止。新的调查把聚落、日用陶片与礼仪景观重新放在一起讨论。", known: "可讨论礼仪中心变化与区域聚落延续。", boundary: "不能将‘式微’简化为文明突然消失。" },
    ];
    var active = 0;
    var yearLabel = h("small", { text: bands[0].range });
    var reading = h("div", { "aria-live": "polite" });
    var tabs = h("div.time-bands", { role: "tablist", "aria-label": "三个时间口径" });

    var canvas = h("div.lab-canvas", null,
      h("div.canvas-art", { "aria-hidden": "true" }, h("img", { src: "assets/generated/hero-strata-dawn.webp", alt: "" })),
      h("div.canvas-scrim", { "aria-hidden": "true" }),
      h("div.time-scene", null, h("div.time-window", null,
        h("b", { text: "5800" }),
        yearLabel,
        h("small", { text: "约数 · 区间 · 研究口径", style: { opacity: ".7" } }))),
      h("p.canvas-note", { text: "AI生成的地层与曙光策展意象｜非遗址实景、非建筑复原" }));

    function paint() {
      var band = bands[active];
      yearLabel.textContent = band.range;
      D.clear(reading);
      reading.appendChild(h("h3", { text: band.title }));
      reading.appendChild(h("p", { text: band.body, style: { marginBottom: "16px" } }));
      reading.appendChild(ui.boundaryPair(band.known, band.boundary));
      Array.prototype.forEach.call(tabs.children, function (btn, i) {
        btn.classList.toggle("active", i === active);
        btn.setAttribute("aria-selected", i === active ? "true" : "false");
      });
    }
    bands.forEach(function (band, i) {
      tabs.appendChild(h("button", { type: "button", role: "tab", onclick: function () { active = i; paint(); } },
        h("b", { text: band.range }), h("span", { text: band.title })));
    });

    var inspector = h("div.lab-inspector", null,
      h("p.label", { text: "选择一个时间口径" }),
      h("p.lab-hint", { text: "年代不是一条可以任意拖动的直线：三个范围分别回答文化阶段、礼仪中心活动与后来的变化。" }),
      tabs, reading);
    paint();
    return { canvas: canvas, inspector: inspector };
  }

  /* ---------- LAB 02 · 九台营造 ---------- */
  function platformVisual() {
    var generic = function (n) {
      return {
        title: "第" + n + "台基：关系节点",
        fact: "它属于已确认的台基系统；公开资料未为这一节点提供可直接展示的完整尺度。",
        metrics: [["台基关系", "进入整体讨论"], ["具体尺度", "公开资料有限"], ["上部形态", "尚未确认"]],
        confirm: "可确认它进入至少九座台基的整体讨论。",
        boundary: "编号不代表史前名称，也不能据此推定等级。",
      };
    };
    var records = {
      2: { title: "2号台基：尺度成为证据", fact: "南北64.61米、东西约41.39米；土石混筑，方向正南正北。", metrics: [["尺度与方向", "直接记录"], ["土石材料", "直接记录"], ["上部形态", "尚未确认"]], confirm: "尺寸、方向与材料让公共工程成为可测量证据。", boundary: "工程体量不直接等于国家政体，劳动力规模也不能无依据补算。" },
      9: { title: "9号台基：女神庙所在", fact: "女神庙位于9号台基；地点关系可以确认，人物身份仍属于解释层。", metrics: [["地点关系", "直接记录"], ["礼仪空间", "多证据支持"], ["人物身份", "尚未确认"]], confirm: "建筑与塑像材料支持礼仪空间判断。", boundary: "不能由现代称谓反推史前人物姓名与完整仪式。" },
    };
    var platform = 2;
    var grid = h("div.node-grid", { "aria-label": "选择九座台基关系节点" });
    var panel = h("div", { "aria-live": "polite" });

    function paint() {
      var record = records[platform] || generic(platform);
      D.clear(panel);
      panel.appendChild(h("h3", { text: record.title }));
      panel.appendChild(h("p", { text: record.fact, style: { marginBottom: "16px" } }));
      panel.appendChild(h("div.state-list", null, record.metrics.map(function (m) { return stateRow(m[0], m[1]); })));
      panel.appendChild(h("div", { style: { marginTop: "16px" } }, ui.boundaryPair(record.confirm, record.boundary)));
      Array.prototype.forEach.call(grid.children, function (btn, i) {
        var on = platform === i + 1;
        btn.classList.toggle("selected", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    for (var i = 1; i <= 9; i++) {
      (function (n) {
        grid.appendChild(h("button", {
          type: "button", "aria-label": "查看第" + n + "台基的证据说明",
          onclick: function () { platform = n; paint(); },
        }, "P" + String(n).padStart(2, "0"), h("span", { text: "关系节点" })));
      })(i);
    }

    var canvas = h("div.lab-canvas", null,
      h("div.canvas-art", { "aria-hidden": "true" },
        h("picture", null,
          h("source", { srcset: "assets/generated/nine-platforms-study.avif", type: "image/avif" }),
          h("img", { src: "assets/generated/nine-platforms-study.webp", alt: "" }))),
      h("div.canvas-scrim", { "aria-hidden": "true" }),
      h("div.canvas-title", null,
        h("small", { text: "RELATION MATRIX" }),
        h("b", { text: "九台关系档案" }),
        h("span", { text: "3 × 3 仅为交互索引，不表达真实空间位置" })),
      grid,
      h("p.canvas-note", { text: "AI生成材料模型／设计示意｜不表达台基真实位置、数量比例与建筑原貌" }));

    var inspector = h("div.lab-inspector", null,
      h("p.label", { text: "当前节点" }),
      h("p.lab-hint", { text: "点击任一台基，这里会更新可确认的信息。" }),
      panel);
    paint();
    return { canvas: canvas, inspector: inspector };
  }

  /* ---------- LAB 03 · 证据镜片 ---------- */
  function lensVisual() {
    var layers = [
      { code: "OBS", label: "记录事实", text: "建筑遗迹与泥塑人像、动物塑像等材料可以被记录。", cues: [["材料关系", "直接记录"], ["解释程度", "尚未进入"], ["开放问题", "较少"]], active: 1 },
      { code: "SYN", label: "综合判断", text: "多类材料共同支持这里存在高度发展的礼仪空间。", cues: [["材料关系", "多证据并置"], ["解释程度", "形成判断"], ["开放问题", "仍需保留"]], active: 2 },
      { code: "INF", label: "研究解释", text: "祖先观念、礼仪秩序与社会组织，是需要被来源与限定词约束的解释方向。", cues: [["材料关系", "间接关联"], ["解释程度", "研究推论"], ["开放问题", "明显增加"]], active: 3 },
      { code: "OPEN", label: "尚未确认", text: "塑像是谁、仪式如何进行、建筑完整原貌怎样，仍未被现有材料直接回答。", cues: [["材料关系", "不足以回答"], ["解释程度", "停止补全"], ["开放问题", "明确列出"]], active: 3 },
    ];
    var layer = 0;
    var veil = h("div.lens-veil.l0", { "aria-hidden": "true" });
    var stack = h("div.lens-stack", { "aria-label": "材料组合示意" });
    var stackItems = ["建筑遗迹", "泥塑残件", "语境关系"].map(function (label) {
      var node = h("span", null, h("i", { "aria-hidden": "true" }), label);
      stack.appendChild(node);
      return node;
    });
    var tabs = h("div.lens-tabs", { role: "tablist", "aria-label": "证据层级" });
    var panel = h("div", { id: "lens-panel", role: "tabpanel", "aria-live": "polite" });

    function paint() {
      var current = layers[layer];
      veil.className = "lens-veil l" + layer;
      stackItems.forEach(function (node, i) { node.classList.toggle("active", i < current.active); });
      D.clear(panel);
      panel.appendChild(h("p.lab-hint", { text: "证据镜片 " + (layer + 1) + " / 4" }));
      panel.appendChild(h("h3", { text: current.label }));
      panel.appendChild(h("p", { text: current.text, style: { marginBottom: "16px" } }));
      panel.appendChild(h("div.state-list", null, current.cues.map(function (c) { return stateRow(c[0], c[1]); })));
      panel.appendChild(h("p.lab-hint", { text: "这不是分数表。镜片越向解释移动，限定词、来源与尚未回答的问题越重要。", style: { marginTop: "16px" } }));
      Array.prototype.forEach.call(tabs.children, function (btn, i) {
        btn.classList.toggle("active", i === layer);
        btn.setAttribute("aria-selected", i === layer ? "true" : "false");
      });
    }
    layers.forEach(function (item, i) {
      tabs.appendChild(h("button", {
        type: "button", role: "tab", id: "lens-tab-" + i, "aria-controls": "lens-panel",
        onclick: function () { layer = i; paint(); },
      }, item.label, h("small", { text: item.code })));
    });

    var canvas = h("div.lab-canvas", null,
      h("div.lens-frame", null,
        h("figure", null,
          h("img", { src: "assets/artifacts_sites/A014_pregnant_female_torso_national_museum_china.webp", alt: "中国国家博物馆陈列的红山文化陶塑比较标本" }),
          veil)),
      stack,
      h("p.canvas-note", { text: "A014 · 国家博物馆史前女性陶塑比较标本｜不是牛河梁女神庙出土塑像" }));

    var inspector = h("div.lab-inspector", null,
      h("p.label", { text: "切换证据镜片" }), tabs, panel);
    paint();
    return { canvas: canvas, inspector: inspector };
  }

  /* ---------- LAB 04 · 66 座墓葬样本 ---------- */
  function tombVisual() {
    var filter = "all";
    var SETS = {
      all:  ["66", "限定研究样本", "37座有玉／29座无玉"],
      jade: ["37", "有玉墓", "样本记录，合计145件玉器"],
      none: ["29", "无玉墓", "66 − 37 的衍生值"],
    };
    var matrix = h("div.tomb-matrix", { role: "img" });
    var cells = [];
    for (var i = 0; i < 66; i++) {
      var cell = h("span", null, h("i", { "aria-hidden": "true", text: String(i + 1) }));
      cells.push(cell);
      matrix.appendChild(cell);
    }
    var readout = h("div", { "aria-live": "polite" });
    var seg = h("div.segmented", { "aria-label": "墓葬样本分类" });

    function paint() {
      cells.forEach(function (cell, index) {
        var hasJade = index < 37;
        var focused = filter === "all" || (filter === "jade" && hasJade) || (filter === "none" && !hasJade);
        cell.className = (hasJade ? "with-jade" : "without-jade") + (focused ? "" : " muted");
      });
      var set = SETS[filter];
      matrix.setAttribute("aria-label", "66座限定研究样本，其中37座有玉、29座无玉；当前查看" + set[1]);
      D.clear(readout);
      readout.appendChild(h("p.label", { text: "当前查看" }));
      readout.appendChild(h("p", { style: { color: "var(--dawn-bright)", fontFamily: "var(--serif)", fontSize: "48px", lineHeight: "1", margin: "6px 0" }, text: set[0] }));
      readout.appendChild(h("h3", { text: set[1] }));
      readout.appendChild(h("p", { text: set[2] }));
      Array.prototype.forEach.call(seg.children, function (btn) {
        var on = btn.dataset.filter === filter;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    [["all", "全部样本 66"], ["jade", "有玉 37"], ["none", "无玉 29"]].forEach(function (item) {
      seg.appendChild(h("button", { type: "button", dataset: { filter: item[0] }, text: item[1], onclick: function () { filter = item[0]; paint(); } }));
    });

    var canvas = h("div.lab-canvas", null,
      h("div.tomb-canvas", null,
        h("div.tomb-strip", null,
          h("figure", null,
            ui.media({ src: "assets/artifacts_sites_expanded/AX025_jade_burial_group_liaoning_02.webp", alt: "辽宁省博物馆红山文化玉器随葬主题陈列，用于观察器物组合", kind: "scene" }),
            h("figcaption", { text: "AX025 · 玉器随葬主题陈列｜不是66座墓的原位记录" })),
          h("figure", null,
            ui.media({ src: "assets/artifacts_sites_expanded/AX006_jade_group_liaoning_03.webp", alt: "辽宁省博物馆红山文化玉器组合陈列，用于器类比较", kind: "scene" }),
            h("figcaption", { text: "AX006 · 玉器组合陈列｜不对应页面中的具体墓号" }))),
        matrix,
        h("p.canvas-note", { style: { position: "static" }, text: "一格代表一座纳入统计的墓；方格只用于计数，不代表墓葬的真实位置、年代或大小。" })));

    var inspector = h("div.lab-inspector", null,
      h("p.label", { text: "筛选并比较限定样本" }), seg, readout,
      h("div.state-list", null,
        h("div", null, h("span", { text: "N16M4" }), h("em.supported", { text: "墓葬规格较高" })),
        h("div", null, h("span", { text: "N2Z1M21" }), h("em.direct", { text: "玉器20件 · 最多" }))),
      h("p.lab-hint", { text: "「玉器件数最多」与「墓葬规格较高」是两个不同结论，不能互相替代。" }),
      h("table.data-table", { style: { marginTop: "8px" } },
        h("caption", { text: "图形的文字等价内容" }),
        h("thead", null, h("tr", null, h("th", { text: "分类" }), h("th", { text: "数量" }), h("th", { text: "口径" }))),
        h("tbody", null,
          h("tr", null, h("td", { text: "有玉墓" }), h("td", { text: "37" }), h("td", { text: "专题研究样本的记录" })),
          h("tr", null, h("td", { text: "无玉墓" }), h("td", { text: "29" }), h("td", { text: "由66减37得到的计算结果" })))));
    paint();
    return { canvas: canvas, inspector: inspector };
  }

  /* ---------- LAB 05 · 2026 区域调查 ---------- */
  function surveyVisual() {
    var metrics = {
      area:   ["31.076", "km² · 系统调查范围", "统计调查覆盖的面积", "不是遗址核心区的建筑面积"],
      cell:   ["50 × 50", "m · 单个调查网格", "说明田野记录的基本尺度", "不是一处遗址的固定大小"],
      grids:  ["518", "发现陶片的网格数", "记录哪些网格发现了陶片", "不是518处遗址，也不是陶片总数"],
      groups: ["5", "聚落群分析线索", "用于讨论材料聚集关系", "不是5座城市，年代仍需继续约束"],
    };
    var layer = "after";
    var metric = "grids";
    var field = h("div.survey-field", { "aria-hidden": "true" });
    var cells = [];
    for (var i = 0; i < 96; i++) { var c = h("i"); cells.push(c); field.appendChild(c); }
    var insight = h("div.survey-insight", { "aria-live": "polite" });
    var grid = h("div.metric-grid", { "aria-label": "选择一个数字" });
    var detail = h("div", { "aria-live": "polite" });
    var toggle = h("div.segmented", { "aria-label": "认识变化" });

    function paint() {
      cells.forEach(function (cell, index) {
        var found = layer === "after" ? (index % 2 === 0 || index % 7 === 0) : (index % 11 === 0);
        cell.className = found ? "found" : "";
      });
      D.clear(insight);
      insight.appendChild(h("small", { text: layer === "before" ? "较早认识" : "2026 区域调查" }));
      insight.appendChild(h("p", { text: layer === "before"
        ? "旧认识常把礼仪中心与日常生活截然分开。"
        : "系统调查让生活材料进入同一景观讨论，但尚不能给出每个聚落群的完整年代。" }));
      var current = metrics[metric];
      D.clear(detail);
      detail.appendChild(h("p.label", { text: "当前口径" }));
      detail.appendChild(h("div", { style: { marginTop: "8px" } }, ui.boundaryPair("它统计：" + current[2], "不代表：" + current[3])));
      Array.prototype.forEach.call(grid.children, function (btn) {
        var on = btn.dataset.metric === metric;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      Array.prototype.forEach.call(toggle.children, function (btn) {
        var on = btn.dataset.layer === layer;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    Object.keys(metrics).forEach(function (key) {
      grid.appendChild(h("button", { type: "button", dataset: { metric: key }, onclick: function () { metric = key; paint(); } },
        h("b", { text: metrics[key][0] }), h("span", { text: metrics[key][1] })));
    });
    [["before", "旧认识"], ["after", "2026调查"]].forEach(function (item) {
      toggle.appendChild(h("button", { type: "button", dataset: { layer: item[0] }, text: item[1], onclick: function () { layer = item[0]; paint(); } }));
    });

    var canvas = h("div.lab-canvas", null,
      h("div.canvas-art", { "aria-hidden": "true" },
        h("picture", null,
          h("source", { srcset: "assets/generated/survey-landscape-study.avif", type: "image/avif" }),
          h("img", { src: "assets/generated/survey-landscape-study.webp", alt: "" }))),
      h("div.canvas-scrim", { "aria-hidden": "true" }),
      field,
      h("div.survey-toggle", null, toggle),
      insight,
      h("p.canvas-note", { text: "AI生成理论地景＋抽样概念示意｜深浅方格不表达数量、密度或真实位置，非调查底图" }));

    var inspector = h("div.lab-inspector", null,
      h("p.label", { text: "点击一个数字" }),
      h("p.lab-hint", { text: "数字必须带着统计口径出现。" }),
      grid, detail);
    paint();
    return { canvas: canvas, inspector: inspector };
  }

  var VISUALS = { coordinate: coordinateVisual, engineering: platformVisual, lens: lensVisual, tomb: tombVisual, survey: surveyVisual };

  /* ---------- 实验目录 ---------- */
  function index() {
    return h("div.lab-page.on-night", null,
      h("section.page.lab-index", null,
        h("header.page-intro", null,
          ui.eyebrow("五个证据实验", "EVIDENCE LAB"),
          h("h1", { text: "证据实验室" }),
          h("p", { text: "每个实验都从一个公众问题开始，经过操作、判断、解释与边界，最后回到来源。" })),
        h("div.lab-cards", null, D.labs.map(function (lab, i) {
          var guide = D.labGuides[lab.id];
          return ui.link("/lab/" + lab.slug, "lab-card", [
            h("span.media.media--scene.lab-card__media", { "aria-hidden": "true" },
              h("img", { src: ui.mediaUrl(lab.image), alt: "", loading: i === 0 ? "eager" : "lazy", decoding: "async", style: lab.objectPosition ? { objectPosition: lab.objectPosition } : null })),
            h("span.lab-card__copy", null,
              h("span.no", { text: lab.no + " · " + guide.duration + " · " + guide.interaction }),
              h("h2", { text: lab.title }),
              h("p", { text: lab.question }),
              h("span.promise", { text: guide.promise }),
              ui.boundary(lab.imageLabel)),
            h("span.lab-card__go", { "aria-hidden": "true", text: "→" }),
          ]);
        }))));
  }

  /* ---------- 实验详情 ---------- */
  function detail(lab) {
    var guide = D.labGuides[lab.id];
    var visual = (VISUALS[lab.id] || surveyVisual)();
    var next = D.labs[(D.labs.indexOf(lab) + 1) % D.labs.length];

    var collectBtn = h("button.collect-btn", { type: "button" });
    function paintCollect() {
      var collected = D.store.get().collected.indexOf(lab.id) !== -1;
      collectBtn.classList.toggle("collected", collected);
      collectBtn.setAttribute("aria-pressed", collected ? "true" : "false");
      collectBtn.textContent = collected ? "已收入考古笔记 ✓" : "收入我的考古笔记 ＋";
    }
    collectBtn.addEventListener("click", function () {
      var state = D.store.get();
      var collected = state.collected.indexOf(lab.id) !== -1;
      D.store.set({ collected: collected ? state.collected.filter(function (id) { return id !== lab.id; }) : state.collected.concat([lab.id]) });
      paintCollect();
    });
    paintCollect();

    return D.frag(
      h("div.lab-page.on-night", null,
        h("div.page", null,
          h("header.lab-head", null,
            ui.link("/lab", "go-link", [h("span", { "aria-hidden": "true", text: "←" }), "五个实验"]),
            h("p.no", { text: lab.no }),
            h("h1", { text: lab.title, tabindex: "-1" }),
            h("blockquote", { text: lab.question })),
          h("section.lab-steps", { "aria-label": "实验开始说明" },
            h("div.lab-steps__meta", null,
              h("small", { text: guide.duration + " · " + guide.interaction }),
              h("b", { text: "你会得到什么" }),
              h("p", { text: guide.promise })),
            h("ol", null, guide.steps.map(function (step, i) {
              return h("li", null, h("span", { text: "0" + (i + 1) }), h("p", { text: step }));
            }))),
          h("div.lab-stage", null, visual.canvas, visual.inspector),
          h("p.media-boundary", { text: lab.imageLabel, style: { marginBottom: "64px" } }))),

      h("div.lab-debrief", null,
        h("div.page.inner", null,
          h("div.recap.wide", null,
            h("small", { text: "你刚才比较了什么" }),
            h("p", { text: lab.instruction })),
          h("article", null, ui.evidenceBadge("known"), h("h2", { text: "现有证据支持什么", style: { margin: "12px 0" } }), h("p", { text: lab.conclusion })),
          h("article", null, ui.evidenceBadge("unknown"), h("h2", { text: "现有证据还不能说明什么", style: { margin: "12px 0" } }), h("p", { text: lab.boundary })),
          h("section.wide", null,
            ui.eyebrow("为什么要这样解释"),
            h("h2", { text: lab.id === "tomb" ? "为什么不能只按玉器数量给墓主人「排等级」？" : "把操作结果放回考古语境", style: { margin: "12px 0 16px" } }),
            guide.deepDive.map(function (item) { return h("p", { text: item, style: { color: "var(--ink-soft)" } }); }),
            ui.goLink("/chronicle/" + guide.relatedChapter.slug, "回到文明长卷：" + guide.relatedChapter.label)),
          h("div.lab-collect.wide", null, ui.sourceLinks(lab.sourceIds), collectBtn),
          h("nav.next-nav.wide", { "aria-label": "实验导航" },
            h("div", null, h("small", { text: "下一个证据实验" }), h("b", { text: next.title })),
            ui.link("/lab/" + next.slug, "btn btn--ghost", "继续 →")))));
  }

  function render(route) {
    var lab = route.slug && D.labs.find(function (l) { return l.slug === route.slug; });
    return lab ? detail(lab) : index();
  }

  window.DC = Object.assign(window.DC || {}, { pages: Object.assign(window.DC.pages || {}, { lab: render }) });
})();
