"use client";

import Link from "next/link";
import Image from "next/image";
import heroBg from "@/assets/images/hero-bg.png";
import betterDealLanding from "@/assets/images/betterDealLanding.svg";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { MessageSquare, Sparkles } from "lucide-react";
import {
  ShieldCheck,
  Truck,
  Globe,
  BadgeDollarSign,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import VehicleCarousel from "@/modules/home/components/VehicleCarousel";
import { getFeaturedVehicles, getVehicles, getVehicleFilters } from "@/services/vehicle.service";
import { getVehicleImage, getImageUrl } from "@/utils/image";
import CarCard from "@/components/CarCard";

const exportFeatures = [
  {
    icon: ShieldCheck,
    title: "Verified Cars",
    description:
      "Every vehicle undergoes a multi-point inspection and rigorous Carfax verification before export.",
  },
  {
    icon: Truck,
    title: "Shipping Support",
    description:
      "Full logistics management from US dealership to Lagos or Tincan port with real-time tracking.",
  },
  {
    icon: Globe,
    title: "Local Expertise",
    description:
      "Nigeria-focused experts helping you navigate clearing, customs duties, and local registration..",
  },
  {
    icon: BadgeDollarSign,
    title: "Secure Payments",
    description:
      "Escrow-backed payment systems ensuring your funds are protected until milestones are met.",
  },
];


// Main landing page component rendering hero banners, vehicle search filters, carousel inventory, and stat blocks
export default function HomeLanding() {
  const { user, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const [restoringAuth, setRestoringAuth] = useState(true);

  // Checks authentication tokens to automatically forward users to the dashboard
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken || token) {
      router.push("/dashboard");
    } else {
      setRestoringAuth(false);
    }
  }, [token, router]);

  const [filters, setFilters] = useState({
    search: "",
    price: "",
    year: "",
    mileage: "",
    make: "",
    model: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    models: [],
    years: []
  });
  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Renders the sorting order selector dropdown
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

  const [vehicles, setVehicles] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);
  const lastTriggerRef = useRef(0);

  // Queries standard vehicles with page offset limits and applied criteria
  const fetchVehicles = async (appliedFilters = {}, pageNum = 1, append = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!append) setLoading(true);
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

      const response = await getVehicles(params);

      let fetchedData = response?.data?.vehicles || [];
      if (!Array.isArray(fetchedData)) fetchedData = [];

      if (fetchedData.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
     
      if (append) {
        setVehicles((prev) => {
          const existingIds = new Set(prev.map(v => v.id || v._id));
          const uniqueNewData = fetchedData.filter(v => !existingIds.has(v.id || v._id));
          return [...prev, ...uniqueNewData];
        });
      } else {
        setVehicles(fetchedData);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      if (!append) setVehicles([]);
    } finally {
      isFetchingRef.current = false;
      if (!append) setLoading(false);
    }
  };

  // Queries only featured vehicles matching active search parameters
  const fetchFeaturedVehicles = async (appliedFilters = {}) => {
    setLoadingFeatured(true);
    try {
      const params = { page: 1, limit: 50 };
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
  };

  // Queries initial vehicles lists and dynamic search categories on mounting
  useEffect(() => {
    fetchVehicles({}, 1, false);
    fetchFeaturedVehicles();

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
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFirstRender = useRef(true);

  // Queries submodels matching active manufacturers whenever make selections update
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

  // Debounces queries on typed search parameters to prevent API flooding
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        const updatedFilters = { ...filters, search: localSearch };
        setFilters(updatedFilters);
        setPage(1);
        setHasMore(true);
        fetchVehicles(updatedFilters, 1, false);
        fetchFeaturedVehicles(updatedFilters);
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // Synchronizes results listings whenever sorting selector targets update
  useEffect(() => {
    if (!isFirstRender.current) {
      setPage(1);
      setHasMore(true);
      fetchVehicles(filters, 1, false);
      fetchFeaturedVehicles(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Event handler syncing local search keywords or dropdown options
  const handleChange = (e) => {
    if (e.target.name === "search") {
      setLocalSearch(e.target.value);
    } else {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Triggers submission of active search filters
  const handleApplyFilters = () => {
    const updatedFilters = { ...filters, search: localSearch };
    setFilters(updatedFilters);
    setPage(1);
    setHasMore(true);
    fetchVehicles(updatedFilters, 1, false);
    fetchFeaturedVehicles(updatedFilters);
  };

  // Resets all filters back to default values
  const handleClearFilters = () => {
    const defaultFilters = {
      search: "",
      price: "",
      year: "",
      mileage: "",
      make: "",
      model: "",
    };
    setLocalSearch("");
    setFilters(defaultFilters);
    setPage(1);
    setHasMore(true);
    setSortBy("");
    if (sortBy === "") {
      fetchVehicles(defaultFilters, 1, false);
      fetchFeaturedVehicles(defaultFilters);
    }
  };

  // Event callback fetching next pagination block when list endpoints are approached
  const handleReachEnd = () => {
    const now = Date.now();
    if (now - lastTriggerRef.current < 2000) {
      return; // Cooldown of 2 seconds to prevent rapid trigger loops
    }
    if (!isFetchingRef.current && hasMore) {
      lastTriggerRef.current = now;
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVehicles(filters, nextPage, true);
    }
  };

  const formattedVehicles = vehicles.map((v, i) => {
    const cityName = v.specs?.dealer?.city ||v.dealer_city || "";
    const stateName = v.specs?.dealer?.state ||v.dealer_state || "";
    const countryName = v.specs?.dealer?.country ||v.dealer_country || "";
    const dealerLocation = [cityName, stateName, countryName].filter(Boolean).join(", ");
    const customLocation = v.specs?.custom?.location || "";
    
    const rawImage = getVehicleImage(v);
    const resolvedImage = getImageUrl(rawImage) || "/images/broken-image.svg";
    
    return {
      id: v.id || `api-${i}`,
      badge: v.status === "available" ? "Available" : v.status || "Fresh Stock",
      title: `${v.specs?.heading || ""}`.trim(),
      location: dealerLocation || customLocation || "-----",
      price: (v.price && Number(v.price) > 0) ? `$${Number(v.price).toLocaleString()}` : "Contact for Price",
      label: v.transmission || "N/A",
      mileage: v.mileage ?? v.specs?.miles ?? null,
      image: resolvedImage,
      is_featured: v.is_featured,
    };
  });

  const displayCars = vehicles.length > 0 ? formattedVehicles : [];
  const formattedFeaturedVehicles = featuredVehicles.map((v, i) => {
    const cityName = v.specs?.dealer?.city ||v.dealer_city || "";
    const stateName = v.specs?.dealer?.state ||v.dealer_state || "";
    const countryName = v.specs?.dealer?.country ||v.dealer_country || "";
    const dealerLocation = [cityName, stateName, countryName].filter(Boolean).join(", ");
    const customLocation = v.specs?.custom?.location || "";
    
    const rawImage = getVehicleImage(v);
    const resolvedImage = getImageUrl(rawImage) || "/images/broken-image.svg";
    
    return {
      id: v.id || `api-${i}`,
      badge: v.status === "available" ? "Available" : v.status || "Fresh Stock",
      title: `${v.year || ""} ${v.make?.name || ""} ${v.model?.name || ""}`.trim(),
      location: dealerLocation || customLocation || "-----",
      price: (v.price && Number(v.price) > 0) ? `$${Number(v.price).toLocaleString()}` : "Contact for Price",
      label: v.transmission || "N/A",
      mileage: v.mileage ?? v.specs?.miles ?? null,
      image: resolvedImage,
      is_featured: v.is_featured,
    };
  });

  const featuredCars = formattedFeaturedVehicles.filter(
    (car) => car.is_featured === true || car.is_featured === "true"
  );

  if (restoringAuth) {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (savedToken || token) {
      return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "#050913", color: "#fff" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="ok-home-page">
      {/* HERO */}
      <section className="ok-home-hero">
          <div
            className="ok-home-hero__bg"
          style={{ backgroundImage: `url(${heroBg.src})` }}
        />
        <div className="ok-home-hero__scrim" />
        <div className="ok-home-hero__glow ok-home-hero__glow--one" />
        <div className="ok-home-hero__glow ok-home-hero__glow--two" />

        <div className="container-dashboard ok-home-hero__inner">
          <div className="ok-home-hero__copy">
            <h1>
              <span className="ok-home-hero__line">
                Buy Better Cars for Less
              </span>
              <span className="ok-home-hero__line1">
                Delivered to Your Country
              </span>
            </h1>
            <p className="ok-home-subcopy">
              Verified vehicles, transparent pricing, global delivery
            </p>

            <div className="ok-home-hero__actions">
              <button
                type="button"
                className="ok-home-btn ok-home-btn--primary"
                onClick={() => {
                  const section = document.querySelector(".ok-home-section--curated");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                Browse Cars
              </button>
              <Link
                href="/shipping-quote"
                className="ok-home-btn ok-home-btn--secondary"
              >
                Get Shipping Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

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
                <option value="120000+">120,000+ miles</option>
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

              {/* Apply Button */}
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


      {/* CURATED INVENTORY */}
      <section className="ok-home-section ok-home-section--curated">
        <div className="container-dashboard">
          <div className="ok-home-section__head flex-wrap gap-3" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 className="ok-home-section__eyebrow m-0">Curated Inventory</h2>
              <p className="m-0">Exceptional value picks ready for Nigerian ports.</p>
            </div>
            {renderSortDropdown()}
          </div>

          {loading && page === 1 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : displayCars.length > 0 ? (
            <VehicleCarousel
              items={displayCars}
              renderItem={(item) => <CarCard item={item} />}
              onReachEnd={handleReachEnd}
              hasMore={hasMore}
            />
          ) : (
            <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
              <div className="mb-3" style={{ fontSize: "3.5rem", filter: "grayscale(1) brightness(0.8)" }}>🔍</div>
              <h3 className="fs20 mb-2" style={{ fontWeight: "600", color: "#fff" }}>No Vehicles Found</h3>
              <p className="text-white opacity-50" style={{ maxWidth: "420px", fontSize: "0.95rem" }}>
                No vehicles match your search criteria. Try modifying or clearing your filters.
              </p>
            </div>
          )}

          <div className="ok-home-callout">
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
            <button type="button" className="ok-home-btn ok-home-btn--primary">
              Find Me A Better Deal
            </button>
          </div>
        </div>
      </section>

      {/* AUCTION SECTION */}
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
          ) : featuredCars.length > 0 ? (
            <VehicleCarousel
              items={featuredCars}
              renderItem={(item) => <CarCard item={item} blue singleButton />}
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

          <ul className="ok-home-bullets">
            <li>Better pricing than retail listings</li>
            <li>Better condition and mileage options</li>
          </ul>
        </div>
      </section>

      {/* EXPORT DIFFERENCE */}
      <section className="ok-home-section ok-home-section--features">
        <div className="container-dashboard">
          <div className="ok-home-hero__stats-card">
            <div className="ok-home-trust-stats">
              <div className="ok-home-trust-stat">
                <strong>4.8</strong>
                <span>Customer Rating</span>
              </div>
              <div className="ok-home-trust-stat">
                <strong>10,000+</strong>
                <span>Cars Exported</span>
              </div>
              <div className="ok-home-trust-stat">
                <strong>80+</strong>
                <span>Global Locations</span>
              </div>
            </div>
          </div>
          <div className="ok-home-section__head ok-home-section__head--dark">
            <div className="mt-5">
              <h2 className="ok-home-section__eyebrow ok-home-section__eyebrow--light text-center">
                Redefining Car Exports
              </h2>
              <p className="text-center mt-2">
                We combine technical expertise with local market knowledge to
                deliver a frictionless <br />
                experience.
              </p>
            </div>
          </div>

          <div className="ok-home-feature-grid col-xl-10 mx-auto">
            {exportFeatures.map((feature) => (
              <article key={feature.title} className="ok-home-feature">
                <div className="ok-home-feature__icon">
                  <feature.icon size={30} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
