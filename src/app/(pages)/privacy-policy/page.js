"use client";

import React, { useState } from "react";
import Link from "next/link";

// Page component rendering the company Privacy Policy and data protection terms
export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    const sections = [
        {
            id: "introduction",
            title: "Introduction",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>
                        At Ogamoto, we are committed to protecting your privacy and ensuring your personal information is handled in a secure and responsible manner. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you interact with our platform.
                    </p>
                    <p className="mb-0" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>
                        To improve your experience and effectively deliver our services, we collect various types of information that help us provide the best car exporting solutions to our global customers.
                    </p>
                </>
            )
        },
        {
            id: "collection",
            title: "Information We Collect",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>We collect the following types of personal information when you interact with our platform:</p>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                        <li className="d-flex gap-3 align-items-start">
                            <span className="fs-5" style={{ marginTop: "-2px", color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                <strong className="text-white d-block mb-1">Personal Identification Information:</strong> Name, email address, phone number, and mailing address required for vehicle shipping and customer documentation.
                            </span>
                        </li>
                        <li className="d-flex gap-3 align-items-start">
                            <span className="fs-5" style={{ marginTop: "-2px", color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                <strong className="text-white d-block mb-1">Activity Details:</strong> Details about vehicles you are interested in, shipping preferences, and search queries on our platform to provide tailored suggestions.
                            </span>
                        </li>
                        <li className="d-flex gap-3 align-items-start">
                            <span className="fs-5" style={{ marginTop: "-2px", color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                <strong className="text-white d-block mb-1">Usage Information:</strong> IP address, browser type, device information, and interaction data to enhance platform performance and user experience.
                            </span>
                        </li>
                    </ul>
                </>
            )
        },
        {
            id: "usage",
            title: "How We Use Your Information",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>Your information allows us to provide and improve our services, including:</p>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2.5">
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Respond to inquiries:</strong> To answer your queries and provide detailed information about car sales and auctions.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Provide Vehicle Details:</strong> To present information about cars and other services tailored to your specific preferences.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Process Transactions:</strong> To facilitate vehicle purchases, payment processing, and secure shipping arrangements.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Improve Services:</strong> To analyze usage patterns and refine our website&apos;s functionality for a smoother user experience.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Send Updates:</strong> To keep you informed about new features, price drops, and service announcements via email or WhatsApp.</span>
                        </li>
                    </ul>
                </>
            )
        },
        {
            id: "sharing",
            title: "Data Sharing and Disclosure",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>We do not sell your personal information to third parties. We share information only in the following circumstances:</p>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2.5">
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#EA580C" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Service Providers:</strong> With trusted partners who assist in shipping, payment processing, data analysis, and customer support operations.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#EA580C" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Legal Requirements:</strong> When required by law, court orders, or as necessary to protect our rights, safety, and property.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#EA580C" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, with notice provided to you via our platform.</span>
                        </li>
                    </ul>
                </>
            )
        },
        {
            id: "cookies",
            title: "Cookies and Tracking Technologies",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10a10 10 0 0 0 10-10C22 6.48 17.52 2 12 2z" />
                    <path d="M12 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    <path d="M6 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    <path d="M18 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                    <path d="M12 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>We use cookies to improve your browsing experience and provide tailored content. Cookies are small text files stored on your device that help us:</p>
                    <ul className="list-unstyled mb-3 d-flex flex-column gap-2">
                        <li className="d-flex gap-2 align-items-baseline">
                            <span style={{ color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}>Remember your preference and language settings.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span style={{ color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}>Analyze how users interact with our platform to improve overall functionality.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span style={{ color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}>Provide personalized advertising and content tailored to your interests.</span>
                        </li>
                    </ul>
                    <p className="mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>You can manage your cookie preference through your browser settings, though note that disabling some cookies might affect certain features of our platform.</p>
                </>
            )
        },
        {
            id: "security",
            title: "Data Security",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>We have implemented appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or disclosure:</p>
                    <ul className="list-unstyled mb-3 d-flex flex-column gap-2.5">
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Encryption:</strong> Your data is encrypted during transmission and while at rest using industry-standard protocols.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Access Controls:</strong> Restricted access to personal information by authorized personnel only on a need-to-know basis.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Regular Audits:</strong> Conducting periodic security audits and vulnerability assessments to maintain data integrity.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Secure Environments:</strong> Storing data in protected, high-security server environments.</span>
                        </li>
                    </ul>
                    <p className="mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>While we strive to protect your data, no transmission over the internet or method of electronic storage is 100% secure. We continuously upgrade our systems to meet high security standards.</p>
                </>
            )
        },
        {
            id: "third-party",
            title: "Third-Party Services",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>Our platform may integrate with third-party services to provide enhanced functionality. These may include:</p>
                    <ul className="list-unstyled mb-3 d-flex flex-column gap-2.5">
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Payment Processors:</strong> For secure transaction handling and fraud prevention.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Shipping Partners:</strong> For logistics, tracking, and delivery of vehicles across borders.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Analytics Tools:</strong> To understand platform usage and improve our services via data-driven decisions.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#60a5fa" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Communication Platforms:</strong> Including WhatsApp for real-time customer support.</span>
                        </li>
                    </ul>
                    <p className="mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>These third parties have their own privacy policies. We encourage you to review them, as we are not responsible for their practices.</p>
                </>
            )
        },
        {
            id: "rights",
            title: "Your Privacy Rights",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-3" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>You have the following rights regarding your personal information:</p>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2.5">
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Access and Portability:</strong> Request access to the personal data we hold about you.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Correction and Updates:</strong> Request to correct any inaccurate or incomplete information.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Deletion:</strong> Request the deletion of your personal information, subject to legal record-keeping requirements.</span>
                        </li>
                        <li className="d-flex gap-2 align-items-baseline">
                            <span className="fw-bold" style={{ color: "#10B981" }}>•</span>
                            <span style={{ fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}><strong className="text-white">Opt-Out:</strong> Opt-out of marketing communications at any time via unsubscribe links.</span>
                        </li>
                    </ul>
                </>
            )
        },
        {
            id: "contact",
            title: "Contact Us",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
            content: (
                <>
                    <p className="mb-4" style={{ fontSize: "0.92rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: "rgba(47, 107, 255, 0.14)" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="fw-bold small text-white">Email Address</div>
                                        <Link href="mailto:contact@okomoto.com" className="small text-decoration-none" style={{ color: "#60a5fa" }}>contact@okomoto.com</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="p-3 rounded-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: "rgba(16, 185, 129, 0.14)" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="fw-bold small text-white">WhatsApp Support</div>
                                        <Link href="https://wa.me/1234567890" target="_blank" className="small text-decoration-none fw-medium" style={{ color: "#34d399" }}>Chat with us on WhatsApp</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    ];

    return (
        <div className="ok-home-page ok-privacy-page" style={{ minHeight: "100vh", paddingTop: "100px" }}>
            <div className="container-xxl px-3 px-md-5 py-5">
                {/* Header Area */}
                <div className="mb-5">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-3 border"
                            style={{ width: "48px", height: "48px", background: "rgba(47, 107, 255, 0.14)", borderColor: "rgba(255, 255, 255, 0.08)" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h1 className="fw-bold text-white mb-0" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", letterSpacing: "-0.5px" }}>Privacy Policy</h1>
                    </div>
                    <p className="fs-5 mb-1" style={{ fontSize: "1.1rem", color: "rgba(231, 238, 255, 0.82)" }}>Your privacy and data protection are important to us.</p>
                    <div className="d-inline-block px-2.5 py-1 rounded-2 small border" style={{ fontSize: "0.78rem", background: "rgba(255, 255, 255, 0.04)", borderColor: "rgba(255, 255, 255, 0.08)", color: "rgba(231, 238, 255, 0.6)" }}>
                        Last updated: March 15, 2024
                    </div>
                </div>

                <div className="row g-5">
                    {/* Desktop Sidebar Navigation */}
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="sticky-top" style={{ top: "120px", zIndex: 10 }}>
                            <div className="p-4 rounded-4" style={{ backgroundColor: "rgba(15, 18, 30, 0.92)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)" }}>
                                <p className="small fw-bold text-uppercase tracking-wider mb-3" style={{ color: "rgba(231, 238, 255, 0.5)" }}>Sections</p>
                                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                                    {sections.map((item) => {
                                        const isActive = activeSection === item.id;
                                        return (
                                            <li key={item.id}>
                                                <Link
                                                    href={`#${item.id}`}
                                                    onClick={() => setActiveSection(item.id)}
                                                    className="d-flex align-items-center gap-2.5 px-3 py-2.5 rounded-3 text-decoration-none small transition-all"
                                                    style={{
                                                        background: isActive ? "rgba(47, 107, 255, 0.15)" : "transparent",
                                                        color: isActive ? "#60a5fa" : "rgba(231, 238, 255, 0.6)",
                                                        fontWeight: isActive ? "600" : "500",
                                                        borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="col-12 col-lg-9">
                        <div className="rounded-4 p-4 p-md-5" style={{ backgroundColor: "rgba(15, 18, 30, 0.92)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)" }}>
                            <div className="d-flex flex-column gap-5">
                                {sections.map((section, index) => (
                                    <section 
                                        key={section.id} 
                                        id={section.id}
                                        style={{ scrollMarginTop: "140px" }}
                                    >
                                        <div className="d-flex gap-4">
                                            <div
                                                className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-3 text-primary"
                                                style={{ width: "42px", height: "42px", background: "rgba(47, 107, 255, 0.14)", color: "#7dd3fc" }}
                                            >
                                                {React.cloneElement(section.icon, {
                                                    stroke: "#7dd3fc"
                                                })}
                                            </div>
                                            <div className="flex-grow-1">
                                                <h3 className="fw-bold text-white mb-3" style={{ fontSize: "1.2rem", letterSpacing: "-0.2px" }}>
                                                    {section.title}
                                                </h3>
                                                <div className="pe-lg-4">
                                                    {section.content}
                                                </div>
                                            </div>
                                        </div>
                                        {index < sections.length - 1 && (
                                            <hr className="mt-5 opacity-5" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
                                        )}
                                    </section>
                                ))}
                            </div>

                            <div className="mt-5 pt-4 border-top" style={{ fontSize: "0.82rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.5)", borderColor: "rgba(255, 255, 255, 0.1)" }}>
                                <p className="mb-0">
                                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Your continued use of our platform after any updates indicates your acceptance of the revised Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
