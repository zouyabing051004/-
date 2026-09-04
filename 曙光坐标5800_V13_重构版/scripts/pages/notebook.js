/* ============================================================
   我的考古笔记 — 数字田野札记 / FIELD NOTE
   学习记录只保存在本机 localStorage；1080×1920 报告改为独立版式，
   与网站品牌一致，不再复用首页序厅图。
   ============================================================ */
(function () {
  "use strict";
  var D = window.DC, h = D.h, ui = D.ui;
  var PUBLIC_URL = D.site.canonicalUrl;   /* 唯一来源：scripts/site-config.js */

  var OPEN_QUESTIONS = [
    "建筑原貌与仪式过程，仍不能由现存材料完整补全。",
    "生活与礼仪活动在区域景观中如何交叠？",
  ];

  /* ---------- 1080 × 1920 报告 ---------- */
  function drawReport(stats, confirmed, canvas) {
    var W = 1080, H = 1920;
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);

    var PAPER = "#F3EEE4", INK = "#171A17", MUTED = "#5F5850",
        JADE = "#2F5A4E", CINNABAR = "#A44A35", STONE = "#81776B";
    var SERIF = '"Noto Serif SC","Source Han Serif SC","Songti SC","STSong","SimSun",serif';
    var SANS = '"Noto Sans SC","Source Han Sans SC","PingFang SC","Microsoft YaHei",sans-serif';
    var MONO = 'ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace';
    var X = 112, RIGHT = 992, COL = RIGHT - X;

    /* 纸底 + 横格 */
    ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(23,26,23,.055)"; ctx.lineWidth = 1;
    for (var gy = 240.5; gy < H - 120; gy += 46) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
    /* 装订线 */
    ctx.fillStyle = "rgba(164,74,53,.5)"; ctx.fillRect(62, 0, 2, H);
    ctx.fillStyle = STONE; ctx.globalAlpha = .45;
    for (var by = 60; by < H - 60; by += 44) ctx.fillRect(46, by, 5, 14);
    ctx.globalAlpha = 1;

    /* 品牌印记：玉璧双环 + 地层线 + 曙光弧 + 坐标点 */
    function seal(cx, cy, r, color) {
      ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = "round";
      ctx.lineWidth = r * .075; ctx.beginPath(); ctx.arc(cx, cy, r * .855, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = .42; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(cx, cy, r * .53, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.lineWidth = r * .07; ctx.beginPath(); ctx.moveTo(cx - r * .77, cy + r * .235); ctx.lineTo(cx + r * .77, cy + r * .235); ctx.stroke();
      ctx.globalAlpha = .4; ctx.lineWidth = r * .05; ctx.beginPath(); ctx.moveTo(cx - r * .54, cy + r * .46); ctx.lineTo(cx + r * .54, cy + r * .46); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.lineWidth = r * .08; ctx.beginPath(); ctx.arc(cx, cy + r * .235, r * .415, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy + r * .235, r * .105, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    function wrap(text, x, y, maxWidth, lineHeight, maxLines) {
      var line = "", lines = [];
      for (var i = 0; i < text.length; i++) {
        var next = line + text[i];
        if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = text[i]; }
        else line = next;
      }
      if (line) lines.push(line);
      if (maxLines && lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].slice(0, -1) + "…"; }
      lines.forEach(function (item, i) { ctx.fillText(item, x, y + i * lineHeight); });
      return lines.length * lineHeight;
    }

    function rule(y) { ctx.strokeStyle = "rgba(23,26,23,.2)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X, y + .5); ctx.lineTo(RIGHT, y + .5); ctx.stroke(); }
    function label(no, text, y) {
      ctx.fillStyle = CINNABAR; ctx.font = "700 24px " + MONO; ctx.fillText(no, X, y);
      ctx.fillStyle = MUTED; ctx.font = "700 24px " + SANS; ctx.fillText(text, X + 54, y);
    }

    /* 页眉 */
    seal(X + 30, 132, 30, JADE);
    ctx.fillStyle = INK; ctx.font = "600 36px " + SERIF; ctx.fillText("曙光坐标·5800", X + 76, 128);
    ctx.fillStyle = MUTED; ctx.font = "22px " + SANS; ctx.fillText("红山—牛河梁文明交互志", X + 76, 162);
    ctx.fillStyle = MUTED; ctx.font = "500 20px " + MONO; ctx.textAlign = "right";
    ctx.fillText("FIELD NOTE", RIGHT, 128); ctx.textAlign = "left";
    rule(196);

    /* 标题与数字 */
    ctx.fillStyle = INK; ctx.font = "600 82px " + SERIF; ctx.fillText("我的考古笔记", X, 320);
    ctx.fillStyle = MUTED; ctx.font = "22px " + SANS; ctx.fillText("这里记录你确认过的结论、仍保留的问题，以及下一步可以走向哪里。", X, 366);
    ctx.fillStyle = JADE; ctx.font = "600 160px " + SERIF; ctx.fillText("5800", X, 540);
    ctx.fillStyle = MUTED; ctx.font = "24px " + SANS;
    ctx.fillText("知识检查 答对 " + stats.correct + " / 5（已答 " + stats.answered + " / 5）　·　已收藏实验 " + stats.collected + " / 5　·　导览足迹 " + stats.visited + " / 7", X, 596);
    rule(640);

    /* 01 我确认的结论 */
    label("01", confirmed.length > 3 ? "我确认的结论（本次报告摘要 · 3 条代表性结论，共 " + confirmed.length + " 条）" : "我确认的结论", 704);
    var y = 764;
    if (confirmed.length) {
      confirmed.slice(0, 3).forEach(function (item, i) {
        ctx.fillStyle = CINNABAR; ctx.font = "700 26px " + MONO; ctx.fillText("0" + (i + 1), X, y);
        ctx.fillStyle = INK; ctx.font = "34px " + SERIF;
        y += wrap(item, X + 62, y, COL - 62, 50, 4) + 34;
      });
    } else {
      ctx.fillStyle = MUTED; ctx.font = "32px " + SERIF;
      y += wrap("尚未收藏结论：完成任意一个证据实验后，第一条可核验结论就会出现在这里。", X, y, COL, 48, 2) + 24;
    }

    /* 02 仍然开放的问题 */
    var y2 = Math.max(y + 72, 1150);
    rule(y2 - 56);
    label("02", "仍然开放的问题", y2);
    ctx.fillStyle = INK; ctx.font = "30px " + SERIF;
    var qy = y2 + 56;
    OPEN_QUESTIONS.forEach(function (q) { qy += wrap(q, X, qy, COL, 46, 2) + 16; });

    /* 03 我的下一站 */
    var y3 = Math.max(qy + 72, 1470);
    label("03", "我的下一站", y3);
    ctx.fillStyle = INK; ctx.font = "600 40px " + SERIF;
    ctx.fillText(stats.collected < 5 ? "继续完成五个证据实验" : "回到开放图鉴，比较器物语境", X, y3 + 64);

    /* 二维码与页脚 */
    function finish() {
      ctx.fillStyle = MUTED; ctx.font = "20px " + MONO;
      ctx.fillText(PUBLIC_URL.replace("https://", ""), X, 1836);
      ctx.fillStyle = STONE; ctx.font = "20px " + SANS;
      ctx.fillText("独立数字文化与竞赛作品 · 不代表遗址、博物馆、考古机构或 UNESCO 官方立场", X, 1874);
      rule(1790);
      return new Promise(function (resolve) { canvas.toBlob(resolve, "image/png"); });
    }

    return new Promise(function (resolve) {
      var qr = new Image();
      qr.onload = function () {
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(796, 1616, 196, 196);
        ctx.strokeStyle = "rgba(23,26,23,.18)"; ctx.strokeRect(796.5, 1616.5, 195, 195);
        ctx.drawImage(qr, 810, 1630, 168, 168);
        resolve(finish());
      };
      qr.onerror = function () { resolve(finish()); };
      qr.src = D.assetUrl("assets/generated/site-qr.png");
    });
  }

  /* ---------- 页面 ---------- */
  function render() {
    var state = D.store.get();
    var root = h("section.page.notebook");

    function paint() {
      state = D.store.get();
      var confirmed = state.collected.slice(0, 5)
        .map(function (id) { var lab = D.labs.find(function (l) { return l.id === id; }); return lab && lab.conclusion; })
        .filter(Boolean);
      /* 两个指标必须分开：correct = 答对几题，answered = 已答几题。
         此前封面与报告用 correct、顶部进度用 answered，会出现「知识检查 5/5」但实际只对 2 题。 */
      var correct = D.knowledgeCheck.reduce(function (total, item, i) { return total + (state.answers[i] === item.answer ? 1 : 0); }, 0);
      var answered = Object.keys(state.answers).length;
      var hasProgress = state.visited.length > 0 || state.collected.length > 0 || answered > 0;
      var canGenerate = confirmed.length > 0;
      var stats = { correct: correct, answered: answered, collected: state.collected.length, visited: state.visited.length };

      D.clear(root);
      root.appendChild(h("header.page-intro", null,
        ui.eyebrow("我的学习档案", "FIELD NOTE"),
        h("h1", { text: "我的考古笔记", tabindex: "-1" }),
        h("p", { text: "这里不奖励「记住标准答案」，而是记录你确认过的结论、仍保留的问题，以及可以继续走向哪里。内容只保存在当前浏览器。" })));

      root.appendChild(h("div.note-progress", { "aria-label": "当前学习进度" },
        h("article", null, h("small", { text: "导览足迹" }), h("b", null, String(state.visited.length), h("span", { text: "/ 7 幕" }))),
        h("article", null, h("small", { text: "完成实验" }), h("b", null, String(state.collected.length), h("span", { text: "/ 5 项" }))),
        h("article", null,
          h("small", { text: "知识检查" }),
          h("b", null, String(correct), h("span", { text: "/ 5 题答对" })),
          h("em.note-progress__sub", { text: "已完成 " + answered + " / 5 题" }))));

      if (!hasProgress) {
        root.appendChild(h("section.first-run", null,
          h("div", null,
            h("small", { text: "第一次来这里？", style: { color: "var(--muted)" } }),
            h("h2", { text: "先完成一段短体验，笔记才会真正属于你。", style: { margin: "8px 0" } }),
            h("p", { text: "快速导览帮助建立三个坐标；证据实验则会生成第一条可核验结论。", style: { margin: 0, color: "var(--ink-soft)" } })),
          h("div.actions", null,
            ui.link("/tour?mode=quick", "btn btn--primary", "3 分钟快速认识"),
            ui.link("/lab", "btn btn--ghost", "选择一个证据实验"))));
      }

      /* 札记封面：独立视觉，不复用序厅图 */
      var cover = h("div.note-cover", null,
        h("div.note-cover__paper", { "aria-hidden": "true" }),
        h("div.note-cover__head", null,
          h("small", { text: "FIELD NOTE · 个人学习档案" }),
          h("b", { text: "我的考古笔记" })),
        h("div", null,
          h("div.note-cover__num", { text: "5800" }),
          h("div.note-cover__stats", null,
            h("span", { text: "知识检查　答对 " + correct + " / 5　·　已答 " + answered + " / 5" }),
            h("span", { text: "已收藏实验　" + state.collected.length + " / 5" }),
            h("span", { text: "导览足迹　" + state.visited.length + " / 7" }))),
        ui.noteStamp());

      var confirmSection = h("section.note-section", null, h("p.label", { text: "01 · 我确认的结论" }));
      if (confirmed.length) {
        confirmed.forEach(function (item, i) {
          confirmSection.appendChild(h("div.note-item", null, h("b", { text: "0" + (i + 1) }), h("p", { text: item })));
        });
      } else {
        confirmSection.appendChild(ui.link("/lab", "note-empty", ["完成一个证据实验，第一条结论会出现在这里", h("span", { "aria-hidden": "true", text: "→" })]));
      }

      var reportBtn = h("button.btn.btn--primary", {
        type: "button",
        disabled: !canGenerate,
        title: canGenerate ? null : "完成至少一个证据实验后即可生成",
        text: canGenerate ? "生成 1080 × 1920 报告 PNG" : "完成一个实验后生成报告",
      });
      var canvas = h("canvas", { hidden: true });
      reportBtn.addEventListener("click", function () {
        if (!canGenerate) return;
        reportBtn.disabled = true; reportBtn.textContent = "正在生成…";
        drawReport(stats, confirmed, canvas).then(function (blob) {
          if (blob) {
            var url = URL.createObjectURL(blob);
            var link = document.createElement("a");
            link.href = url; link.download = "曙光坐标5800_我的考古笔记.png";
            document.body.appendChild(link); link.click();
            /* 延后移除：过早移除锚点会让部分浏览器丢掉 download 指定的文件名 */
            window.setTimeout(function () { link.remove(); URL.revokeObjectURL(url); }, 1500);
          }
          reportBtn.disabled = false; reportBtn.textContent = "生成 1080 × 1920 报告 PNG";
        });
      });

      var shareBtn = h("button.btn.btn--ghost", { type: "button", text: "分享公开网站" });
      shareBtn.addEventListener("click", function () {
        if (navigator.share) {
          navigator.share({ title: D.site.name, text: D.site.shareText, url: PUBLIC_URL })
            .then(function () { shareBtn.textContent = "已打开分享"; })
            .catch(function () { shareBtn.textContent = "分享公开网站"; });
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(PUBLIC_URL).then(function () { shareBtn.textContent = "网址已复制 ✓"; });
        } else {
          shareBtn.textContent = PUBLIC_URL.replace("https://", "");
        }
      });

      root.appendChild(h("div.note-layout", null, cover,
        h("div.note-content", null,
          confirmSection,
          h("section.note-section.note-open", null,
            h("p.label", { text: "02 · 仍然开放的问题" }),
            OPEN_QUESTIONS.map(function (q) { return h("blockquote", { text: q }); })),
          h("section.note-section", null,
            h("p.label", { text: "03 · 我的下一站" }),
            ui.goLink(state.collected.length < 5 ? "/lab" : "/atlas",
              state.collected.length < 5 ? "继续完成五个证据实验" : "进入开放图鉴比较对象语境")),
          h("div.note-actions", null, reportBtn, shareBtn,
            h("button.note-reset", {
              type: "button", text: "重置学习记录",
              onclick: function () {
                if (window.confirm("确定清空本机保存的导览进度、收藏和回答吗？此操作无法撤销。")) { D.store.reset(); paint(); }
              },
            }),
            canvas))));
    }

    paint();
    return root;
  }

  window.DC = Object.assign(window.DC || {}, { pages: Object.assign(window.DC.pages || {}, { notebook: render }) });
})();
