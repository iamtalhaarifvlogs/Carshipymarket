/**
 * @file AuthContext.js
 * @description Authentication Context Provider.
 * Detects stored authentication tokens on initial render and dispatches Redux actions
 * to restore the user session and profile details automatically.
 */

"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken, fetchUserProfile } from "@/store/slices/auth.slice";

// Create context for authentication state share
const AuthContext = createContext();

/**
 * AuthProvider component that wraps the application.
 * Restores user session and triggers token verification on mount.
 */
export function AuthProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // Read token from localStorage to check for an active session
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            // Restore token state in Redux slice
            dispatch(setToken(savedToken));
            // Trigger API request to fetch user profile details to ensure the token is still valid
            dispatch(fetchUserProfile());
        }
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access authentication context state.
 * @returns {Object} AuthContext values
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
