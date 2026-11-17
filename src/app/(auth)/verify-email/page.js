"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyUser, resendOTP, clearError, forgotPasswordVerify } from "@/store/slices/auth.slice";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/images/logo.svg";
import loginBgImg from "@/assets/images/loginbg.jpg";

// Component rendering the email OTP verification form and resend handlers
function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const email = searchParams.get("email") || (typeof window !== "undefined" ? localStorage.getItem("userEmail") : "");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resendSuccess, setResendSuccess] = useState(false);
    const inputRefs = useRef([]);

    // Clears any auth errors on render
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Handles OTP input changes and auto-focuses the next input index
    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1].focus();
    };

    // Handles Backspace behavior to focus the previous input index
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Handles pasting clipboard content into the OTP input fields
    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasteData)) return;
        const newOtp = [...otp];
        pasteData.split("").forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
        const nextIndex = Math.min(pasteData.length, 5);
        inputRefs.current[nextIndex].focus();
    };

    // Submits the OTP verification code to the auth slice
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const fullOtp = otp.join("");
        if (fullOtp.length !== 6) return;
        dispatch(forgotPasswordVerify({ email, otp: fullOtp }))
            .unwrap()
            .then(() => router.push("/login?verified=true"))
            .catch((err) => console.error("Verification failed:", err));
    };

    // Requests the server to resend the verification code
    const handleResend = () => {
        if (!email) return;
        setResendSuccess(false);
        dispatch(resendOTP({ email }))
            .unwrap()
            .then(() => {
                setResendSuccess(true);
                setTimeout(() => setResendSuccess(false), 5000);
            })
            .catch((err) => console.error("Failed to resend OTP:", err));
    };

    return (
        <div className="ok-auth-shell d-flex min-vh-100">

           
            {/* Right: Verify Form */}
            <div className="ok-auth-right flex-grow-1 overflow-auto py-4">
                <div className="ok-auth-form-wrap my-auto">

                    {/* Logo */}
                    <div className="mb-4 mb-lg-5">
                        <Link href="/">
                            <Image src={logoImg} alt="Okomoto" height={55} style={{ width: "auto", cursor: "pointer" }} />
                        </Link>
                    </div>

                    <h1 className="ok-auth-title mb-2">
                        Verify your email
                    </h1>
                    <p className="ok-auth-sub mb-5">
                        We sent a verification code to{" "}
                        <span className="fw-bold" style={{ color: "#101828" }}>{email || "your email"}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        <div>
                            <label className="ok-auth-label d-block mb-3">Enter Code</label>
                            <div className="d-flex gap-2 gap-sm-3 justify-content-between">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="ok-otp-input"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Error / Success messages */}
                        {error && (
                            <div className="ok-alert-error">
                                {typeof error === "string" ? error : "Verification failed. Please check the code and try again."}
                            </div>
                        )}

                        {resendSuccess && (
                            <div className="ok-alert-info">
                                Verification code resent successfully!
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={loading || otp.some((d) => !d)} className="ok-btn-primary">
                            {loading ? (
                                <><span className="ok-spinner"></span> Verifying...</>
                            ) : (
                                "Continue"
                            )}
                        </button>
                         

                        <div className="ok-auth-footer">
                            <p className="mb-1">Didn&apos;t receive the code?</p>
                            <button
                                type="button"
                                onClick={handleResend}
                                className="ok-auth-forgot btn btn-link text-decoration-none p-0"
                            >
                                Resend Code
                            </button>
                        </div>
                   </form>
                </div>
            </div>
             {/* Left: Image */}
            <div className="ok-auth-left flex-shrink-0">
                <Image src={loginBgImg} alt="Import/Export Logistics" fill style={{ objectFit: "cover" }} />
                <div className="ok-auth-overlay"></div>
            </div>

        </div>
    );
}

// Page component wrapper for VerifyEmailContent utilizing Suspense bounds
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="vh-100 d-flex align-items-center justify-content-center bg-white">
                <div className="ok-spinner" style={{ width: 40, height: 40, borderWidth: 4, borderColor: "rgba(29,59,108,.2)", borderTopColor: "#1D3B6C" }}></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
