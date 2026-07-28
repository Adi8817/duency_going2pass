/**
 * main.js
 * Single entry point — initializes every feature module once the DOM is ready.
 * This is the only file that should be enqueued with a dependency on the
 * others (wp_enqueue_script order: constants -> utils -> feature modules -> main),
 * or bundle/concatenate in that same order for production.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var G2P = window.Going2Pass;
    if (!G2P) return;

    G2P.navigation && G2P.navigation.init();
    G2P.hero && G2P.hero.init();
    G2P.form && G2P.form.init();
    G2P.accordion && G2P.accordion.init();
    G2P.slider && G2P.slider.init();
    G2P.marquee && G2P.marquee.init();
    G2P.modal && G2P.modal.init();
    G2P.animation && G2P.animation.init();
  });
})();
