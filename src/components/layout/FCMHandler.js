"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  requestFcmToken,
  subscribeToForegroundMessages,
} from "@/utils/firebase";
import { saveFcmTokenAPI } from "@/services/fcm.service";

export default function FCMHandler() {
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedFcmToken = typeof window !== "undefined" ? localStorage.getItem("fcm_token") : null;
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const isAuthenticated = !!token || !!savedToken;

    if (isAuthenticated && savedFcmToken) {
      saveFcmTokenAPI(savedFcmToken).catch((err) => {
        console.error("Failed to save FCM token to backend on login change:", err);
      });
    }
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let unsubscribe;

    const initFCM = async () => {
      try {
        let registration = null;

        if ("serviceWorker" in navigator) {
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          await navigator.serviceWorker.ready;
        }

        const fcmToken = await requestFcmToken(registration || undefined);

        if (fcmToken) {
          localStorage.setItem("fcm_token", fcmToken);
          const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          if (savedToken) {
            saveFcmTokenAPI(fcmToken).catch((err) => {
              console.error("Failed to save FCM token to backend on fetch:", err);
            });
          }
        }
      } catch (error) {
        console.error("FCM initialization failed:", error);
      }
    };

    const setupForegroundListener = async () => {
      unsubscribe = await subscribeToForegroundMessages((payload) => {
        const title =
          payload?.notification?.title || payload?.data?.title || "Notification";

        const body =
          payload?.notification?.body || payload?.data?.body || "";

        toast.info(
          <div>
            <strong>{title}</strong>
            {body && (
              <>
                <br />
                {body}
              </>
            )}
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("new-notification", { detail: payload }));
        }
      });
    };

    initFCM();
    setupForegroundListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return null;
}
