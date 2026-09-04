/* ============================================================
   来源与方法 / 无障碍声明 — 研究附录式版式
   全部事实、来源 ID、来源 URL、许可与下载均原样保留，只是下沉、不再抢首页视觉权重。
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;

  var GLOSSARY = [
    ["红山文化", "主要分布于辽西及邻近地区的新石器时代考古学文化。文化名称不是单一族群的自称。"],
    ["地点编号", "考古工作为遗址区内不同地点建立的研究索引，不是史前名称，也不天然代表等级。"],
    ["样本", "为回答特定问题而纳入统计或分析的材料范围；样本数不等于遗址全部数量。"],
    ["口径", "数字所对应的对象、范围、单位、时间与统计方法。离开口径，精确数字也可能误导。"],
    ["比较标本", "用于比较器形、材质或技术的馆藏对象，不等同于牛河梁直接出土。"],
    ["原位", "材料在考古现场被发现时的空间位置与关联关系，是判断语境的重要依据。"],
    ["BP / cal BP", "BP以1950年为基点表示距今年代；cal BP通常指经过校正的年代，二者不能随意混写。"],
    ["初步判断", "基于现阶段材料提出、仍可能被新调查或新分析修正的认识。"],
    ["预备名单", "申报世界遗产前的候选阶段，不等于已经列入《世界遗产名录》。"],
    ["OBS / SYN / INF / OPEN", "本站区分记录事实、综合判断、研究解释与尚未确认，帮助读者看见结论离材料有多远。"],
  ];

  var SHEETS = [
    ["01", "使用说明", "版本、术语、使用边界与核验日期", "17项"],
    ["02", "事实陈述", "陈述、口径、证据等级、限定词与来源", "50条"],
    ["03", "来源清单", "发布机构、标题、等级与原始链接", "28项"],
    ["04", "口径冲突", "容易混淆的数字、状态与推荐写法", "8组"],
    ["05", "图片主数据", "尺寸、哈希、来源、许可、事实边界", "90张"],
    ["06", "AI辅助资产", "工具、提示词摘要、用途与非证据声明", "6项"],
    ["07", "开放许可清单", "公开图片落点、署名与许可核验", "93条"],
  ];

  var RAW_FILES = [
    ["data/fact_claims.csv", "事实陈述 CSV"],
    ["data/fact_sources.csv", "来源清单 CSV"],
    ["data/fact_conflicts.csv", "口径冲突 CSV"],
    ["data/assets.json", "图片主数据 JSON"],
    ["data/ai-assets.json", "AI辅助资产 JSON"],
    ["data/master_manifest_open_license.csv", "开放许可清单 CSV"],
    ["data/ATTRIBUTION_OPEN_LICENSE.md", "逐张署名清单 MD"],
    ["data/shuguang5800_research_database.xlsx", "V11研究资料库 XLSX"],
  ];

  function principles() {
    var items = [
      { no: "01", src: "assets/environment_methods_expanded/MX006_archaeological_photogrammetry_fieldwork.webp", alt: "考古摄影测量野外记录方法示例", cap: "MX006 · 摄影测量方法示例｜非牛河梁现场",
        title: "源头修正，统一输出", body: "事实、图片和页面从同一主数据源生成。精确数字必须同时带单位、对象、样本、口径与来源。" },
      { no: "02", src: "assets/environment_methods_expanded/MX008_archaeological_sieving.webp", alt: "考古发掘中的筛选作业方法示例", cap: "MX008 · 筛选作业方法示例｜非牛河梁现场",
        title: "以物证说话", body: "不盲目复原，不以馆藏比较标本冒充牛河梁出土，不用科技效果替代内容。" },
      { no: "03", src: "assets/generated/three-rings-study.webp", alt: "AI生成的三重环形土石材料关系设计示意", cap: "AI生成材料模型／设计示意｜非遗址测绘与建筑复原",
        title: "AI 只进入非证据层", body: "序厅、章节过渡、报告底图与明确标示的研究模型可使用 AI 视觉；AI 不生成文物照片、考古数据或未经说明的历史事实。" },
    ];
    return h("div.principle-grid", null, items.map(function (item) {
      return h("article.principle", null,
        ui.media({ src: item.src, alt: item.alt, kind: "scene" }),
        ui.boundary(item.cap),
        h("span.no", { text: item.no }),
        h("h3", { text: item.title }),
        h("p", { text: item.body }));
    }));
  }

  function claims() {
    return h("div.claim-grid", null, D.evidenceCards.map(function (card) {
      var assetId = card.image.assetId;
      var figure = h("span.media.media--" + (card.image.fit === "contain" ? "object" : "scene"), null,
        h("img", { src: ui.mediaUrl(card.image.src), alt: card.image.alt, loading: "lazy", decoding: "async",
          style: card.image.objectPosition ? { objectPosition: card.image.objectPosition } : null }),
        h("span.claim__kind", { text: card.image.kind }));
      return h("article.claim", null,
        assetId ? ui.link("/atlas/" + assetId, "", figure, { "aria-label": "在开放图鉴查看 " + assetId + " 的图片资料" }) : figure,
        h("div.claim__copy", null,
          h("span.ids", { text: card.id + " · " + card.claimIds.join(" + ") }),
          h("h3", { text: card.title }),
          h("p", { text: card.statement }),
          h("div.claim__limit", null, h("b", { text: "不要误读" }), h("p", { text: card.boundary })),
          ui.boundary(card.image.caption),
          ui.sourceLinks(card.sourceIds)));
    }));
  }

  function sourcesView() {
    return h("section.page.appendix", null,
      h("header.page-intro", null,
        ui.eyebrow("来源、版权与方法", "SOURCES & METHOD"),
        h("h1", { text: "来源与方法", tabindex: "-1" }),
        h("p", { text: "把证据等级、限定词、图片版权和 AI 使用范围公开，是本站内容的一部分，而不是页脚免责。" })),

      h("section", null, ui.sectionHead({ eyebrow: "三条工作原则", title: "我们如何决定写什么、不写什么", split: true, lede: "越是想让公众记住，越要说明这句话是怎么来的。" }), principles()),

      h("section", null,
        ui.sectionHead({ eyebrow: "核心证据卡", eyebrowEn: "20 VERIFIED CLAIMS", title: "每一句结论，都带着它的边界", split: true,
          lede: "20 张卡片同时回答「我们如何知道」和「它不能证明什么」。" }),
        claims()),

      h("section", null,
        ui.sectionHead({ eyebrow: "核心来源", eyebrowEn: "SOURCE REGISTER", title: "可以逐条回查的来源清单", split: true,
          lede: "完整 50 条事实、20 项文化来源、8 项技术来源与 8 组口径冲突，可在开放数据文件中继续核验。" }),
        h("div.source-register", null, D.sources.map(function (source) {
          return h("a", { href: source.url, target: "_blank", rel: "noreferrer" },
            h("span.id", { text: source.id }),
            h("b", { text: source.title }),
            h("em", { text: source.publisher }),
            h("span.grade", { text: source.grade + " ↗" }));
        }))),

      h("section", null,
        ui.sectionHead({ eyebrow: "公众阅读术语", eyebrowEn: "READING TOOLS", title: "术语是工具，不是门槛", split: true,
          lede: "它们帮助你识别一句话属于事实、解释，还是仍然开放的问题。" }),
        h("div.glossary-grid", null, GLOSSARY.map(function (item) {
          return h("article", null, h("b", { text: item[0] }), h("p", { text: item[1] }));
        }))),

      h("section.workbook", { "aria-labelledby": "workbook-title" },
        h("div.workbook__head", null,
          h("div", null,
            ui.eyebrow("开放研究数据表", "OPEN RESEARCH WORKBOOK · V12"),
            h("h2#workbook-title", { text: "一个可筛选的完整工作簿", style: { margin: "12px 0 8px" } }),
            h("p", { text: "将本站的事实、来源、口径、图片许可与 AI 说明统一收进一个 Excel 工作簿。适合公众核验、教师备课与评审审查。", style: { margin: 0, color: "var(--ink-soft)" } })),
          h("a.workbook__dl", { href: "downloads/曙光坐标5800_开放研究数据_v12.xlsx", download: "" },
            h("span", { text: "XLSX · 约 103 KB" }), h("b", { text: "下载完整工作簿 ↓" }))),
        h("table.sheet-table", null,
          h("thead", null, h("tr", null, h("th", { text: "工作表" }), h("th", { text: "包含内容" }), h("th", { text: "公开记录" }))),
          h("tbody", null, SHEETS.map(function (row) {
            return h("tr", null,
              h("td", null, h("span.no", { text: row[0] }), h("b", { text: row[1] })),
              h("td", { text: row[2] }), h("td", { text: row[3] }));
          }))),
        h("details.disclosure", null,
          h("summary", { text: "机器读取文件与历史版资料库" }),
          h("div.disclosure__body", null,
            h("div.raw-files", null, RAW_FILES.map(function (file) {
              return h("a", { href: file[0], text: file[1] });
            }))))),

      h("div.independence", null,
        h("b", { text: "独立作品声明" }),
        h("p", { text: "本项目为独立数字文化与竞赛作品，不代表牛河梁遗址、博物馆、考古机构或 UNESCO 官方立场。最近事实核验：2026-07-16。" })));
  }

  function accessibilityView() {
    return h("section.page.appendix", null,
      h("header.page-intro", null,
        ui.eyebrow("无障碍声明", "WCAG 2.2 AA"),
        h("h1", { text: "无障碍声明", tabindex: "-1" }),
        h("p", { text: "我们希望公众无需特定设备、操作方式或考古背景，也能进入这座数字展览。" })),

      h("div.principle-grid", null,
        [["01", "可感知", "证据图片提供替代文本；色彩不单独承担意义；正文对比度与 200% 缩放按照 WCAG 2.2 AA 设计。公众可读信息不使用 12px 以下字号。"],
         ["02", "可操作", "导航、筛选、实验和报告流程支持键盘；交互目标不小于 44 像素；站点不劫持滚动、不强制声音。"],
         ["03", "可理解", "所有数据实验都有可读文字等价内容，已知、推断与未知使用文字标签，系统的「减少动态效果」偏好会被尊重。"]].map(function (item) {
          return h("article.principle", null, h("span.no", { text: item[0] }), h("h3", { text: item[1] }), h("p", { text: item[2] }));
        })),

      h("article.a11y-example", null,
        h("figure", null,
          ui.media({ src: "assets/artifacts_sites/A001_jade_dragon_pei_npm.webp", alt: "红山文化玉龙形佩，台北故宫博物院陈列的馆藏比较标本", width: 1920, height: 1280 }),
          ui.boundary("A001 · 红山文化馆藏比较标本｜不能标注为牛河梁出土", "figcaption")),
        h("div", null,
          ui.eyebrow("可访问的对象记录"),
          h("h2", { text: "图片不是装饰：对象、来源与边界必须一起被读到", style: { margin: "12px 0 20px" } }),
          h("dl.spec-list", null,
            h("div", null, h("dt", { text: "替代文本" }), h("dd", { text: "红山文化玉龙形佩，台北故宫博物院陈列的馆藏比较标本" })),
            h("div", null, h("dt", { text: "开放许可" }), h("dd", { text: "CC0 1.0" })),
            h("div", null, h("dt", { text: "事实边界" }), h("dd", { text: "文件页仅确认红山文化属性，不能据此写成牛河梁出土。" }))),
          h("div", { style: { marginTop: "20px" } }, ui.link("/atlas/A001", "btn btn--ghost", "查看完整对象记录 →")))),

      h("section", null,
        ui.sectionHead({ eyebrow: "已知限制与反馈", title: "我们还没有解决的问题", split: true }),
        h("p", { text: "部分来源页由外部机构维护，其可访问性不由本站控制。浏览器端 PNG 报告使用系统可用中文字体，不同设备可能出现细微字形差异，但不影响内容。", style: { color: "var(--ink-soft)" } }),
        h("p", { text: "若你发现键盘焦点、替代文本、颜色对比或缩放问题，请在提交材料所列项目联系渠道中反馈，并附上浏览器、设备和页面路径。", style: { color: "var(--ink-soft)" } }),
        h("p.note-strip", null, h("span", null, h("b", { text: "最近复核：" }), "2026-07-15　·　", h("b", { text: "目标：" }), "WCAG 2.2 AA"))));
  }

  window.DC = Object.assign(window.DC || {}, {
    pages: Object.assign(window.DC.pages || {}, { sources: sourcesView, accessibility: accessibilityView }),
  });
})();
