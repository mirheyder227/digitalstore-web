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
    const response = await instance.get(
      `/books/search?q=${encodeURIComponent(query)}`
    );

    // Server boş massiv qaytarsa belə, bu xəta deyil, sadəcə nəticənin olmaması deməkdir.
    // Buna görə də, !response.data yoxlaması burada lüzumsuzdu.
    return response.data;
  } catch (error) {
    // Axios xətalarını daha detallı idarə etmək üçün:
    if (error.response) {
      // Server cavab verib, lakin status kodu 2xx deyil (məsələn, 400, 404, 500)
      console.error("Server cavab xətası:", error.response.data); // Debug üçün saxlaya bilərsiniz
      console.error("Status kodu:", error.response.status); // Debug üçün saxlaya bilərsiniz
      throw new Error(
        error.response.data?.message ||
        `Axtarış zamanı server xətası baş verdi: ${error.response.status}`
      );
    } else if (error.request) {
      // İstək edilib, lakin cavab alınmayıb (məsələn, şəbəkə kəsildi, CORS problemi)
      console.error("Şəbəkə xətası: Serverə cavab gəlmədi.", error.request); // Debug üçün saxlaya bilərsiniz
      throw new Error("Serverə qoşulmaq mümkün olmadı. Şəbəkə xətası.");
    } else {
      // İstəyin qurulmasında problem olub
      console.error("Sorğu xətası:", error.message); // Debug üçün saxlaya bilərsiniz
      throw new Error(`Axtarış sorğusunda xəta: ${error.message}`);
    }
  }
};
