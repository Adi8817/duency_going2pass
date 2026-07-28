/**
 * form.js
 * Lead-generation form: transmission toggle + submit handling.
 * Replace the fake-submit block with a real AJAX call to
 * admin-ajax.php (or a REST route) when wiring into WordPress.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.form = (function (utils) {
  'use strict';

  function initTransmissionToggle(root) {
    var options = utils.qsa('.transmission-option', root);
    if (!options.length) return;

    utils.on(options, 'change', function (e) {
      var input = e.target;
      if (input.type !== 'radio') return;
      options.forEach(function (opt) {
        var radio = opt.querySelector('input[type="radio"]');
        opt.classList.toggle('is-active', radio && radio.checked);
      });
    });
  }

  function initSubmit(root) {
    var form = utils.qs('.lead-form', root);
    var successPanel = utils.qs('.lead-form-success', root);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // TODO: replace with a real request, e.g.
      // fetch(g2pAjax.url, { method: 'POST', body: new FormData(form) })
      //   .then(...)

      form.classList.add('is-hidden');
      if (successPanel) successPanel.classList.add('is-visible');
    });
  }

  function init() {
    var card = utils.qs('.lead-form-card');
    if (!card) return;
    initTransmissionToggle(card);
    initSubmit(card);
  }

  return { init: init };
})(window.Going2Pass.utils);
