import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
});

// Interceptor to add JWT token to requests
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
    console.error('Error parsing adminInfo from localStorage:', error);
  }
  return req;
});

export default API;
