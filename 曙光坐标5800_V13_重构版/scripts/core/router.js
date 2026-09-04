/* ============================================================
   core/router — 基于 hash 的路由
   使用 hash 是为了让成品可以「直接打开 index.html 使用」，
   同时保留可分享、可回退、可深链的 URL（例如 #/atlas?q=玉&group=featured-artifacts）。
   ============================================================ */
(function () {
  "use strict";

  var listeners = [];
  var current = null;

  /* 只有 "#/..." 形式才是路由；其它 hash（页内锚点等）不触发路由变化。 */
  function isRoutingHash() {
    var raw = window.location.hash;
    return !raw || raw === "#" || raw.charAt(1) === "/";
  }

  function parse() {
    if (!isRoutingHash() && current) return current;
    var raw = window.location.hash.replace(/^#/, "");
    if (!raw) raw = "/";
    var qIndex = raw.indexOf("?");
    var path = qIndex === -1 ? raw : raw.slice(0, qIndex);
    var query = new URLSearchParams(qIndex === -1 ? "" : raw.slice(qIndex + 1));
    var parts = path.split("/").filter(Boolean);
    var name = parts[0] || "home";
    var known = ["home", "tour", "chronicle", "lab", "atlas", "notebook", "sources", "accessibility"];
    if (known.indexOf(name) === -1) name = "home";
    current = { name: name, slug: parts[1] ? decodeURIComponent(parts[1]) : undefined, query: query, path: path };
    return current;
  }

  function href(path) { return "#" + (path.charAt(0) === "/" ? path : "/" + path); }

  function navigate(path) {
    var next = href(path);
    if (window.location.hash === next) { emit(); return; }
    window.location.hash = next;
  }

  /* 只改地址栏、不重新渲染（图鉴筛选状态用） */
  function replaceQuery(path) {
    var next = href(path);
    if (window.location.hash === next) return;
    if (window.history.replaceState) window.history.replaceState({}, "", next);
    else window.location.replace(next);
  }

  function onChange(fn) { listeners.push(fn); }
  function emit() {
    if (!isRoutingHash()) return;
    var route = parse();
    listeners.forEach(function (fn) { fn(route); });
  }

  window.addEventListener("hashchange", emit);

  window.DC = Object.assign(window.DC || {}, {
    router: { parse: parse, href: href, navigate: navigate, replaceQuery: replaceQuery, onChange: onChange, emit: emit },
  });
})();
