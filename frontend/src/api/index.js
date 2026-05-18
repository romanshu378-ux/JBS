import axios from 'axios';

const API = axios.create({
  baseURL: 'https://jbs-pazg.onrender.com/api',
});

export default API;