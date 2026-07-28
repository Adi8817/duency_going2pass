/**
 * constants.js
 * Shared static data used across modules (locations, services, testimonials, etc).
 * Exposed on a single namespaced global to avoid polluting window.
 */
window.Going2Pass = window.Going2Pass || {};

window.Going2Pass.constants = (function () {
  'use strict';

  var LOCATIONS = [
    'Uxbridge', 'Hayes', 'Feltham', 'Hounslow', 'Isleworth',
    'West Drayton', 'Ashford (Middlesex)', 'Chertsey', 'Staines', 'Stanwell'
  ];

  var NAV_BREAKPOINT = 1180; // px — matches CSS media query in style.css
  var SLIDE_INTERVAL = 3200; // ms between auto-advance ticks
  var CARD_WIDTH = 342; // px — testimonial card width + gap, must match CSS

  return {
    LOCATIONS: LOCATIONS,
    NAV_BREAKPOINT: NAV_BREAKPOINT,
    SLIDE_INTERVAL: SLIDE_INTERVAL,
    CARD_WIDTH: CARD_WIDTH
  };
})();
