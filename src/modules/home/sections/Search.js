"use client";
import React, { useState } from "react";

// Section component rendering home page vehicle category tabs, dropdown select options, and quick search buttons
export default function Search() {
  const [activeTab, setActiveTab] = useState("Cars");

  return (
    <section className="ok-search-section">
      <div className="ok-search-card">

        {/* TAB HEADERS */}
        <div className="d-flex gap-4 border-bottom border-light mb-4 pb-3">
          {["Cars", "SUVs", "Vans", "Trucks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`ok-tab-btn${activeTab === tab ? " active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH FORM */}
        <div className="row g-3 align-items-end">

          <div className="col-12 col-md-3">
            <label className="ok-search-label d-block mb-2">Manufacturer</label>
            <select className="ok-search-select">
              <option>All Makes</option>
              <option>Toyota</option>
              <option>Lexus</option>
              <option>Honda</option>
              <option>Mercedes-Benz</option>
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="ok-search-label d-block mb-2">Model</label>
            <select className="ok-search-select">
              <option>All Models</option>
              <option>Camry</option>
              <option>RAV4</option>
              <option>Civic</option>
              <option>S-Class</option>
            </select>
          </div>

          <div className="col-12 col-md-3">
            <label className="ok-search-label d-block mb-2">Price Range</label>
            <select className="ok-search-select">
              <option>$5k - $15k</option>
              <option>$15k - $30k</option>
              <option>$30k - $50k</option>
              <option>$50k+</option>
            </select>
          </div>

          <div className="col-12 col-md-3">
            <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-bold py-3" style={{ boxShadow: "0 4px 20px rgba(59,130,246,.3)" }}>
              <span>🔍</span>
              Find My Car
            </button>
          </div>
        </div>

        {/* QUICK TAGS */}
        <div className="mt-4 d-flex flex-wrap align-items-center gap-3">
          <span className="text-secondary" style={{ fontSize: "0.75rem", fontWeight: 500 }}>Quick links:</span>
          {["Hybrid", "Electric", "Under $10k", "Recently Added"].map((tag) => (
            <button key={tag} className="ok-tag-btn">{tag}</button>
          ))}
        </div>

      </div>
    </section>
  );
}