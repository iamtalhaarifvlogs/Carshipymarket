/**
 * @file auth.slice.js
 * @description Redux slice for managing user authentication state.
 * Implements asynchronous thunks for login, signup, OTP verify, profile fetching/updating,
 * and account deletion. Handles state mutation and local storage sync for auth tokens.
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, signupAPI, verifyAPI, resendOTP_API, forgetAPI, resetPassword_API, forgotPasswordVerifyAPI, getProfileAPI, updateProfileAPI, deleteUserAPI, googleLoginAPI } from "@/services/auth.service";

/**
 * Async Thunk: Logs in user with email/password credentials.
 * Stores JWT token and user details in state and localStorage on success.
 */
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await loginAPI(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Login failed");
        }
    }
);

/**
 * Async Thunk: Logs in user using Google Social OAuth token.
 * Stores credentials in localStorage and state on success.
 */
export const googleLoginUser = createAsyncThunk(
    "auth/googleLoginUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await googleLoginAPI(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Login failed");
        }
    }
);

/**
 * Async Thunk: Registers a new user account.
 * Note: Does not log user in directly; requires subsequent verification.
 */
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await signupAPI(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Signup failed");
        }
    }
);

/**
 * Async Thunk: Initiates password reset by requesting OTP code to be sent to user's email.
 */
export const forgetUser = createAsyncThunk(
    "auth/forgetUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await forgetAPI(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Forget password failed");
        }
    }
);

/**
 * Async Thunk: Verifies OTP code submitted during account recovery.
 */
export const verifyUser = createAsyncThunk(
    "auth/verifyUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await verifyAPI(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Verification failed");
        }
    }
);

/**
 * Async Thunk: Verifies email token during sign-up confirmation.
 */
export const forgotPasswordVerify = createAsyncThunk(
    "auth/forgotPasswordVerify",
    async (data, { rejectWithValue }) => {
        try {
            const res = await forgotPasswordVerifyAPI(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Verification failed");
        }
    }
);

/**
 * Async Thunk: Resends the OTP verification code to the user's email.
 */
export const resendOTP = createAsyncThunk(
    "auth/resendOTP",
    async (data, { rejectWithValue }) => {
        try {
            const res = await resendOTP_API(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to resend OTP");
        }
    }
);

/**
 * Async Thunk: Resets user's account password using OTP/verification details.
 */
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (data, { rejectWithValue }) => {
        try {
            const res = await resetPassword_API(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to reset password");
        }
    }
);

/**
 * Async Thunk: Retrieves the profile details of the currently logged-in user.
 * Performs automatic cleanup of invalid sessions if fetching fails with status reject.
 */
export const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getProfileAPI();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch profile");
        }
    }
);

/**
 * Async Thunk: Updates profile fields for the authenticated user.
 */
export const updateUserProfile = createAsyncThunk(
    "auth/updateUserProfile",
    async (data, { rejectWithValue }) => {
        try {
            const res = await updateProfileAPI(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update profile");
        }
    }
);

/**
 * Async Thunk: Deletes the currently authenticated user profile account.
 */
export const deleteUserProfile = createAsyncThunk(
    "auth/deleteUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await deleteUserAPI();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete account");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,       // Currently logged in user profile object
        token: null,      // Active JWT authentication token
        loading: false,   // Processing state indicator
        error: null,      // Active request error details
    },
    reducers: {
        // Log out user, flush states, and purge localStorage credentials
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        // Synchronously update token state (e.g. on application initial load)
        setToken: (state, action) => {
            state.token = action.payload;
        },
        // Synchronously update user object state
        setUser: (state, action) => {
            state.user = action.payload;
        },
        // Clear active error string
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login Actions cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                const payloadData = action.payload?.data || action.payload;
                state.user = payloadData?.user;
                state.token = payloadData?.token;
                if (payloadData?.token) {
                    localStorage.setItem("token", payloadData?.token);
                }
                if (payloadData?.user) {
                    localStorage.setItem("user", JSON.stringify(payloadData?.user));
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Signup Actions cases
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                // Note: Token is not stored here; user must verify OTP and login
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verification Actions cases
            .addCase(verifyUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Resend OTP cases
            .addCase(resendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User Profile cases
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                const payloadData = action.payload?.data || action.payload;
                state.user = payloadData?.user || payloadData;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.token = null;
                localStorage.removeItem("token");
            })
            // Update Profile cases
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                const payloadData = action.payload?.data || action.payload;
                state.user = {
                    ...state.user,
                    ...(payloadData?.user || payloadData)
                };
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete User Profile cases
            .addCase(deleteUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserProfile.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem("token");
            })
            .addCase(deleteUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setToken, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;