/**
 * @file store.js
 * @description Redux store configuration.
 * Sets up the Redux Toolkit store with global reducers.
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";

// Configure and export the global Redux store
export const store = configureStore({
    reducer: {
        auth: authReducer, // Reducer slice for authentication state
    },
});