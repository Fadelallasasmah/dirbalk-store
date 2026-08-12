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

   4) SHRINK-ON-SCROLL HERO
      A full-width hero (video, image, or placeholder) that shrinks and
      rounds its corners as the visitor scrolls past it, then continues
      scrolling away — the "collapsing hero" effect seen on agency sites.
        <div class="shrink-hero-wrap" data-shrink-hero>
          <div class="shrink-hero-media">...</div>
        </div>
      The wrapper needs an explicit tall height in CSS (e.g. height: 180vh)
      to set how much scroll distance the shrink plays out over — taller
      wrap = slower, more gradual shrink. The media element must be
      position: sticky; top: 0; in CSS so it stays pinned while shrinking.

   5) HERO SETTLE-TRANSITION
      A subtler cousin of (4) — for a hero that should feel like it "settles"
      into the section that follows rather than collapsing away. Small scale
      reduction (down to ~82%), a slight rise, soft corner rounding, over a
      short scroll distance, then releases to normal flow:
        <div class="hero-transition-wrap" data-hero-transition>
          <div class="hero-transition-media">...img or video...</div>
        </div>
      Wrapper height should be "the hero's own height + a short buffer"
      (e.g. height: calc(100vh + 40vh)) — the buffer is how much scroll
      distance the settle plays out over. The media element must be
      position: sticky; top: 0; in CSS.

   ============================================================
*/
(function () {
  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- inject base styles once ---------------- */
  var style = document.createElement('style');
  style.textContent =
    '[data-reveal]{opacity:0;transform:translateY(16px) scale(0.97);' +
    'transition:opacity 0.8s ease,transform 0.8s cubic-bezier(.2,.8,.2,1);}' +
    '[data-reveal].dm-visible{opacity:1;transform:translateY(0) scale(1);}' +

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

  /* ---------------- shrink-on-scroll hero ----------------
     Usage:
       <div class="shrink-hero-wrap" data-shrink-hero>
         <div class="shrink-hero-media">...video or image or SVG placeholder...</div>
       </div>
     The wrapper needs a tall height (set via CSS, e.g. 180vh) to define how
     much scroll distance the shrink happens over. The media element inside
     is position:sticky and gets scaled + rounded as the user scrolls past,
     then scrolls away normally once the wrapper's height is exhausted. */
  function initShrinkHero() {
    var wraps = document.querySelectorAll('[data-shrink-hero]');
    if (!wraps.length || REDUCED_MOTION) return;

    var instances = [];
    wraps.forEach(function (wrap) {
      var media = wrap.querySelector('.shrink-hero-media');
      if (!media) return;
      instances.push({ wrap: wrap, media: media });
    });
    if (!instances.length) return;

    var minScale = 0.4;   // final size at end of shrink, as a fraction of full width
    var maxRadius = 20;   // px, corner rounding at full shrink

    function update() {
      instances.forEach(function (inst) {
        var rect = inst.wrap.getBoundingClientRect();
        var scrollRange = inst.wrap.offsetHeight - window.innerHeight;
        if (scrollRange <= 0) return;
        var scrolled = -rect.top;
        var progress = Math.min(Math.max(scrolled / scrollRange, 0), 1);
        var scale = 1 - progress * (1 - minScale);
        inst.media.style.transform = 'scale(' + scale.toFixed(4) + ')';
        inst.media.style.borderRadius = (progress * maxRadius).toFixed(1) + 'px';
        inst.media.style.opacity = (1 - progress * 0.15).toFixed(3);
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------------- hero settle-transition ----------------
     Usage:
       <div class="hero-transition-wrap" data-hero-transition>
         <div class="hero-transition-media">...img or video...</div>
       </div>
     Similar mechanism to shrink-hero, but tuned for a SUBTLE, SHORT settle
     effect (not a dramatic collapse) as the hero is scrolled past — a
     gentle scale-down + slight rise + soft corner rounding, meant to
     visually connect the hero into whatever section follows it, rather
     than shrink it into a small floating box. Wrapper height should be
     "100vh (or hero's own height) + a short buffer" (e.g. calc(100vh + 40vh))
     so the effect plays out over that buffer distance only, then releases
     to normal scroll. */
  function initHeroTransition() {
    var wraps = document.querySelectorAll('[data-hero-transition]');
    if (!wraps.length || REDUCED_MOTION) return;

    var instances = [];
    wraps.forEach(function (wrap) {
      var media = wrap.querySelector('.hero-transition-media');
      if (!media) return;
      instances.push({ wrap: wrap, media: media });
    });
    if (!instances.length) return;

    var minScale = 0.82;
    var maxRadius = 18;
    var maxRiseVh = 6;

    function update() {
      instances.forEach(function (inst) {
        var rect = inst.wrap.getBoundingClientRect();
        var scrollRange = inst.wrap.offsetHeight - window.innerHeight;
        if (scrollRange <= 0) return;
        var scrolled = -rect.top;
        var progress = Math.min(Math.max(scrolled / scrollRange, 0), 1);
        var scale = 1 - progress * (1 - minScale);
        var rise = progress * maxRiseVh;
        inst.media.style.transform = 'scale(' + scale.toFixed(4) + ') translateY(-' + rise.toFixed(2) + 'vh)';
        inst.media.style.borderRadius = (progress * maxRadius).toFixed(1) + 'px';
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  if (typeof window.canHover === 'undefined') {
    window.canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }
  if (window.canHover) document.body && document.body.classList.add('can-hover');

  function boot() {
    if (window.canHover && !document.body.classList.contains('can-hover')) {
      document.body.classList.add('can-hover');
    }
    initReveal();
    initShrinkHero();
    initHeroTransition();
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
