
// api/product.js
import { instance } from "./index";

export const getAllProducts = async () => {
  try {
    const response = await instance.get("/products");
    if (!response.data) {
      throw new Error("No data received from the server.");
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      throw new Error("Could not connect to server. Network error.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const getSingleProduct = async (productId) => {
  try {
    const response = await instance.get(`/products/${productId}`);
    if (!response.data) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      throw new Error("Could not connect to server. Network error.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await instance.post("/products", productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await instance.put(`/products/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await instance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await instance.get(
      `/products/search?q=${encodeURIComponent(query)}`
    );

    if (!response.data) {
      throw new Error("No search results received from the server.");
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw (
        error.response.data?.message ||
        `Server error: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error("Could not connect to server. Network error.");
    } else {
      throw new Error(error.message);
    }
  }
};
