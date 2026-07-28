/**
 * hero.js
 * Hero section interactions. Currently the hero is static (CTA buttons are
 * plain anchor scrolls handled natively by the browser via href="#lead-form"),
 * so this module only exists as the dedicated place for future hero-specific
 * behavior (e.g. a rotating headline or entrance animation) without touching
 * navigation/form/slider logic.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.hero = (function () {
  'use strict';

  function init() {
    // No JS-driven behavior required today. Intentionally a no-op placeholder
    // so the module boundary exists for future hero enhancements.
  }

  return { init: init };
})();
