"use client";

import React, { useState, useEffect } from "react";
import shippingBg from "@/assets/images/shipping-bg.png";
import carBg from "@/assets/images/white-car-banner.png";
import { getShippingRates, getShippingCostBreakdown } from "@/services/vehicle.service";

// Formats a numeric value into a US dollar currency string representation
const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(val)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
};

// Main shipping quote calculator page component rendering form inputs and pricing cards
export default function ShippingQuotePage() {
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  
  const [loading, setLoading] = useState(false);

  // Queries shipping rates from API and populates fallback defaults
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await getShippingRates();
        const rawList = res?.data?.data || res?.data || res?.results || [];
        const ratesList = rawList
          .map((rate, idx) => ({
            id: rate.id || rate._id || `rate-${idx}`,
            shipping_method_id: rate.method?.id || rate.method?._id || rate.id || rate._id,
            country: rate.country || "-",
            port: rate.port || "-",
            shipping_method: rate.method?.name || rate.shipping_method || "-",
            cost: Number(rate.cost ?? 0),
            estimated_days: Number(rate.estimated_days ?? 0),
            is_active: rate.is_active !== undefined ? Boolean(rate.is_active) : true,
          }))
          .filter((rate) => rate.is_active);

        setShippingRates(ratesList);
        if (ratesList.length > 0) {
          const roro = ratesList.find(r => 
            r.shipping_method?.toLowerCase().includes("ro-ro") || 
            r.shipping_method?.toLowerCase().includes("ro ro")
          );
          setSelectedRateId(roro ? roro.id : ratesList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch shipping rates:", err);
       
      }
    };
    fetchRates();
  }, []);

  // Requests estimated shipping breakdown using vehicle price and shipping method ID
  const handleCalculate = async (rateId = selectedRateId) => {
    if (!rateId) return;
    setLoading(true);
    try {
      const matchRate = shippingRates.find((r) => r.id === rateId);
      if (!matchRate) {
        setLoading(false);
        return;
      }

      if (matchRate.isFallback) {
        const inputPriceVal = Number(vehiclePrice) || 0;
        setBreakdown({
          base_vehicle_price: inputPriceVal,
          export_documentation: 0,
          shipping_cost: matchRate.cost,
          local_port_handling: 0,
          total_estimated_cost: inputPriceVal + matchRate.cost,
        });
        setLoading(false);
        return;
      }

      const params = {
        shipping_method_id: matchRate.shipping_method_id,
      };

      const inputPriceVal = Number(vehiclePrice) || 0;
      if (inputPriceVal > 0) {
        params.vehicle_price = inputPriceVal;
      }

      const res = await getShippingCostBreakdown(params);
      const data = res?.data || res;
      setBreakdown(data);
    } catch (err) {
      console.error("Failed to calculate shipping breakdown:", err);
      const matchRate = shippingRates.find((r) => r.id === rateId);
      const fallbackCost = matchRate ? matchRate.cost : 0;
      const inputPriceVal = Number(vehiclePrice) || 0;
      setBreakdown({
        base_vehicle_price: inputPriceVal,
        export_documentation: 0,
        shipping_cost: fallbackCost,
        local_port_handling: 0,
        total_estimated_cost: inputPriceVal + fallbackCost,
      });
    } finally {
      setLoading(false);
    }
  };

  
  // Triggers recalculation anytime the active shipping method selection updates
  useEffect(() => {
    if (selectedRateId) {
      handleCalculate(selectedRateId);
    }
  }, [selectedRateId]);

  // Event handler for shifting selected shipping rate choices
  const handleTabChange = (rateId) => {
    setSelectedRateId(rateId);
  };

  const selectedRate = shippingRates.find((r) => r.id === selectedRateId);
  const displayShippingMethodName = selectedRate ? selectedRate.shipping_method : "Shipping";

  const displayBasePrice = breakdown
    ? (breakdown.base_vehicle_price ?? (Number(vehiclePrice) || 0))
    : (Number(vehiclePrice) || 0);

  const displayExportDoc = breakdown
    ? (breakdown.export_documentation ?? 0)
    : 0;

  const displayShippingCost = breakdown
    ? (breakdown.shipping_cost ?? 0)
    : 0

  const displayPortHandling = breakdown
    ? (breakdown.local_port_handling ?? 0)
    : 0;

  const displayTotalCost = breakdown
    ? (breakdown.total_estimated_cost ?? 0)
    : 0;

  return (
    <div className="ok-quote-page">
      <section
        className="ok-quote-hero"
        style={{ backgroundImage: `url(${shippingBg.src})` }}
      >
        <div className="ok-quote-hero__overlay" />
        <div
          className="ok-quote-hero__car"
          aria-hidden="true"
        />

        <div className="container ok-quote-hero__inner">

          <div className="ok-quote-head">
            <h1>Get Shipping Quote</h1>
            <p>
              Estimate your total export cost from USA to Nigeria with
              precision. We handle the logistics, you focus on the collection.
            </p>
          </div>

          <div className="row g-4 align-items-stretch ok-quote-grid">
            <div className="col-12 col-lg-7">
              <div className="ok-quote-card ok-quote-card--form">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="ok-quote-label">Destination Country</label>
                    <div className="ok-quote-field-wrap" style={{ cursor: "default" }}>
                      <input 
                        className="ok-quote-field" 
                        value="Nigeria" 
                        readOnly 
                        style={{ cursor: "default", pointerEvents: "none" }}
                        aria-label="Destination country"
                      />
                      <span className="ok-quote-field__icon" aria-hidden="true" style={{ cursor: "default" }}>
                        🇳🇬
                      </span>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="ok-quote-label">Port</label>
                    <div className="ok-quote-field-wrap" style={{ cursor: "default" }}>
                      <input 
                        className="ok-quote-field" 
                        value="Lagos (Tin Can)" 
                        readOnly 
                        style={{ cursor: "default", pointerEvents: "none" }}
                        aria-label="Port"
                      />
                      <span className="ok-quote-field__icon" aria-hidden="true" style={{ cursor: "default" }}>
                        ⚓
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="ok-quote-label">Vehicle Price (USD)</label>
                    <div className="ok-quote-field-wrap">
                      <span className="ok-quote-field__prefix">$</span>
                      <input
                        className="ok-quote-field ok-quote-field--currency"
                        type="number"
                        value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(e.target.value)}
                        placeholder="Please enter the vehicle price"
                        aria-label="Vehicle price"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="ok-quote-label">Shipping Type</label>
                    <div className="ok-quote-tabs" role="group" aria-label="Shipping type">
                      {shippingRates.map((rate) => {
                        const isRoRo = rate.shipping_method?.toLowerCase().includes("ro-ro") || rate.shipping_method?.toLowerCase().includes("ro ro");
                        const isActive = selectedRateId === rate.id;
                        return (
                          <button 
                            key={rate.id}
                            type="button" 
                            className={`ok-quote-tab ${isActive ? "ok-quote-tab--active" : ""}`}
                            onClick={() => handleTabChange(rate.id)}
                          >
                            <span aria-hidden="true">{isRoRo ? "⛴" : "▣"}</span>
                            {rate.shipping_method}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-12">
                    {/* The CTA stays large and centered like the Figma screen. */}
                    <button 
                      type="button" 
                      className="ok-quote-submit"
                      onClick={() => handleCalculate(selectedRateId)}
                    >
                      Calculate Estimate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="ok-quote-card ok-quote-card--summary" style={{ position: "relative" }}>
                {loading && (
                  <div 
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(11, 17, 32, 0.7)",
                      backdropFilter: "blur(4px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      borderRadius: "16px"
                    }}
                  >
                    <div 
                      style={{
                        border: "3px solid rgba(255,255,255,0.1)",
                        borderTop: "3px solid #2f80ff",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        animation: "spin 1s linear infinite"
                      }}
                    />
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                )}
                <h2>Cost Breakdown</h2>

                <div className="ok-quote-summary">
                  <div className="ok-quote-summary__row">
                    <span>Base Vehicle Price</span>
                    <strong>{formatCurrency(displayBasePrice)}</strong>
                  </div>
                  <div className="ok-quote-summary__row">
                    <span>Export Documentation & Logistics</span>
                    <strong>{formatCurrency(displayExportDoc)}</strong>
                  </div>
                  
                  <div className="ok-quote-summary__row">
                    <span>Port Handling & Terminal Fees</span>
                    <strong>{formatCurrency(displayPortHandling)}</strong>
                  </div>
                  <div className="ok-quote-summary__row">
                    <span>Shipping ({displayShippingMethodName})</span>
                    <strong>{formatCurrency(displayShippingCost)}</strong>
                  </div>
                </div>

                <div className="ok-quote-summary__total">
                  <div className="ok-quote-summary__total-head">
                    <span>TOTAL ESTIMATED COST</span>
                    <small>Incl. Fees</small>
                  </div>
                  <div className="ok-quote-summary__amount">{formatCurrency(displayTotalCost)}</div>
                </div>

                <div className="ok-quote-summary__disclaimer">
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.4)",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "11px",
                    fontWeight: "bold",
                    marginRight: "8px",
                    fontStyle: "normal",
                    flexShrink: 0
                  }}>i</span>
                  <p>
                    Disclaimer: This is a preliminary estimate. Actual shipping
                    rates may fluctuate based on carrier fuel surcharges and
                    seasonal adjustments at the time of booking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noreferrer"
            className="ok-quote-whatsapp"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.62 0 .4 5.18.4 11.57c0 2.02.53 4 1.54 5.73L0 24l6.94-1.8a11.7 11.7 0 0 0 5.1 1.16h.01c6.46 0 11.68-5.18 11.68-11.57 0-3.1-1.23-6.02-3.21-8.31Zm-8.44 18.9c-1.6 0-3.16-.42-4.5-1.22l-.32-.19-4.12 1.07 1.1-4.02-.21-.34a9.45 9.45 0 0 1-1.46-5.05c0-5.25 4.3-9.52 9.59-9.52 2.56 0 4.96.99 6.77 2.79a9.47 9.47 0 0 1 2.81 6.73c0 5.25-4.31 9.52-9.66 9.52Zm5.56-7.14c-.3-.15-1.78-.87-2.06-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.28.3-1.08 1.04-1.08 2.53s1.11 2.93 1.26 3.13c.15.2 2.14 3.25 5.18 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.34Z" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
