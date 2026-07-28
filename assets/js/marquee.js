/**
 * marquee.js
 * Continuous, seamless auto-scrolling gallery for the "Real Students, Real
 * Success" section. Single requestAnimationFrame loop driving a CSS
 * transform (GPU-accelerated, no layout thrash) — no external slider lib.
 *
 * The card set is duplicated once at init so the loop can wrap at the
 * halfway point with no visible seam. Pauses on mouse hover and supports
 * pointer/touch drag to manually scrub through the gallery.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.marquee = (function (utils) {
  'use strict';

  var SPEED = 36; // px per second — slow, smooth

  function init() {
    var viewport = utils.qs('.marquee-viewport');
    var track = viewport && utils.qs('[data-marquee-track]', viewport);
    if (!viewport || !track) return;

    var originalCards = utils.qsa('.marquee-card', track);
    if (!originalCards.length) return;

    // Duplicate once so the track can loop seamlessly.
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('id');
      utils.qsa('[id]', clone).forEach(function (el) { el.removeAttribute('id'); });
      track.appendChild(clone);
    });

    var offset = 0;
    var halfWidth = 0;
    var paused = false;
    var dragging = false;
    var lastX = 0;
    var lastFrame = null;

    function measure() {
      var styles = window.getComputedStyle(track);
      var gap = parseFloat(styles.columnGap || styles.gap || 0) || 0;
      halfWidth = (track.scrollWidth + gap) / 2;
    }

    function apply() {
      track.style.transform = 'translateX(' + (-offset) + 'px)';
    }

    function wrap() {
      if (halfWidth <= 0) return;
      offset = ((offset % halfWidth) + halfWidth) % halfWidth;
    }

    function tick(timestamp) {
      if (lastFrame === null) lastFrame = timestamp;
      var dt = (timestamp - lastFrame) / 1000;
      lastFrame = timestamp;
      if (!paused && !dragging) {
        offset += SPEED * dt;
        wrap();
        apply();
      }
      requestAnimationFrame(tick);
    }

    measure();
    requestAnimationFrame(tick);

    viewport.addEventListener('mouseenter', function () { paused = true; });
    viewport.addEventListener('mouseleave', function () { paused = false; });

    // ---- Pointer / touch drag ----
    track.addEventListener('pointerdown', function (e) {
      dragging = true;
      paused = true;
      lastX = e.clientX;
      if (track.setPointerCapture) track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      lastX = e.clientX;
      offset -= dx;
      wrap();
      apply();
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      paused = false;
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', function () { if (dragging) endDrag(); });

    var onResize = utils.debounce(function () { measure(); }, 150);
    window.addEventListener('resize', onResize);
  }

  return { init: init };
})(window.Going2Pass.utils);
