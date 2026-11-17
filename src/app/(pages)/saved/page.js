"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getLikedVehicles } from "@/services/vehicle.service";
import { getVehicleImage, getImageUrl } from "@/utils/image";
import CarCard from "@/components/CarCard";
import { Heart } from "lucide-react";

// Component to display user's saved/liked vehicles list with pagination
export default function SavedVehiclesPage() {
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const [restoringAuth, setRestoringAuth] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedVehicles, setLikedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);

  // Verifies user session token and redirects to login if unauthenticated
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken && !token) {
      router.push("/login");
    } else {
      setRestoringAuth(false);
    }
  }, [token, router]);

  // Fetches the user's liked vehicles from the API with page filters
  const fetchLikedVehicles = async (pageNum = 1, silent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!silent) {
      setLoading(true);
    }
    try {
      const params = {
        limit: 10,
        page: pageNum,
      };

      const response = await getLikedVehicles(params);
      let fetchedData = response?.data?.vehicles || response?.data?.likedVehicles || response?.vehicles || [];
      if (!Array.isArray(fetchedData)) fetchedData = [];

      setLikedVehicles(fetchedData);

      // Handle Pagination Calculations
      const total = response?.data?.pagination?.total || response?.data?.pagination?.totalItems || response?.pagination?.totalItems || 0;
      const calculatedPages = response?.data?.pagination?.totalPages || response?.pagination?.totalPages || (total ? Math.ceil(total / 10) : (fetchedData.length === 10 ? pageNum + 1 : pageNum));
      setTotalPages(calculatedPages);
    } catch (err) {
      console.error("Error fetching saved vehicles:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Triggers initial liked vehicles fetch once auth state is verified
  useEffect(() => {
    if (!restoringAuth) {
      fetchLikedVehicles(1);
    }
  }, [restoringAuth]);

  // Handles removing a vehicle from the saved list optimistically
  const handleUnlike = (vehicleId) => {
    // Optimistically filter out the unliked car
    setLikedVehicles((prev) => prev.filter((v) => (v.id || v._id) !== vehicleId));
    // If the page is now empty and we are not on page 1, go back one page
    if (likedVehicles.length <= 1 && currentPage > 1) {
      handlePageChange(currentPage - 1);
    } else {
      // Re-fetch to sync pagination count silently (in the background)
      fetchLikedVehicles(currentPage, true);
    }
  };

  // Handles transition to a new page and scrolls to top of page section
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchLikedVehicles(newPage);
    
    // Smooth scroll back to header
    const section = document.querySelector(".ok-saved-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculates pagination page numbers with ellipsis gaps
  const getPageNumbers = () => {
    const range = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  const formattedVehicles = likedVehicles.map((v, i) => {
    const city = v?.dealer_city || "";
    const stateVal = v?.dealer_state || "";
    const countryVal = v?.dealer_country || "";
    const dealerLocation = [city, stateVal, countryVal].filter(Boolean).join(", ");
    const customLocation = v.specs?.custom?.location || "";
    const rawImage = getVehicleImage(v);
    const resolvedImage = getImageUrl(rawImage) || "/images/broken-image.svg";
    
    return {
      id: v.id || v._id || `api-${i}`,
      badge: v.status === "available" ? "Available" : v.status || "Saved",
      title: `${v.specs?.heading || ""}`.trim(),
      location: dealerLocation || customLocation || "-----",
      price: (v.price && Number(v.price) > 0) ? `$${Number(v.price).toLocaleString()}` : "Contact for Price",
      label: v.transmission || "N/A",
      mileage: v.mileage ?? v.specs?.miles ?? null,
      image: resolvedImage,
      isLiked: true,
    };
  });

  if (restoringAuth && !token) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "#050913", color: "#fff" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ok-home-page" style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <section className="ok-home-section ok-saved-section">
        <div className="container-dashboard">
          <div className="ok-home-section__head mb-5">
            <div>
              <h2 className="ok-home-section__eyebrow">Saved Vehicles</h2>
              <p>Manage and track your selected export choices.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {formattedVehicles.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                  {formattedVehicles.map((item) => (
                    <div key={item.id} className="col">
                      <CarCard item={item} blue showLikeButton onLikeToggle={handleUnlike} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 border border-secondary border-dashed rounded-4 my-5" style={{ borderColor: "rgba(255,255,255,0.1) !important" }}>
                  <div className="d-flex justify-content-center mb-3">
                    <Heart size={48} className="text-white opacity-25" />
                  </div>
                  <h4 className="text-white fw-bold mb-2">No Saved Vehicles Yet</h4>
                  <p className="text-white opacity-50 mb-4 col-md-6 mx-auto">
                    You haven&apos;t saved any vehicles to your list. Start exploring our high-quality inventory and tap the heart icon on any vehicle to save it.
                  </p>
                  <Link href="/dashboard" className="ok-home-btn ok-home-btn--primary">
                    Browse Cars
                  </Link>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="ok-pagination-container mt-5">
                  <div className="ok-pagination-info">
                    Showing Page {currentPage} of {totalPages}
                  </div>
                  <button
                    type="button"
                    className="ok-pagination-btn ok-pagination-arrow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo; Prev
                  </button>

                  {getPageNumbers().map((pageNum, idx) => {
                    if (pageNum === "...") {
                      return (
                        <span key={`dots-${idx}`} className="text-white opacity-50 px-2 align-self-center">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${pageNum}`}
                        type="button"
                        className={`ok-pagination-btn ${currentPage === pageNum ? "active" : ""}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className="ok-pagination-btn ok-pagination-arrow"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
