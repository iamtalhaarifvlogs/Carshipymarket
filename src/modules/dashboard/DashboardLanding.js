"use client";

/**
 * @file DashboardLanding.js
 * @description Main dashboard landing page component.
 * Implements vehicle search filters, paginated vehicle lists, sorting,
 * featured vehicle carousels, and URL sync mechanisms.
 */

import Link from "next/link";
import Image from "next/image";
import React from "react";
import betterDealLanding from "@/assets/images/betterDealLanding.svg";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { Sparkles, Heart, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import VehicleCarousel from "@/modules/home/components/VehicleCarousel";
import {
  getVehicles,
  toggleLikeVehicle,
  getFeaturedVehicles,
  getBetterDealsForVehicle,
  getVehicleFilters,
} from "@/services/vehicle.service";
import { getVehicleImage, getImageUrl } from "@/utils/image";
import CarCard from "@/components/CarCard";

/**
 * DashboardLanding page component.
 * Displays vehicle inventory, handle filters, search parameters sync with URL, and pagination.
 */
// Main dashboard landing component rendering search filters, carousels, and product catalog
export default function DashboardLanding() {
  // Redux authentication state selectors
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Custom navigation flag controls
  const isBetterDealPage = pathname === "/better-deal";
  const isExport = searchParams?.get("export") === "true";
  const vehicleId = searchParams?.get("id");
  const [restoringAuth, setRestoringAuth] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Checks token verification and redirects unauthenticated users to login
  useEffect(() => {
    setHasMounted(true);
    const savedToken = localStorage.getItem("token");
    if (!savedToken && !token) {
      router.push("/login");
    } else {
      setRestoringAuth(false);
    }
  }, [token, router]);

  // Selected filter states
  const [filters, setFilters] = useState({
    search: "",
    price: "",
    year: "",
    mileage: "",
    make: "",
    model: "",
  });

  // Unique filter values fetched from the API
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    models: [],
    years: []
  });

  // Local state for debounced search inputs
  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Vehicle inventory datasets state
  const [vehicles, setVehicles] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const isFetchingRef = useRef(false);

  // Updates parameters in URL query string to match selected filters
  const updateURLParams = useCallback((appliedFilters, pageNum) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    
    if (appliedFilters.search) params.set("search", appliedFilters.search);
    else params.delete("search");
    
    if (appliedFilters.make) params.set("make", appliedFilters.make);
    else params.delete("make");
    
    if (appliedFilters.model) params.set("model", appliedFilters.model);
    else params.delete("model");
    
    if (appliedFilters.price) params.set("price", appliedFilters.price);
    else params.delete("price");
    
    if (appliedFilters.year) params.set("year", appliedFilters.year);
    else params.delete("year");
    
    if (appliedFilters.mileage) params.set("mileage", appliedFilters.mileage);
    else params.delete("mileage");
    
    if (pageNum && pageNum > 1) {
      params.set("page", pageNum.toString());
    } else {
      params.delete("page");
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]);

  /**
   * Sort Dropdown selector JSX component.
   */
  // Renders the selector dropdown JSX for sorting vehicle matches
  const renderSortDropdown = () => (
    <div className="position-relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="ok-home-filter"
        style={{
          height: "40px",
          borderRadius: "20px",
          fontSize: "13px",
          padding: "0 36px 0 16px",
          backgroundPosition: "right 12px center",
          backgroundSize: "12px",
          minWidth: "150px"
        }}
      >
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );

  // Queries standard API inventory page matching selected dashboard parameters
  const fetchVehicles = useCallback(async (appliedFilters = {}, pageNum = 1) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const params = {
        limit: 20,
        page: pageNum,
        addedBy: "marketCheck",
      };

      if (sortBy) {
        params.sortOrder = sortBy;
      }

      if (appliedFilters.search) params.make = appliedFilters.search;

      if (appliedFilters.price) {
        if (appliedFilters.price.includes("+")) {
          params.price_min = appliedFilters.price.replace("+", "");
        } else {
          const [min, max] = appliedFilters.price.split("-");
          if (min) params.price_min = min;
          if (max) params.price_max = max;
        }
      }

      if (appliedFilters.year) params.year = appliedFilters.year;

      if (appliedFilters.mileage) {
        if (appliedFilters.mileage.includes("+")) {
          params.mileage_min = appliedFilters.mileage.replace("+", "");
        } else {
          const [min, max] = appliedFilters.mileage.split("-");
          if (min) params.mileage_min = min;
          if (max) params.mileage_max = max;
        }
      }

      if (appliedFilters.make) params.make = appliedFilters.make;
      if (appliedFilters.model) params.model = appliedFilters.model;

      let response;
      if (isExport && vehicleId) {
        response = await getBetterDealsForVehicle(vehicleId, params);
      } else {
        response = await getVehicles(params);
      }

      let fetchedData = response?.data?.vehicles || [];
      if (!Array.isArray(fetchedData)) fetchedData = [];

      setVehicles(fetchedData);

      // Handle Pagination Calculations
      const total =
        response?.data?.pagination?.total ||
        response?.data?.pagination?.totalItems ||
        0;
      const calculatedPages =
        response?.data?.pagination?.totalPages ||
        (total
          ? Math.ceil(total / 20)
          : fetchedData.length === 20
            ? pageNum + 1
            : pageNum);
      setTotalPages(calculatedPages);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [isExport, vehicleId, sortBy]);

  // Queries featured vehicles dataset mapping active page parameters
  const fetchFeaturedVehicles = useCallback(async (appliedFilters = {}) => {
    setLoadingFeatured(true);
    try {
      const params = {
        page: 1,
        limit: 50,
      };

      if (sortBy) {
        params.sortOrder = sortBy;
      }

      if (appliedFilters.search) params.make = appliedFilters.search;

      if (appliedFilters.price) {
        if (appliedFilters.price.includes("+")) {
          params.price_min = appliedFilters.price.replace("+", "");
        } else {
          const [min, max] = appliedFilters.price.split("-");
          if (min) params.price_min = min;
          if (max) params.price_max = max;
        }
      }

      if (appliedFilters.year) params.year = appliedFilters.year;

      if (appliedFilters.mileage) {
        if (appliedFilters.mileage.includes("+")) {
          params.mileage_min = appliedFilters.mileage.replace("+", "");
        } else {
          const [min, max] = appliedFilters.mileage.split("-");
          if (min) params.mileage_min = min;
          if (max) params.mileage_max = max;
        }
      }

      if (appliedFilters.make) params.make = appliedFilters.make;
      if (appliedFilters.model) params.model = appliedFilters.model;

      const response = await getFeaturedVehicles(params);
      let fetchedData = response?.data?.vehicles || [];
      if (!Array.isArray(fetchedData)) fetchedData = [];
      setFeaturedVehicles(fetchedData);
    } catch (err) {
      console.error("Error fetching featured vehicles:", err);
    } finally {
      setLoadingFeatured(false);
    }
  }, [sortBy]);

  // Syncs initial page parameters from URL search queries on mount
  useEffect(() => {
    if (!restoringAuth) {
      let activeFilters = {
        search: "",
        price: "",
        year: "",
        mileage: "",
        make: "",
        model: "",
      };
      let initPage = 1;
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        const querySearch = searchParams.get("search") || "";
        const queryMake = searchParams.get("make") || searchParams.get("makeModel") || "";
        const queryModel = searchParams.get("model") || "";
        const queryPrice = searchParams.get("price") || "";
        const queryYear = searchParams.get("year") || "";
        const queryMileage = searchParams.get("mileage") || "";
        const queryPage = searchParams.get("page");

        if (queryPage) {
          const parsedPage = parseInt(queryPage, 10);
          if (!isNaN(parsedPage) && parsedPage > 0) {
            initPage = parsedPage;
          }
        }

        if (
          querySearch ||
          queryMake ||
          queryModel ||
          queryPrice ||
          queryYear ||
          queryMileage
        ) {
          activeFilters = {
            search: querySearch,
            make: queryMake,
            model: queryModel,
            price: queryPrice,
            year: queryYear,
            mileage: queryMileage,
          };
          setFilters(activeFilters);
          setLocalSearch(querySearch);
        }
      }
      setCurrentPage(initPage);
      if (isBetterDealPage && !isExport) {
        fetchFeaturedVehicles(activeFilters);
      } else {
        fetchVehicles(activeFilters, initPage);
        fetchFeaturedVehicles(activeFilters);
      }

      const fetchFilters = async () => {
        try {
          const response = await getVehicleFilters();
          if (response && response.data) {
            setFilterOptions({
              makes: response.data.makes || [],
              models: response.data.models || [],
              years: response.data.years || []
            });
          }
        } catch (error) {
          console.error("Error fetching vehicle filters:", error);
        }
      };
      fetchFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoringAuth, isExport, vehicleId, isBetterDealPage]);

  const isFirstRender = useRef(true);

  // Syncs models select dropdown items based on the active manufacturer choice
  useEffect(() => {
    const isFirst = isFirstRender.current;
    if (isFirst) {
      isFirstRender.current = false;
      if (!filters.make) {
        return;
      }
    }
    const fetchFilteredModels = async () => {
      try {
        const response = await getVehicleFilters({ make: filters.make });
        if (response && response.data) {
          setFilterOptions((prev) => ({
            ...prev,
            models: response.data.models || [],
          }));
        }
      } catch (error) {
        console.error("Error fetching filtered models:", error);
      }
    };
    fetchFilteredModels();
    if (!isFirst) {
      setFilters((prev) => ({ ...prev, model: "" }));
    }
  }, [filters.make]);

  // Triggers updates to vehicle matches when sorting options change
  useEffect(() => {
    if (!isFirstRender.current && !restoringAuth) {
      setCurrentPage(1);
      updateURLParams(filters, 1);
      if (isBetterDealPage && !isExport) {
        fetchFeaturedVehicles(filters);
      } else {
        fetchVehicles(filters, 1);
        fetchFeaturedVehicles(filters);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, updateURLParams]);

  // Debounces keystroke search changes before executing backend inventory search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        const updatedFilters = { ...filters, search: localSearch };
        setFilters(updatedFilters);
        setCurrentPage(1);
        updateURLParams(updatedFilters, 1);
        if (isBetterDealPage && !isExport) {
          fetchFeaturedVehicles(updatedFilters);
        } else {
          fetchVehicles(updatedFilters, 1);
          fetchFeaturedVehicles(updatedFilters);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch, updateURLParams]);

  // Updates local component state fields for dropdown filter modifications
  const handleChange = (e) => {
    if (e.target.name === "search") {
      setLocalSearch(e.target.value);
    } else {
      setFilters({ ...filters, [e.target.name]: e.target.value });
    }
  };

  // Triggers active search query application on click event
  const handleApplyFilters = () => {
    const updatedFilters = { ...filters, search: localSearch };
    setFilters(updatedFilters);
    setCurrentPage(1);
    updateURLParams(updatedFilters, 1);
    if (isBetterDealPage && !isExport) {
      fetchFeaturedVehicles(updatedFilters);
    } else {
      fetchVehicles(updatedFilters, 1);
      fetchFeaturedVehicles(updatedFilters);
    }
  };

  // Clears active query terms and resets page count back to one
  const handleClearFilters = () => {
    const cleared = {
      search: "",
      price: "",
      year: "",
      mileage: "",
      make: "",
      model: "",
    };
    setLocalSearch("");
    setFilters(cleared);
    setCurrentPage(1);
    updateURLParams(cleared, 1);
    setSortBy("");
    if (sortBy === "") {
      if (isBetterDealPage && !isExport) {
        fetchFeaturedVehicles(cleared);
      } else {
        fetchVehicles(cleared, 1);
        fetchFeaturedVehicles(cleared);
      }
    }
  };

  // Handles moving pages, scroll placement updates, and calls active dataset queries
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    updateURLParams(filters, newPage);
    fetchVehicles(filters, newPage);

    // Smooth scroll back to inventory header
    const section = document.querySelector(".ok-home-section--curated");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculates array of page numbers showing ellipsis dividers if range is large
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

  const formattedVehicles = vehicles.map((v, i) => {
    const city = v.specs?.dealer?.city || "";
    const stateVal = v.specs?.dealer?.state || "";
    const countryVal = v.specs?.dealer?.country || "";
    const dealerLocation = [city, stateVal, countryVal].filter(Boolean).join(", ");
    const customLocation = v.specs?.custom?.location || "";

    const rawImage = getVehicleImage(v);
    const resolvedImage = getImageUrl(rawImage) || "/images/broken-image.svg";

    return {
      id: v.id || `api-${i}`,
      badge: v.status === "available" ? "Available" : v.status || "Fresh Stock",
      title:
        `${v.specs?.heading || ""}`.trim(),
      location: dealerLocation || customLocation || "-----",
      price: (v.price && Number(v.price) > 0)
        ? `$${Number(v.price).toLocaleString()}`
        : "Contact for Price",
      label: v.transmission || "N/A",
      mileage: v.mileage ?? v.specs?.miles ?? null,
      image: resolvedImage,
      is_featured: v.is_featured,
      isLiked: !!v.is_liked || !!v.isLiked || !!v.liked,
    };
  });

  const displayCars = vehicles.length > 0 ? formattedVehicles : [];

  const formattedFeaturedVehicles = featuredVehicles.map((v, i) => {
    const city = v?.dealer_city|| "";
    const stateVal = v?.dealer_state || "";
    const countryVal = v?.dealer_country || "";
    const dealerLocation = [city, stateVal, countryVal].filter(Boolean).join(", ");
    const customLocation = v.specs?.custom?.location || "";
    const rawImage = getVehicleImage(v);
    const resolvedImage = getImageUrl(rawImage) || "/images/broken-image.svg";

    return {
      id: v.id || `featured-${i}`,
      badge: v?.status === "available" ? "Available" : v.status || "Featured",
      title:
        `${v.year || ""} ${v.make?.name || ""} ${v.model?.name || ""}`.trim(),
      location: dealerLocation || customLocation || "-----",
      price: (v.price && Number(v.price) > 0)
        ? `$${Number(v.price).toLocaleString()}`
        : "Contact for Price",
      label: v.transmission || "N/A",
      mileage: v.mileage ?? v.specs?.miles ?? null,
      image: resolvedImage,
      isLiked: !!v.is_liked || !!v.isLiked || !!v.liked,
    };
  });

  if (!hasMounted || (restoringAuth && !token)) {
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

  const hasActiveFilters = !!(
    filters.search ||
    filters.price ||
    filters.year ||
    filters.mileage ||
    filters.make ||
    filters.model
  );

  const showFilterBand = loading || vehicles.length > 0 || hasActiveFilters;

  // Routes the user page navigation back to main dashboard
  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="ok-home-page" style={{ paddingTop: "100px" }}>
      {isBetterDealPage && (
        <div className="container-dashboard mb-3">
          <button
            onClick={handleBack}
            className="ok-home-btn ok-home-btn--ghost ok-home-btn--sm d-inline-flex align-items-center gap-2 text-decoration-none"
            style={{ width: "fit-content" }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      )}
      {/* FILTER BAND */}
        <section className="ok-home-search-band">
          <div className="container-dashboard">
            <div className="ok-home-search-wrap">
              <div className="ok-home-search">
                {/* Search Input */}
                <div className="ok-home-search__input">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ok-home-search__icon"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  name="search"
                  value={localSearch}
                  onChange={handleChange}
                  placeholder="Search make and model..."
                />
              </div>

              {/* Price Range */}
              <select
                name="price"
                value={filters.price}
                onChange={handleChange}
                className="ok-home-filter"
              >
                <option value="">Price Range</option>
                <option value="0-5000">Under $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-20000">$10,000 - $20,000</option>
                <option value="20000-30000">$20,000 - $30,000</option>
                <option value="30000-50000">$30,000 - $50,000</option>
                <option value="50000-100000">$50,000 - $100,000</option>
                <option value="100000+">$100,000+</option>
              </select>

              {/* Year */}
              <select
                name="year"
                value={filters.year}
                onChange={handleChange}
                className="ok-home-filter"
              >
                <option value="">Year</option>
                {filterOptions.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Mileage */}
              <select
                name="mileage"
                value={filters.mileage}
                onChange={handleChange}
                className="ok-home-filter"
              >
                <option value="">Mileage</option>
                <option value="0-5000">0 - 5,000 miles</option>
                <option value="5000-10000">5,000 - 10,000 miles</option>
                <option value="10000-30000">10,000 - 30,000 miles</option>
                <option value="30000-50000">30,000 - 50,000 miles</option>
                <option value="50000-80000">50,000 - 80,000 miles</option>
                <option value="80000-120000">80,000 - 120,000 miles</option>
                <option value="120000+">120,000+ miles  </option>
              </select>

              {/* Make */}
              <select
                name="make"
                value={filters.make}
                onChange={handleChange}
                className="ok-home-filter"
              >
                <option value="">Make</option>
                {filterOptions.makes.map((make) => (
                  <option key={make.id} value={make.name}>
                    {make.name}
                  </option>
                ))}
              </select>

              {/* Model */}
              <select
                name="model"
                value={filters.model}
                onChange={handleChange}
                className="ok-home-filter"
              >
                <option value="">Model</option>
                {filterOptions.models.map((model) => (
                  <option key={model.id} value={model.name}>
                    {model.name}
                  </option>
                ))}
              </select>

              {/* Action Buttons */}
              <div className="ok-home-search__actions">
                <button
                  type="button"
                  className="ok-home-btn ok-home-btn--apply"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="ok-home-btn ok-home-btn--secondary"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED INVENTORY WITH PAGINATION */}
      <section className="ok-home-section ok-home-section--curated">
        <div className="container-dashboard">
          {isBetterDealPage ? (
            isExport ? (
              <div className="ok-home-section__head flex-wrap gap-3" style={{ flexDirection: "row", alignItems: "center" }}>
                <div>
                  <h2 className="ok-home-section__eyebrow text-white m-0">Better Deals</h2>
                  <p className="m-0">Exceptional value picks ready for Nigerian ports.</p>
                </div>
                {renderSortDropdown()}
              </div>
            ) : (
              <>
                <div className="ok-home-better-deal-banner mb-5">
                  <div className="ok-home-better-deal-banner__content">
                    <h2>Find a Better Deal</h2>
                    <h3>Direct from Dealer Auctions</h3>
                    <p>
                      We search upcoming auction inventory to find you better-priced
                      vehicles than retail listings.
                    </p>
                  </div>
                  <div className="ok-home-better-deal-banner__image">
                    <Image src={betterDealLanding} alt="Find a Better Deal" />
                  </div>
                </div>
                {!loadingFeatured && formattedFeaturedVehicles.length > 0 && (
                  <div className="d-flex justify-content-end mb-4">
                    {renderSortDropdown()}
                  </div>
                )}
              </>
            )
          ) : (
            <div className="ok-home-section__head flex-wrap gap-3" style={{ flexDirection: "row", alignItems: "center" }}>
              <div>
                <h2 className="ok-home-section__eyebrow m-0">Export Ready Vehicles</h2>
                <p className="m-0">Exceptional value picks ready for Nigerian ports.</p>
              </div>
              {renderSortDropdown()}
            </div>
          )}

          {isBetterDealPage && !isExport ? (
            loadingFeatured ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : formattedFeaturedVehicles.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {formattedFeaturedVehicles.map((item) => (
                  <div key={item.id} className="col">
                    <CarCard item={item} showLikeButton singleButton={true} />
                  </div>
                ))}
              </div>
            ) : hasActiveFilters ? (
              <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
                <div className="mb-3" style={{ fontSize: "3.5rem", filter: "grayscale(1) brightness(0.8)" }}>🔍</div>
                <h3 className="fs20 mb-2" style={{ fontWeight: "600", color: "#fff" }}>No Vehicles Found</h3>
                <p className="text-white opacity-50" style={{ maxWidth: "420px", fontSize: "0.95rem" }}>
                  No vehicles match your search criteria. Try modifying or clearing your filters.
                </p>
              </div>
            ) : (
              <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
                <div className="mb-3" style={{ fontSize: "3.5rem", filter: "grayscale(1) brightness(0.8)" }}>🔍</div>
                <h3 className="fs20 mb-2" style={{ fontWeight: "600", color: "#fff" }}>No Vehicles Found</h3>
                <p className="text-white opacity-50" style={{ maxWidth: "420px", fontSize: "0.95rem" }}>
                  We couldn&apos;t find any export deals at the moment. Please check back later.
                </p>
              </div>
            )
          ) : (
            loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {displayCars.length > 0 ? (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                    {displayCars.map((item) => (
                      <div key={item.id} className="col">
                        <CarCard item={item} showLikeButton singleButton={isBetterDealPage} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
                    <div className="mb-3" style={{ fontSize: "3.5rem", filter: "grayscale(1) brightness(0.8)" }}>🔍</div>
                    <h3 className="fs20 mb-2" style={{ fontWeight: "600", color: "#fff" }}>No Vehicles Found</h3>
                    <p className="text-white opacity-50" style={{ maxWidth: "420px", fontSize: "0.95rem" }}>
                      {isBetterDealPage 
                        ? "We couldn't find any export deals at the moment. Please check back later."
                        : "No vehicles match your search criteria. Try modifying or clearing your filters."}
                    </p>
                  </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="ok-pagination-container">
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
            )
          )}

          {/* Sourcing Banner Callout */}
          {!isBetterDealPage && (
            <div className="ok-home-callout mt-5">
              <div className="ok-home-callout__content">
                <div className="ok-home-callout__icon">
                  <BiSearchAlt />
                </div>
                <div>
                  <h2>
                    <strong>Can&apos;t find the right car?</strong>
                  </h2>
                  <p>
                    We can source better vehicles at lower prices through
                    auctions.
                  </p>
                </div>
              </div>
              <Link
                href={
                  localSearch
                    ? `/better-deal?search=${encodeURIComponent(localSearch)}`
                    : "/better-deal"
                }
                className="ok-home-btn ok-home-btn--primary text-decoration-none"
              >
                Find Me A Better Deal
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* AUCTION SECTION */}
      {!isBetterDealPage && (
        <section className="ok-home-section ok-home-section--auction">
          <div className="container-dashboard">
            <div className="ok-home-better-deal-banner">
              
              <div className="ok-home-better-deal-banner__content">
                <h2>Find a Better Deal</h2>
                <h3>Direct from Dealer Auctions</h3>
                <p>
                  We search upcoming auction inventory to find you better-priced
                  vehicles than retail listings.
                </p>
              </div>
              <div className="ok-home-better-deal-banner__image">
                <Image src={betterDealLanding} alt="Find a Better Deal" />
              </div>
            </div>

            {loadingFeatured ? (
              <div className="text-center py-5">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : formattedFeaturedVehicles.length > 0 ? (
              <VehicleCarousel
                items={formattedFeaturedVehicles}
                renderItem={(item) => <CarCard item={item} blue showLikeButton singleButton />}
              />
            ) : (
              <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "200px" }}>
                <div className="mb-3" style={{ fontSize: "3rem", filter: "grayscale(1) brightness(0.8)" }}>🔍</div>
                <h3 className="fs20 mb-2" style={{ fontWeight: "600", color: "#fff" }}>No Auction Deals Found</h3>
                <p className="text-white opacity-50" style={{ maxWidth: "420px", fontSize: "0.95rem" }}>
                  We couldn&apos;t find any auction deals at the moment. Please check back later.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      {/* <Footer /> */}
    </div>
  );
}
