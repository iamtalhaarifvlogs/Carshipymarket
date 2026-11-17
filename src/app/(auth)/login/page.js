"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLoginUser } from "@/store/slices/auth.slice";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import logoImg from "@/assets/images/logo.svg";
import loginBgImg from "@/assets/images/loginbg.jpg";

// Component rendering login layout, inputs, and form controls
function LoginContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error, token } = useSelector((state) => state.auth);
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified");

    // Hook handler to handle success/error states for Google OAuth flow
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            dispatch(googleLoginUser({ token: tokenResponse.access_token }))
                .unwrap()
                .then(() => router.push("/dashboard"))
                .catch((err) => console.error("Google login failed:", err));
        },
        onError: (error) => console.error("Google Sign-In failed:", error),
    });

    // Recovers saved credentials if rememberMe is true and redirects to dashboard if authenticated
    useEffect(() => {
        // Load remembered credentials if present
        const savedRememberMe = localStorage.getItem("rememberMe") === "true";
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedRememberMe && savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }

        const savedToken = localStorage.getItem("token");
        if (token || savedToken) {
            router.push("/dashboard");
        } else {
            setShouldRender(true);
        }
    }, [token, router]);

    if (!shouldRender) {
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center" style={{ background: "#050913" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Handles standard email/password authentication submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return;

        // Remember Me Logic
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberMe");
        }

        dispatch(loginUser({ email, password }))
            .unwrap()
            .then(() => router.push("/dashboard"))
            .catch((err) => console.error("Login failed:", err));
    };

    return (
        <div className="ok-auth-shell d-flex min-vh-100">

            {/* Left: Login Form */}
            <div className="ok-auth-right flex-grow-1 overflow-y-auto py-4">
                <div className="ok-auth-form-wrap my-auto">

                    {/* Logo */}
                    <div className="ok-auth-brand">
                        <Link href="/">
                            <Image src={logoImg} alt="Okomoto" height={110} width={180} />
                        </Link>
                    </div>

                    <h1 className="ok-auth-title mb-2">
                        Welcome back
                    </h1>

                    {verified && (
                        <div className="ok-alert-success mb-4">
                            <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <p className="fw-bold mb-0" style={{ fontSize: "0.9375rem" }}>Account verified successfully! You can now sign in.</p>
                        </div>
                    )}

                    <p className="ok-auth-sub mb-4 mb-lg-5">
                        Sign in to manage your car exports and track shipments.
                    </p>

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                        {/* Email */}
                        <div>
                            <label className="ok-auth-label d-block mb-2">Email Address</label>
                            <div className="ok-input-wrapper">
                                <span className="ok-input-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="ok-auth-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="ok-auth-label d-block mb-2">Password</label>
                            <div className="ok-input-wrapper">
                                <span className="ok-input-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="ok-auth-input ok-auth-input-pr"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="ok-eye-btn">
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2.133 12.844A10.025 10.025 0 0 1 12 5c7 0 10 7 10 7s-3 7-10 7a9.907 9.907 0 0 1-9.867-6.156" />
                                            <circle cx="12" cy="12" r="3" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember / Forgot */}
                        <div className="d-flex align-items-center justify-content-between py-1">
                            <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input m-0" 
                                    style={{ width: 18, height: 18, accentColor: "#1A3A6E" }} 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="ok-auth-remember">Remember me</span>
                            </label>
                            <Link href="/forgot-password" size="sm" className="ok-auth-forgot text-decoration-none">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="ok-alert-error">
                                {error?.message || "Login failed. Please try again."}
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button type="submit" disabled={loading} className="ok-btn-primary">
                            {loading ? (
                                <><span className="ok-spinner"></span> Logging in...</>
                            ) : (
                                <>Sign In</>
                            )}
                        </button>



                        {/* Footer link */}
                        <div className="ok-auth-footer pt-3">
                            <span>Don&apos;t have an account? </span>
                            <Link href="/signup" className="ok-auth-forgot text-decoration-none">
                                Create one now
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right: Image */}
            <div className="ok-auth-left flex-shrink-0">
                <Image src={loginBgImg} alt="Import/Export Logistics" fill style={{ objectFit: "cover" }} />
                <div className="ok-auth-overlay"></div>
            </div>
        </div>
    );
}

// Page component wrapper for LoginContent utilizing Suspense bounds
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="vh-100 d-flex align-items-center justify-content-center bg-white">
                <div className="ok-spinner" style={{ width: 40, height: 40, borderWidth: 4, borderColor: "rgba(29,59,108,.2)", borderTopColor: "#1D3B6C" }}></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
