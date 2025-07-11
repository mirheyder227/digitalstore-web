import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return { token, user };
  } catch (error) {
    if (error.response) {
      throw error.response.data?.error?.message || error.message;
    } else {
      throw error.message;
    }
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    if (!token) {
      throw new Error("Serverdən token gəlmədi.");
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  } catch (error) {
    if (error.response) {
      throw error.response.data?.error?.message || error.message;
    } else {
      throw error.message;
    }
  }
};

export const apiLogout = async () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true, message: "Çıxış uğurla edildi." };
  } catch (error) {
    throw error.message || "Çıxış zamanı xəta baş verdi.";
  }
};
