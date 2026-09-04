/* ============================================================
   presentation — 每张图片的呈现身份（显式声明，不再用正则猜）

   object   器物 / 馆藏标本 / 独立遗物  → contain，完整器形，中性陈列台，禁止无理由裁切
   scene    遗址 / 地景 / 环境 / 田野现场 → cover，允许构图裁切
   diagram  示意图 / 信息图 / 研究模型   → contain，不得裁掉文字，保持可读

   分类依据：图片主体是「一件可以被端起来看的东西」，还是「一处需要放眼望去的地方」，
   或者是「一张需要读的图」。未列出的路径回落到 scene。
   ============================================================ */
(function () {
  "use strict";

  var OBJECT = [
    /artifacts_sites\//,              /* 核心文物：玉器、陶器、石器、塑像、展陈 */
    /artifacts_sites_expanded\//,     /* 扩展器物图鉴 */
    /early_culture_sequence\//,       /* 文化序列比较标本 */
  ];

  /* diagram：带标注、文字必须完整可读的示意图。
     目前站内的两张示意图（辽西相对位置、地层与测年）都改为自绘 SVG/HTML，
     不再有位图示意图；规则保留，便于日后新增时直接登记。 */
  var DIAGRAM = [];

  /* 明确的例外：这些属于「场景」，虽然落在器物目录里 */
  var SCENE_EXCEPTIONS = [
    /A016_neolithic_tomb_display/,        /* 墓葬复原陈列：是一处布景，不是一件器物 */
    /A018_|A019_/,                        /* 赤峰红山遗址群实景 */
    /A020_hongshan_culture_museum/,       /* 博物馆建筑实景 */
    /jade_burial_group|jade_group_/,      /* 整柜随葬组合陈列：多件并置的展柜场景 */
    /MX002_charred_food_crust_microscope/,/* 显微照片：视作方法场景 */
  ];

  function presentationOf(src) {
    var s = String(src || "");
    for (var d = 0; d < DIAGRAM.length; d++) if (DIAGRAM[d].test(s)) return "diagram";
    for (var e = 0; e < SCENE_EXCEPTIONS.length; e++) if (SCENE_EXCEPTIONS[e].test(s)) return "scene";
    for (var o = 0; o < OBJECT.length; o++) if (OBJECT[o].test(s)) return "object";
    return "scene";
  }

  window.DC = Object.assign(window.DC || {}, { presentationOf: presentationOf });
})();
