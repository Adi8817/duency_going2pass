/**
 * accordion.js
 * FAQ accordion — single-open behavior with event delegation
 * (one listener on the list, not one per question), plus a smooth
 * grid-template-rows height transition (CSS-driven, no layout thrash).
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.accordion = (function (utils) {
  'use strict';

  function wrapAnswers(list) {
    // Wrap each answer's text in an inner div so CSS can animate
    // grid-template-rows (0fr -> 1fr) for a smooth expand/collapse.
    utils.qsa('.faq-answer', list).forEach(function (answer) {
      if (answer.querySelector('.faq-answer-inner')) return;
      var inner = document.createElement('div');
      inner.className = 'faq-answer-inner';
      inner.innerHTML = answer.innerHTML;
      answer.innerHTML = '';
      answer.appendChild(inner);
    });
  }

  function init() {
    utils.qsa('.faq-list').forEach(function (list) {
      wrapAnswers(list);

      list.addEventListener('click', function (e) {
        var trigger = e.target.closest('.faq-question');
        if (!trigger) return;

        var item = trigger.closest('.faq-item');
        var wasOpen = item.classList.contains('is-open');

        // Close all within this list, then reopen the clicked one if it wasn't already open.
        utils.qsa('.faq-item', list).forEach(function (el) {
          el.classList.remove('is-open');
          var q = el.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  return { init: init };
})(window.Going2Pass.utils);
