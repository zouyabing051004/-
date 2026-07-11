/*!
 * 知节 Zhijie · 传统文化智能体 悬浮挂件
 * 嵌入方式：在页面任意位置加 <script src="…/zhijie-widget.js"></script>
 * 或将本文件内容包在 <script>…</script> 里粘贴进秒哒"自定义 HTML"组件。
 *
 * 渐进增强（同一段代码，能力随后端配置自动升级）：
 *   ① culture-agent-chat 已部署且配置 DEEPSEEK_API_KEY
 *      → DeepSeek 对话 + 数据库 500 首知识库检索（最佳）
 *   ② 仅执行了迁移 00005/00006（未配 DeepSeek）
 *      → 文心(multimodal-chat) 对话 + 数据库知识库检索
 *   ③ 什么都没做（今天的线上状态）
 *      → 文心对话 + 挂件内置精选知识库（20首三重校准 + 节气表）
 * 配图/小视频走已部署的 minimax-text-to-image / kling 函数，开箱即用。
 *
 * 可选配置（在本脚本之前定义）：
 *   window.ZHIJIE_CONFIG = { supabaseUrl: "…", anonKey: "…", language: "zh|en|bilingual" }
 */
(function () {
  "use strict";
  if (window.__zhijieWidgetLoaded) return;
  window.__zhijieWidgetLoaded = true;

  var CFG = Object.assign({
    supabaseUrl: "https://backend.appmiaoda.com/projects/supabase320478069733244928",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDk1ODM1MTI2LCJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwic3ViIjoiYW5vbiJ9.iKorflFSe7jdx_50T14hKpAZ1oSn0JQb8W_pduqpLOs",
    language: null
  }, window.ZHIJIE_CONFIG || {});

  var FN = function (name) { return CFG.supabaseUrl + "/functions/v1/" + name; };
  var HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + CFG.anonKey,
    "apikey": CFG.anonKey
  };

  // ---------------- 内置兜底知识库（精选层节选：题/作者/原文/拼音/英译） ----------------
  var MINI_POEMS = window.__ZHIJIE_MINI_POEMS || [];
  var MINI_TERMS = window.__ZHIJIE_MINI_TERMS || [];

  // ---------------- 状态 ----------------
  var LS_KEY = "zhijie-widget-profile";
  var profile = { language: CFG.language || "zh", recentTopics: [] };
  try {
    var saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (saved && saved.language) profile = saved;
    if (CFG.language) profile.language = CFG.language;
  } catch (e) { /* ignore */ }
  function saveProfile() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(profile)); } catch (e) { /* ignore */ }
  }

  var history = [];
  var busy = false;
  var serverMode = null; // null=未探测 true=culture-agent-chat 可用 false=降级

  var T = {
    zh: {
      title: "知节 · 文化小伙伴", hint: "问我节气诗词，或说：画一幅…",
      greeting: "你好呀，我是知节 🌾\n我会讲二十四节气、教古诗（带拼音），还能为诗句画画、做小视频。试试问我：教我读《静夜思》",
      send: "发送", thinking: "研墨中…", drawing: "落笔作画中（约20秒）…", animating: "让画面动起来（约1-2分钟）…",
      imgDone: "画好啦！（AI生成）", vidDone: "小视频做好啦！（AI生成）",
      err: "哎呀，我暂时想不起来了，稍等再试试吧！", genErr: "生成出了点小问题，换个说法试试？",
      speak: "🔊 读给我听", stop: "⏹ 停止"
    },
    en: {
      title: "Zhijie · Culture Buddy", hint: "Ask about poems, or say: draw…",
      greeting: "Hi! I'm Zhijie 🌾\nI teach Chinese poems with pinyin, tell solar-term stories, and can paint or animate them. Try: Teach me the moon poem!",
      send: "Send", thinking: "Thinking…", drawing: "Painting (about 20s)…", animating: "Animating (1-2 min)…",
      imgDone: "Done! (AI-generated)", vidDone: "Your little video is ready! (AI-generated)",
      err: "Oops, please try again in a moment!", genErr: "Something went wrong — try different words?",
      speak: "🔊 Read aloud", stop: "⏹ Stop"
    },
    bilingual: {
      title: "知节 Zhijie", hint: "中文或 English 都可以",
      greeting: "你好呀，我是知节！Hi, I'm Zhijie! 🌾\n双语教古诗、讲节气，还能作画做视频。\nTry: 教我读《静夜思》 / Teach me the moon poem",
      send: "发送 Send", thinking: "研墨中 Thinking…", drawing: "落笔中 Painting…", animating: "生成视频中 Animating…",
      imgDone: "画好啦 Done! (AI)", vidDone: "视频好啦 Ready! (AI)",
      err: "哎呀出错了 Oops, try again!", genErr: "生成失败 Generation failed — try again?",
      speak: "🔊 读给我听 Read", stop: "⏹ 停止 Stop"
    }
  };
  function t() { return T[profile.language] || T.zh; }

  // ---------------- Shadow DOM UI ----------------
  var host = document.createElement("div");
  host.id = "zhijie-widget-host";
  document.body.appendChild(host);
  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var style = document.createElement("style");
  style.textContent = [
    ":host{all:initial}",
    "*{box-sizing:border-box;font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif}",
    ".ball{position:fixed;right:22px;bottom:22px;width:58px;height:58px;border-radius:50%;background:#2e6b4f;color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:2147483000;border:none;transition:transform .15s}",
    ".ball:hover{transform:scale(1.07)}",
    ".panel{position:fixed;right:22px;bottom:92px;width:min(378px,calc(100vw - 32px));height:min(560px,calc(100vh - 120px));background:#f8f5ec;border-radius:16px;box-shadow:0 12px 44px rgba(0,0,0,.28);display:none;flex-direction:column;overflow:hidden;z-index:2147483001}",
    ".panel.on{display:flex}",
    ".head{background:linear-gradient(115deg,#1f4f3a,#2e6b4f 62%,#7a6430);color:#f4f0e4;padding:12px 14px;display:flex;align-items:center;gap:10px}",
    ".head .icon{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;font-size:16px}",
    ".head .name{font-size:14px;font-weight:650;flex:1;line-height:1.3}",
    ".head .name small{display:block;font-weight:400;font-size:10.5px;opacity:.8}",
    ".langs{display:flex;gap:3px}",
    ".langs button{border:0;background:rgba(255,255,255,.16);color:#fff;font-size:10.5px;padding:3px 8px;border-radius:99px;cursor:pointer}",
    ".langs button.on{background:#f4f0e4;color:#1f4f3a;font-weight:600}",
    ".close{border:0;background:transparent;color:rgba(255,255,255,.85);font-size:17px;cursor:pointer;padding:2px 4px}",
    ".log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}",
    ".m{max-width:86%;padding:8px 11px;border-radius:11px;font-size:13.5px;line-height:1.6;white-space:pre-wrap;word-break:break-word}",
    ".m.bot{align-self:flex-start;background:#fff;border:1px solid #e2dcc8;border-bottom-left-radius:3px;color:#2b322c}",
    ".m.user{align-self:flex-end;background:#2e6b4f;color:#fff;border-bottom-right-radius:3px}",
    ".m img,.m video{max-width:100%;border-radius:8px;margin-top:6px;display:block}",
    ".m .cap{font-size:10px;color:#8a8a7a;margin-top:3px}",
    ".m .spk{border:0;background:none;color:#2e6b4f;font-size:11px;cursor:pointer;padding:3px 0 0;display:block}",
    ".chips{display:flex;gap:6px;flex-wrap:wrap;padding:0 12px 6px}",
    ".chips button{border:1px solid #d8d2bd;background:#fff;color:#2e6b4f;font-size:11.5px;border-radius:99px;padding:4px 10px;cursor:pointer}",
    ".foot{display:flex;gap:7px;padding:10px;border-top:1px solid #e2dcc8;background:#fdfbf4}",
    ".foot input{flex:1;border:1px solid #d8d2bd;border-radius:99px;padding:8px 13px;font-size:13px;outline:none;background:#fff;color:#2b322c}",
    ".foot button{border:0;background:#2e6b4f;color:#fff;border-radius:99px;padding:0 15px;font-size:13px;cursor:pointer}",
    ".foot button:disabled{opacity:.45}",
    ".note{font-size:9.5px;color:#9a967f;text-align:center;padding:0 10px 7px;background:#fdfbf4}"
  ].join("\n");
  root.appendChild(style);

  var ball = document.createElement("button");
  ball.className = "ball";
  ball.setAttribute("aria-label", "打开文化智能体");
  ball.textContent = "🌾";
  root.appendChild(ball);

  var panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML =
    '<div class="head">' +
    '<div class="icon">节</div>' +
    '<div class="name"><span id="zj-title"></span><small id="zj-sub"></small></div>' +
    '<div class="langs">' +
    '<button data-l="zh">中</button><button data-l="en">EN</button><button data-l="bilingual">双</button>' +
    '</div>' +
    '<button class="close" aria-label="关闭">✕</button>' +
    '</div>' +
    '<div class="log" id="zj-log"></div>' +
    '<div class="chips" id="zj-chips"></div>' +
    '<div class="foot"><input id="zj-in"><button id="zj-send"></button></div>' +
    '<div class="note">AI 生成内容 · 诗词原文来自站内 500 首知识库</div>';
  root.appendChild(panel);

  var $ = function (sel) { return panel.querySelector(sel); };
  var logEl = $("#zj-log"), inEl = $("#zj-in"), sendBtn = $("#zj-send");

  function applyLang() {
    $("#zj-title").textContent = t().title;
    $("#zj-sub").textContent = profile.language === "en" ? "Chinese Culture AI" : "传统文化智能体";
    inEl.placeholder = t().hint;
    sendBtn.textContent = t().send;
    panel.querySelectorAll(".langs button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-l") === profile.language);
    });
    var chips = profile.language === "en"
      ? ["Teach me the moon poem", "Draw plum blossoms", "What is Chinese New Year?"]
      : ["教我读《静夜思》", "画一幅梅花", "小暑是什么？"];
    var chipsEl = $("#zj-chips");
    chipsEl.innerHTML = "";
    chips.forEach(function (c) {
      var b = document.createElement("button");
      b.textContent = c;
      b.onclick = function () { send(c); };
      chipsEl.appendChild(b);
    });
  }
  panel.querySelectorAll(".langs button").forEach(function (b) {
    b.onclick = function () {
      profile.language = b.getAttribute("data-l");
      saveProfile(); applyLang(); addBot(t().greeting);
    };
  });

  var opened = false;
  ball.onclick = function () {
    opened = !opened;
    panel.classList.toggle("on", opened);
    ball.textContent = opened ? "✕" : "🌾";
    if (opened && !logEl.childNodes.length) addBot(t().greeting);
    if (opened) inEl.focus();
  };
  panel.querySelector(".close").onclick = function () { ball.onclick(); };

  function addMsg(cls, text) {
    var d = document.createElement("div");
    d.className = "m " + cls;
    d.textContent = text;
    logEl.appendChild(d);
    logEl.scrollTop = logEl.scrollHeight;
    return d;
  }
  function addBot(text) { return withSpeak(addMsg("bot", text), text); }
  function withSpeak(el, text) {
    var btn = document.createElement("button");
    btn.className = "spk"; btn.type = "button";
    btn.textContent = t().speak;
    btn.onclick = function () { speak(text, btn); };
    el.appendChild(btn);
    return el;
  }

  // ---------------- 朗读：优先 MiniMax TTS（站内音色），失败用浏览器语音 ----------------
  var audioObj = null, speakingBtn = null, ttsCache = {};
  function resetSpeak() { if (speakingBtn) speakingBtn.textContent = t().speak; speakingBtn = null; }
  function speak(text, btn) {
    var clean = text.replace(/https?:\/\/\S+/g, "").slice(0, 300);
    if (speakingBtn === btn) {
      if (audioObj) audioObj.pause();
      if (window.speechSynthesis) speechSynthesis.cancel();
      resetSpeak(); return;
    }
    if (audioObj) audioObj.pause();
    if (window.speechSynthesis) speechSynthesis.cancel();
    resetSpeak();
    speakingBtn = btn; btn.textContent = t().stop;
    var play = function (url) {
      audioObj = new Audio(url);
      audioObj.onended = resetSpeak; audioObj.onerror = resetSpeak;
      audioObj.play().catch(resetSpeak);
    };
    if (ttsCache[clean]) { play(ttsCache[clean]); return; }
    fetch(FN("tts-minimax"), {
      method: "POST", headers: HEADERS,
      body: JSON.stringify({ text: clean, voice_id: "female-shaonv", model: "speech-02-hd", speed: 0.85, vol: 1.2, pitch: 3, emotion: "happy" })
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        if (d && d.audioUrl) { ttsCache[clean] = d.audioUrl; play(d.audioUrl); }
        else throw new Error();
      })
      .catch(function () { // 浏览器语音兜底
        if (!window.speechSynthesis) { resetSpeak(); return; }
        var u = new SpeechSynthesisUtterance(clean);
        u.lang = /[一-鿿]/.test(clean) ? "zh-CN" : "en-US";
        u.rate = 0.88; u.onend = resetSpeak;
        speechSynthesis.speak(u);
      });
  }

  // ---------------- 兜底检索（模式③：无后端知识库时用内置精选层） ----------------
  function miniRetrieve(q) {
    var docs = [];
    MINI_TERMS.forEach(function (tm) {
      if (docs.length >= 2) return;
      if (q.indexOf(tm.name) >= 0 || (tm.keywords || []).some(function (k) { return k.length >= 2 && q.indexOf(k) >= 0; })) {
        docs.push("【节气资料】" + tm.name + "（" + tm.date + "）：" + tm.climate + "。习俗：吃" + tm.eat + "；" + tm.doThing +
          "。代表诗：《" + tm.poemTitle + "》(" + tm.poemAuthor + ")\n" + tm.poemContent);
      }
    });
    var hits = MINI_POEMS.filter(function (p) {
      return q.indexOf(p.title) >= 0 || q.indexOf(p.author) >= 0 ||
        (p.titleEn && q.toLowerCase().indexOf(p.titleEn.toLowerCase()) >= 0) ||
        (p.theme || []).some(function (k) { return q.indexOf(k) >= 0; }) ||
        (p.themeEn || []).some(function (k) { return q.toLowerCase().indexOf(k) >= 0; });
    }).slice(0, 2);
    hits.forEach(function (p) {
      var body = p.lines.map(function (l, i) {
        return l + "\n  [拼音] " + (p.pinyin[i] || "") + (p.english ? "\n  [English] " + (p.english[i] || "") : "");
      }).join("\n");
      docs.push("【诗词资料·精选层】《" + p.title + '》/ "' + p.titleEn + '"（' + p.dynasty + "·" + p.author + "）\n" + body);
    });
    return docs.join("\n\n");
  }

  // 模式②：数据库 RPC 检索（迁移执行后自动可用）
  function dbRetrieve(q) {
    return fetch(CFG.supabaseUrl + "/rest/v1/rpc/search_culture_poems", {
      method: "POST", headers: HEADERS, body: JSON.stringify({ q: q, max_rows: 3 })
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (rows) {
        return (rows || []).map(function (p) {
          var body = (p.lines || []).map(function (l, i) {
            var s = l;
            if (p.pinyin && p.pinyin[i]) s += "\n  [拼音" + (p.curated ? "" : "·机器标注") + "] " + p.pinyin[i];
            if (p.curated && p.english && p.english[i]) s += "\n  [English] " + p.english[i];
            return s;
          }).join("\n");
          return "【诗词资料·" + (p.curated ? "精选层" : "底层库") + "】《" + p.title + "》（" + p.dynasty + "·" + p.author + "）\n" + body;
        }).join("\n\n");
      });
  }

  function fallbackSystemPrompt(docs) {
    var langRule = profile.language === "en"
      ? "Always reply in simple warm English for children aged 5-10. Poem lines: Chinese + pinyin + English, copied EXACTLY from reference."
      : profile.language === "bilingual"
        ? "双语回答：一句中文，一句简单英文。诗句必须展示 汉字+拼音+英文，逐字来自参考资料。"
        : "始终用中文回答，像温柔的老师跟小朋友说话，句子短、多打比方、适当用emoji。";
    return "你是“知节”(Zhijie)，面向全世界儿童传播中华传统文化的向导，用户是5-10岁小朋友。" +
      "引用诗词的原文、拼音、英译只能逐字来自【参考资料】，没有的资料就说不确定，不要编造。" +
      "回答不超过200字。只聊中华传统文化。\n【参考资料】\n" + (docs || "（无）") + "\n" + langRule;
  }

  // ---------------- SSE 流式读取 ----------------
  function streamSSE(resp, onChunk) {
    var reader = resp.body.getReader();
    var dec = new TextDecoder("utf-8");
    var buf = "";
    function pump() {
      return reader.read().then(function (r) {
        if (r.done) return;
        buf += dec.decode(r.value, { stream: true });
        var lines = buf.split("\n");
        buf = lines.pop() || "";
        lines.forEach(function (line) {
          if (line.indexOf("data:") !== 0) return;
          var data = line.slice(5).trim();
          if (data === "[DONE]") return;
          try {
            var j = JSON.parse(data);
            var c = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
            if (c) onChunk(c);
          } catch (e) { /* 不完整chunk */ }
        });
        return pump();
      });
    }
    return pump();
  }

  // ---------------- 对话主流程 ----------------
  function chat(q, bubble) {
    var acc = "";
    var onChunk = function (c) {
      acc += c;
      bubble.textContent = acc;
      logEl.scrollTop = logEl.scrollHeight;
    };
    var finish = function () {
      if (!acc) bubble.textContent = t().err;
      withSpeak(bubble, acc || "");
      history.push({ role: "user", content: q }, { role: "assistant", content: acc });
      history = history.slice(-8);
    };

    var tryServer = serverMode === false ? Promise.reject() : fetch(FN("culture-agent-chat"), {
      method: "POST", headers: HEADERS,
      body: JSON.stringify({ message: q, history: history, language: profile.language, recentTopics: profile.recentTopics })
    }).then(function (r) {
      if (!r.ok) { if (r.status === 501 || r.status === 404) serverMode = false; return Promise.reject(); }
      serverMode = true;
      return streamSSE(r, onChunk);
    });

    return tryServer.catch(function () {
      // 降级：文心 multimodal-chat + （数据库检索 或 内置精选层）
      return dbRetrieve(q).catch(function () { return miniRetrieve(q); }).then(function (docs) {
        return fetch(FN("multimodal-chat"), {
          method: "POST", headers: HEADERS,
          body: JSON.stringify({
            messages: [{ role: "system", content: [{ type: "text", text: fallbackSystemPrompt(docs) }] }]
              .concat(history.map(function (h) { return { role: h.role, content: [{ type: "text", text: h.content }] }; }))
              .concat([{ role: "user", content: [{ type: "text", text: q }] }])
          })
        });
      }).then(function (r) {
        if (!r.ok) return Promise.reject();
        return streamSSE(r, onChunk);
      });
    }).then(finish, function () { bubble.textContent = t().err; });
  }

  // ---------------- 配画 / 小视频 ----------------
  function detectMedia(q) {
    if (/(视频|动画|动起来|video|animate|movie)/i.test(q)) return "video";
    if (/(画|配图|图片|插画|draw|paint|picture|image)/i.test(q)) return "image";
    return null;
  }
  function genMedia(q, wantVideo, bubble) {
    bubble.textContent = t().drawing;
    var prompt = "中国传统儿童绘本与水墨结合的插画风格，色彩温暖，适合儿童，画面主题：" + q.slice(0, 60) +
      "，构图干净，意境优美。画面中不要出现任何文字、水印、现代建筑";
    return fetch(FN("minimax-text-to-image"), {
      method: "POST", headers: HEADERS,
      body: JSON.stringify({ prompt: prompt, model: "image-01", aspect_ratio: "1:1", n: 1 })
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) {
        var url = d.image_urls && d.image_urls[0];
        if (!url) return Promise.reject();
        bubble.textContent = wantVideo ? t().animating : t().imgDone;
        var img = document.createElement("img");
        img.src = url; img.alt = "AI generated";
        bubble.appendChild(img);
        var cap = document.createElement("div");
        cap.className = "cap"; cap.textContent = "AI 生成 AI-generated";
        bubble.appendChild(cap);
        logEl.scrollTop = logEl.scrollHeight;
        if (!wantVideo) return;
        return fetch(FN("kling-image2video-submit"), {
          method: "POST", headers: HEADERS,
          body: JSON.stringify({ image: url, prompt: "画面主体轻微自然运动，镜头极缓慢推近，慢节奏，意境优美", model_name: "kling-v1-6", mode: "std", duration: "5" })
        }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
          .then(function (d2) {
            if (!d2 || d2.code !== 0) return Promise.reject();
            var taskId = d2.data.task_id, tries = 0;
            return new Promise(function (resolve, reject) {
              var timer = setInterval(function () {
                tries++;
                if (tries > 36) { clearInterval(timer); reject(); return; }
                fetch(FN("kling-image2video-query"), {
                  method: "POST", headers: HEADERS,
                  body: JSON.stringify({ task_id: taskId, transfer_video: true })
                }).then(function (r) { return r.json(); }).then(function (s) {
                  var st = s && s.data && s.data.task_status;
                  if (st === "succeed") {
                    clearInterval(timer);
                    var vu = s.data.task_result && s.data.task_result.videos && s.data.task_result.videos[0] && s.data.task_result.videos[0].url;
                    if (!vu) { reject(); return; }
                    bubble.firstChild.textContent = t().vidDone;
                    var v = document.createElement("video");
                    v.src = vu; v.controls = true; v.muted = true; v.autoplay = true; v.loop = true;
                    bubble.appendChild(v);
                    logEl.scrollTop = logEl.scrollHeight;
                    resolve();
                  } else if (st === "failed") { clearInterval(timer); reject(); }
                }).catch(function () { /* 单次查询失败继续轮询 */ });
              }, 5000);
            });
          });
      }).catch(function () { bubble.textContent = t().genErr; });
  }

  // ---------------- 发送 ----------------
  function send(preset) {
    var q = (preset || inEl.value || "").trim();
    if (!q || busy) return;
    inEl.value = "";
    addMsg("user", q);
    // 话题记忆
    MINI_TERMS.forEach(function (tm) { if (q.indexOf(tm.name) >= 0 && profile.recentTopics.indexOf(tm.name) < 0) profile.recentTopics.unshift(tm.name); });
    MINI_POEMS.forEach(function (p) { if (q.indexOf(p.title) >= 0 && profile.recentTopics.indexOf("《" + p.title + "》") < 0) profile.recentTopics.unshift("《" + p.title + "》"); });
    profile.recentTopics = profile.recentTopics.slice(0, 5);
    saveProfile();

    busy = true; sendBtn.disabled = true;
    var bubble = addMsg("bot", t().thinking);
    var media = detectMedia(q);
    var run = media ? genMedia(q, media === "video", bubble) : chat(q, bubble);
    run.then(function () { busy = false; sendBtn.disabled = false; },
      function () { busy = false; sendBtn.disabled = false; });
  }
  sendBtn.onclick = function () { send(); };
  inEl.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });

  applyLang();
})();
