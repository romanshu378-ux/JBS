import axios from 'axios';

const API = axios.create({
  baseURL: 'https://jbs-pazg.onrender.com/api',
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

export default API;