// src/api/auth.js
import { instance } from "./index";

export const register = async (userData) => {
  try {
    const response = await instance.post("/auth/signup", userData);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return { token, user };
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || error.message;
    } else {
      throw error.message;
    }
  }
};

export const login = async (credentials) => {
  try {
    const response = await instance.post("/auth/login", credentials);
    const { token, user } = response.data;
    if (!token) {
      throw new Error("Serverdən token gəlmədi.");
    }
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || error.message;
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
    // This catch block is less likely to be hit since it's just local storage operations.
    // But it's good to have for completeness.
    throw error.message || "Çıxış zamanı xəta baş verdi.";
  }
};