"use client";

import React, { useState } from "react";
import Image from "next/image";

// Dialog component rendering detailed vehicle thumbnail galleries, price, and specs within modal overlays
export default function VehicleModal({ isOpen, onClose, vehicle }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!isOpen || !vehicle) return null;

    const images = vehicle.images || [];

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: "20px", background: "#f8f9fa" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {vehicle.year} {vehicle.make?.name} {vehicle.model?.name}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="row g-4">
                            {/* Main Image View */}
                            <div className="col-12">
                                <div className="position-relative" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
                                    {images.length > 0 ? (
                                        <Image
                                            src={images[activeImageIndex]?.url}
                                            alt={vehicle.make?.name}
                                            fill
                                            unoptimized
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white">
                                            No Image Available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="col-12">
                                <div className="d-flex gap-2 overflow-auto pb-2 no-scrollbar">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`flex-shrink-0 position-relative cursor-pointer ${activeImageIndex === idx ? "border border-primary border-3" : ""}`}
                                            style={{ width: "80px", height: "60px", borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}
                                        >
                                            <Image src={img.url} alt="thumbnail" fill unoptimized style={{ objectFit: "cover" }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details Briefly */}
                            <div className="col-12">
                                <div className="d-flex flex-wrap gap-3">
                                    <div className="px-3 py-2 bg-white rounded-3 shadow-sm">
                                        <span className="text-secondary small d-block">Price</span>
                                        <span className="fw-bold">
                                            {vehicle.price && Number(vehicle.price) > 0 ? (
                                                `$${parseFloat(vehicle.price).toLocaleString()}`
                                            ) : (
                                                <span
                                                    style={{ cursor: "help" }}
                                                    className="d-inline-flex align-items-center gap-1"
                                                    title={"Prices may vary based on market conditions.\nContact us via WhatsApp for the current price."}
                                                >
                                                    <span>Contact for Price</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8, flexShrink: 0 }}>
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M12 16v-4"/>
                                                        <path d="M12 8h.01"/>
                                                    </svg>
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="px-3 py-2 bg-white rounded-3 shadow-sm">
                                        <span className="text-secondary small d-block">Mileage</span>
                                        <span className="fw-bold">{vehicle.mileage} miles</span>
                                    </div>
                                    <div className="px-3 py-2 bg-white rounded-3 shadow-sm">
                                        <span className="text-secondary small d-block">Transmission</span>
                                        <span className="fw-bold">{vehicle.transmission}</span>
                                    </div>
                                    <div className="px-3 py-2 bg-white rounded-3 shadow-sm">
                                        <span className="text-secondary small d-block">Status</span>
                                        <span className="fw-bold text-success text-uppercase">{vehicle.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-secondary px-4 py-2" style={{ borderRadius: "10px" }} onClick={onClose}>Close</button>
                        <button type="button" className="btn btn-primary px-4 py-2" style={{ borderRadius: "10px", background: "#1D3B6C", border: "none" }}>Enquire Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
