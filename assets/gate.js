/* DIRBALK — assets/gate.js  (load FIRST in <head> of every inside page)
   While the drop is closed, the inside of the site (home, shop, product,
   cart, checkout, account, story, about, help, sign-in…) is for the team only.
   Everyone else is sent to the public waiting page at "/".

   Team access: open /preview.html once on your device and enter the
   'Preview PIN' (Settings sheet) — or sign in to /admin.html.
   That device then sees everything until "Exit preview".

   When the drop is open (admin → drop switch) every page is public again.
   Note: this is a front-end gate. It keeps the public out of the
   unfinished site; it is not a lock for secret data. */
(function () {
  var d = document.documentElement;
  try { if (localStorage.getItem('dirbalk_preview') === '1') return; } catch (e) {}
  d.style.visibility = 'hidden';
  function decide(open) {
    if (open) d.style.visibility = '';
    else location.replace('/');
  }
  try {
    var c = JSON.parse(sessionStorage.getItem('dirbalk_status') || 'null');
    if (c && Date.now() - c.t < 60000) { decide(!!c.open); return; }
  } catch (e) {}
  fetch('/api/passport', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"kind":"status"}' })
    .then(function (r) { return r.json(); })
    .then(function (r) {
      var open = !!(r && r.status === 'success' && r.dropOpen);
      try { sessionStorage.setItem('dirbalk_status', JSON.stringify({ open: open, t: Date.now() })); } catch (e) {}
      decide(open);
    })
    .catch(function () { decide(false); });
})();
