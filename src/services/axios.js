/**
 * @file axios.js
 * @description Centralized Axios instance configuration.
 * Configures the base URL for API endpoints, attaches JWT to outgoing requests,
 * and handles interceptors for automatic session termination in case of 401 Unauthorized errors.
 */

import axios from "axios";

// Create an instance of axios with the backend base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor: Inject Authorization and FCM headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const fcmToken = typeof window !== "undefined" ? localStorage.getItem("fcm_token") : null;

    // Attach JWT authorization token if available
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach Firebase FCM token to request headers if available
    if (fcmToken) {
        config.headers["fcm-token"] = fcmToken;
    }

    return config;
});

// Response interceptor: Global error handler (e.g. 401 Unauthorized status checking)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Automatically logout and redirect if token has expired or is invalid
        if (error.response && error.response.status === 401) {
            // Do not redirect if it's a standard login or google login attempt
            const isLoginRequest = error.config?.url?.includes("/users/login") || error.config?.url?.includes("/users/google-login");
            
            if (!isLoginRequest && typeof window !== "undefined") {
                // Clear session storage values
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // Redirect user back to the login page
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
