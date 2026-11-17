"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import newArrivalImg from "@/assets/images/cars/new-arrival.png";
import { toggleLikeVehicle, createInquiry } from "@/services/vehicle.service";

// Component representing a vehicle card with details and actions
export default function CarCard({
  item,
  blue = false,
  showLikeButton = false,
  onLikeToggle,
  singleButton = false,
}) {
  const [imgSrc, setImgSrc] = useState(item.image || "/images/broken-image.svg");
 
  const resolvedImage = item.image || "/images/broken-image.svg"
  const [liked, setLiked] = useState(item.isLiked || false);
  const [isLiking, setIsLiking] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!showTooltip) return;
    // Closes the tooltip if the user clicks outside
    const handleOutsideClick = () => {
      setShowTooltip(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showTooltip]);

  useEffect(() => {
    setImgSrc(item.image || "/images/broken-image.svg");
  }, [item.image]);

  useEffect(() => {
    setLiked(item.isLiked || false);
  }, [item.isLiked]);

  // Handles liking/saving a vehicle and toggling its state on API
  const handleLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking) return;

    const nextLikedState = !liked;
    setLiked(nextLikedState);
    setIsLiking(true);

    try {
      await toggleLikeVehicle(item.id);
      if (onLikeToggle) {
        onLikeToggle(item.id, nextLikedState);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      // Revert state on failure
      setLiked(!nextLikedState);
    } finally {
      setIsLiking(false);
    }
  };

  // Opens WhatsApp chat to inquire about the vehicle
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open("https://wa.me/2349000000000", "_blank");
  };

  const getUserTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";
    } catch (e) {
      return "Africa/Lagos";
    }
  };

  const handleFindBetterDealClick = () => {
    const vehicleId = item.id || item._id;
    if (!vehicleId) return;

    createInquiry({
      // country: "Nigeria",
      preferredLanguage: "en",
      vehicleId: vehicleId,
      inquiryType: "better_deal",
      leadSource: "web",
      timezone: getUserTimezone(),
    }).catch((err) => {
      console.error("Failed to submit better deal inquiry:", err);
    });
  };

  const pathname = usePathname();
  const isBetterDealPage = pathname === "/better-deal" || pathname?.startsWith("/better-deal");

  const handleGetCarClick = () => {
    const vehicleId = item.id || item._id;
    if (!vehicleId) return;

    createInquiry({
      // country: "Nigeria",
      preferredLanguage: "en",
      vehicleId: vehicleId,
      // inquiryType: isBetterDealPage ? "better_deal" : "vehicle_inquiry",
      inquiryType: "vehicle_inquiry",
      leadSource: "web",
      timezone: getUserTimezone(),
    }).catch((err) => {
      console.error("Failed to submit vehicle inquiry:", err);
    });
  };

  const token = useSelector((state) => state.auth?.token) || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  const betterDealHref = token
    ? `/better-deal?export=true&id=${item.id}`
    : "/signup";

  const getCarHref = token
    ? `/cars/${item.id}`
    : "/signup";

  // Returns the appropriate CSS class based on the vehicle status badge
  const getBadgeClass = (status) => {
  switch ((status || "").toLowerCase()) {
    case "available":
      return "ok-home-badge--available";

    case "reserved":
      return "ok-home-badge--reserved";

    case "sold":
      return "ok-home-badge--sold";

    case "pending":
      return "ok-home-badge--pending";

    case "inactive":
      return "ok-home-badge--inactive";

    case "suspended":
      return "ok-home-badge--suspended";

    default:
      return blue ? "ok-home-badge--blue" : "";
  }
};

  return (
    <article className={`ok-home-card${blue ? " ok-home-card--blue" : ""}`}>
      <div className="ok-home-card__media">
        <Image
          src={imgSrc || "/images/broken-image.svg"}
          alt={item.title}
          fill
          className="ok-home-card__img"
          style={{ objectFit: "contain" }}
          onError={() => setImgSrc("/images/broken-image.svg")}
        />
        <div className="ok-home-card__badges">
          <span className={`ok-home-badge ${getBadgeClass(item.badge)}`}>
            {item.badge}
          </span>

        </div>

        {showLikeButton && (
          <button
            type="button"
            onClick={handleLikeToggle}
            className="ok-card-like-btn"
            aria-label={liked ? "Dislike vehicle" : "Like vehicle"}
            disabled={isLiking}
          >
            <Heart
              fill={liked ? "#ff3b30" : "none"}
              stroke={liked ? "#ff3b30" : "#ffffff"}
              style={{ transition: "all 0.2s ease" }}
            />
          </button>
        )}
      </div>

      <div className="ok-home-card__body">
        <div className="ok-home-card__title-row">
          <div style={{ overflow: "hidden", width: "100%" }}>
            <h3 className="text-truncate" title={item.title}>
              {item.title}
            </h3>
            <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "0.4rem", width: "100%" }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="ok-home-card__location text-truncate" title={item.location} style={{ margin: 0 }}>
                  <HiOutlineLocationMarker style={{ flexShrink: 0 }} />
                  <span className="text-truncate">{item.location}</span>
                </p>
              </div>
              {(() => {
                if (item.mileage === undefined || item.mileage === null || item.mileage === "") return null;
                const num = Number(item.mileage);
                const formatted = isNaN(num) ? item.mileage : `${num.toLocaleString()} ${(num === 0 || num === 1) ? "mile" : "miles"}`;
                return (
                  <span className="text-nowrap ms-2" style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.72)", display: "inline-block" }}>
                    {formatted}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="ok-home-card__meta ok-home-card__meta-row">
          <span className="ok-home-card__price ok-home-card__price-shrink d-inline-flex align-items-center">
            {item.price && item.price.startsWith("$") ? (
              <>
                <span className="ok-price-symbol" style={{ fontSize: "1.25em", fontWeight: "800", marginRight: "1px" }}>$</span>
                <span>{item.price.slice(1)}</span>
              </>
            ) : (
              <span
                style={{ cursor: "help" }}
                className="d-inline-flex align-items-center gap-1 ok-tooltip-container"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span>{item.price || "Contact for Price"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                {showTooltip && (
                  <span className="ok-custom-tooltip">
                    Prices may vary based on market conditions. Contact us via WhatsApp for the current price.
                  </span>
                )}
              </span>
            )}
          </span>
          <span
            className="ok-home-card__label text-truncate ok-home-card__label-flex"
            title={item.label}
          >
            {item.label}
          </span>
        </div>

        <div className="ok-home-card__actions ok-home-card__actions-col">
          {singleButton ? (
            <div className="ok-home-card__actions-row">
              <Link
                href={getCarHref}
                onClick={handleGetCarClick}
                className="ok-home-btn ok-home-btn--primary ok-home-btn--sm ok-home-btn--link ok-home-btn--centered text-decoration-none"
                style={{ width: "100%" }}
              >
                Get This Car
              </Link>
              <button
                type="button"
                className="ok-home-btn ok-home-btn--whatsapp ok-home-btn--shrink"
                aria-label="WhatsApp"
                onClick={handleWhatsAppClick}
              >
                <FaWhatsapp />
              </button>
            </div>
          ) : (
            <>
              <div className="ok-home-card__actions-row">
                <Link
                  href={betterDealHref}
                  onClick={handleFindBetterDealClick}
                  className="ok-home-btn  ok-home-btn--wide ok-home-btn--dark ok-home-btn--sm ok-home-btn--link"
                >
                  Find a Better Deal
                </Link>
                <button
                  type="button"
                  className="ok-home-btn ok-home-btn--whatsapp ok-home-btn--shrink"
                  aria-label="WhatsApp"
                  onClick={handleWhatsAppClick}
                >
                  <FaWhatsapp />
                </button>
              </div>
              <Link
                href={getCarHref}
                onClick={handleGetCarClick}
                className="ok-home-btn ok-home-btn--primary"
                style={{ width: "100%" }}
              >
                Get This Car
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
