// DIRBALK — shared push-notification helper (assets/push.js)
// Used by both admin.html and me.html so the enable-notifications flow
// only lives in one place.

window.DirbalkPush = (function () {
  var FIREBASE_CONFIG = {
    apiKey: 'AIzaSyAvyFNsGYMb7bTb7LYENz6UgDVa6ECVmkw',
    authDomain: 'dirbalk-push.firebaseapp.com',
    projectId: 'dirbalk-push',
    storageBucket: 'dirbalk-push.firebasestorage.app',
    messagingSenderId: '973677797480',
    appId: '1:973677797480:web:e3f37cac4d390889129bdd'
  };
  var VAPID_KEY = 'BLmuKPrYowF3O8vnz2e2rGxLjwqzS3Inorz9aXWEJxiqdm0AlHvVndXUNRFZXF0CAP99DbHDkgXWmdf6gv3iuU4';

  var sdkLoaded = false;
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('load failed: ' + src)); };
      document.head.appendChild(s);
    });
  }

  function ensureSdk() {
    if (sdkLoaded) return Promise.resolve();
    return loadScript('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js')
      .then(function () { return loadScript('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js'); })
      .then(function () {
        firebase.initializeApp(FIREBASE_CONFIG);
        sdkLoaded = true;
      });
  }

  /**
   * enable(endpoint, bodyBase, onDone)
   * endpoint: e.g. '/api/account' or '/api/admin-data'
   * bodyBase: e.g. { kind: 'registerPushToken', email } or { kind: 'registerPushToken', key }
   * onDone: function({ ok, message })
   */
  function enable(endpoint, bodyBase, onDone) {
    if (!('serviceWorker' in navigator) || !('Notification' in window) || !window.isSecureContext) {
      onDone({ ok: false, message: 'المتصفح ما بيدعم الإشعارات، أو الموقع مش مفتوح عبر https.' });
      return;
    }

    ensureSdk()
      .then(function () { return navigator.serviceWorker.register('/firebase-messaging-sw.js'); })
      .then(function (registration) { return Notification.requestPermission().then(function (permission) { return { permission: permission, registration: registration }; }); })
      .then(function (r) {
        if (r.permission !== 'granted') {
          onDone({ ok: false, message: 'ما وافقت على الإشعارات — تقدر تفعّلها بعدين من إعدادات المتصفح.' });
          return null;
        }
        var messaging = firebase.messaging();
        return messaging.getToken({ vapidKey: VAPID_KEY, serviceWorkerRegistration: r.registration });
      })
      .then(function (token) {
        if (!token) return; // already handled (permission denied) or getToken failed silently
        var body = JSON.parse(JSON.stringify(bodyBase));
        body.token = token;
        return fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
          .then(function (r) { return r.json(); })
          .then(function (result) {
            onDone({ ok: result.status === 'success', message: result.message || (result.status === 'success' ? 'تم تفعيل الإشعارات.' : 'صار خطأ، جرب كمان مرة.') });
          });
      })
      .catch(function () {
        onDone({ ok: false, message: 'صار خطأ، جرب كمان مرة.' });
      });
  }

  return { enable: enable };
})();
