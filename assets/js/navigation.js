/**
 * navigation.js
 * Sticky nav: mobile burger menu toggle + close-on-link-click, plus a
 * scroll-spy that highlights the current section's nav link.
 * Desktop/mobile switching is handled entirely by CSS (see responsive.css
 * @media rules) — this module only manages open/closed + active state.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.navigation = (function (utils) {
  'use strict';

  function initMobileMenu() {
    var burger = utils.qs('.nav-burger');
    var menu = utils.qs('.nav-mobile-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu whenever a link inside it is clicked.
    utils.on(utils.qsa('a', menu), 'click', function () {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  }

  function initActiveLinkTracking() {
    var links = utils.qsa('[data-nav-link]');
    if (!links.length || typeof IntersectionObserver === 'undefined') return;

    var sectionIds = links
      .map(function (l) { return l.getAttribute('data-nav-link'); })
      .filter(function (id, i, arr) { return arr.indexOf(id) === i; });

    var sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (!sections.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('data-nav-link') === id);
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // .site-header is position:fixed (see navigation.css), so it no longer
  // occupies space in normal flow. This reserves that space on <body> to
  // prevent content from jumping under the fixed header.
  function initStickyOffset() {
    var header = utils.qs('.site-header');
    if (!header) return;

    function applyOffset() {
      document.body.style.paddingTop = header.offsetHeight + 'px';
    }

    applyOffset();
    window.addEventListener('resize', utils.debounce(applyOffset, 150));
  }

  function initServicesSubmenu() {
    var toggle = utils.qs('.nav-mobile-toggle');
    var submenu = utils.qs('.nav-mobile-submenu');
    if (!toggle || !submenu) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      submenu.style.maxHeight = isOpen ? '' : submenu.scrollHeight + 'px';
    });
  }

  function init() {
    initMobileMenu();
    initActiveLinkTracking();
    initStickyOffset();
    initServicesSubmenu();
  }

  return { init: init };
})(window.Going2Pass.utils);
