"use client";

import Image from "next/image";
import heroBg from "@/assets/images/hero-bg.png";

// Section component rendering home landing page's main splash background, trust parameters, and CTA buttons
export default function Hero() {
  return (
    <section
      className="ok-hero"
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="ok-hero-gradient"></div>

      <div className="ok-hero-container">
        {/* HEADING & SUBHEADING */}
        <div className="ok-hero-header-frame">
          <h1>
            Global Car Export. Zero Stress.<br />
            Delivered to Your Door.
          </h1>

          <p className="ok-hero-sub">
            Verified vehicles. Transparent pricing. Worldwide shipping in 30-45 days.
          </p>
        </div>

        {/* TRUST BADGES SECTION */}
        <div className="ok-hero-trust-grid">
          <div className="ok-trust-row">
            {/* 4.9/5 Trust Rating */}
            <div className="ok-trust-item">
              <div className="ok-trust-icon-box rating">
                <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.5 4L29.52 16.2L43 18.17L33.25 27.67L35.55 41.1L23.5 34.77L11.45 41.1L13.75 27.67L4 18.17L17.48 16.2L23.5 4Z" fill="#FDC700" stroke="#FDC700" strokeWidth="1.95782" />
                </svg>
              </div>
              <div className="ok-trust-content">
                <p className="ok-trust-title">4.9/5 Trust Rating</p>
                <p className="ok-trust-subtitle">(based on 2,000+ exports)</p>
              </div>
            </div>

            <div className="ok-trust-item-divider"></div>

            {/* Exported to 40+ Countries */}
            <div className="ok-trust-item">
              <div className="ok-trust-icon-box exported">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#51A2FF" strokeWidth="1.95782" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12H22" stroke="#51A2FF" strokeWidth="1.95782" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#51A2FF" strokeWidth="1.95782" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="ok-trust-content">
                <p className="ok-trust-title">Exported to</p>
                <p className="ok-trust-title">40+ Countries</p>
              </div>
            </div>
          </div>

          {/* 100% Verified Sellers */}
          <div className="ok-trust-item">
            <div className="ok-trust-icon-box verified">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#05DF72" strokeWidth="1.95782" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10" stroke="#05DF72" strokeWidth="1.95782" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="ok-trust-title">100% Verified Sellers</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="ok-hero-btns">
          <button className="ok-btn-hero">
            Browse Inventory
            <span className="arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8L14 12L10 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button className="ok-btn-hero">
            Get Instant Shipping Quote
            <span className="arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 8L14 12L10 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
