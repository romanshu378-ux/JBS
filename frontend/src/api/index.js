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
 * Handles null, absolute URLs, Windows backslashes, and missing leading slash.
 *
 * @param {string|null} imagePath - e.g. "/uploads/foo.jpg" or "uploads\\foo.jpg"
 * @param {string} [fallback=''] - fallback URL when imagePath is empty
 * @returns {string}
 */
export const getImageUrl = (imagePath, fallback = '') => {
  if (!imagePath) return fallback;

  // Already a full URL (e.g. https://...) — return as-is
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  // Normalise Windows backslashes to forward slashes
  const normalised = imagePath.replace(/\\/g, '/');

  // Ensure leading slash
  const withSlash = normalised.startsWith('/') ? normalised : `/${normalised}`;

  return `${BASE_URL}${withSlash}`;
};

// ─── In-Memory API Cache ──────────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map(); // key: url, value: { data, expiresAt }

/**
 * Cached GET request. Returns cached response when available and fresh.
 *
 * @param {string} url - API endpoint (e.g. '/services')
 * @param {object} [config] - optional axios config
 * @returns {Promise<{ data: any }>}
 */
export const cachedGet = async (url, config = {}) => {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && now < cached.expiresAt) {
    return cached.response;
  }

  const response = await API.get(url, config);
  cache.set(url, { response, expiresAt: now + CACHE_TTL_MS });
  return response;
};

/**
 * Manually invalidate a cached entry (call after mutations).
 * @param {string} url
 */
export const invalidateCache = (url) => cache.delete(url);

export default API;