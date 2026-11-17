/**
 * @file fcm.service.js
 * @description Firebase Cloud Messaging related API helpers.
 * Keeps device token registration separate from auth/profile concerns.
 */

import { updateProfileAPI } from "./auth.service";

/**
 * Register or refresh the current device's FCM token for the authenticated user.
 * @param {string} token - Firebase Cloud Messaging registration token
 * @returns {Promise} Axios response promise
 */
export const saveFcmTokenAPI = (token) => {
  return updateProfileAPI({
    fcm_token: token,
  });
};
