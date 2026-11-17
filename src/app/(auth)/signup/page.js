"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, googleLoginUser } from "@/store/slices/auth.slice";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/images/logo.svg";
import loginBgImg from "@/assets/images/loginbg.jpg";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { checkPasswordStrength, passwordRequirements } from "@/utils/password";

// Page component rendering the new user account sign-up form and phone selection dropdowns
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_code: "91",
    phone_number: "",
    password: "",
    whatsapp_code: "91",
    whatsapp_number: "",
  });
  const [isWhatsappSame, setIsWhatsappSame] = useState(true);
  const [phoneVal, setPhoneVal] = useState("+91");
  const [whatsappPhoneVal, setWhatsappPhoneVal] = useState("+91");

  // Callback to sync country flag select and raw inputs for primary mobile number
  const handlePhoneChange = useCallback((value, { country }) => {
    setPhoneVal(value);
    const dialCode = country?.dialCode || "";

    let number = value;
    const cleanValue = value.startsWith('+') ? value.slice(1) : value;
    if (cleanValue.startsWith(dialCode)) {
      number = cleanValue.slice(dialCode.length);
    }

    setFormData((prev) => ({
      ...prev,
      phone_code: dialCode,
      phone_number: number,
    }));
  }, []);

  const primaryPhoneInput = useMemo(() => {
    return (
      <PhoneInput
        disableFormatting
        defaultCountry="in"
        value={phoneVal}
        onChange={handlePhoneChange}
        inputClassName="ok-auth-input"
        countrySelectorStyleProps={{
          buttonClassName: "ok-phone-flag-btn",
        }}
      />
    );
  }, [phoneVal, handlePhoneChange]);

  // Callback to sync country flag select and raw inputs for WhatsApp mobile number
  const handleWhatsappChange = useCallback((value, { country }) => {
    setWhatsappPhoneVal(value);
    const dialCode = country?.dialCode || "";

    let number = value;
    const cleanValue = value.startsWith('+') ? value.slice(1) : value;
    if (cleanValue.startsWith(dialCode)) {
      number = cleanValue.slice(dialCode.length);
    }

    setFormData((prev) => ({
      ...prev,
      whatsapp_code: dialCode,
      whatsapp_number: number,
    }));
  }, []);

  const whatsappPhoneInput = useMemo(() => {
    return (
      <PhoneInput
        disableFormatting
        defaultCountry="in"
        value={whatsappPhoneVal}
        onChange={handleWhatsappChange}
        inputClassName="ok-auth-input"
        countrySelectorStyleProps={{
          buttonClassName: "ok-phone-flag-btn",
        }}
      />
    );
  }, [whatsappPhoneVal, handleWhatsappChange]);

  const [shouldRender, setShouldRender] = useState(false);

  // Computes validation status and score representing strong password strength
  const passwordStrength = useMemo(() => {
    return checkPasswordStrength(formData.password);
  }, [formData.password]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, token } = useSelector((state) => state.auth);

  // Google Sign-In hook processing authentication redirection
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(googleLoginUser({ token: tokenResponse.access_token }))
        .unwrap()
        .then(() => router.push("/dashboard"))
        .catch((err) => console.error("Google login failed:", err));
    },
    onError: (error) => console.error("Google Sign-In failed:", error),
  });

  // Redirects authenticated users directly to dashboard
  useEffect(() => {
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

  // Updates form state for typed input elements
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (localError) setLocalError(null);
  };

  // Validates form state and dispatches signup payload to API store
  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!passwordStrength.isValid) {
      setLocalError("Please make sure your password meets all strong password requirements.");
      return;
    }

    const finalWhatsappNumber = isWhatsappSame ? formData.phone_number : formData.whatsapp_number;
    const finalWhatsappCode = (isWhatsappSame ? formData.phone_code : formData.whatsapp_code) || "";
    const formattedWhatsappCode = finalWhatsappCode.startsWith("+") ? finalWhatsappCode : `+${finalWhatsappCode || "91"}`;
    const formattedPhoneCode = formData.phone_code.startsWith("+") ? formData.phone_code : `+${formData.phone_code || "91"}`;

    dispatch(
      signupUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        phone_code: formattedPhoneCode,
        whatsapp_phone_number: finalWhatsappNumber,
        whatsapp_phone_code: formattedWhatsappCode,
        is_whatsapp_number_same_as_phone_number: isWhatsappSame,
      }),
    )
      .unwrap()
      .then(() => {
        localStorage.setItem("userEmail", formData.email);
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`,
        );
      })
      .catch((err) => console.error("Signup failed:", err));
  };

  // Helper method rendering password strength checks container
  const renderPasswordStrength = () => {
    const { score, checks } = passwordStrength;
    if (!formData.password && !isPasswordFocused) return null;

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

  return (
    <div className="ok-auth-shell d-flex min-vh-100">
      

      {/* Right: Signup Form */}
      <div className="ok-auth-right flex-grow-1 overflow-auto py-4">
        <div className="ok-auth-form-wrap my-auto">
          {/* Logo */}
          <div className="mb-4 mb-lg-5">
            <Link href="/">
              <Image
                src={logoImg}
                alt="Okomoto"
                height={55}
                style={{ width: "auto", cursor: "pointer" }}
              />
            </Link>
          </div>

          <h1 className="ok-auth-title mb-2">Create your account</h1>
          <p className="ok-auth-sub mb-4 mb-lg-5">
            Get started with your free Okomoto exporter account.
          </p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {/* Full Name */}
            <div>
              <label className="ok-auth-label d-block mb-2">Full Name</label>
              <div className="ok-input-wrapper">
                <span className="ok-input-icon">
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="ok-auth-input"
                  required
                />
              </div>
            </div>

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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="ok-auth-input"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="ok-auth-label d-block mb-2">Primary Mobile Number</label>

              <div className="ok-phone-wrapper">
                {primaryPhoneInput}
              </div>
            </div>

            {/* Checkbox for WhatsApp same */}
            <div className="d-flex align-items-center gap-2 py-1">
              <input
                type="checkbox"
                id="isWhatsappSame"
                checked={isWhatsappSame}
                onChange={(e) => setIsWhatsappSame(e.target.checked)}
                className="form-check-input"
                style={{ width: 18, height: 18, accentColor: "#1A3A6E", cursor: "pointer" }}
              />
              <label htmlFor="isWhatsappSame" style={{ cursor: "pointer", fontSize: "0.875rem", color: "#000000" }} className="mb-0">
                This is also my WhatsApp number
              </label>
            </div>

            {/* WhatsApp Number */}
            {!isWhatsappSame && (
              <div>
                <label className="ok-auth-label d-block mb-2">WhatsApp Number</label>
                <div className="ok-phone-wrapper">
                  {whatsappPhoneInput}
                </div>
              </div>
            )}

            {/* Password */}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Create a strong password"
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

            {/* Terms */}
            <div className="d-flex align-items-start gap-2 py-1">
              <input 
                type="checkbox" 
                id="agreeTerms"
                className="form-check-input mt-1" 
                style={{ width: 18, height: 18, accentColor: "#1A3A6E", flexShrink: 0 }} 
                required 
              />
              <label htmlFor="agreeTerms" style={{ cursor: "pointer", fontSize: "0.875rem", color: "#000000" }} className="mb-0">
                I agree to the{" "}
                <Link href="/terms-of-service" className="ok-auth-forgot text-decoration-none">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="ok-auth-forgot text-decoration-none">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error */}
            {(localError || error) && (
              <div className="ok-alert-error">
                {localError || error?.message || "Signup failed. Please try again."}
              </div>
            )}

            {/* Create Account Button */}
            <button type="submit" disabled={loading} className="ok-btn-primary">
              {loading ? (
                <>
                  <span className="ok-spinner"></span> Creating account...
                </>
              ) : (
                <>Create Account</>
              )}
            </button>



            {/* Footer link */}
            <div className="ok-auth-footer pt-3">
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="ok-auth-forgot text-decoration-none"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Left: Image */}
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
