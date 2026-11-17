"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import { getVehicles } from "@/services/vehicle.service";
import VehicleModal from "../components/VehicleModal";

import shipIcon from "@/assets/images/ship.svg";
import shipToIcon from "@/assets/images/shipto.svg";
import newArrivalImg from "@/assets/images/cars/new-arrival.png";
import { getImageUrl } from "@/utils/image";

// Section component rendering the home page's featured vehicles grid matching API updates
export default function FeaturedCars() {
  const { openLoginModal } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const [cars, setCars] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries standard vehicles from API with page limits
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const params = { limit: 12 };
        if (sortBy) {
          params.sortOrder = sortBy;
        }
        const response = await getVehicles(params);
        // Correcting data extraction based on actual API structure:
        // { statusCode: 200, message: "...", data: { vehicles: [], pagination: {} } }
        let allCars = [];
        if (response && response.data && Array.isArray(response.data.vehicles)) {
          allCars = response.data.vehicles;
        } else if (response && Array.isArray(response.data)) {
          allCars = response.data;
        } else if (response && response.results) {
          allCars = response.results;
        }

        if (allCars.length > 0) {
          if (sortBy) {
            // If sorted, take the first 4 sorted from the API
            setCars(allCars.slice(0, 4));
          } else {
            // Randomize and pick 4
            const shuffled = [...allCars].sort(() => 0.5 - Math.random()).slice(0, 4);
            setCars(shuffled);
          }
        } else {
          setCars([]); // Explicitly set empty if no results
        }
      } catch (error) {
        console.error("Error fetching featured vehicles:", error);
        setCars([]); // Fallback to empty on error
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [sortBy]);

  // Triggers mock purchase alert or forces login modal bounds
  const handleBuy = () => {
    if (user) {
      alert("Purchase flow starting soon! You are logged in as " + user.email);
    } else {
      openLoginModal();
    }
  };

  // Triggers selection of car details to pop open modal overlay views
  const handleViewDetails = (car) => {
    setSelectedVehicle(car);
    setIsModalOpen(true);
  };

  // Triggers close of vehicle detail modal state options
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  if (loading) {
    return (
      <section className="ok-featured py-10 my-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-medium">Finding the best deals for you...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ok-featured py-5 px-3">
      <div className="container-xxl">
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <h2 className="fw-black subHeading mb-0">Featured Vehicles</h2>
          
          {/* Sort Dropdown */}
          <div className="position-relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="ok-set-filters-btn"
              style={{
                appearance: "none",
                paddingRight: "32px",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <span 
              className="position-absolute pointer-events-none" 
              style={{ 
                right: "12px", 
                top: "50%", 
                transform: "translateY(-50%)", 
                pointerEvents: "none",
                color: "#0b1b3b",
                display: "flex",
                alignItems: "center"
              }}
            >
              <svg width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <h4 className="text-muted">No vehicles available at the moment.</h4>
            <p className="mb-0 text-secondary">Please check back later or try our search tool.</p>
          </div>
        ) : (
          <div className="row g-4">
            {cars.map((car, idx) => {
              const primaryImgObj = car.images?.find(
                (img) =>
                  img &&
                  (img.is_primary === true ||
                    img.isPrimary === true ||
                    img.is_primary === "true" ||
                    img.isPrimary === "true")
              ) || car.images?.[0];
              const rawImage = primaryImgObj
                ? primaryImgObj.url ||
                primaryImgObj.path ||
                primaryImgObj.link ||
                (typeof primaryImgObj === "string" ? primaryImgObj : null)
                : null;
              const primaryImage = getImageUrl(rawImage) || "/images/broken-image.svg";
              const carName = `${car.year} ${car.make?.name || ''} ${car.model?.name || ''}`;
              const formattedPrice = (car.price && parseFloat(car.price) > 0) ? `$${parseFloat(car.price).toLocaleString()}` : "Contact for Price";
              const formattedMiles = car.mileage ? `${car.mileage.toLocaleString()} miles` : "N/A miles";
              const estShipping = "$1,200";

              return (
                <div key={idx} className="col-12 col-md-6" onClick={() => handleViewDetails(car)} style={{ cursor: "pointer" }}>
                  <div className="ok-car-card h-100">
                    {/* Image Area */}
                    <div className="ok-car-img-wrap" style={{ position: "relative" }}>
                      <img
                        src={primaryImage}
                        alt={carName}
                        style={{ objectFit: "cover", width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
                        onError={(e) => {
                          e.target.src = "/images/broken-image.svg";
                        }}
                      />
                      <div className="ok-badge-certified">
                        <span>🛡️</span>
                        <span>Certified</span>
                      </div>
                      <div className="ok-badge-hot">Hot Deal</div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="fs28 mb-0 pe-2">{carName}</h3>
                        <span className="fs-36 text-nowrap d-inline-flex align-items-center">
                          {formattedPrice && formattedPrice.startsWith("$") ? (
                            <>
                              <span className="ok-price-symbol" style={{ fontSize: "1.25em", fontWeight: "800", marginRight: "1px" }}>$</span>
                              <span>{formattedPrice.slice(1)}</span>
                            </>
                          ) : (
                            formattedPrice
                          )}
                        </span>
                      </div>

                      <p className="fs-18 mb-4">{formattedMiles}</p>

                      <div className="ok-shipping-row mb-4">
                        <div className="d-flex align-items-center gap-2">
                          <Image src={shipIcon} alt="Ship" width={20} height={20} />
                          <span className="ok-shipping-label">Est. Shipping to Nigeria</span>
                        </div>
                        <div className="ok-shipping-price-block">
                          <div className="ok-shipping-to-label">SHIPPING TO</div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="ok-shipping-price">{estShipping}</span>
                            <button className="ok-shipping-icon-btn" title="Shipping info" onClick={(e) => e.stopPropagation()}>
                              <Image src={shipToIcon} alt="Ship To" width={16} height={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuy(); }}
                          className="ok-btn-buy"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleViewDetails(car); }}
                          className="ok-btn-view"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Vehicle Modal Popup */}
      {selectedVehicle && (
        <VehicleModal
          isOpen={isModalOpen}
          onClose={closeModal}
          vehicle={selectedVehicle}
        />
      )}
    </section>
  );
}