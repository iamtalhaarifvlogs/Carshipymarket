"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getMyReservations } from "@/services/vehicle.service";
import { getVehicleImage, getImageUrl } from "@/utils/image";
import {
  Calendar,
  DollarSign,
  ExternalLink,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ReservationsPage() {
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const [restoringAuth, setRestoringAuth] = useState(true);

  // Pagination & Data states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState("/images/broken-image.svg");
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken && !token) {
      router.push("/login");
    } else {
      setRestoringAuth(false);
    }
  }, [token, router]);

  const fetchReservations = async (pageNum = 1) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const params = {
        limit: 4,
        page: pageNum,
      };

      const response = await getMyReservations(params);

      // Support different payload envelopes
      let fetchedData =
        response?.data?.reservations ||
        response?.reservations ||
        response?.data ||
        [];
      if (!Array.isArray(fetchedData)) {
        if (response && Array.isArray(response)) {
          fetchedData = response;
        } else {
          fetchedData = [];
        }
      }

      setReservations(fetchedData);

      // Handle Pagination Calculations
      const total =
        response?.data?.pagination?.total ||
        response?.data?.pagination?.totalItems ||
        response?.pagination?.totalItems ||
        fetchedData.length;
      const calculatedPages =
        response?.data?.pagination?.totalPages ||
        response?.pagination?.totalPages ||
        Math.max(1, Math.ceil(total / 10));
      setTotalPages(calculatedPages);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (!restoringAuth) {
      fetchReservations(1);
    }
  }, [restoringAuth]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchReservations(newPage);

    // Smooth scroll back to top of section
    const section = document.querySelector(".ok-reservations-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  // Helper to format values as currency
  const formatCurrency = (val) => {
    if (val === undefined || val === null || isNaN(val) || val <= 0) {
      return "$0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper to get status badge classes and label
  const getStatusDetails = (status) => {
    if (!status) {
      return {
        label: "Pending",
        className: "ok-status-badge--pending",
      };
    }

    const norm = status.toLowerCase();

    // Map exact backend status string (case-insensitive) to friendly labels & classes
    switch (norm) {
      // Pending / Agreed / Initial states
      case "pending":
      case "waiting":
      case "hold":
        return { label: "Pending", className: "ok-status-badge--pending" };
      case "agreed":
        return { label: "Deal Agreed", className: "ok-status-badge--pending" };

      // Escrow Payment Flows
      case "payment_sent":
        return { label: "Payment Sent", className: "ok-status-badge--info" };
      case "payment_received":
        return { label: "Payment Received", className: "ok-status-badge--secured" };
      case "payment_approved":
        return { label: "Payment Approved", className: "ok-status-badge--secured" };
      case "payment_disbursed":
        return { label: "Payment Disbursed", className: "ok-status-badge--secured" };
      case "payment_refunded":
        return { label: "Payment Refunded", className: "ok-status-badge--purple" };
      case "payment_rejected":
        return { label: "Payment Rejected", className: "ok-status-badge--cancelled" };

      // Shipping & Inspection Flows
      case "vehicle_shipped":
      case "shipped":
        return { label: "Vehicle Shipped", className: "ok-status-badge--info" };
      case "buyer_received_vehicle":
      case "received":
        return { label: "Vehicle Received", className: "ok-status-badge--info" };
      case "buyer_accepted_vehicle":
      case "accepted":
        return { label: "Vehicle Accepted", className: "ok-status-badge--secured" };
      case "buyer_rejected_vehicle":
      case "rejected":
        return { label: "Vehicle Rejected", className: "ok-status-badge--cancelled" };

      // Return & Dispute Flows
      case "vehicle_being_shipped_back_to_seller":
      case "ship_return":
        return { label: "Return Shipped", className: "ok-status-badge--purple" };
      case "seller_received_returned_vehicle":
      case "receive_return":
        return { label: "Return Received", className: "ok-status-badge--purple" };
      case "seller_accepted_returned_vehicle":
      case "accept_return":
        return { label: "Return Accepted", className: "ok-status-badge--secured" };
      case "seller_rejected_returned_vehicle":
      case "reject_return":
        return { label: "Return Disputed", className: "ok-status-badge--cancelled" };

      // Completion & Cancellation
      case "completed":
      case "secured":
      case "active":
      case "success":
        return { label: "Completed", className: "ok-status-badge--secured" };
      case "cancelled":
        return { label: "Cancelled", className: "ok-status-badge--cancelled" };

      default:
        // Try parsing snake_case/camelCase or return status directly
        const formattedLabel = status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
        return {
          label: formattedLabel,
          className: "ok-status-badge--pending",
        };
    }
  };

  const handleWhatsAppClick = (e, item, vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    const title =
      `${vehicle.year || ""} ${vehicle.make?.name || ""} ${vehicle.model?.name || ""}`.trim();
    const text = `Hello Okomoto, I am inquiring about my Reservation ID: ${item.id || item._id} for the vehicle: ${title}.`;
    window.open(
      `https://wa.me/2349000000000?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  if (restoringAuth && !token) {
    return (
      <div
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{ background: "#050913", color: "#fff" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ok-home-page ok-reservations-page">
      <section className="ok-home-section ok-reservations-section">
        <div className="container-dashboard">
          <div className="ok-home-section__head mb-5">
            <div>
              <h2 className="ok-home-section__eyebrow">My Reservations</h2>
              <p>
                View and manage your active temporary holds and secure escrow
                payments.
              </p>
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
              {reservations.length > 0 ? (
                <div className="row g-4">
                  {reservations.map((item, idx) => {
                    const vehicle = item.vehicle || item;
                    const city = vehicle.specs?.dealer?.city || "";
                    const stateVal = vehicle.specs?.dealer?.state || "";
                    const countryVal = vehicle.specs?.dealer?.country || "";
                    const dealerLocation = [city, stateVal, countryVal]
                      .filter(Boolean)
                      .join(", ");
                    const customLocation =
                      vehicle.specs?.custom?.location || "";
                    const location =
                      dealerLocation || customLocation || "-----";

                    const rawImage = getVehicleImage(vehicle);
                    const resolvedImage =
                      getImageUrl(rawImage) || "/images/broken-image.svg";
                    const carTitle =
                      `${vehicle.year || ""} ${vehicle.make?.name || vehicle.specs?.build?.make || ""} ${vehicle.model?.name || vehicle.specs?.build?.model || ""}`.trim() ||
                      "Vehicle Details";
                    const statusConfig = getStatusDetails(item.status);

                    const ReservationImage = ({ src, alt }) => {
                      const [imageSrc, setImageSrc] = useState(
                        src || "/images/broken-image.svg",
                      );

                      useEffect(() => {
                        setImageSrc(src || "/images/broken-image.svg");
                      }, [src]);

                      return (
                        <Image
                          src={imageSrc}
                          alt={alt}
                          fill
                          className="object-fit-contain"
                          sizes="(max-width: 768px) 100vw, 300px"
                          onError={() => {
                            if (imageSrc !== "/images/broken-image.svg") {
                              setImageSrc("/images/broken-image.svg");
                            }
                          }}
                        />
                      );
                    };

                    return (
                      <div
                        key={item.id || item._id || `res-${idx}`}
                        className="col-12 col-xl-6"
                      >
                        <div className="p-4 rounded-4 ok-reservation-card">
                          <div className="row g-4">
                            {/* Car Image Column */}
                            <div className="col-12 col-md-5">
                              <div className="position-relative w-100 rounded-3 overflow-hidden ok-reservation-card__image-wrap">
                                <ReservationImage
                                  src={resolvedImage}
                                  alt={carTitle}
                                />
                                <div className="ok-status-badge-container">
                                  <span
                                    className={`ok-status-badge ${statusConfig.className}`}
                                  >
                                    {statusConfig.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Details Column */}
                            <div className="col-12 col-md-7 d-flex flex-column justify-content-between">
                              <div>
                                <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                                  <span className="text-white-50 ok-reservation-card__id">
                                    ID:{" "}
                                    <span className="font-monospace text-white">
                                      {item.id || item._id || "N/A"}
                                    </span>
                                  </span>
                                </div>

                                <h3
                                  className="h5 text-white fw-bold mb-2 text-truncate"
                                  title={carTitle}
                                >
                                  {carTitle}
                                </h3>

                                <div className="text-white-50 mb-3 ok-reservation-card__info-list">
                                  <div className="d-flex align-items-center gap-1.5 mb-1.5">
                                    <span className="ok-reservation-card__icon-wrap">
                                      📍
                                    </span>
                                    <span className="text-truncate">
                                      {location}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center gap-1.5 mb-1.5">
                                    <Calendar
                                      size={14}
                                      className="text-primary-light"
                                    />
                                    <span>
                                      Reserved:{" "}
                                      {formatDate(
                                        item.created_at || item.createdAt,
                                      )}
                                    </span>
                                  </div>
                                </div>

                                {/* Escrow details section */}
                                <div className="p-3 rounded-3 d-flex align-items-center justify-content-between ok-reservation-card__escrow-section">
                                  <div className="d-flex align-items-center gap-2">
                                    <DollarSign
                                      size={16}
                                      className="text-success"
                                    />
                                    <div>
                                      <div className="text-white-50 ok-reservation-card__lbl">
                                        Escrow Amount
                                      </div>
                                      <div className="fw-bold text-white ok-reservation-card__amount">
                                        {formatCurrency(item.total_amount)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-end">
                                    <div className="text-white-50 ok-reservation-card__lbl">
                                      Transmission
                                    </div>
                                    <div className="text-white fw-semibold ok-reservation-card__transmission">
                                      {vehicle.transmission || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="ok-reservation-card__actions">
                                <Link
                                  href={`/cars/${vehicle.id || vehicle._id}?source=reservation`}
                                  className="ok-reservation-card__btn-view"
                                >
                                  View Vehicle <ExternalLink size={14} />
                                </Link>
                                <button
                                  onClick={(e) =>
                                    handleWhatsAppClick(e, item, vehicle)
                                  }
                                  className="ok-reservation-card__btn-inquire"
                                >
                                  <FaWhatsapp size={14} /> Inquire
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-5 border border-secondary border-dashed rounded-4 my-5 ok-reservations-empty">
                  <div className="d-flex justify-content-center mb-3">
                    <ShieldAlert size={48} className="text-white opacity-25" />
                  </div>
                  <h4 className="text-white fw-bold mb-2">
                    No Active Reservations
                  </h4>
                  <p className="text-white opacity-50 mb-4 col-md-6 mx-auto">
                    You do not have any vehicle reservations at the moment.
                    Browse our export-ready car collection and secure a
                    temporary hold on your selected choice.
                  </p>
                  <Link
                    href="/dashboard"
                    className="ok-home-btn ok-home-btn--primary"
                  >
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
                        <span
                          key={`dots-${idx}`}
                          className="text-white opacity-50 px-2 align-self-center"
                        >
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
