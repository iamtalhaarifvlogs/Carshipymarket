/**
 * @file image.js
 * @description Image utility helper functions.
 * Contains methods to safely extract primary images from nested vehicle database schemas,
 * resolve external image urls, and handle fallback hosts derived from active environment variables.
 */

/**
 * Extract the primary or first available image URL from a vehicle data object.
 * Checks nested arrays, keys, and legacy string values to find a usable URL.
 * @param {Object} v - The vehicle data object
 * @returns {string|null} Resolved image URL or path, or null if no image was found.
 */
export const getVehicleImage = (v) => {
  if (!v) return null;
  const images = v.images;
  if (images && Array.isArray(images) && images.length > 0) {
    // 1. Try to find the primary image first
    const primaryImg = images.find(
      (img) =>
        img &&
        (img.is_primary === true)
    );

    if (primaryImg) {
      if (typeof primaryImg === "string") {
        return primaryImg;
      }
      if (typeof primaryImg === "object") {
        const url = primaryImg.url || primaryImg.path || primaryImg.link;
        if (url) return url;
      }
    }

    // 2. Fall back to the first image if no primary image is marked
    const firstImg = images[0];
    if (typeof firstImg === "string") {
      return firstImg;
    }
    if (firstImg && typeof firstImg === "object") {
      const url = firstImg.url || firstImg.path || firstImg.link;
      if (url) return url;
    }
  }
  
  // 3. Check for standalone flat keys
  if (typeof v.image === "string" && v.image.trim() !== "") {
    return v.image;
  }
  if (typeof v.main_image === "string" && v.main_image.trim() !== "") {
    return v.main_image;
  }
  if (typeof v.primary_image === "string" && v.primary_image.trim() !== "") {
    return v.primary_image;
  }
  return null;
};

/**
 * Normalize and construct a fully qualified absolute URL for a given image path.
 * Sanitizes backslashes, standardizes resolution dimensions for HomeNet images,
 * and appends the active backend API host if the image path is relative.
 * @param {string} url - Raw image path or absolute URL
 * @returns {string|null} Fully qualified URL or null if empty
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // Standardize separator slashes
  let sanitizedUrl = url.replace(/\\/g, "/");
  
  // Standardize Homenet image resolution sizes to 1024x768 for optimal performance and display
  if (sanitizedUrl.includes("content.homenetiol.com")) {
    sanitizedUrl = sanitizedUrl.replace(/\/(\d+)x(\d+)\//, "/1024x768/");
  }
  
  // Return directly if already an absolute url or base64 data
  if (
    sanitizedUrl.startsWith("http://") ||
    sanitizedUrl.startsWith("https://") ||
    sanitizedUrl.startsWith("data:")
  ) {
    return sanitizedUrl;
  }

  // Dynamic host fallback parsing from environment variable API endpoint
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let host = "https://api-ogamoto.itechnolabs.tech";
  if (apiUrl) {
    try {
      const parsed = new URL(apiUrl);
      host = parsed.origin;
    } catch (e) {
      host = apiUrl.split("/api")[0] || host;
    }
  }

  if (sanitizedUrl.startsWith("/")) {
    return `${host}${sanitizedUrl}`;
  }
  return `${host}/${sanitizedUrl}`;
};
