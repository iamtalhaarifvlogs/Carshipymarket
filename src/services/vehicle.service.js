/**
 * @file vehicle.service.js
 * @description Service for managing vehicle-related API operations.
 * Handles fetching vehicle lists, featured lists, liked status toggling, detailed specifications,
 * better deal listings, port shipping quotes, shipping cost breakdowns, and reservations.
 */

import api from "./axios";

/**
 * Fetch a list of vehicles based on filter parameter options (search, pagination, make/model, etc.).
 * @param {Object} params - Query filters { limit, page, search, price_min, price_max, make, model, year, mileage_min, mileage_max, sortOrder, addedBy }
 * @returns {Promise<Object>} Axios API response with vehicles array and pagination metadata.
 */
export const getVehicles = async (params) => {
  try {
    const response = await api.get("/vehicles", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a list of featured/highlighted vehicles.
 * @param {Object} params - Query filters & sorting parameter options.
 * @returns {Promise<Object>} Axios API response with featured vehicles data.
 */
export const getFeaturedVehicles = async (params) => {
  try {
    const response = await api.get("/vehicles/featured", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve the list of vehicles liked/saved by the currently authenticated user.
 * @param {Object} params - Query filters (e.g. limit, page).
 * @returns {Promise<Object>} Axios API response containing liked vehicles list.
 */
export const getLikedVehicles = async (params) => {
  try {
    const response = await api.get("/vehicles/liked", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle the like status of a vehicle (adds to or removes from user saved list).
 * @param {String|Number} vehicleId - Unique identifier of the vehicle.
 * @returns {Promise<Object>} Axios API response confirming liked toggle status.
 */
export const toggleLikeVehicle = async (vehicleId) => {
  try {
    const response = await api.post(`/vehicles/${vehicleId}/like`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve full specifications, location, details, and dealer info for a single vehicle.
 * @param {String|Number} vehicleId - Unique identifier of the vehicle.
 * @returns {Promise<Object>} Axios API response containing vehicle specs.
 */
export const getVehicleById = async (vehicleId) => {
  try {
    const response = await api.get(`/vehicles/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch comparable auction deals/vehicles starting from a given vehicle baseline reference.
 * @param {String|Number} vehicleId - Baseline reference vehicle ID.
 * @param {Object} params - Query parameters.
 * @returns {Promise<Object>} Axios API response listing better deals.
 */
export const getBetterDealsForVehicle = async (vehicleId, params) => {
  try {
    const response = await api.get(`/vehicles/better/deals/${vehicleId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch unique makes, models, and years available across inventory to populate search filters.
 * @param {Object} params - Optional filters (e.g. filter by selected make to retrieve only matching models).
 * @returns {Promise<Object>} Axios API response with filter values lists.
 */
export const getVehicleFilters = async (params) => {
  try {
    const response = await api.get("/vehicles/filters", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve custom port-to-port or city shipping rates configured by the administrator.
 * @param {Object} params - Parameters (e.g. destination state).
 * @returns {Promise<Object>} Axios API response listing shipping rates.
 */
export const getShippingRates = async (params) => {
  try {
    const response = await api.get("/users/admin/shipping-rates", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve the detailed shipping costs breakdown (clearance, freight, taxes) for a vehicle to a destination.
 * @param {Object} params - Cost estimation filters { price, state, id }
 * @returns {Promise<Object>} Axios API response containing line item breakdown.
 */
export const getShippingCostBreakdown = async (params) => {
  try {
    const response = await api.get("/users/shipping-cost-breakdown", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reservationsVehicle = async (params) => {
  try {
    const response = await api.post("/reservations", params);

    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const getMyReservations = async (params) => {
  try {
    const response = await api.get("/reservations/my", { params });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a lead inquiry for a vehicle.
 * @param {Object} payload - Inquiry payload { country, preferredLanguage, vehicleId, inquiryType, shippingEstimate, totalExportPrice, leadSource, timezone }
 * @returns {Promise<Object>} Axios API response
 */
export const createInquiry = async (payload) => {
  try {
    const response = await api.post("/inquiries", payload);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

