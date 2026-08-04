/* DIRBALK — shared language switcher
   Drop this in <head>, right after theme.js, on every page.
   Adds a language link to .side-menu-links automatically and remembers
   the visitor's choice in localStorage until they change it manually. */
(function () {
  var STORAGE_KEY = 'dirbalk:lang';

  // Pages that don't have a live route in the other language yet.
  var NO_SWITCH_PATHS = ['/admin.html'];

  function currentLang() {
    return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
  }

  function hasEquivalent() {
    var path = window.location.pathname;
    for (var i = 0; i < NO_SWITCH_PATHS.length; i++) {
      if (path === NO_SWITCH_PATHS[i] || path === '/en' + NO_SWITCH_PATHS[i]) return false;
    }
    return true;
  }

  function isEnglishPath(path) {
    return path === '/en' || path.indexOf('/en/') === 0;
  }

  function pathFor(lang, path) {
    var eng = isEnglishPath(path);
    if (lang === 'en') {
      if (eng) return path;
      return path === '/' ? '/en/' : '/en' + path;
    }
    if (!eng) return path;
    var stripped = path.replace(/^\/en/, '');
    return stripped === '' ? '/' : stripped;
  }

  // Redirect to the saved preference immediately, before the page renders,
  // so it never flashes the wrong language first.
  (function autoRedirect() {
    if (!hasEquivalent()) return;
    var stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || stored === currentLang()) return;
    var target = pathFor(stored, window.location.pathname) + window.location.search + window.location.hash;
    if (target !== window.location.pathname + window.location.search + window.location.hash) {
      window.location.replace(target);
    }
  })();

  function injectSwitcher() {
    if (!hasEquivalent()) return;
    var container = document.querySelector('.side-menu-links');
    if (!container) return;

    var otherLang = currentLang() === 'ar' ? 'en' : 'ar';
    var a = document.createElement('a');
    a.href = pathFor(otherLang, window.location.pathname) + window.location.search + window.location.hash;
    a.textContent = otherLang === 'en' ? 'English' : 'العربية';
    a.setAttribute('data-lang-switch', otherLang);
    a.setAttribute('aria-label', otherLang === 'en' ? 'Switch to English' : 'التبديل للعربية');
    a.addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, otherLang);
    });
    container.appendChild(a);
  }

  // Some pages (currently: the homepage, which has no hamburger nav by
  // design) ship a standalone .lang-switch anchor instead. It used to be a
  // static hardcoded link with no localStorage awareness, which meant
  // clicking it never updated the saved preference — so the very next page
  // load would silently auto-redirect right back. Wire it up the same way
  // as the injected switcher so it stays in sync.
  function wireLegacyButton() {
    if (!hasEquivalent()) return;
    var btns = document.querySelectorAll('.lang-switch');
    if (!btns.length) return;
    var otherLang = currentLang() === 'ar' ? 'en' : 'ar';
    btns.forEach(function (btn) {
      btn.setAttribute('href', pathFor(otherLang, window.location.pathname) + window.location.search + window.location.hash);
      btn.textContent = otherLang === 'en' ? 'English' : 'عربي';
      btn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, otherLang);
      });
    });
  }

  // Visual + timing safety: some pages animate .side-menu-links a on open via
  // JS-driven transitionDelay computed from the children present at load time;
  // since we inject after that, force this one to just be visible with the
  // panel rather than fight the stagger timing on every page's own script.
  var style = document.createElement('style');
  style.textContent =
    '.side-menu-links a[data-lang-switch]{' +
    'opacity:1!important;transform:none!important;' +
    'margin-top:14px;padding-top:16px;' +
    'border-top:0.5px solid rgba(255,255,255,0.07);' +
    'color:#C9A84C!important;}';
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectSwitcher();
      wireLegacyButton();
    });
  } else {
    injectSwitcher();
    wireLegacyButton();
  }
})();
