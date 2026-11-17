"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle,
  Globe,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import {
  getVehicleById,
  getShippingRates,
  getShippingCostBreakdown,
  reservationsVehicle,
  createInquiry,
} from "@/services/vehicle.service";
import { getImageUrl } from "@/utils/image";

// Helper to format values as currency
const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(val) || val <= 0) {
    return (
      <span
        style={{ cursor: "help" }}
        className="d-inline-flex align-items-center gap-1"
        title={
          "Prices may vary based on market conditions.\nContact us via WhatsApp for the current price."
        }
      >
        <span>Contact for Price</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.8, flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </span>
    );
  }
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(val);
  return (
    <span className="d-inline-flex align-items-center">
      <span
        className="ok-price-symbol"
        style={{ fontSize: "1.25em", fontWeight: "800", marginRight: "1px" }}
      >
        $
      </span>
      <span>{formatted.slice(1)}</span>
    </span>
  );
};

// Fallback data generator if backend details are missing/not found
const generateMockDetails = (vehicleId) => {
  return fillMockDetails(
    {
      id: null,
      title: null,
      location: null,
      price: null,
      status: null,
      image: generateMockDetails,
    },
    vehicleId,
  );
};

// Supplement properties to match Figma details spec using the live response data schema
const fillMockDetails = (carResponse, id) => {
  if (!carResponse) return null;

  // Support response shape either as raw object or enveloped in { statusCode, data }
  const carData = carResponse.data || carResponse;

  const priceNum = carData.price
    ? parseFloat(carData.price)
    : carData.specs?.price
      ? parseFloat(carData.specs.price)
      : NaN;

  // Extract thumbnail links from images array or specs photo_links
  let thumbnails = [];
  if (Array.isArray(carData.images)) {
    thumbnails = carData.images
      .map((img) => getImageUrl(img.url || img))
      .filter(Boolean);
  } else if (
    carData.specs?.media?.photo_links &&
    Array.isArray(carData.specs.media.photo_links)
  ) {
    thumbnails = carData.specs.media.photo_links
      .map((link) => getImageUrl(link))
      .filter(Boolean);
  }

  if (thumbnails.length === 0) {
    thumbnails = ["/images/broken-image.svg"];
  }

  const makeName = carData.make?.name || carData.specs?.build?.make || "";
  const modelName = carData.model?.name || carData.specs?.build?.model || "";
  const yearVal = carData.year || carData.specs?.build?.year || "2022";
  const titleVal =
    carData.specs?.custom?.vehicle_name ||
    carData.specs?.heading ||
    `${yearVal} ${makeName} ${modelName}`.trim() ||
    "Vehicle Details";

  const city = carData.specs?.dealer?.city || carData.dealer_city || "";
  const stateVal = carData.specs?.dealer?.state || carData.dealer_state || "";
  const countryVal =
    carData.specs?.dealer?.country || carData.dealer_country || "";
  const dealerLocation = [city, stateVal, countryVal]
    .filter(Boolean)
    .join(", ");

  const doorsVal = carData.doors || carData.specs?.build?.doors;
  const seatingVal = carData.std_seating || carData.specs?.build?.std_seating;
  const doorsSeatsVal =
    doorsVal || seatingVal
      ? `${doorsVal || "-----"} / ${seatingVal || "-----"}`
      : "-----";

  return {
    id: carData.id || carData._id || id,
    title: titleVal,
    location: dealerLocation || carData.specs?.custom?.location || "-----",
    // price: formatCurrency(priceNum),
    badge: carData.status ? carData.status.toUpperCase() : "-----",
    image: thumbnails[0],
    thumbnails: thumbnails,
    engine: carData.specs?.build?.engine || carData.engine || "------",
    transmission:
      carData.transmission || carData.specs?.build?.transmission || "-----",
    mileage: (() => {
      const raw = carData.mileage ?? carData.specs?.miles;
      if (raw === undefined || raw === null || raw === "") return "-----";
      const num = Number(raw);
      if (isNaN(num)) return raw;
      const unit = num === 0 || num === 1 ? "mile" : "miles";
      return `${num.toLocaleString()} ${unit}`;
    })(),
    fuelType:
      carData.fuel_type?.name || carData.specs?.build?.fuel_type || "-----",
    basePrice: priceNum,
    exportDoc: 0,
    portHandling: 0,
    destination: "Nigeria (Lagos Port)",
    year: yearVal.toString(),
    condition:
      carData.body_type?.name || carData.specs?.build?.body_type || "-----",
    exteriorColor:
      carData.exterior_color || carData.specs?.exterior_color || "-----",
    interiorColor:
      carData.interior_color || carData.specs?.interior_color || "-----",
    vin: carData.vin || carData.specs?.vin || "-----",
    driveType:
      carData.drivetrain || carData.specs?.build?.drivetrain || "-----",
    doorsSeats: doorsSeatsVal,
    engineCapacity:
      carData.engine_size || carData.specs?.build?.engine_size || "-----",
    reservation: carData.reservation
      ? {
          id: carData.reservation.id,
          status: carData.reservation.status,
          escrow_payment_url: carData.reservation.escrow_payment_url,
        }
      : null,
  };
};

