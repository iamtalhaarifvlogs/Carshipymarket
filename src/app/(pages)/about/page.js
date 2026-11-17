"use client";

import React, { useState } from "react";
import Link from "next/link";

// Assets
import heroBg from "@/assets/images/hero-bg.png";

// Page component rendering the company's background, vision stats, and value propositions
export default function AboutUsPage() {
    // Hover states for stats
    const [hoveredStat, setHoveredStat] = useState(null);
    // Hover states for difference cards
    const [hoveredCard, setHoveredCard] = useState(null);

    const diffCards = [
        {
            id: 0,
            title: "Verified Inventory",
            description: "Every vehicle undergoes a 250-point inspection before it ever reaches the dock. We guarantee condition and history transparency.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
                    <path d="M9 12L11 14L15 10" />
                </svg>
            )
        },
        {
            id: 1,
            title: "Secure Escrow Payments",
            description: "Our proprietary payment gateway ensures your funds are protected until the vehicle is cleared for departure. Safe, secure, and instant.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V12M12 12L7 15M12 12L17 15M21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7Z" />
                </svg>
            )
        },
        {
            id: 2,
            title: "End-to-End Logistics",
            description: "From the dealership lot in the US or Europe to your doorstep in Nigeria. We handle customs, duties, and final mile deliveries.",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 18H19M21 14H3V6H21V14ZM21 14L17 18M17 18H7M7 18L3 14" />
                </svg>
            )
        }
    ];

    return (
        <div className="ok-home-page ok-about-page" style={{ minHeight: "100vh" }}>

            {/* HERO SECTION */}
            <section className="ok-home-hero ok-hiw-hero">
                <div
                    className="ok-home-hero__bg"
                    style={{ backgroundImage: `url(${heroBg.src})` }}
                />
                <div className="ok-home-hero__scrim ok-hiw-hero__scrim" />

                <div className="container-xxl ok-home-hero__inner ok-hiw-hero__inner">
                    <div className="row align-items-center g-4 g-lg-5">
                        <div className="col-12 col-lg-7">
                            <div className="ok-home-hero__copy ok-hiw-hero__copy">
                                <div className="ok-home-kicker">GLOBAL AUTOMOTIVE LOGISTICS</div>
                                <h1>
                                    <span className="ok-home-hero__line">Redefining</span>
                                    <span className="ok-home-hero__line1">Automotive Export</span>
                                </h1>
                                <p className="ok-home-subcopy">
                                    Precision-engineered supply chains connecting premium global inventory directly to Nigeria and West Africa&apos;s most discerning drivers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISION SECTION */}
            <section className="ok-hiw-section py-5" style={{ background: "#050913", padding: "100px 0" }}>
                <div className="container-xxl px-3 px-md-5">
                    <div className="row g-5 align-items-center">
                        <div className="col-12 col-lg-7">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <span className="ok-home-section__eyebrow m-0">OUR VISION</span>
                            </div>
                            <h2 className="fw-bold text-white mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", lineHeight: "1.25" }}>
                                Bridging Worlds with Trust and Quality
                            </h2>
                            <div className="fs-18 mb-4" style={{ lineHeight: "1.8", color: "rgba(231, 238, 255, 0.75)" }}>
                                <p className="mb-3">
                                    At <span className="text-primary fw-semibold" style={{ color: "#60a5fa !important" }}>Ogamoto</span>, we believe that geography should not be a barrier to automotive excellence. Our mission is to transform the complex landscape of international car exporting into a seamless, transparent, and high-speed experience.
                                </p>
                                <p className="mb-0">
                                    Specializing in the West African corridor, specifically Nigeria, we leverage fifteen years of logistical expertise to ensure every vehicle delivered meets rigorous global standards. From Lagos to Abuja, we are the trusted partner for premium mobility.
                                </p>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="d-flex flex-column gap-4">
                                <div 
                                    className="p-4 rounded-4" 
                                    style={{ 
                                        backgroundColor: "rgba(15, 18, 30, 0.92)", 
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        transform: hoveredStat === "exported" ? "translateY(-5px)" : "translateY(0)"
                                    }}
                                    onMouseEnter={() => setHoveredStat("exported")}
                                    onMouseLeave={() => setHoveredStat(null)}
                                >
                                    <h3 className="display-4 fw-black mb-1" style={{ color: "#3b82f6", letterSpacing: "-1px" }}>5,000+</h3>
                                    <p className="fw-semibold mb-0" style={{ fontSize: "0.95rem", color: "rgba(231, 238, 255, 0.7)" }}>Vehicles Exported Globally</p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-12 col-md-6">
                                        <div 
                                            className="p-4 rounded-4 h-100" 
                                            style={{ 
                                                backgroundColor: "rgba(15, 18, 30, 0.92)", 
                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                transform: hoveredStat === "experience" ? "translateY(-5px)" : "translateY(0)"
                                            }}
                                            onMouseEnter={() => setHoveredStat("experience")}
                                            onMouseLeave={() => setHoveredStat(null)}
                                        >
                                            <h3 className="h1 fw-black mb-1" style={{ color: "#3b82f6" }}>15+</h3>
                                            <p className="small fw-semibold mb-0 lh-base" style={{ color: "rgba(231, 238, 255, 0.7)" }}>
                                                Years of Logistical Mastery
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div 
                                            className="p-4 rounded-4 h-100" 
                                            style={{ 
                                                backgroundColor: "rgba(15, 18, 30, 0.92)", 
                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                transform: hoveredStat === "support" ? "translateY(-5px)" : "translateY(0)"
                                            }}
                                            onMouseEnter={() => setHoveredStat("support")}
                                            onMouseLeave={() => setHoveredStat(null)}
                                        >
                                            <h3 className="h1 fw-black mb-1" style={{ color: "#EA580C" }}>24/7</h3>
                                            <p className="small fw-semibold mb-0 lh-base" style={{ color: "rgba(231, 238, 255, 0.7)" }}>
                                                Personalized Support
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE OKO DIFFERENCE SECTION */}
            <section className="py-5" style={{ background: "rgba(15, 18, 30, 0.4)", padding: "100px 0" }}>
                <div className="container-xxl px-3 px-md-5">
                    <div className="text-center mb-5 max-w-2xl mx-auto" style={{ maxWidth: "600px" }}>
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                            <span className="ok-home-section__eyebrow m-0">OUR VALUE</span>
                        </div>
                        <h2 className="fw-bold mb-3 text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)" }}>
                            The Ogamoto Difference
                        </h2>
                        <p className="text-white-50" style={{ fontSize: "0.95rem", color: "rgba(231, 238, 255, 0.72) !important" }}>
                            We don&apos;t just ship cars; we curate an ecosystem of trust, speed, and precision.
                        </p>
                    </div>

                    <div className="row g-4">
                        {diffCards.map((card) => (
                            <div key={card.id} className="col-12 col-md-4">
                                <div 
                                    className="p-4 p-lg-5 h-100 rounded-4" 
                                    style={{ 
                                        background: "rgba(15, 18, 30, 0.92)", 
                                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)", 
                                        border: hoveredCard === card.id ? "1px solid rgba(47, 107, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        transform: hoveredCard === card.id ? "translateY(-6px)" : "translateY(0)"
                                    }}
                                    onMouseEnter={() => setHoveredCard(card.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div 
                                        className="mb-4 d-inline-flex align-items-center justify-content-center" 
                                        style={{ 
                                            width: 48, 
                                            height: 48, 
                                            borderRadius: 999, 
                                            background: "rgba(47, 107, 255, 0.14)",
                                            color: "#7dd3fc"
                                        }}
                                    >
                                        {card.icon}
                                    </div>
                                    <h4 className="fw-bold mb-3 text-white" style={{ fontSize: "1.15rem" }}>{card.title}</h4>
                                    <p className="mb-0" style={{ lineHeight: "1.65", fontSize: "0.9rem", color: "rgba(231, 238, 255, 0.72)" }}>
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
