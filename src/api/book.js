// api/book.js
import { instance } from "./index";

/**
 * Kitabları axtarır.
 * @param {string} query - Axtarış sorğusu.
 * @returns {Promise<Array>} - Axtarış nəticələrini qaytaran promise.
 */
export const searchBooks = async (query) => {
  try {
    // API son nöqtəsinə axtarış sorğusu göndərir
    // Note: Your backend book routes didn't explicitly show a '/books/search' endpoint,
    // but rather a regex search on the main /books route. If your backend
    // `getSearchResults` for books is exposed at `/books/search`, this is fine.
    // If not, you might need to adjust the backend route or this frontend call.
    const response = await instance.get(
      `/books/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server cavab xətası:", error.response.data);
      console.error("Status kodu:", error.response.status);
      throw new Error(
        error.response.data?.message ||
        `Axtarış zamanı server xətası baş verdi: ${error.response.status}`
      );
    } else if (error.request) {
      console.error("Şəbəkə xətası: Serverə cavab gəlmədi.", error.request);
      throw new Error("Serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      console.error("Sorğu xətası:", error.message);
      throw new Error(`Axtarış sorğusunda xəta: ${error.message}`);
    }
  }
};