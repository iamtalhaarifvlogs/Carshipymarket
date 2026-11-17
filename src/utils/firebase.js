import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

let messaging = null;

export const initializeMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();

  if (!supported) {
    console.warn("Firebase Messaging is not supported in this browser.");
    return null;
  }

  if (!messaging) {
    messaging = getMessaging(app);
  }

  return messaging;
};

export { app };

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

    const token = await getToken(messaging, tokenOptions);
    return token;
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
