/* ============================================================
   core/store — 「我的考古笔记」本地学习记录
   仅保存在当前浏览器 localStorage，不上传、不追踪。
   ============================================================ */
(function () {
  "use strict";

  var KEY = "dawn5800:v1";           /* 与 V12 相同的键名：老用户的记录不会丢失 */
  var initial = { visited: [], collected: [], answers: {}, scene: 0 };
  var state = Object.assign({}, initial);
  var subscribers = [];

  function load() {
    try {
      var saved = window.localStorage.getItem(KEY);
      if (saved) state = Object.assign({}, initial, JSON.parse(saved));
    } catch (err) { /* 隐私模式下保持内存状态即可 */ }
    return state;
  }

  function persist() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* 忽略写入失败 */ }
  }

  function get() { return state; }

  function set(next) {
    state = Object.assign({}, state, next);
    persist();
    subscribers.forEach(function (fn) { fn(state); });
    return state;
  }

  function reset() { state = Object.assign({}, initial); persist(); subscribers.forEach(function (fn) { fn(state); }); }
  function subscribe(fn) { subscribers.push(fn); }

  window.DC = Object.assign(window.DC || {}, {
    store: { load: load, get: get, set: set, reset: reset, subscribe: subscribe, initial: initial },
  });
})();
