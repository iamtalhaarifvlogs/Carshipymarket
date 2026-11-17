"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/images/logo.svg";
import loginBgImg from "@/assets/images/loginbg.jpg";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/store/slices/auth.slice";
import { toast } from "react-toastify";
import { checkPasswordStrength, passwordRequirements } from "@/utils/password";

// Component to manage the reset password input forms and validations
function ResetPasswordContent() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Memoizes the current check on password strength from values entered
  const passwordStrength = useMemo(() => {
    return checkPasswordStrength(password);
  }, [password]);

  // Helper method rendering the password strength checker checklist indicator
  const renderPasswordStrength = () => {
    const { score, checks } = passwordStrength;
    if (!password && !isPasswordFocused) return null;

    let barColor = "#e2e8f0"; // Gray
    let textColor = "#64748b";
    let label = "Very Weak";

    if (score > 0 && score <= 2) {
      barColor = "#ef4444"; // Red
      textColor = "#ef4444";
      label = "Weak";
    } else if (score > 2 && score <= 4) {
      barColor = "#f97316"; // Orange
      textColor = "#f97316";
      label = "Medium";
    } else if (score === 5) {
      barColor = "#22c55e"; // Green
      textColor = "#22c55e";
      label = "Strong Password";
    }

    return (
      <div className="mt-2" style={{ animation: "slideDown 0.2s ease" }}>
        {/* Strength Meter Bar */}
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>
            Password Strength:{" "}
            <span style={{ color: textColor, fontWeight: 700 }}>{label}</span>
          </span>
        </div>
        <div 
          style={{ 
            height: "6px", 
            width: "100%", 
            background: "#f1f5f9", 
            borderRadius: "3px", 
            overflow: "hidden",
            marginBottom: "0.75rem"
          }}
        >
          <div 
            style={{ 
              height: "100%", 
              width: `${(score / 5) * 100}%`, 
              background: barColor, 
              transition: "width 0.3s ease, background-color 0.3s ease" 
            }}
          />
        </div>

        {/* Requirements Checklist */}
        <div className="d-flex flex-column gap-1.5 ps-1">
          {passwordRequirements.map((req) => {
            const isMet = checks[req.id];
            return (
              <div 
                key={req.id} 
                className="d-flex align-items-center gap-2"
                style={{ 
                  fontSize: "0.75rem", 
                  color: isMet ? "#15803d" : "#64748b",
                  transition: "color 0.2s ease"
                }}
              >
                {isMet ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <div 
                    style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: "#94a3b8",
                      marginLeft: "4px",
                      marginRight: "4px"
                    }}
                  />
                )}
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Submits the new credentials update request to the auth API slice
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!passwordStrength.isValid) {
      setError("Please make sure your password meets all strong password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await dispatch(
        resetPassword({
          user_id: id,
          password: password,
          confirm_password: confirmPassword,
        }),
      ).unwrap();

      toast.success(
        res?.message ||
          "Password reset successful. Please login with your new password.",
      );

      // Redirect to login after success
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error(err?.message || "facing some issue! Please try again.");

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password. Please try again.",
      );
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

          <h1 className="ok-auth-title mb-2">Reset Password</h1>

          <p className="ok-auth-sub mb-4 mb-lg-5">
            Create your new password to finish resetting your account
          </p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {/* New Password */}
            <div>
              <label className="ok-auth-label d-block mb-2">Password</label>
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
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Enter your password"
                  className="ok-auth-input ok-auth-input-pr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ok-eye-btn"
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.133 12.844A10.025 10.025 0 0 1 12 5c7 0 10 7 10 7s-3 7-10 7a9.907 9.907 0 0 1-9.867-6.156" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {renderPasswordStrength()}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="ok-auth-label d-block mb-2">
                Confirm Password
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
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="ok-auth-input ok-auth-input-pr"
                  required
                />
                
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ok-eye-btn"
                >
                  {showConfirmPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.133 12.844A10.025 10.025 0 0 1 12 5c7 0 10 7 10 7s-3 7-10 7a9.907 9.907 0 0 1-9.867-6.156" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <div className="ok-alert-error">{error}</div>}

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className="ok-btn-primary mt-3"
            >
              {loading ? (
                <>
                  <span className="ok-spinner"></span> Resetting...
                </>
              ) : (
                <>Reset</>
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

// Page component wrapper for ResetPasswordContent utilizing Suspense bounds
export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}
