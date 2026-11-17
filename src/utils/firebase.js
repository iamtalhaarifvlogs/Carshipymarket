
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:dummy",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let analytics = null;
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  isAnalyticsSupported()
    .then((ok) => {
      if (ok) analytics = getAnalytics(app);
    })
    .catch((err) => console.warn("Analytics disabled:", err));
}

let messaging = null;

export const initializeMessaging = async () => {
  if (typeof window === "undefined") return null;
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  } catch (error) {
    console.warn("Firebase Messaging init failed:", error);
    return null;
  }
};

export { app, analytics };

export const requestFcmToken = async (registration) => {
  try {
    const messaging = await initializeMessaging();
    if (!messaging) return null;

    if (typeof window === "undefined" || typeof Notification === "undefined") {
      console.warn("Notifications are not available in this browser environment.");
      return null;
    }

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") {
      console.warn("Notification permission not granted:", permission);
      return null;
    }

    const tokenOptions = {};
    if (process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
      tokenOptions.vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    }
    if (registration) {
      tokenOptions.serviceWorkerRegistration = registration;
    }

    return await getToken(messaging, tokenOptions);
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const subscribeToForegroundMessages = async (callback) => {
  const messaging = await initializeMessaging();
  if (!messaging) return;
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};