// Helper component to display each gallery thumbnail safely with isolated React state fallbacks
const ThumbnailImage = ({ src, alt, isActive, onClick }) => {
  const [imgSrc, setImgSrc] = useState(src || "/images/broken-image.svg");

  useEffect(() => {
    setImgSrc(src || "/images/broken-image.svg");
  }, [src]);

  return (
    <div
      className={`ok-details-thumb-item ${isActive ? "active" : ""}`}
      onClick={onClick}
      style={{ position: "relative" }}
    >
      <Image
        src={imgSrc}
        alt={alt}
        fill
        style={{
          objectFit: "contain",
        }}
        onError={() => {
          if (imgSrc !== "/images/broken-image.svg") {
            setImgSrc("/images/broken-image.svg");
          }
        }}
      />
    </div>
  );
};

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isFromReservation = searchParams.get("source") === "reservation";

  console.log(isFromReservation, "isFromReservation");
  const [vehicle, setVehicle] = useState(null);
  console.log(" ~ file: page.js:174 ~ CarDetailPage ~ vehicle:", vehicle);
  const [loading, setLoading] = useState(true);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [mainImageLoading, setMainImageLoading] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeImageSrc, setActiveImageSrc] = useState("");
  const [showReservation, setShowReservation] = useState(false);
  const thumbsRef = useRef(null);
  const lastFetchedRef = useRef({ methodId: null, vehicleId: null });
  const { user } = useSelector((state) => state.auth);

  // const isReservationCompleted =
  //   vehicle?.reservation &&
  //   ["buyer_accepted_vehicle", "complete", "cancelled","seller_accepted_returned_vehicle"].includes(vehicle.reservation.status);

  // const isReservationCompleted =
  //   isFromReservation &&
  //   vehicle?.reservation &&
  //   [
  //     "buyer_accepted_vehicle",
  //     "complete",
  //     "cancelled",
  //     "seller_accepted_returned_vehicle",
  //   ].includes(vehicle.reservation.status);

  const reservationStatus = vehicle?.reservation?.status;
  const hasReservation = !!vehicle?.reservation;

  const isCompleted = ["buyer_accepted_vehicle", "complete"].includes(
    reservationStatus,
  );

  const isCancelled = [
    "cancelled",
    "seller_accepted_returned_vehicle",
  ].includes(reservationStatus);

  const hasValidBasePrice =
    vehicle?.basePrice !== null &&
    vehicle?.basePrice !== undefined &&
    vehicle?.basePrice !== "" &&
    !Number.isNaN(Number(vehicle?.basePrice));

  // Set image source when vehicle or selected thumbnail changes
  useEffect(() => {
    if (vehicle?.thumbnails?.[activeImageIdx]) {
      setActiveImageSrc(vehicle.thumbnails[activeImageIdx]);
    } else {
      setActiveImageSrc("/images/broken-image.svg");
    }
  }, [vehicle, activeImageIdx]);

  // Handle cached/fast loading images using a DOM listener/polling backup to ensure loader never gets stuck
  useEffect(() => {
    if (!mainImageLoading) return;

    const checkComplete = () => {
      const img = document.querySelector(".ok-details-main-img img");
      if (img && img.complete) {
        setMainImageLoading(false);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkComplete()) return;

    // Set up polling interval as a fallback
    const interval = setInterval(() => {
      checkComplete();
    }, 100);

    return () => clearInterval(interval);
  }, [mainImageLoading, activeImageSrc]);

  // Set loading state only when the active image index changes (user clicks thumbnail)
  useEffect(() => {
    if (vehicle) {
      setMainImageLoading(true);
    }
  }, [activeImageIdx, vehicle]);

  const token =
    useSelector((state) => state.auth?.token) ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  useEffect(() => {
    // Redirect if not authenticated
    // if (!token) {
    //   router.push("/login");
    //   return;
    // }

    if (!id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getVehicleById(id);
        setVehicle(fillMockDetails(data, id));
      } catch (err) {
        console.warn(
          "Failed to fetch vehicle from API, using fallback generator.",
          err,
        );
        setVehicle(generateMockDetails(id));
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token, router]);

  useEffect(() => {
    const fetchShippingRates = async () => {
      try {
        const res = await getShippingRates();
        const rawList = res?.data?.data || res?.data || res?.results || [];
        const ratesList = rawList
          .map((rate, idx) => ({
            id: rate.id || rate._id || `rate-${idx}`,
            shipping_method_id:
              rate.method?.id || rate.method?._id || rate.id || rate._id,
            country: rate.country || "-",
            port: rate.port || "-",
            shipping_method: rate.method?.name || rate.shipping_method || "-",
            cost: Number(rate.cost ?? 0),
            estimated_days: Number(rate.estimated_days ?? 0),
            is_active:
              rate.is_active !== undefined ? Boolean(rate.is_active) : true,
          }))
          .filter((rate) => rate.is_active);

        setShippingRates(ratesList);
        if (ratesList.length > 0) {
          const roro = ratesList.find(
            (r) =>
              r.shipping_method?.toLowerCase().includes("ro-ro") ||
              r.shipping_method?.toLowerCase().includes("ro ro"),
          );
          setSelectedRateId(roro ? roro.id : ratesList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch shipping rates:", err);
      }
    };

    fetchShippingRates();
  }, []);

  useEffect(() => {
    if (!selectedRateId) return;

    const currentRate = shippingRates.find((r) => r.id === selectedRateId);
    if (!currentRate) return;

    if (currentRate.isFallback) {
      setBreakdown({
        base_vehicle_price: vehicle?.basePrice || null,
        export_documentation: 0,
        local_port_handling: 0,
        shipping_cost: currentRate.cost,
        total_estimated_cost: (vehicle?.basePrice || 0) + currentRate.cost,
        destination: vehicle?.destination || "Nigeria (Lagos Port)",
      });
      return;
    }

    if (
      lastFetchedRef.current.methodId === currentRate.shipping_method_id &&
      lastFetchedRef.current.vehicleId === id
    ) {
      return;
    }

    const fetchBreakdown = async () => {
      try {
        setBreakdownLoading(true);
        lastFetchedRef.current = {
          methodId: currentRate.shipping_method_id,
          vehicleId: id,
        };
        const params = {
          shipping_method_id: currentRate.shipping_method_id,
        };
        if (id) {
          params.vehicle_id = id;
        }
        const res = await getShippingCostBreakdown(params);
        const data = res?.data || res;
        setBreakdown(data);
      } catch (err) {
        console.error("Failed to fetch shipping cost breakdown:", err);
        setBreakdown({
          base_vehicle_price: vehicle?.basePrice || null,
          export_documentation: 0,
          local_port_handling: 0,
          shipping_cost: currentRate.cost,
          total_estimated_cost: (vehicle?.basePrice || 0) + currentRate.cost,
          destination: vehicle?.destination || "Nigeria (Lagos Port)",
        });
      } finally {
        setBreakdownLoading(false);
      }
    };

    fetchBreakdown();
  }, [selectedRateId, id, shippingRates, vehicle]);

  const scrollThumbs = (direction) => {
    if (thumbsRef.current) {
      const scrollAmount = 240;
      thumbsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const selectedRate = shippingRates.find((r) => r.id === selectedRateId);
  const shippingCost = selectedRate ? selectedRate.cost : 0;

  const displayBasePrice = breakdown
    ? (breakdown.base_vehicle_price ?? vehicle?.basePrice ?? 0)
    : (vehicle?.basePrice ?? 0);

  const displayExportDoc = breakdown
    ? (breakdown.export_documentation ?? vehicle?.exportDoc ?? 0)
    : (vehicle?.exportDoc ?? 0);

  const displayPortHandling = breakdown
    ? (breakdown.local_port_handling ?? vehicle?.portHandling ?? 0)
    : (vehicle?.portHandling ?? 0);

  const displayShippingCost = breakdown
    ? (breakdown.shipping_cost ?? shippingCost)
    : shippingCost;

  const displayTotalPrice = breakdown
    ? breakdown.total_estimated_cost && breakdown.base_vehicle_price
      ? breakdown.total_estimated_cost
      : Number(displayBasePrice) +
        Number(displayExportDoc) +
        Number(displayPortHandling) +
        Number(displayShippingCost)
    : (vehicle?.basePrice ?? 0) +
      (vehicle?.exportDoc ?? 0) +
      (vehicle?.portHandling ?? 0) +
      shippingCost;

  const totalExportPrice = displayTotalPrice;

  const sendLeadInquiry = () => {
    const currentVehicleId = vehicle?.id || id;
    if (!currentVehicleId) return;

    const payload = {
      // vehicleId: currentVehicleId,
      shippingEstimate: Number(displayShippingCost) || 0,
      totalExportPrice: Number(totalExportPrice) || 0,
    };

    createInquiry(payload).catch((err) => {
      console.error("Failed to submit inquiry:", err);
    });
  };

  const handleWhatsAppChat = () => {
    if (!vehicle) return;
    sendLeadInquiry();
    const text = `Hello Okomoto, I am interested in chatting about the vehicle: ${vehicle.title} (ID: ${vehicle.id})`;
    window.open(
      `https://wa.me/2349000000000?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const handleReserveCar = () => {
    sendLeadInquiry();
    setShowReservation(true);
  };

  const handleEscrowPayment = async (data) => {
    setEscrowLoading(true);
    window.open(data, "_blank");
    setEscrowLoading(false);
  };

  // ........................................................................................................................................
  const handleProceedEscrow = async () => {
    sendLeadInquiry();
    try {
      setEscrowLoading(true);

      const response = await reservationsVehicle({
        vehicle_id: id,
        shipping_method_id: selectedRate?.shipping_method_id,
        amount: breakdown?.total_estimated_cost?.toString(),
      });

      if (response?.data?.escrow_payment_url) {
        window.open(response.data.escrow_payment_url, "_blank");
      }
    } catch (error) {
      toast.error(error?.message || "Facing some issue! Please try again.");
    } finally {
      setEscrowLoading(false);
    }
  };

  if (loading) {
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
  if (!vehicle) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center min-vh-100"
        style={{ background: "#050913", color: "#fff" }}
      >
        <h2 className="mb-4">Vehicle details not found.</h2>
        <button onClick={handleBack} className="ok-details-back-btn">
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  if (showReservation) {
    return (
      <div className="ok-detail-page">
        <div className="container-dashboard">
          {/* Back button at top */}
          <div className="ok-details-back-bar">
            <button
              onClick={() => setShowReservation(false)}
              className="ok-details-back-btn"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <h1 className="ok-reserve-heading">Reservation Secured</h1>

          <div className="ok-reserve-layout">
            {/* Left Column */}
            <div className="ok-reserve-left">
              {/* Summary Card */}
              <div className="ok-reserve-summary-card">
                <div className="ok-reserve-car-img">
                  <Image
                    key={activeImageSrc}
                    src={activeImageSrc || "/images/broken-image.svg"}
                    alt={vehicle.title}
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                    onLoad={() => setMainImageLoading(false)}
                    onError={() => {
                      setActiveImageSrc("/images/broken-image.svg");
                      setMainImageLoading(false);
                    }}
                  />
                  {mainImageLoading && (
                    <div
                      className="position-absolute inset-0 d-flex align-items-center justify-content-center"
                      style={{
                        background: "rgba(5, 9, 19, 0.4)",
                        backdropFilter: "blur(4px)",
                        borderRadius: "15px",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10,
                      }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="ok-reserve-car-info">
                  <div className="ok-reserve-ready-tag">Ready to Export</div>
                  <h2 className="ok-reserve-car-title">{vehicle.title}</h2>
                  <div className="ok-reserve-prices-row">
                    <div className="ok-reserve-price-col">
                      <span className="ok-reserve-price-lbl">Base Price</span>
                      <span className="ok-reserve-price-val">
                        {formatCurrency(displayBasePrice)}
                      </span>
                    </div>
                    <div className="ok-reserve-price-col">
                      <span className="ok-reserve-price-lbl">
                        Export Handling & Shipping
                      </span>
                      <span className="ok-reserve-price-val">
                        {formatCurrency(
                          displayExportDoc +
                            displayPortHandling +
                            displayShippingCost,
                        )}
                      </span>
                    </div>
                    <div className="ok-reserve-price-col">
                      <span className="ok-reserve-price-lbl">
                        Total Estimate
                      </span>
                      <span className="ok-reserve-price-val">
                        {formatCurrency(totalExportPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Credentials */}
              <div className="ok-reserve-form-card">
                <div className="ok-reserve-form-header">
                  <div className="ok-reserve-form-icon-box">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="ok-reserve-form-title">Personal Details</h3>
                </div>

                <div className="ok-reserve-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="ok-reserve-input"
                    placeholder="John Doe"
                    defaultValue={user?.full_name || "John Doe"}
                    disabled
                  />
                </div>

                <div className="ok-reserve-form-group">
                  <label>WhatsApp Number</label>
                  <input
                    type="text"
                    className="ok-reserve-input"
                    placeholder="+1 (555) 000-0000"
                    defaultValue={`${user?.whatsapp_phone_code} ${user?.whatsapp_phone_number}`}
                    disabled
                  />
                </div>

                <div className="ok-reserve-form-group">
                  <label>Vehicle</label>
                  <input
                    type="text"
                    className="ok-reserve-input"
                    placeholder={vehicle.title}
                    defaultValue={vehicle.title}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="ok-reserve-right-card">
              <h3 className="ok-reserve-right-title">Reserve This Vehicle</h3>
              <p className="ok-reserve-right-desc">
                Securing this asset initiates a 48-hour temporary hold. You will
                be redirected to Escrow.com to authorize the security deposit.
                This ensures a transparent, fraud-free transaction for both
                parties.
              </p>

              {/* <div className="ok-reserve-row-item">
                <span className="ok-reserve-row-lbl">Reservation Deposit</span>
                <span className="ok-reserve-row-val">$2,500.00</span>
              </div> */}

              <div className="ok-reserve-row-item">
                <span className="ok-reserve-row-lbl">Total Export Price</span>
                <span className="ok-reserve-row-val--total">
                  {formatCurrency(totalExportPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedEscrow}
                className="ok-reserve-escrow-btn"
              >
                {escrowLoading ? (
                  <>
                    <span className="ok-spinner"></span> Loading...
                  </>
                ) : (
                  <>
                    Proceed to Escrow.com <ChevronRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowReservation(false)}
                className="ok-reserve-back-details"
              >
                Back to Vehicle Details
              </button>
            </div>
          </div>

          {/* Badges footer bar */}
          <div className="ok-reserve-badges-bar">
            <div className="ok-reserve-badge-item">
              <Shield size={18} className="ok-reserve-badge-icon" />
              <span>Secure</span>
            </div>
            <div className="ok-reserve-badge-item">
              <CheckCircle size={18} className="ok-reserve-badge-icon" />
              <span>Verified</span>
            </div>
            <div className="ok-reserve-badge-item">
              <Globe size={18} className="ok-reserve-badge-icon" />
              <span>Global</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Float */}
        <a
          href="https://wa.me/2349000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="ok-home-whatsapp"
          style={{
            position: "fixed",
            right: "2rem",
            bottom: "2rem",
            zIndex: 9999,
            textDecoration: "none",
          }}
          aria-label="WhatsApp support"
        >
          <svg viewBox="0 0 24 24" style={{ width: "24px", height: "24px" }}>
            <path
              fill="#fff"
              d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.62 0 .4 5.18.4 11.57c0 2.02.53 4 1.54 5.73L0 24l6.94-1.8a11.7 11.7 0 0 0 5.1 1.16h.01c6.46 0 11.68-5.18 11.68-11.57 0-3.1-1.23-6.02-3.21-8.31Zm-8.44 18.9c-1.6 0-3.16-.42-4.5-1.22l-.32-.19-4.12 1.07 1.1-4.02-.21-.34a9.45 9.45 0 0 1-1.46-5.05c0-5.25 4.3-9.52 9.59-9.52 2.56 0 4.96.99 6.77 2.79a9.47 9.47 0 0 1 2.81 6.73c0 5.25-4.31 9.52-9.66 9.52Zm5.56-7.14c-.3-.15-1.78-.87-2.06-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.28.3-1.08 1.04-1.08 2.53s1.11 2.93 1.26 3.13c.15.2 2.14 3.25 5.18 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.34Z"
            />
          </svg>
        </a>
      </div>
    );
  }

  return (
    <div className="ok-detail-page">
      <div className="container-dashboard">
        {/* Navigation Bar / Back button */}
        <div className="ok-details-back-bar">
          <button onClick={handleBack} className="ok-details-back-btn">
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* Main Grid: Images & Technical Config */}
        <div className="ok-details-main-grid">
          {/* Gallery */}
          <div className="ok-details-gallery">
            <div
              className="ok-details-main-img"
              style={{ position: "relative" }}
            >
              <Image
                key={activeImageSrc}
                src={activeImageSrc || "/images/broken-image.svg"}
                alt={vehicle.title}
                fill
                style={{ objectFit: "contain" }}
                priority
                onLoad={() => setMainImageLoading(false)}
                onError={() => {
                  setActiveImageSrc("/images/broken-image.svg");
                  setMainImageLoading(false);
                }}
              />
              {mainImageLoading && (
                <div
                  className="position-absolute inset-0 d-flex align-items-center justify-content-center"
                  style={{
                    background: "rgba(5, 9, 19, 0.4)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "15px",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                  }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Row Wrapper with arrows */}
            <div
              className={`ok-details-thumbs-wrapper ${vehicle.thumbnails?.length <= 6 ? "ok-hide-desktop-arrows" : ""}`}
            >
              {vehicle.thumbnails?.length > 3 && (
                <button
                  type="button"
                  onClick={() => scrollThumbs("left")}
                  className="ok-thumb-scroll-btn ok-thumb-scroll-btn--left"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              <div className="ok-details-thumbs" ref={thumbsRef}>
                {vehicle.thumbnails?.map((thumb, idx) => (
                  <ThumbnailImage
                    key={idx}
                    src={thumb}
                    alt={`${vehicle.title} thumbnail ${idx + 1}`}
                    isActive={activeImageIdx === idx}
                    onClick={() => setActiveImageIdx(idx)}
                  />
                ))}
              </div>

              {vehicle.thumbnails?.length > 3 && (
                <button
                  type="button"
                  onClick={() => scrollThumbs("right")}
                  className="ok-thumb-scroll-btn ok-thumb-scroll-btn--right"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Core Info & configuration */}
          <div className="ok-details-info-box">
            <div className="ok-details-title-sec">
              <h1>{vehicle.title}</h1>
              <div className="ok-details-location">
                <MapPin size={16} />
                {vehicle.location}
              </div>
            </div>

            <div className="ok-details-price-row">
              <span className="ok-details-price-label">Base Price</span>
              <span className="ok-details-price-val">
                {formatCurrency(vehicle.basePrice)}
              </span>
            </div>

            {/* <div className="ok-details-actions">
              {!isReservationCompleted && (
                <>
                  {vehicle?.reservation && vehicle?.reservation != null ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleEscrowPayment(
                          vehicle.reservation?.escrow_payment_url,
                        )
                      }
                      className="ok-details-btn-reserve"
                    >
                      {escrowLoading ? (
                        <>
                          <span className="ok-spinner"></span> Loading...
                        </>
                      ) : (
                        <>
                          View Progress
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleReserveCar}
                      className="ok-details-btn-reserve"
                      disabled={!hasValidBasePrice}
                      title={
                        !hasValidBasePrice
                          ? "This car is marked as 'Contact for Price', so you cannot make a reservation or payment."
                          : ""
                      }
                      style={{
                        cursor: !hasValidBasePrice ? "not-allowed" : "pointer",
                        opacity: !hasValidBasePrice ? 0.6 : 1,
                      }}
                    >
                      <Calendar size={18} /> Reserve This Car
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="ok-details-btn-whatsapp"
                  >
                    <FaWhatsapp size={20} /> Chat on WhatsApp
                  </button>
                </>
              )}
            </div> */}
            <div className="ok-details-actions">
              {/* CASE 1: completed -> hide on both */}
              {!isCompleted && (
                <>
                  {/*
        CASE 2:
        cancelled / seller_accepted_returned_vehicle
      */}
                  {isCancelled ? (
                    isFromReservation ? null : (
                      <button
                        type="button"
                        onClick={handleReserveCar}
                        className="ok-details-btn-reserve"
                        disabled={!hasValidBasePrice}
                        title={
                          !hasValidBasePrice
                            ? "This car is marked as 'Contact for Price', so you cannot make a reservation or payment."
                            : ""
                        }
                        style={{
                          cursor: !hasValidBasePrice
                            ? "not-allowed"
                            : "pointer",
                          opacity: !hasValidBasePrice ? 0.6 : 1,
                        }}
                      >
                        <Calendar size={18} /> Reserve This Car
                      </button>
                    )
                  ) : hasReservation ? (
                    /*
          CASE 3:
          Any other reservation status
        */
                    <button
                      type="button"
                      onClick={() =>
                        handleEscrowPayment(
                          vehicle.reservation?.escrow_payment_url,
                        )
                      }
                      className="ok-details-btn-reserve"
                    >
                      {escrowLoading ? (
                        <>
                          <span className="ok-spinner"></span> Loading...
                        </>
                      ) : (
                        <>
                          View Progress
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  ) : (
                    /*
          CASE 4:
          No reservation
        */
                    <button
                      type="button"
                      onClick={handleReserveCar}
                      className="ok-details-btn-reserve"
                      disabled={!hasValidBasePrice}
                      title={
                        !hasValidBasePrice
                          ? "This car is marked as 'Contact for Price', so you cannot make a reservation or payment."
                          : ""
                      }
                      style={{
                        cursor: !hasValidBasePrice ? "not-allowed" : "pointer",
                        opacity: !hasValidBasePrice ? 0.6 : 1,
                      }}
                    >
                      <Calendar size={18} /> Reserve This Car
                    </button>
                  )}

                  {/* WhatsApp button */}
                  <button
                    type="button"
                    onClick={handleWhatsAppChat}
                    className="ok-details-btn-whatsapp"
                  >
                    <FaWhatsapp size={20} /> Chat on WhatsApp
                  </button>
                </>
              )}
            </div>
            {/* Technical configuration */}
            <div className="ok-details-tech-config">
              <div className="ok-details-config-title">
                Technical Configuration
              </div>
              <div className="ok-details-config-grid">
                <div className="ok-details-config-item">
                  <span className="ok-details-config-label">Engine</span>
                  <span className="ok-details-config-val">
                    {vehicle.engine}
                  </span>
                </div>
                <div className="ok-details-config-item">
                  <span className="ok-details-config-label">Transmission</span>
                  <span className="ok-details-config-val">
                    {vehicle.transmission}
                  </span>
                </div>
                <div className="ok-details-config-item">
                  <span className="ok-details-config-label">Mileage</span>
                  <span className="ok-details-config-val">
                    {vehicle.mileage}
                  </span>
                </div>
                <div className="ok-details-config-item">
                  <span className="ok-details-config-label">Fuel Type</span>
                  <span className="ok-details-config-val">
                    {vehicle.fuelType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Pricing Estimate Box */}
        <div
          className="ok-details-estimate-box"
          style={{ position: "relative" }}
        >
          {breakdownLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(5, 9, 19, 0.7)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                borderRadius: "16px",
              }}
            >
              <div
                style={{
                  border: "3px solid rgba(255,255,255,0.1)",
                  borderTop: "3px solid #2f80ff",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  animation: "spin 1s linear infinite",
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
          <div className="ok-details-card-title">Export Pricing Estimate</div>
          <div className="ok-details-estimate-grid">
            <div className="ok-details-est-items">
              <div className="ok-details-est-row">
                <span className="ok-details-est-label">Base Vehicle Price</span>
                <span className="ok-details-est-val">
                  {formatCurrency(displayBasePrice)}
                </span>
              </div>
              <div className="ok-details-est-row">
                <span className="ok-details-est-label">
                  Export Documentation & Logistics
                </span>
                <span className="ok-details-est-val">
                  {formatCurrency(displayExportDoc)}
                </span>
              </div>
              <div className="ok-details-est-row">
                <span className="ok-details-est-label">
                  Port Handling & Terminal Fees
                </span>
                <span className="ok-details-est-val">
                  {formatCurrency(displayPortHandling)}
                </span>
              </div>
              {selectedRate && (
                <div className="ok-details-est-row">
                  <span className="ok-details-est-label">
                    Shipping Cost ({selectedRate.shipping_method})
                  </span>
                  <span className="ok-details-est-val">
                    {formatCurrency(displayShippingCost)}
                  </span>
                </div>
              )}
              <div className="ok-details-est-row">
                <span className="ok-details-est-label">Destination</span>
                <span className="ok-details-est-val">
                  {vehicle.destination}
                </span>
              </div>
            </div>

            <div className="ok-details-est-total-card">
              <div className="ok-details-est-total-label">
                Total Export Price
              </div>
              <div className="ok-details-est-total-val">
                {formatCurrency(totalExportPrice)}
              </div>
              <p className="ok-details-est-total-desc">
                Includes all clearing fees, customs duties, destination fees,
                port handling fees, documentation and logistics to destination
                port.
              </p>
            </div>
          </div>
        </div>

        {/* Can't find the right car? Callout */}
        <div className="ok-home-callout">
          <div className="ok-home-callout__content">
            <div className="ok-home-callout__icon">
              <BiSearchAlt />
            </div>
            <div>
              <h2 className="mb-1 text-white">
                <strong>Can&apos;t find the right car?</strong>
              </h2>
              <p
                className="mb-0 text-white opacity-75"
                style={{ fontSize: "0.95rem" }}
              >
                We can source better vehicles at lower prices through auctions.
              </p>
            </div>
          </div>
          <Link
            href={`/better-deal?export=true&id=${vehicle.id}`}
            onClick={() => sendLeadInquiry()}
            className="ok-home-btn ok-home-btn--primary text-decoration-none"
          >
            Find Me A Better Deal
          </Link>
        </div>

        {/* Shipping & Logistics Section */}
        <div className="mt-5">
          <h2 className="ok-details-sec-title">Shipping & Logistics</h2>
          <div className="ok-details-shipping-row">
            {shippingRates.map((rate) => {
              const isSelected = selectedRateId === rate.id;
              const isRoRo =
                rate.shipping_method?.toLowerCase().includes("ro-ro") ||
                rate.shipping_method?.toLowerCase().includes("ro ro");
              return (
                <div
                  key={rate.id}
                  className={`ok-details-shipping-card ${isSelected ? "ok-details-shipping-card--selected" : ""}`}
                  onClick={() => setSelectedRateId(rate.id)}
                  style={{ position: "relative" }}
                >
                  {isSelected && (
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "#2f80ff",
                        color: "#fff",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    >
                      ✓
                    </span>
                  )}
                  <div className="ok-details-ship-header">
                    <div className="ok-details-ship-title-box">
                      <div className="ok-details-ship-icon">
                        {isRoRo ? "🚢" : "📦"}
                      </div>
                      <h3 className="ok-details-ship-title">
                        {rate.shipping_method}
                      </h3>
                    </div>
                    {isRoRo ? (
                      <span className="ok-details-ship-badge">
                        Most Affordable
                      </span>
                    ) : (
                      <span className="ok-details-ship-badge ok-details-ship-badge--premium">
                        Premium Protection
                      </span>
                    )}
                  </div>
                  <p className="ok-details-ship-desc">
                    {isRoRo
                      ? "Vehicle is driven onto the vessel. The most efficient method for standard shipping."
                      : "Vehicle is secured inside a 20ft container. Maximum protection from sea elements."}
                  </p>
                  <div className="ok-details-ship-footer">
                    <span className="ok-details-ship-days">
                      ⏱{" "}
                      {rate.estimated_days
                        ? `${rate.estimated_days} Days`
                        : "20-35 Days"}
                    </span>
                    <span className="ok-details-ship-price">
                      ${rate.cost?.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div>
          <h2 className="ok-details-sec-title">Technical Specifications</h2>
          <div className="ok-details-specs-card">
            <div className="ok-details-specs-grid">
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">Year</span>
                <span className="ok-details-spec-val">{vehicle.year}</span>
              </div>
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">body type</span>
                <span className="ok-details-spec-val">{vehicle.condition}</span>
              </div>
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">Exterior Color</span>
                <span className="ok-details-spec-val">
                  {vehicle.exteriorColor}
                </span>
              </div>
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">Interior Color</span>
                <span className="ok-details-spec-val">
                  {vehicle.interiorColor}
                </span>
              </div>
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">VIN</span>
                <span className="ok-details-spec-val">{vehicle.vin}</span>
              </div>
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">Drive train</span>

                <span className="ok-details-spec-val">{vehicle.driveType}</span>
              </div>
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">Doors / Seats</span>
                <span className="ok-details-spec-val">
                  {vehicle.doorsSeats}
                </span>
              </div>
              <div className="ok-details-spec-item">
                <span className="ok-details-spec-label">Engine Size</span>
                <span className="ok-details-spec-val">
                  {vehicle.engineCapacity}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Secure Reservation Section */}
        <div>
          <h2 className="ok-details-sec-title">Secure Reservation</h2>
          <div className="ok-details-escrow-card">
            <div className="ok-details-escrow-grid">
              <div className="ok-details-escrow-left">
                <p className="ok-details-escrow-desc">
                  Reserve this vehicle immediately using our secure ESCROW
                  system integration. Your funds are held in trust until the
                  vehicle shipment is confirmed and documentation is verified.
                </p>
                <div className="ok-details-escrow-checks">
                  <div className="ok-details-escrow-check-item">
                    <span className="ok-details-escrow-check-icon">🛡️</span>
                    <span>Funds held safely by an independent third party</span>
                  </div>
                  <div className="ok-details-escrow-check-item">
                    <span className="ok-details-escrow-check-icon">🛡️</span>
                    <span>100% money-back guarantee before export starts</span>
                  </div>
                </div>
              </div>

              <div className="ok-details-escrow-right">
                <div className="ok-details-escrow-right-title">
                  Process Overview
                </div>
                <div className="ok-details-timeline">
                  <div className="ok-details-timeline-item">
                    <div className="ok-details-timeline-num">1</div>
                    <div className="ok-details-timeline-content">
                      <h4 className="ok-details-timeline-title">
                        Initiate Escrow
                      </h4>
                      <p className="ok-details-timeline-desc">
                        Sign legal agreement and deposit funds.
                      </p>
                    </div>
                  </div>
                  <div className="ok-details-timeline-item">
                    <div className="ok-details-timeline-num">2</div>
                    <div className="ok-details-timeline-content">
                      <h4 className="ok-details-timeline-title">
                        Vehicle Preparation
                      </h4>
                      <p className="ok-details-timeline-desc">
                        Documentation and vehicle inspection in Lagos.
                      </p>
                    </div>
                  </div>
                  <div className="ok-details-timeline-item">
                    <div className="ok-details-timeline-num">3</div>
                    <div className="ok-details-timeline-content">
                      <h4 className="ok-details-timeline-title">
                        Export & Release
                      </h4>
                      <p className="ok-details-timeline-desc">
                        We export the vehicle; funds release to sellers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
