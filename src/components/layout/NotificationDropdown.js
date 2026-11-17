"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { getMyNotificationsAPI, readNotificationAPI } from "@/services/notification.service";

function timeAgo(dateParam) {
  if (!dateParam) return "";

  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
  if (isNaN(date.getTime())) return "";

  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 5) {
    return "just now";
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes === 1) {
    return "1 minute ago";
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return "1 hour ago";
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days === 1) {
    return "yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

const mapBackendNotification = (notif) => {
  const data = notif.data || {};
  
  // Title mapping
  const title = data.title || notif.title || "Notification";
  
  // Description mapping
  const description = data.description || notif.short_description || notif.message || notif.body || notif.description || "";
  
  // Unread mapping: is_read: 0 is unread, is_read: 1 is read
  let unread = true;
  if (notif.is_read !== undefined && notif.is_read !== null) {
    unread = notif.is_read === 0 || notif.is_read === false;
  } else if (notif.isRead !== undefined) {
    unread = !notif.isRead;
  } else if (notif.unread !== undefined) {
    unread = !!notif.unread;
  }
  
  // Type mapping: UI expects "success", "warning", "info".
  let typeVal = data.type || notif.notification_type || notif.type || "info";
  let type = "info";
  
  if (typeVal === "success") {
    type = "success";
  } else if (typeVal === "warning") {
    type = "warning";
  } else if (typeVal === "info") {
    type = "info";
  } else {
    const numType = Number(typeVal);
    if ([3, 4, 5, 10, 12].includes(numType)) {
      type = "success";
    } else if ([2, 7, 11].includes(numType)) {
      type = "warning";
    } else {
      type = "info"; // default for 1, 6, 8, 9, 99 or unknown values
    }
  }
  
  return {
    id: notif.id || notif._id,
    title,
    description,
    time: timeAgo(notif.created_at || notif.createdAt || notif.time),
    unread,
    type
  };
};

export default function NotificationDropdown({ unreadNotificationCount }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationDropdownRef = useRef(null);
  const { token } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchNotifications = useCallback(async () => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !savedToken) {
      setNotifications([]);
      setLoaded(true);
      return;
    }
    try {
      const response = await getMyNotificationsAPI();
      let fetchedData = response?.data?.notifications || response?.notifications || response?.data || response || [];
      if (!Array.isArray(fetchedData)) {
        fetchedData = [];
      }
      const mapped = fetchedData.map(mapBackendNotification);
      setNotifications(mapped);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoaded(true);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen, fetchNotifications]);

  useEffect(() => {
    const handleNewNotification = () => {
      fetchNotifications();
    };
    window.addEventListener("new-notification", handleNewNotification);
    return () => {
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
    try {
      await readNotificationAPI(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((notif) => notif.unread);
    if (unreadNotifications.length === 0) return;

    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false }))
    );
    try {
      await Promise.all(
        unreadNotifications.map((notif) => readNotificationAPI(notif.id))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      fetchNotifications();
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = loaded
    ? notifications.filter((n) => n.unread).length
    : (Number(unreadNotificationCount) || 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative" ref={notificationDropdownRef}>
      <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="ok-notification-btn"
        style={{ opacity: 0.85 }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="ok-notification-badge">{unreadCount}</span>
        )}
      </button>

      {notificationsOpen && (
        <div className="ok-notification-dropdown">
          <div className="ok-notification-header">
            <h4 className="ok-notification-title">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="ok-notification-mark-read"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="ok-notification-list">
            {notifications.length === 0 ? (
              <div className="ok-notification-empty">
                <div className="ok-notification-empty-icon">🔔</div>
                <p className="ok-notification-empty-text">No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`ok-notification-item ${
                    notif.unread ? "unread" : ""
                  }`}
                >
                  <div className={`ok-notification-icon-wrap ${notif.type}`}>
                    {notif.type === "success" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {notif.type === "info" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                    {notif.type === "warning" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    )}
                  </div>
                  <div className="ok-notification-content">
                    <h5 className="ok-notification-item-title">{notif.title}</h5>
                    <p className="ok-notification-item-desc">{notif.description}</p>
                    <span className="ok-notification-time">{notif.time}</span>
                  </div>
                  {notif.unread && <div className="ok-notification-dot" />}
                </div>
              ))
            )}
          </div>
          {/* {notifications.length > 0 && (
            <div className="ok-notification-footer">
              <button
                onClick={clearAllNotifications}
                className="ok-notification-footer-btn"
              >
                Clear All
              </button>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}