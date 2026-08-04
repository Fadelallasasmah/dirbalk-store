/* DIRBALK — shared motion library
   Drop this in <head>, right after theme.js (and lang-switch.js if present),
   on every page. Consolidates the fade-in-on-scroll pattern that was being
   hand-copied per page, plus a few new subtle motion pieces: headline
   type-in, card micro-lift, and staggered group reveal.

   Everything here respects prefers-reduced-motion — if the visitor has it
   set, all animated elements just appear in their final state instantly.

   ============================================================
   USAGE
   ============================================================

   1) SCROLL REVEAL (replaces the repeated IntersectionObserver blocks)
      Add data-reveal to any element:
        <div data-reveal>...</div>
      Optional stagger within a shared parent — give siblings the same
      group name and they'll reveal in sequence, not all at once:
        <div data-reveal data-reveal-group="story">...</div>
        <div data-reveal data-reveal-group="story">...</div>
      Optional custom delay (seconds, applied on top of any stagger):
        <div data-reveal data-reveal-delay="0.2">...</div>

   2) HEADLINE TYPE-IN
      Add data-motion="type" to a heading. Splits into words (not letters —
      letter-by-letter reads gimmicky at this brand's register; word-by-word
      reads like someone choosing their words) and reveals them in sequence
      when scrolled into view.
        <p class="big" data-motion="type">Nothing loud.</p>
      Optional speed override (ms per word, default 90):
        <p data-motion="type" data-motion-speed="120">...</p>

   3) CARD MICRO-LIFT
      Add class="motion-card" to any hoverable card (shop grid, etc.):
        <div class="card motion-card">...</div>
      Adds a barely-there lift + shadow deepen on hover/focus. Desktop
      (hover-capable) only — does nothing on touch devices, since a "hover"
      state that only shows on tap-and-hold is just confusing there.

   ============================================================
*/
(function () {
  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- inject base styles once ---------------- */
  var style = document.createElement('style');
  style.textContent =
    '[data-reveal]{opacity:0;transform:translateY(16px);' +
    'transition:opacity 0.8s ease,transform 0.8s ease;}' +
    '[data-reveal].dm-visible{opacity:1;transform:translateY(0);}' +

    '[data-motion="type"] .dm-word{display:inline-block;opacity:0;' +
    'transform:translateY(0.35em);transition:opacity 0.5s ease,transform 0.5s ease;}' +
    '[data-motion="type"].dm-visible .dm-word{opacity:1;transform:translateY(0);}' +

    '.motion-card{transition:transform 0.35s cubic-bezier(.16,1,.3,1),' +
    'box-shadow 0.35s ease;}' +
    '.can-hover .motion-card:hover,.can-hover .motion-card:focus-within{' +
    'transform:translateY(-4px);' +
    'box-shadow:0 14px 28px -12px rgba(0,0,0,0.55);}' +

    '@media (prefers-reduced-motion: reduce){' +
    '[data-reveal]{opacity:1!important;transform:none!important;transition:none!important;}' +
    '[data-motion="type"] .dm-word{opacity:1!important;transform:none!important;transition:none!important;}' +
    '.motion-card{transition:none!important;}' +
    '.can-hover .motion-card:hover,.can-hover .motion-card:focus-within{transform:none!important;}' +
    '}';
  document.head.appendChild(style);

  /* ---------------- headline type-in: split into word spans ---------------- */
  function prepareTypeEls() {
    var els = document.querySelectorAll('[data-motion="type"]');
    els.forEach(function (el) {
      if (el.dataset.dmPrepared) return;
      el.dataset.dmPrepared = '1';
      var speed = parseInt(el.dataset.motionSpeed || '90', 10);
      var text = el.textContent;
      var words = text.split(/(\s+)/); // keep whitespace tokens so spacing survives
      el.textContent = '';
      var wordIndex = 0;
      words.forEach(function (chunk) {
        if (/^\s+$/.test(chunk)) {
          el.appendChild(document.createTextNode(chunk));
          return;
        }
        if (chunk === '') return;
        var span = document.createElement('span');
        span.className = 'dm-word';
        span.textContent = chunk;
        if (!REDUCED_MOTION) {
          span.style.transitionDelay = (wordIndex * speed) + 'ms';
        }
        el.appendChild(span);
        wordIndex++;
      });
    });
  }

  /* ---------------- reveal-group stagger bookkeeping ---------------- */
  var groupCounters = {};
  function staggerDelay(el) {
    var custom = el.dataset.revealDelay;
    if (custom) return parseFloat(custom);
    var group = el.dataset.revealGroup;
    if (!group) return 0;
    if (!(group in groupCounters)) groupCounters[group] = 0;
    var idx = groupCounters[group]++;
    return idx * 0.12; // 120ms between siblings in the same group
  }

  /* ---------------- observe + reveal ---------------- */
  function initReveal() {
    prepareTypeEls();

    var revealEls = document.querySelectorAll('[data-reveal]:not(.dm-visible)');
    var typeEls = document.querySelectorAll('[data-motion="type"]:not(.dm-visible)');
    var allEls = Array.prototype.slice.call(revealEls).concat(Array.prototype.slice.call(typeEls));

    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      allEls.forEach(function (el) { el.classList.add('dm-visible'); });
      return;
    }

    revealEls.forEach(function (el) {
      var delay = staggerDelay(el);
      if (delay) el.style.transitionDelay = delay + 's';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('dm-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    allEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- hover-capability flag (shared convention already
     used elsewhere on the site, e.g. shop.html's window.canHover) ---------------- */
  if (typeof window.canHover === 'undefined') {
    window.canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }
  if (window.canHover) document.body && document.body.classList.add('can-hover');

  function boot() {
    if (window.canHover && !document.body.classList.contains('can-hover')) {
      document.body.classList.add('can-hover');
    }
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Expose a manual re-scan for pages that inject content dynamically after
  // load (e.g. shop.html's product grid, me.html's orders list) — call
  // window.DirbalkMotion.rescan() after appending new [data-reveal] elements.
  window.DirbalkMotion = { rescan: initReveal };
})();
