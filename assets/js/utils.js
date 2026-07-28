/**
 * utils.js
 * Small, dependency-free DOM helpers shared by feature modules.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.utils = (function () {
  'use strict';

  /** Shorthand querySelector scoped to a root (defaults to document). */
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  /** Shorthand querySelectorAll returning a real array. */
  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /** Attach one listener for many elements without creating closures in a loop. */
  function on(elements, type, handler) {
    (Array.isArray(elements) ? elements : [elements]).forEach(function (el) {
      if (el) el.addEventListener(type, handler);
    });
  }

  /** Debounce helper — used for resize/scroll listeners. */
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  return {
    qs: qs,
    qsa: qsa,
    on: on,
    debounce: debounce
  };
})();
