/**
 * animation.js
 * Scroll-triggered reveal animation for section headings/cards.
 * Uses IntersectionObserver — no scroll-event polling.
 * Add the "reveal-on-scroll" class to any element in markup to opt it in.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.animation = (function (utils) {
  'use strict';

  function init() {
    var targets = utils.qsa('.reveal-on-scroll');
    if (!targets.length || typeof IntersectionObserver === 'undefined') return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  return { init: init };
})(window.Going2Pass.utils);
