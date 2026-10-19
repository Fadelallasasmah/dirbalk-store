/* DIRBALK — assets/auth-gate.js
   Browse freely, register to buy.

   DirbalkAuth.isLoggedIn()            → boolean
   DirbalkAuth.require(onReady)        → runs onReady() now if logged in,
                                         otherwise opens the register popup and
                                         runs onReady() right after a successful
                                         registration (no page change, nothing lost).
   DirbalkAuth.open('login')           → opens the "send me a login link" view.

   Registration = name + email + phone only (no password). A returning
   customer on a new device enters their email and gets a one-tap login
   link (enter.html). Fires window event 'dirbalk:login' after login.

   v38: a login is a server session. Registering a new email, or opening a
   login link (once, within 1 hour), gives this browser a random session key
   (localStorage 'dirbalk_session'). Every account request sends it; the
   backend works out the email from it. Log out = the server forgets the key.
   DirbalkAuth.session() → the key · DirbalkAuth.expired() → sign-in again.

   v39: nobody is signed in without proving the email. Registering a new
   email, or asking to sign in, emails a 6-digit code (+ a one-tap link).
   The popup asks for the code right away — the bag and the page stay as
   they are. DirbalkAuth.openCode(email) opens that step directly. */
(function () {
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var T = EN ? {
    regTitle: 'One step before you buy',
    regSub: 'Your name, email and number — that\'s all we need.',
    name: 'Full name', email: 'Email', phone: 'Phone number',
    phoneHint: '07XXXXXXXX, or with country code +44…',
    regBtn: 'Continue', regBusy: 'One moment…',
    haveAcc: 'Already registered?', haveAccLink: 'Get a login link',
    loginTitle: 'Welcome back',
    loginSub: 'Enter your email and we\'ll send you a one-tap login link.',
    loginBtn: 'Send the link', loginBusy: 'Sending…',
    noAcc: 'New here?', noAccLink: 'Register',
    sent: 'If this email is registered, a login link is on its way. Check your inbox (and spam).',
    errName: 'Please enter your full name.', errEmail: 'Please enter a valid email.',
    errPhone: 'Phone number isn\'t valid.', errGeneric: 'Something went wrong, please try again.',
    close: 'Close',
    codeTitle: 'Check your email',
    codeSub: 'We sent a 6-digit code to',
    codeLabel: 'Code', codeBtn: 'Sign in', codeBusy: 'Checking…',
    codeResend: 'Send a new code', codeResent: 'A new code is on its way.',
    codeOther: 'Use a different email', errCode: 'Enter the 6 digits from the email.'
  } : {
    regTitle: 'خطوة وحدة قبل ما تشتري',
    regSub: 'اسمك، إيميلك، ورقمك — بس هيك.',
    name: 'الاسم الكامل', email: 'الإيميل', phone: 'رقم الهاتف',
    phoneHint: '07XXXXXXXX، أو مع مفتاح الدولة +44…',
    regBtn: 'كمّل', regBusy: 'لحظة…',
    haveAcc: 'مسجّل قبل؟', haveAccLink: 'ابعتلي رابط دخول',
    loginTitle: 'أهلاً من جديد',
    loginSub: 'اكتب إيميلك وبنبعتلك رابط دخول بكبسة وحدة.',
    loginBtn: 'ابعت الرابط', loginBusy: 'جاري الإرسال…',
    noAcc: 'أول مرة؟', noAccLink: 'سجّل',
    sent: 'إذا الإيميل مسجّل عندنا، رابط الدخول بالطريق. شيّك الإيميل (والسبام).',
    errName: 'الرجاء إدخال الاسم الكامل.', errEmail: 'الرجاء إدخال إيميل صحيح.',
    errPhone: 'رقم الهاتف غير صحيح.', errGeneric: 'حدث خطأ مؤقت، يرجى المحاولة لاحقًا.',
    close: 'إغلاق',
    codeTitle: 'شيّك إيميلك',
    codeSub: 'بعتنالك كود من 6 أرقام على',
    codeLabel: 'الكود', codeBtn: 'دخول', codeBusy: 'لحظة…',
    codeResend: 'ابعتلي كود جديد', codeResent: 'كود جديد بالطريق.',
    codeOther: 'إيميل ثاني', errCode: 'اكتب الـ 6 أرقام اللي بالإيميل.'
  };

  var KEYS = ['dirbalk_logged_in', 'dirbalk_name', 'dirbalk_email', 'dirbalk_phone', 'dirbalk_gender', 'dirbalk_session'];

  function clearLocal() { try { KEYS.forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {} }
  function session() { try { return localStorage.getItem('dirbalk_session') || ''; } catch (e) { return ''; } }

  /* an old "logged in" flag without a server session isn't a login any more */
  try { if (localStorage.getItem('dirbalk_logged_in') === '1' && !session()) clearLocal(); } catch (e) {}

  function isLoggedIn() {
    try { return localStorage.getItem('dirbalk_logged_in') === '1' && !!session(); } catch (e) { return false; }
  }

  function setSession(acc) {
    try {
      localStorage.setItem('dirbalk_logged_in', '1');
      localStorage.setItem('dirbalk_name', acc.name || '');
      localStorage.setItem('dirbalk_email', acc.email || '');
      localStorage.setItem('dirbalk_phone', acc.phone || '');
      localStorage.setItem('dirbalk_gender', acc.gender || '');
      if (acc.session) localStorage.setItem('dirbalk_session', acc.session);
      localStorage.removeItem('dirbalk_pending_verification');
    } catch (e) { /* ignore */ }
  }

  /* 07XXXXXXXX / 7XXXXXXXX → +9627XXXXXXXX ; 00… → +… ; +… kept */
  function normPhone(raw) {
    var p = (raw || '').replace(/[\s\-().]/g, '');
    if (/^07\d{8}$/.test(p)) p = '+962' + p.slice(1);
    else if (/^7\d{8}$/.test(p)) p = '+962' + p;
    else if (/^00\d+$/.test(p)) p = '+' + p.slice(2);
    return /^\+[1-9]\d{6,14}$/.test(p) ? p : '';
  }

  var css =
    '.dag .dag-codein{font-size:24px;letter-spacing:.45em;text-align:center;font-family:Arial,sans-serif;}' +
    '.dag .dag-to{color:#fff;font-weight:normal;}' +
    '.dag-ov{position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
    'z-index:2000;display:none;align-items:center;justify-content:center;padding:20px;}' +
    '.dag-ov.open{display:flex;}' +
    '.dag{position:relative;width:100%;max-width:380px;background:#111;border:0.5px solid rgba(201,168,76,0.25);padding:34px 26px 26px;color:#fff;font-family:inherit;}' +
    '[data-theme="day"] .dag{background:#1e1915;}' +
    '.dag-x{position:absolute;top:10px;inset-inline-start:10px;background:none;border:none;color:rgba(255,255,255,0.5);font-size:16px;cursor:pointer;padding:6px;}' +
    '.dag h3{margin:0 0 6px;font-size:17px;font-weight:bold;}' +
    '.dag .dag-sub{margin:0 0 20px;font-size:12.5px;color:rgba(255,255,255,0.55);line-height:1.8;}' +
    '.dag label{display:block;font-size:11px;color:rgba(255,255,255,0.5);margin:12px 0 6px;}' +
    '.dag input{width:100%;box-sizing:border-box;background:transparent;border:0.5px solid rgba(255,255,255,0.18);color:#fff;padding:12px;font-size:14px;font-family:inherit;border-radius:0;}' +
    '.dag input:focus{outline:none;border-color:#C9A84C;}' +
    '.dag input.err{border-color:#c0392b;}' +
    '.dag .dag-hint{font-size:10.5px;color:rgba(255,255,255,0.35);margin-top:5px;}' +
    '.dag .dag-btn{width:100%;margin-top:20px;background:#C9A84C;color:#0a0a0a;border:none;padding:14px;font-size:13px;font-weight:bold;cursor:pointer;font-family:inherit;letter-spacing:.5px;}' +
    '.dag .dag-btn:disabled{opacity:.6;cursor:default;}' +
    '.dag .dag-msg{display:none;margin-top:14px;font-size:12.5px;line-height:1.8;}' +
    '.dag .dag-msg.err{display:block;color:#e57373;}' +
    '.dag .dag-msg.ok{display:block;color:#C9A84C;}' +
    '.dag .dag-switch{margin-top:18px;font-size:12px;color:rgba(255,255,255,0.45);text-align:center;}' +
    '.dag .dag-switch a{color:#C9A84C;text-decoration:none;cursor:pointer;margin-inline-start:4px;}';

  var ov, pending = null;

  function build() {
    if (ov) return;
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    ov = document.createElement('div');
    ov.className = 'dag-ov';
    ov.innerHTML =
      '<div class="dag" role="dialog" aria-modal="true">' +
        '<button type="button" class="dag-x" aria-label="' + T.close + '">✕</button>' +
        /* register view */
        '<form class="dag-reg" novalidate>' +
          '<h3>' + T.regTitle + '</h3><p class="dag-sub">' + T.regSub + '</p>' +
          '<label for="dagName">' + T.name + '</label><input id="dagName" autocomplete="name" />' +
          '<label for="dagEmail">' + T.email + '</label><input id="dagEmail" type="email" autocomplete="email" dir="ltr" />' +
          '<label for="dagPhone">' + T.phone + '</label><input id="dagPhone" type="tel" autocomplete="tel" dir="ltr" />' +
          '<p class="dag-hint">' + T.phoneHint + '</p>' +
          '<button type="submit" class="dag-btn">' + T.regBtn + '</button>' +
          '<p class="dag-msg"></p>' +
          '<p class="dag-switch">' + T.haveAcc + '<a data-go="login">' + T.haveAccLink + '</a></p>' +
        '</form>' +
        /* login-link view */
        '<form class="dag-login" novalidate style="display:none">' +
          '<h3>' + T.loginTitle + '</h3><p class="dag-sub">' + T.loginSub + '</p>' +
          '<label for="dagLEmail">' + T.email + '</label><input id="dagLEmail" type="email" autocomplete="email" dir="ltr" />' +
          '<button type="submit" class="dag-btn">' + T.loginBtn + '</button>' +
          '<p class="dag-msg"></p>' +
          '<p class="dag-switch">' + T.noAcc + '<a data-go="reg">' + T.noAccLink + '</a></p>' +
        '</form>' +
        /* code view (v39) */
        '<form class="dag-code" novalidate style="display:none">' +
          '<h3>' + T.codeTitle + '</h3><p class="dag-sub">' + T.codeSub + ' <b class="dag-to" dir="ltr"></b></p>' +
          '<label for="dagCode">' + T.codeLabel + '</label><input id="dagCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" dir="ltr" class="dag-codein" />' +
          '<button type="submit" class="dag-btn">' + T.codeBtn + '</button>' +
          '<p class="dag-msg" role="status"></p>' +
          '<p class="dag-switch"><a data-act="resend">' + T.codeResend + '</a> · <a data-go="login">' + T.codeOther + '</a></p>' +
        '</form>' +
      '</div>';
    document.body.appendChild(ov);

    ov.querySelector('.dag-x').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });
    Array.prototype.forEach.call(ov.querySelectorAll('[data-go]'), function (a) {
      a.addEventListener('click', function () { show(a.getAttribute('data-go')); });
    });

    ov.querySelector('.dag-reg').addEventListener('submit', onRegister);
    ov.querySelector('.dag-login').addEventListener('submit', onLoginLink);
    ov.querySelector('.dag-code').addEventListener('submit', onCode);
    ov.querySelector('[data-act="resend"]').addEventListener('click', onResend);
    ov.querySelector('#dagCode').addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').slice(0, 6);
      if (this.value.length === 6) ov.querySelector('.dag-code .dag-btn').click();
    });
  }

  var codeEmail = '';
  function show(view) {
    ov.querySelector('.dag-reg').style.display = (view === 'login' || view === 'code') ? 'none' : '';
    ov.querySelector('.dag-login').style.display = view === 'login' ? '' : 'none';
    ov.querySelector('.dag-code').style.display = view === 'code' ? '' : 'none';
    Array.prototype.forEach.call(ov.querySelectorAll('.dag-msg'), function (m) { m.className = 'dag-msg'; m.textContent = ''; });
    if (view === 'code') { ov.querySelector('.dag-to').textContent = codeEmail; ov.querySelector('#dagCode').value = ''; }
    var first = ov.querySelector(view === 'login' ? '#dagLEmail' : view === 'code' ? '#dagCode' : '#dagName');
    setTimeout(function () { try { first.focus(); } catch (e) {} }, 50);
  }

  function open(view) {
    build();
    show(view || 'reg');
    ov.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    if (!ov) return;
    ov.classList.remove('open');
    document.documentElement.style.overflow = '';
    pending = null;
  }

  function msg(form, text, ok) {
    var m = form.querySelector('.dag-msg');
    m.textContent = text;
    m.className = 'dag-msg ' + (ok ? 'ok' : 'err');
  }

  function onRegister(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var nameEl = form.querySelector('#dagName'), emailEl = form.querySelector('#dagEmail'), phoneEl = form.querySelector('#dagPhone');
    [nameEl, emailEl, phoneEl].forEach(function (el) { el.classList.remove('err'); });

    var name = nameEl.value.trim().replace(/\s+/g, ' ');
    var email = emailEl.value.trim().toLowerCase();
    var phone = normPhone(phoneEl.value);

    if (!name) { nameEl.classList.add('err'); return msg(form, T.errName); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailEl.classList.add('err'); return msg(form, T.errEmail); }
    if (!phone) { phoneEl.classList.add('err'); return msg(form, T.errPhone); }

    var btn = form.querySelector('.dag-btn');
    btn.disabled = true; btn.textContent = T.regBusy;

    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, phone: phone })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        btn.disabled = false; btn.textContent = T.regBtn;
        if (res && (res.status === 'verify' || res.status === 'exists')) {
          /* v39: new or existing email → we emailed a code; prove it's yours */
          if (window.gtag) gtag('event', 'sign_up', { method: 'checkout_gate' });
          codeEmail = email;
          try { localStorage.setItem('dirbalk_return_to', location.pathname + location.search); } catch (e3) {}
          show('code');
          if (res.limited) msg(ov.querySelector('.dag-code'), res.message, false); // v40: too many codes — use the last one
        } else if (res && res.status === 'success' && res.session) {
          finishLogin(res); // older backend without codes
        } else {
          msg(form, (res && res.message) || T.errGeneric);
        }
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = T.regBtn;
        msg(form, T.errGeneric);
      });
  }

  function onLoginLink(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var emailEl = form.querySelector('#dagLEmail');
    emailEl.classList.remove('err');
    var email = emailEl.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailEl.classList.add('err'); return msg(form, T.errEmail); }

    var btn = form.querySelector('.dag-btn');
    btn.disabled = true; btn.textContent = T.loginBusy;

    /* remember where they were, so enter.html can bring them back here */
    try { localStorage.setItem('dirbalk_return_to', location.pathname + location.search); } catch (e3) {}

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'link', email: email })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        btn.disabled = false; btn.textContent = T.loginBtn;
        if (res && res.status === 'error') return msg(form, res.message || T.errGeneric);
        codeEmail = email;
        show('code');
        if (res && res.status === 'limited') msg(ov.querySelector('.dag-code'), res.message, false);
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = T.loginBtn;
        msg(form, T.errGeneric);
      });
  }

  function finishLogin(res) {
    setSession({ name: res.name || '', email: res.email || codeEmail, phone: res.phone || '', gender: res.gender || '', session: res.session || '' });
    try { localStorage.removeItem('dirbalk_return_to'); } catch (e) {}
    if (window.gtag) gtag('event', 'login', { method: 'email_code' });
    var cb = pending;
    pending = null;
    close();
    try { window.dispatchEvent(new CustomEvent('dirbalk:login')); } catch (e2) {}
    if (cb) cb();
  }

  function onCode(e) {
    e.preventDefault();
    var form = e.currentTarget, input = form.querySelector('#dagCode');
    var code = input.value.replace(/\D/g, '');
    if (code.length !== 6) { input.classList.add('err'); return msg(form, T.errCode); }
    input.classList.remove('err');
    var btn = form.querySelector('.dag-btn');
    if (btn.disabled) return;
    btn.disabled = true; btn.textContent = T.codeBusy;
    fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'code', email: codeEmail, code: code }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        btn.disabled = false; btn.textContent = T.codeBtn;
        if (res && res.status === 'success' && res.session) return finishLogin(res);
        input.classList.add('err'); input.select();
        msg(form, (res && res.message) || T.errGeneric);
      })
      .catch(function () { btn.disabled = false; btn.textContent = T.codeBtn; msg(form, T.errGeneric); });
  }

  function onResend() {
    var form = ov.querySelector('.dag-code');
    fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'link', email: codeEmail }) })
      .then(function (r) { return r.json(); })
      .then(function (res) { msg(form, res && res.status === 'limited' ? res.message : T.codeResent, !(res && res.status === 'limited')); }, function () { msg(form, T.errGeneric); });
  }

  /* open straight on the code step (e.g. after signin.html sent a code) */
  function openCode(email, onReady, note) {
    codeEmail = (email || '').toLowerCase();
    pending = onReady || null;
    build();
    show('code');
    if (note) msg(ov.querySelector('.dag-code'), note, false);
    ov.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }

  function requireAuth(onReady) {
    if (isLoggedIn()) { if (onReady) onReady(); return; }
    pending = onReady || null;
    open('reg');
  }

  /* ends the session on the server too; resolves when done (or after 3s) */
  function logout() {
    var key = session();
    clearLocal();
    if (!key) return Promise.resolve();
    var req = fetch('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'logout', session: key }), keepalive: true })
      .then(function () {}, function () {});
    return Promise.race([req, new Promise(function (r) { setTimeout(r, 3000); })]);
  }

  /* the server said the session is gone → clean up and offer a login link */
  function expired() {
    clearLocal();
    try { window.dispatchEvent(new CustomEvent('dirbalk:logout')); } catch (e) {}
    open('login');
  }

  window.DirbalkAuth = { isLoggedIn: isLoggedIn, require: requireAuth, open: open, openCode: openCode, logout: logout, expired: expired, session: session, normPhone: normPhone };
})();
