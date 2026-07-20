import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'https://jbs-pazg.onrender.com';

/**
 * Returns the displayable image URL.
 * - Cloudinary / full https:// URLs  → returned as-is
 * - Legacy /uploads/... paths        → return fallback (file no longer exists on Render)
 * - null / empty                     → return fallback
 */
export const getImageUrl = (imagePath, fallback = '') => {
  if (!imagePath) return fallback;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  const p = imagePath.replace(/\\/g, '/');
  // Legacy Render local-storage path — file is gone, never try to load it
  if (p.startsWith('/uploads/') || p.startsWith('uploads/')) return fallback;
  const withSlash = p.startsWith('/') ? p : `/${p}`;
  return `${BASE_URL}${withSlash}`;
};

/**
 * Returns true when the stored path is a legacy Render /uploads/ path.
 * Admin pages use this to display a “Please re-upload” warning.
 */
export const isLegacyUpload = (imagePath) => {
  if (!imagePath) return false;
  const p = imagePath.replace(/\\/g, '/');
  return p.startsWith('/uploads/') || p.startsWith('uploads/');
};

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Interceptor to add JWT token
API.interceptors.request.use((req) => {
  try {
    const adminInfoStr = localStorage.getItem('adminInfo');

    if (adminInfoStr) {
      const adminInfo = JSON.parse(adminInfoStr);

      if (adminInfo && adminInfo.token) {
        req.headers.Authorization = `Bearer ${adminInfo.token}`;
      }
    }

  } catch (error) {
    console.error('Error parsing adminInfo:', error);
  }

  return req;
});
// Response interceptor to handle expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;