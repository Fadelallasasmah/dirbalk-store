// DIRBALK — Firebase Cloud Messaging service worker.
// Must be served from the site root (https://dirbalk.com/firebase-messaging-sw.js)
// so its scope covers the whole origin.

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAvyFNsGYMb7bTb7LYENz6UgDVa6ECVmkw',
  authDomain: 'dirbalk-push.firebaseapp.com',
  projectId: 'dirbalk-push',
  storageBucket: 'dirbalk-push.firebasestorage.app',
  messagingSenderId: '973677797480',
  appId: '1:973677797480:web:e3f37cac4d390889129bdd'
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  var title = (payload.notification && payload.notification.title) || 'DIRBALK';
  var link = (payload.fcmOptions && payload.fcmOptions.link) ||
    (payload.data && payload.data.link) || 'https://dirbalk.com/';

  self.registration.showNotification(title, {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/logo.png',
    data: { link: link }
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var link = (event.notification.data && event.notification.data.link) || 'https://dirbalk.com/';
  event.waitUntil(clients.openWindow(link));
});
