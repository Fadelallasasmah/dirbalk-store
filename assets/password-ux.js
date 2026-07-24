/* DIRBALK — assets/password-ux.js
   Two small, reusable password helpers shared across every auth page:
   - attachCapsLock: warns when Caps Lock is on (any password field)
   - attachStrength: quiet strength meter (only for fields where a NEW
     password is being chosen — never shown on a plain login field)
   Loaded once via <script src="/assets/password-ux.js"></script>,
   then called per-field: DirbalkPassword.attachCapsLock('password', 'capsWarning') */
(function () {
  var css = ''
    + '.pw-caps-warning{display:none;font-size:10.5px;color:#e0b34d;margin-top:6px;}'
    + '.pw-caps-warning.show{display:block;}'
    + '.pw-strength{margin-top:8px;}'
    + '.pw-strength-bar{height:2px;background:rgba(255,255,255,0.1);position:relative;overflow:hidden;}'
    + '.pw-strength-bar::after{content:"";position:absolute;inset:0;width:0%;background:rgba(255,138,138,0.7);transition:width 0.25s ease,background-color 0.25s ease;}'
    + '.pw-strength-bar.s1::after{width:33%;background:rgba(255,138,138,0.7);}'
    + '.pw-strength-bar.s2::after{width:66%;background:#C9A84C;}'
    + '.pw-strength-bar.s3::after{width:100%;background:#7fd88f;}'
    + '.pw-strength-label{font-size:10px;color:rgba(255,255,255,0.4);margin-top:5px;}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function scoreOf(pw) {
    if (!pw) return 0;
    var score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length < 6) return 0;
    if (score <= 2) return 1;
    if (score <= 3) return 2;
    return 3;
  }

  var LABELS = { 0: '', 1: 'ضعيفة', 2: 'متوسطة', 3: 'قوية' };

  window.DirbalkPassword = {
    /* caps-lock warning: creates and manages a small message element right after the input */
    attachCapsLock: function (inputId) {
      var input = document.getElementById(inputId);
      if (!input) return;
      var warning = document.createElement('p');
      warning.className = 'pw-caps-warning';
      warning.textContent = 'Caps Lock مفعّل';
      input.insertAdjacentElement('afterend', warning);

      function check(e) {
        if (typeof e.getModifierState === 'function') {
          warning.classList.toggle('show', e.getModifierState('CapsLock'));
        }
      }
      input.addEventListener('keydown', check);
      input.addEventListener('keyup', check);
      input.addEventListener('blur', function () { warning.classList.remove('show'); });
    },

    /* strength meter: creates a thin bar + label right after the input, updates live on input */
    attachStrength: function (inputId) {
      var input = document.getElementById(inputId);
      if (!input) return;
      var wrap = document.createElement('div');
      wrap.className = 'pw-strength';
      wrap.innerHTML = '<div class="pw-strength-bar"></div><p class="pw-strength-label"></p>';
      input.insertAdjacentElement('afterend', wrap);
      var bar = wrap.querySelector('.pw-strength-bar');
      var label = wrap.querySelector('.pw-strength-label');

      input.addEventListener('input', function () {
        var s = scoreOf(input.value);
        bar.className = 'pw-strength-bar' + (s ? ' s' + s : '');
        label.textContent = LABELS[s];
      });
    }
  };
})();
