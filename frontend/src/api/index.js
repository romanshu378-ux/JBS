import axios from 'axios';

// ─── Base URL ────────────────────────────────────────────────────────────────
export const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://jbs-pazg.onrender.com';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000, // 15 s timeout
});

// ─── Image URL Helper ─────────────────────────────────────────────────────────
/**
 * Build the full, production-safe image URL from a stored path.
 *
 * Rules:
 *  1. null / empty           → fallback
 *  2. https://res.cloudinary → return as-is (new Cloudinary URL)
 *  3. http(s)://...          → return as-is (any external URL)
 *  4. /uploads/...           → LEGACY path from Render ephemeral disk
 *                              These files no longer exist. Return fallback.
 *  5. anything else          → prepend BASE_URL (should not occur)
 *
 * @param {string|null} imagePath
 * @param {string}      [fallback=''] - URL to use when the image is missing
 * @returns {string}
 */
export const getImageUrl = (imagePath, fallback = '') => {
  if (!imagePath) return fallback;

  // ── Cloudinary or any full HTTPS URL → use directly ───────────────────────
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  // ── Legacy Render local-storage path → dead link, return fallback ─────────
  const normalised = imagePath.replace(/\\/g, '/');
  if (normalised.startsWith('/uploads/') || normalised.startsWith('uploads/')) {
    return fallback;
  }

  // ── Any remaining relative path → prepend BASE_URL ────────────────────────
  const withSlash = normalised.startsWith('/') ? normalised : `/${normalised}`;
  return `${BASE_URL}${withSlash}`;
};

/**
 * Returns true when an image path is from the old Render local storage.
 * Use this in admin panels to display a re-upload warning.
 *
 * @param {string|null} imagePath
 * @returns {boolean}
 */
export const isLegacyUpload = (imagePath) => {
  if (!imagePath) return false;
  const p = imagePath.replace(/\\/g, '/');
  return p.startsWith('/uploads/') || p.startsWith('uploads/');
};

// ─── In-Memory API Cache ──────────────────────────────────────────────────────
// Routes that must NEVER be cached (always fresh from DB)
const NO_CACHE_ROUTES = new Set(['/settings']);

const CACHE_TTL_MS  = 5 * 60 * 1000; // 5 minutes for most routes
const CACHE_MAX_SIZE = 50;            // max entries before evicting oldest
const cache = new Map();              // key: url, value: { response, expiresAt }

/**
 * Cached GET request. Returns cached response when available and fresh.
 * Routes listed in NO_CACHE_ROUTES always bypass the cache.
 * Accepts an optional AbortController signal for request cancellation.
 *
 * @param {string} url    - API endpoint (e.g. '/services')
 * @param {object} config - optional axios config (e.g. { signal: controller.signal })
 * @returns {Promise<{ data: any }>}
 */
export const cachedGet = async (url, config = {}) => {
  // Settings must always be fresh — admin changes must appear immediately
  if (NO_CACHE_ROUTES.has(url)) {
    return API.get(url, config);
  }

  const now    = Date.now();
  const cached = cache.get(url);

  if (cached && now < cached.expiresAt) {
    return cached.response;
  }

  const response = await API.get(url, config);

  // Evict oldest entry if cache is at capacity
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  cache.set(url, { response, expiresAt: now + CACHE_TTL_MS });
  return response;
};

/**
 * Manually invalidate a cached entry (call after mutations).
 * @param {string} url
 */
export const invalidateCache = (url) => cache.delete(url);

/**
 * Clear the entire cache (useful after bulk updates).
 */
export const clearCache = () => cache.clear();

export default API;