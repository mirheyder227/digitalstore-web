// api/product.js
import { instance } from "./index";

/**
 * Fetches all products from the server.
 * @returns {Promise<Array>} - An array of all products.
 * @throws {Error} - If an error occurs during the API call.
 */
export const getAllProducts = async () => {
    try {
        const response = await instance.get("/products");
        if (!response.data) {
            throw new Error("No data received from the server.");
        }
        return response.data;
    } catch (error) {
        console.error("Error loading products:", error);
        if (error.response) {
            throw error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
            throw new Error("Could not connect to server. Network error.");
        } else {
            throw new Error(error.message);
        }
    }
};

/**
 * Fetches a single product by its ID from the server.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<Object>} - The single product data.
 * @throws {Error} - If an error occurs during the API call.
 */
export const getSingleProduct = async (productId) => {
    try {
        const response = await instance.get(`/products/${productId}`);
        if (!response.data) {
            throw new Error(`Product with ID ${productId} not found.`);
        }
        return response.data;
    } catch (error) {
        console.error(`Error loading product with ID ${productId}:`, error);
        if (error.response) {
            throw error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
            throw new Error("Could not connect to server. Network error.");
        } else {
            throw new Error(error.message);
        }
    }
};


/**
 * Adds a new product to the server.
 * @param {FormData} productData - FormData object containing product details including image.
 * @returns {Promise<Object>} - The added product data.
 * @throws {Error} - If an error occurs during the API call.
 */
export const addProduct = async (productData) => {
    try {
        const response = await instance.post("/products", productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error.response?.data?.message || error.message;
    }
};

/**
 * Updates an existing product on the server.
 * @param {string} productId - The ID of the product to update.
 * @param {FormData} productData - FormData object containing updated product details including image.
 * @returns {Promise<Object>} - The updated product data.
 * @throws {Error} - If an error occurs during the API call.
 */
export const updateProduct = async (productId, productData) => {
    try {
        const response = await instance.put(`/products/${productId}`, productData, {
            headers: { 'Content-Type': 'multipart/form-Type' }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error.response?.data?.message || error.message;
    }
};

/**
 * Deletes a product from the server.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<Object>} - Confirmation message.
 * @throws {Error} - If an error occurs during the API call.
 */
export const deleteProduct = async (productId) => {
    try {
        const response = await instance.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error.response?.data?.message || error.message;
    }
};

/**
 * Fetches products based on a search query.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} - An array of found products.
 * @throws {Error} - If an error occurs during the API call.
 */
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
        console.error("Error searching for products:", error);
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