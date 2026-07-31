/* Student Success Gallery — featured masonry grid (8 shown) + "View All"
   fullscreen lightbox covering every client photo.
   To add more photos: add entries to STUDENT_GALLERY_IMAGES below (or drop
   files matching these names into assets/images/testimonials/). No markup
   or layout changes are needed — grid + lightbox both render from this list. */
(function () {
  var FEATURED_COUNT = 8;
  var STUDENT_GALLERY_IMAGES = [];
  for (var i = 1; i <= 55; i++) {
    var n = (i < 10 ? '0' : '') + i;
    STUDENT_GALLERY_IMAGES.push({
      file: 'student-' + n + '.jpg',
      alt: 'Going2Pass student photo ' + n,
      tall: i % 3 === 0
    });
  }
  var BASE_PATH = 'assets/images/testimonials/';

  function buildGrid(root) {
    STUDENT_GALLERY_IMAGES.slice(0, FEATURED_COUNT).forEach(function (item, i) {
      var fig = document.createElement('figure');
      fig.className = 'student-gallery-item' + (item.tall ? ' student-gallery-item-tall' : '');
      fig.setAttribute('data-gallery-index', i);

      var img = document.createElement('img');
      img.className = 'student-gallery-img';
      img.src = BASE_PATH + item.file;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = function () {
        fig.classList.add('student-gallery-item-empty');
        img.remove();
      };

      var overlay = document.createElement('div');
      overlay.className = 'student-gallery-overlay';
      overlay.innerHTML =
        '<span class="student-gallery-expand" aria-hidden="true">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></span>';

      fig.appendChild(img);
      fig.appendChild(overlay);
      fig.addEventListener('click', function () { openLightbox(i); });
      root.appendChild(fig);
    });
  }

  var current = 0;
  var lightbox, lightboxImg, lightboxCounter;

  function buildLightbox() {
    lightbox = document.createElement('div');
    lightbox.className = 'student-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Student photo viewer');
    lightbox.innerHTML =
      '<button class="student-lightbox-close" aria-label="Close">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<button class="student-lightbox-nav student-lightbox-prev" aria-label="Previous photo">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>' +
      '<div class="student-lightbox-stage"><img class="student-lightbox-img" alt=""></div>' +
      '<button class="student-lightbox-nav student-lightbox-next" aria-label="Next photo">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>' +
      '<div class="student-lightbox-counter"></div>';
    document.body.appendChild(lightbox);

    lightboxImg = lightbox.querySelector('.student-lightbox-img');
    lightboxCounter = lightbox.querySelector('.student-lightbox-counter');

    lightbox.querySelector('.student-lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.student-lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); showRelative(-1); });
    lightbox.querySelector('.student-lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); showRelative(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('student-lightbox-stage')) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showRelative(-1);
      else if (e.key === 'ArrowRight') showRelative(1);
    });

    var touchStartX = null;
    lightbox.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) showRelative(dx > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  function renderSlide(i) {
    current = (i + STUDENT_GALLERY_IMAGES.length) % STUDENT_GALLERY_IMAGES.length;
    var item = STUDENT_GALLERY_IMAGES[current];
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.96)';
    var full = new Image();
    full.onload = function () {
      lightboxImg.src = full.src;
      lightboxImg.alt = item.alt;
      requestAnimationFrame(function () {
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });
    };
    full.onerror = function () {
      lightboxImg.removeAttribute('src');
      lightboxImg.alt = 'Photo coming soon';
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    };
    full.src = BASE_PATH + item.file;
    lightboxCounter.textContent = (current + 1) + ' / ' + STUDENT_GALLERY_IMAGES.length;
  }

  function showRelative(delta) { renderSlide(current + delta); }

  function openLightbox(i) {
    if (!lightbox) buildLightbox();
    renderSlide(i);
    lightbox.classList.add('is-open');
    document.body.classList.add('student-lightbox-open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('student-lightbox-open');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('[data-student-gallery]');
    if (root) buildGrid(root);
    var viewAllBtn = document.querySelector('[data-student-gallery-view-all]');
    if (viewAllBtn) viewAllBtn.addEventListener('click', function () { openLightbox(0); });
  });
})();
