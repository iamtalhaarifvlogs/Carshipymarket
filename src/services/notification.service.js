/**
 * @file notification.service.js
 * @description Service for managing notification-related API operations.
 */

import api from "./axios";

/**
 * Fetch notifications for the logged-in user.
 * @returns {Promise<Object>} Axios API response containing list of notifications.
 */
export const getMyNotificationsAPI = async () => {
  try {
    const response = await api.get("/notifications/my");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark a specific notification as read.
 * @param {string|number} id - Unique identifier of the notification.
 * @returns {Promise<Object>} Axios API response.
 */
export const readNotificationAPI = async (id) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
