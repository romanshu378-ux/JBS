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

// ─── Cloudinary Delivery Optimizer ───────────────────────────────────────────
/**
 * Injects Cloudinary delivery parameters (f_auto, q_auto, w_{width}) into a
 * Cloudinary URL. Non-Cloudinary URLs (Unsplash, data URIs, local paths) are
 * returned unchanged, so it is safe to wrap every getImageUrl() call with this.
 *
 * How it works:
 *   Input:  https://res.cloudinary.com/cloud/image/upload/v123/photo.jpg
 *   Output: https://res.cloudinary.com/cloud/image/upload/f_auto,q_auto,w_800/v123/photo.jpg
 *
 * @param {string} url           - Resolved image URL (from getImageUrl)
 * @param {object} [opts]
 * @param {number} [opts.width=800]      - Target render width in CSS pixels
 * @param {string} [opts.quality='auto'] - Cloudinary q_ value
 * @returns {string}
 */
export const buildCloudinaryUrl = (url, { width = 800, quality = 'auto' } = {}) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Insert transforms immediately after /upload/ — handles versioned and plain paths.
  // String.replace (no g flag) replaces only the first match, which is always correct.
  return url.replace('/upload/', `/upload/f_auto,q_${quality},w_${width}/`);
};

// ─── In-Memory API Cache ──────────────────────────────────────────────────────
// Routes that must NEVER be cached (always fresh from DB)
// NOTE: /settings removed — public settings are safe to cache on the frontend.
const NO_CACHE_ROUTES = new Set([]);

// Per-route TTL overrides (milliseconds). Falls back to CACHE_TTL_MS.
const ROUTE_TTL_MS = {
  '/settings':     60 * 1000, //  60 s — contact info, hero text, social links
  '/services':     60 * 1000, //  60 s — service list
  '/projects':     60 * 1000, //  60 s — project gallery
  '/team':         60 * 1000, //  60 s — team members
};

const CACHE_TTL_MS  = 60 * 1000; // 60 seconds default for all cached routes
const CACHE_MAX_SIZE = 50;        // max entries before evicting oldest
const cache = new Map();          // key: url, value: { response, expiresAt }

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
  // Hard bypass for routes that must always be fresh
  if (NO_CACHE_ROUTES.has(url)) {
    return API.get(url, config);
  }

  const now    = Date.now();
  const cached = cache.get(url);

  if (cached && now < cached.expiresAt) {
    return cached.response;
  }

  const response = await API.get(url, config);

  // Resolve TTL: prefer per-route override, fall back to global default
  const ttl = ROUTE_TTL_MS[url] ?? CACHE_TTL_MS;

  // Evict oldest entry if cache is at capacity
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }

  cache.set(url, { response, expiresAt: now + ttl });
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