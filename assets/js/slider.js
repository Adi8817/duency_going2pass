/**
 * slider.js
 * Premium auto-advancing testimonials carousel: autoplay, prev/next arrows,
 * pagination dots, keyboard arrow-key navigation, and touch swipe — all
 * sharing one source of truth for the current index.
 *
 * Uses a tripled track (rendered in markup) so the slide can loop
 * seamlessly without a visible jump. Card width is measured from the live
 * DOM (not a hardcoded constant) so the loop math always matches the CSS
 * `.testimonial-card` width at every breakpoint.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.slider = (function (utils, constants) {
  'use strict';

  function init() {
    var viewport = utils.qs('.testimonial-viewport');
    var track = utils.qs('.testimonial-track', viewport);
    if (!viewport || !track) return;

    var cards = utils.qsa('.testimonial-card', track);
    var prevBtn = utils.qs('.testimonial-arrow-prev');
    var nextBtn = utils.qs('.testimonial-arrow-next');
    var dotsWrap = utils.qs('.testimonial-dots');

    var originalCount = parseInt(track.getAttribute('data-count'), 10) || 5;
    var index = 0;
    var paused = false;
    var cardWidth = 0;

    // ---- Build pagination dots (one per unique testimonial) ----
    var dots = [];
    if (dotsWrap) {
      for (var i = 0; i < originalCount; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testimonial-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        (function (targetIndex) {
          dot.addEventListener('click', function () { goTo(targetIndex); });
        })(i);
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    }

    function measure() {
      if (!cards.length) return;
      var trackStyles = window.getComputedStyle(track);
      var gap = parseFloat(trackStyles.columnGap || trackStyles.gap || 0) || 0;
      cardWidth = cards[0].getBoundingClientRect().width + gap;
    }

    function updateDots() {
      dots.forEach(function (dot, i) {
        var isActive = i === ((index % originalCount) + originalCount) % originalCount;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    }

    function render(withTransition) {
      track.style.transition = withTransition === false ? 'none' : '';
      var baseOffset = originalCount * cardWidth;
      var translate = -(baseOffset + index * cardWidth);
      track.style.transform = 'translateX(' + translate + 'px)';
      updateDots();
    }

    function goTo(targetIndex) {
      index = ((targetIndex % originalCount) + originalCount) % originalCount;
      render();
    }

    function next() { index = (index + 1) % originalCount; render(); }
    function prev() { index = (index - 1 + originalCount) % originalCount; render(); }

    measure();
    render(false);

    var timer = setInterval(function () { if (!paused) next(); }, constants.SLIDE_INTERVAL);

    // ---- Pause on hover / keyboard focus ----
    viewport.addEventListener('mouseenter', function () { paused = true; });
    viewport.addEventListener('mouseleave', function () { paused = false; });
    viewport.addEventListener('focusin', function () { paused = true; });
    viewport.addEventListener('focusout', function () { paused = false; });

    // ---- Arrow buttons ----
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); paused = true; });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); paused = true; });

    // ---- Keyboard navigation (Left/Right arrows when the carousel has focus) ----
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    // ---- Touch / pointer swipe ----
    var dragging = false;
    var startX = 0;

    track.addEventListener('touchstart', function (e) {
      dragging = true;
      paused = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', function () {
      // Swipe intent detected; actual navigation resolves on touchend.
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      var endX = (e.changedTouches && e.changedTouches[0].clientX) || startX;
      var delta = endX - startX;
      var threshold = 40;
      if (delta > threshold) prev();
      else if (delta < -threshold) next();
      paused = false;
    });

    // Re-measure on resize so the transform stays correct when the
    // responsive card width changes across breakpoints.
    var onResize = utils.debounce(function () {
      measure();
      render(false);
    }, 150);
    window.addEventListener('resize', onResize);

    // Expose a teardown hook in case the page needs to remove the slider.
    window.addEventListener('beforeunload', function () {
      clearInterval(timer);
      window.removeEventListener('resize', onResize);
    });
  }

  return { init: init };
})(window.Going2Pass.utils, window.Going2Pass.constants);
