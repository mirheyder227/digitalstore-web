// src/api/product.js
import { instance } from "./index";

/**
 * Bütün məhsulları çəkir.
 */
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

/**
 * Tək bir məhsulu ID-sinə görə çəkir.
 */
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

/**
 * Yeni məhsul əlavə edir.
 * FormData obyektində şəkil adı `image` olmalıdır.
 */
export const addProduct = async (productData) => {
  try {
    const response = await instance.post("/products", productData, {
      headers: { 'Content-Type': 'multipart/form-data' } // optional, axios özü əlavə edir
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

/**
 * Mövcud məhsulu yeniləyir.
 * FormData obyektində şəkil adı `image` olmalıdır.
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await instance.put(`/products/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' } // optional
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

/**
 * Məhsulu silir.
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await instance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

/**
 * Məhsulları axtarış sorğusuna əsasən çəkir.
 */
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
