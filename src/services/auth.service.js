/**
 * @file auth.service.js
 * @description Authentication service methods.
 * Defines API calling functions to interact with user authentication endpoints,
 * including registration, standard login, Google social login, profile fetch/update, and account deletion.
 */

import api from "./axios";

/**
 * Log in a user with email and password credentials.
 * @param {Object} data - User credentials { email, password }
 * @returns {Promise} Axios response promise
 */
export const loginAPI = (data) => {
    return api.post("/users/login", data);
};

/**
 * Log in or sign up a user using a Google OAuth IdToken.
 * @param {Object} data - Google token data { token }
 * @returns {Promise} Axios response promise
 */
export const googleLoginAPI = (data) => {
    return api.post("/users/google-login", data);
};

/**
 * Register a new user account.
 * @param {Object} data - Sign up details { name, email, password, phone }
 * @returns {Promise} Axios response promise
 */
export const signupAPI = (data) => {
    return api.post("/users/create", data);
};

/**
 * Initiate the forgot-password flow. Sends OTP reset request to user's email.
 * @param {Object} data - Password forget data { email }
 * @returns {Promise} Axios response promise
 */
export const forgetAPI = (data) => {
    return api.post("/users/forgot-password", data);
};

/**
 * Verify OTP entered during forgot-password recovery.
 * @param {Object} data - verification data { email, otp }
 * @returns {Promise} Axios response promise
 */
export const verifyAPI = (data) => {
    return api.post("/users/forgot-password/verify-otp", data);
};

/**
 * Verify account verification token.
 * @param {Object} data - verification credentials { email, verificationCode }
 * @returns {Promise} Axios response promise
 */
export const forgotPasswordVerifyAPI = (data) => {
    return api.post("/users/verify", data);
};

/**
 * Resend verification OTP code to user's email.
 * @param {Object} data - { email }
 * @returns {Promise} Axios response promise
 */
export const resendOTP_API = (data) => {
    return api.post("/users/resend-otp", data);
};

/**
 * Reset password using OTP/verification details.
 * @param {Object} data - { email, otp, password }
 * @returns {Promise} Axios response promise
 */
export const resetPassword_API = (data) => {
    return api.post("/users/reset-password", data);
};

/**
 * Retrieve current logged-in user's profile details.
 * @returns {Promise} Axios response promise containing profile details
 */
export const getProfileAPI = () => {
    return api.get("/users/profile");
};

/**
 * Update current user's profile fields.
 * @param {Object} data - Profile fields to patch
 * @returns {Promise} Axios response promise containing updated profile
 */
export const updateProfileAPI = (data) => {
    return api.patch("/users/profile", data);
};

/**
 * Delete the currently authenticated user's account.
 * @returns {Promise} Axios response promise
 */
export const deleteUserAPI = () => {
    return api.delete("/users");
};
