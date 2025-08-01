// src/api/product.js
import { instance } from "./index";

export const getAllProducts = async () => {
  try {
    const response = await instance.get("/products");
    if (!response.data) {
      throw new Error("Serverdən məlumat alınmadı.");
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || `Server xətası: ${error.response.status}`;
    } else if (error.request) {
      throw new Error("Serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const getSingleProduct = async (productId) => {
  try {
    const response = await instance.get(`/products/${productId}`);
    if (!response.data) {
      throw new Error(`ID-si ${productId} olan məhsul tapılmadı.`);
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || `Server xətası: ${error.response.status}`;
    } else if (error.request) {
      throw new Error("Serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      throw new Error(error.message);
    }
  }
};

// Update these functions in product.js
export const addProduct = async (formData) => {
  try {
    const response = await instance.post("/products", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateProduct = async (productId, formData) => {
  try {
    const response = await instance.put(`/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
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
    const response = await instance.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data?.message || `Server xətası: ${error.response.status}`;
    } else if (error.request) {
      throw new Error("Serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      throw new Error(error.message);
    }
  }
};