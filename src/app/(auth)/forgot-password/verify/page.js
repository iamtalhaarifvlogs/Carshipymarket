"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyUser, resendOTP, clearError, forgetUser } from "@/store/slices/auth.slice";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/images/logo.svg";
import loginBgImg from "@/assets/images/loginbg.jpg";
import { toast } from "react-toastify";

// Component rendering the forgotten password OTP verification screen
function ForgotVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const email =
    searchParams.get("email") ||
    (typeof window !== "undefined" ? localStorage.getItem("resetEmail") : "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const inputRefs = useRef([]);

  // Clears active authentication errors on initial layout render
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handles input updates for single digit OTP and focuses subsequent box
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  // Navigates input focus backward if user hits backspace in an empty box
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Processes clipboard paste containing OTP digits into successive fields
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

  // Dispatches OTP verification payload and routes successful users to password reset page
  const handleSubmit = (e) => {
    if (e) e.preventDefault();


    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;
    setVerifyLoading(true);

    dispatch(verifyUser({ email, otp: fullOtp }))
      .unwrap()
      .then((res) => {
        toast.success(res?.message || "OTP verified successfully!");
        setVerifyLoading(false);
        const userId = res?.data?.user?.id;
        router.push("/reset-password?id=" + userId);
      })
      .catch((err) => {
        setVerifyLoading(false);
         toast.error(err?.message || "facing some issue! Please try again.");

      });
  };

  // Re-requests reset OTP code from endpoint for verified email
  const handleResend = () => {
    if (!email) return;
    setResendLoading(true);
    dispatch(forgetUser({ email }))
      .unwrap()
      .then((res) => {
        setResendLoading(false);
        toast.success(res?.message || "Verification code resent successfully!");
      })
      .catch((err) => {
        setResendLoading(false);
         toast.error(err?.message || "facing some issue! Please try again.");
      });
  };

  return (
    <div className="ok-auth-shell d-flex min-vh-100">
      {/* Left: Form Panel (matches the requested layout) */}
      <div className="ok-auth-right flex-grow-1 overflow-auto py-4">
        <div className="ok-auth-form-wrap my-auto">
          {/* Logo */}
          <div className="">
            <Link href="/">
              <Image src={logoImg} alt="Okomoto" height={110} width={180} />
            </Link>
          </div>

          <h1 className="ok-auth-title mb-2" style={{ fontSize: "32px" }}>
            Forgotten Password
          </h1>
          <p className="ok-auth-sub mb-4" style={{ fontSize: "15px" }}>
            We sent a verification code to <br />
            <span className="fw-bold" style={{ color: "#111827" }}>
              {email || "you@example.com"}
            </span>
          </p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            {/* Input fields */}
            <div>
              <label
                className="ok-auth-label d-block mb-3"
                style={{ fontSize: "14px", color: "#1D2939" }}
              >
                Enter Code
              </label>
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
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      maxWidth: "64px",
                      background: "#fff",
                      border: "1px solid #D0D5DD",
                      borderRadius: "12px",
                      fontSize: "24px",
                      fontWeight: "600",
                      boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                    }}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={verifyLoading || otp.some((d) => !d)}
              className="ok-btn-primary border-0"
              style={{
                background: "#1D3B6C",
                borderRadius: "12px",
                height: "56px",
                fontSize: "18px",
                fontWeight: "600",
                marginTop: "0.5rem",
                boxShadow:
                  "0px 1px 2px rgba(16, 24, 40, 0.05), 0px 4px 10px rgba(29, 59, 108, 0.25)",
              }}
            >
              {verifyLoading ? (
                <>
                  <span className="ok-spinner"></span> Verifying...
                </>
              ) : (
                "Continue"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="ok-btn-primary ok-btn-secondary mt-3"
            >
              ← Back
            </button>

            <div className="ok-auth-footer pt-2">
              <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
                Didn&apos;t receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                className="btn btn-link text-decoration-none p-0 fw-bold"
                style={{ color: "#00A96B", fontSize: "14px" }}
              >

                {resendLoading ? (
                <>
                  <span className="ok-spinner"></span> Sending...
                </>
              ) : (
                "Resend Code"
              )}
                
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Image Panel */}
      <div className="ok-auth-left flex-shrink-0">
        <Image
          src={loginBgImg}
          alt="Okomoto Background"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="ok-auth-overlay"></div>
      </div>
    </div>
  );
}

// Page component wrapper for ForgotVerifyContent utilizing Suspense bounds
export default function ForgotPasswordVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="vh-100 d-flex align-items-center justify-content-center bg-white">
          <div
            className="ok-spinner"
            style={{
              width: 40,
              height: 40,
              borderWidth: 4,
              borderColor: "rgba(29,59,108,.2)",
              borderTopColor: "#1D3B6C",
            }}
          ></div>
        </div>
      }
    >
      <ForgotVerifyContent />
    </Suspense>
  );
}
