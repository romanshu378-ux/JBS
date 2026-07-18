import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'https://jbs-pazg.onrender.com';

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