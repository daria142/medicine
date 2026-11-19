(function () {
  "use strict";
  var defaults = window.SITE_DEFAULTS || {};
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem("clinic-site-data") || "{}"); } catch (e) { saved = {}; }
  var data = Object.assign({}, defaults, saved);
  var keys = Object.keys(data).sort(function (a, b) { return b.length - a.length; });

  function subst(str) {
    if (!str || str.indexOf("[") === -1) return str;
    var out = str;
    for (var i = 0; i < keys.length; i++) {
      var value = data[keys[i]];
      if (value == null || String(value).trim() === "") continue;
      var token = "[" + keys[i] + "]";
      if (out.indexOf(token) !== -1) out = out.split(token).join(String(value));
    }
    return out;
  }

  function walk(node) {
    if (node.nodeType === 3) {
      var next = subst(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || node.closest && node.closest("[data-no-bind]")) return;
    var attrs = ["href", "content", "placeholder", "alt", "title", "aria-label", "value"];
    for (var i = 0; i < attrs.length; i++) {
      if (node.hasAttribute(attrs[i])) {
        var cur = node.getAttribute(attrs[i]);
        var rep = subst(cur);
        if (rep !== cur) node.setAttribute(attrs[i], rep);
      }
    }
    var child = node.firstChild;
    while (child) {
      var n = child.nextSibling;
      walk(child);
      child = n;
    }
  }

  function run() { walk(document.body); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();

  window.ClinicData = {
    get: function () { return Object.assign({}, defaults, saved); },
    defaults: defaults,
    saveLocal: function (obj) {
      var clean = {};
      Object.keys(obj).forEach(function (k) {
        if (obj[k] != null && String(obj[k]).trim() !== "") clean[k] = String(obj[k]).trim();
      });
      localStorage.setItem("clinic-site-data", JSON.stringify(clean));
    },
    clearLocal: function () { localStorage.removeItem("clinic-site-data"); }
  };
})();
