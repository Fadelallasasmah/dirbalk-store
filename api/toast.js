/* DIRBALK — toast.js
   نظام إشعارات موحد: نجاح / خطأ / تحذير / معلومة.
   الاستخدام: <script src="/assets/toast.js"></script> بأي صفحة،
   وبعدين: DirbalkToast.success('تمت العملية'); DirbalkToast.error('صار خطأ');
   DirbalkToast.warning('...'); DirbalkToast.info('...'); */
(function () {
  var ICONS = {
    success: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#7fd88f" stroke-width="1.3"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="#7fd88f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#ff8a8a" stroke-width="1.3"/><path d="M7 7l6 6M13 7l-6 6" stroke="#ff8a8a" stroke-width="1.5" stroke-linecap="round"/></svg>',
    warning: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2.5l8.5 15h-17z" stroke="#e0b34d" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 8v4" stroke="#e0b34d" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="14.7" r="0.9" fill="#e0b34d"/></svg>',
    info: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#C9A84C" stroke-width="1.3"/><path d="M10 9.2v4.3" stroke="#C9A84C" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="6.6" r="0.9" fill="#C9A84C"/></svg>'
  };
  var BORDER = { success: 'rgba(127,216,143,0.35)', error: 'rgba(255,138,138,0.35)', warning: 'rgba(224,179,77,0.35)', info: 'rgba(201,168,76,0.35)' };

  var css = ''
    + '#dbToastStack{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:200;'
    + 'display:flex;flex-direction:column-reverse;gap:8px;align-items:center;pointer-events:none;'
    + 'width:100%;padding:0 16px;box-sizing:border-box;}'
    + '.db-toast{pointer-events:auto;display:flex;align-items:center;gap:10px;'
    + 'background:#141414;color:#fff;border:0.5px solid rgba(255,255,255,0.12);'
    + 'padding:12px 16px;font-family:Arial,sans-serif;font-size:12.5px;line-height:1.6;'
    + 'max-width:min(92vw,380px);box-shadow:0 10px 30px rgba(0,0,0,0.4);'
    + 'opacity:0;transform:translateY(10px);transition:opacity 0.3s ease,transform 0.3s ease;}'
    + '.db-toast.show{opacity:1;transform:translateY(0);}'
    + '.db-toast svg{width:17px;height:17px;flex-shrink:0;}'
    + '.db-toast .db-msg{flex:1;min-width:0;}'
    + '.db-toast .db-close{background:none;border:none;color:rgba(255,255,255,0.35);'
    + 'cursor:pointer;font-size:14px;flex-shrink:0;padding:0 0 0 4px;line-height:1;font-family:Arial,sans-serif;}'
    + '.db-toast .db-close:hover{color:rgba(255,255,255,0.8);}'
    + '@media (max-width:480px){#dbToastStack{bottom:16px;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var stack;
  ready(function () {
    stack = document.createElement('div');
    stack.id = 'dbToastStack';
    stack.setAttribute('role', 'status');
    stack.setAttribute('aria-live', 'polite');
    document.body.appendChild(stack);
  });

  function show(type, message, duration) {
    if (!stack) { stack = document.getElementById('dbToastStack'); }
    if (!stack) return; // DOM not ready yet — extremely rare edge case, fails silently rather than throwing
    duration = duration || (type === 'error' ? 4200 : 3000);

    var el = document.createElement('div');
    el.className = 'db-toast';
    el.style.borderColor = BORDER[type] || BORDER.info;
    el.innerHTML = (ICONS[type] || ICONS.info) +
      '<span class="db-msg"></span>' +
      '<button type="button" class="db-close" aria-label="إغلاق">✕</button>';
    el.querySelector('.db-msg').textContent = message;
    stack.appendChild(el);

    requestAnimationFrame(function () { el.classList.add('show'); });

    var timer = setTimeout(remove, duration);
    el.querySelector('.db-close').addEventListener('click', function () {
      clearTimeout(timer);
      remove();
    });

    function remove() {
      el.classList.remove('show');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    }
  }

  window.DirbalkToast = {
    success: function (msg, d) { show('success', msg, d); },
    error: function (msg, d) { show('error', msg, d); },
    warning: function (msg, d) { show('warning', msg, d); },
    info: function (msg, d) { show('info', msg, d); }
  };
})();
