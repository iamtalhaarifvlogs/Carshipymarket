import React from "react";
import Image from "next/image";
import whychooseBg from "@/assets/images/whychoose.png";
import exportIcon from "@/assets/images/exportevent.svg";
import priceIcon from "@/assets/images/transparentprice.svg";
import secureIcon from "@/assets/images/savesecure.svg";
import logoImg from "@/assets/images/logo.svg";

// Component rendering company selling points highlights and customer quote/invoice inquiry form
const TrustAndInquiry = () => {
    return (
        <div
            className="py-5"
            style={{
                backgroundImage: `url(${whychooseBg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="container py-4">
                {/* Features Part */}
                <div className="text-center mb-5 pt-4">
                    <h2 className="fs-48 fw-500" style={{ color: "#0B1B3B" }}>
                        Why Choose <span style={{ color: "rgb(31, 69, 145)", fontStyle: 'italic' }}>Oko</span><span style={{ color: "#EEAD3E", fontStyle: 'italic' }}>moto</span>?
                    </h2>
                </div>

                <div className="ok-feature-block d-flex flex-column flex-md-row mb-5" style={{ background: 'transparent', boxShadow: 'none', border: 'none', overflow: 'visible' }}>
                    {[
                        { icon: exportIcon, title: "Export-Ready Inventory", sub: "Certified and inspected vehicles ready for exploration" },
                        { icon: priceIcon, title: "Transparent Pricing", sub: "Clear breakdown of costs with no hidden fees" },
                        { icon: secureIcon, title: "Safe & Secure", sub: "Escrow payment protection for a safe and secure purchase" },
                    ].map((item, i) => (
                        <div key={i} className={`d-flex flex-grow-1 ${i === 0 ? 'rounded-start' : i === 2 ? 'rounded-end' : ''}`} style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.5)', overflow: 'hidden' }}>
                            <div className="ok-feature-item w-100 h-100 d-flex flex-column">
                                <div className="ok-feature-icon-box" style={{ background: 'transparent', borderBottom: '1px solid rgba(232, 236, 244, 0.2)' }}>
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={140}
                                        height={100}
                                        style={{ objectFit: "contain" }}
                                    />
                                </div>
                                <div className="ok-feature-text-box" style={{ background: '#FFFFFF', flexGrow: 1 }}>
                                    <h4 className="fw-black mb-2" style={{ fontSize: "1.25rem", color: "#0B1B3B" }}>{item.title}</h4>
                                    <p className="fw-medium mb-0" style={{ fontSize: "0.9375rem", color: "#6b7280", lineHeight: 1.5 }}>{item.sub}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inquiry Form Part */}
                <div className="row g-4 align-items-center mt-5 mb-4">
                    <div className="col-12 col-lg-7 text-center text-lg-start">
                        <div className="pe-lg-5">
                            <Image
                                src={logoImg}
                                alt="Okomoto Logo"
                                width={500}
                                height={200}
                                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div className="ok-invoice-card ms-auto" style={{ maxWidth: 460 }}>
                            <h3 className="fw-bold mb-4" style={{ fontSize: "1.75rem", color: "#0B1B3B" }}>Get an Official Invoice!</h3>
                            <form className="d-flex flex-column gap-3">
                                <input className="ok-invoice-input" placeholder="Your Name" />
                                <input className="ok-invoice-input" placeholder="Phone Number" />
                                <div className="position-relative">
                                    <select
                                        className="ok-invoice-input"
                                        defaultValue="Email"
                                        style={{ appearance: "none", cursor: "pointer", color: "#9ca3af" }}
                                    >
                                        <option value="Email" disabled>Email</option>
                                        <option value="Direct">Direct Email</option>
                                    </select>
                                    <span className="position-absolute" style={{ right: "1.25rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary fw-bold w-100 mt-2 py-3"
                                    style={{ background: "#315AAC", borderRadius: 10, fontSize: "1.125rem", border: "none", boxShadow: "0 10px 20px rgba(49, 90, 172, 0.15)" }}
                                >
                                    Request Final Quote
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustAndInquiry;
