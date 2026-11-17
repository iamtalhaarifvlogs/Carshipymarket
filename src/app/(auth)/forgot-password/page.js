"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/images/logo.svg";
import loginBgImg from "@/assets/images/loginbg.jpg";
import { forgetUser } from "@/store/slices/auth.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Page component for password recovery requesting email reset OTP code
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Triggers API slice to send OTP code to the requested email address
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!email) return;

    setLoading(true);
    setError(null);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("resetEmail", email);
      }
      const res = await dispatch(forgetUser({ email })).unwrap();
      setTimeout(() => {
        router.push(
          "/forgot-password/verify?email=" + encodeURIComponent(email),
        );
      }, 500);

      toast.success(res?.message || "Reset code sent successfully!");
    } catch (err) {
       toast.error(err?.message || "facing some issue! Please try again.");

      setError(err?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ok-auth-shell d-flex min-vh-100">
      {/* Form Panel (on the left in DOM) */}
      <div className="ok-auth-right flex-grow-1 overflow-y-auto py-4">
        <div className="ok-auth-form-wrap my-auto">
          {/* Logo */}
          <div className="">
            <Link href="/">
              <Image src={logoImg} alt="Okomoto" height={110} width={180} />
            </Link>
          </div>

          <h1 className="ok-auth-title mb-2">Forgotten Password</h1>

          <p className="ok-auth-sub mb-4 mb-lg-5">
            Enter your email to reset the password
          </p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {/* Email */}
            <div>
              <label className="ok-auth-label d-block mb-2">
                Email Address
              </label>
              <div className="ok-input-wrapper">
                <span className="ok-input-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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

            {/* Error */}
            {error && <div className="ok-alert-error">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="ok-btn-primary mt-3"
            >
              {loading ? (
                <>
                  <span className="ok-spinner"></span> Sending...
                </>
              ) : (
                <>Send Code</>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="ok-btn-primary ok-btn-secondary mt-3"
            >
              ← Back
            </button>

            {/* Footer link */}
            <div className="ok-auth-footer pt-3">
              <span>Remembered your password? </span>
              <Link
                href="/login"
                className="ok-auth-forgot text-decoration-none"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Image Panel (on the right in DOM) */}
      <div className="ok-auth-left flex-shrink-0">
        <Image
          src={loginBgImg}
          alt="Import/Export Logistics"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="ok-auth-overlay"></div>
      </div>
    </div>
  );
}
