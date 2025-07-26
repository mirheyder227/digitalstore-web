// src/api/index.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page. Adjust this based on your frontend routing library (e.g., React Router)
      // For a simple redirect:
      window.location.href = '/login'; // Or whatever your login route is
      // If using React Router v6:
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate(); // This would be called in a component, not here directly
      // So, for an interceptor, a plain window.location.href is often used as a fallback,
      // or you can dispatch a Redux action that triggers the redirect.
    }
    return Promise.reject(error);
  }
);
