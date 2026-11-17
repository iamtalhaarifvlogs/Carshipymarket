"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import logoImg from "@/assets/images/logonav.svg";

import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  updateUserProfile,
  deleteUserProfile,
} from "@/store/slices/auth.slice";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import NotificationDropdown from "./NotificationDropdown";

// Component rendering the top navigation bar with user profile settings and routes
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [updateWhatsappCode, setUpdateWhatsappCode] = useState("91");
  const [updateWhatsappNumber, setUpdateWhatsappNumber] = useState("");
  const [whatsappPhoneVal, setWhatsappPhoneVal] = useState("+91");
  const [portalElement, setPortalElement] = useState(null);
  const dropdownRef = React.useRef(null);
  const unreadNotificationCount = user?.unreadNotificationCount || 0;

  // Set mounted state and read auth token from local storage on render/token change
  useEffect(() => {
    setMounted(true);
    setHasToken(!!localStorage.getItem("token"));
    setPortalElement(document.body);
  }, [token]);

  // Populate state with current user profile information
  useEffect(() => {
    if (user) {
      setUpdateName(user.full_name || user.name || "");

      let wCode = user.whatsapp_phone_code || user.whatsapp_code || "91";
      if (wCode.startsWith("+")) wCode = wCode.slice(1);
      setUpdateWhatsappCode(wCode);

      const wNumber = user.whatsapp_phone_number || user.whatsapp_number || "";
      setUpdateWhatsappNumber(wNumber);
      setWhatsappPhoneVal(`+${wCode}${wNumber}`);
    }
  }, [user]);

  // Handle click outside event to close the user profile dropdown menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logs out user by dispatching the Redux action and redirecting to login page
  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  // Submits the updated profile details to the API
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!updateName.trim()) return;

    const formattedWhatsappCode = updateWhatsappCode.startsWith("+")
      ? updateWhatsappCode
      : `+${updateWhatsappCode}`;

    try {
      await dispatch(
        updateUserProfile({
          full_name: updateName,
          whatsapp_phone_number: updateWhatsappNumber,
          whatsapp_phone_code: formattedWhatsappCode,
        }),
      ).unwrap();
      setShowUpdateModal(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // Deletes the user account permanently via the Redux thunk
  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteUserProfile()).unwrap();
      setShowDeleteModal(false);
      router.push("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  return (
    <nav className="ok-navbar d-flex align-items-center px-4 ok-navbar--home">
      <div className="container-dashboard d-flex align-items-center justify-content-between">
        {/* LOGO */}
        <div className="d-flex align-items-center">
          <Link href="/">
            <Image
              src={logoImg}
              alt="Okomoto Logo"
              height={42}
              style={{ width: "auto", cursor: "pointer" }}
            />
          </Link>
        </div>

        {/* NAVIGATION & ACTIONS */}
        <div className="d-flex align-items-center gap-4">
          {!mounted ? null : user || token || hasToken ? (
            /* Logged In Dashboard Header (Desktop & Mobile) */
            <div className="d-flex align-items-center gap-3 ok-logged-in-nav text-white">
              <Link
                href="/dashboard"
                className="ok-nav-btn text-white text-decoration-none px-3.5 py-2 rounded-pill d-none d-md-inline-block"
                style={{
                  background:
                    pathname === "/dashboard" || pathname === "/better-deal"
                      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                      : "transparent",
                  boxShadow:
                    pathname === "/dashboard" || pathname === "/better-deal"
                      ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                      : "none",
                  fontSize: "0.85rem",
                  fontWeight:
                    pathname === "/dashboard" || pathname === "/better-deal"
                      ? 700
                      : 500,
                  border: "none",
                  opacity:
                    pathname === "/dashboard" || pathname === "/better-deal"
                      ? 1
                      : 0.75,
                  transition: "all 0.25s ease",
                }}
              >
                Browse Cars
              </Link>

              <Link
                href="/saved"
                className="ok-nav-btn text-white text-decoration-none px-3.5 py-2 rounded-pill d-none d-md-inline-flex align-items-center gap-1.5"
                style={{
                  background:
                    pathname === "/saved"
                      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                      : "transparent",
                  boxShadow:
                    pathname === "/saved"
                      ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                      : "none",
                  fontSize: "0.85rem",
                  fontWeight: pathname === "/saved" ? 700 : 500,
                  border: "none",
                  opacity: pathname === "/saved" ? 1 : 0.75,
                  transition: "all 0.25s ease",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>Saved</span>
              </Link>

              <Link
                href="/reservations"
                className="ok-nav-btn text-white text-decoration-none px-3.5 py-2 rounded-pill d-none d-md-inline-flex align-items-center gap-1.5"
                style={{
                  background:
                    pathname === "/reservations"
                      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                      : "transparent",
                  boxShadow:
                    pathname === "/reservations"
                      ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                      : "none",
                  fontSize: "0.85rem",
                  fontWeight: pathname === "/reservations" ? 700 : 500,
                  border: "none",
                  opacity: pathname === "/reservations" ? 1 : 0.75,
                  transition: "all 0.25s ease",
                }}
              >
                {" "}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />{" "}
                </svg>
                <span>Reservations</span>{" "}
              </Link>

               <NotificationDropdown unreadNotificationCount={unreadNotificationCount} />

              <div className="position-relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="d-flex align-items-center gap-2 text-white bg-transparent border-0 p-0"
                  style={{ outline: "none" }}
                >
                  <span
                    className="d-none d-md-inline"
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      opacity: 0.9,
                    }}
                  >
                    {user?.full_name ||
                      user?.name ||
                      user?.email?.split("@")[0] ||
                      "Ogamotouser"}
                  </span>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "0.85rem",
                      background: "#1A4B9F",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {user?.full_name
                      ? user.full_name.slice(0, 2).toUpperCase()
                      : user?.name
                        ? user.name.slice(0, 2).toUpperCase()
                        : user?.email
                          ? user.email.slice(0, 2).toUpperCase()
                          : "OM"}
                  </div>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    style={{
                      transition: "transform 0.2s ease",
                      transform: dropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="ok-dropdown-menu p-2 shadow-lg">
                    <div className="px-3 py-2 border-bottom border-secondary mb-1">
                      <div
                        className="fw-bold text-white text-truncate"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {user?.full_name || user?.name || "Ogamoto User"}
                      </div>
                      <div
                        className="text-truncate text-white"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {user?.email || "No email"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowUpdateModal(true);
                      }}
                      className="ok-dropdown-item btn w-100 text-start d-flex align-items-center gap-2 border-0 bg-transparent text-white px-3 py-2"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Update Profile
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowDeleteModal(true);
                      }}
                      className="ok-dropdown-item text-danger btn w-100 text-start d-flex align-items-center gap-2 border-0 bg-transparent px-3 py-2"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Delete Account
                    </button>

                    <hr
                      className="my-1 border-secondary"
                      style={{ opacity: 0.2 }}
                    />

                    <button
                      onClick={handleLogout}
                      className="ok-dropdown-item btn w-100 text-start d-flex align-items-center gap-2 border-0 bg-transparent text-white px-3 py-2"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Logged Out Header (Default Links) */
            <>
              <div className="d-none d-lg-flex gap-4 align-items-center">
                <Link
                  href="/"
                  className={`nav-link ${
                    pathname === "/"
                      ? "nav-link--pill nav-link--pill-active"
                      : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/how-it-works"
                  className={`nav-link ${
                    pathname === "/how-it-works"
                      ? "nav-link--pill nav-link--pill-active"
                      : ""
                  }`}
                >
                  How it Work
                </Link>
                <Link
                  href="/contact-us"
                  className={`nav-link ${
                    pathname === "/contact-us"
                      ? "nav-link--pill nav-link--pill-active"
                      : ""
                  }`}
                >
                  Contact
                </Link>
              </div>

              <div className="d-none d-sm-flex align-items-center gap-3">
                <Link
                  href="/login"
                  className="ok-nav-login ok-nav-login--light"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="ok-nav-login ok-nav-login--light"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`d-lg-none btn p-2 border-0${isHome ? " text-white" : " text-dark"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="ok-mobile-menu d-lg-none">
          {mounted && (user || token || hasToken) ? (
            /* Logged In Mobile Menu */
            <>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Browse Cars
              </Link>
              <Link href="/saved" onClick={() => setMobileMenuOpen(false)}>
                Saved
              </Link>

              <hr />
              <button onClick={handleLogout}>
                <span>🚪</span> Logout
              </button>
            </>
          ) : (
            /* Logged Out Mobile Menu */
            <>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Work
              </Link>
              <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <hr />
              <div className="d-flex flex-column gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <span>👤</span> Login
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <span>➕</span> Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
      {/* Update Profile Modal */}
      {showUpdateModal &&
        portalElement &&
        createPortal(
          <div className="ok-modal-overlay">
            <div className="ok-modal-container">
              <h3
                className="mb-3"
                style={{ fontSize: "1.2rem", fontWeight: 600 }}
              >
                Update Profile
              </h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label
                    className="form-label text-white-50"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control ok-input"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="form-label text-white-50"
                    style={{ fontSize: "0.8rem" }}
                  >
                    WhatsApp Number
                  </label>
                  <div className="ok-phone-wrapper--dark">
                    <PhoneInput
                      disableFormatting
                      defaultCountry="in"
                      value={whatsappPhoneVal}
                      onChange={(value, { country }) => {
                        setWhatsappPhoneVal(value);
                        const dialCode = country?.dialCode || "";
                        let number = value;
                        const cleanValue = value.startsWith("+")
                          ? value.slice(1)
                          : value;
                        if (cleanValue.startsWith(dialCode)) {
                          number = cleanValue.slice(dialCode.length);
                        }
                        setUpdateWhatsappCode(dialCode);
                        setUpdateWhatsappNumber(number);
                      }}
                      inputClassName="ok-input w-100"
                      countrySelectorStyleProps={{
                        buttonClassName: "ok-phone-flag-btn",
                      }}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="btn ok-btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn ok-btn-primary d-flex align-items-center gap-2"
                    disabled={loading || !updateName.trim()}
                  >
                    {loading && (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>,
          portalElement,
        )}

      {/* Delete Account Modal */}
      {showDeleteModal &&
        portalElement &&
        createPortal(
          <div className="ok-modal-overlay">
            <div className="ok-modal-container border border-danger">
              <h3
                className="mb-3 text-danger"
                style={{ fontSize: "1.2rem", fontWeight: 600 }}
              >
                Delete Account
              </h3>
              <p
                className="text-white-50 mb-4"
                style={{ fontSize: "0.88rem", lineHeight: 1.5 }}
              >
                Are you absolutely sure you want to delete your account? This
                action is permanent and cannot be undone. All your saved
                searches and lists will be permanently lost.
              </p>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="btn ok-btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn ok-btn-danger d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading && (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>,
          portalElement,
        )}
    </nav>
  );
}
