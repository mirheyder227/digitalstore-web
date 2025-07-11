import { instance } from "./index";

/**
 * Kitabları axtarış sorğusuna əsasən çəkir.
 * @param {string} query - Axtarış sözü.
 * @returns {Promise<Array>} - Tapılan kitabların massivi.
 * @throws {Error} - API çağırışı zamanı xəta baş verərsə.
 */
export const searchBooks = async (query) => {
  try {
    const response = await instance.get(
      `/books/search?q=${encodeURIComponent(query)}`
    );

    if (!response.data) {
      throw new Error("Serverdən axtarış nəticəsi alınmadı.");
    }
    return response.data;
  } catch (error) {
    console.error("Kitablar axtarılarkən xəta:", error);
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
