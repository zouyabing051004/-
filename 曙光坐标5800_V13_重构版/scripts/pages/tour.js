/* ============================================================
   公众导览 — 3 分钟快速路线 / 7 幕完整路线
   每幕只承载：幕号 → 一个问题 → 一句结论 → 一个证据边界 → 下一步。
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;

  /* 图片身份边界（与 V12 完全一致，逐幕对应） */
  var BOUNDARIES = {
    T01: "AI生成策展意象｜非遗址实景、非建筑复原",
    T02: "MAP_ENV_003 · 当代辽西景观｜非史前原貌",
    T03: "AI生成材料模型／设计示意｜不表达台基真实位置",
    T04: "A014 · 国家博物馆比较标本｜非女神庙出土",
    T05: "AX025 · 辽宁省博物馆馆藏展示｜非墓葬原位图",
    T06: "AI生成理论地景模型｜不表达518网格真实分布",
    T07: "MAP_ENV_004 · 当代区域景观｜非遗址本体照片",
  };

  var CHECK_NOTES = [
    "5800是帮助定位研究问题的约数入口，不是统一建成年份。",
    "11、15.6、22米描述三圈直径，必须保留‘约’。",
    "518统计发现陶片的调查网格，不是遗址数量。",
    "66是专题研究限定样本，不能外推为全遗址总数。",
    "牛河梁属于红山文化遗址系列预备名单的一部分，尚非世界遗产。",
  ];

  function render(route) {
    var mode = route.query.get("mode") === "quick" ? "quick" : "full";
    var index = 0;
    var root = h("section.tour");

    function scenesFor(m) {
      return m === "quick"
        ? D.tourScenes.filter(function (s) { return ["T01", "T03", "T06"].indexOf(s.id) !== -1; })
        : D.tourScenes.slice();
    }

    function setMode(next, startAt) {
      mode = next;
      index = startAt || 0;
      D.router.replaceQuery("/tour?mode=" + next);
      paint();
    }

    /* 快速路线走完 T01/T03/T06 后，接着看的应该是还没看过的那 4 幕，
       而不是从 T01 重头再来一遍。 */
    function firstUnseenIndex() {
      var seen = D.store.get().visited;
      for (var i = 0; i < D.tourScenes.length; i++) {
        if (seen.indexOf(D.tourScenes[i].id) === -1) return i;
      }
      return 0;
    }

    /* 每当一幕被显示，就记入导览足迹（包含进入页面时的第一幕） */
    function recordVisit(sceneItem) {
      var fullIndex = D.tourScenes.findIndex(function (s) { return s.id === sceneItem.id; });
      var state = D.store.get();
      var visited = state.visited.slice();
      var isNew = visited.indexOf(sceneItem.id) === -1;
      if (isNew) visited.push(sceneItem.id);
      if (isNew || state.scene !== fullIndex) D.store.set({ scene: Math.max(0, fullIndex), visited: visited });
    }

    function go(next) {
      var list = scenesFor(mode);
      index = Math.max(0, Math.min(list.length - 1, next));
      paint();
      var heading = root.querySelector("h1");
      if (heading) heading.focus();
    }

    function paint() {
      var list = scenesFor(mode);
      var current = list[Math.min(index, list.length - 1)];
      var guide = D.tourGuides[current.id];
      var last = index === list.length - 1;
      recordVisit(current);
      D.clear(root);

      /* 左：一张强视觉图 */
      /* 器物幕不再被当成背景裁切：玉器、塑像放在深色陈列台上完整显示 */
      var kind = ui.imagePresentation(current.image);
      root.appendChild(h("div.tour__stage.is-" + kind, null,
        h("img", { src: ui.mediaUrl(current.image), alt: current.alt, decoding: "async", fetchpriority: "high" }),
        h("div.tour__stage-scrim", { "aria-hidden": "true" }),
        h("div.tour__stage-copy.on-dark", null,
          h("p.tour__act", null,
            "第 " + String(index + 1).padStart(2, "0") + " 幕",
            h("em", { text: "／共 " + String(list.length).padStart(2, "0") + " 幕 · " + current.duration })),
          h("h1", { text: current.title, tabindex: "-1" }),
          h("p.tour__question", { text: current.question }),
          ui.boundary(BOUNDARIES[current.id] || "开放许可图片｜身份与事实边界见来源页"))));

      /* 右：非常克制的说明区 */
      var panel = h("div.tour__panel", null,
        h("div.tour__topline", null,
          ui.link("/", "go-link", [h("span", { "aria-hidden": "true", text: "←" }), "返回首页"]),
          h("span", { text: mode === "quick" ? "快速路线 · 约 3 分钟" : "完整路线 · 7 分 20 秒" })),

        h("div.segmented", { "aria-label": "选择导览方式" },
          h("button", { type: "button", class: mode === "quick" ? "active" : "", "aria-pressed": mode === "quick" ? "true" : "false", text: "快速认识 · 3 幕", onclick: function () { setMode("quick"); } }),
          h("button", { type: "button", class: mode === "full" ? "active" : "", "aria-pressed": mode === "full" ? "true" : "false", text: "完整导览 · 7 幕", onclick: function () { setMode("full"); } })),

        h("div.tour__progress", { "aria-label": "导览进度 " + (index + 1) + " / " + list.length },
          list.map(function (item, i) {
            return h("button", {
              type: "button",
              class: i <= index ? "seen" : "",
              "aria-current": i === index ? "step" : null,
              "aria-label": "第 " + (i + 1) + " 幕：" + item.title,
              onclick: function () { go(i); },
            }, h("span", { "aria-hidden": "true" }), h("small", { "aria-hidden": "true", text: String(i + 1) }));
          })),

        h("div.tour__takeaway", { "aria-live": "polite" },
          h("b", { text: "本幕结论" }),
          h("blockquote", { text: current.conclusion })),

        h("div.tour__background", null,
          h("b", { text: "一分钟背景" }),
          h("p", { text: guide.background }),
          ui.goLink(guide.href, "继续深入：" + guide.label)),

        h("div.tour__background", null,
          ui.evidenceBadge("known"),
          h("p", { text: "本幕保留一道问题、一个判断、背景说明与可回查来源。" }),
          ui.sourceLinks(current.sourceIds)));

      /* 快速路线结尾：三个坐标小结 */
      if (mode === "quick" && last) {
        var seenCount = D.store.get().visited.length;
        var restCount = Math.max(0, D.tourScenes.length - seenCount);
        panel.appendChild(h("div.tour__handoff", null,
          h("b", { text: "你已经完成 " + Math.min(seenCount, D.tourScenes.length) + " 幕快速导览" }),
          h("p", { text: restCount > 0 ? "还有 " + restCount + " 幕可以继续探索。" : "七幕都已看过，可以任选一幕回看。" })));
        panel.appendChild(h("div.tour__summary", null,
          h("p.label", { text: "你已经获得的三个坐标", style: { margin: 0, color: "var(--muted)", fontSize: "var(--fs-meta)", fontWeight: "700" } }),
          h("ol", null,
            [["5800", "是时间入口，不是统一建成年份"],
             ["九台", "让公共工程成为可测量证据"],
             ["2026", "让生活与礼仪关系重新成为问题"]].map(function (item) {
              return h("li", null, h("b", { text: item[0] }), h("span", { text: item[1] }));
            }))));
      }

      /* 完整路线结尾：五个知识检查 */
      if (mode === "full" && last) {
        var answers = Object.assign({}, D.store.get().answers);
        var quiz = h("div.quiz", null);
        D.knowledgeCheck.forEach(function (item, qi) {
          var verdict = h("p.verdict", { role: "status" });
          function paintVerdict() {
            if (answers[qi] === undefined) { verdict.hidden = true; return; }
            verdict.hidden = false;
            var right = answers[qi] === item.answer;
            verdict.className = "verdict " + (right ? "correct" : "incorrect");
            D.clear(verdict);
            verdict.appendChild(h("b", { text: right ? "回答正确" : "再想一想" }));
            verdict.appendChild(document.createTextNode(CHECK_NOTES[qi]));
          }
          var set = h("fieldset", null, h("legend", { text: (qi + 1) + ". " + item.q }));
          item.options.forEach(function (option, oi) {
            set.appendChild(h("label", null,
              h("input", {
                type: "radio", name: "q" + qi, checked: answers[qi] === oi,
                onchange: function () { answers[qi] = oi; D.store.set({ answers: answers }); paintVerdict(); },
              }),
              h("span", { text: option })));
          });
          set.appendChild(verdict);
          paintVerdict();
          quiz.appendChild(set);
        });
        /* 收尾不再挤在右栏：整幅展开「走完七幕 → 五道检查 → 生成笔记」 */
        root.classList.add("is-finale");
        var finale = h("section.tour__finale", null,
          h("div.page.tour__finale-inner", null,
            h("header.tour__finale-head", null,
              ui.eyebrow("完整导览 · 07 / 07"),
              h("h2", { text: "你已经走完七幕", style: { marginTop: "12px" } }),
              h("p", { text: "下面五道检查不评分，只用来确认几个最容易被读错的口径。答完即可生成属于你的考古笔记。" })),
            quiz,
            h("div.tour__finale-actions", null,
              ui.link("/notebook", "btn btn--primary", "生成我的考古笔记 →"),
              ui.link("/lab", "btn btn--ghost", "去证据实验室亲手验证"))));
        root.appendChild(finale);
      }

      /* 下一步 */
      var controls = h("div.tour__controls", null,
        h("button.btn.btn--ghost", { type: "button", disabled: index === 0, text: "← 上一幕", onclick: function () { go(index - 1); } }));
      if (!last) {
        controls.appendChild(h("button.btn.btn--primary", { type: "button", text: "下一幕 →", onclick: function () { go(index + 1); } }));
      } else if (mode === "quick") {
        var jump = firstUnseenIndex();
        var rest = D.tourScenes.length - D.store.get().visited.length;
        controls.appendChild(h("button.btn.btn--primary", {
          type: "button",
          text: rest > 0 ? "继续补完其余 " + rest + " 幕 →" : "进入完整导览 →",
          onclick: function () { setMode("full", jump); },
        }));
        controls.appendChild(h("button.btn.btn--quiet.tour__restart", {
          type: "button", text: "从头查看完整 7 幕", onclick: function () { setMode("full", 0); },
        }));
      } else {
        controls.appendChild(ui.link("/notebook", "btn btn--primary", "生成我的考古笔记 →"));
      }
      panel.appendChild(controls);
      root.appendChild(panel);
    }

    paint();
    return root;
  }

  window.DC = Object.assign(window.DC || {}, { pages: Object.assign(window.DC.pages || {}, { tour: render }) });
})();
