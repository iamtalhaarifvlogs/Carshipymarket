importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCzj_em0OmfMglK88OO3F7365QqO0qCVb4",
  authDomain: "ogamoto-a01db.firebaseapp.com",
  projectId: "ogamoto-a01db",
  storageBucket: "ogamoto-a01db.firebasestorage.app",
  messagingSenderId: "273372210333",
  appId: "1:273372210333:web:501fe6bd76149a3a09e074",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || payload?.data?.title || "Okomoto Update";
  const options = {
    body: payload?.notification?.body || payload?.data?.body || "New update received.",
    icon: "/icon.ico",
  };

  self.registration.showNotification(title, options);
});
