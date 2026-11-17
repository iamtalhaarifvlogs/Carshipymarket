"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Assets
import shippingImg from "@/assets/images/shipping-bg.png";

// Page component rendering the company Terms of Service agreements and policy documentation
export default function TermsOfServicePage() {
    const [activeSection, setActiveSection] = useState("introduction");

    const sidebarItems = [
        { label: "1. Introduction", id: "introduction" },
        { label: "2. Vehicle Condition", id: "vehicle-condition" },
        { label: "3. Pricing and Fees", id: "pricing-fees" },
        { label: "4. Reservation & Escrow", id: "reservation-escrow" },
        { label: "5. Shipping & Delivery", id: "shipping-delivery" },
        { label: "6. Liability", id: "liability" }
    ];

    return (
        <div className="ok-home-page ok-terms-page" style={{ minHeight: "100vh", paddingTop: "100px" }}>
            <div className="container-xxl px-3 px-md-5 py-5">
                {/* Header Area */}
                <div className="mb-5">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-3 border"
                            style={{ width: "48px", height: "48px", background: "rgba(47, 107, 255, 0.14)", borderColor: "rgba(255, 255, 255, 0.08)" }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <h1 className="fw-bold text-white mb-0" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", letterSpacing: "-0.5px" }}>Terms of Service</h1>
                    </div>
                    <p className="fs-5 mb-1" style={{ fontSize: "1.1rem", color: "rgba(231, 238, 255, 0.82)" }}>Please read our terms carefully before using our services.</p>
                    <div className="d-inline-block px-2.5 py-1 rounded-2 small border" style={{ fontSize: "0.78rem", background: "rgba(255, 255, 255, 0.04)", borderColor: "rgba(255, 255, 255, 0.08)", color: "rgba(231, 238, 255, 0.6)" }}>
                        Last updated: March 15, 2024
                    </div>
                </div>

                <div className="row g-5">
                    {/* Sidebar */}
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="sticky-top" style={{ top: "120px", zIndex: 10 }}>
                            <div className="p-4 rounded-4" style={{ backgroundColor: "rgba(15, 18, 30, 0.92)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)" }}>
                                <p className="small fw-bold text-uppercase tracking-wider mb-3" style={{ color: "rgba(231, 238, 255, 0.5)" }}>On this page</p>
                                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                                    {sidebarItems.map((item) => {
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
                                                    {item.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-12 col-lg-9">
                        <div className="rounded-4 p-4 p-md-5" style={{ backgroundColor: "rgba(15, 18, 30, 0.92)", border: "1px solid rgba(255, 255, 255, 0.08)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)" }}>
                            <div className="d-flex flex-column gap-5">

                                {/* Section 1: Introduction */}
                                <section id="introduction" style={{ scrollMarginTop: "140px" }}>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "14px", background: "rgba(47, 107, 255, 0.2)", border: "1px solid rgba(47, 107, 255, 0.4)" }}>01</div>
                                        <h2 className="fw-bold text-white h4 mb-0">Introduction</h2>
                                    </div>
                                    <div className="p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                        <p className="mb-3" style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>
                                            Welcome to Ogamoto. These Terms of Service (&quot;Terms&quot;) govern your access to and use of Ogamoto&apos;s website, services, and high-end automotive export logistics. By using our platform, you agree to be bound by these Terms and our Privacy Policy.
                                        </p>
                                        <p className="mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>
                                            Ogamoto operates as a premier facilitator for the international sourcing and shipping of premium vehicles. Our services include but are not limited to vehicle identification, rigorous inspections, and global logistics management.
                                        </p>
                                    </div>
                                </section>

                                <hr className="opacity-5" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

                                {/* Section 2: Vehicle Condition */}
                                <section id="vehicle-condition" style={{ scrollMarginTop: "140px" }}>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "14px", background: "rgba(47, 107, 255, 0.2)", border: "1px solid rgba(47, 107, 255, 0.4)" }}>02</div>
                                        <h2 className="fw-bold text-white h4 mb-0">Vehicle Condition and History</h2>
                                    </div>
                                    <div className="p-4 rounded-4 border" style={{ background: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                                        <p className="mb-4" style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>
                                            We strive for absolute precision in our vehicle descriptions. Every listing includes a comprehensive breakdown of the vehicle&apos;s mechanical and aesthetic state.
                                        </p>
                                        <div className="d-flex flex-column gap-3">
                                            <div className="d-flex gap-3 align-items-start">
                                                <div className="p-1 rounded-circle flex-shrink-0" style={{ backgroundColor: "rgba(47, 107, 255, 0.14)" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <p className="mb-0" style={{ fontSize: "0.88rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                                    <strong className="text-white d-block mb-1">Inspection Reports:</strong> All vehicles undergo a 150-point inspection prior to listing. Clients receive high-resolution imagery and detailed condition reports.
                                                </p>
                                            </div>
                                            <div className="d-flex gap-3 align-items-start">
                                                <div className="p-1 rounded-circle flex-shrink-0" style={{ backgroundColor: "rgba(47, 107, 255, 0.14)" }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <p className="mb-0" style={{ fontSize: "0.88rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                                    <strong className="text-white d-block mb-1">As-Is Status:</strong> Unless explicitly stated otherwise in a written warranty provided at the time of purchase, all pre-owned vehicles are sold &quot;as-is&quot; regarding their final destination legal standards.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <hr className="opacity-5" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

                                {/* Section 3: Pricing and Fees */}
                                <section id="pricing-fees" style={{ scrollMarginTop: "140px" }}>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "14px", background: "rgba(47, 107, 255, 0.2)", border: "1px solid rgba(47, 107, 255, 0.4)" }}>03</div>
                                        <h2 className="fw-bold text-white h4 mb-0">Pricing and Fees</h2>
                                    </div>
                                    <div className="row g-4">
                                        <div className="col-12 col-md-6">
                                            <div className="p-4 rounded-4 h-100" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                                <h3 className="fw-bold small mb-2 text-white">Transparency Pledge</h3>
                                                <p className="mb-0" style={{ fontSize: "0.88rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                                    The listed price includes our logistics fee, but may exclude specific regional import taxes or customs duties based on the destination country.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="p-4 rounded-4 h-100" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                                <h3 className="fw-bold small mb-2 text-white">Currency & Exchange</h3>
                                                <p className="mb-0" style={{ fontSize: "0.88rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                                    All transactions are settled in USD. Ogamoto is not responsible for variations in exchange rates during the transaction window.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <hr className="opacity-5" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

                                {/* Section 4: Reservation & Escrow */}
                                <section id="reservation-escrow" style={{ scrollMarginTop: "140px" }}>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "14px", background: "rgba(47, 107, 255, 0.2)", border: "1px solid rgba(47, 107, 255, 0.4)" }}>04</div>
                                        <h2 className="fw-bold text-white h4 mb-0">Reservation and Payment Process</h2>
                                    </div>
                                    <div className="p-4 rounded-4" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                                        <div className="row align-items-center g-4">
                                            <div className="col-12 col-md-8">
                                                <p className="mb-3" style={{ fontSize: "0.88rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>
                                                    To ensure the security of high-value international transactions, Ogamoto utilizes <strong className="text-white">Escrow.com</strong> as our primary payment partner.
                                                </p>
                                                <div className="p-3 rounded-3 mb-3" style={{ background: "rgba(47, 107, 255, 0.14)", border: "1px solid rgba(47, 107, 255, 0.25)" }}>
                                                    <p className="small mb-0 fw-semibold" style={{ fontSize: "0.85rem", color: "#7dd3fc" }}>
                                                        A reservation deposit of $2,000 USD is required to remove a vehicle from the open inventory for 48 hours.
                                                    </p>
                                                </div>
                                                <p className="mb-0" style={{ fontSize: "0.88rem", lineHeight: "1.75", color: "rgba(231, 238, 255, 0.72)" }}>
                                                    The balance must be funded into the escrow account within three (3) business days of the purchase agreement signing. Shipping only commences once funds are verified in the secure escrow environment.
                                                </p>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="p-4 rounded-4 text-center border" style={{ backgroundColor: "rgba(15, 18, 30, 0.92)", borderColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)" }}>
                                                    <div className="mb-2" style={{ color: "#3b82f6" }}>
                                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" />
                                                        </svg>
                                                    </div>
                                                    <div className="small fw-bold text-uppercase mb-1 tracking-wider" style={{ fontSize: "9px", color: "rgba(231, 238, 255, 0.5)" }}>Verified Partner</div>
                                                    <div className="h5 fw-black text-white mb-1" style={{ fontSize: "1.1rem" }}>Escrow.com</div>
                                                    <div style={{ fontSize: "10px", lineHeight: "1.3", color: "rgba(231, 238, 255, 0.6)" }}>Secure Third-Party Payment Processing</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <hr className="opacity-5" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

                                {/* Section 5: Shipping & Delivery */}
                                <section id="shipping-delivery" style={{ scrollMarginTop: "140px" }}>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "14px", background: "rgba(47, 107, 255, 0.2)", border: "1px solid rgba(47, 107, 255, 0.4)" }}>05</div>
                                        <h2 className="fw-bold text-white h4 mb-0">Shipping and Delivery</h2>
                                    </div>
                                    <div className="position-relative mb-4 overflow-hidden rounded-4 shadow-sm border" style={{ height: "260px", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                                        <Image
                                            src={shippingImg}
                                            alt="Shipping container ship"
                                            fill
                                            style={{ objectFit: "cover" }}
                                            priority
                                        />
                                        <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: "linear-gradient(transparent, rgba(5,9,19,0.95))" }}>
                                            <div className="text-white fw-bold" style={{ fontSize: "1.1rem" }}>Global Maritime Shipping Support</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-4 border" style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255, 255, 255, 0.08)" }}>
                                        <p className="mb-4" style={{ fontSize: "0.88rem", lineHeight: "1.65", color: "rgba(231, 238, 255, 0.72)" }}>
                                            Shipping timelines provided by Ogamoto are estimates based on carrier schedules. We provide &quot;Ro-Ro&quot; (Roll-on/Roll-off) and specialized &quot;Containerized&quot; shipping options.
                                        </p>
                                        <div className="row text-center g-4">
                                            <div className="col-12 col-md-4 border-end" style={{ borderColor: "rgba(255, 255, 255, 0.08) !important" }}>
                                                <div className="h3 fw-bold mb-1" style={{ color: "#3b82f6" }}>21-45</div>
                                                <div className="small fw-bold tracking-wider" style={{ fontSize: "10px", color: "rgba(231, 238, 255, 0.5)" }}>AVG. DELIVERY DAYS</div>
                                            </div>
                                            <div className="col-12 col-md-4 border-end" style={{ borderColor: "rgba(255, 255, 255, 0.08) !important" }}>
                                                <div className="h3 fw-bold mb-1" style={{ color: "#3b82f6" }}>Full</div>
                                                <div className="small fw-bold tracking-wider" style={{ fontSize: "10px", color: "rgba(231, 238, 255, 0.5)" }}>TRANSIT INSURANCE</div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="h3 fw-bold mb-1" style={{ color: "#3b82f6" }}>Live</div>
                                                <div className="small fw-bold tracking-wider" style={{ fontSize: "10px", color: "rgba(231, 238, 255, 0.5)" }}>GPS TRACKING</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <hr className="opacity-5" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

                                {/* Section 6: Liability */}
                                <section id="liability" style={{ scrollMarginTop: "140px" }}>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px", fontSize: "14px", background: "rgba(47, 107, 255, 0.2)", border: "1px solid rgba(47, 107, 255, 0.4)" }}>06</div>
                                        <h2 className="fw-bold text-white h4 mb-0">Limitation of Liability</h2>
                                    </div>
                                    <div className="p-4 p-md-5 rounded-4 text-white border" style={{ background: "linear-gradient(135deg, #0B1B3B 0%, #050913 100%)", borderColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
                                        <p className="fw-medium mb-4" style={{ fontSize: "0.88rem", lineHeight: "1.8", opacity: "0.9" }}>
                                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OGAMOTO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, RESULTING FROM THE SHIPMENT, MECHANICAL PERFORMANCE, OR CUSTOMS CLEARANCE OF ANY VEHICLE.
                                        </p>
                                        <p className="small mb-0 opacity-75" style={{ fontSize: "0.78rem", lineHeight: "1.6" }}>
                                            Ogamoto acts as an intermediary for logistics. Liability for damage during transit rests with the maritime carrier under the terms of the Bill of Lading, though Ogamoto provides comprehensive transit insurance for all clients to mitigate such risks.
                                        </p>
                                    </div>
                                </section>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
