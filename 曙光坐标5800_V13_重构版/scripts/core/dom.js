/* ============================================================
   core/dom — 极小的元素构建工具（无框架、无构建步骤）
   h("div.card", { "aria-label": "…" }, child, child)
   标签支持 "tag#id.class1.class2" 简写；props 中 on* 为事件，text/html 为内容。
   ============================================================ */
(function () {
  "use strict";

  /* 资源解析：普通版原样返回路径；单文件版会预置 window.__INLINE_ASSETS__，
     把路径换成内嵌的 data URI，因此 imagePresentation() 仍能拿到真实路径做判断。 */
  function assetUrl(value) {
    var map = window.__INLINE_ASSETS__;
    return (map && typeof value === "string" && map[value]) ? map[value] : value;
  }

  function h(spec, props) {
    var children = Array.prototype.slice.call(arguments, 2);
    /* "tag#id.a.b" 与 "tag.a b"（含空格的类名串）都接受 */
    var normalized = String(spec).trim().replace(/\s+/g, ".");
    var match = /^([a-zA-Z][\w-]*)?(#[\w-]+)?((?:\.[\w-]+)*)$/.exec(normalized);
    if (!match) throw new Error("h(): 无法解析的标签描述 " + spec);
    var node = document.createElement(match[1] || "div");
    if (match[2]) node.id = match[2].slice(1);
    if (match[3]) node.className = match[3].slice(1).split(".").join(" ");

    if (props && typeof props === "object" && !props.nodeType && !Array.isArray(props)) {
      Object.keys(props).forEach(function (key) {
        var value = props[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") { node.className = (node.className ? node.className + " " : "") + value; return; }
        if (key === "text") { node.textContent = value; return; }
        if (key === "html") { node.innerHTML = value; return; }
        if (key === "src" || key === "srcset") value = assetUrl(value);
        if (key === "style" && typeof value === "object") { Object.assign(node.style, value); return; }
        if (key === "dataset" && typeof value === "object") { Object.assign(node.dataset, value); return; }
        if (key.slice(0, 2) === "on" && typeof value === "function") { node.addEventListener(key.slice(2).toLowerCase(), value); return; }
        if (key in node && key !== "list" && key !== "type" && typeof value !== "object") {
          try { node[key] = value; return; } catch (err) { /* fall through to attribute */ }
        }
        node.setAttribute(key, value === true ? "" : value);
      });
    } else if (props !== undefined && props !== null) {
      children.unshift(props);
    }

    append(node, children);
    return node;
  }

  function append(node, children) {
    children.forEach(function (child) {
      if (child === null || child === undefined || child === false || child === "") return;
      if (Array.isArray(child)) return append(node, child);
      node.appendChild(child.nodeType ? child : document.createTextNode(String(child)));
    });
  }

  /* 内联 SVG：用字符串定义，保持图形语义可读。
     HTML 解析器会把 <svg> 及其子元素放入正确的命名空间，因此直接取解析结果即可。 */
  function svg(markup) {
    var holder = document.createElement("div");
    holder.innerHTML = String(markup).trim();
    return holder.firstElementChild;
  }

  /* 句末标点规则（版面用）
     作为版面元素出现的文本——标题、题词、眉标、图注、词条释义、卡片承诺行——
     不带句末句号；成段阅读的正文与「不要误读」保留句号。
     问号和感叹号一律保留：它们承担语气，去掉会改变读法。
     只在渲染时去掉句号，事实主数据本身一个字都不动。 */
  function stop(text) {
    if (typeof text !== "string") return text;
    var t = text.replace(/\s+$/, "");
    /* 只处理单句：多句文本若只去掉最后一个句号，前面的句号会显得不一致 */
    return /。$/.test(t) && t.indexOf("。") === t.length - 1 ? t.slice(0, -1) : text;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  function frag() {
    var f = document.createDocumentFragment();
    append(f, Array.prototype.slice.call(arguments));
    return f;
  }

  window.DC = Object.assign(window.DC || {}, { h: h, svg: svg, clear: clear, frag: frag, assetUrl: assetUrl, stop: stop });
})();
