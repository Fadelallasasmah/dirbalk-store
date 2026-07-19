/* DIRBALK — theme.js
   نهار/ليل تلقائي حسب ساعة الزائر، مع تجاوز يدوي و↺ للرجوع التلقائي.
   الاستخدام: <script src="/assets/theme.js"></script> بالـ <head> بكل صفحة. */
(function () {
  var KEY = 'dirbalk_theme';
  var DOC = document.documentElement;

  function autoTheme() {
    var h = new Date().getHours();
    return (h >= 6 && h < 18) ? 'day' : 'night';
  }
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function currentTheme() {
    var s = stored();
    return (s === 'day' || s === 'night') ? s : autoTheme();
  }
  function isManual() {
    var s = stored();
    return s === 'day' || s === 'night';
  }

  /* apply before paint — no flash */
  DOC.setAttribute('data-theme', currentTheme());

  /* ---------- atmospheres ---------- */
  var css = ''
    + ':root{--t:0.6s}'
    + '@media (prefers-reduced-motion: reduce){:root{--t:0s}}'
    + 'body,header,.cart-drawer{transition:background-color var(--t) ease, background var(--t) ease;}'
    + 'img,video{transition:filter var(--t) ease;}'

    /* الليل — أسود أعمق، سينمائي، الأمبر أوضح */
    + 'html[data-theme="night"] body{background:#050505;}'
    + 'html[data-theme="night"] header{background:rgba(5,5,5,0.93);}'
    + 'html[data-theme="night"] .cart-drawer{background:#0d0d0d;}'
    + 'html[data-theme="night"] .media-frame,html[data-theme="night"] .card-media{background:#0b0b0b;}'
    + 'html[data-theme="night"] img{filter:contrast(1.04);}'

    /* النهار — فحمي دافئ، تباين أنعم، ضوء طبيعي */
    + 'html[data-theme="day"] body{background:#171310;}'
    + 'html[data-theme="day"] header{background:rgba(23,19,16,0.93);}'
    + 'html[data-theme="day"] .cart-drawer{background:#1e1915;}'
    + 'html[data-theme="day"] .media-frame,html[data-theme="day"] .card-media{background:#1c1713;}'
    + 'html[data-theme="day"] img{filter:brightness(1.05) sepia(0.07) contrast(0.98);}'
    + 'html[data-theme="day"] .lightbox{background:#171310;}'

    /* ---------- the toggle ---------- */
    + '.theme-toggle{position:fixed;top:70px;left:18px;z-index:35;display:flex;align-items:center;gap:8px;'
    + 'background:none;border:none;padding:6px;cursor:pointer;opacity:0.55;transition:opacity 0.3s ease;}'
    + '.theme-toggle:hover{opacity:1;}'
    + '.theme-icon{width:15px;height:15px;display:block;position:relative;}'
    + '.theme-icon svg{position:absolute;inset:0;width:100%;height:100%;'
    + 'transition:opacity var(--t) ease, transform var(--t) ease;}'
    /* الشمس: ظاهرة بالنهار */
    + '.icon-sun{opacity:0;transform:rotate(-90deg) scale(0.5);}'
    + 'html[data-theme="day"] .icon-sun{opacity:1;transform:rotate(0deg) scale(1);}'
    /* القمر: ظاهر بالليل */
    + '.icon-moon{opacity:1;transform:rotate(0deg) scale(1);}'
    + 'html[data-theme="day"] .icon-moon{opacity:0;transform:rotate(90deg) scale(0.5);}'
    + '.theme-reset{background:none;border:none;padding:4px;cursor:pointer;'
    + 'color:rgba(201,168,76,0.45);font-size:12px;line-height:1;font-family:Arial,sans-serif;'
    + 'opacity:0;pointer-events:none;transition:opacity 0.3s ease,color 0.2s ease;}'
    + '.theme-reset.show{opacity:1;pointer-events:auto;}'
    + '.theme-reset:hover{color:#C9A84C;}'
    + '@media (max-width:860px){.theme-toggle{top:64px;left:12px;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- icon + behavior ---------- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var wrap = document.createElement('div');
    wrap.className = 'theme-toggle';
    wrap.innerHTML =
      '<button type="button" class="theme-btn" aria-label="تبديل النهار والليل" style="background:none;border:none;padding:0;cursor:pointer;">' +
      '<span class="theme-icon">' +
        '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="12" cy="12" r="4.5" fill="#C9A84C"/>' +
          '<g stroke="#C9A84C" stroke-width="1.6" stroke-linecap="round">' +
            '<path d="M12 2.5v2.4"/><path d="M12 19.1v2.4"/>' +
            '<path d="M21.5 12h-2.4"/><path d="M4.9 12H2.5"/>' +
            '<path d="M18.36 5.64l-1.7 1.7"/><path d="M7.34 16.66l-1.7 1.7"/>' +
            '<path d="M18.36 18.36l-1.7-1.7"/><path d="M7.34 7.34l-1.7-1.7"/>' +
          '</g>' +
        '</svg>' +
        '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<mask id="dbMoonMask"><rect x="0" y="0" width="24" height="24" fill="#fff"/>' +
          '<circle cx="15.2" cy="9.2" r="7.4" fill="#000"/></mask>' +
          '<circle cx="12" cy="12" r="8.5" fill="#C9A84C" mask="url(#dbMoonMask)"/>' +
        '</svg>' +
      '</span></button>' +
      '<button type="button" class="theme-reset" aria-label="رجوع للوضع التلقائي" title="تلقائي">↺</button>';
    document.body.appendChild(wrap);

    var resetBtn = wrap.querySelector('.theme-reset');

    function sync() {
      DOC.setAttribute('data-theme', currentTheme());
      resetBtn.classList.toggle('show', isManual());
    }

    wrap.querySelector('.theme-btn').addEventListener('click', function () {
      var next = currentTheme() === 'day' ? 'night' : 'day';
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
      sync();
    });

    resetBtn.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      sync();
    });

    /* الموقع بيغرّب لحاله عند حدود الوقت (بالوضع التلقائي فقط) */
    setInterval(function () {
      if (!isManual()) sync();
    }, 60000);

    sync();
  });
})();
