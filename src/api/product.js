// src/api/product.js
import { instance } from "./index";

/**
 * Bütün məhsulları çəkir.
 * @returns {Promise<Array>} - Bütün məhsulları qaytaran promise.
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
 * @param {string} productId - Məhsulun ID-si.
 * @returns {Promise<Object>} - Məhsul məlumatlarını qaytaran promise.
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
 * @param {Object} productData - Əlavə olunacaq məhsulun məlumatları (FormData formatında ola bilər).
 * @returns {Promise<Object>} - Əlavə edilmiş məhsulun məlumatlarını qaytaran promise.
 */
export const addProduct = async (productData) => {
  try {
    const response = await instance.post("/products", productData, {
      headers: { 'Content-Type': 'multipart/form-data' } // Fayl yükləmə üçün vacibdir
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

/**
 * Mövcud məhsulu yeniləyir.
 * @param {string} productId - Yenilənəcək məhsulun ID-si.
 * @param {Object} productData - Yenilənəcək məhsulun məlumatları (FormData formatında ola bilər).
 * @returns {Promise<Object>} - Yenilənmiş məhsulun məlumatlarını qaytaran promise.
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await instance.put(`/products/${productId}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' } // Fayl yükləmə üçün vacibdir
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

/**
 * Məhsulu silir.
 * @param {string} productId - Silinəcək məhsulun ID-si.
 * @returns {Promise<Object>} - Silmə əməliyyatının cavabını qaytaran promise.
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
 * @param {string} query - Axtarış sorğusu.
 * @returns {Promise<Array>} - Axtarış nəticələrini qaytaran promise.
 */
export const searchProducts = async (query) => {
  try {
    const response = await instance.get(
      `/products/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw (
        error.response.data?.message ||
        `Server xətası: ${error.response.status}`
      );
    } else if (error.request) {
      throw new Error("Serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      throw new Error(error.message);
    }
  }
};
