
// src/api/index.js
import axios from 'axios';

// VITE_API_BASE_URL `.env` faylınızdan gəlir
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Kuki və ya session id-ləri göndərmək üçün
});

// Sorğu interceptoru: Hər sorğuya token əlavə edir
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Cavab interceptoru: 401/403 xətalarında tokeni silir
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // İstifadəçini login səhifəsinə yönləndirmək üçün əlavə logika əlavə edə bilərsiniz
    }
    return Promise.reject(error);
  }
);
